# Contexto funcional — Cartada Viva

Base funcional inspecionada em 12/10/2026, com implementações da revisão da consultoria em 13/11/2026. O histórico distingue inspeção estática, validações relatadas e testes posteriores efetivamente executados; consulte `docs/PROJECT_AUDIT.md`.

## Direção vigente da consultoria — 13/11/2026

O briefing em `CONSULTORIA.md` define Magaly Abreu — Psicóloga e Mentora como marca principal, A Última Cartada — Mentoria como oferta principal e Cartada Viva — Game como experiência complementar incluída na mentoria. Metodologia não é terceira oferta. Duração, condições de acesso e identificação profissional completa precisam de confirmação; não inferir a oferta comercial das três etapas técnicas existentes.

A identidade aprovada usa vinho/ameixa/rosé/nude/marfim/dourado, Cormorant Garamond e Montserrat, preservando logos originais. Parâmetros em `DESIGN.md`; diagnóstico em `docs/CONSULTORIA_DIAGNOSTICO.md`. O plano anterior foi encerrado por orientação expressa do responsável e substituído integralmente pelo backlog da consultoria em `IMPLEMENTATION_PLAN.md`; o encerramento não acrescenta evidências de teste/produção.

A primeira implementação do briefing está isolada nas rotas `/preview/consultoria`, `/preview/consultoria/mentoria` e `/preview/consultoria/game`, com tema e fontes locais. Também há prévias da separação comercial Herbalife e do guia visual em `/preview/consultoria/herbalife` e `/preview/consultoria/guia-visual`; fundos e instruções para criativos são rascunhos em `docs/CONSULTORIA_CRIATIVOS.md`. As URLs definitivas também aceitam a nova apresentação com `ENABLE_CONSULTORIA_SITE=true` no build; a chave permanece desativada por padrão, preservando as páginas atuais. A prévia é bloqueada por padrão em build de produção. Ver `docs/CONSULTORIA_PREVIEW.md`. Conferência visual pontual iniciada pelo Chrome nativo em 13/11/2026: primeiras telas da home desktop/375 px, mentoria 375 px, game 375/320 px e interação do menu/modal de demonstração. Conferência integral, aparelhos reais e aprovação continuam pendentes. Menus receberam ajustes de foco e a mentoria usa o Modal compartilhado nativo; há uma demonstração sem dados/API em `#dialogos` no guia visual, com homologação interativa ainda aberta. As descrições abaixo registram a implementação existente. O helper de direitos efetivos agora inclui GAME para MENTORSHIP vigente, com produtos coerentes no login e na sessão. Revogação/vencimento interrompem o acesso derivado sem apagar concessões independentes; não há matrícula automática. Implementação coberta por testes, com homologação visual ainda pendente. Preservar site público até aprovação; publicação exige autorização expressa. Acesso independente ao game permanece decisão futura.

## Produto e acesso

Atualização de validação em 14/11/2026: CONS-09.6 concluído como conferência técnica local em Chrome, com contas/banco sintéticos, incluindo mentoria com game derivado, estados sem grupo/sem produto e jornada/conteúdo vinculados. Intenção/evidência, histórico/progresso e conclusão de conteúdo conferidos; botão de conclusão passou a preservar foco. Isso não equivale ao aceite da consultoria nem à homologação integral em aparelhos/produção. Evidências e limites em docs/PROJECT_AUDIT.md.

No código atual, a página dedicada `/public/ultima-cartada` apresenta o Método Última Cartada, de Magaly Abreu: hábitos, autoconhecimento e autonomia nos pilares corpo, nutrição, mentalidade e comunidade. Cartada Viva é sua aplicação educacional e gamificada para a prática cotidiana em grupo. A landing principal mantém sua apresentação anterior. Contexto editorial: `docs/LANDING_POSITIONING.md`.

Plataforma para conduzir jogos de hábitos com grupos, rodadas, cartas, jogadas, evidências e pontuação. Há também jornadas, comunidade por grupo, desafios-relâmpago, mentoria, suporte, documentos legais, auditoria e notificações internas.

Papéis reais em `backend/apps/accounts/models.py`: `DEV`, `GENERAL_ADMIN`, `GAME_MEDIATOR`, `ADMIN` legado e `PLAYER`. `is_admin_user` reúne DEV/GENERAL_ADMIN/ADMIN; `is_game_staff` inclui mediador. O escopo efetivo depende do endpoint. Produtos `GAME` e `MENTORSHIP` são concedidos por `ProductEntitlement`, com ativação e validade. `effective_products` inclui GAME enquanto MENTORSHIP estiver vigente; os registros reais de concessão permanecem separados.

