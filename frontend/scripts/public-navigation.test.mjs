import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/landing/PublicNavigation.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;

// Component/hook simulation: verifies event ownership and lifecycle, not DOM/CSS.
function mount() {
  const slots = [], effects = [], listeners = new Map();
  let cursor = 0, pathname = "/", focusCalls = 0;
  const buttonTarget = {}, linkTarget = {}, outsideTarget = {};
  const button = { contains: (target) => target === buttonTarget, focus: () => focusCalls++ };
  const nav = { contains: (target) => target === linkTarget };
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    document: {
      addEventListener(name, handler) { const set = listeners.get(name) ?? new Set(); set.add(handler); listeners.set(name, set); },
      removeEventListener(name, handler) { listeners.get(name)?.delete(handler); },
    },
    require(name) {
      if (name === "next/navigation") return { usePathname: () => pathname };
      if (name.endsWith(".module.css")) return { default: {} };
      if (name === "react/jsx-runtime") return { Fragment: "fragment", jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === "react") return {
        useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], (value) => { slots[i] = value; }]; },
        useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
        useEffect(effect, deps) {
          const i = cursor++, old = slots[i];
          if (!old || deps.some((value, j) => value !== old.deps[j])) {
            old?.cleanup?.(); slots[i] = { deps };
            effects.push(() => { slots[i].cleanup = effect(); });
          }
        },
      };
      throw new Error(name);
    },
  });
  function render() {
    cursor = 0;
    const tree = exports.default({ id: "test-nav", label: "Navegação", children: "links" });
    const [toggle, navigation] = tree.props.children;
    toggle.props.ref.current = button; navigation.props.ref.current = nav;
    effects.splice(0).forEach((run) => run());
    return { toggle, navigation, open: toggle.props["aria-expanded"] };
  }
  return {
    render, buttonTarget, linkTarget, outsideTarget,
    open() { render().toggle.props.onClick(); return render(); },
    dispatch(name, target, key) {
      let prevented = false;
      for (const handler of listeners.get(name) ?? []) handler({ target, key, preventDefault() { prevented = true; } });
      return prevented;
    },
    navigate(path) { pathname = path; return render(); },
    get focusCalls() { return focusCalls; },
    get listenerCount() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
    unmount() { slots.forEach((slot) => slot?.cleanup?.()); },
  };
}

test("toggle associa controles e mantém apenas um conjunto de listeners", () => {
  const app = mount();
  assert.equal(app.render().open, false);
  assert.equal(app.listenerCount, 0);
  const tree = app.open();
  assert.equal(tree.open, true);
  assert.equal(tree.toggle.props["aria-controls"], tree.navigation.props.id);
  app.render(); assert.equal(app.listenerCount, 3);
  tree.toggle.props.onClick(); assert.equal(app.render().open, false);
  assert.equal(app.listenerCount, 0);
});
test("Escape pertence somente ao menu e devolve foco ao botão", () => {
  for (const owner of ["buttonTarget", "linkTarget"]) {
    const app = mount(); app.open();
    assert.equal(app.dispatch("keydown", app.outsideTarget, "Escape"), false);
    assert.equal(app.render().open, true);
    assert.equal(app.dispatch("keydown", app[owner], "Escape"), true);
    assert.equal(app.render().open, false);
    assert.equal(app.focusCalls, 1);
  }
});
test("ponteiro e foco internos preservam abertura; sair fecha sem roubar foco", () => {
  for (const event of ["pointerdown", "focusin"]) {
    const app = mount(); app.open();
    app.dispatch(event, app.linkTarget); assert.equal(app.render().open, true);
    app.dispatch(event, app.buttonTarget); assert.equal(app.render().open, true);
    app.dispatch(event, app.outsideTarget); assert.equal(app.render().open, false);
    assert.equal(app.focusCalls, 0);
  }
});
test("ativar link ou descendente fecha e preserva foco antes de ocultar painel", () => {
  const app = mount(); const tree = app.open();
  tree.navigation.props.onClickCapture({ target: { closest: (selector) => selector === "a" ? {} : null } });
  assert.equal(app.render().open, false);
  assert.equal(app.focusCalls, 1);
});
test("clique sem link não fecha; nova rota fecha e remove listeners", () => {
  const app = mount(); const tree = app.open();
  tree.navigation.props.onClickCapture({ target: { closest: () => null } });
  assert.equal(app.render().open, true);
  assert.equal(app.navigate("/public/ultima-cartada").open, false);
  assert.equal(app.listenerCount, 0);
});
test("desmontagem limpa listeners do documento", () => {
  const app = mount(); app.open(); assert.equal(app.listenerCount, 3);
  app.unmount(); assert.equal(app.listenerCount, 0);
});
