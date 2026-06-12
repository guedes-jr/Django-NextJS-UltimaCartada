# Última Cartada

Aplicação web para digitalização e gerenciamento do jogo **Última Cartada**, uma dinâmica gamificada voltada ao desenvolvimento de hábitos saudáveis, acompanhamento de jogadores e controle de desempenho individual e em grupo.

O projeto utiliza **Django REST Framework** no backend, **PostgreSQL** como banco de dados e **Next.js** no frontend.

---

## Objetivo

O sistema foi pensado para apoiar a aplicação do jogo por uma administradora/psicóloga, permitindo:

- Gerenciar jogadores.
- Gerenciar cartas do jogo.
- Criar grupos.
- Criar desafios/jogos.
- Controlar rodadas.
- Registrar jogadas.
- Receber evidências das tarefas realizadas.
- Calcular pontuações.
- Acompanhar desempenho individual.
- Acompanhar desempenho do grupo.
- Exibir rankings e relatórios.

---

## Stack utilizada

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- django-cors-headers
- python-decouple
- Pillow
- django-cleanup

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- CSS Global
- Axios
- React Hook Form
- Zod
- Lucide React
- Recharts

---

## Estrutura do projeto

```txt
Django-NextJS-UltimaCartada/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── players/
│   │   ├── groups/
│   │   ├── cards/
│   │   ├── games/
│   │   ├── rounds/
│   │   ├── plays/
│   │   ├── evidences/
│   │   ├── scoring/
│   │   └── dashboard/
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── .gitignore
└── README.md
```

---

## Perfis de usuário

O sistema trabalha inicialmente com dois perfis:

### ADMIN

Responsável por gerenciar o jogo.

Pode:

- Gerenciar jogadores.
- Gerenciar grupos.
- Gerenciar cartas.
- Criar jogos/desafios.
- Acompanhar rodadas.
- Validar evidências.
- Ajustar pontuação.
- Ver rankings e relatórios.

### PLAYER

Participante do jogo.

Pode:

- Acessar o jogo ativo.
- Jogar cartas.
- Enviar evidências.
- Acompanhar sua pontuação.
- Ver seu histórico de participação.

---

## Regras principais do jogo

O jogo é dividido em rodadas diárias.

Regras previstas para implementação:

- Cada dia possui rodadas com horários configuráveis.
- A primeira pessoa que jogar em uma rodada define o naipe da rodada.
- Os demais jogadores só podem jogar cartas do mesmo naipe.
- Cada jogador pode jogar uma vez por rodada.
- Cada jogador pode iniciar um número limitado de rodadas por dia.
- O sistema deve impedir repetição de naipes no mesmo dia, conforme configuração.
- A pontuação pode ser calculada de forma automática ao final da rodada.
- Evidências aprovadas podem gerar pontos extras.

---

## Pontuação base

| Condição | Pontos |
|---|---:|
| Menor carta da rodada | 1 |
| Carta intermediária | 2 |
| Maior carta da rodada | 3 |
| Não jogar | 0 |
| Jogada inválida | 0 |
| Evidência aprovada | +3 |

Os valores devem ser configuráveis no painel administrativo em uma etapa futura.

---

## Configuração do backend

### 1. Acessar a pasta do backend

```bash
cd backend
```

### 2. Criar ambiente virtual

```bash
python3 -m venv venv
```

### 3. Ativar ambiente virtual

macOS/Linux:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

### 4. Instalar dependências

```bash
pip install -r requirements.txt
```

Caso ainda não exista `requirements.txt`, instale manualmente:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary python-decouple pillow django-cleanup
pip freeze > requirements.txt
```

---

## Configuração do PostgreSQL

### 1. Criar banco e usuário

Acesse o PostgreSQL:

```bash
psql postgres
```

Execute:

```sql
CREATE USER ultima_cartada_user WITH PASSWORD 'sua_senha_forte_aqui';

CREATE DATABASE ultima_cartada_db OWNER ultima_cartada_user;

