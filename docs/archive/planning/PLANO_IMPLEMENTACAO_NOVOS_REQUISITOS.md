# Plano de implementação — evolução da plataforma Cartada Viva

## 1. Objetivo

Este documento transforma os novos requisitos de produto em uma sequência técnica implementável para o backend Django REST Framework e o frontend Next.js. O plano considera o código existente e preserva os contratos atuais sempre que possível.

Escopo contemplado:

- relatórios trimestrais e anuais;
- Jornadas compostas por 3 jogos de 21 dias;
- tour de primeiro acesso do jogador;
- prazo de envio de evidência até 22h do dia do desafio;
- comunidade do grupo com timeline, reações, comentários e ranking;
- reformulação da página Herbalife como tutorial de cadastro e desconto;
- auditoria administrativa;
- cadastro e agendamento de desafios-relâmpago;
- gerenciamento de vários grupos dentro de uma mesma Jornada/programa;
- acesso único a jogo e mentoria;
- biblioteca de vídeos e documentos da mentoria;
- PWA instalável;
- termos de uso e política de privacidade;
- suporte com histórico de chamados e notificações administrativas.

---

## 2. Diagnóstico do estado atual

### Backend

O projeto já possui os apps `accounts`, `players`, `groups`, `games`, `rounds`, `cards`, `plays`, `evidences`, `scoring` e `dashboard`.

Pontos relevantes encontrados:

- `User` já possui papéis administrativos, mediador e jogador, além de `first_access_completed` e `must_change_password`;
- `PlayerGroup` já relaciona vários jogadores e mediadores;
- cada `Game` pertence hoje a exatamente um `PlayerGroup` por `ForeignKey`;
- `Round` é gerada por jogo, dia e horário;
- `Play` guarda explicitamente jogo, grupo, rodada, jogador e carta;
- `Evidence` é `OneToOne` com `Play`, mas ainda não valida prazo de 22h;
- ranking e desempenho já são calculados em serviços do backend;
- o relatório administrativo atual é montado no navegador após carregar jogos, jogadas e evidências, e exporta CSV;
- `ScoreLog` já fornece uma trilha específica de alterações de pontuação, mas não substitui uma auditoria geral;
- não existem modelos para Jornadas, comunidade, mentoria, desafios-relâmpago, notificações ou suporte.

### Frontend

O projeto já possui:

- layouts separados para administrador e jogador;
- proteção de rotas e refresh JWT;
- telas de jogo, desempenho, ranking e configurações do jogador;
- telas administrativas de grupos, jogos, rodadas, evidências, desempenho e relatórios;
- página pública Herbalife em `/public/herbilife`;
- Axios centralizado em `src/lib/api.ts` e services tipados;
- Next.js 16 com App Router, mas sem manifesto PWA e sem service worker.

### Lacunas que devem ser corrigidas antes ou durante as novas entregas

- o relatório não deve continuar consolidando grandes volumes no cliente;
- `first_access_completed` existe, porém não há fluxo completo para concluir/reabrir um tour;
- prazo de evidência precisa ser validado no backend, nunca apenas escondido na interface;
- a associação direta `Game.group` permeia filtros, permissões, ranking, pontuação e geração de rodadas;
- permissões de produto (jogo/mentoria) não devem ser representadas pelo campo `role`;
- arquivos de mentoria e evidências precisam de política de tamanho, tipo, armazenamento e acesso autorizado.

---

## 3. Decisões arquiteturais recomendadas

### 3.1 Jornada, jogo e grupo

Adotar a seguinte hierarquia:

```txt
Journey (programa de 63 dias)
├── JourneyGame 1 -> Game de 21 dias -> 1 grupo
├── JourneyGame 2 -> Game de 21 dias -> 1 grupo
└── JourneyGame 3 -> Game de 21 dias -> 1 grupo
```

