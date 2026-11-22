# Plano de implementação — solicitação da consultoria Magaly Abreu

Atualizado em 14/11/2026. Único backlog ativo. Fonte: [CONSULTORIA.md](CONSULTORIA.md), incluindo o complemento visual, e cinco imagens anexadas pelo responsável. Padrão visual: [DESIGN.md](DESIGN.md). Diagnóstico: [docs/CONSULTORIA_DIAGNOSTICO.md](docs/CONSULTORIA_DIAGNOSTICO.md).

O plano anterior foi considerado concluído e encerrado por orientação expressa do responsável; seu histórico foi preservado em [arquivo](docs/archive/planning/IMPLEMENTATION_PLAN_PRE_CONSULTORIA_2026-11-13.md) e o encerramento registrado em [auditoria](docs/PROJECT_AUDIT.md). Nenhuma pendência antiga é transportada automaticamente para este plano.

## Como acompanhar

- `[x]` indica entrega realizada com evidência indicada. `[ ]` indica trabalho ou decisão pendente; código preexistente a reaproveitar não equivale a aceite do novo briefing.
- Executar na sequência abaixo. Dentro de cada fase, seguir a ordem dos itens. Decisões externas podem ser coletadas desde a fase 1; cada dependência bloqueia somente o recorte correspondente.
- Registrar arquivos, comandos, resultados, limitações e aceite na auditoria antes de marcar uma implementação concluída. Separar implementação, validação em teste e publicação.
- Preservar Django/DRF/PostgreSQL, Next.js/TypeScript/CSS Modules, dados, funcionalidades e contratos. A mudança visual pode ser ampla, mas deve ser implementada incrementalmente.
- Desenvolvimento e propostas em ambiente isolado estão autorizados pelo pedido. Preservar a versão pública atual até aprovação; publicar somente com autorização expressa, conforme o briefing.

## 0. Encerramento anterior e preparação documental

- [x] **CONS-00.1** Encerrar o backlog anterior por orientação do responsável e preservar seu histórico, sem declarar novos testes ou homologação em produção. Evidência: arquivo histórico e auditoria de 13/11/2026.
- [x] **CONS-00.2** Ler o briefing completo e examinar as cinco referências visuais. Evidência: diagnóstico com matriz de cobertura e inventário das imagens.
- [x] **CONS-00.3** Inspecionar páginas, navegação, tokens, metadados, PWA e autorização de produtos. Evidência: diagnóstico técnico com caminhos e limites de inspeção.
- [x] **CONS-00.4** Criar DESIGN.md e o novo plano cronológico. Evidência: estes documentos. Parâmetros técnicos propostos ainda precisam de prévia e aceite visual.

Aceite: briefing preservado, plano anterior fora do backlog ativo, documentação distingue fatos encontrados, propostas e decisões pendentes.

## Recorte em desenvolvimento — prévia navegável

Iniciado em 13/11/2026: propostas em código para home, mentoria e game em `/preview/consultoria`, `/preview/consultoria/mentoria` e `/preview/consultoria/game`, com tema isolado, componentes compartilhados e fontes locais. As rotas públicas existentes não foram substituídas. O build de produção bloqueia a prévia por padrão; a homologação pode habilitá-la explicitamente em ambiente apropriado.

As propostas responsivas foram implementadas, mas CONS-03.1, CONS-03.2 e CONS-03.3 permanecem pendentes até conferência visual de desktop/celular, com inspeção pontual iniciada pelo Chrome nativo (home desktop/375 px, mentoria 375 px e game 375/320 px); conferência integral e aceite continuam pendentes. CONS-04.2 e CONS-04.4b ainda dependem de revisão de impacto/interação. Os componentes de CONS-04.3 foram entregues, e a migração técnica inicial das áreas de acesso está em CONS-04.6a; isso não equivale a migração integral ou homologação visual. Por orientação posterior do responsável em 13/11/2026, duração, encontros, WhatsApp, Instagram e identificação profissional usam placeholders “A confirmar”, centralizados no código e visíveis no painel de revisão da prévia. Essas lacunas não interrompem o desenvolvimento visual. Perguntar novamente na revisão final e substituir antes da publicação. Originais das marcas continuam pendentes na fase 1. Evidências e comandos em `docs/PROJECT_AUDIT.md`; uso local em `docs/CONSULTORIA_PREVIEW.md`.

## Integração às URLs definitivas — 13/11/2026

As páginas novas também estão integradas a `/`, `/public/ultima-cartada` e `/public/cartada-viva`. Após orientação posterior do responsável, `/public/cartada-viva` passou a ser informativa e `/public/consultoria` redireciona para a mentoria nos dois modos; a chave `ENABLE_CONSULTORIA_SITE=true` continua controlando a apresentação compartilhada restante. Componentes aceitam mapas de rotas distintos para prévia e versão definitiva, sem links indevidos para `/preview` na nova versão pública.

Metadados, canonical, Open Graph textual e descrição/cores PWA acompanham o novo posicionamento quando ativado. Ícones/logos originais e revisão visual continuam pendentes. Dois builds de produção locais, com a chave desligada e ligada, passaram no script `scripts/check_consultoria_routes.py` (12 respostas por modo). Isso comprova integração HTTP, não aceite visual ou autorização de publicação.

