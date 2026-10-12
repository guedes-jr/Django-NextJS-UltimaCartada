# Plano de implementação — responsividade e navegação

## Objetivo e escopo

Tornar a landing page, as páginas públicas e as áreas do jogador e da administração confortáveis em celular, tablet e desktop, com prioridade para os menus. Esta etapa é de planejamento: não altera componentes, estilos ou contratos da API. A implementação deve continuar em Next.js, TypeScript e CSS Modules, preservando a identidade visual atual (preto, dourado e branco).

## Diagnóstico inicial no código

| Superfície | Situação atual | Trabalho prioritário |
| --- | --- | --- |
| Landing (`src/app/page.tsx`, `page.module.css`) | Seis links e o acesso ao login ficam sempre expostos; abaixo de 980 px o cabeçalho vira coluna e os links quebram linha. | Menu móvel recolhível que mantenha a marca e o acesso principal visíveis, sem transformar o cabeçalho em várias linhas. |
| Jogador (`src/components/layout/PlayerLayout.tsx` e CSS Module) | Já há botão com `aria-expanded` e menu recolhível abaixo de 900 px; abaixo de 640 px marca e botão ocupam linhas completas. | Compactar o cabeçalho e revisar abertura, fechamento, foco, rolagem e convivência com o tour de primeiro acesso. |
| Admin (`src/components/layout/AdminLayout.tsx` e CSS Module) | A navegação vira barra lateral sobreposta abaixo de 900 px, com overlay. | Garantir foco, fechamento por teclado/rota, rolagem do painel, bloqueio da rolagem de fundo e uso com notificações. |
| Páginas públicas (`/public/cartada-viva`, `/public/consultoria`, `/public/herbilife`) | Cada página tem seu próprio cabeçalho; as regras móveis reorganizam ou espalham os links. | Harmonizar o padrão de menu móvel e os pontos de quebra, sem perder os links específicos de cada página. |
| Conteúdo do sistema | A comunidade já muda o ranking para uma coluna abaixo de 980 px; relatórios usam grades e rolagem horizontal em tabelas. | Validar largura mínima real, controles, cartões, tabelas, modais e textos longos; corrigir excessos por tela. |

Esse diagnóstico é baseado no código. A existência e a gravidade de cortes visuais ainda devem ser confirmadas em navegador/dispositivo antes dos ajustes finos.

## Fase 1 — Linha de base e inventário visual

1. Testar as rotas `/`, `/public/cartada-viva`, `/public/consultoria`, `/public/herbilife`, `/login`, `/player/home`, `/player/community`, `/admin/dashboard` e `/admin/reports` em 320, 360, 390, 768, 900, 1024 e 1440 px. Incluir menu aberto e fechado, conteúdo longo e estados vazios.
2. Registrar capturas e problemas por rota: rolagem horizontal da página, conteúdo cortado, sobreposição, alvos pequenos, foco invisível e distância excessiva entre marca e menu. Testar zoom de 200% e navegação por teclado.
3. Separar problemas de layout de problemas funcionais; definir pontos de quebra pelo espaço necessário ao conteúdo, sem depender de um modelo específico de aparelho.

**Entrega:** inventário reproduzível de defeitos e capturas de referência antes/depois. Não substituir as imagens do README até a interface final ser aprovada.

## Fase 2 — Menus de navegação (prioridade máxima)