Uma Jornada pode ser atribuída a vários grupos por meio de uma inscrição `JourneyEnrollment`. Para cada inscrição, são criadas três execuções de `Game`, uma por etapa, sempre isoladas por grupo.

Essa opção é preferível a trocar diretamente `Game.group` por `ManyToManyField`, pois uma rodada, uma jogada, uma evidência, a pontuação e o ranking pertencem a uma execução concreta de um grupo. Compartilhar a mesma instância de jogo entre grupos exigiria adicionar grupo a todas as consultas e constraints e aumentaria o risco de vazamento de dados.

Modelos propostos:

- `Journey`: nome, descrição, datas, status, criador e configurações padrão;
- `JourneyStage`: jornada, ordem de 1 a 3, nome, duração fixa de 21 dias e intervalo opcional;
- `JourneyEnrollment`: jornada, grupo, status e datas;
- `JourneyGame`: inscrição, etapa e jogo gerado; constraint única por inscrição/etapa.

Manter `Game.group` durante toda a migração. O cadastro administrativo passa a oferecer duas ações:

- criar um jogo avulso para um grupo;
- criar uma Jornada e matricular um ou mais grupos, gerando os três jogos de 21 dias para cada grupo.

### 3.2 Acesso único para jogo e mentoria

Manter uma única conta `User` e separar papel de permissão comercial.

Criar `ProductEntitlement` com:

- usuário;
- produto: `GAME` ou `MENTORSHIP`;
- status: `PENDING`, `ACTIVE`, `EXPIRED`, `CANCELED`;
- início e expiração opcionais;
- origem e observação administrativa;
- constraint única por usuário/produto ativo, conforme regra definida.

Após o login, um endpoint `/accounts/me/capabilities/` informa os módulos disponíveis. O mesmo token JWT atende ambos. A navegação apresenta “Jogo” e/ou “Mentoria” conforme os acessos ativos.

O campo `role` continua definindo autorização operacional; não deve ser usado para representar contratação.

### 3.3 Comunidade

A timeline deve ser limitada ao grupo e, quando aplicável, à Jornada/jogo selecionado. Não expor evidência automaticamente: o jogador escolhe se deseja publicar, respeitando privacidade e moderação.

Modelos propostos no novo app `community`:

- `CommunityPost`: autor, grupo, jogo opcional, texto, mídia opcional, origem (`MANUAL`, `EVIDENCE`, `ACHIEVEMENT`), status e timestamps;
- `CommunityReaction`: post, usuário e tipo; única por post/usuário;
- `CommunityComment`: post, autor, texto, status e timestamps;
- campos de moderação: `is_hidden`, `hidden_by`, `hidden_at`, `moderation_reason`.

Usar paginação por cursor ou página e otimizar com `select_related`, `prefetch_related`, contagens anotadas e índices por grupo/data.

### 3.4 Desafios-relâmpago

Criar um domínio separado de rodadas normais para não distorcer constraints do jogo de cartas.

Modelos propostos no app `challenges`:

- `FlashChallenge`: título, descrição, instrução, público (grupos), publicação, abertura, encerramento, pontos, tipo de evidência, status e criador;
- `FlashChallengeSubmission`: desafio, jogador, grupo, texto/arquivo, data, status de revisão e pontuação;
- constraints únicas para impedir mais de uma submissão por jogador/grupo/desafio;
- validações de janela de participação e pertencimento ao grupo.

O agendamento deve funcionar sem depender de uma tela aberta. A primeira versão pode calcular o estado por `starts_at`/`ends_at` em cada consulta. Se forem necessárias notificações exatas ou publicação ativa em segundo plano, adicionar posteriormente Celery + Redis e jobs idempotentes.

### 3.5 Auditoria e notificações

Criar dois domínios distintos:

- `AuditEvent`: registro imutável de quem fez o quê, quando, em qual objeto, IP, método, rota, request ID e mudanças antes/depois com campos sensíveis removidos;
- `Notification`: comunicação ao usuário/admin, com tipo, título, mensagem, link interno, `read_at` e timestamps.

