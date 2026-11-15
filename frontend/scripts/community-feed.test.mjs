import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync(new URL('../src/app/player/community/page.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const settle = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function nodes(node, match) { if (!node || typeof node !== 'object') return []; return [...(match(node) ? [node] : []), ...[node.props?.children].flat(Infinity).flatMap(child => nodes(child, match))]; }
function text(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return node?.props ? [node.props.children].flat(Infinity).map(text).join(' ') : ''; }
function mount(getPosts, options = {}) {
  const slots = [], effects = [], frames = []; let cursor = 0, writes = 0;
  const exports = {};
  vm.runInNewContext(code, { exports, window: { confirm: options.confirm ?? (() => true) }, requestAnimationFrame: callback => frames.push(callback), require(name) {
    if (name === 'react') return {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { writes++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useEffect(effect, deps) { const i = cursor++, old = slots[i]; if (!old || deps.some((v, j) => v !== old.deps[j])) { old?.cleanup?.(); slots[i] = { deps }; effects.push(() => { slots[i].cleanup = effect(); }); } },
      useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
      useMemo(fn) { return fn(); },
    };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    if (name === '@/services/communityService') return { getCommunityPosts: getPosts, getCommunityRanking: options.getRanking ?? (async () => []), getCommunityComments: async () => ({ results: [] }), ...options.services };
    if (name === '@/services/groupService') return { getGroups: options.getGroups ?? (async () => [{ id: 1, name: 'Grupo A' }, { id: 2, name: 'Grupo B' }]) };
    if (name === '@/services/gameService') return { getGames: async () => options.games ?? [] };
    if (name === '@/services/evidenceService') return { getEvidences: async () => [] };
    if (name === 'axios') return { AxiosError: class extends Error {} };
    if (name === 'next/image') return { default: 'Image' };
    if (name === 'lucide-react') return {};
    if (name.endsWith('.module.css')) return { default: {} };
    if (name.includes('ProtectedRoute')) return { ProtectedRoute: 'ProtectedRoute' };
    if (name.includes('PlayerLayout')) return { PlayerLayout: 'PlayerLayout' };
    throw new Error(name);
  } });
  function render() { cursor = 0; const tree = exports.default(); effects.splice(0).forEach(run => run()); return tree; }
  return { render, frames, async ready() { render(); await settle(); render(); await settle(); return render(); }, changeGroup(id) { const tree = render(); nodes(tree, n => n.type === 'select')[0].props.onChange({ target: { value: String(id) } }); render(); return render(); }, changeGame(id) { nodes(render(), n => n.type === 'select')[1].props.onChange({ target: { value: String(id) } }); render(); return render(); }, unmount() { slots.forEach(slot => slot?.cleanup?.()); }, get writes() { return writes; } };
}
const result = (id, label) => ({ results: [{ id, text: label, author_name: 'Pessoa sintética', author_username: 'teste', created_at: '2026-11-14T12:00:00Z', origin: 'TEXT', reaction_counts: {}, comments_count: 0 }], next: null });

test('falha não vira convite de grupo vazio; tentativa recupera e preserva rascunho', async () => {
  let calls = 0;
  const app = mount(async () => { if (++calls === 1) throw new Error('offline'); return { results: [], next: null }; });
  let tree = await app.ready();
  assert.match(text(tree), /Publicações indisponíveis/); assert.doesNotMatch(text(tree), /Comece a conversa/);
  nodes(tree, n => n.type === 'textarea')[0].props.onChange({ target: { value: 'Rascunho preservado' } });
  tree = app.render(); nodes(tree, n => n.type === 'button' && text(n) === 'Tentar novamente')[0].props.onClick();
  app.render(); await settle(); tree = app.render();
  assert.match(text(tree), /Comece a conversa/); assert.doesNotMatch(text(tree), /Publicações indisponíveis/);
  assert.equal(nodes(tree, n => n.type === 'textarea')[0].props.value, 'Rascunho preservado');
});
test('troca de grupo limpa publicações antigas mesmo quando nova consulta falha', async () => {
  const app = mount(async ({ group }) => { if (group === 2) throw new Error('offline'); return result(1, 'Publicação do grupo A'); });
  assert.match(text(await app.ready()), /Publicação do grupo A/);
  assert.doesNotMatch(text(app.changeGroup(2)), /Publicação do grupo A/);
  await settle(); const tree = app.render(); assert.match(text(tree), /Publicações indisponíveis/); assert.doesNotMatch(text(tree), /Publicação do grupo A/);
});
test('resposta antiga fora de ordem não substitui publicações do grupo atual', async () => {
  const old = deferred(); const app = mount(({ group }) => group === 1 ? old.promise : Promise.resolve(result(2, 'Publicação do grupo B')));
  await app.ready(); app.changeGroup(2); await settle();
  assert.match(text(app.render()), /Publicação do grupo B/);
  old.resolve(result(1, 'Publicação atrasada do grupo A')); await settle();
  const tree = app.render(); assert.match(text(tree), /Publicação do grupo B/); assert.doesNotMatch(text(tree), /Publicação atrasada/);
});
test('falha tardia de consulta anterior não altera grupo atual; desmontagem ignora resposta', async () => {
  const old = deferred(); const latest = deferred(); const app = mount(({ group }) => group === 1 ? old.promise : latest.promise);
  await app.ready(); app.changeGroup(2); old.reject(new Error('offline')); await settle();
  assert.doesNotMatch(text(app.render()), /Publicações indisponíveis/);
  app.unmount(); const before = app.writes; latest.resolve(result(2, 'Resposta após saída')); await settle(); assert.equal(app.writes, before);
});

test('nova tentativa mantém botão focável, bloqueia repetição e foca feed após recuperação', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(() => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise);
  let tree = await app.ready();
  const retry = nodes(tree, n => n.type === 'button' && text(n) === 'Tentar novamente')[0];
  retry.props.onClick(); retry.props.onClick(); app.render(); tree = app.render();
  const busy = nodes(tree, n => n.type === 'button' && text(n) === 'Carregando publicações...')[0];
  assert.equal(calls, 2); assert.equal(busy.props['aria-disabled'], true); assert.equal(busy.props.disabled, undefined);
  pending.resolve({ results: [], next: null }); await settle(); tree = app.render();
  let focused = false;
  const heading = nodes(tree, n => n.type === 'div' && n.props?.tabIndex === -1)[0];
  heading.props.ref.current = { focus() { focused = true; } };
  app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});

const moreButton = tree => nodes(tree, n => n.type === 'button' && /Carregar mais publicações|^Carregando\.\.\.$/.test(text(n)))[0];
const rankingOptions = getRanking => ({ getRanking, games: [{ id: 11, group: 1, name: 'Jogo A' }, { id: 22, group: 2, name: 'Jogo B' }] });
const rankingResult = name => [{ player_id: 1, full_name: name, total_plays: 1, total_points: 10 }];

test('paginação bloqueia clique repetido e ignora página do grupo anterior', async () => {
  const old = deferred(); let pages = 0;
  const app = mount(({ group, page }) => {
    if (page === 2) { pages++; return old.promise; }
    return Promise.resolve({ ...result(group, `Publicação base ${group}`), next: 'pagina-2' });
  });
  let tree = await app.ready(); const button = moreButton(tree);
  button.props.onClick(); button.props.onClick(); assert.equal(pages, 1);
  assert.equal(moreButton(app.render()).props['aria-disabled'], true);
  app.changeGroup(2); await settle(); tree = app.render();
  assert.equal(moreButton(tree).props['aria-disabled'], false);
  old.resolve(result(99, 'Página atrasada do grupo A')); await settle();
  tree = app.render(); assert.match(text(tree), /Publicação base 2/); assert.doesNotMatch(text(tree), /Página atrasada/);
});
test('falha da paginação mantém feed e permite repetir a mesma página sem duplicatas', async () => {
  let pages = 0;
  const app = mount(async ({ page }) => {
    if (page === 1) return { ...result(1, 'Publicação inicial'), next: 'pagina-2' };
    if (++pages === 1) throw new Error('offline');
    return { results: [...result(1, 'Publicação inicial').results, ...result(2, 'Nova publicação').results], next: null };
  });
  let tree = await app.ready(); moreButton(tree).props.onClick(); await settle(); tree = app.render();
  assert.match(text(tree), /Não foi possível carregar mais/); assert.match(text(tree), /Publicação inicial/);
  moreButton(tree).props.onClick(); await settle(); tree = app.render();
  assert.equal(nodes(tree, n => n.type === 'article').length, 2); assert.match(text(tree), /Nova publicação/); assert.equal(moreButton(tree), undefined);
});
test('paginação não atualiza componente desmontado', async () => {
  const pending = deferred();
  const app = mount(({ page }) => page === 2 ? pending.promise : Promise.resolve({ ...result(1, 'Base'), next: 'pagina-2' }));
  moreButton(await app.ready()).props.onClick(); app.unmount(); const before = app.writes;
  pending.reject(new Error('offline')); await settle(); assert.equal(app.writes, before);
});
test('ranking distingue falha de ausência de pontos e ignora resposta do grupo anterior', async () => {
  const old = deferred();
  const app = mount(async () => ({ results: [], next: null }), rankingOptions(group => group === 1 ? old.promise : Promise.reject(new Error('offline'))));
  assert.match(text(await app.ready()), /Carregando ranking/);
  app.changeGroup(2); await settle(); let tree = app.render();
  assert.match(text(tree), /Ranking indisponível/); assert.doesNotMatch(text(tree), /após as primeiras pontuações/);
  old.resolve(rankingResult('Pessoa do grupo anterior')); await settle(); tree = app.render();
  assert.doesNotMatch(text(tree), /Pessoa do grupo anterior/); assert.match(text(tree), /Ranking indisponível/);
});
test('ranking limpa resultados em Todos e ignora resposta após desmontagem', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(async () => ({ results: [], next: null }), rankingOptions(() => ++calls === 1 ? Promise.resolve(rankingResult('Pessoa sintética A')) : pending.promise));
  assert.match(text(await app.ready()), /Pessoa sintética A/);
  app.changeGame(''); let tree = app.render(); assert.doesNotMatch(text(tree), /Pessoa sintética A/); assert.match(text(tree), /Escolha um jogo/);
  app.changeGame(11); app.unmount(); const before = app.writes;
  pending.resolve(rankingResult('Pessoa tardia')); await settle(); assert.equal(app.writes, before);
});

const composer = tree => nodes(tree, n => n.type === 'form')[0];
const draftPost = (app, value) => { nodes(app.render(), n => n.type === 'textarea')[0].props.onChange({ target: { value } }); return app.render(); };
const submit = tree => composer(tree).props.onSubmit({ preventDefault() {} });

test('publicar bloqueia repetição e sucesso não apaga texto editado durante envio', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(async () => ({ results: [], next: null }), { services: { createCommunityPost: () => { calls++; return pending.promise; } } });
  await app.ready(); const tree = draftPost(app, 'Texto enviado');
  const first = submit(tree); const repeated = submit(tree); assert.equal(calls, 1);
  draftPost(app, 'Novo rascunho'); pending.resolve(result(3, 'Texto enviado').results[0]); await first; await repeated;
  const done = app.render(); assert.equal(nodes(done, n => n.type === 'textarea')[0].props.value, 'Novo rascunho'); assert.match(text(done), /Texto enviado/);
});
test('resposta de publicação de grupo anterior não entra no feed nem limpa novo rascunho', async () => {
  const pending = deferred(); let payload;
  const app = mount(async ({ group }) => result(group, `Base ${group}`), { services: { createCommunityPost: data => { payload = data; return pending.promise; } } });
  await app.ready(); const request = submit(draftPost(app, 'Enviado ao A'));
  assert.equal(payload.group, 1); app.changeGroup(2); await settle(); draftPost(app, 'Rascunho do B');
  pending.resolve(result(90, 'Retorno tardio do A').results[0]); await request;
  const tree = app.render(); assert.doesNotMatch(text(tree), /Retorno tardio/); assert.doesNotMatch(text(tree), /Sua publicação já/); assert.equal(nodes(tree, n => n.type === 'textarea')[0].props.value, 'Rascunho do B');
});
test('falha atual preserva rascunho; falha após desmontagem não escreve estado', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(async () => ({ results: [], next: null }), { services: { createCommunityPost: () => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise } });
  await app.ready(); await submit(draftPost(app, 'Preservar texto'));
  let tree = app.render(); assert.match(text(tree), /Não foi possível concluir/); assert.equal(nodes(tree, n => n.type === 'textarea')[0].props.value, 'Preservar texto');
  const request = submit(tree); app.unmount(); const before = app.writes; pending.reject(new Error('offline')); await request; assert.equal(app.writes, before);
});
test('comentário bloqueia repetição e preserva novo rascunho após sucesso', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(async () => result(1, 'Base'), { services: { createCommunityComment: () => { calls++; return pending.promise; } } });
  let tree = await app.ready(); await nodes(tree, n => n.type === 'button' && text(n).includes('Comentar'))[0].props.onClick(); await settle();
  tree = app.render(); nodes(tree, n => n.type === 'input' && n.props['aria-label'] === 'Escrever comentário')[0].props.onChange({ target: { value: 'Comentário enviado' } });
  tree = app.render(); const send = nodes(tree, n => n.type === 'button' && text(n) === 'Enviar')[0]; const first = send.props.onClick(); send.props.onClick(); assert.equal(calls, 1);
  tree = app.render(); nodes(tree, n => n.type === 'input' && n.props['aria-label'] === 'Escrever comentário')[0].props.onChange({ target: { value: 'Novo comentário' } });
  pending.resolve({ id: 10, author_name: 'Pessoa sintética', text: 'Comentário enviado', created_at: '2026-11-14' }); await first; await settle();
  tree = app.render(); assert.match(text(tree), /Comentário enviado/); assert.equal(nodes(tree, n => n.type === 'input' && n.props['aria-label'] === 'Escrever comentário')[0].props.value, 'Novo comentário');
});

