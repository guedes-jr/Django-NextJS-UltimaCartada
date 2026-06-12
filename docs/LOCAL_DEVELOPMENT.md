# LOCAL_DEVELOPMENT.md — Desenvolvimento local

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Limpar erro de cache do Next.js

Quando ocorrer erro como:

```txt
Cannot find module .next/dev/server/middleware-manifest.json
ENOENT .next/dev/server/pages-manifest.json
```

Rodar:

```bash
cd frontend
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
rm -rf .next
npm run dev
```

Se continuar:

```bash
cd frontend
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
rm -rf .next node_modules
npm install
npm run dev
```

## Node

Usar Node 20 ou 22.

Com nvm:

```bash
nvm install 22
nvm use 22
```

## Validações antes de commit

Backend:

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py migrate
```

Frontend:

```bash
cd frontend
npm run build
```
