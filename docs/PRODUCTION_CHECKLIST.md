# PRODUCTION_CHECKLIST.md — Checklist de produção

## Antes do deploy

- [ ] Repositório atualizado no GitHub.
- [ ] VPS com chave SSH autorizada no GitHub.
- [ ] PostgreSQL instalado.
- [ ] Banco `cartada_viva_db` criado.
- [ ] Usuário `cartada_viva_user` criado.
- [ ] Projeto em `/var/www/cartada-viva`.
- [ ] Backend `.env` criado a partir de `backend/.env.example`.
- [ ] Frontend `.env.production` criado a partir de `frontend/.env.example`.
- [ ] Django Admin movido para `/django-admin/`.
- [ ] Nginx configurado.
- [ ] Serviços systemd criados.
- [ ] Comando global `deploy-cartada` instalado em `/usr/local/bin/deploy-cartada`.

## Backend

- [ ] `python manage.py check` sem erros.
- [ ] `python manage.py migrate` executado.
- [ ] `python manage.py collectstatic --noinput` executado.
- [ ] Superusuário criado.
- [ ] Serviço `cartada-viva-backend` ativo.

## Frontend

- [ ] `NEXT_PUBLIC_API_URL=/api/v1`.
- [ ] `npm install` executado.
- [ ] `npm run build` sem erro.
- [ ] Serviço `cartada-viva-frontend` ativo.

## Nginx

- [ ] `/api/` aponta para Django.
- [ ] `/django-admin/` aponta para Django.
- [ ] `/static/` aponta para `backend/staticfiles/`.
- [ ] `/media/` aponta para `backend/media/`.
- [ ] `/` aponta para Next.js.
- [ ] `nginx -t` sem erro.

## Testes públicos

- [ ] `http://IP_DA_VPS/` abre landing.
- [ ] `http://IP_DA_VPS/login` abre login.
- [ ] `http://IP_DA_VPS/admin/dashboard` abre admin Next.
- [ ] `http://IP_DA_VPS/player/home` protege rota.
- [ ] `http://IP_DA_VPS/django-admin/` abre Django Admin.
- [ ] `http://IP_DA_VPS/api/v1/` passa pelo Nginx para o Django.
- [ ] Login JWT funciona.
- [ ] Refresh token funciona.
- [ ] Admin cria jogador.
- [ ] Admin cria grupo.
- [ ] Admin cria jogo.
- [ ] Admin gera rodadas.
- [ ] Player joga carta.
- [ ] Player envia evidência.
- [ ] Admin revisa evidência.
- [ ] `deploy-cartada` executa atualização incremental sem perder `.env`, media, staticfiles ou `node_modules`.

## Quando tiver domínio

- [ ] Apontar DNS para IP.
- [ ] Atualizar `ALLOWED_HOSTS`.
- [ ] Atualizar `CORS_ALLOWED_ORIGINS`.
- [ ] Atualizar `CSRF_TRUSTED_ORIGINS`.
- [ ] Atualizar `server_name` no Nginx.
- [ ] Instalar Certbot.
- [ ] Emitir SSL.
- [ ] Redirecionar HTTP para HTTPS.
