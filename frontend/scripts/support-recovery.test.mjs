import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/player/support/page.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const attachmentExports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../src/lib/supportAttachments.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: attachmentExports });
const settle = () => new Promise((resolve) => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function nodes(node, match) {
  if (!node || typeof node !== "object") return [];
  return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap((child) => nodes(child, match))];
}
function text(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  return node?.props ? [node.props.children].flat(Infinity).map(text).join(" ") : "";
}
function mount(getTickets, services = {}) {
  const slots = [], effects = [], frames = [];
  let cursor = 0, writes = 0;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], (value) => { writes++; slots[i] = typeof value === "function" ? value(slots[i]) : value; }];
    },
    useRef(value) { const i = cursor++; return slots[i] ??= { current: value }; },
    useEffect(effect, deps) {
      const i = cursor++, old = slots[i];
      if (!old || deps.some((value, j) => value !== old.deps[j])) {
        old?.cleanup?.();
        slots[i] = { deps };
        effects.push(() => { slots[i].cleanup = effect(); });
      }
    },
  };
  const exports = {};
  vm.runInNewContext(code, {
    exports, URLSearchParams,
    window: { location: { search: "" } },
    requestAnimationFrame: (callback) => frames.push(callback),
    require(name) {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === "@/services/supportService") return { getSupportTickets: getTickets, ...services };
      if (name === "@/lib/supportAttachments") return attachmentExports;
      if (name.endsWith(".module.css")) return { default: {} };
      if (name.includes("ProtectedRoute")) return { ProtectedRoute: "ProtectedRoute" };
      if (name.includes("PlayerLayout")) return { PlayerLayout: "PlayerLayout" };
      if (name.includes("Modal")) return { Modal: "Modal" };
      throw new Error(name);
    },
  });
  function render() { cursor = 0; const tree = exports.default(); effects.splice(0).forEach((run) => run()); return tree; }
  const retry = (tree) => nodes(tree, (node) => node.type === "button" && /Tentar novamente|Carregando chamados/.test(text(node)))[0];
  return { render, retry, frames, get writes() { return writes; }, unmount() { slots.forEach((slot) => slot?.cleanup?.()); } };
}

test("falha de leitura não é apresentada como histórico vazio", async () => {
  const app = mount(async () => { throw new Error("offline"); });
  app.render(); await settle();
  const tree = app.render();
  assert.match(text(tree), /Histórico indisponível/);
  assert.doesNotMatch(text(tree), /Você ainda não abriu chamados/);
  assert.ok(app.retry(tree));
});
test("consulta bem-sucedida sem chamados apresenta vazio legítimo", async () => {
  const app = mount(async () => []);
  app.render(); await settle();
  const tree = app.render();
  assert.match(text(tree), /Você ainda não abriu chamados/);
  assert.equal(app.retry(tree), undefined);
});
test("repetição é bloqueada, botão fica focável e recuperação preserva rascunho", async () => {
  const request = deferred(); let calls = 0;
  const app = mount(() => ++calls === 1 ? Promise.reject(new Error("offline")) : request.promise);
  app.render(); await settle();
  let tree = app.render();
  nodes(tree, (node) => node.type === "input" && node.props.minLength === 5)[0].props.onChange({ target: { value: "Assunto sintético preservado" } });
  tree = app.render();
  const retry = app.retry(tree);
  retry.props.onClick(); retry.props.onClick();
  tree = app.render();
  assert.equal(calls, 2);
  assert.equal(app.retry(tree).props["aria-disabled"], true);
  assert.equal(app.retry(tree).props.disabled, undefined);
  request.resolve([]); await settle();
  tree = app.render();
  assert.equal(app.retry(tree), undefined);
  assert.equal(nodes(tree, (node) => node.type === "input" && node.props.minLength === 5)[0].props.value, "Assunto sintético preservado");
  const heading = nodes(tree, (node) => node.type === "h2" && text(node) === "Histórico")[0];
  let focused = false;
  heading.props.ref.current = { focus() { focused = true; } };
  app.frames.splice(0).forEach((frame) => frame());
  assert.equal(focused, true);
});
test("resposta tardia não atualiza componente desmontado", async () => {
  const request = deferred(); const app = mount(() => request.promise);
  app.render(); app.unmount(); const before = app.writes;
  request.resolve([]); await settle();
  assert.equal(app.writes, before);
});

test("anexo inválido bloqueia criação antes do serviço e remoção mantém o assunto", async () => {
  let calls = 0;
  const app = mount(async () => [], { createSupportTicket: async () => { calls++; } });
  app.render(); await settle();
  let tree = app.render();
  nodes(tree, (node) => node.type === "input" && node.props.minLength === 5)[0].props.onChange({ target: { value: "Assunto sintético preservado" } });
  tree = app.render();
  const file = nodes(tree, (node) => node.type === "input" && node.props["aria-describedby"]?.includes("support-create-attachment-hint"))[0];
  file.props.onChange({ target: { files: [{ name: "invalido.exe", size: 1 }] } });
  tree = app.render();
  await nodes(tree, (node) => node.type === "form" && "aria-busy" in node.props)[0].props.onSubmit({ preventDefault() {} });
  assert.equal(calls, 0);
  assert.match(text(app.render()), /Formato de anexo não permitido/);
  nodes(app.render(), (node) => node.type === "button" && text(node) === "Remover anexo")[0].props.onClick();
  tree = app.render();
  assert.doesNotMatch(text(tree), /Formato de anexo não permitido/);
  assert.equal(nodes(tree, (node) => node.type === "input" && node.props.minLength === 5)[0].props.value, "Assunto sintético preservado");
});
test("anexo acima do limite bloqueia resposta antes do serviço", async () => {
  let calls = 0;
  const ticket = { id: 1, protocol: "synthetic-protocol", subject: "Chamado sintético", category: "TECHNICAL", status: "OPEN", updated_at: "2026-11-14T12:00:00Z", messages: [] };
  const app = mount(async () => [ticket], { replySupportTicket: async () => { calls++; } });
  app.render(); await settle();
  nodes(app.render(), (node) => node.type === "button" && text(node).includes("Chamado sintético"))[0].props.onClick();
  let tree = app.render();
  nodes(tree, (node) => node.type === "input" && node.props["aria-label"] === "Anexo da resposta")[0].props.onChange({ target: { files: [{ name: "grande.pdf", size: 10 * 1024 * 1024 + 1 }] } });
  tree = app.render();
  await nodes(tree, (node) => node.type === "form" && !("aria-busy" in node.props))[0].props.onSubmit({ preventDefault() {} });
  assert.equal(calls, 0);
  assert.match(text(app.render()), /O anexo deve ter no máximo 10 MB/);
});
