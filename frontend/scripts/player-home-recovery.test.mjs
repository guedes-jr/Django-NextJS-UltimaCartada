import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/player/home/page.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(getGames, { getRounds = async () => [], getCards = async () => [], createPlay = async () => ({}) } = {}) {
  const slots = [], effects = [], frames = []; let cursor = 0, writes = 0;
  const exports = {};
  vm.runInNewContext(code, { exports, requestAnimationFrame: callback => frames.push(callback), URL: { revokeObjectURL() {}, createObjectURL() { return 'preview'; } }, require(name) {
    if (name === 'react') return {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; }, useMemo(callback) { return callback(); },
      useEffect(effect, deps) { const i = cursor++, old = slots[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.cleanup?.(); slots[i] = { deps }; effects.push(() => { slots[i].cleanup = effect(); }); } },
    };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    if (name === 'axios') return { AxiosError: class extends Error {} };
    if (name === 'next/link') return { default: 'Link' };
    if (name === 'lucide-react') return { ArrowUpRight: 'ArrowUpRight', Gamepad2: 'Gamepad2', Sparkles: 'Sparkles' };
    if (name === '@/services/gameService') return { getGames };
    if (['@/services/roundService', '@/services/playService', '@/services/evidenceService'].includes(name)) return name.includes('round') ? { getRounds } : name.includes('play') ? { createPlay, getPlays: async () => [] } : { createEvidence: async () => ({}), getEvidences: async () => [] };
    if (name === '@/services/cardService') return { getCards };
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute') || name.includes('PlayerLayout') || name.includes('PlayerDailyJourney') || name.includes('PlayerFlashChallenges') || name.includes('Modal')) return Object.fromEntries([[name.includes('ProtectedRoute') ? 'ProtectedRoute' : name.includes('PlayerLayout') ? 'PlayerLayout' : name.includes('Daily') ? 'PlayerDailyJourney' : name.includes('Flash') ? 'PlayerFlashChallenges' : 'Modal', name]]);
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.default(); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, async ready() { render(); await settle(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}

test('falha inicial não mostra ausência de jogos e permite nova tentativa', async () => {
  const pending = deferred(); let calls = 0; const app = mount(() => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise);
  let tree = await app.ready(); assert.match(text(tree), /Não foi possível carregar seus jogos/); assert.doesNotMatch(text(tree), /Você ainda não tem um jogo/);
  const retry = nodes(tree, node => node.type === 'button')[0]; retry.props.onClick(); retry.props.onClick(); app.render(); tree = app.render();
  assert.equal(calls, 2); assert.equal(nodes(tree, node => node.type === 'button')[0].props['aria-disabled'], true);
  pending.resolve([]); await settle(); tree = app.render(); assert.match(text(tree), /Você ainda não tem um jogo/);
  let focused = false; nodes(tree, node => node.type === 'h1')[0].props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});

test('resposta ou falha após sair da tela não atualiza estado', async () => {
  for (const fail of [true, false]) {
    const pending = deferred(); const app = mount(() => pending.promise); app.render(); app.unmount(); const before = app.writes;
    if (fail) pending.reject(new Error('offline')); else pending.resolve([]);
    await settle(); assert.equal(app.writes, before);
  }
});

test('falha de cartas não aparece como ausência e pode ser repetida no modal', async () => {
  const cards = deferred(); const game = { id: 1, name: 'Jogo sintético', group_name: 'Grupo sintético', status: 'OPEN' };
  const round = { id: 1, game: 1, status: 'OPEN', schedule_name: 'Cartada', day_number: 1, date: '2026-11-20', starts_at: '2026-11-20T09:00:00', ends_at: '2026-11-20T10:00:00' };
  const app = mount(async () => [game], { getRounds: async () => [round], getCards: () => cards.promise });
  let tree = await app.ready(); const play = nodes(tree, node => node.type === 'button' && /Jogar carta/.test(text(node)))[0]; play.props.onClick();
  cards.reject(new Error('offline')); await settle(); tree = app.render(); assert.match(text(tree), /Não foi possível carregar as cartas disponíveis/); assert.doesNotMatch(text(tree), /Nenhuma carta disponível/);
});

test('confirmação repetida da jogada envia apenas uma requisição', async () => {
  const game = { id: 1, name: 'Jogo sintético', group_name: 'Grupo sintético', status: 'OPEN' };
  const round = { id: 1, game: 1, status: 'OPEN', schedule_name: 'Cartada', day_number: 1, date: '2026-11-20', starts_at: '2026-11-20T09:00:00', ends_at: '2026-11-20T10:00:00' };
  const pending = deferred(); let calls = 0;
  const app = mount(async () => [game], { getRounds: async () => [round], getCards: async () => [{ id: 7, title: 'Carta sintética', suit_symbol: '♠', value: 'A', instruction: 'Ação sintética' }], createPlay: () => { calls += 1; return pending.promise; } });
  let tree = await app.ready(); nodes(tree, node => node.type === 'button' && /Jogar carta/.test(text(node)))[0].props.onClick(); await settle(); tree = app.render();
  nodes(tree, node => node.type === 'button' && /Carta sintética/.test(text(node)))[0].props.onClick(); tree = app.render();
  const confirm = nodes(tree, node => node.type === 'button' && /Confirmar jogada/.test(text(node)))[0]; confirm.props.onClick(); confirm.props.onClick();
  assert.equal(calls, 1);
});