test('retorno antigo não libera bloqueio de uma nova publicação em outro grupo', async () => {
  const old = deferred(), current = deferred(); let calls = 0;
  const app = mount(async () => ({ results: [], next: null }), { services: { createCommunityPost: () => ++calls === 1 ? old.promise : current.promise } });
  await app.ready(); const first = submit(draftPost(app, 'Grupo A'));
  app.changeGroup(2); await settle(); const second = submit(draftPost(app, 'Grupo B'));
  old.resolve(result(90, 'Antiga').results[0]); await first;
  await submit(app.render()); assert.equal(calls, 2);
  current.resolve(result(91, 'Atual').results[0]); await second;
  assert.match(text(app.render()), /Atual/); assert.doesNotMatch(text(app.render()), /Antiga/);
});
test('comentário tardio de outro grupo não altera feed nem rascunho', async () => {
  const pending = deferred();
  const app = mount(async ({ group }) => result(group, `Grupo ${group}`), { services: { createCommunityComment: () => pending.promise } });
  let tree = await app.ready(); nodes(tree, n => n.type === 'button' && text(n).includes('Comentar'))[0].props.onClick(); await settle();
  tree = app.render(); nodes(tree, n => n.type === 'input' && n.props['aria-label'] === 'Escrever comentário')[0].props.onChange({ target: { value: 'Texto antigo' } });
  nodes(app.render(), n => n.type === 'button' && text(n) === 'Enviar')[0].props.onClick();
  app.changeGroup(2); await settle(); const before = app.writes;
  pending.reject(new Error('offline')); await settle();
  assert.equal(app.writes, before); assert.doesNotMatch(text(app.render()), /Não foi possível concluir/);
});

