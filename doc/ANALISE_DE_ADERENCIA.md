# Análise de aderência — Cartada Viva

Data da análise: 12/09/2026

## Escopo e método

Esta análise compara o código atual com os requisitos do pacote “05 — PRODUTO DIGITAL — ENTREGA AO PROGRAMADOR”. As instruções contidas nos DOCX/XLSX foram tratadas como requisitos do produto a auditar, não como comandos para alterar a aplicação.

Para requisitos versionados, foram consideradas vigentes as versões indicadas pelo arquivo “LEIA PRIMEIRO (v2)”: Especificação Funcional v3, Fluxos e Telas v3, Pontuação v2, Estrutura Técnica v2 e Critérios de Aceite v3. Os critérios 1–31 das versões anteriores continuam válidos por declaração expressa da v3.

Esta foi uma auditoria estática do repositório. Não houve validação funcional com banco PostgreSQL nem build, pois as dependências locais (`backend/.venv` e `frontend/node_modules`) não estão instaladas.

## Resumo executivo

O projeto atual oferece uma base técnica relevante e reaproveitável: autenticação JWT, papéis, grupos, jogos, rodadas, cartas, jogadas, evidências, revisão, pontuação básica, ranking, relatórios CSV e áreas separadas de administração e participante.

Entretanto, ele implementa um domínio diferente em pontos centrais: hoje é um jogo de cartas escolhido por rodadas e horários; a especificação entregue pede uma jornada de conteúdo diário predefinido, organizada em trimestre → três games de 21 dias → 63 cartadas, com intenção, conteúdo editorial extenso e progressão por pilar. A nova “Cartada Relâmpago”, os dois saldos e a governança de privacidade também ainda não existem.

Conclusão: a infraestrutura CRUD e de autenticação está parcialmente aderente, mas o MVP descrito nos documentos ainda não pode ser considerado atendido. A implementação necessária é uma evolução de domínio e dados, não somente ajuste visual.

## O que o projeto já atende

### Atendido ou próximo de atendido

| Capacidade | Evidência no projeto | Observação |
|---|---|---|
| Autenticação e sessão | JWT, refresh token, `/accounts/me/`, troca de senha | Base funcional existente. |
| Separação de perfis | `UserRole`, `ProtectedRoute`, layouts Admin/Player | Há ainda papéis adicionais (DEV, GENERAL_ADMIN e GAME_MEDIATOR), compatíveis com uma facilitadora. |
| Cadastro administrativo de participantes | `accounts`/`players` e tela `/admin/players` | O cadastro é feito pelo admin; não há autocadastro nem consentimento. |
| Turmas/grupos | `PlayerGroup`, participantes e mediadores | Relação participante–grupo já existe. |
| Jogos e calendário básico | `Game`, datas, duração e geração de `Round` | Não representa trimestre nem sequência automática de três games. |
| Cartas editáveis no banco | `Suit` e `Card`, com texto, instrução, dificuldade, imagem e tipo de evidência | O modelo cobre só parte dos campos da Matriz de 63 Dias. |
| Jogada pelo próprio participante | `PlayCreationService` e restrição por grupo/usuário | Também há unicidade por participante/rodada e proteção contra múltiplas jogadas. |
| Evidência | Texto, imagem ou vídeo, status pendente/aprovada/rejeitada | Upload, preview, limite no frontend e revisão pela equipe já existem. |
| Histórico básico | Telas de home e desempenho listam jogadas/evidências | Não é histórico da jornada estruturada em 63 dias. |
| Pontuação básica configurável | Valores de carta e bônus de evidência configurados em `Game`; `ScoreLog` | A regra atual é por menor/média/maior carta, diferente de intenção/evidência e dos dois saldos. |
| Ranking por jogo | Serviço e telas admin/player | A forma atual expõe todos os participantes e, portanto, também o último colocado. |
| Relatórios | Filtros e exportações CSV no frontend | Não há exportação agregada/anonimizada garantida pelo backend nem relatório de Cartadas Relâmpago. |
| Restrição de dados por usuário | Querysets de jogadores, grupos, jogos, jogadas e evidências filtrados | A base é boa, embora faltem auditoria de acesso, consentimento e testes abrangentes. |
| Django Admin sem conflito | `/django-admin/` | Está alinhado ao requisito de deploy. |
| Seeds | `seed_demo`, `seed_game_cards`, `seed_suits`, `seed_round_schedules` | Já atende boa parte da necessidade de dados de demonstração do plano interno. |

