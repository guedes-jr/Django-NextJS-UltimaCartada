# Revisão do projeto e limpeza de planejamento

Data: 12/10/2026. Método: inspeção estática de código, URLs, models, services, migrations, testes, componentes e documentação. Nenhuma funcionalidade da aplicação foi alterada.

## Resultado

Há estrutura implementada para as fases iniciais e para grande parte das fases do plano de novos requisitos. Checklists antigos não refletiam o estado do repositório e as instruções de IA divergiam sobre papéis, URLs, cores e arquitetura. A revisão consolidou o backlog e corrigiu essas referências.

## Evidência das entregas retiradas da fila inicial

| Entrega | Evidência existente | Limite da conclusão |
| --- | --- | --- |
| Confirmação de jogada e bloqueio de envio | `frontend/src/app/player/home/page.tsx`: Modal, selectedCardId, isSubmittingPlay, Confirmar jogada | Encontrado no código; fluxo não executado nesta revisão |
| Upload com preview, limite, status e histórico | Mesma página: MAX_EVIDENCE_FILE_SIZE_MB, evidencePreviewUrl, isSubmittingEvidence, evidenceHistory | Validação cliente existe; validação e privacidade de upload no servidor continuam no backlog |
| Seeds | `backend/apps/accounts/management/commands/seed_demo.py`; commands de cards/rounds | Comando já existe; não recriar. Atualiza registros/senhas e não foi executado |
| Regras e testes de autorização | `backend/apps/plays/tests.py`, querysets de groups/games e testes de community/journeys | Há cobertura existente, não garantia de auditoria completa; DEV-02 permanece |
| Prazos e onboarding | `plays/services/evidence_deadline_service.py`, `evidences/services/evidence_submission_service.py`, `components/onboarding/PlayerOnboardingTour.tsx`, accounts/views e evidences/tests | Implementação e testes encontrados; homologação pendente |
| Jornadas | `journeys/models.py`, `services/journey_enrollment_service.py`, tests e `/admin/journeys` | Três etapas de 21 dias e jogos por grupo existem; conteúdo diário e transição automática não comprovados |
| Comunidade | `community/models.py`, views/tests, `/player/community` e communityService | Fluxo implementado; políticas e privacidade de ranking precisam de aceite |
| Relatórios | `reports/views.py`, `services/report_service.py`, tests e `/admin/reports` | Resumo/séries/exportação existem; anonimização/formatos adicionais dependem de requisito |
| Auditoria/notificações | Apps audit/notifications com models, views, services/tests e `/admin/audit` | Infraestrutura interna existe; abrangência de auditoria de leitura e operação devem ser revalidadas |
| Desafios-relâmpago | `challenges/models.py`, services/tests, `/admin/challenges`, `PlayerFlashChallenges.tsx` | Janela, submissões e revisão/pontos existem; modalidades competitivas e ledger duplo permanecem pendentes |
| Mentoria/produtos | Apps mentorship/entitlements, tests, `/mentorship`, `/admin/mentorship` | Acesso e conteúdo presentes; integração comercial e aceite não confirmados |
| Suporte | App support, storage/services/tests, `/player/support` e `/admin/support` | Chamados implementados; canais e políticas operacionais dependem de confirmação |
| Termos e privacidade | App legal, migrations/tests, LegalAcceptanceGate, `/terms`, `/privacy`, `/admin/legal` | Aceite versionado existe; minutas e revisão externa permanecem em LEGAL_CONTENT_REVIEW.md |
| PWA | `frontend/src/app/manifest.ts`, `frontend/public/sw.js`, componentes pwa | Instalabilidade em dispositivos/produção ainda exige PWA_TESTING.md |
| Navegação pública responsiva | `components/landing/PublicNavigation.tsx` e Module; layouts admin/player | Menu compartilhado já existe; matriz visual e acessibilidade não foram executadas |
| Infraestrutura de deploy | `scripts/deploy-cartada`, config/urls, DEPLOYMENT.md e checklist | Preparação existe; HTTPS, backup/restauração e servidor não foram verificados |
| Tutorial Herbalife | `/public/herbilife` e HERBALIFE_CONTENT_REVIEW.md | Página implementada; validação comercial e separação do produto pendentes |

Caminhos backend/frontend abreviados nas células seguem o contexto da entrega. Testes presentes são evidência de intenção/cobertura, não de aprovação nesta sessão.

## Limpeza realizada