## Comunicação, atividade comercial e guia visual — 13/11/2026

Novas prévias: `/preview/consultoria/herbalife` e `/preview/consultoria/guia-visual`. Tokens centralizados em BrandTheme.module.css; o guia mostra paleta, fontes, CTAs, hierarquia, provas do símbolo existente e composições de referência. Fundos SVG sem texto/logo disponíveis para Story/capa; instruções em `docs/CONSULTORIA_CRIATIVOS.md`. São rascunhos, sem aceite visual ou ícones finais.

A nova Herbalife está integrada sob a mesma chave da versão atualizada, mantendo a URL existente e a versão legada por padrão. Contato comercial não herda o da mentoria. Nomes no login, menu, dashboard e portal da mentoria foram alinhados; símbolos ausentes não foram recriados. Validações HTTP ampliadas para cinco prévias e os dois fundos.

## Continuidade visual e condições provisórias — 13/11/2026

Tema compartilhado integrado aos layouts das áreas de acesso, mantendo a chave de ativação e o padrão legado desligado. Dashboard prioriza a mentoria; guia inclui provas de composição sem dados de participantes. A migração de telas internas e homologação real estão separadas em CONS-04.6a/CONS-04.6b.

As páginas de mentoria/game agora têm quadro de condições e FAQ de duração com “A confirmar”. Formato, duração, encontros e materiais/suporte usam `consultoriaOfferDetails`, compartilhado com o painel de revisão, sem repetir dados numéricos não confirmados. Confirmação e aceite desses itens permanecem na fase 1 e CONS-12.8, sem interromper desenvolvimento.

## Prioridade P0 — material da consultoria: primeira etapa

Recebido em `docs/consultoria/Primeira_etapa.md`. O responsável autorizou posteriormente a substituição dos textos legados pelo contexto atual da primeira etapa; isto não autoriza publicação nem substitui as confirmações comerciais ainda pendentes na fase 1. Os itens abaixo precedem mudanças editoriais genéricas equivalentes nas fases 2, 5, 6 e 10.

- [x] **CONS-P0.1** Aplicar os textos fornecidos para hero, CTA, frase secundária, apresentação profissional e correções editoriais pontuais. Entregue na prévia e, após autorização expressa, nas páginas públicas legadas correspondentes; os cards identificam explicitamente mentoria e game e os textos alternativos não chamam as ofertas de “consultoria”. Preservar a revisão de promessas, a legibilidade no celular e a necessidade de fotografia autorizada. A forma final da identificação para publicação ainda requer confirmação da titular.
- [x] **CONS-P0.2** Implementar a regra de marcas da primeira etapa: não apresentar Magaly Rica; tratar Bistrô Slim somente como Instagram comercial de produtos, sem site ativo e sem inventar URL, handle ou integração. Nenhuma marca/destino foi acrescentado à navegação pública; o painel de revisão registra o destino como pendente.
- [x] **CONS-P0.3** Completar a separação da página Herbalife: identificar a atividade como consultoria independente e distinguir cadastro para compra de produtos de oportunidade de distribuição, sem associar compra à mentoria/game. Entregue na apresentação condicionada à chave e nas superfícies públicas: a página comercial usa Magaly Abreu como marca, sem símbolo/nome da mentoria ou do Game; redação comercial e destinos continuam sujeitos a revisão antes da publicação.
- [x] **CONS-P0.4** Produzir uma relação revisável de todas as menções a 21 dias, bônus, três jogos/etapas e inclusão do game nas páginas propostas e legadas. Entregue em `docs/consultoria/MENCOES_DURACAO_E_GAME.md`; a inclusão para participantes da mentoria foi confirmada pelo responsável, mas não se deve afirmar inclusão em todas as modalidades nem alterar duração, preço, inscrição, pagamento ou acompanhamento.

Aceite: prévia da primeira etapa reflete os textos e a separação de marcas fornecidos, sem fatos, links, condições comerciais ou ativos não confirmados; responsável revisa antes de qualquer publicação.

## 1. Confirmar conteúdo, condições, ativos e destinos

Ficha consolidada de retorno: `docs/consultoria/FICHA_DE_ACEITE_DA_PRIMEIRA_ETAPA.md`. Ela reúne evidências e comportamento provisório, mas não substitui confirmação da titular.

Por orientação expressa do responsável em 21/11/2026, as confirmações externas desta fase foram adiadas para a validação final. Os dez itens abaixo são encerrados no backlog de implementação como preparação concluída, sem declarar qualquer fato pendente como confirmado e sem autorizar publicação, checkout, contato, uso de ativos ou mudança de acesso. A conferência integral permanece obrigatória em CONS-12.8 e antes de CONS-13.1.

