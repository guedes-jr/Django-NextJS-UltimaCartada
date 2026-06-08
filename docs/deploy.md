Perfeito. Abaixo está a versão adaptada para **este projeto**, considerando o que vimos até agora:

```txt
Projeto: Cartada Viva / Ultima Cartada
Stack: Django + Django REST Framework + PostgreSQL + Next.js
Deploy: VPS Hostinger Ubuntu
Backend: Django + Gunicorn
Frontend: Next.js com npm run build + npm run start
Proxy: Nginx
Acesso inicial: direto pelo IP, sem domínio
```

Vou considerar a estrutura:

```txt
/var/www/cartada-viva/
├── backend/
└── frontend/
```

---

# Deploy em VPS Hostinger — Cartada Viva

## Fase 1 — Preparar servidor

Acesse sua VPS:

```bash
ssh root@IP_DA_VPS
```

Atualize o sistema:

```bash
apt update && apt upgrade -y
```

Instale dependências:

```bash
apt install -y \
  python3 \
  python3-venv \
  python3-pip \
  postgresql \
  postgresql-contrib \
  nginx \
  git \
  curl \
  unzip \
  build-essential
```

Instale Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

Confirme versões:

```bash
python3 --version
node -v
npm -v
psql --version
nginx -v
```

---

# Fase 2 — Criar usuário de deploy

Crie o usuário:

```bash
adduser deploy
usermod -aG sudo deploy
```

Entre com ele:

```bash
su - deploy
```

Crie a pasta do projeto:

```bash
sudo mkdir -p /var/www/cartada-viva
sudo chown -R deploy:deploy /var/www/cartada-viva
```

---

# Fase 3 — Enviar ou clonar o projeto

## Opção A — Clonar via Git

```bash
cd /var/www/cartada-viva
git clone URL_DO_REPOSITORIO .
```

## Opção B — Enviar ZIP do projeto

No seu computador local:

```bash
scp projeto.zip deploy@IP_DA_VPS:/var/www/cartada-viva/
```

Na VPS:

```bash
cd /var/www/cartada-viva
unzip projeto.zip
```

A estrutura final precisa ficar assim:

```txt
/var/www/cartada-viva/backend
/var/www/cartada-viva/frontend
```

Confira:

```bash
ls -la /var/www/cartada-viva
```

---

# Fase 4 — Criar banco PostgreSQL

Entre no PostgreSQL:

```bash
sudo -u postgres psql
```

Crie banco e usuário:

```sql
CREATE DATABASE cartada_viva_db;
CREATE USER cartada_viva_user WITH PASSWORD 'SENHA_FORTE_AQUI';
ALTER ROLE cartada_viva_user SET client_encoding TO 'utf8';
ALTER ROLE cartada_viva_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE cartada_viva_user SET timezone TO 'America/Sao_Paulo';
GRANT ALL PRIVILEGES ON DATABASE cartada_viva_db TO cartada_viva_user;
```

Para PostgreSQL 15+, rode também:

```sql
\c cartada_viva_db
GRANT ALL ON SCHEMA public TO cartada_viva_user;
```

Saia:

```sql
\q
```

Teste conexão:

```bash
psql -h 127.0.0.1 -U cartada_viva_user -d cartada_viva_db
```

---

# Fase 5 — Configurar backend Django

Entre no backend:

```bash
cd /var/www/cartada-viva/backend
```

Crie o ambiente virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instale dependências:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Se `gunicorn` não estiver no `requirements.txt`:

```bash
pip install gunicorn
pip freeze > requirements.txt
```

---

# Fase 6 — Criar `.env` do backend

Crie:

```bash
nano /var/www/cartada-viva/backend/.env
```

Conteúdo base:

```env
DEBUG=False
SECRET_KEY=COLE_UMA_SECRET_KEY_FORTE_AQUI

ALLOWED_HOSTS=IP_DA_VPS,localhost,127.0.0.1

DB_NAME=cartada_viva_db
DB_USER=cartada_viva_user
DB_PASSWORD=SENHA_FORTE_AQUI
DB_HOST=127.0.0.1
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://IP_DA_VPS
CSRF_TRUSTED_ORIGINS=http://IP_DA_VPS
```

Gere uma `SECRET_KEY` forte:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Cole o resultado no `.env`.

---

# Fase 7 — Rodar migrations e arquivos estáticos

Ainda no backend:

```bash
source .venv/bin/activate
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
```

