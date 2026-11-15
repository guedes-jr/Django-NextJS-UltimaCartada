# Guia de aplicação e criativos — Magaly Abreu

Status: **rascunho para revisão**, 13/11/2026. Direção normativa em [DESIGN.md](../DESIGN.md); requisitos em [CONSULTORIA.md](../CONSULTORIA.md). A paleta e as famílias tipográficas foram aprovadas no briefing. As composições, fundos e aplicações desta entrega ainda precisam de aceite visual.

## Conferir os exemplos

Com o frontend em desenvolvimento, abra `/preview/consultoria/guia-visual`. A página mostra paleta, tipografia, CTAs, estado desabilitado, hierarquia de marcas, aplicações do símbolo existente do game, Story e capa/compartilhamento. A seção “Áreas de acesso” acrescenta provas visuais de login/cards com campos desabilitados, sem login ou dados reais. Header, rodapé e contato usam os mesmos componentes das propostas.

A prévia `/preview/consultoria/herbalife` mostra a atividade comercial separada, com contato próprio e sem exigir compra para conhecer as outras experiências. Ambas as rotas estão sob o bloqueio de produção da prévia e usam noindex/nofollow.

## Fontes e componentes de referência

| Material | Fonte no repositório |
| --- | --- |
| Paleta, cores semânticas e tema de navegação | [BrandTheme.module.css](../frontend/src/components/consultoria/BrandTheme.module.css) |
| Escalas, botões, seções, FAQ e layout | [Consultoria.module.css](../frontend/src/components/consultoria/Consultoria.module.css) |
| Composição do guia | [StyleGuide.tsx](../frontend/src/components/consultoria/StyleGuide.tsx) e [estilos](../frontend/src/components/consultoria/StyleGuide.module.css) |
| Fontes oficiais locais e licenças | [README das fontes](../frontend/src/assets/fonts/README.md) |
| Símbolo existente do game, preservado | [cartada-viva-mark.png](../frontend/public/cartada-viva-mark.png) |
| Fundo Story sem texto ou logo | [story-background.svg](../frontend/public/consultoria/templates/story-background.svg) |
| Fundo de compartilhamento sem texto ou logo | [share-background.svg](../frontend/public/consultoria/templates/share-background.svg) |

Os originais de MA, assinatura e marca da mentoria continuam pendentes. O nome digitado em exemplos é identificação editorial, não uma nova assinatura. Não reconstruir os símbolos nem apagar subtítulos dentro de imagens prontas. As duas provas do game mostram o mesmo PNG sem recoloração, em superfícies clara e escura.

## Usar os fundos

- Story: SVG 1080 × 1920, fundo marfim, base nude, faixa vinho e filete dourado discreto. Proposta de área de texto: aproximadamente 96 px nas laterais e 180 px nas extremidades; conferir as interfaces e áreas seguras do canal antes de exportar.
- Capa/compartilhamento: SVG 1200 × 630, base marfim, faixa vinho lateral e filetes. Manter o conteúdo principal no campo claro e margem inicial de 80 px; conferir recortes reais de WhatsApp e redes antes da publicação.
- Os arquivos são apenas fundos. Não incorporam fontes, logos, retratos, depoimentos, dados profissionais ou duração. A composição da página demonstra texto sobreposto com as fontes locais corretas.
- Usar Cormorant Garamond em títulos e Montserrat em informações e CTAs; preservar a assinatura original como imagem quando o arquivo aprovado estiver disponível.
- Não assumir que um fundo SVG vira uma imagem de compartilhamento final. Compor, aprovar e exportar no formato apropriado ao canal; as imagens Open Graph finais continuam pendentes no plano.

## Conteúdo e hierarquia

Marca principal: Magaly Abreu — Psicóloga e Mentora. Oferta principal: A Última Cartada — Mentoria. Experiência incluída: Cartada Viva — Game. Uma identidade dominante por área, sem três logos grandes concorrendo.

Frases aprovadas: “Consciência para mudar. Hábitos para continuar.” e “Foi uma carta, não foi o jogo.” Não acrescentar promessa de transformação, emagrecimento, ausência de dificuldades ou manutenção definitiva de resultados.

Duração, encontros, contatos e identificação profissional permanecem como “A confirmar”. Não usar telefone, perfil, preço, registro ou depoimento fictício para preencher um criativo. O game não tem modalidade independente lançada. Herbalife é apresentado como atividade comercial separada, não como requisito das demais experiências.

## Uso pelo Claude

Consultar DESIGN.md, este guia e os componentes antes de produzir conteúdo. Reutilizar a paleta e as proporções aprovadas; identificar cada nova peça como rascunho até revisão. Preservar originais de marca, registrar versão e aceite na auditoria e não tratar exemplos de composição como autorização para publicar. Este material está disponível no repositório; não houve envio automático a terceiros.
