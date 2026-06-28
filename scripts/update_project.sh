#!/bin/bash

set -euo pipefail

PROJECT_DIR="/var/www/cartada-viva"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

REPO_URL="git@github.com:guedes-jr/Django-NextJS-UltimaCartada.git"
BRANCH="main"

BACKEND_SERVICE="cartada-viva-backend"
FRONTEND_SERVICE="cartada-viva-frontend"

SERVER_IP="2.25.183.3"
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-http://${SERVER_IP}}"
PUBLIC_HOST=$(echo "$PUBLIC_ORIGIN" | sed -E 's#^https?://##; s#/.*$##; s#:.*$##')

DJANGO_SETTINGS_MODULE_VALUE="config.settings"

BACKEND_HEALTH_URL="http://127.0.0.1:8000/django-admin/"
FRONTEND_HEALTH_URL="http://127.0.0.1:3000/login"
PUBLIC_FRONTEND_URL="${PUBLIC_ORIGIN}/login"
PUBLIC_ADMIN_URL="${PUBLIC_ORIGIN}/admin/dashboard"
PUBLIC_DJANGO_ADMIN_URL="${PUBLIC_ORIGIN}/django-admin/"

fail() {
  echo "[ERRO] $1"
  exit 1
}

read_env_value() {
  local file="$1"
  local key="$2"

  grep -E "^${key}=" "$file" | tail -n 1 | cut -d '=' -f 2-
}

assert_csv_contains() {
  local value="$1"
  local expected="$2"
  local description="$3"

  if ! echo ",${value}," | grep -Fq ",${expected},"; then
    fail "$description deve conter '$expected'. Valor atual: '$value'"
  fi
}