- `IMPLEMENTATION_PLAN.md` substitui as fases de construção repetidas por pendências de engenharia, evolução e aceite externo.
- Os três planos longos foram movidos, sem alteração de conteúdo, para `docs/archive/planning/`. Requisitos não confirmados continuam preservados para triagem.
- README e prompts agora apontam para o backlog único; prompts não repetem passos 46–51 já parcialmente superados.
- AGENTS geral e locais, PROJECT_CONTEXT, `.cursorrules` e guias de `ia/` passaram a usar papéis, URLs e identidade reais.
- Documentos de deploy, revisão jurídica/comercial, teste PWA e materiais de produto foram preservados porque contêm trabalho operacional/editorial pendente.

A análise de setembro em `doc/ANALISE_DE_ADERENCIA.md` permanece histórica. Afirmações de inexistência de jornadas, auditoria, consentimentos, notificações e desafios devem ser comparadas com o código atual. A divergência entre jogo por rodadas e conteúdo editorial diário continua relevante; não considerar todos os critérios de produto atendidos.

## Validação desta alteração

- `git diff --check`: conferência de whitespace do diff.
- Script Python de conferência de links Markdown locais nos documentos ativos alterados: destinos devem existir.
- Script Python de conferência dos planos arquivados contra `git show HEAD:<arquivo>`: conteúdo preservado integralmente.
- Inspeção das rotas citadas contra `config/urls.py` e routers de cada app.

Esta tarefa altera somente documentação/instruções. Não foram executados testes Django, lint, TypeScript ou build: `backend/.venv` e `frontend/node_modules` estão ausentes. Também não foram instaladas dependências, acessado banco nem aplicado seed/migration. A revisão inicial classificou o baseline como DEV-01; o relato posterior do responsável atualiza esse status conforme a seção abaixo.

## Manutenção futura

Registrar comportamento implementado com caminho e validação real antes de retirar pendências. Não duplicar planejamento em novos arquivos. Ao mudar contrato, atualizar API/types/services; ao mudar arquitetura ou regra, atualizar a referência correspondente. Aceites clínicos/editoriais/comerciais não devem ser inventados pelo agente.

## Arquivos alterados nesta tarefa

Atualizados:

