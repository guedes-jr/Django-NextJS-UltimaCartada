import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/consultoria/ConsultoriaSections.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText;

function sections() {
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    module: { exports },
    require(name) {
      if (name === "next/link" || name === "next/image") return { default: name };
      if (name === "lucide-react") return { ArrowRight: "ArrowRight", ArrowUpRight: "ArrowUpRight" };
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name.endsWith(".module.css")) return { default: { primaryButton: "primary", secondaryButton: "secondary" } };
      if (name === "./content") return {
        consultoria: { inclusion: "Incluído" },
        consultoriaOfferDetails: {},
        getConsultoriaContact: () => null,
        previewRoutes: {},
        sharedQuestions: [],
      };
      throw new Error(name);
    },
  });
  return exports;
}

test("ActionLink externo mantém proteção e explica a nova aba", () => {
  const link = sections().ActionLink({ href: "https://example.com", children: "Conhecer condições", external: true });
  assert.equal(link.props.target, "_blank");
  assert.equal(link.props.rel, "noopener noreferrer");
  assert.equal(link.props["aria-label"], "Conhecer condições (abre em nova aba)");
});

test("ActionLink interno não declara nova aba", () => {
  const link = sections().ActionLink({ href: "#condicoes", children: "Conhecer condições" });
  assert.equal(link.props.target, undefined);
  assert.equal(link.props.rel, undefined);
  assert.equal(link.props["aria-label"], undefined);
});
