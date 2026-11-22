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

## Liberação da apresentação da consultoria

Preencher esta seção somente depois da validação final e antes de habilitar a
apresentação atualizada em produção. Não configurar contato, checkout, ativos
ou condições comerciais por inferência.

- [ ] Autorização expressa de publicação registrada, com responsável, data, versão e escopo.
- [ ] Duração, formato, encontros, materiais, suporte e condições da Mentoria confirmados ou mantidos explicitamente como provisórios por decisão aprovada.
- [ ] Identificação profissional, WhatsApp, Instagram e eventual checkout revisados; destinos não aprovados permanecem vazios.
- [ ] Monograma, assinatura, logos, fotografias, cartas e depoimentos possuem confirmação de uso para as superfícies publicadas.
- [ ] `ENABLE_CONSULTORIA_SITE=true` foi decidido para o build de produção; `ENABLE_CONSULTORIA_PREVIEW=false` permanece no ambiente público.
- [ ] `NEXT_PUBLIC_API_URL=/api/v1` permanece configurado; `/django-admin/` não é substituído por `/admin/`.
- [ ] `npm run test:consultoria`, `npm run lint` e `npm run build` foram executados no artefato candidato; smoke HTTP executado no modo correspondente.
- [ ] Backup/restauração de banco, `media/`, variáveis e versão atualmente publicada foram confirmados no ambiente autorizado. O rollback de código não substitui restauração de dados.
- [ ] Plano de rollback define responsável, condição de acionamento e retorno à versão/flag anterior, sem executar migrations destrutivas como atalho.

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
