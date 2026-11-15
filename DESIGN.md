# Design — Magaly Abreu, A Última Cartada e Cartada Viva

Versão inicial: 13/11/2026. Fonte normativa: [CONSULTORIA.md](CONSULTORIA.md) e cinco imagens anexadas pelo responsável. Execução e status: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Diagnóstico e inventário: [docs/CONSULTORIA_DIAGNOSTICO.md](docs/CONSULTORIA_DIAGNOSTICO.md).

## 1. Autoridade e uso pela IA

Leia este arquivo antes de criar ou alterar interface, texto de apresentação ou material visual da atualização. O briefing aprova a arquitetura de marca, paleta, fontes e preservação dos símbolos. As medidas, tokens semânticos, grids e exemplos abaixo são propostas técnicas para manter consistência; não representam telas aprovadas pela consultoria.

O site atual usa preto/dourado/branco e Arial. Esse é o estado legado, não a direção das novas peças. A migração deve preservar contratos e comportamento e ser validada em ambiente isolado. Não substituir a versão pública sem aprovação e autorização expressa de publicação.

Não criar um estilo diferente a cada página. Reutilizar os componentes, tokens e decisões homologados. Registrar mudanças deste padrão e a aprovação correspondente na auditoria. Se faltar um dado editorial ou ativo original, registrar a lacuna no backlog; não completar por invenção.

## 2. Arquitetura de marca aprovada

| Contexto | Identidade dominante | Relação a apresentar |
| --- | --- | --- |
| Site principal | Magaly Abreu — Psicóloga e Mentora | Marca responsável pelo trabalho; mentoria como oferta principal |
| Página da mentoria | A Última Cartada — Mentoria | Magaly identificada como responsável; inclui o Game Cartada Viva |
| Página do game | Cartada Viva — Game | Experiência educativa de hábitos ligada a Magaly e incluída na mentoria |
| Atividade Herbalife | Identidade comercial própria, separada | Sem sugerir que a compra seja condição da mentoria ou do game |

Uma identidade dominante por região. Não colocar três logos grandes concorrendo no hero. Metodologia pode explicar a abordagem, mas não constitui terceira oferta comercial. Não chamar a mentoria de “Consultoria”. Não apresentar o game como acompanhamento psicológico independente.

Mensagem central literal: **Consciência para mudar. Hábitos para continuar.**

Frase simbólica literal: **Foi uma carta, não foi o jogo.**

## 3. Logos e imagens recebidas

As cinco referências vistas nesta conversa mostram:

1. Monograma MA branco em disco preto, com contorno circular interno branco e margem externa branca; imagem vertical.
2. Monograma MA preto em fundo branco com dois contornos circulares pretos; referência aproximadamente quadrada.
3. Assinatura manuscrita Magaly Abreu branca em fundo preto; composição aproximadamente quadrada com amplo respiro.
4. Assinatura manuscrita Magaly Abreu preta em fundo branco; composição horizontal.
5. Outra aplicação vertical do monograma preto e contornos circulares sobre branco, visualmente equivalente à segunda variante, com enquadramento diferente.

Essas observações não certificam transparência, resolução final ou arquivos vetoriais. Os anexos não foram copiados automaticamente para `frontend/public`. As imagens fornecidas não mostram os símbolos completos da mentoria e do game; conferir os ativos existentes e solicitar os originais apropriados antes de produzir variantes.

### Regras invariáveis

- Preservar integralmente a assinatura e o monograma circular MA; não trocar a assinatura por texto em fonte cursiva, reconstruir as letras ou gerar um símbolo semelhante.
- Mentoria: preservar carta com monograma, estrela e elementos vegetais. Game: preservar carta com monograma e elementos de crescimento. Conferir os originais, sem inferir o desenho a partir do nome.
- Não distorcer, inclinar, adicionar sombras, brilho, contorno, textura ou filtros de recoloração às logos. Não recortar o círculo nem os traços da assinatura.
- Manter cores originais preto/branco/dourado enquanto não houver versões adaptadas aprovadas. Cores novas pertencem ao layout e não autorizam recolorir os arquivos.
- Preferir originais vetoriais ou PNG transparente em alta resolução. Não simular transparência usando recorte que destrua o desenho ou misturando modos de composição sem revisão.
- Usar aplicação clara sobre superfície escura e escura sobre clara somente quando a variante original existir. Referências com fundo opaco precisam de composição que respeite esse fundo.
- Se houver subtítulo antigo incorporado à imagem, obter editável ou preparar uma proposta corrigida para aprovação; não apagar trechos improvisadamente.
- Descrições oficiais em texto acessível: “A Última Cartada — Mentoria” e “Cartada Viva — Game”. Nunca usar “Jogo terapêutico e mentoria em grupo” como subtítulo conjunto.