- [x] **CONS-01.1** Confirmação de duração, formato/frequência, materiais, suporte, condições e benefícios adiada para validação final por orientação do responsável; páginas preservam “A confirmar”.
- [x] **CONS-01.2** Confirmação de jornadas, intervalos e validade de acesso adiada para validação final; não há duração comercial publicada.
- [x] **CONS-01.3** Conferência da identificação profissional completa adiada para validação final; não foram inventados dados adicionais.
- [x] **CONS-01.4** Validação de WhatsApp, mensagem e Instagram reais adiada para validação final; nenhum destino externo foi configurado.
- [x] **CONS-01.5** Recebimento e validação de marcas/originais adiado para validação final; inventário preserva os ativos pendentes sem assumir autoria ou uso.
- [x] **CONS-01.6** Conferência de subtítulos/editáveis adiada para validação final; o SVG com duração não confirmada permanece fora da página pública.
- [x] **CONS-01.7** Validação de fotografias e depoimentos adiada para validação final; vídeos de depoimento continuam fora da home e direitos não foram inferidos.
- [x] **CONS-01.8** Confirmação final da atividade Herbalife adiada; a separação e ausência de compra obrigatória permanecem aplicadas.
- [x] **CONS-01.9** Validação de checkout adiada para validação final; Hotmart continua sem configuração/destino publicado.
- [x] **CONS-01.10** Identificação de responsáveis e janela de campanha adiada para validação final; a ficha de aceite registra o modelo de retorno, sem data presumida.

Aceite: ficha de fatos aprovada, inventário de ativos e destinos verificáveis. Enquanto houver lacuna, propostas omitem números/condições não confirmados e não criam oferta independente do game.

## 2. Fechar arquitetura de informação, textos e URLs

- [x] **CONS-02.1** Arquitetura implementada: Magaly Abreu — Psicóloga e Mentora é a marca principal; A Última Cartada — Mentoria é a oferta principal; Cartada Viva — Game é experiência complementar incluída. Metodologia explica a abordagem, sem terceira oferta. Aceite integral permanece para validação final.
- [x] **CONS-02.2** Mapa implementado: `/` institucional; `/public/ultima-cartada` mentoria; `/public/cartada-viva` game informativo; `/public/consultoria` redirecionamento permanente para mentoria. A rota `/mentorship` permanece área autenticada. Aprovação integral do mapa permanece para validação final.
- [x] **CONS-02.3** Mapear links internos, URLs legadas do repositório, âncoras e redirecionamentos nos dois modos. Entregue em docs/CONSULTORIA_NAVEGACAO.md com smoke de 24 respostas por modo de produção, 11 na prévia e links/fragmentos cruzados. URLs divulgadas fora do repositório dependem do responsável; aprovação e homologação real permanecem abertas. APIs e Django Admin preservados.
- [x] **CONS-02.4** Preparar textos completos das três páginas: títulos, seções, CTAs, legendas, descrições das logos, FAQs, contato, rodapé e identificação profissional. Implementação concluída com conteúdo revisado, frases centrais, condições provisórias, identificação fornecida e limites das experiências. Logos originais, destinos de contato e aprovação editorial integral permanecem para validação final, sem conteúdo inventado.
- [x] **CONS-02.5** Explicitar inclusão do game nas três páginas novas e FAQs, sem nova aquisição. Entregue com texto centralizado, quadros de condições provisórios e verificação HTTP. Duração continua na revisão final; por autorização do responsável, a página pública legada da mentoria também informa o direito de participação no game.
- [x] **CONS-02.6** Revisar promessas e limites da nova apresentação. Leitura estática e busca por expressões antigas concluídas, sem garantias de emagrecimento, manutenção definitiva ou percurso sem dificuldades. FAQ distingue game educativo de atendimento profissional, sem inventar formato clínico da mentoria. Aceite editorial final permanece em CONS-12.6 e CONS-12.8.
- [x] **CONS-02.7** Definir menu e destinos: “Conhecer a Mentoria A Última Cartada” → mentoria; “Conhecer o Game Cartada Viva”/“Quero conhecer o game” → game informativo; “Conversar com Magaly” → contato confirmado; “Entrar na minha área” → `/login`, com encaminhamento autorizado após autenticação. Implementação concluída: menus, CTAs e rodapé públicos levam diretamente à mentoria, ao game informativo e ao login; a home usa o rótulo “Entrar na minha área”, não expõe suporte autenticado a visitantes e as âncoras de contato apontam a condições sem destino inventado. A confirmação do canal externo fica para CONS-12.8.
- [x] **CONS-02.8** Preparar matriz única de fatos/conteúdo. Entregue em docs/CONSULTORIA_DIAGNOSTICO.md, vinculada às fontes em content.ts, condições, FAQs e metadados; documento editorial antigo identificado como histórico. Fatos pendentes seguem “A confirmar”, sem números inventados.

Aceite: mapa de páginas, conteúdo e botões revisados antes da implementação das páginas; nenhuma terceira oferta ou modalidade futura anunciada como disponível.

## 3. Propostas visuais e aprovação antes da substituição pública

- [x] **CONS-03.1** Proposta da home implementada em desktop e celular: Magaly em primeiro plano, mensagem central, mentoria principal, game incluído, apresentação profissional e contato provisório. Revisão visual e aceite ficam para validação final.
- [x] **CONS-03.2** Proposta da página da Mentoria implementada em desktop e celular: identidade própria, responsável visível, público, proposta, inclusão do game, FAQ, condições provisórias e contato sem destino inventado. Revisão visual e aceite ficam para validação final.
- [x] **CONS-03.3** Proposta da página do Game implementada em desktop e celular: identidade própria, funcionamento apresentado sem prometer percurso único, vínculo com a Mentoria, prévia ilustrativa identificada e CTA informativo sem liberação de acesso. Revisão visual e aceite ficam para validação final.
- [x] **CONS-03.4** Implementação técnica concluída com os ativos disponíveis: guia visual mostra tipografia, header/rodapé, botões, fundos claros/escuros e o símbolo existente do Game preservado. Monograma, assinatura, logos completas, favicon e compartilhamento finais continuam para validação final, sem redesenho improvisado.
- [x] **CONS-03.5** Validação técnica concluída: pares sólidos de cores, controles e foco são verificados por `npm run check:contrast`, e escalas/tokens foram centralizados. Leitura visual integral, aplicações de marca e aceite das três propostas ficam para validação final; DESIGN.md não é tratado como aprovação de telas.

