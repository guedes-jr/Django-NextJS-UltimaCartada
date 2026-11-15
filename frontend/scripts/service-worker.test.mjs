import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");

function worker({ updated = false, network = async () => new Response("online"), failInstall = false } = {}) {
  const handlers = new Map();
  const stores = new Map();
  const added = [];
  const deleted = [];
  const fetched = [];
  let skipped = 0;
  let claimed = 0;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async add(url) {
          if (failInstall) throw new Error("Falha de rede durante instalação");
          added.push(url);
          entries.set(url, new Response(`offline:${url}`));
        },
        async match(url) { return entries.get(url)?.clone(); },
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { deleted.push(name); return stores.delete(name); },
  };
  vm.runInNewContext(source, {
    URL, Response,
    fetch: async (request) => { fetched.push(request); return network(request); },
    caches,
    self: {
      location: { href: `https://example.test/sw.js${updated ? "?presentation=consultoria" : ""}`, origin: "https://example.test" },
      addEventListener: (name, handler) => handlers.set(name, handler),
      skipWaiting: async () => { skipped += 1; },
      clients: { claim: async () => { claimed += 1; } },
    },
  });
  return {
    stores, added, deleted, fetched,
    get skipped() { return skipped; },
    get claimed() { return claimed; },
    async lifecycle(name) {
      let pending;
      handlers.get(name)({ waitUntil: (promise) => { pending = promise; } });
      await pending;
    },
    async request(path, { method = "GET", mode = "navigate" } = {}) {
      let response;
      handlers.get("fetch")({
        request: { url: new URL(path, "https://example.test").href, method, mode },
        respondWith: (promise) => { response = Promise.resolve(promise); },
      });
      return response ? { handled: true, response: await response } : { handled: false };
    },
  };
}

test("instalação legada guarda somente a página offline legada", async () => {
  const sw = worker();
  await sw.lifecycle("install");
  assert.deepEqual(sw.added, ["/offline.html"]);
  assert.equal(sw.skipped, 1);
});

test("nova apresentação guarda somente sua página offline, sem páginas privadas", async () => {
  const sw = worker({ updated: true });
  await sw.lifecycle("install");
  assert.deepEqual(sw.added, ["/offline-consultoria.html"]);
  assert.equal(sw.skipped, 1);
});

test("falha ao preparar a página offline impede avanço forçado da instalação", async () => {
  const sw = worker({ failInstall: true });
  await assert.rejects(sw.lifecycle("install"), /Falha de rede/);
  assert.equal(sw.skipped, 0);
});

test("navegação online preserva a resposta e não a escreve no cache", async () => {
  const response = new Response("resposta da página");
  const sw = worker({ network: async () => response });
  await sw.lifecycle("install");
  const result = await sw.request("/player/home");
  assert.equal(result.response, response);
  assert.deepEqual(sw.added, ["/offline.html"]);
  const entries = [...sw.stores.values()][0];
  assert.deepEqual([...entries.keys()], ["/offline.html"]);
});

test("sem rede, rota privada recebe apenas tela genérica da apresentação ativa", async () => {
  const sw = worker({ updated: true, network: async () => { throw new TypeError("offline"); } });
  await sw.lifecycle("install");
  const result = await sw.request("/mentorship");
  assert.equal(await result.response.text(), "offline:/offline-consultoria.html");
  assert.deepEqual(sw.added, ["/offline-consultoria.html"]);
});

test("API, mídias, recursos, POST e outra origem não são interceptados", async () => {
  const sw = worker();
  for (const [path, options] of [
    ["/api/v1/accounts/me/", { mode: "cors" }],
    ["/api/v1/journeys/participations/1/download/", { mode: "cors" }],
    ["/media/evidence.mp4", { mode: "no-cors" }],
    ["/_next/static/chunks/app.js", { mode: "no-cors" }],
    ["/submit", { mode: "navigate", method: "POST" }],
    ["https://another.test/page", { mode: "navigate" }],
  ]) {
    assert.equal((await sw.request(path, options)).handled, false);
  }
  assert.equal(sw.added.length, 0);
  assert.equal(sw.fetched.length, 0);
});

test("403 e 500 recebidos do servidor não são mascarados como offline", async () => {
  for (const status of [403, 500]) {
    const response = new Response("erro do servidor", { status });
    const sw = worker({ network: async () => response });
    const result = await sw.request("/player/home");
    assert.equal(result.response, response);
    assert.equal(result.response.status, status);
    assert.equal(sw.stores.size, 0);
  }
});

test("ativação remove só caches offline antigos e preserva outros namespaces", async () => {
  const sw = worker({ updated: true });
  await sw.lifecycle("install");
  const current = [...sw.stores.keys()][0];
  sw.stores.set("ultima-cartada-offline-v1", new Map());
  sw.stores.set("ultima-cartada-other-feature", new Map());
  sw.stores.set("other-application", new Map());
  await sw.lifecycle("activate");
  assert.deepEqual(sw.deleted, ["ultima-cartada-offline-v1"]);
  assert.ok(sw.stores.has(current));
  assert.ok(sw.stores.has("ultima-cartada-other-feature"));
  assert.ok(sw.stores.has("other-application"));
  assert.equal(sw.claimed, 1);
});

test("sem rede e sem página de fallback, retorna erro de rede", async () => {
  const sw = worker({ network: async () => { throw new TypeError("offline"); } });
  const result = await sw.request("/player/home");
  assert.equal(result.response.type, "error");
  assert.equal(sw.added.length, 0);
});
