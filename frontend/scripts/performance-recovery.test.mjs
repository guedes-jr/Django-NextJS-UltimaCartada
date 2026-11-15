import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/app/player/performance/page.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(getPlays, getEvidences = async () => []) {
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
    if (name === '@/services/playService') return { getPlays };
    if (name === '@/services/evidenceService') return { getEvidences };
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute')) return { ProtectedRoute: 'ProtectedRoute' };
    if (name.includes('PlayerLayout')) return { PlayerLayout: 'PlayerLayout' };
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.default(); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, async ready() { render(); await settle(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}

test('falha não mostra totais zerados nem ausência de jogadas', async () => {
  const app = mount(async () => { throw new Error('offline'); }); const tree = await app.ready();
  assert.match(text(tree), /Não foi possível carregar seu desempenho/); assert.doesNotMatch(text(tree), /Pontos totais|Você ainda não realizou/);
});
test('recuperação bloqueia repetição e retorna foco ao título', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(() => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise);
  let tree = await app.ready(); const retry = nodes(tree, n => n.type === 'button')[0]; retry.props.onClick(); retry.props.onClick(); app.render(); tree = app.render();
  assert.equal(calls, 2); const busy = nodes(tree, n => n.type === 'button')[0]; assert.equal(busy.props['aria-disabled'], true); assert.equal(busy.props.disabled, undefined);
  pending.resolve([]); await settle(); tree = app.render(); assert.match(text(tree), /Você ainda não realizou/);
  let focused = false; nodes(tree, n => n.type === 'h1')[0].props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});
test('consulta mantém os totais e estados existentes de evidências', async () => {
  const app = mount(async () => [{ id: 1, total_points: 40, base_points: 30, bonus_points: 10, played_at: '2026-11-14', card_title: 'Carta sintética' }], async () => [{ play: 1, status: 'APPROVED' }]);
  const tree = await app.ready(); const cards = nodes(tree, n => n.type === 'article').map(text);
  assert.match(cards[0], /40/); assert.match(cards[1], /30/); assert.match(cards[2], /10/); assert.match(cards[3], /1/); assert.match(cards[5], /1/); assert.match(text(tree), /Aprovada/);
});
test('resposta ou falha após desmontagem não atualiza estado', async () => {
  for (const fail of [true, false]) {
    const pending = deferred(); const app = mount(() => pending.promise); app.render(); app.unmount(); const before = app.writes;
    if (fail) pending.reject(new Error('offline')); else pending.resolve([]);
    await settle(); assert.equal(app.writes, before);
  }
});
