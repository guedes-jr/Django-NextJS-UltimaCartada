# Contexto funcional — Cartada Viva

Atualizado em 12/10/2026 por inspeção estática. As validações técnicas anteriores foram relatadas pelo responsável; não houve conferência independente nesta revisão. Veja `docs/PROJECT_AUDIT.md`.

## Produto e acesso

A apresentação pública prioriza o Método Última Cartada, de Magaly Abreu: hábitos, autoconhecimento e autonomia nos pilares corpo, nutrição, mentalidade e comunidade. Cartada Viva é sua aplicação educacional e gamificada para a prática cotidiana em grupo. Contexto editorial: `docs/LANDING_POSITIONING.md`.

Plataforma para conduzir jogos de hábitos com grupos, rodadas, cartas, jogadas, evidências e pontuação. Há também jornadas, comunidade por grupo, desafios-relâmpago, mentoria, suporte, documentos legais, auditoria e notificações internas.

Papéis reais em `backend/apps/accounts/models.py`: `DEV`, `GENERAL_ADMIN`, `GAME_MEDIATOR`, `ADMIN` legado e `PLAYER`. `is_admin_user` reúne DEV/GENERAL_ADMIN/ADMIN; `is_game_staff` inclui mediador. O escopo efetivo depende do endpoint. Produtos `GAME` e `MENTORSHIP` são concedidos por `ProductEntitlement`, com ativação e validade.

## Modelo e fluxo atual

- `User` autentica; `PlayerProfile` contém dados do participante.
- `PlayerGroup.players` é M2M de perfis; mediadores são usuários vinculados ao grupo.
- `Game` pertence a um grupo. `Round` fica no app `rounds`, com agenda, datas e naipe.
- `Play` relaciona usuário jogador, grupo, jogo, rodada e carta; serviços validam regras e pontuação.
- `Evidence` pertence à jogada; possui prazo, envio e revisão. Home oferece confirmação, preview, status e histórico.
- `Journey` possui três etapas de 21 dias; matrícula de grupo gera jogos isolados por etapa. O modo `daily_enabled` acrescenta cartadas editoriais por dia/etapa, intenção/evidência, progresso por pilar e transição automática pelo calendário. Jornadas existentes mantêm modo por rodadas até habilitação explícita. Conteúdo final e aceite visual permanecem pendentes.
- `FlashChallenge` possui janela de participação e submissões revisáveis. Essa implementação não equivale às modalidades competitivas e aos dois saldos descritos nos requisitos de produto.
- `ScoreLog` registra alterações da pontuação de rodadas. Pontos diários são preservados em `DailyParticipation`; integração com saldos/rankings novos pertence a PROD-02/03.

Fluxo por rodadas: equipe cadastra participante/grupo/jogo → gera rodadas → participante escolhe e confirma carta → envia evidência dentro do prazo → equipe revisa → pontuação/desempenho refletem a revisão.

## Superfícies existentes

Públicas: `/`, `/login`, `/public/cartada-viva`, `/public/consultoria`, `/public/herbilife`, `/terms`, `/privacy`. Entrada autenticada: `/dashboard`.

Jogador: `/player/home`, `/player/community`, `/player/performance`, `/player/ranking`, `/player/settings`, `/player/support` e `/mentorship` conforme produto.

Admin: dashboard, players, groups, games, rounds, cards, plays, evidences, performance, reports, settings, journeys, challenges, mentorship, support, legal e audit em `/admin/<dominio>`.

JWT e refresh usam `src/lib/api.ts` e `src/lib/auth.ts`; a sessão atual é armazenada em localStorage. A identidade visual usa preto, dourado e branco, com tokens em `globals.css`.

## Operação e limites

API em `/api/v1/`; Django Admin em `/django-admin/`; produção prevista com Nginx, Gunicorn, Next.js e systemd. `scripts/deploy-cartada` e documentação existem; validação operacional prévia foi relatada pelo responsável, sem resultados anexados nesta revisão.

Seeds existentes: `seed_demo`, `seed_suits`, `seed_game_cards` e `seed_round_schedules`. `seed_demo` atualiza registros e senhas conhecidos; destina-se a banco de desenvolvimento.

Termos/privacidade possuem minutas e publicação versionada, com revisão externa pendente. PWA possui manifesto/service worker; sua validação prévia está incluída no relato do responsável. `PWA_TESTING.md` permanece como roteiro de regressão. Tutorial Herbalife depende de validação comercial e de decisão sobre separação do produto.

## Fontes atuais

- Regras de desenvolvimento: `AGENTS.md` e instruções locais.
- Arquitetura e contratos: `ia/README.md`.
- Backlog único: `IMPLEMENTATION_PLAN.md`.
- Evidências da revisão e limites: `docs/PROJECT_AUDIT.md`.
- Requisitos originais: `doc/`; auditoria histórica em `doc/ANALISE_DE_ADERENCIA.md`.

Fluxo diário e configuração do PROD-01: `docs/DAILY_JOURNEY.md`.