Crie o superusuário:

```bash
python manage.py createsuperuser
```

Teste o backend com Gunicorn:

```bash
gunicorn config.wsgi:application --bind 127.0.0.1:8000
```

Em outro terminal:

```bash
curl -I http://127.0.0.1:8000/admin/
```

Se responder, pare o Gunicorn com:

```bash
CTRL + C
```

---

# Fase 8 — Criar serviço systemd do backend

Crie:

```bash
sudo nano /etc/systemd/system/cartada-viva-backend.service
```

Conteúdo:

```ini
[Unit]
Description=Cartada Viva Django Backend
After=network.target postgresql.service

[Service]
User=deploy
Group=www-data
WorkingDirectory=/var/www/cartada-viva/backend
Environment="PATH=/var/www/cartada-viva/backend/.venv/bin"
ExecStart=/var/www/cartada-viva/backend/.venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 2 --timeout 120
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cartada-viva-backend
sudo systemctl start cartada-viva-backend
sudo systemctl status cartada-viva-backend
```

Logs:

```bash
sudo journalctl -u cartada-viva-backend -f
```

---

# Fase 9 — Configurar frontend Next.js

Entre no frontend:

```bash
cd /var/www/cartada-viva/frontend
```

Instale dependências:

```bash
npm install
```

Crie `.env.production`:

```bash
nano .env.production
```

Use:

```env
NEXT_PUBLIC_API_URL=http://IP_DA_VPS/api/v1
```

Se seu `frontend/src/lib/api.ts` estiver usando uma URL relativa, você também pode usar:

```env
NEXT_PUBLIC_API_URL=/api/v1
```

Minha recomendação para acesso direto por IP é usar:

```env
NEXT_PUBLIC_API_URL=http://IP_DA_VPS/api/v1
```

Agora rode o build:

```bash
npm run build
```

Teste localmente:

```bash
npm run start
```

O Next deve subir na porta `3000`.

Pare com:

```bash
CTRL + C
```

---

# Fase 10 — Criar serviço systemd do frontend

Crie:

```bash
sudo nano /etc/systemd/system/cartada-viva-frontend.service
```

Conteúdo:

```ini
[Unit]
Description=Cartada Viva Next.js Frontend
After=network.target cartada-viva-backend.service

[Service]
User=deploy
WorkingDirectory=/var/www/cartada-viva/frontend
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start -- -H 127.0.0.1 -p 3000
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cartada-viva-frontend
sudo systemctl start cartada-viva-frontend
sudo systemctl status cartada-viva-frontend
```

Logs:

```bash
sudo journalctl -u cartada-viva-frontend -f
```

---

# Fase 11 — Configurar Nginx

Crie:

```bash
sudo nano /etc/nginx/sites-available/cartada-viva
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name IP_DA_VPS;

    client_max_body_size 20M;

    location /static/ {
        alias /var/www/cartada-viva/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/cartada-viva/backend/media/;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative:

```bash
sudo ln -s /etc/nginx/sites-available/cartada-viva /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

# Fase 12 — Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

# Fase 13 — Testes finais

Acesse no navegador:

```txt
http://IP_DA_VPS/
```

Teste:

```txt
[ ] Landing page abre em /
[ ] Login abre em /login
[ ] Admin Next abre em /admin/dashboard
[ ] Área do jogador abre em /player/home
[ ] Django Admin abre em /admin/
[ ] API responde em /api/v1/
[ ] Login JWT funciona
[ ] Criação de jogadores funciona
[ ] Criação de grupos funciona
[ ] Criação de jogos funciona
[ ] Geração de rodadas funciona
[ ] Jogador consegue jogar carta
[ ] Jogador consegue enviar evidência
[ ] Admin consegue revisar evidências
[ ] Ranking funciona
[ ] Relatórios CSV funcionam
```

---

# Comandos úteis de diagnóstico

## Status dos serviços

```bash
sudo systemctl status cartada-viva-backend
sudo systemctl status cartada-viva-frontend
sudo systemctl status nginx
```

## Logs backend

```bash
sudo journalctl -u cartada-viva-backend -f
```

## Logs frontend

```bash
sudo journalctl -u cartada-viva-frontend -f
```

## Logs Nginx

```bash
sudo tail -f /var/log/nginx/error.log
```

## Ver portas abertas

```bash
sudo ss -tulpn | grep -E '8000|3000|80|443'
```

