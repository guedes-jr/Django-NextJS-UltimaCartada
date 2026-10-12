# AGENTS.md — Cartada Viva / A Última Cartada

## Contexto e leitura

Aplicação Django + DRF + PostgreSQL e Next.js App Router + TypeScript + CSS Modules. Preserve a stack, URLs consumidas e funcionalidades existentes.

Antes de alterar:
1. Leia `PROJECT_CONTEXT.md` e `IMPLEMENTATION_PLAN.md`.
2. Consulte `ia/architecture.md` e somente os guias de domínio necessários em `ia/README.md`.
3. Leia as instruções locais em `backend/AGENTS.md` ou `frontend/AGENTS.md` e inspecione código, contratos e testes relacionados.
4. Confira `git status --short`; preserve alterações pré-existentes do usuário.

`IMPLEMENTATION_PLAN.md` é o único backlog ativo. `docs/archive/planning/` guarda histórico, não tarefas atuais. `doc/ANALISE_DE_ADERENCIA.md` é uma auditoria datada: revalide suas afirmações antes de usá-las. Instruções do usuário prevalecem sobre recomendações destes documentos.

## Regras obrigatórias

- Faça alterações incrementais e dentro do escopo; reutilize services, componentes e tipos existentes.
- Não adicione Tailwind, não substitua Django/Next.js e não crie outra camada de API.
- Frontend: HTTP em `src/services` usando `src/lib/api.ts`; sessão em `src/lib/auth.ts`; tipos em `src/types`; estilos locais em CSS Modules.
- Backend: apps por domínio; serializers explícitos; CRUD com ViewSets; fluxos complexos nos services existentes; queryset e ações filtrados por papel, usuário, grupo e produto.
- Não simplifique papéis para ADMIN/PLAYER. Existem `DEV`, `GENERAL_ADMIN`, `GAME_MEDIATOR`, `ADMIN` legado e `PLAYER`; consulte `User` e os helpers atuais.
- `PlayerGroup.players` aponta para `PlayerProfile`: quando filtrar por usuário, use `players__user=user`. Mediador acessa os grupos vinculados, conforme regra do endpoint.
- Proteção React não substitui autorização Django. Dados compartilhados de grupo exigem regra explícita; dados individuais permanecem restritos.
- Não renomeie endpoints nem altere payloads sem verificar URLs Django, serializers, services e consumidores.
- Django Admin usa `/django-admin/`; `/admin/...` pertence ao Next.js. Produção usa `NEXT_PUBLIC_API_URL=/api/v1` via Nginx.
- Não invente regras clínicas, editoriais, comerciais ou de pontuação. Registre decisões pendentes no backlog.
- Não versione segredos, `.env*` reais, `.venv/`, `node_modules/`, `.next/`, `__pycache__/`, bancos, uploads, `media/`, `staticfiles/` ou `.DS_Store`. Use `.env.example` sem segredos.

## Fluxo de entrega

1. Defina um recorte com comportamento esperado e critério de aceite verificável.
2. Rastreie o fluxo afetado de ponta a ponta antes de editar.
3. Implemente o menor ajuste funcional e preserve contratos existentes.
4. Execute validações proporcionais ao impacto; inclua testes de autorização, transação ou pontuação quando essas regras mudarem.
5. Revise o diff e atualize somente a documentação afetada.
6. Informe arquivos alterados, resultado, comandos realmente executados e limitações. Não declare testes aprovados sem execução.

Commit, push e deploy seguem o pedido do usuário; não fazem parte automática de toda tarefa. `migrate` aplica mudanças no banco e `seed_demo` altera dados: não são verificações de leitura. Use apenas em ambiente apropriado para a tarefa.

## Validação

Backend (com ambiente Python configurado e PostgreSQL disponível):
```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test apps.<dominio>
```
Frontend (com dependências instaladas):
```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```
Documentação: `git diff --check` e conferência de links/caminhos locais. Não instalar dependências nem executar a aplicação apenas para editar texto. Testes Django usam banco de teste; confirme permissões de criação no PostgreSQL.

## Manutenção do contexto

Mantenha aqui regras estáveis e curtas; arquitetura em `ia/architecture.md`, contexto funcional em `PROJECT_CONTEXT.md`, pendências em `IMPLEMENTATION_PLAN.md`, prompts em `docs/CODEX_PROMPTS.md`. Remova tarefas concluídas do backlog somente com evidência registrada em `docs/PROJECT_AUDIT.md`. Diferencie implementação encontrada, teste executado e aceite em produção.