## Modelo e fluxo atual

- `User` autentica; `PlayerProfile` contém dados do participante.
- `PlayerGroup.players` é M2M de perfis; mediadores são usuários vinculados ao grupo.
- `Game` pertence a um grupo. `Round` fica no app `rounds`, com agenda, datas e naipe.
- `Play` relaciona usuário jogador, grupo, jogo, rodada e carta; serviços validam regras e pontuação.
- `Evidence` pertence à jogada; possui prazo, envio e revisão. Home oferece confirmação, preview, status e histórico.
- `Journey` possui três etapas de 21 dias; matrícula de grupo gera jogos isolados por etapa. O modo `daily_enabled` acrescenta cartadas editoriais por dia/etapa, intenção/evidência, progresso por pilar e transição automática pelo calendário. Jornadas existentes mantêm modo por rodadas até habilitação explícita. Conteúdo final e aceite visual permanecem pendentes.
- `FlashChallenge` possui janela de participação e submissões revisáveis. Essa implementação não equivale às modalidades competitivas e aos dois saldos descritos nos requisitos de produto.
- `ScoreLog` registra alterações da pontuação de rodadas. Pontos diários são preservados em `DailyParticipation`; integração com saldos/rankings novos era escopo do plano anterior encerrado; não constitui tarefa automática do briefing atual.

Fluxo por rodadas: equipe cadastra participante/grupo/jogo → gera rodadas → participante escolhe e confirma carta → envia evidência dentro do prazo → equipe revisa → pontuação/desempenho refletem a revisão.

## Superfícies existentes

Públicas: `/`, `/login`, `/public/ultima-cartada` (antiga `/public/cartada-viva` redireciona), `/public/consultoria`, `/public/herbilife`, `/terms`, `/privacy`. Entrada autenticada: `/dashboard`.

Jogador: `/player/home`, `/player/community`, `/player/performance`, `/player/ranking`, `/player/settings`, `/player/support` e `/mentorship` conforme produto.

Admin: dashboard, players, groups, games, rounds, cards, plays, evidences, performance, reports, settings, journeys, challenges, mentorship, support, legal e audit em `/admin/<dominio>`.

JWT e refresh usam `src/lib/api.ts` e `src/lib/auth.ts`; a sessão atual é armazenada em localStorage. O visual legado usa preto, dourado e branco, com tokens em `globals.css`. A revisão usa tema próprio em CSS Modules e fontes locais; sob a chave de ativação, login, estrutura das participantes, dashboard e portal da mentoria recebem o novo padrão. O admin e a revisão integral das demais telas continuam fora desse recorte.

## Operação e limites

API em `/api/v1/`; Django Admin em `/django-admin/`; produção prevista com Nginx, Gunicorn, Next.js e systemd. `scripts/deploy-cartada` e documentação existem; validação operacional prévia foi relatada pelo responsável, sem resultados anexados nesta revisão.

Seeds existentes: `seed_demo`, `seed_suits`, `seed_game_cards` e `seed_round_schedules`. `seed_demo` atualiza registros e senhas conhecidos; destina-se a banco de desenvolvimento.

Termos/privacidade possuem minutas e publicação versionada, com revisão externa pendente. PWA possui manifesto/service worker; sua validação prévia está incluída no relato do responsável. `docs/PWA_TESTING.md` permanece como roteiro de regressão. Tutorial Herbalife depende de validação comercial e de decisão sobre separação do produto.

Prévia local da consultoria: `cd frontend && npm run dev:consultoria`, em `127.0.0.1:3001`, com saída de desenvolvimento isolada e encaminhamento opt-in da API ao Django em `127.0.0.1:8000`. Produção ignora esse encaminhamento. Em 14/11/2026, a consulta local de documentos retornou lista vazia e ambas as páginas legais exibiram “Documento em preparação”; isso não constitui publicação ou aprovação jurídica.

## Fontes atuais

- Regras de desenvolvimento: `AGENTS.md` e instruções locais.
- Arquitetura e contratos: `ia/README.md`.
- Backlog único: `IMPLEMENTATION_PLAN.md`, agora dedicado à consultoria.
- Briefing e padrão visual: `CONSULTORIA.md` e `DESIGN.md`.
- Evidências da revisão e limites: `docs/PROJECT_AUDIT.md`.
- Requisitos originais: `doc/`; auditoria histórica em `doc/ANALISE_DE_ADERENCIA.md`.

Fluxo diário e configuração do PROD-01: `docs/DAILY_JOURNEY.md`.