## Testar backend localmente

```bash
curl -I http://127.0.0.1:8000/admin/
curl -I http://127.0.0.1:8000/api/v1/accounts/me/
```

## Testar frontend localmente

```bash
curl -I http://127.0.0.1:3000
```

## Testar via Nginx

```bash
curl -I http://IP_DA_VPS/
curl -I http://IP_DA_VPS/login
curl -I http://IP_DA_VPS/admin/
curl -I http://IP_DA_VPS/api/v1/
```

---

# Fase 14 — Fluxo de atualização do projeto

Quando fizer alterações localmente:

```bash
git add .
git commit -m "feat: ajustes de produção"
git archive --format=zip --output=projeto.zip --prefix=cartada-viva/ HEAD
scp projeto.zip deploy@IP_DA_VPS:/tmp/projeto.zip
```

Na VPS:

```bash
cd /var/www
rm -rf cartada-viva-new
mkdir cartada-viva-new
cd cartada-viva-new
unzip /tmp/projeto.zip

rsync -a --delete /var/www/cartada-viva-new/cartada-viva/ /var/www/cartada-viva/
```

Atualizar backend:

```bash
cd /var/www/cartada-viva/backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart cartada-viva-backend
```

Atualizar frontend:

```bash
cd /var/www/cartada-viva/frontend
npm install
npm run build
sudo systemctl restart cartada-viva-frontend
```

Recarregar Nginx, se alterou config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

# Pontos de atenção específicos deste projeto

## 1. Next.js precisa de build e start

Não basta:

```bash
npm run build
```

Também precisa manter rodando:

```bash
npm run start
```

Por isso criamos o serviço:

```txt
cartada-viva-frontend.service
```

---

## 2. Django Admin e rota Next `/admin`

Existe uma possível confusão:

```txt
/admin/              -> Django Admin
/admin/dashboard     -> Next.js Admin
```

Com a configuração atual do Nginx:

```nginx
location /admin/ {
    proxy_pass http://127.0.0.1:8000/admin/;
}
```

Tudo que começar com `/admin/` vai para o Django, então **isso quebra o painel admin do Next** em:

```txt
/admin/dashboard
```

Para este projeto, recomendo uma destas opções:

## Opção recomendada: mover Django Admin para `/django-admin/`

No `backend/config/urls.py`, altere:

```python
path("admin/", admin.site.urls),
```

para:

```python
path("django-admin/", admin.site.urls),
```

Depois ajuste o Nginx:

```nginx
location /django-admin/ {
    proxy_pass http://127.0.0.1:8000/django-admin/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

E deixe `/admin/dashboard` ir para o Next pelo bloco:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

Essa é a melhor opção para evitar conflito.

---

# Nginx recomendado sem conflito

Use este modelo final:

```nginx
server {
    listen 80;
    server_name IP_DA_VPS;

    client_max_body_size 20M;

    location /static/ {
        alias /var/www/cartada-viva/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/cartada-viva/backend/media/;
    }

    location /django-admin/ {
        proxy_pass http://127.0.0.1:8000/django-admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Depois o Django Admin será acessado por:

```txt
http://IP_DA_VPS/django-admin/
```

E o painel do sistema por:

```txt
http://IP_DA_VPS/admin/dashboard
```

---

# Checklist final

```md
- [ ] VPS atualizada
- [ ] Python instalado
- [ ] Node.js 22 instalado
- [ ] PostgreSQL instalado
- [ ] Nginx instalado
- [ ] Usuário deploy criado
- [ ] Projeto em `/var/www/cartada-viva`
- [ ] Banco `cartada_viva_db` criado
- [ ] Usuário `cartada_viva_user` criado
- [ ] `.env` do backend criado
- [ ] `.env.production` do frontend criado
- [ ] Migrations executadas
- [ ] Staticfiles coletados
- [ ] Superusuário criado
- [ ] Serviço backend criado
- [ ] Serviço frontend criado
- [ ] Nginx configurado
- [ ] Django Admin movido para `/django-admin/`
- [ ] Firewall configurado
- [ ] Landing testada
- [ ] Login testado
- [ ] Admin Next testado
- [ ] Player testado
- [ ] API testada
```

Resumo direto: para este projeto, o ponto mais crítico é **não usar `/admin/` para o Django Admin**, porque o seu painel Next também usa `/admin/...`. Mova o Django Admin para `/django-admin/` antes de publicar.