Auditoria não pode armazenar senha, token, conteúdo binário, segredo ou dados pessoais desnecessários. Eventos mínimos: login, criação/edição/inativação, mudança de vínculo, revisão de evidência, pontuação, publicação/moderação, permissões de produto, conteúdo de mentoria e chamados.

### 3.6 Prazo das evidências

Regra recomendada:

- prazo padrão: 22:00 no fuso configurado do projeto, na data de lançamento do desafio/rodada;
- para o jogo atual, usar `play.round.date` como data de lançamento;
- calcular e persistir `evidence_due_at` na `Play` no momento da jogada para preservar histórico, mesmo se a configuração mudar;
- rejeitar criação/reenvio após o prazo no serializer/service do backend;
- permitir exceção administrativa auditada, com motivo obrigatório;
- retornar `evidence_due_at`, `evidence_status` e `can_submit_evidence` para a interface;
- usar `TIME_ZONE` de forma consistente. Recomenda-se alinhar `America/Sao_Paulo` e a regra comercial de Recife antes da implementação, embora atualmente tenham o mesmo UTC offset.

Não reutilizar `Round.ends_at`: o horário da rodada controla a jogada; 22h controla a evidência.

---

## 4. Fases de implementação

## Fase 0 — Regras de produto, segurança e base de testes

### Entregas

- registrar decisões de negócio ainda abertas listadas na seção 8;
- criar factories/fixtures para usuários, grupos, jogos, rodadas, jogadas e evidências;
- ampliar testes de isolamento por grupo e papel;
- documentar contratos atuais antes das migrações;
- padronizar paginação e filtros da API;
- confirmar armazenamento de mídia em produção e limites de upload.

### Critérios de aceite

- testes cobrem PLAYER, mediador e ADMIN;
- usuário não acessa dados de grupo do qual não participa;
- migrations existentes sobem em banco limpo;
- build atual do frontend serve como baseline.

---

## Fase 1 — Prazo das evidências e tour de primeiro acesso

### Backend

- adicionar `evidence_due_at` a `Play` e preencher registros existentes por data da rodada às 22h;
- adicionar configuração padrão de horário ao jogo ou configuração global (`evidence_deadline_time`, default `22:00`);
- centralizar a regra em `EvidenceSubmissionService`;
- bloquear envio e reenvio tardios, retornando erro de domínio claro;
- criar ação administrativa de liberação excepcional, com motivo e auditoria quando o módulo estiver disponível;
- criar endpoint idempotente `POST /api/v1/accounts/complete-onboarding/`;
- expor `first_access_completed` de forma consistente no login e `/accounts/me/`.

### Frontend

- exibir contador/prazo em `/player/home` e desabilitar envio expirado;
- implementar `PlayerOnboardingTour` no `PlayerLayout`, com foco em jogo ativo, carta, evidência, comunidade/ranking e ajuda;
- abrir o tour apenas depois da troca obrigatória de senha;
- permitir “Pular”, “Concluir” e “Ver tour novamente” em configurações;
- persistir a conclusão no backend, usando estado local apenas como apoio visual.

### Testes essenciais

- envio às 21:59:59 aceito e após 22:00 rejeitado;
- timezone e transição de data;
- reenvio de evidência rejeitada respeita o mesmo prazo;
- ADMIN não burla prazo sem permissão/motivo explícito;
- tour não reaparece após conclusão, mas pode ser reaberto manualmente.

---

## Fase 2 — Jornadas e gerenciamento de múltiplos grupos

### Backend