Aceite: propostas principais e versão móvel revisáveis; implementação pode evoluir em ambiente isolado, mas a apresentação pública atual é preservada até aprovação.

## 4. Implementar a fundação visual compartilhada

- [x] **CONS-04.1** Integrar Cormorant Garamond e Montserrat com pesos necessários, fallback e carregamento otimizado; não usar fonte para substituir a assinatura original. Entregue na prévia com `next/font/local`, WOFF2 Latin e licenças; escopo limitado à nova apresentação. Evidências técnicas na auditoria de 13/11/2026; aceite visual permanece na fase 3.
- [x] **CONS-04.2** Fundação técnica entregue: tokens semânticos de paleta, tipografia, espaçamento, largura, borda, sombra, foco e movimento foram centralizados conforme DESIGN.md, preservando aliases e escopo condicionado. Dezesseis pares sólidos passaram em `npm run check:contrast`; login, player, mentoria e documentos legais receberam o tema sem alterar regras. Impacto visual efetivo permanece para validação final.
- [x] **CONS-04.3** Preparar componentes compartilhados de marca, header, rodapé, CTAs, seção, FAQ e avisos; reaproveitar PublicNavigation e componentes existentes onde adequado. Entregues em CSS Modules com mapas de navegação para prévia e URLs definitivas, conferidos por build/HTTP. Aplicações finais das logos e aprovação visual permanecem em CONS-03.4 e CONS-03.5 e CONS-04.5.
- [x] **CONS-04.4a** Implementar tecnicamente fechamento de menus ao navegar, clicar fora ou sair com Tab; Escape restrito ao menu em foco, com retorno ao botão. PublicNavigation e PlayerLayout preservam aria-expanded/controls e o comportamento das rotas. Componentes compilados; guia e roteiro de conferência disponíveis.
- [x] **CONS-04.4b** Cobertura técnica de menus concluída: testes simulados cobrem Escape/foco, saída do menu, links, mudança de rota e limpeza de listeners; amostras públicas foram verificadas em resize e zoom. Toque, aparelhos reais, menus autenticados e homologação integral ficam para validação final.
- [x] **CONS-04.5** Implementação técnica concluída: fotos públicas preservam proporção, declararam `sizes` compatíveis com seus containers e usam textos alternativos contextuais; originais foram preservados sem distorção. Aprovação dos arquivos, direitos e logos originais fica para validação final.
- [x] **CONS-04.6a** Aplicar tecnicamente o tema compartilhado ao login, estrutura de participantes, dashboard e estrutura/conteúdos da mentoria, sob a chave de ativação. Entregue por layouts de rota e CSS Module, sem mudar sessão/permissões ou recolorir símbolos. Guia inclui provas sem dados pessoais; validações técnicas na auditoria.
- [x] **CONS-04.6c** Migrar tecnicamente o suporte da participante: tema condicionado à chave da consultoria, Modal compartilhado, erro dentro do formulário, bloqueio de envio repetido e recuperação de falha ao atualizar histórico após resposta salva. Evidências e limites em docs/PROJECT_AUDIT.md; homologação autenticada permanece em CONS-04.6b.
- [x] **CONS-04.6d** Migrar tecnicamente Configurações da participante e formulário de senha: tema isolado, campos com autocomplete, identificadores únicos, feedback anunciado e guarda de envio repetido. Em 14/11/2026, sucesso da senha foi separado de falha da atualização da sessão; nova tentativa consulta somente a sessão. Campos inválidos receberam mensagem associada e foco, com sete testes simulados no total. Builds/lint/TypeScript e limites registrados na auditoria; homologação real permanece em CONS-04.6b.
- [x] **CONS-04.6b** Migração técnica concluída para as telas/componentes autenticados no escopo: login, dashboard, mentoria, participante, jornadas, suporte, comunidade, desempenho, ranking, desafios e tour usam o tema condicionado e preservam serviços, permissões e contratos. Tabelas, modais, formulários, gráficos e cartas receberam os tratamentos e testes simulados registrados na auditoria. Admin permanece deliberadamente fora do escopo visual. Homologação visual, navegação autenticada real e dispositivos ficam para validação final.

Aceite: componentes demonstráveis em ambiente de teste, tipografia e tokens consistentes, nenhum contraste ou fluxo autenticado comprometido pela alteração global.

## 5. Corrigir nomes, navegação e inclusão do game em todo o site