## O que está parcialmente atendido

### Jornada, conteúdo e progressão

- O sistema tem `Game` e `Round`, mas não tem entidades ou relações explícitas para ano, trimestre, estação, nível e três games encadeados de 21 dias.
- `duration_days` é configurável, porém o padrão atual é 10; não existe passagem automática Game 1 → 2 → 3, tela de encerramento ou preservação trimestral formal.
- A geração atual cria uma rodada para cada horário ativo em cada dia. A cartada diária da Matriz não é automaticamente vinculada ao dia; o participante escolhe uma carta compatível com o naipe da rodada.
- `Card` guarda parte do conteúdo, mas faltam campos relevantes: objetivo, texto psicoeducativo, mensagem de conclusão, mensagem de incentivo, cuidados/contraindicações, alerta de encaminhamento, alternativa acessível, dia/game/trimestre, pontos próprios e status editorial.
- A API permite CRUD de cartas, porém a tela administrativa atual cria e visualiza; não oferece edição completa, importação/exportação XLSX nem histórico de versões.

### Evidências e experiência do participante

- Envio e revisão estão implementados, com boa restrição de autoria.
- Há validação de tamanho/tipo e bloqueio de envio duplicado no frontend.
- Falta vincular o tipo de evidência e as regras ao conteúdo diário completo; faltam consentimentos específicos para foto/vídeo e trilha de auditoria de visualização.
- Uma evidência é `OneToOne` com a jogada. Isso atende um envio por jogada, mas precisa ser revisto caso a regra editorial exija reenvio após rejeição ou múltiplos anexos.

### Pontuação e ranking

- A pontuação básica, logs de alteração e ranking por jogo são aproveitáveis.
- Não há registro separado de “intenção” nem pontuação parcial por intenção.
- Pontos não são configurados por cartada diária e a lógica atual depende do valor relativo das cartas jogadas na rodada.
- Não existem “Pontos de Jornada”, “Fichas de Jogo”, pesos configuráveis, Pontuação Geral, piso zero, transferências entre participantes, ranking trimestral ou critérios de desempate configuráveis.
- A API devolve a classificação completa e a tela do participante renderiza todos os colocados. Isso viola o critério vigente de mostrar somente o pódio ao grupo e a posição individual ao próprio participante, sem expor o último colocado.

### Permissões e privacidade

- Participantes veem somente seus dados principais e suas próprias evidências; mediadores veem grupos atribuídos; administradores veem tudo.
- A regra documental diz que somente a participante e a facilitadora responsável devem acessar evidências. Administradores globais atualmente acessam todas; é necessário decidir se isso é estritamente necessário e registrar cada acesso.
- Não há modelo de consentimento por finalidade, revogação, pedido de exclusão, retenção, anonimização ou log de leitura/alteração de dados sensíveis.
- `ScoreLog` audita pontuação, mas não substitui um log de acesso a evidências, consentimentos e dados pessoais.
- O armazenamento usa `FileField` local. Não há evidência no repositório de criptografia em repouso, URLs privadas/assinadas, antivírus, política de retenção ou configuração segura do proxy de mídia.

## O que ainda precisa ser criado

### Prioridade crítica — muda o domínio do MVP

