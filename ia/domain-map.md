# Mapa de domínios

Fonte: `backend/apps/` em 12/10/2026. Consulte modelos e serviços antes de modificar relações.

| App | Responsabilidade / entidades |
| --- | --- |
| accounts | `User`, papéis, JWT, senha, onboarding e comandos de contas/demo |
| players | `PlayerProfile`, dados complementares do participante |
| groups | `PlayerGroup`, M2M de perfis e mediadores usuários |
| games | `Game`, execução por grupo, período e configurações de pontuação/prazo |
| rounds | `RoundSchedule`, `Round`, calendário e geração de rodadas |
| cards | `Suit`, `Card`, conteúdo e seeds do baralho |
| plays | `Play`, criação/validação e prazo de evidência |
| evidences | `Evidence`, submissão e revisão |
| scoring | `ScoreLog`, pontuação de rodada, ranking, resumo e desempenho |
| journeys | `Journey`, `JourneyStage`, `JourneyEnrollment`, `JourneyGame`; três etapas por matrícula de grupo; `JourneyDay` e `DailyParticipation` para ciclo diário |
| community | Postagens/comentários/reações por grupo e ranking reutilizado |
| challenges | Desafios-relâmpago, janela e submissões com revisão/pontos |
| reports | Resumo, séries temporais e exportação administrativa |
| audit | Eventos, middleware e expurgo por comando |
| notifications | Notificações internas |
| entitlements | `ProductEntitlement`, concessão e validade de `GAME`/`MENTORSHIP` |
| mentorship | Programas, módulos, conteúdo e progresso |
| support | Chamados, mensagens, anexos e histórico |
| legal | Documentos versionados/publicados e aceite |
| dashboard | App existente; verificar consumidores antes de ampliar ou remover |

Relações centrais: User → PlayerProfile → grupos → jogos → rodadas; Play referencia usuário jogador, grupo, jogo, rodada e carta; Evidence referencia Play. Não confundir IDs de User e PlayerProfile.

Regras novas pertencem ao domínio responsável. Reutilize pontuação e concessão de produtos existentes; não replique ranking na comunidade ou autorização em cada página. Login Google não deve ser presumido funcional só porque campos de provedor existem em User.
