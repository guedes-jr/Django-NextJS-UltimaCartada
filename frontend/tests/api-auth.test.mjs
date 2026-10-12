// Executar: node --test tests/api-auth.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup(pathname = '/login', refreshToken = null) {
  const clients = [];
  const state = { logouts: 0, refreshes: 0 };
  const axios = { create() {
    const client = {
      interceptors: {
        request: { use(fn) { client.request = fn; } },
        response: { use(ok, fail) { client.fail = fail; } },
      },
      post: async () => { state.refreshes++; throw new Error('Refresh failed'); },
    };
    clients.push(client);
    return client;
  }};
  const window = { location: { pathname, href: pathname } };
  const source = ts.transpileModule(fs.readFileSync('src/lib/api.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, {
    exports: {}, process: { env: {} }, window,
    require(name) {
      if (name === 'axios') return axios;
      if (name === '@/lib/auth') return {
        getAccessToken: () => 'stale-access', getRefreshToken: () => refreshToken,
        logout: () => state.logouts++, saveAccessToken() {},
      };
      throw new Error(name);
    },
  });
  return { api: clients[0], window, state };
}

for (const refresh of [null, 'stale-refresh']) {
  test(`Login 401 preserva erro e página com refresh=${refresh}`, async () => {
    const { api, window, state } = setup('/login', refresh);
    const error = { config: { url: '/auth/token/' }, response: { status: 401 } };
    await assert.rejects(api.fail(error), value => value === error);
    assert.equal(window.location.href, '/login');
    assert.equal(state.logouts, 0);
    assert.equal(state.refreshes, 0);
  });
}
test('Autenticação não envia Authorization antigo', () => {
  const { api } = setup();
  const headers = new Map([['Authorization', 'Bearer stale-access']]);
  api.request({ url: '/auth/token/', headers });
  assert.equal(headers.has('Authorization'), false);
});
test('401 protegido sem refresh encerra sessão e redireciona', async () => {
  const { api, window, state } = setup('/player/home');
  const error = { config: { url: '/games/games/' }, response: { status: 401 } };
  await assert.rejects(api.fail(error), value => value === error);
  assert.equal(window.location.href, '/login');
  assert.equal(state.logouts, 1);
});
test('Erro 500 é devolvido sem encerrar sessão', async () => {
  const { api, state } = setup();
  const error = { config: { url: '/auth/token/' }, response: { status: 500 } };
  await assert.rejects(api.fail(error), value => value === error);
  assert.equal(state.logouts, 0);
});