### Aplicação proposta, sujeita à prévia

Área livre mínima inicial: 25% da altura do símbolo em todos os lados. Para a assinatura, usar respiro equivalente a 25% de sua altura útil, sem contar margens embutidas do arquivo. Conferir visualmente cada ativo antes de definir tamanho mínimo final.

Monograma no header: faixa inicial de 40–56 px no celular e 48–64 px no desktop, apenas se os traços permanecerem legíveis. Assinatura: largura inicial de 160–240 px, proporcional ao arquivo, com versão compacta original quando necessário. Não comprimir a assinatura para fazê-la caber ao lado de muitos links.

Definir favicon a partir de variante compacta aprovada; não presumir que assinatura inteira funciona em 16/32 px. Ícones PWA/maskable e compartilhamento exigem provas de recorte. Preparar variantes horizontais e compactas somente quando os arquivos originais permitirem, com aprovação de qualquer nova composição.

## 4. Paleta oficial e função proposta

| Token proposto | Cor aprovada | Uso |
| --- | --- | --- |
| `--brand-wine` | `#702C40` — vinho profundo | Ações principais, títulos fortes e áreas de destaque |
| `--brand-plum` | `#493044` — ameixa | Texto principal, títulos, rodapé e superfícies escuras |
| `--brand-rose` | `#C98F97` — rosé antigo | Apoios, detalhes e superfícies secundárias |
| `--brand-nude` | `#E9D4CC` — nude rosado | Seções de respiro e fundos de apoio |
| `--brand-ivory` | `#FAF5EF` — marfim | Fundo principal e texto em superfícies escuras |
| `--brand-gold` | `#B79258` — dourado fosco | Detalhes discretos, filetes e pequenos elementos decorativos |

Combinações iniciais: ameixa sobre marfim/nude; marfim sobre vinho/ameixa; vinho sobre marfim. Rosé e dourado não devem ser usados como texto pequeno em fundo claro sem medição de contraste. Dourado não deve dominar grandes blocos de texto. Não usar cor como único sinal de erro, seleção ou progresso.

Tokens semânticos propostos: `--color-bg` → marfim; `--color-surface` → marfim ou branco de ativo preservado; `--color-surface-soft` → nude; `--color-text` → ameixa; `--color-heading` → vinho; `--color-action` → vinho; `--color-action-hover` → ameixa; `--color-on-action` → marfim; `--color-accent` → dourado. Bordas, texto secundário, erros e sucesso precisam de valores acessíveis medidos na implementação; não inventar nova paleta de marketing.

Medir contraste de texto normal em pelo menos 4,5:1, texto grande em 3:1 e elementos de interface essenciais em 3:1. Usar foco de duas camadas claras/escuras quando necessário para sobreviver a diferentes superfícies. Nenhuma combinação deve ser declarada acessível sem medição.

Compatibilidade: inventariar consumidores atuais de `--brand-*` e `--landing-*`. Introduzir aliases progressivos, evitando alterar todos os fundos e textos pela troca isolada de um token. Cores semânticas de status não devem se tornar indistinguíveis. CSS Modules continuam sendo o padrão.

## 5. Tipografia aprovada e escala proposta

- **Cormorant Garamond:** títulos, subtítulos de destaque e frases de impacto. Pesos iniciais 500/600; confirmar legibilidade em cada tamanho.
- **Montserrat:** parágrafos, botões, menus, formulários, legendas e identificação profissional. Pesos iniciais 400/500/600, com 700 apenas quando necessário.
- Assinatura manuscrita: arquivo original, nunca uma dessas fontes.

| Estilo | Celular → desktop | Entrelinha proposta |
| --- | --- | --- |
| H1 | 40 → 64 px, fluido | 1,05–1,15 |
| H2 | 32 → 48 px, fluido | 1,15–1,25 |
| H3 | 24 → 32 px | 1,2–1,3 |
| Texto | 16 → 18 px | 1,6–1,75 |
| Navegação e botão | 15–16 px | 1,3–1,5 |
| Legenda e identificação | 14–16 px | 1,5 |

Usar rem/clamp para escala, sem impedir zoom. Comprimento de leitura: cerca de 60–70 caracteres por linha. Não usar título excessivamente fino, texto todo em caixa alta em parágrafos ou espaçamento que prejudique leitura. Um H1 por página; níveis coerentes com a estrutura. Carregar apenas pesos necessários, com fallback serif/sans adequado e estratégia para reduzir deslocamento de layout.