- criar app `journeys` e os quatro modelos descritos na seção 3.1;
- criar serviço transacional `JourneyEnrollmentService` para matricular grupos e gerar três jogos de 21 dias;
- validar exatamente três etapas e 21 dias por etapa;
- impedir sobreposição indevida para o mesmo grupo conforme regra comercial;
- manter endpoints de `Game` compatíveis;
- adicionar endpoints CRUD de Jornadas, etapas e matrículas;
- permitir filtros `journey`, `group`, `stage`, `status` em jogos, rodadas e relatórios;
- garantir que mediadores tenham acesso somente às Jornadas dos grupos que mediam.

### Endpoints sugeridos

```txt
GET/POST   /api/v1/journeys/journeys/
GET/PATCH  /api/v1/journeys/journeys/{id}/
POST       /api/v1/journeys/journeys/{id}/enroll-groups/
GET        /api/v1/journeys/journeys/{id}/progress/
GET        /api/v1/journeys/enrollments/
```

### Frontend

- criar `/admin/journeys` para configurar etapas e selecionar vários grupos;
- mostrar prévia das datas dos três jogos antes da confirmação;
- mostrar progresso por grupo e etapa;
- manter `/admin/games` para execuções e jogos avulsos;
- adicionar seletor de Jornada/jogo na área do jogador quando houver mais de um contexto ativo.

### Migração e compatibilidade

- jogos atuais permanecem avulsos, com `journey_game = null`;
- não converter dados antigos automaticamente sem regra de agrupamento confiável;
- não remover `Game.group` nem alterar URLs existentes.

---

## Fase 3 — Comunidade com ranking do grupo

### Backend

- criar app `community` e migrations;
- implementar feed filtrado estritamente por associação ao grupo;
- criar ações de reação, comentário, edição/exclusão do próprio conteúdo e moderação pela equipe;
- permitir publicar uma evidência aprovada somente após consentimento do autor;
- reutilizar `RankingService`, adicionando filtro explícito de grupo quando necessário;
- criar endpoint agregado da tela para feed e resumo, sem duplicar a regra de pontuação;
- adicionar paginação, índices, throttling e validação de mídia.

### Endpoints sugeridos

```txt
GET/POST   /api/v1/community/posts/
POST       /api/v1/community/posts/{id}/react/
GET/POST   /api/v1/community/posts/{id}/comments/
PATCH      /api/v1/community/comments/{id}/
POST       /api/v1/community/posts/{id}/moderate/
GET        /api/v1/community/groups/{group_id}/ranking/
```

### Frontend

- criar `/player/community` e item “Comunidade” no `PlayerLayout`;
- incorporar ranking do grupo na mesma tela, com destaque da posição do usuário;
- remover o item de ranking isolado do menu somente após a nova tela ficar estável; manter redirecionamento de `/player/ranking` para preservar URL;
- adicionar composer, feed paginado, reações, comentários, estados vazios, loading e erro;
- oferecer denúncia/moderação se conteúdo livre e mídia forem habilitados.

### Critérios de aceite

- jogador enxerga somente posts e ranking dos próprios grupos;
- reação é idempotente e pode ser alterada/removida;
- comentário só pode ser editado/excluído pelo autor ou moderado pela equipe;
- posts ocultos não aparecem para jogadores;
- consultas do feed não apresentam N+1.

---

## Fase 4 — Relatórios trimestrais e anuais

### Backend

- criar app `reports` ou serviços dedicados que consultem `Play`, `Evidence`, `ScoreLog`, Jornadas e desafios-relâmpago;
- aceitar `year`, `quarter`, `group`, `journey`, `game` e formato como filtros;
- consolidar participação, pontos, adesão, evidências aprovadas/rejeitadas/fora do prazo, evolução por período e ranking;
- gerar CSV no backend por streaming;
- deixar PDF para uma segunda entrega, caso seja obrigatório, usando template e testes de renderização;
- aplicar as mesmas regras de escopo de ADMIN/mediador em visualização e exportação;
- registrar exportações na auditoria.

### Endpoints sugeridos

