import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/app/player/ranking/page.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(getGames, getGameRanking = async () => []) {
  const slots = [], effects = [], frames = []; let cursor = 0, writes = 0;
  const exports = {};
  vm.runInNewContext(code, { exports, requestAnimationFrame: callback => frames.push(callback), require(name) {
    if (name === 'react') return {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
      useMemo(callback) { return callback(); },
      useEffect(effect, deps) { const i = cursor++, old = slots[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.cleanup?.(); slots[i] = { deps }; effects.push(() => { slots[i].cleanup = effect(); }); } },
    };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    if (name === '@/services/gameService') return { getGames };
    if (name === '@/services/scoringService') return { getGameRanking };
    if (name === '@/lib/auth') return { getAuthUser: () => ({ username: 'sintetica' }) };
    if (name === 'axios') return { AxiosError: class extends Error {} };
    if (name === 'lucide-react') return {};
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute')) return { ProtectedRoute: 'ProtectedRoute' };
    if (name.includes('PlayerLayout')) return { PlayerLayout: 'PlayerLayout' };
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.default(); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, async ready() { render(); await settle(); render(); await settle(); return render(); }, changeGame(id) { nodes(render(), n => n.type === 'select')[0].props.onChange({ target: { value: String(id) } }); render(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}

const games = [{ id: 1, name: 'Jogo A', group_name: 'Grupo A' }, { id: 2, name: 'Jogo B', group_name: 'Grupo B' }];
const button = tree => nodes(tree, n => n.type === 'button')[0];
const ranking = [{ player_id: 1, username: 'sintetica', full_name: 'Pessoa sintética', total_points: 40, total_plays: 1, approved_evidences: 1 }];

test('lista de jogos falha sem falso vazio e recupera com bloqueio e foco', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(() => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise);
  let tree = await app.ready(); assert.match(text(tree), /Não foi possível carregar o ranking/); assert.doesNotMatch(text(tree), /não possui jogos/);
  const retry = button(tree); retry.props.onClick(); retry.props.onClick(); app.render(); tree = app.render();
  assert.equal(calls, 2); assert.equal(button(tree).props['aria-disabled'], true); assert.equal(button(tree).props.disabled, undefined);
  pending.resolve([]); await settle(); tree = app.render(); assert.match(text(tree), /não possui jogos/);
  let focused = false; nodes(tree, n => n.type === 'h1')[0].props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});
test('ranking recupera no mesmo jogo, bloqueia repetição e foca seção', async () => {
  const pending = deferred(); const ids = [];
  const app = mount(async () => games, id => { ids.push(id); return ids.length === 1 ? Promise.reject(new Error('offline')) : pending.promise; });
  let tree = await app.ready(); assert.match(text(tree), /Não foi possível carregar o ranking deste jogo/); assert.doesNotMatch(text(tree), /Ainda não existem jogadas/);
  const retry = button(tree); retry.props.onClick(); retry.props.onClick(); app.render(); tree = app.render();
  assert.deepEqual(ids, [1, 1]); assert.equal(button(tree).props['aria-disabled'], true);
  pending.resolve(ranking); await settle(); tree = app.render(); assert.equal(nodes(tree, n => n.type === 'select')[0].props.value, 1); assert.match(text(tree), /40/);
  let focused = false; nodes(tree, n => n.type === 'h2' && n.props.ref)[0].props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});
test('trocar jogo durante nova tentativa ignora retorno antigo e mantém seleção atual', async () => {
  const old = deferred(); let calls = 0;
  const app = mount(async () => games, id => id === 2 ? Promise.resolve([]) : ++calls === 1 ? Promise.reject(new Error('offline')) : old.promise);
  const tree = await app.ready(); button(tree).props.onClick(); app.render(); app.changeGame(2); await settle();
  old.resolve(ranking); await settle(); const current = app.render(); assert.equal(nodes(current, n => n.type === 'select')[0].props.value, 2); assert.doesNotMatch(text(current), /Pessoa sintética/); assert.match(text(current), /Ainda não existem jogadas/);
});
test('lista de jogos e ranking não atualizam após desmontagem', async () => {
  for (const phase of ['games', 'ranking']) {
    for (const fail of [true, false]) {
      const pending = deferred();
      const app = mount(phase === 'games' ? () => pending.promise : async () => games, () => pending.promise);
      await app.ready(); app.unmount(); const before = app.writes;
      if (fail) pending.reject(new Error('offline')); else pending.resolve([]);
      await settle(); assert.equal(app.writes, before);
    }
  }
});
