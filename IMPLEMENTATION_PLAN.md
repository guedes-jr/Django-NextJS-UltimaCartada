# IMPLEMENTATION_PLAN.md — Plano de implementação

## Objetivo deste documento

Este documento orienta a continuidade do projeto Cartada Viva / A Última Cartada. Ele deve ser usado por desenvolvedores e agentes de IA para entender o que já foi feito, o que falta fazer e quais padrões devem ser preservados.

---

## Status atual do projeto

O sistema já avançou bastante e possui base funcional com:

- backend Django REST;
- frontend Next.js;
- autenticação JWT;
- refresh token automático;
- controle de usuários por papel;
- área administrativa;
- área do jogador;
- landing page pública;
- gestão de jogadores;
- gestão de grupos;
- gestão de jogos;
- gestão de rodadas;
- gestão de cartas;
- gestão de jogadas;
- envio/revisão de evidências;
- ranking;
- relatórios;
- configurações de senha;
- plano de deploy para VPS.

---

## Fases já realizadas ou parcialmente realizadas

### Autenticação e base

- Login por JWT.
- Refresh token no frontend.
- Endpoint `/accounts/me/`.
- Troca de senha.
- Forçar troca de senha no primeiro acesso.
- Proteção de rotas frontend.
- Layouts separados para Admin e Player.

### Admin

- Dashboard administrativo.
- Cadastro/listagem de jogadores.
- Ativar/inativar jogador.
- Resetar senha de jogador.
- Cadastro/listagem de grupos.
- Adicionar/remover jogador no grupo.
- Cadastro/listagem de jogos.
- Gerar rodadas.
- Gestão de cartas.
- Gestão de jogadas.
- Gestão de evidências.
- Relatórios.
- Configurações.

### Player

- Home do jogador.
- Visualização de jogo/rodada.
- Jogada de carta.
- Envio de evidência.
- Desempenho.
- Ranking.
- Configurações.

### Deploy

- Planejamento para VPS Hostinger.
- PostgreSQL sem Docker.
- Django + Gunicorn.
- Next.js com `npm run build` e `npm run start`.
- Nginx como proxy reverso.
- Comando global `deploy-cartada`.

---

# Próximas fases

## Passo 46 — Melhorar experiência de jogar carta

### Objetivo

Melhorar a experiência do jogador em `/player/home`, tornando o fluxo mais claro, seguro e agradável.

### O que deve ser implementado

- Exibir rodada ativa em destaque.
- Exibir status do jogador na rodada.
- Listar cartas disponíveis com melhor visual.
- Permitir visualizar detalhes da carta antes de jogar.
- Criar confirmação antes de jogar carta.
- Impedir múltiplos cliques durante a requisição.
- Após jogar, mostrar carta jogada.
- Após jogar, indicar próximo passo: envio de evidência.
- Exibir mensagens claras de sucesso/erro.
- Criar estado vazio quando não houver rodada ativa.

### Arquivos prováveis

```txt
frontend/src/app/player/home/page.tsx
frontend/src/app/player/home/PlayerHomePage.module.css
frontend/src/services/playService.ts
frontend/src/services/cardService.ts
frontend/src/services/roundService.ts
frontend/src/types/plays.ts
frontend/src/types/cards.ts
frontend/src/types/games.ts
```

### Cuidados

- Não alterar backend inicialmente, salvo incompatibilidade real de contrato.
- Não duplicar services.
- Não criar rota nova se a existente for suficiente.
- Garantir que o fluxo continue funcionando com usuário PLAYER.

### Critérios de aceite

- PLAYER consegue abrir `/player/home`.
- PLAYER vê a rodada ativa.
- PLAYER consegue visualizar detalhes da carta.
- PLAYER consegue confirmar a jogada.
- PLAYER não consegue clicar várias vezes gerando duplicidade.
- Após jogar, a tela mostra a carta jogada.
- O próximo passo para evidência fica claro.
- Build do frontend passa.

### Commit sugerido

```bash
git add .
git commit -m "feat: improve player card play experience"
```

---

## Passo 47 — Melhorar envio de evidências

### Objetivo

Melhorar o fluxo de envio de evidência pelo jogador.

### O que deve ser implementado

- Melhorar formulário de evidência.
- Mostrar status da evidência.
- Validar arquivo antes do envio.
- Exibir tamanho máximo permitido.
- Exibir preview quando for imagem.
- Mostrar histórico de evidências do jogador.
- Melhorar mensagens de erro.
- Impedir envio duplicado durante upload.

### Arquivos prováveis

```txt
frontend/src/app/player/home/page.tsx
frontend/src/app/player/home/PlayerHomePage.module.css
frontend/src/services/evidenceService.ts
frontend/src/types/evidences.ts
backend/apps/evidences/
```

