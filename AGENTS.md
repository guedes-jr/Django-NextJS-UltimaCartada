# AGENTS.md — Instruções para agentes de IA

## Projeto

Nome: Cartada Viva / A Última Cartada  
Repositório: `https://github.com/guedes-jr/Django-NextJS-UltimaCartada`  
Stack: Django + Django REST Framework + PostgreSQL + Next.js + TypeScript + CSS Modules  
Objetivo: sistema web para gerenciamento de um jogo terapêutico de hábitos, com área administrativa, área do jogador, rodadas, cartas, jogadas, evidências, ranking e relatórios.

Este arquivo deve ser lido antes de qualquer alteração no projeto.

---

## Estrutura geral

```txt
Django-NextJS-UltimaCartada/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── players/
│   │   ├── groups/
│   │   ├── games/
│   │   ├── cards/
│   │   ├── plays/
│   │   └── evidences/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   ├── services/
    │   └── types/
    ├── package.json
    └── next.config.ts
```

---

## Regras obrigatórias

1. Não alterar a stack principal do projeto.
2. Não adicionar Tailwind CSS.
3. Não substituir Django por outro backend.
4. Não substituir Next.js por Vite, React puro ou outra stack.
5. Usar CSS Modules no frontend.
6. Manter TypeScript no frontend.
7. Não criar services duplicados quando já existir service equivalente.
8. Não usar `fetch` diretamente nas páginas se já existe `src/lib/api.ts` com Axios.
9. Não remover funcionalidades existentes sem justificativa clara.
10. Não quebrar URLs já consumidas pelo frontend.
11. Não commitar arquivos sensíveis ou gerados.
12. Fazer alterações incrementais e pequenas.
13. Antes de alterar, inspecionar os arquivos existentes relacionados à tarefa.
14. Ao final de cada tarefa, informar arquivos alterados e comandos de teste.

---

## Arquivos que nunca devem ser commitados

```txt
.env
.env.local
.env.production
.venv/
node_modules/
.next/
__pycache__/
*.sqlite3
media/
staticfiles/
.DS_Store
```

Use `.env.example` para documentar variáveis, mas nunca inclua segredos reais.

---

## Padrões do frontend

### Rotas

- Rotas públicas ficam em `frontend/src/app/`.
- Área admin fica em `frontend/src/app/admin/...`.
- Área player fica em `frontend/src/app/player/...`.
- Login fica em `frontend/src/app/login`.
- Landing page pública fica em `frontend/src/app/page.tsx`.

### Layouts

- Telas administrativas devem usar `AdminLayout`.
- Telas do jogador devem usar `PlayerLayout`.
- Rotas protegidas devem usar `ProtectedRoute`.

### Services

- Services ficam em `frontend/src/services`.
- Types ficam em `frontend/src/types`.
- Chamadas HTTP devem usar `frontend/src/lib/api.ts`.
- Regras de token devem usar `frontend/src/lib/auth.ts`.

### CSS

- Cada tela deve usar CSS Module próprio quando necessário.
- Não usar CSS global para estilos de tela específica.
- CSS global deve ser usado apenas para variáveis, reset, fontes e regras realmente globais.

### Padrão visual

- Manter visual limpo, responsivo e com cards.
- Evitar tabelas quebradas no mobile.
- Criar estados vazios claros.
- Mostrar feedback de carregamento e erro.
- Evitar múltiplos cliques em botões de ação.

---

## Padrões do backend

### Django REST Framework

- Usar ViewSets para CRUD.
- Usar serializers explícitos.
- Usar permissions por papel quando necessário.
- Usar `select_related` e `prefetch_related` em relações para evitar N+1.
- Evitar lógica pesada dentro de serializers.
- Manter QuerySets filtrados por usuário quando for PLAYER.

### Perfis

Papéis principais:

- `ADMIN`
- `PLAYER`

Regras:

- ADMIN pode gerenciar cadastros e visualizar dados gerais.
- PLAYER só pode visualizar e manipular os próprios dados.
- PLAYER nunca deve acessar dados de outro jogador.

### Relações importantes

- Jogador tem `User` e `PlayerProfile`.
- Grupo possui jogadores via `PlayerProfile`.
- Jogo pertence a um grupo.
- Rodada pertence a um jogo.
- Jogada pertence a jogador, grupo, jogo, rodada e carta.
- Evidência pertence a uma jogada.

Atenção: em alguns pontos, a relação do grupo com jogadores usa `PlayerProfile`, portanto filtros devem considerar `players__user=user` quando necessário.

---

## Rotas importantes do backend

As rotas podem variar conforme os arquivos de URL, mas o padrão esperado é:

```txt
/api/v1/accounts/
/api/v1/accounts/me/
/api/v1/accounts/change-password/
/api/v1/players/players/
/api/v1/groups/groups/
/api/v1/games/games/
/api/v1/games/rounds/
/api/v1/cards/cards/
/api/v1/plays/
/api/v1/evidences/
/api/v1/token/
/api/v1/token/refresh/
```

Antes de alterar qualquer service no frontend, confirmar a URL real no backend.

---

## Rotas importantes do frontend

```txt
/
/login
/admin/dashboard
/admin/players
/admin/groups
/admin/games
/admin/rounds
/admin/cards
/admin/plays
/admin/evidences
/admin/performance
/admin/reports
/admin/settings
/player/home
/player/performance
/player/ranking
/player/settings
```

---

## Conflito de rotas: Django Admin x Next Admin

O painel administrativo do Next.js usa:

```txt
/admin/...
```

Por isso o Django Admin não deve usar `/admin/` em produção.

Usar:

```txt
/django-admin/
```

No backend:

```python
path("django-admin/", admin.site.urls)
```

No Nginx:

```nginx
location /django-admin/ {
    proxy_pass http://127.0.0.1:8000/django-admin/;
}
```

---

## Variáveis do frontend

Em produção, usar:

```env
NEXT_PUBLIC_API_URL=/api/v1
```

O Nginx deve encaminhar `/api/` para o Django:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
}
```

---

## Comandos locais

Backend:

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm run dev
```

Build do frontend:

```bash
cd frontend
npm run build
```

Validação do backend:

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py migrate
```

---

## Deploy esperado

Servidor:

```txt
/var/www/cartada-viva/
├── backend/
└── frontend/
```

Serviços:

```txt
cartada-viva-backend
cartada-viva-frontend
```

Comando global de atualização:

```bash
deploy-cartada
```

---

## Como executar uma tarefa

Ao receber uma tarefa:

1. Ler este arquivo.
2. Ler `PROJECT_CONTEXT.md`.
3. Ler `IMPLEMENTATION_PLAN.md`.
4. Inspecionar arquivos existentes relacionados.
5. Fazer a menor alteração funcional possível.
6. Manter padrões atuais.
7. Rodar validações possíveis.
8. Informar arquivos alterados.
9. Informar comandos de teste.

---

## Próximas fases planejadas

1. Melhorar experiência do jogador ao jogar carta.
2. Melhorar envio de evidências.
3. Revisar permissões do backend.
4. Criar seeds/dados iniciais.
5. Melhorar responsividade geral.
6. Preparar deploy final com domínio e HTTPS.