- [x] **CONS-05.1** Implementar tecnicamente o mapa de rotas proposto na fase 2: home institucional, página de mentoria, game próprio e redirecionamento legado de consultoria. Game público e redirecionamento de consultoria foram integrados nos dois modos; `ENABLE_CONSULTORIA_SITE` continua controlando a apresentação compartilhada restante. Aprovação do mapa permanece em CONS-02.2; ativação/publicação depende da fase 13.
- [x] **CONS-05.2** Atualizar menus, CTAs, rodapés e mensagens de contato. Remover denominação comercial “Consultoria” onde significa mentoria e retirar “Método” como produto autônomo. Implementação concluída: menus, CTAs, rodapés e mensagens públicas levam à Mentoria, ao Game, à área autenticada ou às condições; “metodologia” permanece somente como explicação da abordagem, sem terceira oferta. Contatos reais continuam para validação final em CONS-12.8.
- [x] **CONS-05.3** Corrigir descrições das identidades para “A Última Cartada — Mentoria” e “Cartada Viva — Game”, preservando símbolos. Não usar “Jogo terapêutico e mentoria em grupo” como subtítulo conjunto. Entregue em metadados, superfícies públicas, legais e autenticadas; busca estática em todo o frontend não encontrou o subtítulo antigo nem “Magaly Rica”. Aprovação visual dos ativos permanece em CONS-03.4/03.5 e CONS-11.4.
- [x] **CONS-05.4** Atualizar textos de inclusão do game e fatos confirmados em todas as superfícies; não apresentar compra adicional ou participação independente já disponível. Entregue em páginas públicas, metadados, dashboard e portal autenticado; busca estática confirmou que referências a compra/acesso independente são negativas ou pertencem à atividade Herbalife separada. Decisões sobre futura modalidade independente permanecem na fase 14.
- [x] **CONS-05.5** Atualizar nomes nas áreas de acesso sem alterar papéis e autorização. Login identifica Magaly e as duas experiências; dashboard e portal da mentoria usam os nomes oficiais; PlayerLayout distingue marca principal, mentoria e game conforme a área, sem aplicar o símbolo do game à mentoria. Build/TypeScript validados; interação autenticada permanece em CONS-09.6.

Aceite: navegação sem links quebrados/ciclos e mensagem comercial coerente em todas as entradas, inclusive URLs antigas.

## 6. Implementar página principal da marca Magaly Abreu

- [x] **CONS-06.1** Implementação técnica concluída: Magaly é a marca principal por identificação textual legível e não usa o símbolo do Game como sua marca; há uma identidade dominante por área. Aplicação da assinatura/monograma original continua para validação final quando o ativo aprovado for fornecido.
- [x] **CONS-06.2** Implementar hero com fotografia profissional, mensagem central e CTA prioritário da mentoria; entrada de participantes é secundária e identificada. Entregue na home pública com texto da primeira etapa, fotografia existente, CTA direto para a mentoria e acesso por `/login` secundário; validação visual/aceite seguem nas fases 3 e 12.
- [x] **CONS-06.3** Apresentar público prioritário e proposta com acolhimento, sem culpabilização, promessas clínicas ou resultados garantidos. Entrega técnica revisada em 13/11/2026; aceite editorial/visual final na fase 12.
- [x] **CONS-06.4** Implementar seção da mentoria e seção do game incluído, com hierarquia assimétrica e links para páginas próprias. Metodologia aparece como explicação da abordagem. Entregue na versão nova condicionada à chave; evidência na auditoria, sem aprovação de publicação.
- [x] **CONS-06.5** Implementação técnica concluída: a home apresenta Magaly com a identificação fornecida, a navegação “Sobre Magaly” leva à apresentação e Herbalife permanece separada sem sugerir compra obrigatória para mentoria ou Game. Depoimentos autorizados e contato externo continuam bloqueados para validação final.
- [x] **CONS-06.6** Implementação técnica concluída: legendas e frases finais revisadas, H1 e atalhos focáveis protegidos, textos alternativos contextuais exigidos pelo smoke e links de nova aba com rótulo/`noopener noreferrer`. Perfil social genérico e contato legado não confirmado permanecem bloqueados. Direitos dos ativos, revisão integral e aceite visual ficam para validação final.

Aceite: a visitante identifica quem é Magaly, a oferta principal e o papel do game na primeira navegação em desktop e celular.

## 7. Implementar página da Mentoria A Última Cartada

- [x] **CONS-07.1** Implementação técnica concluída: o nome completo da Mentoria e Magaly como responsável estão visíveis, e o símbolo de naipe improvisado foi removido do cabeçalho público. A aplicação da logo aprovada continua para validação final quando o arquivo original for fornecido.
- [x] **CONS-07.2** Página da Mentoria implementada com público, proposta, benefícios possíveis, FAQ, inclusão do Game e quadro de condições. Acompanhamento, encontros, materiais e condições não confirmados permanecem como “A confirmar”, sem lacunas preenchidas por suposição; a validação comercial fica para a etapa final.
- [x] **CONS-07.3** Explicar como a metodologia sustenta a mentoria e incluir bloco visível do Game Cartada Viva como direito da participante, sem cobrança adicional. Entregue no processo/Pillars e bloco game-incluido; revisão estática registrada na auditoria.
- [x] **CONS-07.4** Implementar FAQ sobre relação entre as experiências, inclusão, duração confirmada, participação e diferença para atendimento clínico; remover respostas condicionais incompatíveis com o briefing. Entregue nas páginas da mentoria com inclusão do game confirmada e duração apresentada como pendente de confirmação, sem substituir atendimento clínico; dados comerciais continuam na fase 1.
- [x] **CONS-07.5** Implementação técnica concluída: CTAs levam às condições de participação e checkout só pode ser habilitado por URL Hotmart sintaticamente validada, sem valor padrão; contato permanece condicionado a destino aprovado. Validação da oferta e dos destinos reais fica para etapa final.

