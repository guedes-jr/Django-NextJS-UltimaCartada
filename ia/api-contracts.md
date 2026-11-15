# Contratos de API atuais

Inventário estático de 12/10/2026. Fonte de verdade: `backend/config/urls.py`, `backend/apps/*/urls.py`, `views.py` (ações), serializers e `frontend/src/services`. A tabela não substitui campos/permissões do código nem pretende listar cada ação.

Base local configurável por NEXT_PUBLIC_API_URL; produção `/api/v1`. Preservar barras finais e aliases existentes.

| Domínio | Caminhos relativos à base |
| --- | --- |
| Sessão | `POST /accounts/token/`, `POST /accounts/token/refresh/`, `GET /accounts/me/`, `POST /accounts/change-password/`, `POST /accounts/complete-onboarding/` |
| Aliases de sessão | `/auth/` inclui as mesmas URLs de accounts; `POST /token/refresh/` é alias usado pelo interceptor Axios |
| Cadastro/mediadores | `/accounts/admin/players/create/`, `/accounts/admin/mediators/` |
| Players | `/players/players/` |
| Groups | `/groups/groups/` |
| Games | `/games/games/`; ação `POST /games/games/{id}/generate-rounds/` |
| Rounds | `/rounds/schedules/`, `/rounds/rounds/`; ação `POST /rounds/rounds/{id}/score/` |
| Cards | `/cards/suits/`, `/cards/cards/` |
| Plays | `/plays/plays/` |
| Evidences | `/evidences/evidences/`; ações de revisão no ViewSet |
| Scoring | `/scoring/games/{game_id}/ranking/`, `/scoring/games/{game_id}/summary/`, `/scoring/games/{game_id}/players/{player_id}/performance/` |
| Journeys | `/journeys/journeys/`, `/journeys/enrollments/`, `/journeys/days/`, `/journeys/participations/`; ações diárias em `docs/DAILY_JOURNEY.md` a partir da raiz |
| Community | `/community/posts/`, `/community/comments/`, `/community/groups/{group_id}/ranking/` |
| Reports | `/reports/summary/`, `/reports/timeseries/`, `/reports/export/` |
| Audit | `/audit/events/` |
| Notifications | `/notifications/notifications/` |
| Challenges | `/challenges/challenges/`, `/challenges/submissions/` |
| Entitlements | `/entitlements/entitlements/` |
| Mentorship | `/mentorship/programs/`, `/mentorship/modules/`, `/mentorship/contents/` |
| Support | `/support/tickets/` |
| Legal | `/legal/documents/` |

Não existe login `/api/v1/token/` nem rodadas `/api/v1/games/rounds/` no urlpatterns atual. Não remover aliases para corrigir documentação.

## Alteração de contrato

1. Confira router/path e ações do ViewSet; confirme métodos e acesso.
2. Leia serializer, incluindo IDs relacionados e campos read-only.
3. Compare service, types e consumidores; confira listas/paginação, filtros e FormData.
4. Preserve o contrato ou implemente migração compatível em todos os consumidores.
5. Teste sucesso e acesso negado; atualize este inventário quando URLs mudarem.

Não use exemplos históricos de payload como schema definitivo. Dados derivados (jogador, pontuação, revisão) dependem das regras do servidor. Endpoints públicos legais e de login têm permissões próprias; não exigir autenticação indiscriminadamente.

## Produtos efetivos — atualização da consultoria em 13/11/2026

O array `products` de login e sessão mantém o mesmo formato. Mentoria vigente retorna `GAME` e `MENTORSHIP`, mesmo sem registro GAME separado. Apenas GAME não concede mentoria. A inclusão termina quando a mentoria expira ou é revogada, preservando GAME independente que ainda estiver vigente. Contas inativas não recebem produtos efetivos.

O CRUD de entitlements continua representando registros reais, não concessões derivadas. Não foi criado endpoint, campo, matrícula ou migration. A atualização do array é refletida pelo login e pelo GET `/accounts/me/` usado por ProtectedRoute; o dashboard utiliza esse usuário recém-validado. Revogar somente um registro GAME não anula a inclusão originada de mentoria ainda vigente.

Endpoints existentes mantêm seus filtros e regras específicas de papel/grupo/usuário. Os bloqueios de produto já existentes em mentoria e jornada diária usam o helper compartilhado; esta alteração não é uma auditoria global de autorização de todos os endpoints legados.