### Critérios de aceite

- PLAYER consegue enviar evidência.
- PLAYER vê status da evidência.
- Erros de arquivo são claros.
- Upload não duplica.
- Admin consegue revisar.

### Commit sugerido

```bash
git add .
git commit -m "feat: improve evidence submission flow"
```

---

## Passo 48 — Revisar permissões do backend

### Objetivo

Garantir segurança entre perfis ADMIN e PLAYER.

### O que deve ser revisado

- ViewSets de jogadores.
- ViewSets de grupos.
- ViewSets de jogos.
- ViewSets de rodadas.
- ViewSets de cartas.
- ViewSets de jogadas.
- ViewSets de evidências.
- Relatórios.
- Endpoints customizados com `@action`.

### Regras

ADMIN:

- pode ver tudo;
- pode criar/editar/inativar recursos;
- pode revisar evidências;
- pode exportar relatórios.

PLAYER:

- só pode ver os próprios dados;
- só pode jogar por si mesmo;
- só pode enviar evidência da própria jogada;
- não pode acessar relatórios administrativos.

### Arquivos prováveis

```txt
backend/apps/*/views.py
backend/apps/*/permissions.py
backend/apps/*/serializers.py
```

### Critérios de aceite

- PLAYER não acessa dados de outro jogador.
- ADMIN mantém acesso completo.
- Endpoints administrativos negam acesso para PLAYER.
- Endpoints do jogador filtram por usuário autenticado.

### Commit sugerido

```bash
git add .
git commit -m "fix: harden backend role permissions"
```

---

## Passo 49 — Criar seeds e dados iniciais

### Objetivo

Facilitar testes locais e demonstração.

### O que deve ser criado

- Comando Django para criar dados iniciais.
- Usuário admin de teste.
- Jogador de teste.
- Grupo de teste.
- Cartas iniciais.
- Jogo de teste.
- Rodadas de teste.

### Arquivo recomendado

```txt
backend/apps/core/management/commands/seed_demo.py
```

Se não existir app `core`, criar o comando em app mais adequado ou criar app `core` apenas para utilidades.

### Comando esperado

```bash
python manage.py seed_demo
```

### Critérios de aceite

- Ambiente novo consegue ser populado rapidamente.
- Dados não são duplicados se o comando for rodado mais de uma vez.
- Usuários de teste ficam documentados.

### Commit sugerido

```bash
git add .
git commit -m "feat: add demo seed command"
```

---

## Passo 50 — Polimento visual e responsivo

### Objetivo

Melhorar acabamento visual e usabilidade.

### O que deve ser revisado

- Landing page.
- Login.
- Dashboard admin.
- Menus admin/player.
- Tabelas.
- Cards.
- Modais.
- Formulários.
- Mobile.
- Estados vazios.
- Estados de carregamento.
- Mensagens de erro.

### Critérios de aceite

- Layout não quebra em celular.
- Botões são claros.
- Tabelas são navegáveis.
- Páginas principais possuem feedback de loading/erro.

### Commit sugerido

```bash
git add .
git commit -m "style: polish responsive interface"
```

---

## Passo 51 — Preparação final de deploy

### Objetivo

Consolidar produção por IP e preparar domínio/HTTPS.

### O que deve ser revisado

- `.env.example` do backend.
- `.env.example` do frontend.
- `DEPLOYMENT.md`.
- Script `deploy-cartada`.
- Configuração Nginx.
- Serviços systemd.
- Django Admin em `/django-admin/`.
- API pelo prefixo `/api/v1`.
- Build do Next.
- Staticfiles do Django.
- Upload/media.

### Critérios de aceite

- Deploy por IP funciona.
- Login funciona em produção.
- Admin Next funciona.
- Player funciona.
- API funciona.
- Django Admin funciona em `/django-admin/`.
- Deploy incremental funciona com `deploy-cartada`.

### Commit sugerido

```bash
git add .
git commit -m "chore: prepare production deployment"
```

---

# Orientação para o Codex

Para cada passo, usar prompt como:

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.
Execute apenas o Passo XX.
Antes de alterar, inspecione os arquivos existentes relacionados.
Mantenha os padrões atuais do projeto.
Não altere backend se a tarefa for apenas frontend, salvo incompatibilidade real.
Ao final, informe arquivos alterados, resumo das mudanças e comandos de teste.
```

---

# Ordem recomendada

1. Passo 46.
2. Passo 47.
3. Passo 48.
4. Passo 49.
5. Passo 50.
6. Passo 51.

Não iniciar Passo 48 antes de validar os fluxos principais do PLAYER, porque a revisão de permissão pode bloquear fluxo que ainda precise ser ajustado.