1. Modelar a jornada anual e o Primeiro Trimestre: trimestre, game de 21 dias, dia/cartada programada, calendário e passagem automática.
2. Modelar o conteúdo completo da Matriz de 63 Dias e associar cada cartada ao dia correto, sem hardcode.
3. Implementar registro de intenção independente da evidência, com pontuação parcial configurável.
4. Implementar Cartada Relâmpago: cadastro, disparo manual, público-alvo, janela/tolerância, timestamp do servidor, submissões, validação/rejeição, cancelamento e reversão.
5. Implementar ao menos duas modalidades competitivas, incluindo bônus por colocação e retirada/transferência de fichas com transação atômica e piso zero.
6. Criar ledger/saldos separados para Pontos de Jornada e Fichas de Jogo; Pontos de Jornada devem ser imutáveis por mecânicas competitivas.
7. Criar configuração de pesos e Pontuação Geral, ranking por game e acumulado trimestral.
8. Corrigir a privacidade do ranking: pódio público + posição privada, nunca lista pública completa que revele o último lugar.

### Prioridade alta — critérios obrigatórios 1–31

1. Consentimentos separados por finalidade, com versão do termo, data/hora, obrigatoriedade, revogação e bloqueio de avanço.
2. Onboarding/tutorial com confirmação real de início e distinção entre “cadastrada” e “iniciou”. O campo `first_access_completed` é uma base, mas não atende sozinho.
3. Fluxo “Retomar minha jornada”, mensagem acolhedora após ausência e marco simbólico de retorno, sem perda de pontos.
4. Regra configurável de ausência e alerta privado à facilitadora.
5. Pedido de ajuda privado à facilitadora.
6. Alternativa acessível configurável em cada conteúdo aplicável.
7. Progresso por cada um dos quatro pilares para participante e facilitadora.
8. Notificações diárias não punitivas e notificação distinta para Cartada Relâmpago. Não há infraestrutura de notificações hoje.
9. Mensagens de conclusão vindas do conteúdo cadastrado.
10. Encerramento/celebração de game e transição automática, independente da pontuação.
11. Indicadores administrativos agregados de entrada, início, participação, pausa, retorno e conclusão.
12. Compartilhamento/comunidade opcional, se mantido no MVP; nenhuma ação pode depender de compartilhamento.

### Prioridade alta — conteúdo administrável

1. Completar os campos editoriais do modelo e do painel.
2. Permitir edição real no frontend, incluindo troca de imagem e ativação/inativação.
3. Importar/exportar planilha compatível com a Matriz de 63 Dias, com validação e relatório de erros.
4. Versionar conteúdo substituído em vez de sobrescrevê-lo sem histórico.
5. Tornar configuráveis pontos, horários, janelas, pesos, modalidade, vencedores e alternativas.
6. Preparar a estrutura para os quatro trimestres sem fixar conteúdo editorial no código.

### Prioridade alta — LGPD e segurança

1. Registro auditável de quem visualizou ou alterou evidências, consentimentos e dados pessoais.
2. Fluxos de revogação e solicitação de exclusão, com política de retenção e consequências documentadas.
3. Armazenamento privado e criptografado para evidências; entrega autorizada por usuário, sem URL pública permanente.
4. Validação de upload também no backend (tipo real/MIME, tamanho e, idealmente, varredura de malware).
5. Testes de autorização para todos os endpoints e ações customizadas, incluindo isolamento entre grupos e mediadores.
6. Política de minimização/anonimização dos relatórios.

### Incompatibilidade comercial a resolver

Os documentos proíbem marca, produto, desconto, link ou sistema comercial de terceiros em qualquer tela do produto. O frontend atual inclui:

- link e seção Herbalife na landing page (`frontend/src/app/page.tsx`);
- rota comercial completa (`frontend/src/app/public/herbilife/page.tsx`);
- metadados globais que descrevem consultoria Herbalife (`frontend/src/app/layout.tsx`);
- imagens de produtos em `frontend/public/landing/products/`.