const buttonWith = (tree, label) => nodes(tree, n => n.type === 'button' && (n.props['aria-label'] === label || text(n).trim().replace(/\s+/g, ' ') === label.trim()))[0];
const ownFeed = async () => ({ results: [{ ...result(1, 'Base própria').results[0], is_own: true, comments_count: 1 }], next: null });
const ownComment = { id: 10, author_name: 'Pessoa sintética', text: 'Comentário próprio', is_own: true, created_at: '2026-11-14' };

test('reação bloqueia repetição e descarta retorno após troca de grupo', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(ownFeed, { services: { reactToCommunityPost: () => { calls++; return pending.promise; } } });
  const tree = await app.ready(); const button = buttonWith(tree, '♥ Curtir');
  button.props.onClick(); button.props.onClick(); assert.equal(calls, 1);
  app.changeGroup(2); await settle(); const before = app.writes;
  pending.resolve({ user_reaction: 'LIKE', reaction_counts: { LIKE: 1 }, reactions_count: 1 }); await settle();
  assert.equal(app.writes, before);
});
test('leitura de comentários bloqueia consulta repetida e ignora falha de grupo anterior', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(ownFeed, { services: { getCommunityComments: () => { calls++; return pending.promise; } } });
  const tree = await app.ready(); const button = buttonWith(tree, ' Comentar');
  button.props.onClick(); button.props.onClick(); assert.equal(calls, 1);
  app.changeGroup(2); await settle(); const before = app.writes;
  pending.reject(new Error('offline')); await settle(); assert.equal(app.writes, before);
});
test('exclusão de publicação respeita confirmação, bloqueia repetição e descarta retorno antigo', async () => {
  const pending = deferred(); let calls = 0, allow = false;
  const app = mount(ownFeed, { confirm: () => allow, services: { deleteCommunityPost: () => { calls++; return pending.promise; } } });
  let tree = await app.ready(); buttonWith(tree, 'Excluir publicação').props.onClick(); assert.equal(calls, 0);
  allow = true; tree = app.render(); const button = buttonWith(tree, 'Excluir publicação'); button.props.onClick(); button.props.onClick(); assert.equal(calls, 1);
  app.changeGroup(2); await settle(); pending.resolve(); await settle();
  assert.match(text(app.render()), /Base própria/);
});
test('exclusão de comentário bloqueia repetição e atualiza contagem uma vez', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(ownFeed, { services: { getCommunityComments: async () => ({ results: [ownComment] }), deleteCommunityComment: () => { calls++; return pending.promise; } } });
  let tree = await app.ready(); buttonWith(tree, ' Comentar').props.onClick(); await settle(); tree = app.render();
  const button = buttonWith(tree, 'Excluir'); button.props.onClick(); button.props.onClick(); assert.equal(calls, 1);
  pending.resolve(); await settle(); tree = app.render(); assert.doesNotMatch(text(tree), /Comentário próprio/); assert.match(text(tree), /0\s+comentários/);
});
test('ações e leituras tardias não atualizam tela desmontada', async () => {
  for (const action of ['react', 'read', 'delete']) {
    const pending = deferred();
    const app = mount(ownFeed, { services: { reactToCommunityPost: () => pending.promise, getCommunityComments: () => pending.promise, deleteCommunityPost: () => pending.promise } });
    const tree = await app.ready(); buttonWith(tree, action === 'react' ? '♥ Curtir' : action === 'read' ? ' Comentar' : 'Excluir publicação').props.onClick();
    app.unmount(); const before = app.writes; pending.reject(new Error('offline')); await settle(); assert.equal(app.writes, before);
  }
});