Aceite: página integralmente centrada na mentoria, sem terceira oferta e sem contradição entre FAQ, hero e condições.

## 8. Implementar página informativa própria do Game Cartada Viva

- [x] **CONS-08.1** Aplicar logo do game, descrição “Game” e vínculos visíveis com Magaly e a mentoria. Entregue na página pública informativa com o símbolo original preservado, título “Cartada Viva — Game”, navegação para a mentoria e identificação da experiência incluída; aprovação de aplicações de marca continua em CONS-03.4/11.4.
- [x] **CONS-08.2** Explicar práticas de hábitos, cartada diária, intenção/evidência, histórico, progresso e experiência em grupo conforme funcionamento real. Distinguir jornada diária e eventuais fluxos legados sem prometer funcionalidades não disponíveis à oferta. Conteúdo revisado contra fluxos existentes e distinção de percursos em 13/11/2026; homologação real permanece pendente.
- [x] **CONS-08.3** Exibir duração/etapas somente conforme decisão da fase 1, distinguindo capacidade técnica de três etapas e conteúdo efetivamente incluído na mentoria. Páginas públicas removem prazos e quantidade de jornadas não confirmados; a apresentação informativa usa “A confirmar” para duração, sem converter a capacidade técnica em oferta comercial.
- [x] **CONS-08.4** Declarar a inclusão na mentoria e implementar “Quero conhecer o game” para informação/contato confirmado, além de “Entrar na minha área” para participantes autorizadas. Entregue: CTA para como-funciona e login existente; nenhum acesso independente liberado.
- [x] **CONS-08.5** Mostrar telas ilustrativas sem dados pessoais, identificando-as como prévias; explicar privacidade e compartilhamento sem prometer algo incompatível com o backend. Entregue com SVG próprio sem prazos/quantidade não confirmados e aviso ilustrativo; privacidade revalidada por inspeção, sem novo teste autenticado.
- [x] **CONS-08.6** Estruturar a página para evolução futura sem preço, checkout, inscrição autônoma, gratuidade irrestrita ou promessa de modalidade independente. Entregue na página/FAQ, sem modalidade independente disponível; decisões futuras permanecem na fase 14.

Aceite: página própria acessível por URL e menu, útil a interessadas sem liberar acesso à plataforma.

## 9. Garantir no sistema o game incluído na mentoria

- [x] **CONS-09.1** Rastrear concessão/revogação, validade, serializers de usuário, login, dashboard, ProtectedRoute e consumidores atuais de produto. Concluído: helper de produto usado em mentoria/jornada diária; endpoints legados mantêm seus filtros por papel/grupo/usuário, sem ampliação de escopo. Registro na auditoria de 13/11/2026.
- [x] **CONS-09.2** Definir acesso efetivo derivado: MENTORSHIP vigente inclui GAME durante a validade já registrada; sem prazo adicional, matrícula automática ou alteração da concessão GAME independente. Durações comerciais continuam como “A confirmar” na fase 1.
- [x] **CONS-09.3** Implementar inclusão no backend e nos produtos retornados por login e sessão. Entregue via effective_products e serializers existentes; dashboard usa o usuário validado por ProtectedRoute, sem snapshot antigo do localStorage. Autorizações Django e filtros existentes preservados.
- [x] **CONS-09.4** Regularizar contas existentes por cálculo de direitos na leitura, sem migration, gravação de novas concessões ou matrícula indiscriminada. Contas com mentoria vigente passam a receber ambos os produtos ao atualizar a sessão; concessões GAME independentes permanecem intactas.
- [x] **CONS-09.5** Testar validade, início/fim exatos, revogação/reativação, GAME independente, usuário sem produto/inativo, resposta de login/sessão, API diária, isolamento de grupos e papéis. Suíte completa de 111 testes passou em PostgreSQL temporário em 13/11/2026. Interação real de navegador continua em CONS-09.6.
- [x] **CONS-09.6** Conferir visual e funcionalmente o fluxo autenticado da mentoria ao game em ambiente local isolado. Em 14/11/2026, Chrome com contas sintéticas confirmou login → dashboard → mentoria → game incluído, com e sem grupo/jornada. Jornada vinculada recebeu intenção/evidência, histórico e progresso persistidos; conteúdo da mentoria concluído pelo diálogo. Menu/atalho e amostras móveis em 375 px; diálogo em 320 px. Conta sem produtos voltou ao dashboard. Evidência em docs/PROJECT_AUDIT.md. Este recorte técnico não equivale a aprovação da consultoria, homologação integral das telas/aparelhos ou aceite em produção, que permanecem em CONS-12.3/12.8 e fase 13.

Aceite: mentoria válida permite o acesso previsto ao game no frontend e backend, sem ampliar permissões de dados ou alterar concessões independentes indevidamente.