## 6. Layout, ritmo e imagens

Proposta de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 24, 32, 48, 64 e 96. Container máximo inicial de 1200 px, com margens laterais de 20 px no celular, 32 px no tablet e 48 px no desktop. Em 320 px, adaptar margem para 16 px se necessário.

Seções: 48–64 px verticais no celular e 80–96 px no desktop. Desktop com hero em duas colunas, texto e fotografia; celular com conteúdo essencial antes de grandes elementos decorativos. Grids evoluem de uma coluna para duas/três conforme espaço real; não usar larguras fixas que causem overflow.

Cartões e campos: raios discretos de 8–16 px, bordas suaves e sombra contida, sem estética de cassino. Preferir hierarquia, respiro e fotografia a excesso de caixas. Cartas, copas e vegetais são detalhes discretos; evitar estrelas/brilhos repetidos e aparência de adivinhação.

Fotografias de Magaly devem transmitir presença humana e profissional, preservar aparência e ter recortes aprovados. Usar proporções estáveis, dimensões declaradas, arquivos otimizados e tamanhos responsivos. Só priorizar imagem principal; carregar mídias abaixo da dobra sob demanda. Não usar imagem genérica como prova social real. Prévia de sistema deve ser identificada como ilustrativa e não conter dados privados.

## 7. Componentes e estados

| Componente | Padrão proposto |
| --- | --- |
| Header | Marca dominante à esquerda, navegação clara, acesso de participantes secundário; no celular, menu sem sobrepor ou esmagar a logo |
| Botão principal | Fundo vinho, texto marfim, Montserrat 600, altura mínima proposta 48 px, padding horizontal 24 px |
| Botão secundário | Fundo marfim ou transparente, borda/texto vinho; contraste medido na superfície efetiva |
| Link | Rótulo descritivo e indicação visível; links de texto distinguíveis sem depender só de cor |
| Card de oferta | Mentoria com prioridade; game identificado como incluído, sem aparência de outra compra obrigatória |
| FAQ | Pergunta explícita, resposta legível, acionamento por teclado, indicador de aberto/fechado |
| Formulário, se aprovado | Label persistente, ajuda de finalidade, erro junto ao campo, mensagens de sucesso e envio bloqueado durante processamento |
| Rodapé | Marca responsável, identificação confirmada, contato real, termos/privacidade e separação comercial clara |

Implementar hover, foco visível, ativo, desabilitado, carregando, erro, vazio e sucesso onde fizer sentido. Botão navega com link; ação usa button. Não desabilitar CTAs apenas visualmente. Áreas de toque de pelo menos 44 × 44 px; altura de botão proposta de 48 px. Foco não pode ficar oculto por header fixo. Respeitar movimento reduzido; transições curtas de 150–200 ms são proposta, sem animação indispensável à compreensão.

Reutilizar `PublicNavigation`, `Modal`, layouts e componentes de domínio. Preservar suporte a Esc, retorno de foco, labels e estados existentes. Em áreas autenticadas, tabelas e gráficos mantêm informação e ações acessíveis, mesmo quando a apresentação mudar.

## 8. Composição das três páginas

### Home — marca principal

Sequência proposta: header Magaly → hero com fotografia, mensagem central e mentoria → acolhimento do público → apresentação da mentoria → game incluído → quem é Magaly e dados confirmados → depoimentos autorizados se aplicáveis → contato e rodapé. Inserir a frase simbólica com respiro, sem torná-la promessa de resultado. Herbalife recebe tratamento separado e sem competir com a oferta principal.

### Mentoria

Header da mentoria com vínculo a Magaly → proposta e público → estrutura real aprovada → abordagem/metodologia como suporte → game incluído → condições confirmadas → FAQ → contato → rodapé. Não usar “Método”, “Consultoria” e “Mentoria” como produtos distintos.

### Game

Header do game com vínculo à marca principal → o que é → inclusão na mentoria → funcionamento real e telas ilustrativas → estrutura/duração aprovada → FAQ → “Quero conhecer o game” e acesso para participantes → rodapé. Sem preço, gratuidade irrestrita ou checkout de modalidade independente não decidida.

## 9. Linguagem, privacidade e CTAs

Tom: acolhedor, profundo, maduro, com autonomia e responsabilidade. Público prioritário: mulheres em ciclos de tentativas, interrupções, culpa e perda de confiança. Não culpabilizar nem diagnosticar visitantes.