```txt
GET /api/v1/reports/summary/?year=2026&quarter=3&group=1
GET /api/v1/reports/timeseries/?year=2026&group=1
GET /api/v1/reports/export/?period=quarter&year=2026&quarter=3&format=csv
GET /api/v1/reports/export/?period=year&year=2026&format=csv
```

### Frontend

- refatorar `/admin/reports` para consumir agregações do backend;
- adicionar seletores “Trimestral” e “Anual”;
- apresentar cartões, séries temporais, adesão por grupo/Jornada e ranking;
- preservar exportações atuais enquanto o novo endpoint é validado;
- impedir combinações inválidas de período e mostrar o fuso usado.

### Critérios de aceite

- totais exportados conferem com as jogadas e evidências do período;
- trimestre segue calendário: T1 jan-mar, T2 abr-jun, T3 jul-set, T4 out-dez;
- mediador não exporta grupos alheios;
- volume de dados não precisa ser carregado integralmente no navegador.

---

## Fase 5 — Auditoria administrativa e notificações

### Backend

- criar app `audit` com `AuditEvent` somente leitura;
- implementar service explícito para eventos de negócio e middleware para metadados de request;
- mascarar campos sensíveis e limitar tamanho do diff;
- impedir update/delete por API e definir política de retenção;
- criar app `notifications` e service idempotente;
- emitir notificações para novos chamados, respostas, desafios publicados e outros eventos aprovados pelo produto.

### Frontend

- criar `/admin/audit` com filtros por ator, ação, recurso e período;
- adicionar detalhe do evento e exportação restrita;
- criar sino/central de notificações no layout administrativo;
- implementar marcar uma/todas como lidas.

### Critérios de aceite

- alterações críticas geram evento com ator e objeto;
- leitura de auditoria é limitada aos papéis definidos;
- nenhum segredo/token/senha aparece no evento;
- notificações duplicadas não são geradas ao repetir a mesma operação.

---

## Fase 6 — Desafios-relâmpago

### Backend

- criar app `challenges` e os modelos da seção 3.4;
- CRUD e agendamento administrativo;
- seleção de um ou vários grupos;
- serviço de submissão e revisão reutilizando padrões de `evidences`, sem acoplar a `Play`;
- integrar pontos ao `ScoreLog` com nova ação `FLASH_CHALLENGE_APPROVED`;
- decidir se os pontos entram no ranking do jogo, da Jornada ou em ranking separado e implementar explicitamente.

### Frontend

- criar `/admin/challenges` com cadastro, público, agenda e status;
- destacar desafio ativo em `/player/home` e/ou `/player/community`;
- criar formulário de participação com prazo e feedback;
- incluir revisão administrativa e indicadores em relatórios.

### Critérios de aceite

- desafio não aparece antes da publicação nem depois do encerramento como disponível;
- somente membros dos grupos selecionados participam;
- submissão duplicada é impedida no banco e no serviço;
- aprovação pontua uma única vez.

---

## Fase 7 — Portal de mentoria e acesso único

### Backend

- criar app `entitlements` com `ProductEntitlement`;
- criar app `mentorship` com:
  - `MentorshipProgram`;
  - `MentorshipModule` ordenável;
  - `MentorshipContent` (`VIDEO`, `DOCUMENT`, `LINK`), publicação e visibilidade;
  - `ContentProgress` por usuário, opcional na primeira entrega;
- validar entitlement ativo em todas as consultas de conteúdo;
- permitir ao admin publicar, ordenar, ocultar e substituir conteúdos;
- usar arquivos privados ou URLs assinadas em produção; não expor documentos pagos diretamente em `public/`;
- migrar usuários contratantes com comando de gestão idempotente.

### Frontend

- após login, levar o usuário a um dashboard único ou ao único produto disponível;
- adicionar navegação entre “Meu jogo” e “Minha mentoria” quando ambos estiverem ativos;
- criar `/mentorship` e páginas de módulo/conteúdo;
- criar `/admin/mentorship` para gestão dos materiais;
- exibir vídeo responsivo, documentos para download autorizado e progresso quando habilitado.

