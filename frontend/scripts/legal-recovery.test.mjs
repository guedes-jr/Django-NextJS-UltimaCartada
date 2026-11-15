import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/components/legal/LegalAcceptanceGate.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(getPendingLegalDocuments) {
  const slots = [], effects = [], frames = [], acceptCalls = []; let cursor = 0, writes = 0;
  const exports = {};
  vm.runInNewContext(code, { exports, requestAnimationFrame: callback => frames.push(callback), require(name) {
    if (name === 'react') return {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
      useMemo(callback) { return callback(); },
      useEffect(effect, deps) { const i = cursor++, old = slots[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.cleanup?.(); slots[i] = { deps }; effects.push(() => { slots[i].cleanup = effect(); }); } },
    };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    if (name === '@/services/legalService') return { getPendingLegalDocuments, acceptLegalDocument: async id => acceptCalls.push(id) };
    if (name === 'next/link') return { default: 'Link' };
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute')) return { ProtectedRoute: 'ProtectedRoute' };
    if (name.includes('PlayerLayout')) return { PlayerLayout: 'PlayerLayout' };
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.LegalAcceptanceGate({ children: 'Área autorizada' }); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, acceptCalls, async ready() { render(); await settle(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}

const retry = tree => nodes(tree, n => n.type === 'button')[0];
const documents = [{ id: 1, title: 'Termos sintéticos', kind: 'TERMS', version: 'teste' }];

test('falha de leitura não libera a área e não registra aceite', async () => {
  const app = mount(async () => { throw new Error('offline'); }); const tree = await app.ready();
  assert.match(text(tree), /Não foi possível verificar/); assert.doesNotMatch(text(tree), /Área autorizada/); assert.deepEqual(app.acceptCalls, []);
});
test('recuperação mantém botão focável, bloqueia repetição e apresenta documentos sem aceitar', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(() => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise);
  const button = retry(await app.ready()); button.props.onClick(); button.props.onClick(); app.render(); let tree = app.render();
  assert.equal(calls, 2); assert.equal(retry(tree).props['aria-disabled'], true); assert.equal(retry(tree).props.disabled, undefined);
  pending.resolve(documents); await settle(); tree = app.render(); assert.match(text(tree), /Termos sintéticos/); assert.doesNotMatch(text(tree), /Área autorizada/);
  assert.equal(nodes(tree, n => n.type === 'input')[0].props.checked, false); assert.deepEqual(app.acceptCalls, []);
  let focused = false; nodes(tree, n => n.type === 'h1')[0].props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});
test('consulta sem pendências libera filhos sem gravar aceite', async () => {
  const app = mount(async () => []); assert.equal(await app.ready(), 'Área autorizada'); assert.deepEqual(app.acceptCalls, []);
});
test('consulta tardia após desmontagem não altera estado', async () => {
  for (const fail of [false, true]) {
    const pending = deferred(); const app = mount(() => pending.promise); app.render(); app.unmount(); const before = app.writes;
    if (fail) pending.reject(new Error('offline')); else pending.resolve(documents);
    await settle(); assert.equal(app.writes, before); assert.deepEqual(app.acceptCalls, []);
  }
});