Implementação de 13/11/2026: o direito ao game não equivale à matrícula em um grupo. A API pode retornar lista vazia e a home orienta procurar a responsável/suporte. O CRUD de entitlements continua mostrando concessões reais; revogar apenas um registro GAME não remove o direito derivado enquanto a mentoria estiver vigente. Para interromper o direito derivado, a mentoria precisa deixar de ser vigente. Isso não altera registros ou histórico do game.

## 10. Revisar privacidade, contato e separação comercial

- [x] **CONS-10.1** Implementação técnica concluída: a identificação fornecida “Magaly Abreu · Psicóloga · CRP 17/5894” é padrão nas superfícies públicas aplicáveis e tem teste contra regressão; home, Mentoria e Game explicitam os limites das experiências. Eventual complemento da identificação e revisão final da titular ficam para validação final.
- [x] **CONS-10.2** Revisar a separação comercial da Herbalife em página, navegação e FAQ da versão atualizada: sem compra vinculada à apresentação de mentoria/game, promessa de desconto ou confusão com atendimento profissional. Nova prévia disponível, rota /public/herbilife preservada e integração sob a chave de ativação; o smoke também exige a declaração de independência e ausência de aquisição obrigatória no modo público padrão. Contato comercial separado e ainda “A confirmar”; amostra visual em 768 px conferida em 14/11/2026, com aceite final/aparelhos ainda pendentes.
- [x] **CONS-10.3** Implementação técnica concluída para contato direto: destinos são opcionais, validados e permanecem ausentes por padrão; não há banco de leads ou formulário público. Aprovação do canal real e finalidade ficam para validação final. Caso formulário seja decidido, CONS-10.4 continua obrigatório antes de implementá-lo.
- [x] **CONS-10.4** Não aplicável à entrega atual: nenhum formulário foi aprovado ou criado; o smoke bloqueia formulários nas páginas públicas. Se for decidido criar formulário, este item deve ser reaberto com service/types/serializer, minimização de dados, controles de abuso e testes de privacidade/autorização antes de qualquer publicação.
- [x] **CONS-10.5** Não aplicável à entrega atual: não houve formulário, coleta de leads, analytics, mensagem automática ou mudança real de tratamento de dados; Termos/Privacidade foram preservados. Qualquer decisão futura de coleta/analytics reabre esta análise e exige revisão submetida à responsável antes da publicação.

Aceite: contato funcional e finalidade clara; sem coleta íntima, fluxo comercial indevido ou dados profissionais inventados. Registrar itens condicionais como “não aplicável” com decisão antes de encerrá-los.

## 11. Completar metadados, ativos e guia para criativos

- [x] **CONS-11.1** Atualizar title/description por página e padrão global, canonical e redirecionamentos. Entregue nas rotas públicas nos dois modos, com Open Graph textual, canonical por URL e remoção do subtítulo conjunto em layout/manifesto; identidade Cartada Viva e entrada do aplicativo preservadas. O smoke exige canonical e marca Open Graph da home, mentoria, game e Herbalife. Ícones e imagens de compartilhamento continuam em CONS-11.2. Títulos específicos de Termos/Privacidade acrescentados em 14/11/2026.
- [x] **CONS-11.2** Preparação técnica concluída: metadados textuais, canonical, Open Graph, cores PWA e rotas de ícone acompanham a apresentação; ícones existentes foram preservados sem redesenho. Favicon, ícones e imagens Open Graph finais com marcas aprovadas, além de recortes reais em canais, ficam para validação final.
- [x] **CONS-11.3a** Revisar nome/descrição/cores do PWA e implementar offline conforme a apresentação ativa, preservando start_url=/dashboard e cache restrito a uma página genérica. Evidência técnica: nove testes do worker, builds e contratos HTTP registrados em docs/PROJECT_AUDIT.md.
- [x] **CONS-11.3b** Cobertura técnica de PWA concluída: service worker e controle de instalação têm testes para cache offline genérico, falhas, atualização de apresentação e repetição de ações; não há cache de API ou páginas privadas no fluxo testado. Instalação/atualização/logout offline em navegadores e aparelhos reais continuam para validação final.
- [x] **CONS-11.4** Guia técnico de criativos entregue: exemplos de header/rodapé, botões, paleta, títulos, símbolo existente do Game, Story e capa/compartilhamento com tamanhos/áreas seguras estão em `docs/CONSULTORIA_CRIATIVOS.md` e no guia visual. Não foram usados depoimentos fictícios nem recriadas logos; aceite e originais ficam para validação final.
- [x] **CONS-11.5** Disponibilizar guia e assets no repositório para uso pelo Claude. Entregues guia navegável, documentação e fundos SVG de Story/capa, todos identificados como rascunhos e vinculados a DESIGN.md. Não houve envio externo; aprovação das composições permanece em CONS-11.4.

Aceite: prévias de compartilhamento coerentes, ícones legíveis e guia reutilizável com exemplos aprovados, distinguindo rascunhos.

## 12. Validar, corrigir e entregar versão de teste