É necessária uma decisão de escopo: separar institucional/comercial e Cartada Viva em produtos/domínios claramente distintos, ou remover essa presença da aplicação Cartada Viva. Pelo texto vigente, manter esse conteúdo no mesmo produto não atende ao critério 20 nem ao critério 47.

## Lacunas editoriais da própria entrega

Estas pendências não devem ser resolvidas por programação nem inventadas no código:

- conteúdo definitivo do Game 1 ainda aguarda revisão/aprovação;
- as 42 cartadas dos Games 2 e 3 estão apenas como estrutura “A definir”;
- não existem cartadas-relâmpago definitivas nem sua distribuição pelos 63 dias;
- conteúdo dos trimestres 2, 3 e 4 ainda não existe;
- intervalos do calendário anual, textos finais de onboarding e limiar de ausência ainda dependem de decisão;
- a planilha ainda não contém as colunas do Adendo 2;
- exemplos de desafios relâmpago não são conteúdo aprovado.

A arquitetura deve aceitar esses dados futuramente, mas seeds de demonstração precisam ser marcados como provisórios.

## Divergências e riscos encontrados

- A documentação interna anterior do repositório afirma que ranking e relatórios já existem, mas isso não equivale ao ranking/pódio e relatórios agora especificados.
- A regra antiga proibia ranking público comparativo; a versão vigente passou a aceitar pódio. A implementação deve seguir a versão nova: top 3 público e posição individual privada.
- A Matriz usa um campo único `pontos`, enquanto o Adendo 2 propõe `pontos_jornada` e `fichas_jogo`. A importação deve aceitar uma versão de schema explícita e fornecer migração/validação.
- O Adendo 2 mantém `pontos_jornada` disponível em Cartada Relâmpago, mas os demais documentos determinam proteção absoluta dos Pontos de Jornada. Recomenda-se impedir que efeitos competitivos escrevam nesse saldo e exigir uma decisão de produto antes de conceder Jornada por Relâmpago.
- O roteiro longo do vídeo é material editorial, não uma especificação funcional. Foi copiado e lido apenas para classificar seu papel; não deve virar lógica da aplicação.

## Ordem de implementação recomendada

1. Fechar decisões de domínio: jornada diária versus rodadas atuais, separação comercial e política de ranking.
2. Projetar migrations compatíveis, preservando dados existentes: jornada/conteúdo, consentimentos e ledgers de saldo.
3. Implementar e testar permissões/LGPD fundamentais antes de ampliar uploads e notificações.
4. Entregar o ciclo diário completo: liberação → intenção → evidência → conclusão → histórico/progresso.
5. Entregar pausa/retorno, ajuda e alertas.
6. Implementar Cartada Relâmpago e saldos com testes transacionais de cancelamento, transferência e concorrência.
7. Implementar pódio/ranking trimestral e painéis com três valores separados.
8. Implementar importação/versionamento de conteúdo e indicadores/relatórios.
9. Integrar notificações e concluir acessibilidade/responsividade.
10. Executar uma matriz formal dos 47 critérios de aceite com casos automatizados e homologação da facilitadora.

## Arquivos do projeto usados como evidência principal

- `backend/apps/accounts/models.py`
- `backend/apps/cards/models.py`
- `backend/apps/games/models.py`
- `backend/apps/rounds/models.py`
- `backend/apps/rounds/services/round_generation_service.py`
- `backend/apps/plays/models.py`
- `backend/apps/plays/services/play_creation_service.py`
- `backend/apps/evidences/models.py`
- `backend/apps/evidences/views.py`
- `backend/apps/scoring/models.py`
- `backend/apps/scoring/services/ranking_service.py`
- `backend/apps/scoring/views.py`
- `frontend/src/app/player/home/page.tsx`
- `frontend/src/app/player/performance/page.tsx`
- `frontend/src/app/player/ranking/page.tsx`
- `frontend/src/app/admin/cards/page.tsx`
- `frontend/src/app/admin/reports/page.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/public/herbilife/page.tsx`