GRANT ALL PRIVILEGES ON DATABASE ultima_cartada_db TO ultima_cartada_user;

\c ultima_cartada_db

GRANT ALL ON SCHEMA public TO ultima_cartada_user;

\q
```

---

## Variáveis de ambiente do backend

Crie o arquivo:

```bash
backend/.env
```

Exemplo:

```env
SECRET_KEY=sua_secret_key_django_aqui
DEBUG=True

ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=ultima_cartada_db
DB_USER=ultima_cartada_user
DB_PASSWORD=sua_senha_forte_aqui
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Atenção: o arquivo `.env` não deve ser versionado.

---

## Rodar migrations

Dentro da pasta `backend`:

```bash
python manage.py makemigrations
python manage.py migrate
```

Caso esteja criando o usuário customizado pela primeira vez, gere primeiro a migration do app `accounts`:

```bash
python manage.py makemigrations accounts
python manage.py migrate
```

---

## Criar superusuário

```bash
python manage.py createsuperuser
```

Depois de criar o usuário, acesse o Django Admin e altere o campo `role` para:

```txt
ADMIN
```

---

## Rodar backend

```bash
python manage.py runserver
```

Backend disponível em:

```txt
http://127.0.0.1:8000
```

Painel Django Admin:

```txt
http://127.0.0.1:8000/admin/
```

---

## Endpoints iniciais

### Login JWT

```txt
POST /api/v1/auth/token/
```

Payload:

```json
{
  "username": "admin",
  "password": "sua_senha"
}
```

Resposta esperada:

```json
{
  "refresh": "refresh_token",
  "access": "access_token"
}
```

### Refresh token

```txt
POST /api/v1/auth/token/refresh/
```

Payload:

```json
{
  "refresh": "refresh_token"
}
```

---

## Configuração do frontend

### 1. Acessar a pasta do frontend

