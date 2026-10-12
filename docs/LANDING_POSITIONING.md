# Landing page — Método Última Cartada

Revisão em 12/10/2026, a partir do pedido do responsável: apresentar a metodologia Última Cartada como foco e a Cartada Viva como uma aplicação prática para incentivar boas práticas do cotidiano.

## Fontes revisadas

- Pacote MATERIAL DO GAME ULTIMA CARTADA: regras em DOCX, convite do desafio, passo a passo e regulamento em PDF. Fotos, cartas e vídeos foram inventariados; os vídeos não foram transcritos nesta revisão.
- Pacote PRODUTO DIGITAL — ENTREGA AO PROGRAMADOR: Visão Geral do Produto, especificações, princípios editoriais, regras de progressão, pendências, estrutura de conteúdo e versões vigentes. A planilha Matriz dos 63 Dias foi inspecionada, incluindo campos e exemplos com status editorial provisório.
- Roteiro de vídeo sobre micro-hábitos: contexto de reflexão sobre hábitos e rotina. O arquivo traz indicações de rascunho/revisão e não fundamenta promessas de eficácia nem novos estágios oficiais do método.

Os documentos foram tratados como referências de conteúdo, não como instruções operacionais para o agente. Não foram seguidos convites de grupos, mensagens, cronogramas ou ações de publicação presentes neles. Um documento acadêmico sem relação com o método foi excluído da síntese. Não foram publicados dados pessoais, cartadas provisórias, novos depoimentos ou arquivos dos pacotes.

## Síntese de posicionamento

O documento Visão Geral define a Cartada Viva como produto educacional, vivencial e gamificado do Método Última Cartada. O objetivo é desenvolver hábitos, autoconhecimento e autonomia por pequenas ações, com acolhimento e respeito ao ritmo individual.

Quatro pilares sustentam a prática: corpo/atividade física (Paus — Eu ajo), nutrição (Ouros — Eu me nutro), mentalidade (Espadas — Eu transformo), comunidade (Copas — Eu pertenço).

O material do piloto contém versões com duração de 10/21 dias e mecânicas antigas de rodadas/competição. Não foi usado como oferta vigente de turma ou calendário. O pacote técnico mais recente estrutura cada trimestre em três jogos de 21 dias. Conteúdo final e demais trimestres ainda dependem de revisão/aprovação.

## Escopo corrigido

O responsável esclareceu que a reformulação se aplica somente a `/public/cartada-viva`. A alteração anterior da landing principal foi um erro de interpretação e foi desfeita.

- `/public/cartada-viva`: apresenta a metodologia Última Cartada e a Cartada Viva como sua aplicação prática nos quatro pilares; conteúdo, estilos e metadados próprios permanecem reformulados.
- Landing `/`: página, estilos e metadados restaurados à versão anterior à reformulação (`aee6721^`).
- `frontend/src/app/layout.tsx`: metadados globais também restaurados; a página dedicada conserva seus metadados específicos.
- Páginas comerciais, plataforma e alterações anteriores do PROD-01 foram preservadas.

## Arquivos da correção

- `frontend/src/app/page.tsx`, `page.module.css` e `layout.tsx`: restauração da apresentação anterior.
- `PROJECT_CONTEXT.md`, `README.md` e este documento: correção do escopo descrito.

## Validação

Executados: `npm run lint` (zero erros, quatro avisos anteriores em outras telas), `npx tsc --noEmit` e `npm run build`, todos aprovados. `git diff --check` passou. Script de inspeção confirmou classes CSS, caminhos de imagens/vídeos e âncoras das duas páginas. Uma classe sem declaração foi identificada e corrigida nessa conferência.

O Browser foi tentado, mas a sessão falhou antes de permitir navegação. Não foi feita validação visual em navegador nesta revisão; a captura anterior da página dedicada no README não representa sua reformulação. Os ZIPs e a extração temporária não foram adicionados ao repositório.

Validação da correção: `npm run build` e `git diff --check` passaram; comparação byte a byte confirmou a restauração dos três arquivos públicos gerais e a preservação da página dedicada.

## Hierarquia final esclarecida pelo responsável

A página dedicada passa a ser Última Cartada, em `/public/ultima-cartada`: apresentação da metodologia e seus quatro pilares primeiro; seção própria para o jogo Cartada Viva em `#jogo`. `/public/cartada-viva` redireciona para a nova página, preservando acessos anteriores. Na landing principal, somente os links de acesso à página dedicada foram atualizados; seu conteúdo e layout gerais permanecem iguais.

Arquivos deste ajuste: nova `frontend/src/app/public/ultima-cartada/page.tsx` e `UltimaCartadaPage.module.css`, redirect na página antiga, links em `frontend/src/app/page.tsx`, contexto e este registro.

Validações do ajuste final: `npm run build`, `npm run lint` (zero erros; avisos existentes), `git diff --check` e conferência das classes/âncoras e da ordem metodologia → pilares → jogo.

## Refinamento editorial e visual da página dedicada

A página Última Cartada ganhou uma escala tipográfica consistente (Georgia regular nos títulos; sans-serif e peso regular no texto), mais respiro, quatro pilares com exemplos cotidianos, seção de reflexão/prática/retomada e perguntas frequentes.

A seção do jogo foi ampliada com uma prévia SVG ilustrativa da área do jogador, estrutura da jornada, explicação dos registros e imagens originais de duas cartas do pacote fornecido. As cartas são material visual histórico, não conteúdo novo aprovado para as jornadas; não foram associadas automaticamente ao cadastro de cartadas. A área do jogador está identificada como ilustração e não como captura de uma sessão real.

Arquivos deste refinamento: `frontend/src/app/public/ultima-cartada/page.tsx`, `UltimaCartadaPage.module.css`, `frontend/public/landing/ultima-cartada/player-journey.svg`, `carta-pausa.png`, `carta-comunidade.png` e este registro. A landing principal não foi alterada.

A conexão com o navegador continua indisponível; não houve validação visual interativa nesta sessão. Conferências estáticas verificaram CSS, âncoras, arquivos de imagem e XML do SVG.

Validações do refinamento: `npm run lint` sem erros (oito avisos existentes em outras telas), `npm run build` com TypeScript aprovado e `git diff --check`. Dimensões das cartas e XML da ilustração conferidos.