### Critérios de aceite

- uma conta acessa ambos os produtos sem novo login;
- usuário apenas de jogo não acessa conteúdo de mentoria;
- conteúdo não publicado não aparece ao usuário;
- remoção de entitlement interrompe acesso sem apagar histórico.

---

## Fase 8 — Suporte e histórico de chamados

### Backend

- criar app `support` com:
  - `SupportTicket`: protocolo, solicitante, categoria, assunto, prioridade, status, responsável e timestamps;
  - `SupportMessage`: chamado, autor, mensagem e anexo opcional;
  - histórico de mudanças de status/responsável;
- gerar protocolo único não sequencialmente previsível para exposição pública;
- permitir ao usuário ver apenas seus chamados e ao admin ver/atribuir todos;
- notificar administradores na abertura e usuário/admin em novas respostas;
- registrar ações na auditoria;
- aplicar validação de anexos, throttling e proteção contra spam.

### Frontend

- criar `/player/support` para abrir chamado e acompanhar histórico;
- criar `/admin/support` com fila, filtros, atribuição, resposta e alteração de status;
- adicionar badge de não lidos/notificações no layout;
- incluir links de suporte em login, rodapé público e áreas autenticadas conforme a regra de atendimento.

### Critérios de aceite

- usuário não acessa chamado de terceiro;
- admin recebe notificação de novo chamado;
- conversa e mudanças formam histórico cronológico;
- chamado encerrado pode ser reaberto somente conforme regra definida.

---

## Fase 9 — Termos, privacidade e consentimento

### Entregas

- criar páginas públicas `/terms` e `/privacy`, com conteúdo revisado juridicamente;
- adicionar links no rodapé, login e cadastros;
- versionar documentos no backend com `LegalDocument` e `LegalAcceptance` se for necessário comprovar aceite;
- registrar usuário, versão, data, IP e user agent no aceite, respeitando minimização de dados;
- solicitar novo aceite quando houver versão materialmente nova;
- documentar retenção, base legal, direitos do titular, cookies, mídia, comunidade, moderação, suporte e fornecedores de armazenamento;
- adicionar fluxo administrativo para publicar nova versão somente se a operação exigir conteúdo gerenciável.

### Observação

O texto jurídico não deve ser inventado pela equipe técnica. A implementação pode fornecer estrutura e placeholders claramente marcados, mas a publicação exige validação profissional.

---

## Fase 10 — PWA instalável

### Entregas

- adicionar `frontend/src/app/manifest.ts` com nome, descrição, cores, `start_url`, `display: standalone` e ícones 192/512/maskable;
- incluir metadados e ícones adequados no layout raiz;
- adicionar service worker com estratégia conservadora;
- cachear shell e assets estáticos, mas não cachear respostas autenticadas sensíveis por padrão;
- disponibilizar página offline sem dados privados;
- apresentar instrução/botão de instalação quando suportado;
- validar HTTPS, escopo, atualização do service worker e comportamento de logout;
- testar Android/Chrome, desktop Chromium e iOS/Safari dentro das limitações da plataforma.

### Critérios de aceite

- auditoria de PWA reconhece manifesto, ícones e service worker;
- aplicativo é instalável em navegadores compatíveis;
- nova versão não fica presa em cache antigo;
- nenhuma resposta com dados de jogador fica disponível após logout/offline.

---

## Fase 11 — Reformulação da página Herbalife

### Objetivo da página

Transformar `/public/herbilife` de página institucional/vitrine em tutorial orientado a tarefa para:

1. entender quem pode obter o desconto;
2. separar “cadastro” de “compra”;
3. preparar documentos/dados necessários;
4. seguir o passo a passo no canal/site oficial;
5. confirmar a aquisição ou pedir ajuda.

### Entregas

