# DEPLOYMENT.md — Deploy em VPS Hostinger

## Cenário

Projeto: Cartada Viva / A Última Cartada  
Servidor: VPS Ubuntu  
Banco: PostgreSQL sem Docker  
Backend: Django + Gunicorn  
Frontend: Next.js  
Proxy: Nginx  
Acesso inicial: direto pelo IP  
Diretório: `/var/www/cartada-viva`

---

## Estrutura esperada no servidor

```txt
/var/www/cartada-viva/
├── backend/
└── frontend/
```

---

## Serviços systemd

Backend:

```txt
cartada-viva-backend
```

Frontend:

```txt
cartada-viva-frontend
```

---

## Preparação do servidor

```bash
apt update && apt upgrade -y

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

Instalar Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

---

## Usuário de deploy

```bash
adduser deploy
usermod -aG sudo deploy

sudo mkdir -p /var/www/cartada-viva
sudo chown -R deploy:deploy /var/www/cartada-viva
```

---

## Clonar projeto

```bash
su - deploy
cd /var/www/cartada-viva
git clone git@github.com:guedes-jr/Django-NextJS-UltimaCartada.git .
```

A VPS precisa ter uma chave SSH adicionada no GitHub como Deploy Key.

Gerar chave:

```bash
ssh-keygen -t ed25519 -C "deploy-cartada-viva"
cat ~/.ssh/id_ed25519.pub
```

Adicionar em:

```txt
GitHub > Repositório > Settings > Deploy keys > Add deploy key
```

Testar:

```bash
ssh -T git@github.com
```

---

## Banco PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE cartada_viva_db;
CREATE USER cartada_viva_user WITH PASSWORD 'SENHA_FORTE_AQUI';
ALTER ROLE cartada_viva_user SET client_encoding TO 'utf8';
ALTER ROLE cartada_viva_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE cartada_viva_user SET timezone TO 'America/Sao_Paulo';
GRANT ALL PRIVILEGES ON DATABASE cartada_viva_db TO cartada_viva_user;
\c cartada_viva_db
GRANT ALL ON SCHEMA public TO cartada_viva_user;
\q
```

---

## Backend

Diretório:

```bash
cd /var/www/cartada-viva/backend
```

Criar ambiente virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
```

Instalar dependências:

```bash
pip install -r requirements.txt
pip install gunicorn
```

Se o projeto usar requirements separados:

```bash
pip install -r requirements/prod.txt
```

---

## `.env` do backend

Arquivo:

```txt
/var/www/cartada-viva/backend/.env
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

Use `backend/.env.example` como referência e nunca commite o arquivo `.env`
real.

Gerar secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## Backend: comandos de produção

```bash
cd /var/www/cartada-viva/backend
source .venv/bin/activate
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

## Serviço backend

Arquivo:

```txt
/etc/systemd/system/cartada-viva-backend.service
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

Ativar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cartada-viva-backend
sudo systemctl start cartada-viva-backend
sudo systemctl status cartada-viva-backend
```

---

## Frontend

Diretório:

```bash
cd /var/www/cartada-viva/frontend
```

Instalar dependências:

```bash
npm install
```

Arquivo:

```txt
/var/www/cartada-viva/frontend/.env.production
```

Conteúdo:

```env
NEXT_PUBLIC_API_URL=/api/v1
```

Use `frontend/.env.example` como referência. Em produção, mantenha
`NEXT_PUBLIC_API_URL=/api/v1` para que o Nginx encaminhe as requisições para o
Django. Em desenvolvimento local, você pode omitir o arquivo `.env.local` para
usar o fallback `http://127.0.0.1:8000/api/v1`.

Se a produção usa domínio com HTTPS, mantenha o frontend com URL relativa e
configure o backend com o domínio público:

```env
ALLOWED_HOSTS=seudominio.com.br,www.seudominio.com.br,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://seudominio.com.br,https://www.seudominio.com.br
CSRF_TRUSTED_ORIGINS=https://seudominio.com.br,https://www.seudominio.com.br
```

Um `400 Bad Request` em `/api/v1/auth/token/` com `DEBUG=False` normalmente
indica que o domínio acessado não está em `ALLOWED_HOSTS`.

Build:

```bash
npm run build
```

Teste:

```bash
npm run start
```

---

## Serviço frontend

Arquivo:

```txt
/etc/systemd/system/cartada-viva-frontend.service
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

Ativar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cartada-viva-frontend
sudo systemctl start cartada-viva-frontend
sudo systemctl status cartada-viva-frontend
```

---

## Nginx

Arquivo:

```txt
/etc/nginx/sites-available/cartada-viva
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

Ativar:

```bash
sudo ln -s /etc/nginx/sites-available/cartada-viva /etc/nginx/sites-enabled/cartada-viva
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Comando global de deploy

Arquivo recomendado:

```txt
/usr/local/bin/deploy-cartada
```

Instalação sugerida:

```bash
sudo cp /var/www/cartada-viva/scripts/deploy-cartada /usr/local/bin/deploy-cartada
sudo chmod +x /usr/local/bin/deploy-cartada
```

Por padrão, o script usa o IP configurado nele. Para sobrescrever sem editar o
arquivo:

```bash
SERVER_IP=IP_DA_VPS deploy-cartada
```

Para produção com domínio/HTTPS, informe também a origem pública usada pelo
navegador:

```bash
PUBLIC_ORIGIN=https://seudominio.com.br deploy-cartada
```

Rodar:

```bash
deploy-cartada
```

O deploy incremental preserva `backend/.env`, `backend/.venv`, `backend/media`,
`backend/staticfiles`, `frontend/.env.production`, `frontend/.env.local` e
`frontend/node_modules`. O diretório `frontend/.next` é sempre recriado antes do
build para evitar cache quebrado entre versões do Next.js.

---

## Testes

Backend local:

```bash
curl -I http://127.0.0.1:8000/django-admin/
curl -I http://127.0.0.1:8000/api/v1/accounts/me/
```

Frontend local:

```bash
curl -I http://127.0.0.1:3000/login
```

Público via IP:

```bash
curl -I http://IP_DA_VPS/
curl -I http://IP_DA_VPS/login
curl -I http://IP_DA_VPS/admin/dashboard
curl -I http://IP_DA_VPS/django-admin/
curl -I http://IP_DA_VPS/api/v1/
```

---

## Logs

```bash
sudo journalctl -u cartada-viva-backend -f
sudo journalctl -u cartada-viva-frontend -f
sudo tail -f /var/log/nginx/error.log
```

---

## Portas

```bash
sudo ss -tulpn | grep -E '8000|3000|80|443'
```

---

## Quando tiver domínio

1. Apontar domínio para o IP da VPS.
2. Ajustar `ALLOWED_HOSTS`.
3. Ajustar `CORS_ALLOWED_ORIGINS`.
4. Ajustar `CSRF_TRUSTED_ORIGINS`.
5. Ajustar `server_name` no Nginx.
6. Instalar Certbot.
7. Emitir SSL.
8. Alterar URLs para HTTPS.