1. **Landing:** introduzir botão de menu em larguras compactas; manter marca e CTA “Entrar” acessíveis; apresentar links em painel vertical com área de toque mínima de 44 × 44 px. Fechar ao escolher link/âncora, ao pressionar Esc e ao mudar de rota. Ajustar `scroll-margin-top` das seções alcançadas por âncora sob cabeçalho fixo.
2. **Páginas públicas:** reaproveitar, quando fizer sentido, um componente de cabeçalho público parametrizado por links; evitar copiar estados e handlers em três páginas. Preservar os destinos e a semântica de cada página.
3. **Jogador:** manter o menu existente e compactar marca, botão e saída no mobile; definir altura máxima pela área visível (`dvh`, com fallback), permitir rolagem interna e não cobrir ações essenciais. Fechar ao navegar e assegurar que o tour consiga apontar para a navegação no estado adequado.
4. **Admin:** manter a barra lateral; ao abrir, mover foco para o painel, impedir foco no conteúdo atrás dele e bloquear rolagem de fundo; ao fechar por Esc, overlay, link ou navegação, devolver foco ao botão. Conferir a ordem de empilhamento com notificações e modais. Em desktop, a barra continua visível sem overlay.
5. **Acessibilidade comum:** usar `button`, `nav` nomeada, `aria-expanded`, `aria-controls`, indicação de página atual (`aria-current="page"`) e foco visível. Evitar links ocultos acessíveis por teclado. Respeitar `prefers-reduced-motion` nas transições.

**Critério de aceite:** em 320–900 px, todos os destinos de navegação e a saída permanecem alcançáveis sem rolagem horizontal; menus abrem e fecham por toque e teclado; a rota ativa é identificável; não há foco perdido atrás de painéis fechados/abertos.

## Fase 3 — Estrutura responsiva das telas

1. Padronizar contêineres, espaçamento e limites de largura; usar `minmax(0, 1fr)`, `min-width: 0` e dimensões fluidas onde grades/flexbox possam forçar overflow. Manter estilos específicos nos CSS Modules; reservar `globals.css` a tokens e regras realmente globais.
2. Revisar hero, imagens, depoimentos e CTAs da landing e páginas públicas, inclusive textos longos em 320 px e imagens com recorte seguro.
3. Priorizar `/player/community`: composição de postagem, filtros, evidências, reações, comentários e ranking em uma coluna; o ranking deve continuar fácil de encontrar sem empurrar toda a timeline para baixo desnecessariamente. Confirmar estados de carregamento, erro e vazio.
4. Revisar jogador (home, evidências, desempenho, ranking, mentoria) e admin (dashboard, cadastros, auditoria, relatórios e chamados). Em tabelas densas, manter cabeçalhos legíveis com contêiner de rolagem rotulado ou adotar cartões móveis quando isso melhorar a leitura; não cortar ações nem dados essenciais.
5. Revisar formulários, seletores, popovers e modais com teclado virtual e `100dvh`/safe areas; botões de envio não devem ficar ocultos nem permitir cliques acidentais.

**Critério de aceite:** nenhuma rota prioritária exige rolagem horizontal da página em 320 px; textos e ações não ficam cortados; layout mantém hierarquia e contraste da marca; componentes interativos funcionam com toque e teclado.

## Fase 4 — Verificação e entrega incremental

- Implementar em pequenos lotes: (A) landing e páginas públicas, (B) layouts jogador/admin, (C) páginas de conteúdo. Cada lote deve ter comparação visual antes/depois e revisão independente em desktop para detectar regressões.
- Executar `cd frontend && npm run lint` e `cd frontend && npm run build` (confirmar scripts disponíveis antes); testar manualmente os menus em viewport móvel e desktop, com mouse, toque e teclado. Se houver infraestrutura de testes de interface, adicionar cenários para abrir, navegar e fechar menus; caso contrário, avaliar a adoção em tarefa separada.
- Repetir a matriz da Fase 1 em Chromium e, quando disponível, Safari/iOS e Chrome/Android. Conferir contraste, foco, zoom 200%, orientação paisagem e redução de movimento.
- Atualizar capturas do README somente após estabilizar as telas, se ainda representarem a interface anterior.

## Ordem sugerida de execução

1. Diagnóstico visual e correções críticas de overflow.
2. Menu da landing e cabeçalhos públicos.
3. Menu do jogador e barra lateral do admin, incluindo acessibilidade.
4. Comunidade/timeline e ranking; depois relatórios e demais telas.
5. Regressão, captura final e documentação.

Não há mudança de backend prevista. Se a auditoria revelar que alguma tela depende de dados ou contratos novos, registrar separadamente antes de ampliar o escopo.