- validar com a responsável o fluxo oficial, URLs, condições, percentuais e avisos legais atuais;
- redesenhar conteúdo em passos numerados, checklist, FAQ e CTAs rastreáveis;
- deixar claro que a página não é o site oficial da Herbalife, quando aplicável;
- adicionar bloco “já tenho cadastro” e solução de problemas;
- manter responsividade, acessibilidade e CSS Module próprio;
- configurar eventos analíticos somente após consentimento e definição da ferramenta;
- remover alegações de saúde, segurança, resultado ou desconto que não tenham fonte/aprovação válida.

### Critérios de aceite

- visitante identifica o próximo passo sem contato prévio;
- links externos abrem com segurança e são configuráveis;
- conteúdo foi aprovado pela responsável e revisado quanto a marca/compliance;
- página funciona em mobile e não depende de login.

---

## 5. Ordem recomendada e dependências

```txt
Fase 0: base e decisões
  ├── Fase 1: prazo + onboarding
  ├── Fase 2: Jornadas/múltiplos grupos
  │     ├── Fase 3: comunidade + ranking
  │     ├── Fase 4: relatórios
  │     └── Fase 6: desafios-relâmpago
  ├── Fase 5: auditoria + notificações
  │     ├── Fase 6: desafios-relâmpago
  │     └── Fase 8: suporte
  ├── Fase 7: entitlement + mentoria
  ├── Fase 9: termos/privacidade
  └── Fases 10 e 11: PWA e Herbalife
```

Sequência de releases sugerida:

1. prazo de evidência e tour;
2. Jornadas e matrículas de grupos;
3. auditoria/notificações como infraestrutura transversal;
4. comunidade com ranking;
5. relatórios trimestrais/anuais;
6. desafios-relâmpago;
7. acesso único e mentoria;
8. suporte;
9. termos/privacidade;
10. PWA e página Herbalife, que podem avançar em paralelo após as regras de conteúdo.

---

## 6. Estrutura provável de arquivos novos

```txt
backend/apps/
├── journeys/
├── community/
├── reports/
├── audit/
├── notifications/
├── challenges/
├── entitlements/
├── mentorship/
├── support/
└── legal/

frontend/src/
├── app/admin/
│   ├── journeys/
│   ├── community/
│   ├── audit/
│   ├── challenges/
│   ├── mentorship/
│   └── support/
├── app/player/
│   ├── community/
│   └── support/
├── app/mentorship/
├── app/terms/
├── app/privacy/
├── components/onboarding/
├── components/notifications/
├── services/
│   ├── journeyService.ts
│   ├── communityService.ts
│   ├── reportService.ts
│   ├── auditService.ts
│   ├── notificationService.ts
│   ├── challengeService.ts
│   ├── mentorshipService.ts
│   └── supportService.ts
└── types/
    ├── journeys.ts
    ├── community.ts
    ├── reports.ts
    ├── audit.ts
    ├── notifications.ts
    ├── challenges.ts
    ├── mentorship.ts
    └── support.ts
```

Criar cada app/service somente na fase correspondente. Não gerar toda a estrutura vazia antecipadamente.

---

## 7. Estratégia de qualidade, segurança e operação

### Backend

- testes unitários dos services de domínio;
- testes de API para papel, propriedade e isolamento de grupo;
- testes de constraints e concorrência em reação, submissão e pontuação;
- `select_related`/`prefetch_related` e testes de número de queries nos feeds;
- migrations reversíveis e migrações de dados idempotentes;
- arquivos validados por MIME real, extensão, tamanho e autorização de download;
- throttling em login, comentários, reações, suporte e uploads;
- paginação obrigatória em timeline, auditoria, notificações e chamados.

### Frontend

- TypeScript e ESLint sem erros;
- componentes com loading, erro e estado vazio;
- impedir múltiplos cliques e submissões duplicadas;
- acessibilidade de modal/tour, foco, teclado e leitores de tela;
- testes dos fluxos críticos com a ferramenta de testes adotada pelo projeto;
- preservar uso de `src/lib/api.ts`, services e CSS Modules.

