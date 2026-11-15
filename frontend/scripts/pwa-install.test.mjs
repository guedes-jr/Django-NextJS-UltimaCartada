import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Executa o componente real com hooks/eventos mínimos, sem instalar o aplicativo.
const source = readFileSync(new URL("../src/components/pwa/PwaInstall.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function mount() {
  const slots = [], events = new Map();
  let cursor = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
      return [slots[index], (next) => { slots[index] = typeof next === "function" ? next(slots[index]) : next; }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useEffect(effect) { const index = cursor++; if (!(index in slots)) slots[index] = effect() ?? true; },
  };
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name.endsWith(".module.css")) return { default: {} };
      throw new Error(name);
    },
    window: { matchMedia: () => ({ matches: false }), addEventListener: (name, fn) => events.set(name, fn), removeEventListener: (name) => events.delete(name) },
    navigator: { serviceWorker: { register: () => Promise.resolve() } },
  });
  function render() { cursor = 0; return exports.PwaInstall({ presentation: "consultoria" }); }
  function emit(name, event = {}) { events.get(name)?.(event); }
  render();
  return { render, emit };
}
function nodes(node, predicate) {
  if (!node || typeof node !== "object") return [];
  return [...(predicate(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap((child) => nodes(child, predicate))];
}
const buttons = (tree) => nodes(tree, (node) => node.type === "button");
const statuses = (tree) => nodes(tree, (node) => node.props?.role === "status");
const settled = () => new Promise((resolve) => setImmediate(resolve));
function offer(app, prompt, userChoice = Promise.resolve({ outcome: "dismissed" })) {
  app.emit("beforeinstallprompt", { preventDefault() {}, prompt, userChoice });
  return buttons(app.render())[0];
}

test("não oferece instalação antes do evento do navegador", () => assert.equal(mount().render(), null));
test("cliques concorrentes usam o evento uma única vez e mantêm o botão focável", async () => {
  const app = mount();
  let resolve, calls = 0;
  const button = offer(app, () => { calls++; return new Promise((done) => { resolve = done; }); });
  button.props.onClick(); button.props.onClick();
  assert.equal(calls, 1);
  const busy = buttons(app.render())[0];
  assert.equal(busy.props["aria-disabled"], true);
  assert.equal(busy.props.disabled, undefined);
  resolve(); await settled();
  assert.equal(app.render(), null);
});
for (const outcome of ["accepted", "dismissed"]) test(`escolha ${outcome} consome o evento sem mensagem de erro`, async () => {
  const app = mount();
  offer(app, async () => {}, Promise.resolve({ outcome })).props.onClick();
  await settled();
  assert.equal(app.render(), null);
});
test("falha ao abrir é anunciada, pode ser fechada e aceita novo evento", async () => {
  const app = mount();
  offer(app, async () => { throw new Error("indisponível"); }).props.onClick();
  await settled();
  assert.equal(statuses(app.render()).length, 1);
  assert.equal(buttons(app.render())[0].props["aria-disabled"], true);
  assert.equal(buttons(app.render())[0].props["aria-describedby"], "pwa-install-error");
  buttons(app.render())[1].props.onClick();
  assert.equal(app.render(), null);
  offer(app, async () => {});
  assert.equal(buttons(app.render()).length, 1);
});
test("falha na escolha também é tratada sem rejeição não capturada", async () => {
  const app = mount();
  let reject;
  const choice = new Promise((_, fail) => { reject = fail; });
  offer(app, async () => {}, choice).props.onClick();
  await Promise.resolve();
  reject(new Error("cancelado pelo navegador"));
  await settled();
  assert.equal(statuses(app.render()).length, 1);
});
test("appinstalled oculta botão e aviso", async () => {
  const app = mount();
  offer(app, async () => { throw new Error("indisponível"); }).props.onClick();
  await settled();
  app.emit("appinstalled");
  assert.equal(app.render(), null);
});
test("finalizar solicitação anterior não descarta novo evento oferecido pelo navegador", async () => {
  const app = mount();
  let resolve;
  offer(app, () => new Promise((done) => { resolve = done; })).props.onClick();
  let nextCalls = 0;
  offer(app, async () => { nextCalls++; });
  resolve(); await settled();
  buttons(app.render())[0].props.onClick();
  await settled();
  assert.equal(nextCalls, 1);
  assert.equal(app.render(), null);
});