assert_http_status() {
  local method="$1"
  local url="$2"
  local expected_status="$3"
  local data="${4:-}"
  local status

  if [ -n "$data" ]; then
    status=$(curl -sS -o /dev/null -w "%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      --data "$data" \
      "$url")
  else
    status=$(curl -sS -o /dev/null -w "%{http_code}" -X "$method" "$url")
  fi

  if [ "$status" != "$expected_status" ]; then
    fail "$url respondeu HTTP $status; esperado HTTP $expected_status."
  fi
}

echo "=========================================="
echo "[DEPLOY] Atualizando Cartada Viva"
echo "=========================================="

if [ ! -d "$PROJECT_DIR" ]; then
  fail "Diretório do projeto não encontrado: $PROJECT_DIR"
fi

cd "$PROJECT_DIR"

echo "[DEPLOY] Verificando repositório Git..."

if [ ! -d ".git" ]; then
  echo "[ERRO] Este diretório não é um repositório Git."
  echo "Clone o projeto primeiro:"
  echo "git clone $REPO_URL $PROJECT_DIR"
  exit 1
fi

CURRENT_REMOTE=$(git remote get-url origin || true)

if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
  echo "[DEPLOY] Ajustando remote origin..."
  git remote set-url origin "$REPO_URL"
fi

echo "[DEPLOY] Salvando commit atual para possível rollback..."
PREVIOUS_COMMIT=$(git rev-parse HEAD)
echo "$PREVIOUS_COMMIT" > "$PROJECT_DIR/.last_deploy_commit"

echo "[DEPLOY] Buscando atualizações do GitHub..."
git fetch origin "$BRANCH"

echo "[DEPLOY] Atualizando código para origin/$BRANCH..."
git reset --hard "origin/$BRANCH"

echo "[DEPLOY] Limpando arquivos não rastreados com segurança..."
git clean -fd \
  -e backend/.env \
  -e backend/.venv \
  -e backend/media \
  -e backend/staticfiles \
  -e frontend/.env.production \
  -e frontend/.env.local \
  -e frontend/node_modules

echo "=========================================="
echo "[DEPLOY] Validando backend"
echo "=========================================="

if [ ! -d "$BACKEND_DIR" ]; then
  fail "Diretório backend não encontrado: $BACKEND_DIR"
fi

if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "[ERRO] Arquivo backend/.env não encontrado."
  echo "Crie o arquivo antes de continuar."
  exit 1
fi

BACKEND_ALLOWED_HOSTS=$(read_env_value "$BACKEND_DIR/.env" "ALLOWED_HOSTS")
BACKEND_CORS_ORIGINS=$(read_env_value "$BACKEND_DIR/.env" "CORS_ALLOWED_ORIGINS")
BACKEND_CSRF_ORIGINS=$(read_env_value "$BACKEND_DIR/.env" "CSRF_TRUSTED_ORIGINS")

assert_csv_contains "$BACKEND_ALLOWED_HOSTS" "$PUBLIC_HOST" "backend/.env ALLOWED_HOSTS"
assert_csv_contains "$BACKEND_CORS_ORIGINS" "$PUBLIC_ORIGIN" "backend/.env CORS_ALLOWED_ORIGINS"
assert_csv_contains "$BACKEND_CSRF_ORIGINS" "$PUBLIC_ORIGIN" "backend/.env CSRF_TRUSTED_ORIGINS"

cd "$BACKEND_DIR"

if [ ! -d ".venv" ]; then
  echo "[DEPLOY] Criando ambiente virtual Python..."
  python3 -m venv .venv
fi

echo "[DEPLOY] Ativando ambiente virtual..."
source .venv/bin/activate

echo "[DEPLOY] Atualizando pip..."
python -m pip install --upgrade pip

echo "[DEPLOY] Instalando dependências do backend..."

if [ -f "requirements/prod.txt" ]; then
  pip install -r requirements/prod.txt
elif [ -f "requirements.txt" ]; then
  pip install -r requirements.txt
else
  echo "[ERRO] Nenhum arquivo de requirements encontrado."
  exit 1
fi

echo "[DEPLOY] Garantindo Gunicorn instalado..."
pip install gunicorn

echo "[DEPLOY] Checando configuração Django..."
DJANGO_SETTINGS_MODULE="$DJANGO_SETTINGS_MODULE_VALUE" python manage.py check

echo "[DEPLOY] Aplicando migrations..."
DJANGO_SETTINGS_MODULE="$DJANGO_SETTINGS_MODULE_VALUE" python manage.py migrate --noinput

echo "[DEPLOY] Coletando arquivos estáticos..."
DJANGO_SETTINGS_MODULE="$DJANGO_SETTINGS_MODULE_VALUE" python manage.py collectstatic --noinput

echo "=========================================="
echo "[DEPLOY] Validando frontend"
echo "=========================================="

if [ ! -d "$FRONTEND_DIR" ]; then
  fail "Diretório frontend não encontrado: $FRONTEND_DIR"
fi

cd "$FRONTEND_DIR"

if [ -f ".env.local" ]; then
  echo "[AVISO] frontend/.env.local encontrado."
  echo "[AVISO] Em produção ele pode sobrescrever .env.production."
  echo "[AVISO] Renomeando para backup..."
  mv .env.local ".env.local.bak.$(date +%Y%m%d_%H%M%S)"
fi

if [ ! -f ".env.production" ]; then
  echo "[ERRO] Arquivo frontend/.env.production não encontrado."
  echo "Crie o arquivo com:"
  echo "NEXT_PUBLIC_API_URL=/api/v1"
  exit 1
fi

FRONTEND_API_URL=$(read_env_value ".env.production" "NEXT_PUBLIC_API_URL")

if [ "$FRONTEND_API_URL" != "/api/v1" ]; then
  fail "frontend/.env.production deve usar NEXT_PUBLIC_API_URL=/api/v1. Valor atual: '$FRONTEND_API_URL'"
fi

echo "[DEPLOY] Instalando dependências do frontend..."

if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

echo "[DEPLOY] Limpando build anterior do Next.js..."
rm -rf .next

echo "[DEPLOY] Gerando build do Next.js..."
npm run build

echo "=========================================="
echo "[DEPLOY] Reiniciando serviços"
echo "=========================================="

sudo systemctl daemon-reload

echo "[DEPLOY] Reiniciando backend: $BACKEND_SERVICE"
sudo systemctl restart "$BACKEND_SERVICE"

echo "[DEPLOY] Reiniciando frontend: $FRONTEND_SERVICE"
sudo systemctl restart "$FRONTEND_SERVICE"

echo "[DEPLOY] Testando configuração do Nginx..."
sudo nginx -t

echo "[DEPLOY] Recarregando Nginx..."
sudo systemctl reload nginx

echo "[DEPLOY] Aguardando serviços subirem..."
sleep 6

echo "=========================================="
echo "[DEPLOY] Verificando status dos serviços"
echo "=========================================="

echo "[DEPLOY] Verificando backend..."
if ! sudo systemctl is-active --quiet "$BACKEND_SERVICE"; then
  echo "[ERRO] Backend não subiu corretamente."
  sudo systemctl status "$BACKEND_SERVICE" --no-pager
  exit 1
fi

echo "[DEPLOY] Verificando frontend..."
if ! sudo systemctl is-active --quiet "$FRONTEND_SERVICE"; then
  echo "[ERRO] Frontend não subiu corretamente."
  sudo systemctl status "$FRONTEND_SERVICE" --no-pager
  exit 1
fi

echo "[DEPLOY] Verificando Nginx..."
if ! sudo systemctl is-active --quiet nginx; then
  echo "[ERRO] Nginx não está ativo."
  sudo systemctl status nginx --no-pager
  exit 1
fi

echo "=========================================="
echo "[DEPLOY] Testes locais"
echo "=========================================="

echo "[DEPLOY] Testando backend local..."
if ! curl -fsI "$BACKEND_HEALTH_URL" > /dev/null; then
  echo "[ERRO] Backend não respondeu em $BACKEND_HEALTH_URL"
  echo "[INFO] Se você ainda não moveu o Django Admin para /django-admin/, ajuste BACKEND_HEALTH_URL no script."
  exit 1
fi

echo "[DEPLOY] Testando frontend local..."
if ! curl -fsI "$FRONTEND_HEALTH_URL" > /dev/null; then
  echo "[ERRO] Frontend não respondeu em $FRONTEND_HEALTH_URL"
  exit 1
fi

echo "=========================================="
echo "[DEPLOY] Testes públicos via Nginx"
echo "=========================================="

echo "[DEPLOY] Testando frontend público..."
if ! curl -fsI "$PUBLIC_FRONTEND_URL" > /dev/null; then
  echo "[ERRO] Frontend público não respondeu em $PUBLIC_FRONTEND_URL"
  exit 1
fi

echo "[DEPLOY] Testando API pública..."
assert_http_status "POST" "${PUBLIC_ORIGIN}/api/v1/auth/token/" "401" '{"username":"__deploy_check__","password":"__deploy_check__"}'

echo "=========================================="
echo "[DEPLOY] Atualização concluída com sucesso!"
echo "=========================================="
echo ""
echo "Commit anterior salvo em:"
echo "$PROJECT_DIR/.last_deploy_commit"
echo ""
echo "Landing:"
echo "$PUBLIC_ORIGIN/"
echo ""
echo "Login:"
echo "$PUBLIC_FRONTEND_URL"
echo ""
echo "Painel Admin Next:"
echo "$PUBLIC_ADMIN_URL"
echo ""
echo "Django Admin:"
echo "$PUBLIC_DJANGO_ADMIN_URL"
echo ""
echo "Logs úteis:"
echo "sudo journalctl -u $BACKEND_SERVICE -f"
echo "sudo journalctl -u $FRONTEND_SERVICE -f"
echo "sudo tail -f /var/log/nginx/error.log"