### Deploy

- executar backup antes de migrations de dados;
- aplicar migrations antes de subir frontend dependente dos novos campos;
- usar feature flags para comunidade, mentoria e PWA quando possível;
- acompanhar erros, latência, tamanho de uploads e filas de notificação;
- definir armazenamento persistente/objeto para mídias antes de produção;
- configurar política de retenção e backup para auditoria, chamados e conteúdos.

### Comandos de validação por entrega

```bash
cd backend
source .venv/bin/activate
python manage.py makemigrations --check
python manage.py check
python manage.py test

cd ../frontend
npm run lint
npm run build
```

---

## 8. Decisões de negócio pendentes

Estas respostas devem ser registradas antes da fase afetada:

1. As três etapas da Jornada são consecutivas (63 dias) ou há intervalo entre elas?
2. O mesmo jogador pode participar simultaneamente de mais de um grupo/Jornada?
3. “Vários grupos por jogo” significa compartilhar um modelo de jogo ou compartilhar a mesma execução e ranking? Este plano recomenda execuções isoladas por grupo.
4. O prazo das 22h usa sempre a data da rodada ou a data/hora de publicação de cada desafio?
5. Sábados, domingos e feriados alteram o prazo?
6. Admin/mediador pode reabrir evidência vencida? Quem pode e por quanto tempo?
7. Evidências aprovadas entram automaticamente na comunidade ou somente com consentimento expresso? Este plano recomenda consentimento.
8. Quais reações existirão e jogadores podem criar posts livres?
9. Quem modera conteúdo: ADMIN, mediador do grupo ou ambos?
10. Ranking da comunidade será por jogo, etapa, Jornada ou acumulado? Deve haver um filtro claro.
11. Pontos de desafio-relâmpago entram em qual ranking?
12. Quais papéis podem ver auditoria e por quanto tempo os eventos serão retidos?
13. Como os acessos a jogo/mentoria são concedidos: manualmente, pagamento ou integração externa?
14. Conteúdo de mentoria será hospedado pela plataforma ou incorporado de provedor de vídeo?
15. O progresso de vídeo/documento precisa ser obrigatório e reportável?
16. Quais administradores recebem chamados e por qual canal: somente notificação interna, e-mail ou ambos?
17. Quais formatos finais dos relatórios são obrigatórios: tela, CSV e/ou PDF?
18. Qual é o fluxo oficial e vigente de cadastro/desconto Herbalife e quais alegações estão aprovadas?

---

## 9. Definição de pronto global

Um requisito só deve ser considerado concluído quando:

- regra de negócio e permissão estiverem implementadas no backend;
- migrations e eventual migração de dados estiverem testadas;
- API estiver documentada e tipada no frontend;
- interface tiver estados de loading, erro e vazio;
- isolamento entre grupos e usuários estiver coberto por testes;
- lint, build e testes aplicáveis passarem;
- páginas forem verificadas em desktop e mobile;
- arquivos sensíveis ou gerados não tiverem sido adicionados ao repositório;
- documentação de variáveis, deploy e operação estiver atualizada;
- arquivos alterados e comandos de teste forem registrados na entrega.

---

## 10. Primeiro recorte recomendado

Começar por uma entrega pequena e de alto valor:

1. persistir `evidence_due_at` nas jogadas;
2. bloquear evidência após 22h no backend;
3. exibir o prazo na home do jogador;
4. concluir o fluxo de `first_access_completed`;
5. implementar o tour guiado e a opção de revê-lo;
6. adicionar testes de prazo, timezone, permissão e onboarding.

Esse recorte usa estruturas já existentes, melhora imediatamente a experiência do jogador e prepara os padrões de service, auditoria e notificações para as fases maiores.
