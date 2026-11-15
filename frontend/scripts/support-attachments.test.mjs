import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const exports = {};
const source = readFileSync(new URL("../src/lib/supportAttachments.ts", import.meta.url), "utf8");
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports });
const { getSupportAttachmentError: error, SUPPORT_ATTACHMENT_MAX_BYTES: max, SUPPORT_ATTACHMENT_EXTENSIONS: extensions } = exports;

test("limites de interface permanecem alinhados ao serializer Django", () => {
  const backend = readFileSync(new URL("../../backend/apps/support/serializers.py", import.meta.url), "utf8");
  const size = backend.match(/MAX_ATTACHMENT_SIZE = (\d+) \* (\d+) \* (\d+)/);
  assert.ok(size);
  assert.equal(max, Number(size[1]) * Number(size[2]) * Number(size[3]));
  const allowed = backend.match(/ALLOWED_EXTENSIONS = \{([^}]+)\}/);
  assert.ok(allowed);
  assert.deepEqual([...extensions].sort(), JSON.parse(`[${allowed[1]}]`).sort());
});
test("anexo é opcional", () => assert.equal(error(null), null));
test("limite exato é aceito e um byte acima é rejeitado", () => {
  assert.equal(error({ name: "evidencia.pdf", size: max }), null);
  assert.match(error({ name: "evidencia.pdf", size: max + 1 }), /10 MB/);
});
test("extensões permitidas aceitam letras maiúsculas e múltiplos pontos", () => {
  for (const ext of extensions) assert.equal(error({ name: `anexo.sintetico${ext.toUpperCase()}`, size: 1 }), null);
});
test("extensão ausente, executável, oculta ou disfarçada é recusada", () => {
  for (const name of ["anexo", "anexo.exe", ".pdf", "anexo.pdf.exe", "anexo.pdf ", "anexo."]) {
    assert.match(error({ name, size: 1 }), /Formato de anexo/);
  }
});