Evitar garantia de emagrecimento, transformação assegurada, manutenção definitiva ou ausência de dificuldades. Não publicar duração, quantidade, preço, registro profissional ou escopo de acompanhamento sem confirmação. Participantes da mentoria têm direito ao game; as condições desse direito precisam ser coerentes com o sistema.

Rótulos de referência: “Conhecer a Mentoria A Última Cartada”, “Conhecer o Game Cartada Viva”, “Quero conhecer o game”, “Conversar com Magaly”, “Entrar na minha área”. Textos longos podem quebrar linha no celular; não substituir por rótulos ambíguos para caber.

Contato não exige relatos íntimos. Formular finalidade e coletar o mínimo somente se houver formulário aprovado. Não ativar mensagens comerciais ou rastreamento por iniciativa da implementação. Divulgação e dados profissionais são confirmados pela titular.

## 10. Celular, qualidade e entrega visual

Projetar primeiro a primeira tela móvel: marca reconhecível, H1 legível e CTA compreensível. Validar 320, 375, 390, 768, 1024 e 1440 px, zoom de 200%, orientação e textos longos. Conferir iPhone/Safari e Android/Chrome; registrar quando houver apenas emulação.

Menu não deve esconder entrada de participantes; imagens não empurram toda a proposta para baixo da primeira tela. Verificar teclado virtual, toque, rolagem, foco e mensagens de formulário. Não usar `overflow-x: hidden` para encobrir defeito de layout.

Medir carregamento, fontes/imagens, estabilidade e interatividade. Verificar contraste e comportamento efetivo, além de lint/TypeScript/build. Nenhuma aprovação visual é presumida por passar nos comandos.

## 11. Criativos e aprovação

Preparar exemplos reais aprovados de cabeçalho, rodapé, CTAs, pares de cor, tipografia, aplicação de logos e fundos para Stories/capas. Proposta de formatos: Story 1080 × 1920 px e Open Graph 1200 × 630 px, com áreas seguras verificadas na plataforma. Outros canais precisam de dimensões e recortes próprios; dimensões são especificações de produção propostas, não requisitos expressos da consultoria.

Disponibilizar guia e arquivos no repositório para que Claude utilize a mesma identidade. Não enviar a terceiros automaticamente. Identificar cada peça como rascunho ou aprovada, com data e versão.

Antes de alterar a apresentação pública, apresentar home, mentoria, game, aplicações de logos e prévias móveis. Entregar versão de teste e registrar correções e aceite. Publicação exige autorização expressa posterior à versão revisável.

## 12. Estado da implementação inicial — 13/11/2026

A prévia navegável usa tema isolado em `frontend/src/components/consultoria/Consultoria.module.css`, sem alterar os tokens globais legados. Fontes oficiais WOFF2 Latin estão em `frontend/src/assets/fonts/`, com licenças preservadas; `next/font/local` aplica Cormorant Garamond 500–600 e Montserrat 400–600 somente à prévia.

Pares de texto medidos por script (cores sólidas): vinho/marfim 9,12:1; ameixa/marfim 10,83:1; ameixa/nude 8,24:1; texto secundário `#70545E`/marfim 6,21:1 e /nude 4,73:1; nude/vinho 6,95:1. Essa medição não substitui a conferência do layout renderizado, foco, estados e interação móvel, ainda pendente.

A identificação de Magaly está em texto editorial provisório, sem fingir ser a assinatura manuscrita; os arquivos originais enviados na conversa ainda não estão disponíveis no repositório. O símbolo existente do game é reutilizado sem edição. Mentoria não recebe um símbolo inventado. Páginas e instruções locais: `docs/CONSULTORIA_PREVIEW.md`.

## 13. Guia de aplicação navegável — 13/11/2026

Os tokens da nova apresentação estão centralizados em `frontend/src/components/consultoria/BrandTheme.module.css`, aplicados somente no escopo migrado. `Consultoria.module.css` mantém composição e estilos; os tokens globais legados não foram substituídos.

A rota `/preview/consultoria/guia-visual` reúne paleta, fontes, CTAs, hierarquia e provas do símbolo existente do game em fundos claro/escuro. Exemplos de Story e compartilhamento usam os fundos SVG locais de `frontend/public/consultoria/templates/`, sem texto ou logos incorporados. Composições e área segura ainda precisam de homologação; não são imagens finais aprovadas de campanha ou Open Graph.

Instruções e arquivos para uso por Claude: [docs/CONSULTORIA_CRIATIVOS.md](docs/CONSULTORIA_CRIATIVOS.md). Material identificado como rascunho, sem envio externo e sem recriar marcas cujos originais faltam.

