import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function config(env) {
  const exports = {};
  vm.runInNewContext(code, { exports, module: { exports }, process: { env } });
  return exports.default;
}
test('produção ignora a opção de proxy local mesmo quando true', async () => {
  const c = config({ NODE_ENV: 'production', CONSULTORIA_LOCAL_API_PROXY: 'true' });
  assert.equal((await c.rewrites()).length, 0);
  assert.equal(c.distDir, '.next');
  assert.equal(c.skipTrailingSlashRedirect, false);
});
test('desenvolvimento comum preserva roteamento sem proxy', async () => {
  for (const value of [undefined, 'false', '1']) {
    assert.equal((await config({ NODE_ENV: 'development', CONSULTORIA_LOCAL_API_PROXY: value }).rewrites()).length, 0);
  }
});
test('prévia explícita encaminha somente o prefixo existente à API local fixa', async () => {
  const c = config({ NODE_ENV: 'development', CONSULTORIA_LOCAL_API_PROXY: 'true' });
  assert.equal(c.distDir, '.next-consultoria-preview');
  assert.equal(c.skipTrailingSlashRedirect, true);
  const routes = await c.rewrites();
  assert.equal(routes.length, 1);
  assert.equal(routes[0].source, '/api/v1/:path*');
  assert.equal(routes[0].destination, 'http://127.0.0.1:8000/api/v1/:path*/');
});