```bash
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

Caso ainda precise instalar as dependências principais:

```bash
npm install axios react-hook-form zod @hookform/resolvers lucide-react recharts
```

---

## Variáveis de ambiente do frontend

Crie o arquivo:

```bash
frontend/.env.local
```

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Atenção: arquivos `.env.local` não devem ser versionados.

---

## Rodar frontend

Dentro da pasta `frontend`:

```bash
npm run dev
```

Frontend disponível em:

```txt
http://localhost:3000
```

---

## Fluxo de desenvolvimento recomendado

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

---

## Autenticação

A autenticação inicial será feita com:

- Usuário e senha
- JWT

Também está prevista autenticação com Google/Gmail.

Regra de segurança recomendada:

- Usuário criado automaticamente via Google deve nascer como `PLAYER`.
- Apenas um `ADMIN` pode transformar outro usuário em `ADMIN`.

---

## Apps do backend

### accounts

Responsável por usuários, autenticação e perfis.

### players

Responsável pelos dados complementares dos jogadores.

### groups

Responsável pela organização dos jogadores em grupos.

### cards

Responsável pelo cadastro das cartas, naipes e tarefas.

### games

Responsável pelos desafios/jogos ativos.

### rounds

Responsável pelas rodadas de cada jogo.

### plays

Responsável pelo registro das jogadas.

### evidences

Responsável pelo envio e validação de evidências.

### scoring

Responsável pelos cálculos de pontuação.

### dashboard

Responsável por consultas e dados consolidados para painéis.

---

## Próximas etapas de implementação

- [ ] Finalizar usuário customizado.
- [ ] Registrar usuário no Django Admin.
- [ ] Criar API de autenticação customizada.
- [ ] Criar models de jogadores.
- [ ] Criar models de grupos.
- [ ] Criar models de cartas e naipes.
- [ ] Importar imagens das cartas.
- [ ] Criar models de jogos.
- [ ] Criar models de rodadas.
- [ ] Criar registro de jogadas.
- [ ] Criar cálculo de pontuação.
- [ ] Criar envio de evidências.
- [ ] Criar dashboard administrativo.
- [ ] Criar frontend de login.
- [ ] Criar frontend do painel ADMIN.
- [ ] Criar frontend do painel PLAYER.
- [ ] Criar rankings.
- [ ] Criar relatórios.

---

## Convenções do projeto

### Backend

- Código organizado por apps.
- Regras de negócio devem ficar preferencialmente em services.
- Serializers devem cuidar da entrada e saída da API.
- Views/ViewSets devem ser simples.
- Permissões devem separar claramente `ADMIN` e `PLAYER`.
- Dados sensíveis não devem ser expostos na API.

### Frontend

- Não usar Tailwind CSS.
- Usar CSS Modules e CSS global.
- Criar componentes reutilizáveis.
- Centralizar chamadas HTTP em `src/lib/api.ts`.
- Separar telas de ADMIN e PLAYER.
- Evitar duplicação de lógica.

---

## Cuidados de segurança

- Não versionar `.env`.
- Não versionar banco SQLite.
- Não expor senha do banco.
- Não expor `SECRET_KEY`.
- Usar HTTPS em produção.
- Proteger uploads de evidências.
- Paciente deve acessar apenas seus próprios dados.
- Registrar alterações manuais de pontuação.

---

## Deploy previsto

Stack sugerida para produção:

- Ubuntu Server
- Nginx
- Gunicorn
- PostgreSQL
- Django
- Next.js
- Certbot SSL

Fluxo esperado:

```txt
Cliente
↓
Nginx
↓
Frontend Next.js
↓
API Django
↓
PostgreSQL
```

---

## Observação sobre dados clínicos

Este sistema é uma ferramenta de apoio à organização e gamificação de hábitos saudáveis.

Não é recomendado armazenar diagnósticos, prontuários ou informações clínicas sensíveis sem uma estrutura adequada de segurança, consentimento e conformidade legal.

---

## Status atual

Projeto em fase inicial de implementação.

Primeira etapa:

- Configuração do backend Django.
- Configuração do PostgreSQL.
- Criação de usuário customizado.
- Preparação da autenticação.
- Estruturação inicial dos apps.

# Pacote de contexto para Codex — Cartada Viva / A Última Cartada

Este ZIP contém arquivos de orientação para serem adicionados ao repositório `Django-NextJS-UltimaCartada`.

## Arquivos principais

- `AGENTS.md`: instruções principais para agentes de IA.
- `PROJECT_CONTEXT.md`: contexto funcional do sistema.
- `IMPLEMENTATION_PLAN.md`: plano completo de continuidade.
- `DEPLOYMENT.md`: documentação de deploy em VPS.
- `docs/CODEX_PROMPTS.md`: prompts prontos para usar no Codex.
- `docs/LOCAL_DEVELOPMENT.md`: comandos de desenvolvimento local.
- `docs/PRODUCTION_CHECKLIST.md`: checklist de produção.
- `docs/GIT_WORKFLOW.md`: fluxo de trabalho com Git.
- `scripts/deploy-cartada`: script base de atualização no servidor.
- `backend/.env.example`: exemplo de variáveis do backend.
- `frontend/.env.example`: exemplo de variáveis do frontend.

## Como aplicar no projeto

Copie os arquivos para a raiz do repositório, preservando a estrutura de pastas:

```bash
cp -R codex_context_cartada_viva/* /caminho/do/Django-NextJS-UltimaCartada/
```

Depois commite:

```bash
git add AGENTS.md PROJECT_CONTEXT.md IMPLEMENTATION_PLAN.md DEPLOYMENT.md docs scripts backend/.env.example frontend/.env.example
git commit -m "docs: add project context for codex"
git push origin main
```

## Como usar no Codex

Prompt recomendado:

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.
Execute apenas o Passo 46.
Antes de alterar, inspecione os arquivos existentes relacionados.
Mantenha os padrões atuais do projeto.
Ao final, informe arquivos alterados, resumo das mudanças e comandos de teste.
```