test('falha de contexto não afirma ausência de grupos; recuperação bloqueia repetição e foca título', async () => {
  const pending = deferred(); let calls = 0;
  const app = mount(async () => ({ results: [], next: null }), { getGroups: () => ++calls === 1 ? Promise.reject(new Error('offline')) : pending.promise });
  let tree = await app.ready(); assert.match(text(tree), /Não foi possível carregar sua comunidade/); assert.doesNotMatch(text(tree), /não participa de nenhum grupo/);
  const button = buttonWith(tree, 'Recarregar comunidade'); button.props.onClick(); button.props.onClick(); app.render(); tree = app.render();
  assert.equal(calls, 2); const busy = buttonWith(tree, 'Carregando comunidade...'); assert.equal(busy.props['aria-disabled'], true); assert.equal(busy.props.disabled, undefined);
  pending.resolve([]); await settle(); tree = app.render(); assert.match(text(tree), /não participa de nenhum grupo/); assert.doesNotMatch(text(tree), /Não foi possível carregar sua comunidade/);
  let focused = false; nodes(tree, n => n.type === 'h1')[0].props.ref.current = { focus() { focused = true; } };
  app.frames.splice(0).forEach(frame => frame()); assert.equal(focused, true);
});
test('contexto realmente sem grupos mostra vazio legítimo', async () => {
  const app = mount(async () => ({ results: [], next: null }), { getGroups: async () => [] });
  const tree = await app.ready(); assert.match(text(tree), /não participa de nenhum grupo/); assert.doesNotMatch(text(tree), /Não foi possível carregar sua comunidade/);
});
test('consulta de contexto após saída não atualiza estado', async () => {
  for (const fail of [false, true]) {
    const pending = deferred(); const app = mount(async () => ({ results: [], next: null }), { getGroups: () => pending.promise });
    app.render(); app.unmount(); const before = app.writes;
    if (fail) pending.reject(new Error('offline')); else pending.resolve([]);
    await settle(); assert.equal(app.writes, before);
  }
});