## 14. Aplicação nas áreas de acesso — 13/11/2026

`ConsultoriaAccessTheme` reutiliza tokens/fontes e limita os overrides CSS aos marcadores de interface das rotas de acesso. A chave de ativação pública controla sua aplicação; o admin permanece fora desse escopo. Não colocar autorização ou consulta de sessão dentro do tema.

Login: fundo marfim, títulos Cormorant Garamond, interface Montserrat, CTA vinho/marfim, campos com borda `#947480` e estados de erro preservados. Dashboard: mentoria como primeiro card, vinho/marfim; game em nude/ameixa, com CTA vinho. Estrutura da participante e portal da mentoria usam o mesmo padrão sem recolorir símbolos.

Novos pares medidos: borda `#947480` sobre marfim 3,82:1; erro `#A33227` sobre `#FFF0ED` 6,22:1. Os pares já medidos vinho/marfim, ameixa/marfim e ameixa/nude continuam em uso. Não tratar essa medição como homologação de todas as telas ou interações.

O guia apresenta provas dessas áreas na seção `#acesso`, sem dados reais e com inputs/botão de demonstração desabilitados. A migração completa de telas internas e sua aprovação continuam no plano.

## 15. Diálogos e navegação por teclado — 13/11/2026

Modal compartilhado migrado para `<dialog>` nativo, com título associado, fechamento controlado e rolagem interna. O fechamento passa pelo callback do chamador; durante operações ocupadas, a mentoria bloqueia fechar e ações repetidas. O tema segue o escopo da página, preservando o visual legado e os símbolos.

Menus público e de participantes fecham ao sair por Tab ou clicar fora; Escape só atua quando o foco pertence ao menu/acionador. Não usar Escape de uma superfície sobreposta para deslocar foco ao fundo.

O guia tem demonstração interativa em `#dialogos`, sem dados pessoais ou API. Testes unitários cobrem apenas a coordenação da rolagem. Navegação, foco, Safari/iPhone e aparelhos precisam de homologação real, ainda pendente.

## Estado sem conexão

A apresentação atualizada usa `/offline-consultoria.html`: marfim, vinho e ameixa, texto de recuperação e ações de tentar novamente/abrir a área. Manter a página autossuficiente, sem registros pessoais, formulários ou confirmação de atividades. Fontes de sistema Georgia/Arial são o fallback deliberado sem rede; não ampliar o cache para fontes ou dados privados. A apresentação legada mantém seu HTML próprio.

## Tokens semânticos e verificação reproduzível de contraste

Executar `cd frontend && npm run check:contrast`. O script lê BrandTheme.module.css, resolve aliases e compara 16 pares sólidos sem arredondar o valor usado na decisão. A matriz cobre texto principal/secundário, ações, foco/halo, bordas de controle e dois estados. Usa a fórmula de luminância relativa da [WCAG 2.2](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance) e diferencia texto de [informação visual de controles](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). Não interpreta DOM/cascata, transparência, fotografias, opacidade de estados ou conformidade integral.

O token `--color-control-border: #856571` substitui a borda de campo anterior apenas nos escopos migrados: 4,73:1 sobre marfim e 3,60:1 sobre nude. O tom anterior #947480 alcançava 3,82:1 sobre marfim e 2,91:1 sobre nude. `--color-border: #C9ACAE` continua para divisórias decorativas, sem ser o único identificador de campos. Rosé/marfim 2,46:1 e dourado/marfim 2,67:1 não são pares para texto pequeno.

Aliases semânticos novos: bg/surface → marfim; surface-soft → nude; action-hover → ameixa; accent → dourado; focus → vinho; focus-halo → marfim. Todos vivem em BrandTheme.module.css. Nenhum token global de globals.css foi substituído: brand-ink, ink-soft, paper, border, gold-dark e gold-soft continuam representando o legado; landing-* também permanece. brand-gold muda somente dentro do tema novo. Admin segue fora do escopo de ativação; Termos e Privacidade receberam wrapper próprio do tema em 13/11/2026, preservando o corpo jurídico e a versão publicados; componentes que ainda usam tokens legados exigem revisão individual. Não criar aliases globais para recolorir toda a aplicação de uma vez.

Ilustrações de interface reduzidas no celular devem manter descrição textual e identificação como ilustração, além de acesso ao arquivo ampliado quando os detalhes ficarem pequenos. Informar abertura em nova aba no rótulo, sem dados pessoais ou apresentação como screenshot de participante.