- [x] **CONS-12.1** Executar `npm run lint`, `npx tsc --noEmit` e `npm run build`; registrar resultados reais e avisos. Aprovados na revisão de 13/11/2026, incluindo builds ativo/inativo e correção visual do modal. Lint sem erros/oito avisos legados. Reexecutar após mudanças futuras; não equivale à homologação visual.
- [x] **CONS-12.2** Executar verificações de backend para a inclusão do game: `python manage.py check`, `python manage.py makemigrations --check --dry-run` e suíte completa. Em 14/11/2026, check sem problemas, nenhuma migration pendente e 111 testes aprovados em PostgreSQL descartável, com mídia isolada. Evidência em docs/PROJECT_AUDIT.md. Reexecutar se regras de acesso/dados mudarem; homologação visual permanece em CONS-09.6.
- [x] **CONS-12.3** Cobertura técnica responsiva e de acessibilidade concluída: breakpoints, zoom, foco, teclado, menu, FAQ, ilustração, login e estados de recuperação receberam amostras/testes simulados documentados. Conferência integral em iPhone/Safari, Android/Chrome, aparelhos reais e inspeção visual completa ficam para validação final.
- [x] **CONS-12.4** Verificação técnica pública concluída: o smoke cruza links internos, âncoras, URLs antigas/redirecionamentos, login, páginas legais, Herbalife e assets locais das superfícies públicas. Contatos reais, encaminhamento autenticado e contas com/sem produtos ficam para validação final.
- [x] **CONS-12.5** Medição técnica local concluída: inventário de assets, `sizes`, lazy loading, respostas do otimizador e Lighthouse móvel estão em `docs/CONSULTORIA_PERFORMANCE.md` e no relatório QA; o experimento sem ganho foi revertido. Medição em redes/aparelhos reais, PWA instalada/offline e conferência de cache privado ficam para validação final.
- [x] **CONS-12.6** Revisão editorial técnica concluída: as páginas e superfícies de entrada foram confrontadas com o briefing e a matriz em `docs/CONSULTORIA_REVISAO_EDITORIAL.md`; o smoke bloqueia reintrodução de nomes, subtítulos, prazos e promessas legadas selecionadas. Originais, fatos externos e revisão final da titular ficam para validação final.
- [x] **CONS-12.7** Versão de teste isolada entregue tecnicamente: `npm run dev:consultoria`, rotas de prévia, bloqueio de produção, diagnóstico, mapa, roteiro navegável, dados provisórios centralizados e instruções em `docs/CONSULTORIA_PREVIEW.md`. Hospedagem e aceite permanecem para validação final; a prévia não substitui o site público.
- [ ] **CONS-12.8** Perguntar novamente ao responsável sobre duração da mentoria/game, encontros, WhatsApp, Instagram e identificação profissional; substituir os placeholders e validar destinos antes da publicação. Infraestrutura de configuração centralizada para fatos, Instagram e identificação profissional entregue com testes, sem preencher nem confirmar dados reais. Registrar retorno da consultoria, corrigir detalhes e obter aprovação expressa da versão final. Pendências que afetem fatos, marca ou acesso impedem o aceite do recorte correspondente.

Aceite: evidências técnicas e visuais registradas; três páginas e fluxo de acesso aprovados na versão de teste. Build aprovado sozinho não equivale a homologação visual.

## 13. Publicar após autorização expressa e acompanhar

- [ ] **CONS-13.1** Obter autorização expressa de publicação da versão aprovada; registrar versão, responsáveis e escopo.
- [ ] **CONS-13.2** Preparar deploy, backup/restauração e rollback de aplicação/dados conforme alterações; conferir variáveis e dependências, sem versionar segredos. Executar migrations somente no ambiente autorizado. O checklist de produção agora inclui gate específico da consultoria para flags, fatos finais, ativos, backup e rollback; a preparação do ambiente autorizado continua pendente.
- [ ] **CONS-13.3** Publicar preservando dados, uploads e acessos; manter `NEXT_PUBLIC_API_URL=/api/v1`, `/django-admin/` e demais contratos.
- [ ] **CONS-13.4** Conferir produção em desktop/celular: home, mentoria, game, URLs legadas, metadados, contato, login, mentoria com game incluído e PWA. Corrigir/rollback se necessário.
- [ ] **CONS-13.5** Registrar aceite em produção e evidências na auditoria; atualizar contexto/README e encerrar apenas itens efetivamente entregues.

Aceite: publicação autorizada e verificada, com possibilidade de recuperação e sem confundir aprovação de teste com aceite em produção.

## 14. Evolução futura — somente após decisão estratégica

Esta fase não bloqueia o lançamento das páginas atuais e não autoriza disponibilizar uma oferta independente agora.

- [x] **CONS-14.1** Fora do escopo desta liberação: nenhuma modalidade independente do Game foi decidida. Abrir novo recorte somente após decisão estratégica aprovada.
- [x] **CONS-14.2** Fora do escopo desta liberação: elegibilidade, duração, conteúdo, preço, condições e consentimentos de eventual oferta independente não foram definidos nem serão inferidos.
- [x] **CONS-14.3** Fora do escopo desta liberação: não implementar cadastro, checkout, pagamento ou acesso independente sem decisão, segurança, testes e autorização próprios.
- [x] **CONS-14.4** Fora do escopo desta liberação: não criar convite comercial, mensagens automáticas ou promessas para oferta independente não aprovada.
- [x] **CONS-14.5** Fora do escopo desta liberação: não instrumentar métricas, conversão ou analytics sem ferramenta, finalidade e consentimento aprovados.

Aceite: nova decisão comercial registrada antes de construir a modalidade; lançamento futuro segue validação e autorização específicas.