- `.cursorrules`
- `AGENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `PROJECT_CONTEXT.md`
- `README.md`
- `doc/ANALISE_DE_ADERENCIA.md`
- `docs/CODEX_PROMPTS.md`
- `frontend/AGENTS.md`
- `ia/.ai-commands/review-feature.md`
- `ia/.ai-context/business-rules.md`
- `ia/.ai-context/data-model.md`
- `ia/.ai-context/project-overview.md`
- `ia/.ai-context/ui-patterns.md`
- `ia/.ai-prompts/frontend-page.prompt.md`
- `ia/README.md`
- `ia/api-contracts.md`
- `ia/architecture.md`
- `ia/backend-guidelines.md`
- `ia/coding-standards.md`
- `ia/delivery-workflow.md`
- `ia/domain-map.md`
- `ia/frontend-guidelines.md`
- `ia/performance-checklist.md`
- `ia/security-checklist.md`

Criados:

- `backend/AGENTS.md`
- `docs/PROJECT_AUDIT.md`

Movidos, com conteúdo preservado: os três planos listados em `archive/planning/README.md`. Esse índice também foi criado.

Resultados: `git diff --check` passou; 38 links locais válidos; os três planos arquivados são idênticos aos originais em HEAD.

## Atualização de status pelo responsável — 12/10/2026

Após a revisão, o responsável informou: “acredito que todas as pendências técnicas já foram validadas”. Essa informação abrange, no contexto da conversa, DEV-01 a DEV-05. Os itens foram retirados da fila de trabalho novo obrigatório e mantidos no plano como validação prévia relatada.

A declaração expressa uma avaliação do responsável; não foram apresentados comandos, resultados, datas ou ambiente. Não se trata de confirmação independente pelo agente nem de testes executados nesta sessão. Os limites da inspeção estática acima permanecem como registro histórico, sem invalidar a possibilidade de validações anteriores.

Arquivos ajustados nesta atualização: `IMPLEMENTATION_PLAN.md`, `PROJECT_CONTEXT.md`, `docs/PROJECT_AUDIT.md` e `docs/CODEX_PROMPTS.md`. As decisões de produto e aprovações externas permanecem abertas. Verificação documental: `git diff --check`; testes da aplicação não repetidos nesta atualização.

## PROD-01 — implementação do ciclo diário — 12/10/2026

Requisitos revisados nos DOCX vigentes: Especificação Funcional v3, Fluxos/Telas v3, Pontuação v2, Estrutura Técnica v1/v2, Visão Geral, Critérios de Aceite v1/v3 e adendo editorial. Eles especificam três etapas de 21 dias, cartada diária, intenção e/ou evidência, quatro pilares, pontos configuráveis, histórico e transição automática sem retenção por pontuação. Não há matriz de 63 dias em planilha neste checkout, e os próprios documentos classificam textos como provisórios; não foi inventado conteúdo definitivo.

Entregue:

- `JourneyDay` por etapa/dia, com pilar, conteúdo, instrução, mensagens, alternativa, cuidados, imagem, horário, evidência e pontos configuráveis.
- `DailyParticipation` privado com intenção/evidência, timestamps de servidor, pontos separados por parcela e conclusão do dia com qualquer uma das atividades.
- Publicação e liberação pelo calendário/horário; impedimento de jogar dias futuros/passados; evidência com prazo da configuração do jogo.
- Idempotência com locks/transação e constraint; pontos existentes preservados nas transições e mudanças de configuração.
- Calendário automático de etapas, intervalos e encerramento, tanto nas consultas quanto pelo comando `sync_journey_calendar`.
- Modo diário explícito em Journey, desabilitado na migration para registros anteriores. Jornadas por rodadas são preservadas; ao habilitar o fluxo diário, novas jogadas livres ficam bloqueadas, mantendo o histórico antigo.
- Editor em `/admin/journeys`, indicadores agregados do grupo por pilar e home do jogador com cartada, registro, mensagens, encerramento, histórico e progresso por etapa/jornada.
- Novas evidências em storage privado, download autorizado sem URL pública; validação de tipo/tamanho no servidor.
- Correção do filtro da ação `journeys/{id}/progress/`, que podia listar matrículas de outros grupos da mesma jornada.
- Proteção de conteúdo utilizado e de calendários matriculados, evitando deslocar o histórico.

A regressão completa revelou um erro anterior em `support/services.py`: `select_for_update` com assignee opcional produzia erro PostgreSQL de outer join. Um ajuste de `of=("self",)` limita o lock ao chamado, e os testes existentes de suporte passaram após a correção.

Validações executadas em PostgreSQL temporário, isolado na porta 55432, sem usar banco do responsável:

- `python manage.py check`: passou.
- `python manage.py makemigrations --check --dry-run`: nenhuma mudança pendente.
- `python manage.py test --noinput`, a partir de backend: 97 testes aprovados, incluindo concorrência real com duas conexões.
- `npm run lint`: sem erros; oito avisos já existentes de imagens em outras telas.
- `npx tsc --noEmit`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.

O ambiente Python e as dependências frontend foram instalados para essas validações; arquivos gerados não entram na alteração. As migrations 0003/0004 foram aplicadas em bancos de teste descartáveis, não em produção. O arquivo gerado next-env.d.ts foi preservado conforme a versão anterior.

Limitações/aceites restantes: cadastrar e publicar os 63 conteúdos revisados, aplicar migrations no ambiente de destino e homologar visualmente editor/home. O Browser não chegou a permitir interação por uma falha de configuração da sessão. Não houve teste visual nem deploy. Importação/versionamento avançado e integração com os dois saldos/rankings continuam em PROD-05 e PROD-02/03.

Guia operacional e contratos: `docs/DAILY_JOURNEY.md`. O backlog distingue entrega técnica de aceite editorial/visual.

Arquivos de código alterados/criados neste recorte:

- `backend/apps/journeys/models.py`, `serializers.py`, `views.py`, `urls.py`, `admin.py`, `tests.py`, `storage.py`.
- `backend/apps/journeys/migrations/0003_journeyday_dailyparticipation_and_more.py` e `0004_journey_daily_enabled.py`.
- `backend/apps/journeys/services/daily_participation_service.py`, `daily_progress_service.py`, `journey_calendar_service.py`, `journey_enrollment_service.py`.
- `backend/apps/journeys/management/__init__.py`, `management/commands/__init__.py`, `management/commands/sync_journey_calendar.py`.
- `backend/apps/games/serializers.py`, `backend/apps/plays/services/play_creation_service.py`, `backend/apps/support/services.py`.
- `frontend/src/app/admin/journeys/page.tsx`, `frontend/src/app/player/home/page.tsx`.
- `frontend/src/services/journeyService.ts`, `frontend/src/types/journeys.ts`, `frontend/src/types/games.ts`.
- `frontend/src/components/journeys/PlayerDailyJourney.tsx`, `PlayerDailyJourney.module.css`, `JourneyDailyEditor.tsx`, `JourneyDailyEditor.module.css`, `DailyGroupSummary.tsx`, `DailyGroupSummary.module.css`.

Documentação atualizada: `IMPLEMENTATION_PLAN.md`, `PROJECT_CONTEXT.md`, `docs/PROJECT_AUDIT.md`, novo `docs/DAILY_JOURNEY.md`, `ia/architecture.md`, `ia/domain-map.md` e `ia/api-contracts.md`. As alterações documentais de tarefas anteriores foram preservadas.
