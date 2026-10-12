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

## Alterações na apresentação pública

- Landing `/`: identidade textual Última Cartada; hero centrado em escolhas cotidianas; apresentação da metodologia; quatro pilares; tradução acessível da prática; Cartada Viva como aplicação; autora, experiências existentes e contato.
- “Perceber, escolher, praticar” é uma explicação editorial da proposta, apresentada como tal. Não é anunciada como divisão oficial/certificada do método.
- `/public/cartada-viva`: relação com o método, pilares e prática cotidiana substituem o destaque técnico a telas/rodadas/ranking. A URL e o acesso à plataforma foram preservados.
- Metadados públicos alinhados à metodologia e à aplicação educacional, sem caracterizar o game como tratamento clínico.
- Identidade preto/dourado/branco, fotos e depoimentos já utilizados no repositório, CSS Modules e navegação pública existentes reutilizados.
- Oferta de seis meses, bônus exclusivo, promessas de emagrecimento, citação sem fonte e divulgação Herbalife deixam o destaque da landing. As páginas de consultoria/Herbalife continuam existentes; a separação comercial completa permanece no escopo de PROD-07.

## Arquivos deste recorte

- `frontend/src/app/page.tsx` e `page.module.css`.
- `frontend/src/app/public/cartada-viva/page.tsx` e `CartadaVivaPage.module.css`.
- `frontend/src/app/layout.tsx` (metadados).
- `PROJECT_CONTEXT.md`, `README.md` e este documento.

## Validação

Executados: `npm run lint` (zero erros, quatro avisos anteriores em outras telas), `npx tsc --noEmit` e `npm run build`, todos aprovados. `git diff --check` passou. Script de inspeção confirmou classes CSS, caminhos de imagens/vídeos e âncoras das duas páginas. Uma classe sem declaração foi identificada e corrigida nessa conferência.

O Browser foi tentado, mas a sessão falhou antes de permitir navegação. Não foi feita validação visual em navegador nesta revisão; as capturas anteriores do README não representam a nova landing. Os ZIPs e a extração temporária não foram adicionados ao repositório.
