import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Verifica coordenação de locks sem simular navegador, foco ou APIs de dialog.
const source = await readFile(new URL("../src/lib/scrollLock.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } });
const { lockPageScroll } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const element = (overflow = "") => ({ style: { overflow } });

test("restaura a configuração anterior ao liberar a última superfície", () => {
  const target = element("auto");
  const release = lockPageScroll(target);
  assert.equal(target.style.overflow, "hidden");
  release();
  assert.equal(target.style.overflow, "auto");
});

test("fechar uma superfície anterior não libera outra ainda aberta", () => {
  const target = element("scroll");
  const parent = lockPageScroll(target);
  const child = lockPageScroll(target);
  parent();
  assert.equal(target.style.overflow, "hidden");
  child();
  assert.equal(target.style.overflow, "scroll");
});

test("cleanup duplicado não libera o bloqueio de outra superfície", () => {
  const target = element();
  const first = lockPageScroll(target);
  const second = lockPageScroll(target);
  first();
  first();
  assert.equal(target.style.overflow, "hidden");
  second();
  assert.equal(target.style.overflow, "");
});

test("elementos diferentes mantêm bloqueios independentes", () => {
  const first = element("auto");
  const second = element("scroll");
  const releaseFirst = lockPageScroll(first);
  const releaseSecond = lockPageScroll(second);
  releaseFirst();
  assert.equal(first.style.overflow, "auto");
  assert.equal(second.style.overflow, "hidden");
  releaseSecond();
  assert.equal(second.style.overflow, "scroll");
});

test("uma nova abertura captura a configuração atual após o cleanup", () => {
  const target = element("auto");
  lockPageScroll(target)();
  target.style.overflow = "clip";
  const release = lockPageScroll(target);
  release();
  release();
  assert.equal(target.style.overflow, "clip");
});
