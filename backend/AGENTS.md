# Backend — instruções locais

Aplicam-se também as regras de `../AGENTS.md`. Consulte `../ia/backend-guidelines.md`, `../ia/api-contracts.md` e modelos/testes do domínio afetado.

- Preserve Django 5.2, DRF, Simple JWT e PostgreSQL; versões efetivas estão em `requirements.txt`.
- Use imports `apps.<dominio>` e serviços do próprio domínio. Existem tanto `services.py` quanto diretórios `services/`; siga o formato do app, sem reorganização ampla.
- Use queryset autorizado antes de recuperar objetos; valide também FKs recebidas na escrita e ações customizadas.
- Confira `User.is_admin_user`, `is_game_staff`, `is_game_mediator` e concessões em `apps.entitlements`; não use apenas `is_staff` como autorização de negócio.
- Mudanças em models exigem migration nova; preserve migrations aplicadas. Use constraints para invariantes persistentes e transações para gravações relacionadas.
- Para pontuação, revisão e concorrência, inspecione services e testes existentes antes de escolher bloqueios ou regras de idempotência.
- Valide arquivos no servidor; limites no frontend não garantem segurança. Não exponha mídia privada em URLs públicas novas.
- Amplie `apps/<dominio>/tests.py` para regras modificadas, incluindo acesso de terceiros e isolamento de grupos quando aplicável.

Validação, dentro de `backend/` com `.venv` ativa: `python manage.py check`, `python manage.py makemigrations --check --dry-run`, `python manage.py test apps.<dominio>`. Rode a suíte completa quando houver mudança transversal. Não execute `seed_demo` em produção.
