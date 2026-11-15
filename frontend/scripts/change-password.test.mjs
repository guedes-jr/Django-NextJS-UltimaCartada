import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/components/settings/ChangePasswordForm.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(services = {}, redirectAfterSuccess) {
  const slots = [], effects = [], frames = [], saved = [], redirects = []; let cursor = 0, writes = 0;
  const exports = {};
  vm.runInNewContext(code, { exports, requestAnimationFrame: callback => frames.push(callback), require(name) {
    if (name === 'react') return {
      useId() { return 'test-password'; },
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
      useMemo(callback) { return callback(); },
      useEffect(effect, deps) { const i = cursor++, old = slots[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.cleanup?.(); slots[i] = { deps }; effects.push(() => { slots[i].cleanup = effect(); }); } },
    };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    if (name === '@/services/accountService') return services;
    if (name === '@/lib/auth') return { saveAuthUser: user => saved.push(user) };
    if (name === 'next/navigation') return { useRouter: () => ({ replace: path => redirects.push(path) }) };
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute')) return { ProtectedRoute: 'ProtectedRoute' };
    if (name.includes('PlayerLayout')) return { PlayerLayout: 'PlayerLayout' };
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.ChangePasswordForm({ redirectAfterSuccess }); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, saved, redirects, async ready() { render(); await settle(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}

function fill(app) {
  const values = ['Current-Synthetic-2026', 'New-Synthetic-2026', 'New-Synthetic-2026'];
  nodes(app.render(), n => n.type === 'input').forEach((input, i) => input.props.onChange({ target: { value: values[i] } }));
  return app.render();
}
const submit = tree => tree.props.onSubmit({ preventDefault() {} });
const retry = tree => nodes(tree, n => n.type === 'button' && n.props.type === 'button')[0];

test('senha salva com falha de sessão informa sucesso e permite repetir somente sessão', async () => {
  let changes = 0, reads = 0;
  const app = mount({ changePassword: async () => { changes++; return { detail: 'Senha alterada com sucesso.' }; }, getCurrentUser: async () => { if (++reads === 1) throw new Error('offline'); return { username: 'synthetic' }; } }, '/dashboard');
  await submit(fill(app)); let tree = app.render();
  assert.match(text(tree), /Senha alterada com sucesso/); assert.match(text(tree), /Sua senha foi alterada, mas/); assert.doesNotMatch(text(tree), /Confira a senha atual/);
  assert.ok(nodes(tree, n => n.type === 'input').every(input => input.props.value === '' && input.props.disabled));
  assert.equal(retry(tree).props['aria-disabled'], false); assert.deepEqual(app.redirects, []); await submit(tree); assert.equal(changes, 1);
  retry(tree).props.onClick(); await settle(); tree = app.render();
  assert.equal(changes, 1); assert.equal(reads, 2); assert.deepEqual(app.redirects, ['/dashboard']); assert.equal(app.saved.length, 1); assert.equal(retry(tree), undefined);
});
test('nova tentativa da sessão bloqueia repetição antes do rerender', async () => {
  const pending = deferred(); let reads = 0;
  const app = mount({ changePassword: async () => ({ detail: 'Senha alterada.' }), getCurrentUser: () => ++reads === 1 ? Promise.reject(new Error('offline')) : pending.promise });
  await submit(fill(app)); const button = retry(app.render()); button.props.onClick(); button.props.onClick();
  assert.equal(reads, 2); assert.equal(retry(app.render()).props['aria-disabled'], true);
  pending.resolve({ username: 'synthetic' }); await settle(); assert.equal(app.saved.length, 1);
});
test('falha na alteração preserva campos e não consulta sessão', async () => {
  let reads = 0;
  const app = mount({ changePassword: async () => { throw new Error('invalid'); }, getCurrentUser: async () => { reads++; } });
  await submit(fill(app)); const tree = app.render(); assert.match(text(tree), /Confira a senha atual/); assert.equal(reads, 0);
  assert.ok(nodes(tree, n => n.type === 'input').every(input => input.props.value.length > 0 && !input.props.disabled)); assert.equal(retry(tree), undefined);
});
test('envio repetido de senha chama serviço uma vez', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount({ changePassword: () => { calls++; return pending.promise; }, getCurrentUser: async () => ({ username: 'synthetic' }) });
  const tree = fill(app); const first = submit(tree); await submit(tree); assert.equal(calls, 1);
  pending.resolve({ detail: 'Senha alterada.' }); await first; assert.equal(app.saved.length, 1);
});

for (const scenario of [
  { label: 'campo obrigatório vazio', values: ['', '', ''], field: 0, message: /Preencha todos/ },
  { label: 'confirmação divergente', values: ['Current-Synthetic', 'New-Synthetic', 'Different-Synthetic'], field: 2, message: /não conferem/ },
  { label: 'nova senha curta', values: ['Current-Synthetic', 'short', 'short'], field: 1, message: /pelo menos 8/ },
]) {
  test(`validação associa mensagem e programa foco: ${scenario.label}`, async () => {
    let calls = 0; const app = mount({ changePassword: async () => { calls++; } });
    nodes(app.render(), n => n.type === 'input').forEach((input, i) => input.props.onChange({ target: { value: scenario.values[i] } }));
    await submit(app.render()); const tree = app.render(); assert.equal(calls, 0); assert.match(text(tree), scenario.message);
    const inputs = nodes(tree, n => n.type === 'input'); const input = inputs[scenario.field];
    assert.equal(input.props['aria-invalid'], true); assert.equal(inputs.filter(item => item.props['aria-invalid']).length, 1);
    const error = nodes(tree, n => n.props?.role === 'alert')[0]; assert.ok(input.props['aria-describedby'].split(' ').includes(error.props.id));
    let focused = false; input.props.ref.current = { focus() { focused = true; } }; app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
    if (scenario.field === 1) {
      assert.equal(input.props.minLength, 8); assert.ok(input.props['aria-describedby'].includes('new-help'));
    }
  });
}
