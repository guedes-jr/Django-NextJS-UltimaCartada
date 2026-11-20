# Prévia da nova apresentação Magaly Abreu

Primeiro recorte implementado em 13/11/2026. Requisitos e status no [plano ativo](../IMPLEMENTATION_PLAN.md); padrão em [DESIGN.md](../DESIGN.md). Esta é uma proposta navegável em desenvolvimento, ainda sem homologação visual da consultoria.

## Abrir localmente

Com as dependências frontend já instaladas:

```bash
cd frontend
npm run dev
```

Abra a URL local informada pelo Next.js e os caminhos:

- `/preview/consultoria`: home da marca Magaly Abreu.
- `/preview/consultoria/mentoria`: Mentoria A Última Cartada.
- `/preview/consultoria/game`: Game Cartada Viva.

Por padrão, a nova apresentação estrutural segue condicionada à configuração desativada. Em 20/11/2026, o responsável autorizou substituir os textos legados pelo contexto da primeira etapa: `/`, `/public/consultoria` e `/public/ultima-cartada` receberam a redação atual sem alterar rotas, fluxos ou ativar a nova apresentação.

## O que está disponível

- Paleta aprovada e fontes Cormorant Garamond/Montserrat servidas localmente, sem dependência de download no build.
- Tema isolado em CSS Modules, preservando o visual das áreas atuais; menu existente reaproveitado com propriedades de tema e valores padrão legados.
- Header, rodapé, CTAs, apresentação da marca, mentoria, game, FAQ e seção de contato compartilhados.
- Inclusão do game explícita nas três páginas, sem nova compra, duração presumida ou modalidade independente disponível.
- Fotos existentes e símbolo original do game preservados; nenhuma assinatura, monograma ou logo da mentoria foi reconstruída.
- Links entre as três prévias, acesso existente por `/login`, termos, privacidade e atividade Herbalife separada.
- Sem formulário, coleta de leads, analytics, checkout novo ou mensagens automáticas.

## Configuração e publicação

As variáveis estão documentadas em `frontend/.env.example`, sem segredos:

- `ENABLE_CONSULTORIA_SITE`: com valor exato `true` no build, usa a nova home em `/`, a mentoria em `/public/ultima-cartada`, o game próprio em `/public/cartada-viva` e redireciona `/public/consultoria` para a mentoria. Padrão `false` mantém as páginas atuais. Não habilita `/preview` e não substitui autorização de publicação.
- `ENABLE_CONSULTORIA_PREVIEW`: desenvolvimento permite a prévia. Builds de produção só a disponibilizam com o valor exato `true`; por padrão as três páginas respondem 404. Use apenas em homologação apropriada, mediante decisão do responsável; mudar exige rebuild. Essa chave e `noindex` não são autenticação nem devem proteger dados confidenciais.
- `CONSULTORIA_WHATSAPP_NUMBER`: número oficial confirmado, somente dígitos com código de país. Sem número válido não há link externo de contato; a prévia informa que o canal aguarda confirmação. Com o valor configurado, o link abre a conversa com texto da mentoria ou do game, sem enviar mensagem automaticamente. Não copiar números da versão antiga sem confirmar.

Não habilitar a prévia na produção pública nem publicar a nova apresentação estrutural sem a aprovação prevista no briefing e autorização expressa de publicação. A autorização de redação legada não equivale a deploy; os metadados de prévia usam `noindex, nofollow`; não houve publicação nesta entrega.

## Dados provisórios autorizados

O responsável autorizou prosseguir com dados padrão provisórios e pediu nova pergunta no final. O painel “Dados provisórios para revisão final” apresenta os campos como “A confirmar”, centralizados em `consultoriaPendingDetails` no arquivo `content.ts`. Não há duração, telefone, perfil ou registro profissional fictícios; WhatsApp sem valor confirmado permanece sem link externo. Perguntar novamente em CONS-12.8 e substituir os placeholders antes da publicação. A ausência desses dados não interrompe o desenvolvimento visual.

## O que revisar

1. Hierarquia: Magaly como marca principal, mentoria principal e game incluído.
2. Leitura da primeira tela e navegação entre as três experiências.
3. Paleta, fontes, imagens, espaçamento, FAQ, botões e rodapé.
4. Layout em 320/375/390/768/1024/1440 px, zoom 200%, teclado, foco, menu, Esc e links de contato.
5. Fotografias, arquivos oficiais de marca e aplicações claras/escuras. A identificação textual de Magaly é provisória e não substitui a assinatura original.
6. Formato/duração da mentoria, duração e condições do game, identificação profissional completa, WhatsApp e Instagram.

A inclusão no sistema foi implementada em 13/11/2026: mentoria vigente acrescenta GAME aos produtos efetivos, sem criar concessão ou matrícula automática. Login/sessão e API diária foram testados; a homologação visual da jornada autenticada (CONS-09.6) continua pendente. O dashboard usa a sessão atualizada pelo servidor, e a home distingue acesso de vínculo com grupo/jornada. Não houve deploy ou regularização de dados no banco real.

## Verificação deste recorte

Lint, TypeScript e build executados; lint com oito avisos preexistentes de imagens em arquivos antigos. Verificadas respostas HTTP das três prévias em desenvolvimento (200), bloqueio no build de produção padrão (404), home atual (200) e redirecionamento legado do game (308). Inspeção do HTML confirmou H1 único, noindex/nofollow, âncoras existentes e alternativas de imagens. Contrastes de pares sólidos medidos e registrados em DESIGN.md.

A conferência visual/interativa não foi executada: o navegador integrado retornou “The browser access host is unavailable”. Não houve verificação em aparelhos físicos, teste de interação do menu, medição de desempenho real ou aceite de tela. Esses itens permanecem abertos no plano.

## Testar a integração de rotas sem publicar

Para conferir a nova apresentação nas URLs definitivas em ambiente local, sem gravar configuração real:

```bash
cd frontend
ENABLE_CONSULTORIA_SITE=true ENABLE_CONSULTORIA_PREVIEW=false npm run build
ENABLE_CONSULTORIA_SITE=true ENABLE_CONSULTORIA_PREVIEW=false npm run start -- --hostname 127.0.0.1 --port 3002
```

Em outro terminal, a partir da raiz:

```bash
python3 scripts/check_consultoria_routes.py --mode updated --base-url http://127.0.0.1:3002
```

Para testar o modo atual, use `ENABLE_CONSULTORIA_SITE=false` no build e no start e execute o script com `--mode legacy`. O script verifica apenas um servidor HTTP local e não altera banco ou arquivos. Não é teste visual de navegador. Encerrar o servidor antes de trocar o build.

No modo atualizado, o script confere canonical, Open Graph, inclusão do game, navegação entre as três páginas sem links para a prévia, âncoras, redirecionamento, páginas legais/login/Herbalife e manifesto. As prévias devem responder 404 nos dois builds padrão de produção.

As imagens das logos/favicon e compartilhamento ainda precisam de originais/aprovação. A ativação atualiza metadados textuais e cores do manifesto, preservando nome Cartada Viva, ícones existentes, `start_url=/dashboard`, escopo `/` e cache offline existente.

## Consultoria — nomes de acesso, separação Herbalife e guia de criativos — 13/11/2026

Recorte: alinhar a comunicação nas áreas de acesso, apresentar a atividade Herbalife separadamente e disponibilizar referências visuais reutilizáveis, sem dados comerciais/profissionais inventados e sem publicação.

Entregue:

- Login identifica Magaly Abreu e as duas experiências, sem aplicar o símbolo do game à marca principal. PlayerLayout apresenta marca contextual (Magaly/mentoria/game), mantém o símbolo original apenas nas áreas do game e usa nomes oficiais no menu. O menu passa ao formato recolhível até 1400 px para acomodar rótulos maiores. Portal da mentoria identifica A Última Cartada e oferece acesso ao game incluído, distinguindo acesso de vínculo com grupo/jornada. Autenticação, papéis e serviços HTTP não foram alterados.
- `HerbalifeInformation.tsx`: atividade comercial distinta, etapas informativas, FAQ, limites de divulgação e contato comercial separado. Não promete desconto/resultado, não adiciona formulário/checkout e não apresenta a compra como requisito das experiências. Prévia em `/preview/consultoria/herbalife`; integração em `/public/herbilife` somente no modo atualizado. Versão legada preservada por padrão.
- `CONSULTORIA_HERBALIFE_WHATSAPP_NUMBER` é independente do contato da mentoria, vazio por padrão. O cadastro usa a variável já existente, com validação de URL HTTPS sem credenciais; sua configuração pressupõe confirmação do destino. Não houve abertura de conversa ou envio de mensagens. Contato comercial incluído nos placeholders de revisão final.
- Tokens existentes da nova apresentação foram extraídos para `BrandTheme.module.css`, aplicado somente às páginas migradas, sem substituir tokens globais legados.
- `/preview/consultoria/guia-visual`: paleta, tipografia, componentes, hierarquia, provas do símbolo original em fundos claros/escuros e composições demonstrativas de Story/capa. Sem recriar MA, assinatura ou símbolo da mentoria.
- Fundos `story-background.svg` (1080×1920) e `share-background.svg` (1200×630), em `frontend/public/consultoria/templates/`, sem texto, fontes ou logos incorporados. São rascunhos, não imagens Open Graph finais aprovadas. `docs/CONSULTORIA_CRIATIVOS.md` documenta uso, fontes, arquivos e restrições para Claude; não houve envio externo.
- Smoke script de rotas ampliado para cinco prévias, dois fundos, login e separação comercial. Plano, DESIGN.md, contexto, README e roteiro de revisão atualizados. CONS-05.5, CONS-10.2 e CONS-11.5 marcados como entregas técnicas; aprovação visual de peças permanece em CONS-11.4.

Validações executadas:

- `npm run lint`: zero erros, mesmos oito avisos legados de imagens.
- Build com `ENABLE_CONSULTORIA_SITE=false ENABLE_CONSULTORIA_PREVIEW=false` e `npx tsc --noEmit`: passaram. Build do modo atualizado também passou.
- `scripts/check_consultoria_routes.py --mode legacy`: 14 respostas e contratos aprovados, com cinco prévias 404 em produção e rotas atuais preservadas.
- O script com `--mode preview` no servidor de desenvolvimento: cinco páginas 200, H1 único, noindex e âncoras existentes; dois fundos SVG 200 (sete respostas).
- O script com `--mode updated`: 14 respostas e contratos aprovados, incluindo canonical, navegação sem vazamento para prévia, separação Herbalife, identificação de login e demais contratos anteriores. Total deste recorte: 35 respostas conferidas.
- Script Node 24, sem conexões externas, validou contato comercial independente, ausência de herança da mentoria, rejeição de números inválidos, mensagens distintas e rejeição de inscrição HTTP, javascript, inválida ou com credenciais. URL HTTPS válida aceita. A execução direta de TypeScript gerou apenas aviso de detecção de módulo; package.json não foi alterado por esse motivo.
- Parser XML conferiu dimensões dos dois SVGs e ausência de text, script, image e foreignObject. Script documental: 44 links locais válidos. `git diff --check`: passou.
- Novo build final com ambas as chaves false e TypeScript passaram, deixando a apresentação atual como padrão local. Todos os servidores iniciados para estes testes foram encerrados. `next-env.d.ts` gerado foi preservado no formato anterior do repositório.

Limitações: tentativa de abrir o guia no navegador integrado retornou “The browser access host is unavailable”. Sem homologação visual, interação do menu autenticado, aparelhos reais ou recortes em WhatsApp/redes nesta entrega. SVGs e guia continuam rascunhos. Originais de marca, dados finais e aprovação continuam pendentes, sem nova solicitação ao responsável antes da revisão final.

Não houve alteração no backend, dados ou autorização neste recorte; a suíte Django de 111 testes não foi repetida. Não houve commit, push, deploy, analytics, coleta de leads, checkout novo ou envio de criativos a terceiros.

## Consultoria — tema das áreas de acesso e condições provisórias — 13/11/2026

Recorte: aplicar os tokens/fontes compartilhados ao acesso e preparar campos comerciais pendentes sem inventar fatos. Nada foi publicado.

Implementação:

- `ConsultoriaAccessTheme.tsx` e CSS Module, usados por novos layouts de `/login`, `/dashboard`, `/mentorship` e `/player/*`. A chave `ENABLE_CONSULTORIA_SITE` habilita o wrapper; desligada, ele devolve os filhos sem tema adicional. Admin, autenticação, produtos e serviços HTTP não foram modificados.
- Overrides visuais limitados por marcadores de interface: login marfim/vinho e campos, cabeçalho/menu das participantes, cards de dashboard, estrutura, progresso e conteúdos da mentoria. Status concluído/erro preservam identificação e cores semânticas. Símbolo do game não foi recolorido.
- Dashboard prioriza o card da mentoria, mantendo filtros por produtos validados. Progresso da mentoria recebeu role/valor/label acessíveis na barra existente. Não foi alterada a fórmula de progresso ou pontuação.
- Guia visual mostra provas do tema de acesso com campos/botão desabilitados e links para propostas. Não faz autenticação ou expõe perfis/registros. O wrapper de exemplo tem altura ajustada para não criar espaço artificial de uma tela inteira.
- `consultoriaOfferDetails` centraliza formato, duração da mentoria/game, encontros e materiais/suporte como “A confirmar”. Quadros de condições nas páginas da mentoria/game e FAQ de duração usam essa fonte, assim como o painel de revisão. Sem prazo, preço ou conteúdo inventado.
- Plano separa a entrega técnica do tema (CONS-04.6a) da migração/homologação restante (CONS-04.6b). Contexto, DESIGN.md e guias de prévia/criativos foram atualizados. A referência arquitetural a ledgers do plano anterior foi corrigida para não reabrir tarefas encerradas.

Validações executadas:

- `npm run lint`: zero erros, oito avisos preexistentes de imagens; repetido após os quadros de condições, com o mesmo resultado.
- `npm run build && npx tsc --noEmit`, com a chave desligada e ligada: passaram. Build do modo atualizado repetido após os quadros e a centralização dos dados provisórios, também passou.
- Script HTTP modo `legacy`: 17 respostas aprovadas, incluindo ausência do escopo de tema no login, dashboard, mentoria e home do game; cinco prévias 404 e demais contratos preservados.
- Script modo `preview`: sete respostas aprovadas, com cinco páginas e dois fundos. Guia ampliado continua com H1 único, noindex e âncoras existentes.
- Script modo `updated`: 17 respostas aprovadas, incluindo presença do tema nas quatro rotas de acesso. Após os quadros de condições, o mesmo modo foi reexecutado e confirmou seção de condições, placeholders e ausência de “6 meses”, “21 dias” ou “3 jogos” como duração comercial não confirmada nas páginas de mentoria/game.
- Script de contraste: vinho/marfim 9,12:1; ameixa/marfim 10,83:1; ameixa/nude 8,24:1; borda #947480/marfim 3,82:1; erro #A33227/#FFF0ED 6,22:1. São medições de pares sólidos, não aprovação de todos os estados da UI.
- `git diff --check`: passou. O build final é restaurado com as duas chaves false antes do encerramento; servidores locais usados nas verificações foram parados.

O teste das rotas protegidas observa o HTML inicial do frontend, não é login real nem validação de dados autenticados. A tentativa de inspeção visual do guia retornou novamente “The browser access host is unavailable”. Assim, não houve homologação de desktop/celular, navegação autenticada, modais, zoom, imagens ou aparelhos. A migração completa de telas/tabelas/gráficos/cartas permanece aberta.

Backend e dados não foram alterados; testes Django não foram repetidos neste recorte. Sem commit, push, deploy, coleta nova ou envio de mensagens. Dados finais continuam para a revisão final solicitada pelo responsável.

## Consultoria — navegação, diálogos e revisão editorial estática — 13/11/2026

Recorte: corrigir lacunas de acessibilidade dos componentes compartilhados, unificar o visualizador da mentoria e conferir a comunicação da nova apresentação, sem alterar regras de negócio ou publicar.

Implementação técnica:

- Modal compartilhado usa `<dialog>` com `showModal()`, título associado por useId, cancelamento passando pelo callback existente e cleanup ao desmontar. Opções adicionais: closeDisabled, closeOnBackdrop (false por padrão) e className; contratos anteriores de title/isOpen/onClose/children preservados. Fechamento pelo fundo só é ativado na mentoria/demonstração. A restauração de foco conta também com fallback quando o elemento é desmontado e o foco cai no body.
- CSS do Modal usa cabeçalho separado e corpo rolável, limite de altura dinâmica e acionador de fechamento de 44 px. Native dialog foi escolhido a partir do HTML Standard, sem nova dependência: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element. A escolha da API não equivale à homologação interativa.
- `src/lib/scrollLock.ts` coordena bloqueios simultâneos. Modal, menu administrativo e vídeos de depoimento usam o mesmo coordenador para não liberar rolagem de outra superfície. Cleanup é idempotente e restaura o valor anterior. O menu administrativo ignora teclas originadas em dialog aberto.
- Menus público e de participantes fecham ao sair com Tab/focusin ou clicar fora; Escape só age no menu/acionador em foco. Navegação por links fecha o menu e evita foco preso em link oculto. Papéis, URLs e filtros de produtos foram preservados.
- Mentoria reutiliza o Modal compartilhado. Conclusão/download têm guarda síncrona para evitar repetição, feedback de erro dentro do diálogo, estado ocupado e bloqueio de fechamento durante a operação. Serviços/endpoints e cálculo de progresso não mudaram.
- Guia visual inclui demonstração interativa em #dialogos: campo local sem envio, fechamento bloqueável e segundo diálogo para conferir sobreposição. Não há conta fictícia ou API na demonstração. Roteiro manual documentado.
- Revisão estática dos textos novos: inclusão explícita do game, prazos/fatos provisórios e ausência de promessas antigas. FAQ passou a distinguir o game educativo de atendimento profissional, sem inventar modalidade clínica da mentoria. CTAs de condições levam ao quadro de condições, não apenas ao contato. Matriz editorial registrada no diagnóstico; conteúdo legado preservado sob a chave desligada.

Arquivos centrais: `frontend/src/components/ui/Modal.tsx`/CSS, `src/lib/scrollLock.ts`, menus/layouts, VideoTestimonials, página/CSS da mentoria, componentes da consultoria e `frontend/scripts/ui-utils.test.mjs`. O package.json recebeu somente o comando test:ui-utils, sem dependências novas ou instalação.

Validação executada:

- `npm run test:ui-utils`: cinco testes aprovados do coordenador de rolagem, cobrindo configuração anterior, locks sobrepostos, cleanup duplicado, alvos independentes e reabertura. São testes de lógica com objeto de estilo, não testes de navegador/dialog/foco.
- `npm run lint`: zero erros, oito avisos legados de imagens. ESLint direcionado aos componentes finais de Modal/menus/mentoria/copy e helper também passou sem avisos.
- `npm run build && npx tsc --noEmit`: passaram no modo padrão e no atualizado. Builds repetidos após revisão final dos CTAs/FAQ e do guard do menu administrativo também passaram.
- Smoke HTTP modo legacy: 17 respostas e contratos aprovados. Modo preview: cinco páginas e dois fundos (sete respostas), H1/noindex/âncoras válidos. Modo updated: 17 respostas e contratos aprovados após os ajustes finais de copy.
- Busca estática de expressões antigas e durações não confirmadas nos componentes novos: sem ocorrências. Leitura estática de páginas/seções/FAQ registrada na matriz editorial.
- `git diff --check`: passou. Ao encerrar, o build padrão é restaurado com as chaves false e os servidores locais são parados.

O navegador integrado voltou a retornar “The browser access host is unavailable”. Portanto, foco, Escape, Tab, toque, modais em aparelhos, iPhone/Safari, viewport e autenticação real continuam pendentes. A demonstração e a implementação não foram declaradas homologadas. CONS-04.4 foi separado em entrega técnica (a) e homologação (b); itens editoriais CONS-02.5, CONS-02.6 e CONS-02.8 registram revisão da versão nova, sem aceite externo ou publicação.

Backend, pontuação, dados, concessões e sessões não foram modificados; a suíte Django não foi repetida neste recorte. Sem commit, push, deploy, mensagens externas ou coleta nova. Dados finais continuam para a revisão final solicitada pelo responsável.

Encerramento deste recorte: build final com ambas as chaves false e TypeScript aprovados; servidores locais encerrados; 46 links locais conferidos e git diff --check sem problemas.

## Consultoria — PWA e recuperação sem conexão — 13/11/2026

Recorte: concluir a parte técnica de CONS-11.3, mantendo instalação e uso real em aparelhos como homologação pendente.

- `frontend/public/offline-consultoria.html` apresenta Magaly Abreu, mentoria e game incluído com a paleta aprovada, ações de recuperação e explicação sobre conexão. Não contém formulários, dados pessoais ou recursos externos; Georgia/Arial são fallback deliberado às fontes da marca.
- `frontend/public/sw.js` seleciona somente um HTML genérico pela apresentação. Não grava respostas de navegação, API ou mídia; ignora POST, recursos e outras origens. Falha de rede abre o fallback; respostas HTTP 403/500 permanecem respostas do servidor. Instalação só chama skipWaiting após armazenar o HTML. Ativação limpa exclusivamente caches antigos do namespace offline.
- `PwaInstall.tsx` recebe a apresentação do layout, registra o worker com updateViaCache=none e mantém escopo `/`. A versão nova recebe botão vinho/marfim. `next.config.ts` define tipo JavaScript e no-cache/no-store para o worker. start_url=/dashboard e ícones existentes preservados.
- Guia visual oferece prova estática da tela offline. `scripts/check_consultoria_routes.py` passa a conferir também HTML offline e cabeçalhos do worker. Nenhuma dependência adicionada.

Validação executada:

- `npm run lint`: zero erros, oito avisos legados de imagens.
- `npm run test:pwa`: nove testes aprovados executando o worker real em Node/VM com doubles de rede/cache; não são testes de navegador.
- `npm run test:ui-utils`: cinco testes aprovados.
- `npm run build && npx tsc --noEmit`: aprovados com a apresentação desligada e ligada.
- Smoke HTTP local: modo legacy 19 respostas, preview sete, updated 19; contratos aprovados, incluindo cabeçalhos no-store e página offline correspondente.
- O navegador integrado retornou “The browser access host is unavailable”. Não foi possível verificar instalação, foco, layout móvel, falta de rede real, troca de apresentação instalada ou Safari/iOS. CONS-11.3b permanece aberto.

Backend, dados, permissões e pontuação não foram alterados neste recorte; testes Django não foram repetidos. Sem commit, push ou deploy. Roteiro manual atualizado em docs/PWA_TESTING.md. As mudanças do worker são baseadas também no guia PWA local da versão instalada do Next.js (`frontend/node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md`).

Encerramento: build padrão restaurado com ambas as chaves false e TypeScript aprovado; portas 3001/3002 sem listeners; git diff --check aprovado.

## Consultoria — suporte da participante — 13/11/2026

Recorte verificável: migrar tecnicamente `/player/support` para a identidade atualizada quando ENABLE_CONSULTORIA_SITE estiver ativa e reutilizar o Modal compartilhado para abertura de chamado. Alterações em `frontend/src/app/player/support/page.tsx` e `PlayerSupportPage.module.css`.

Fluxo rastreado: página → supportService → /support/tickets/ e ações reply/download → views/serializers existentes. O POST de criação já retorna SupportTicket completo (201); a tela passa a usar esse retorno diretamente, evitando que uma falha de GET posterior seja relatada como falha de criação. Não houve alteração de service, payload, endpoint ou autorização Django.

Entrega técnica:

- Paleta vinho/marfim/nude, títulos editoriais e texto Montserrat no escopo da apresentação nova. Cores de status preservadas e acompanhadas de rótulos. Metadados de conversa ampliados para 14 px; campos de 16 px no tema; controles de envio com 48 px. CSS prevê quebra de conteúdo longo e cabeçalho empilhado em telas estreitas. Isso não comprova revisão visual em dispositivo.
- Formulário de abertura usa Modal nativo compartilhado, bloqueio de fechamento durante envio, fieldset desabilitado e erro dentro da superfície ativa. Campos são preservados em erro; os limites de assunto/mensagem espelham os serializers (180/5.000 caracteres).
- Guarda síncrona compartilhada impede chamadas repetidas de criação/resposta no mesmo processamento. Histórico não troca de chamado durante envio. Resposta salva e falha de recarga têm mensagens distintas; o texto/anexo são limpos após gravação bem-sucedida. Troca de chamado e criação também limpam o rascunho anterior. Input de arquivo é remontado para refletir a limpeza.
- Feedback usa role=status/alert; seleção usa aria-pressed; falha de download é tratada. A interface existente de criação/resposta permanece também na apresentação legada, agora usando o Modal compartilhado. Nenhuma nova coleta de interessados foi criada.

Validação: npm run lint passou com zero erros e os oito avisos legados de imagens. Builds com a apresentação ativada e desativada, npx tsc --noEmit e ESLint direcionado foram executados; resultados finais registrados abaixo. Inspeção dos contratos de serializer/create foi estática. Não foram executados envios de chamados, downloads autenticados, testes de foco/teclado ou navegação em aparelho neste recorte. O roteiro foi incluído em docs/CONSULTORIA_PREVIEW.md; CONS-04.6b permanece aberto. Backend inalterado, sem testes Django repetidos, instalação de dependências, commit, push ou deploy.

Resultado final deste recorte: os dois builds passaram, TypeScript e ESLint direcionado passaram sem erros. Build padrão restaurado com as duas chaves false. git diff --check aprovado; caminhos dos arquivos/documentação afetados conferidos. Nenhum servidor foi iniciado neste recorte.

## Consultoria — Configurações da participante — 13/11/2026

Recorte: tema da tela `/player/settings` e formulário compartilhado de alteração de senha, sem modificar a API, políticas de senha ou sessão. Arquivos: `frontend/src/app/player/settings/PlayerSettingsPage.module.css`, `frontend/src/components/settings/ChangePasswordForm.tsx` e CSS correspondente.

A nova apresentação aplica vinho/marfim, fontes do tema, campos de 16 px e controles de 48 px apenas sob data-consultoria-access-theme. O admin conserva sua paleta. Labels têm identificadores únicos por instância via useId, autocomplete de senha atual/nova e campos required. Envio bloqueia campos e usa guarda síncrona para evitar repetição. Feedback recebe role=status/alert. Validações existentes, serviços changePassword/getCurrentUser, saveAuthUser e redirecionamento foram preservados. O tour não foi alterado.

Roteiro manual acrescentado à documentação da prévia. Não houve alteração de senha real, teste autenticado ou conferência em dispositivo neste recorte; não declarar homologação do fluxo. Backend inalterado, sem repetição da suíte Django. Sem dependências novas, servidores, commit, push ou deploy. CONS-04.6b permanece aberto.

Validação executada neste recorte: npm run lint aprovado, zero erros/oito avisos legados de imagens; npm run build aprovado com ENABLE_CONSULTORIA_SITE=true e false, prévia desativada nos dois; npx tsc --noEmit aprovado; git diff --check aprovado. Build final restaurado no modo padrão. Diff revisado e caminhos dos três arquivos alterados conferidos.

## Consultoria — desempenho e ranking — 13/11/2026

Recorte de CONS-04.6b: migrar a apresentação de `/player/performance` e `/player/ranking` sem alterar pontuação/classificação. Arquivos: páginas e CSS Modules dos dois diretórios. Reutilizados o layout, tema e fontes existentes, condicionados a ENABLE_CONSULTORIA_SITE. Serviços getPlays/getEvidences/getGames/getGameRanking preservados; nenhuma mudança nos endpoints, filtros, permissões, cálculo de totais ou ordem do ranking.

Cards, títulos e campos acompanham vinho/marfim/nude. Pódio usa ameixa/marfim, com dourado decorativo; medalhas existentes preservadas e animações desativadas na apresentação nova. Estados de evidência continuam com rótulos e cores semânticas. CSS prevê quebra de nomes e pódio em duas colunas em tela muito estreita. A tabela de histórico tem região nomeada/focável e cabeçalhos scope=col, mantendo rolagem local e todas as colunas. Feedback de carregamento/vazio usa role=status e erro usa role=alert. Resumos de pontos/participantes exibem “—” em erro do ranking, em vez de zero.

Revisão estática dos serviços e diff realizada. Roteiro de homologação incluído na documentação da prévia. Não houve autenticação real, consulta a dados privados, conferência de layout em navegador/aparelho ou testes de autorização neste recorte. CONS-04.6b permanece aberto; os ajustes técnicos não equivalem a homologação visual. Backend inalterado, sem testes Django repetidos, dependências novas, commit, push ou deploy.

Validação executada: npm run lint passou (zero erros, oito avisos legados de imagens); npm run build passou com a apresentação ativada e desativada; npx tsc --noEmit passou; git diff --check passou. Build final no modo padrão, ambas as chaves false. Nenhum servidor iniciado neste recorte.

## Consultoria — Comunidade — 13/11/2026

Recorte de CONS-04.6b: apresentação da comunidade em `frontend/src/app/player/community/page.tsx` e `PlayerCommunityPage.module.css`. O tema aplica vinho/ameixa/marfim/nude somente sob data-consultoria-access-theme; estrutura legada preservada quando a chave está desligada. Ajustados títulos, superfícies, campos de 16 px, metadados de 14 px, botões principais/reação de 48 px, exclusão com alvo de 44 px e comentários em duas colunas em telas estreitas. Avatar de iniciais continua identificado como representação textual, sem cliente fictício. Fotografias/vídeos não foram recoloridos ou substituídos.

Feedback de publicação usa role=status; erros role=alert; carregamento/vazio role=status; botão de comentários relaciona a região via aria-controls. Serviços de publicação, evidências aprovadas, comentários, reações, ranking, exclusão e seus contratos permanecem intactos. Inspeção estática de communityService e do fluxo existente realizada, sem mudança de autorização, filtros por grupo ou consentimento de compartilhamento.

Não foram executadas publicações, comentários, exclusões ou consultas autenticadas; nenhuma regra de negócio nova foi implementada. Roteiro manual adicionado à documentação da prévia. Homologação visual, teclado e aparelhos permanece em CONS-04.6b, sem afirmar aprovação do fluxo real. Backend inalterado, suíte Django não repetida, sem dependências novas, servidor, commit, push ou deploy.

Validação executada: npm run lint aprovado (zero erros, oito avisos legados de imagens); npm run build aprovado com a apresentação ativada/desativada e prévia desativada; npx tsc --noEmit aprovado; git diff --check aprovado. Build final no modo padrão. Diff e caminhos locais revisados.

## Consultoria — home por rodadas e jornada diária — 13/11/2026

Recorte de CONS-04.6b: tema de `frontend/src/app/player/home/PlayerHomePage.module.css` e `frontend/src/components/journeys/PlayerDailyJourney.module.css`, com ajustes de apresentação/estado na página home. A apresentação nova aplica ameixa/marfim no hero, vinho/nude nos controles e seleção, títulos editoriais e Montserrat nos formulários. Campos e ações principais têm altura mínima de 48 px. Cards de rodada, jogada, seleção e histórico mantêm estrutura e dados. Não foram recoloridas mídias ou logos. Cores semânticas e rótulos de prazo/status preservados.

Modais de carta/evidência usam closeDisabled durante envio, seleção de carta informa aria-pressed e impede edição durante confirmação; descrição/arquivo são bloqueados durante envio de evidência. Mensagens recebem role=status/alert. Os handlers, serviços e regras de prazo, evidência, pontuação e acesso não foram alterados. Jornada diária recebeu somente CSS: estágios, progresso, formulários, histórico e feedback. Desafios e tour não fazem parte deste recorte.

Roteiro autenticado incluído na documentação da prévia. Nenhuma jogada, evidência ou atualização de dados foi enviada neste recorte. Não houve teste em navegador/aparelho, autenticação real ou homologação visual. CONS-04.6b permanece aberto. Backend inalterado; testes Django não repetidos; sem dependências novas, servidor, commit, push ou deploy.

Validação executada: npm run lint aprovado (zero erros, oito avisos legados de imagens); builds aprovados com apresentação ativada/desativada; npx tsc --noEmit aprovado; git diff --check aprovado. Build final no modo padrão com prévia desativada. Diff e caminhos locais revisados.

## Consultoria — desafios e tour — 13/11/2026

Recorte de CONS-04.6b: PlayerFlashChallenges e PlayerOnboardingTour (TSX/CSS Modules). Ambos reutilizam o Modal compartilhado para foco, título e bloqueio de rolagem. Tema condicionado à chave da consultoria, com vinho/ameixa/marfim, texto legível e ações de 48 px. CSS legado preservado fora do escopo; formulários internos se adaptam ao corpo rolável do Modal.

Desafios: guarda síncrona de envio, fechamento/edição bloqueados durante processamento e erro dentro do diálogo. Resposta de submitFlashChallenge atualiza player_submission localmente; falha na recarga posterior não é relatada como falha de envio. Erro inicial não fica oculto quando não há desafios. Endpoints, payload, grupo escolhido pelo fluxo existente, tipo de evidência, pontos e autorização não mudaram. Rastreado challengeService e ViewSet de submissão existente.

Tour: Modal usa título do passo, contador anunciado e erro com role=alert. Conclusão tem guarda síncrona; serviço completeOnboarding e saveAuthUser preservados. Fechar temporariamente não chama conclusão. Rolagem automática respeita preferência de movimento reduzido. Conteúdo de regras existente foi preservado, sem criar regras novas.

Roteiro de homologação adicionado à prévia. Não foram enviadas participações, alterações de onboarding ou requisições autenticadas neste recorte; foco/teclado/aparelhos não foram homologados. CONS-04.6b permanece aberto. Backend inalterado, sem testes Django repetidos, dependências, servidor, commit, push ou deploy.

Validação executada: npm run lint passou (zero erros, oito avisos legados); builds passaram com apresentação ativada/desativada; npx tsc --noEmit e ESLint direcionado aos dois componentes passaram. git diff --check aprovado. Build final padrão, prévia desativada. Diff e caminhos locais revisados.

## Consultoria — mapa de navegação e smoke ampliado — 13/11/2026

Recorte CONS-02.3: novo `docs/CONSULTORIA_NAVEGACAO.md` documenta rotas com chave ligada/desligada, redirecionamentos, fragmentos, botões, entrada autenticada e limites sobre URLs de campanhas externas. Inspecionados mapas de content.ts, ConsultoriaShell/Pages, login, dashboard, PlayerLayout e ProtectedRoute. Não houve mudança de rotas, frontend de produto ou regras de acesso.

`scripts/check_consultoria_routes.py` passou a verificar as oito entradas autenticadas (HTML inicial/escopo de tema) e resolver links internos/fragmentos entre os documentos consultados, usando urljoin/unquote. Não requisita destinos externos, APIs ou dados autenticados. Prévia inclui também login, termos, privacidade e prova offline. Conta ocorrências de links, incluindo repetições. Confere os redirecionamentos diretamente, sem seguir ciclos.

Validação executada:

- `python3 -m py_compile scripts/check_consultoria_routes.py`: passou.
- Smoke legacy: 24 respostas/contratos aprovados no build padrão.
- Smoke preview: 11 respostas/contratos e 109 links internos/fragmentos aprovados no servidor de desenvolvimento.
- Smoke updated: 24 respostas/contratos e 82 links internos/fragmentos aprovados no build atualizado. Uma execução intermediária apontou destino `/player/support` não incluído no mapa do próprio verificador; a lista de documentos foi corrigida e a verificação completa passou, sem mudança na página.
- Build atualizado passou; restauração de build padrão/TypeScript registrada no encerramento.

Tentativa de inspeção visual retornou “The browser access host is unavailable”. Não foram executados login, interação de navegador, mobile, destino de contatos externos ou testes Django. Não há aprovação visual/produção. CONS-12.3/12.4 e aceite editorial permanecem abertos. CONS-02.3 registra o mapa técnico encontrado, sem afirmar conhecimento das campanhas externas. Sem dependências novas, commit, push ou deploy.

Encerramento: build padrão restaurado com ambas as chaves false e TypeScript aprovado; servidores de desenvolvimento/produção locais encerrados. git diff --check passou; caminhos e links locais da documentação afetada conferidos.

## Consultoria — tokens e contraste reproduzível — 13/11/2026

Recorte técnico de CONS-04.2/03.5: verificar pares sólidos e centralizar borda de controle, sem alterar paleta oficial, logos ou tokens globais legados.

`BrandTheme.module.css` recebeu aliases de fundo/superfície, ação hover, detalhe, foco/halo e `--color-control-border: #856571`. O tom anterior #947480 tinha 3,82:1 sobre marfim e 2,91:1 sobre nude. O novo tem 4,73:1 e 3,60:1. Nove CSS Modules de login/diálogos, senha, jornada, desafios e páginas player migradas passam a consumir o token com fallback anterior. Borda decorativa #C9ACAE preservada; não é usada como novo token de identificação dos campos. Nenhuma troca global de globals.css ou landing-*; brand-gold é local ao tema. Admin/legal permanecem fora desse escopo.

Novo `frontend/scripts/check-contrast.mjs`, acessível por `npm run check:contrast`, lê tokens reais e resolve aliases; compara 16 pares por luminância relativa sRGB sem arredondar a decisão. Inclui referências preto/branco=21 e mesma cor=1. Informa restrições rosé/marfim 2,46:1 e dourado/marfim 2,67:1. Guia visual e DESIGN.md atualizados. Fontes primárias consultadas: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance e https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html. O teste de pares não interpreta DOM, cascata, opacidade, imagens, tamanho de texto ou posicionamento de foco; não declara conformidade integral WCAG.

Validações executadas:

- `npm run check:contrast`: 16 pares aprovados.
- Prova negativa em diretório temporário: cópia do script/CSS com borda de controle fraca retornou status 1 e falhas nos dois fundos. Arquivos do projeto não foram alterados por essa prova.
- `npm run lint`: zero erros, oito avisos legados de imagens.
- Builds com ENABLE_CONSULTORIA_SITE true e false aprovados; `npx tsc --noEmit` aprovado. Build final padrão com prévia false.
- `git diff --check` aprovado; diff e caminhos locais revisados.

Sem execução de navegador, testes autenticados, backend alterado ou suíte Django repetida. CONS-04.2/03.5 continuam abertos para impacto visual/aprovação; resultados sólidos não homologam layout, foco ou dispositivos. Sem dependências novas, servidor, commit, push ou deploy.

## Consultoria — apresentação de Termos e Privacidade — 13/11/2026

Recorte de CONS-04.2: `/terms` e `/privacy` usam ConsultoriaAccessTheme e identificam Magaly Abreu somente quando a apresentação nova está ativa. A chave desligada preserva o visual/nome anteriores. Arquivos: páginas de rota, `components/legal/LegalDocumentPage.tsx`/CSS, smoke e documentação afetada.

O componente recebeu brandName opcional (default anterior), feedback de carregamento anunciado e cancelamento lógico de callbacks após desmontagem. CSS isolado aplica paleta/fontes, links sublinhados com área de toque, quebras para título longo e ajuste em tela estreita. O corpo, versão/data e ausência de documento continuam sendo renderizados pelo mesmo serviço/tipo. Inspecionados getCurrentLegalDocuments e tipos legais; nenhum texto jurídico, aceite, versão, publicação, endpoint ou coleta foi alterado. Isso não conclui CONS-10.5 nem substitui revisão jurídica/editorial.

Validação executada: npm run lint passou com zero erros e oito avisos legados; build atualizado e TypeScript passaram. Smoke updated aprovou 24 respostas/contratos e 82 links internos/fragmentos, agora incluindo marca/tema nas duas páginas legais. Build padrão e smoke de regressão registrados no encerramento.

Não foi executada consulta da API pelo navegador, aceite legal, edição de documento, autenticação ou homologação em aparelhos. Backend inalterado, suíte Django não repetida, sem dependências novas, commit, push ou deploy. CONS-04.2 e homologação visual permanecem abertos.

Encerramento: build padrão/TypeScript aprovados e smoke legacy com 24 respostas/contratos aprovados. Servidores locais encerrados, build final com ambas as chaves false; git diff --check aprovado e caminhos/documentação conferidos.

## Consultoria — estados de documentos pendentes — 13/11/2026

Recorte de CONS-04.2: `LegalAcceptanceGate.tsx`/CSS e indicação de carregamento em ProtectedRoute. O gate anterior ao layout recebe tema vinho/marfim/nude apenas dentro do wrapper ativado; admin conserva sua paleta. Cabeçalhos, rótulos, links de leitura, checkbox e botão receberam dimensões/cores coerentes, com quebra de títulos e grade em tela estreita. Não há novo documento, texto jurídico, coleta, regra de aceite ou autorização.

Consulta inicial possui cancelamento lógico de callbacks e repetição explícita após erro; nunca libera children antes de obter pendências. Checkbox segue desmarcado e é bloqueado durante gravação; guarda síncrona evita repetição de cliques. Endpoints pending/accept, ordem e IDs enviados permanecem existentes; backend usa a identificação do usuário e get_or_create. Links de leitura em nova aba receberam rel=noopener noreferrer. Carregamento do gate/ProtectedRoute tem role=status.

Validação: npm run lint aprovado (zero erros, oito avisos legados), builds com apresentação ativa/inativa aprovados, npx tsc --noEmit aprovado e git diff --check aprovado. Build final padrão com prévia desativada. Diff e contratos de legalService/views inspecionados.

Não foram realizados aceites, mudanças de documento, login ou validação em navegador/aparelho. Roteiro documentado na prévia; homologação real permanece aberta. Backend inalterado, testes Django não repetidos. Sem dependências novas, servidor, commit, push ou deploy.

## Consultoria — imagens responsivas e inventário de carregamento — 13/11/2026

Recorte de CONS-12.5: ConsultoriaSections.tsx e ConsultoriaPages.tsx receberam sizes limitado ao container e breakpoint coerente com o layout. Sem regravar originais, alterar recorte CSS, logos, fontes, qualidade do otimizador ou prioridade. Legenda da ilustração atualizada para distinguir homologação visual da implementação encontrada. Consultada a referência local da versão instalada: node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md.

Metadados de três originais lidos com sharp já instalado; fontes medidas por stat. Quatro respostas WebP locais em /_next/image foram medidas; HTML inicial confirmou sizes e carregamento lazy abaixo da dobra. Resultados exatos e limites em docs/CONSULTORIA_PERFORMANCE.md. Não são ganhos de rede móvel medidos nem melhoria nova atribuída ao otimizador existente.

Validação: npm run lint aprovado com zero erros/oito avisos legados; build atualizado/TypeScript aprovados; smoke updated com 24 respostas/contratos e 82 links/fragmentos aprovado. Build padrão/TypeScript registrados no encerramento. Nenhuma medição LCP/CLS/INP, nitidez, DPR ou navegador foi executada. CONS-12.5 continua aberto. Sem backend alterado, testes Django repetidos, dependências, commit, push ou deploy.

Encerramento: build padrão e TypeScript aprovados; servidor de medição encerrado; build final com ambas as chaves false. git diff --check aprovado; caminhos/links locais da documentação afetada conferidos.

## Consultoria — configuração de fatos e identificação — 13/11/2026

Recorte preparatório de CONS-12.8/01: `content.ts` lê texto de oferta aprovado por variáveis CONSULTORIA_* com fallback “A confirmar”; condições, FAQ e painel compartilham os mesmos valores. Funções de Instagram/identificação fornecem usuário em domínio fixo e texto literal ao rodapé de ConsultoriaShell, omitidos quando vazios. Painel diferencia contato configurado de dado confirmado. Nenhum dado profissional, duração ou contato real foi inventado/preenchido. Não confirma nem conclui os itens externos de conteúdo.

Arquivos: content.ts, ConsultoriaShell.tsx/CSS, frontend/.env.example/package.json e novo frontend/scripts/consultoria-content.test.mjs. Não há dependência nova. Variáveis são lidas no build, mas conteúdo renderizado é público; não armazenar segredos nesses campos. Escapamento é o padrão JSX, sem dangerouslySetInnerHTML. Instagram recusa URL/caminhos e entradas malformadas; configuração sintática não comprova conta oficial. Contato Herbalife continua independente.

Oito testes executam o módulo TypeScript real transpilado em VM com ambiente isolado: valores ausentes, propagação de fatos/FAQ/painel, WhatsApp inválido, mensagem por assunto, separação comercial, Instagram válido/inválido e cadastro HTTPS sem credenciais. Sem chamadas de rede, mudanças em .env real ou publicação dos valores de teste.

Validações e encerramento registrados abaixo. Homologação visual, validade profissional, titularidade dos contatos e aprovação dos fatos continuam pendentes; perguntas permanecem para a revisão final solicitada pelo responsável. Backend inalterado, sem testes Django repetidos, servidor, commit, push ou deploy.

Encerramento: oito testes aprovados; npm run lint aprovado com zero erros/oito avisos legados; builds finais com apresentação ativada/desativada e TypeScript aprovados. Build padrão restaurado com ambas as chaves false; git diff --check aprovado. Diff/caminhos da documentação revisados. Nenhum servidor iniciado.

## Consultoria — aderência das páginas e ilustração sem prazos — 13/11/2026

Revisão estática das páginas, Sections/content/Shell, briefing e itens 6–8 do plano. Encontrada divergência que a inspeção de HTML não capturava: SVG legado mostrava Jogo 1/2/3 de 21 dias. Criada versão separada `frontend/public/consultoria/player-journey.svg`, sem prazos/quantidade de jornadas, sem dados pessoais e com aviso de condições a confirmar; a página nova passou a usá-la. Arquivo legado preservado sem diff. A versão nova é ilustração vetorial de interface, sem logo redesenhada, foto ou imagem externa; usa fallback tipográfico local quando a fonte não está disponível no SVG isolado. Não foi declarada screenshot final ou composição aprovada.

Texto do game agora distingue jornada diária e jogo por rodadas, esclarecendo que o percurso depende da jornada do grupo e que as condições precisam ser confirmadas. Revalidado por leitura de home/PlayerDailyJourney e querysets de JourneyEnrollment/DailyParticipation: registros individuais filtrados por participante, staff conforme regra vigente e resumo agregado separado. Não houve alteração de autorização nem nova execução de testes Django.

Entregas técnicas encontradas e agora registradas como concluídas, com aceite visual/editorial permanecendo nas fases 3/12:

- CONS-06.3: hero/editorial definem mulheres, contexto, acolhimento e retomada sem garantias.
- CONS-06.4: ofertas assimétricas, links próprios e metodologia como abordagem em ConsultoriaHome/CSS.
- CONS-07.3: Pillars/processo e Inclusion visível em game-incluido, com inclusão sem nova compra.
- CONS-08.2: práticas/histórico/pilares e distinção dos percursos, sem prometer configuração única para toda oferta.
- CONS-08.4: inclusão, CTA informativo como-funciona e acesso existente via login. Contato continua condicionado a configuração confirmada.
- CONS-08.5: SVG identificado como ilustração sem dados, FAQ de privacidade separa registros individuais e comunidade; não equivale a teste autenticado.
- CONS-08.6: página informativa sem preço, checkout, inscrição autônoma ou oferta independente disponível; FAQ explícita.

Não encerrados: logos/assinatura, autorização de fotografias, informações profissionais/duração/contatos reais, aprovação de textos/telas ou publicação. Não são tarefas antigas consideradas aprovadas automaticamente.

Validação: lint aprovado com zero erros/oito avisos legados; build atualizado/TypeScript aprovados; smoke updated passou com 25 respostas/contratos e 82 links/fragmentos. Smoke agora analisa o XML da ilustração para impedir retorno de prazos antigos e elementos externos/script. py_compile do script passou. Sem testes de navegador/aparelho, commit, push ou deploy. Build padrão/encerramento registrados abaixo.

Encerramento: build padrão e TypeScript aprovados; servidor local encerrado; build final com ambas as chaves false. git diff --check passou; caminhos/links locais e sete marcações do plano conferidos. Original SVG legado continua sem diff.

## Consultoria — primeira inspeção visual pelo Chrome nativo — 13/11/2026

Acesso ao browser integrado continua indisponível, mas cua.getState revelou interface nativa do Chrome acessível. Teste realizado em janela anônima de localhost:3001, sem login ou dados de participantes; janela de teste fechada ao terminar. A tentativa inicial de escolher visitante foi interrompida por mudança de estado da aplicação; foi reconsultado o estado e aberta uma janela anônima separada. Não houve uso da conta pessoal para testar a aplicação.

Evidência observada em screenshots/árvore de acessibilidade do Chrome, sem alegar aparelhos reais:

- Home: primeira tela desktop na janela disponível (screenshot 1920 × 966) e primeira tela em viewport emulado 375 × 812; retrato, marca textual, títulos e CTA renderizados.
- Menu público em 375 px: abriu/fechou, Escape devolveu foco ao botão Menu e link A mentoria navegou para a proposta.
- Mentoria e game: primeiras telas em 375 × 812. Game também conferido em 320 × 812, sem corte horizontal visível no hero observado. Não foi medido scrollWidth nem inspecionado todo o documento.
- Guia #dialogos em 375 px: abertura colocou foco no fechamento; Tab alcançou campo/checkbox. Bloquear fechamento via Space desabilitou fechamento e Escape manteve o diálogo aberto. Após desbloquear, segundo diálogo abriu; Escape retornou ao acionador no primeiro, e novo Escape retornou ao botão da demonstração. Shift+Tab também alcançou a interface do DevTools; não declarar aprisionamento do foco fora do documento ou teste completo de todas as ordens de tabulação.
- Encontrado tema incompleto no exemplo: título/fechamento ainda legados. StyleGuide passou a envolver DialogExamples em ConsultoriaAccessTheme preview; CSS do tema recebeu fundo nude/texto vinho no botão de fechar. Screenshot posterior confirmou cabeçalho editorial e botão corrigidos, com conteúdo/ações visíveis na tela emulada.

Nenhuma aprovação editorial/visual da consultoria, teste Safari/iPhone, aparelho físico, zoom 200%, fluxo autenticado, submissão real ou instalação PWA. CONS-03.1/03.2/03.3 e 12.3 continuam abertos para conferência integral. Inspeção pontual registra progresso, não homologação de todas as telas.

Verificações automatizadas executadas antes do ajuste visual: cinco testes ui-utils, nove PWA, oito de conteúdo (22 no total) e 16 pares de contraste passaram; lint completo passou com zero erros/oito avisos legados e TypeScript passou. A correção subsequente envolve somente wrapper/CSS; ESLint direcionado e builds/TypeScript finais registrados abaixo. Backend inalterado, testes Django não repetidos, sem dependências, commit, push ou deploy.

Encerramento: ESLint direcionado aprovado; builds com apresentação ativa/inativa e TypeScript aprovados após a correção do modal. Build padrão restaurado com ambas as chaves false. Servidor local e janela anônima de teste encerrados; git diff --check aprovado. CONS-12.1 registra os comandos executados nesta revisão, sem dispensar revalidação após mudanças futuras.

## Consultoria — revisão de seções móveis e ilustração ampliável — 14/11/2026

Continuidade da inspeção pelo Chrome nativo, janela anônima e localhost:3001, sem dados privados. Conferidos por rolagem/âncoras em 375 × 812: home (retratos/editorial, ofertas, frase simbólica, apresentação profissional, FAQ e rodapé); mentoria (pilares, processo, bloco incluído e início das condições provisórias); game (descrição do percurso, ilustração, explicação dos percursos e FAQ de acesso independente). Amostra ampliada de seções, sem afirmar conferência de cada pixel, de todas as larguras ou aceite da consultoria.

A aparente borda cortada no cabeçalho foi investigada: o box model mostrava largura de 320 px e alterações experimentais de body/header não alteraram o resultado. Após restaurar zoom 100% na janela anônima, o corte deixou de aparecer. Os ajustes experimentais foram removidos, inclusive mudanças preventivas da grade, sem mudança de CSS para esse ponto. Reconferido hero/menu do game em 320 × 812 com zoom normal, sem corte visível. As amostras iniciais anteriores não devem ser tratadas como medição rigorosa de viewport/zoom; o roteiro passa a exigir zoom normal antes de emular dimensões. Não foi alterada uma preferência do perfil pessoal.

FAQ da home abriu a resposta de inclusão por clique e fechou por Space; FAQ do game abriu a resposta que informa ausência de inscrição independente. Condições continuam “A confirmar”. Sem contato externo, login, aceite ou envio.

Melhoria implementada: ilustração reduzida no celular recebeu link “Ampliar ilustração (nova aba)” em ConsultoriaPages.tsx, com noopener/noreferrer. Clique abriu o SVG local em aba independente; screenshot confirmou documento ampliado, título/descrição acessíveis e ausência de dados pessoais. A aba e a janela anônima foram fechadas. O texto explicativo permanece disponível junto da imagem. O smoke registra o SVG no mapa de destinos para conferir o novo link.

Validação HTTP da prévia: 12 respostas/contratos e 110 ocorrências de links/fragmentos aprovados. Lint/builds/TypeScript finais registrados no encerramento. Não houve nova suíte Django ou teste autenticado; backend inalterado. Sem dependências novas, commit, push ou deploy.

Encerramento: lint passou com zero erros/oito avisos legados; builds ativo/inativo e TypeScript passaram. Build final padrão com prévia desativada. Servidor local e janela anônima encerrados; git diff --check aprovado. Caminhos/links de documentação revisados. Ajustes experimentais de CSS removidos; única mudança funcional deste recorte é o acesso à ilustração ampliada e sua verificação de destino.

## Consultoria — comercial/tablet, offline e recuperação legal — 14/11/2026

Chrome nativo em janela anônima, zoom normalizado em 100%, servidor local dedicado; perfil/servidor do responsável em localhost:3000 preservados.

Inspeção visual:

- Herbalife em viewport 768 × 812: hero, CTA/âncora orientacoes, instruções em duas colunas, limites comerciais, FAQ e contato separado “A confirmar”. FAQ de separação aberta; nenhum link externo, cadastro ou compra executado. A verificação de legibilidade não aprova fatos comerciais.
- Arquivo offline-consultoria.html em 768 e 320 px: título, botões, aviso e rodapé legíveis; ação tentar novamente recarregou o arquivo estático. Não houve perda real de rede, instalação PWA ou validação do worker no navegador.
- Termos/Privacidade em 320 px com a chave ativa no servidor de teste: marca/tema renderizados, mas consulta ao documento falhou. Não foi determinada a causa da falha de integração neste recorte, nem validado texto jurídico publicado. Não houve alteração de API/CORS/configuração de produção.

Melhorias: LegalDocumentPage recebeu “Tentar novamente”, mantendo botão montado/focável durante a consulta e aria-disabled com guarda enquanto loading, preservando navegação por teclado. No teste com Shift+Tab/Return, foco permaneceu no botão após nova falha; Tab alcançou os links legais e Enter navegou para Privacidade. Clique via automação nativa em emulação apresentou foco diferente, por isso a evidência de foco é especificamente do teste por teclado. Erro anunciado e estado de carregamento existentes preservados; serviço/payload/documento jurídico não mudaram.

Rotas legais agora possuem título específico da aba somente no modo atualizado, via generateMetadata. Modo padrão retorna metadados vazios para herdar os anteriores. Referência local Next.js consultada: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md. Smoke passou a interpretar title e conferir os dois títulos legais no modo updated.

Arquivos: páginas terms/privacy, LegalDocumentPage TSX/CSS, scripts/check_consultoria_routes.py e documentação afetada. Janela anônima e servidor de desenvolvimento encerrados antes dos builds. Sem aceites, login, submissão, conta de teste, backend alterado, suíte Django repetida, dependências novas, commit, push ou deploy. Resultados técnicos finais abaixo.

Validação deste recorte: lint aprovado com zero erros/oito avisos legados; build atualizado e TypeScript aprovados. Smoke updated aprovou 25 respostas/contratos, 83 links/fragmentos e títulos específicos dos dois documentos. Servidor de produção local encerrado; restauração padrão registrada no encerramento.

Encerramento: build padrão/TypeScript aprovados, ambas as chaves false. Servidores de teste e janela anônima encerrados; git diff --check e caminhos locais conferidos. Nenhum teste de leitura jurídica bem-sucedida foi declarado: consulta ao documento permanece pendente no ambiente de homologação.

## Consultoria — prévia isolada e integração legal local — 14/11/2026

Diagnóstico da falha anterior por consultas de leitura: Django em 127.0.0.1:8000 retornou HTTP 200/lista vazia para documents/current. Com origem localhost:3000, havia cabeçalho CORS correspondente; com origem 127.0.0.1:3001, não havia. A API estava disponível, mas o navegador da prévia não podia ler a resposta. Não havia documento publicado nessa instância.

Implementado `npm run dev:consultoria`: ativa a proposta localmente em 127.0.0.1:3001, define NEXT_PUBLIC_API_URL=/api/v1 e usa rewrite nativo Next com destino fixo 127.0.0.1:8000. Encaminhamento condicionado a development e CONSULTORIA_LOCAL_API_PROXY=true; produção ignora a opção. Não foi criada outra camada de API nem alterados Django, CORS, contratos ou banco. Barras finais preservadas na prévia para evitar redirecionamento circular com Django. A tentativa inicial de segunda instância encontrou lock do desenvolvimento comum; distDir próprio `.next-consultoria-preview` resolveu sem encerrar o servidor do responsável. Diretório ignorado no Git/ESLint e tipos gerados incluídos no tsconfig.

Verificações executadas:

- `npm run test:local-preview`: três testes aprovados, lendo/transpilando a configuração real; produção ignora proxy mesmo com flag true, desenvolvimento comum não encaminha e prévia explícita usa destino/prefixo fixos.
- `npm run lint`: zero erros, oito avisos legados de imagens.
- `CONSULTORIA_LOCAL_API_PROXY=true ENABLE_CONSULTORIA_SITE=true ENABLE_CONSULTORIA_PREVIEW=false npm run build` e `npx tsc --noEmit`: aprovados. No build servido temporariamente em 3002, os dois endpoints legais locais retornaram 404, comprovando ausência do rewrite em produção.
- Smoke HTTP preview: 12 respostas/contratos e 110 links/fragmentos aprovados. Smoke updated: 25 respostas/contratos e 83 links/fragmentos aprovados. Primeiro acesso HTTP no sandbox foi bloqueado; repetição com permissão de rede local aprovada.
- Pela prévia: consulta pública de documentos retornou 200/lista vazia, e pendências sem sessão retornou 401. No Chrome nativo em janela anônima, Termos e Privacidade exibiram “Documento em preparação” e aviso de revisão, sem erro de consulta. Nenhum aceite ou login executado. Estado vazio integrado validado; documento publicado e fluxo autenticado permanecem pendentes.
- Build final com ENABLE_CONSULTORIA_SITE=false e ENABLE_CONSULTORIA_PREVIEW=false e TypeScript aprovados. Artefatos da prévia conferidos como ignorados pelo Git.

Arquivos deste recorte: next.config.ts, package.json, scripts/local-preview.test.mjs, .env.example, tsconfig.json, eslint.config.mjs, .gitignore e documentação de contexto/prévia/backlog/README/auditoria. Referências Next locais consultadas para rewrites, distDir e skipTrailingSlashRedirect. Sem dependências novas ou testes Django neste recorte, pois backend permaneceu inalterado. Servidores temporários de 3001/3002 e janela anônima encerrados; processos existentes de 3000/8000 preservados. Sem publicação de textos jurídicos, alteração de dados, commit, push ou deploy.

## Consultoria — espera e falha na solicitação de instalação — 14/11/2026

Recorte de CONS-11.3b: inspeção de PwaInstall encontrou chamada assíncrona sem bloqueio de repetição ou catch. Cliques rápidos podiam reutilizar o mesmo evento, e rejeição de prompt/userChoice ficava sem tratamento. Implementado bloqueio síncrono por ref durante a solicitação, estado “Aguardando o navegador…” e aria-disabled com guarda no handler. O evento consumido é retirado também em falha; finalização de evento anterior preserva eventual novo evento do navegador.

Falhas exibem aviso role=status associado ao acionador por aria-describedby e botão “Fechar aviso”. Acionador permanece montado no estado de erro para evitar remoção desnecessária do elemento focado. Não aceitar a instalação não produz aviso de erro. Evento appinstalled oculta os controles. CSS Module mantém as duas apresentações, foco visível, alvos mínimos e largura limitada ao viewport. Nenhum prompt é disparado automaticamente e nenhum aplicativo foi instalado neste recorte.

Arquivos: frontend/src/components/pwa/PwaInstall.tsx, PwaInstall.module.css, scripts/pwa-install.test.mjs, package.json, plano e roteiro de prévia. Referência local Next use-client.md consultada. Sem alterações de API, service worker, regras de cache, backend, dados ou dependências neste recorte.

Validações executadas:

- `npm run test:pwa-install`: oito testes aprovados. Componente real transpilado, com hooks/eventos simulados: ausência de evento, concorrência, escolhas accepted/dismissed, falha de prompt, falha de userChoice, appinstalled e preservação de evento posterior. Não é teste de DOM, leitor de tela, renderização ou instalação nativa.
- `npm run test:pwa`: nove testes existentes do worker aprovados.
- `npm run lint`: zero erros/oito avisos legados de imagens; `npx tsc --noEmit` aprovado.
- Builds com ENABLE_CONSULTORIA_SITE=true e false, ambos com ENABLE_CONSULTORIA_PREVIEW=false, aprovados. Build final padrão restaurado; TypeScript aprovado após build.

CONS-11.3b permanece aberto: aparência/foco reais do aviso, Safari/iPhone/Android, instalação, atualização e logout offline precisam de homologação em navegador/aparelho. Não houve teste visual neste recorte, aceite da consultoria, commit, push ou deploy. Processos existentes preservados; nenhuma nova aplicação foi iniciada.

## Consultoria — revisão editorial e ajuda antes do login — 14/11/2026

Recorte de CONS-12.6 e CONS-12.4: leitura integral dos componentes de home/mentoria/game, seções/FAQ/contato, shell/rodapé, conteúdo central, Herbalife e metadados; conferência de login, dashboard, navegação/proteção, manifesto e metadados globais. Matriz por trecho em docs/CONSULTORIA_REVISAO_EDITORIAL.md. Fatos comerciais/profissionais, direitos de imagens, originais de marca e aprovação da titular permanecem pendentes. A matriz registra inspeção técnica, não validação profissional ou jurídica.

Encontrado link de ajuda no login para /player/support, cuja proteção exige sessão e redireciona visitantes ao login. Corrigido para /#contato, com rótulo “Precisa de ajuda? Veja os canais de contato”. Seção presente no HTML das duas apresentações; nenhuma abertura do suporte autenticado ou alteração de autorização. Contato não confirmado permanece provisório. Descrição social do game deixou de presumir cartada diária para todo grupo e agora explicita dependência da jornada vinculada. Description, Open Graph e Twitter conferidos no HTML atualizado.

Script check_consultoria_routes.py ampliado com asserções de ajuda pública, âncora existente e três descrições do game. Modo preview também consulta a home para esse contrato. Resultados executados: updated 25 respostas/contratos e 83 links/fragmentos; legacy 24 respostas/contratos; preview 13 respostas/contratos e 110 links/fragmentos. Essas contagens substituem as anteriores para o script atual. Sem requisições externas, login, submissão, aceite ou teste de navegação por clique neste recorte; HTTP não executa o encaminhamento React.

Validações: npm run lint passou com zero erros/oito avisos legados; npx tsc --noEmit e builds com ENABLE_CONSULTORIA_SITE=true/false e ENABLE_CONSULTORIA_PREVIEW=false passaram. Build padrão restaurado. Referências Next locais link.md e generate-metadata.md consultadas. Sem nova dependência, alteração de backend ou suíte Django neste recorte. Diff conferido com git diff --check. Servidores temporários 3001/3002 encerrados, processos preexistentes preservados; sem commit, push ou deploy.

Arquivos: frontend/src/app/login/page.tsx, frontend/src/components/consultoria/metadata.ts, scripts/check_consultoria_routes.py, docs/CONSULTORIA_REVISAO_EDITORIAL.md, docs/CONSULTORIA_NAVEGACAO.md, docs/CONSULTORIA_PREVIEW.md, IMPLEMENTATION_PLAN.md e esta auditoria. CONS-12.6 continua aberto até revisão dos ativos/fatos e aceite final.

## Consultoria — foco da validação e atalhos da participante — 14/11/2026

Recorte de CONS-12.3: validação local de campos vazios do login retornava antes do tratamento de foco usado nas falhas de requisição. Acrescentado foco na mensagem após sua renderização. No Chrome nativo, janela anônima e prévia isolada em 3001, clicar “Entrar” sem preencher exibiu o aviso e focou seu container; Tab alcançou “Entrar”; Return repetiu a validação e voltou a focar o mesmo aviso. Teste sem credenciais ou requisição de autenticação pelo handler, que retorna na validação local. Não foi testado leitor de tela ou viewport móvel neste recorte. A primeira tentativa de controlar a sessão anterior do Chrome foi recusada até atualizar sua observação; estado atualizado antes de prosseguir. Janela pessoal preservada e janela anônima encerrada.

PlayerLayout recebeu link “Pular para o conteúdo” antes do cabeçalho, visível ao foco, com destino participant-content no main com tabIndex=-1. CSS usa tokens do tema/fallback legado e margem de rolagem para o cabeçalho fixo. Conferência estática de destino único e seletores executada; fluxo autenticado, menu aberto, zoom e mobile permanecem pendentes. Sem nova rota pública ou bypass de proteção para testar o layout.

Inspeção encontrou main adicional dentro do PlayerLayout na conversa de suporte. Substituído por section nomeada “Conversa do chamado”; padding de desktop/mobile transferido do seletor de tag para classe conversation. Formulários, mensagens, ações e autorização preservados. Não foi lida ou enviada conversa real.

Validações executadas: npm run lint (zero erros/oito avisos legados); builds ativo e padrão com ENABLE_CONSULTORIA_PREVIEW=false aprovados; npx tsc --noEmit aprovado após build padrão. Conferidos diff/seletores e git diff --check. Sem testes Django ou suítes de regras de negócio, pois não houve alteração de API/acesso/dados/pontuação. Referências locais Next use-client.md e link.md consultadas. Servidor temporário 3001 encerrado; processos existentes preservados. Sem dependências novas, commit, push ou deploy. CONS-12.3 permanece aberto para a homologação integral.

Arquivos deste recorte: login/page.tsx, PlayerLayout.tsx/module.css, player/support/page.tsx e PlayerSupportPage.module.css, plano, roteiro de prévia e auditoria.

## Consultoria — verificação completa de backend em PostgreSQL isolado — 14/11/2026

CONS-12.2 concluído após execução nova das verificações, sem alteração de código da aplicação neste recorte. Conferidos effective_products, serializers de login/sessão, testes de entitlements e isolamento de jornadas. As modificações anteriores permanecem: mentoria vigente deriva GAME na leitura, sem criar concessão/matrícula; validade e revogação retiram somente o direito derivado; concessões independentes e papéis existentes são preservados.

Ambiente descartável criado em `/private/tmp/cartada-consultoria-backend-20261114.iHLeg6`, com binários existentes do Postgres.app. initdb inicial no sandbox falhou por bloqueio de memória compartilhada e removeu apenas seu diretório incompleto; repetido com permissão de execução local, passou. pg_ctl iniciou cluster próprio com `-k /private/tmp/cartada-consultoria-backend-20261114.iHLeg6 -p 55439 -h ''`: somente socket Unix, sem escuta TCP. Papel consultoria_test criado pelo initdb com permissão para criar o banco de teste. Nenhuma credencial real foi usada ou exibida.

Settings temporário importou a configuração existente, sobrescrevendo MEDIA_ROOT e PRIVATE_MEDIA_ROOT para o diretório descartável. Runner temporário validate.py definiu explicitamente DB_HOST/socket, DB_PORT=55439, DB_NAME=postgres, DB_USER=consultoria_test e settings de teste, usando backend/.venv/bin/python. SECRET_KEY de teste foi definido somente para essa execução. Arquivos temporários não integram o repositório.

Comandos Django executados sequencialmente pelo runner, dentro de backend/:

1. `python manage.py check` — sem problemas, zero silenciados.
2. `python manage.py makemigrations --check --dry-run` — No changes detected.
3. `python manage.py test --noinput` — 111 testes, 18,119 segundos, OK. Django criou e destruiu seu banco de teste normalmente.

A suíte inclui início/fim de validade, mentoria futura/vencida/revogada/reativada, GAME independente, usuário inativo/sem produto, produtos retornados no login/sessão, API diária, papéis administrativos/mediador e isolamento de grupos/registros privados. Resultado refere-se à suíte existente e não à homologação integral de interfaces, conteúdo clínico ou produção. Sem migrate/seed no banco da aplicação, dependências instaladas ou alteração de API/autorizações neste recorte.

Encerramento: pg_ctl stop do cluster temporário retornou server stopped. Servidores e banco preexistentes preservados. Documentação atualizada: IMPLEMENTATION_PLAN.md (CONS-12.2 marcado concluído), docs/CONSULTORIA_PREVIEW.md e esta auditoria. git diff --check executado. Nenhuma suíte frontend repetida por alteração exclusivamente documental após os testes. CONS-09.6 e demais homologações permanecem pendentes; sem commit, push ou deploy.

## Consultoria — entrada autenticada com contas sintéticas — 14/11/2026

Conferência inicial de CONS-09.6 sem acesso a contas/dados reais. Reaberto exclusivamente o cluster descartável anterior, por socket Unix e sem escuta TCP. Criado banco separado consultoria_visual_preview, aplicadas suas migrations e criadas duas contas PLAYER sintéticas com primeiro acesso já concluído: uma com apenas MENTORSHIP e outra sem produtos; perfis ativos, nenhum grupo/jornada ou documento legal publicado. Não foi usado seed_demo nem banco da aplicação. Settings/mídia permanecem isolados em /private/tmp; bootstrap/runtime temporários não integram o repositório.

API temporária servida somente em 127.0.0.1:8001. Frontend em 127.0.0.1:3001, com diretório de build isolado e NEXT_PUBLIC_API_URL=http://127.0.0.1:8001/api/v1 definido apenas no processo. O rewrite local existente não foi alterado; nessa prova o cliente usou o destino absoluto isolado. CORS da API temporária permitiu somente a origem da prévia. Nenhuma edição de .env real ou configuração de produção. Processos existentes de 3000/8000 preservados.

Chrome nativo em janela anônima. Conexão inicial de automação apresentou pipe fechado; sessão reinicializada e reconectada antes da navegação. Resultados observados:

- Login da conta com MENTORSHIP encaminhou ao dashboard com os dois cards; game marcado “Incluído na sua mentoria”. Screenshot desktop conferido com apresentação atualizada.
- Clique “Acessar a mentoria” abriu /mentorship; árvore de acessibilidade confirmou inclusão, link para game e estado de conteúdos ainda não publicados. Clique nesse link abriu /player/home sem nova compra.
- Screenshot desktop do game mostrou orientação de que falta vínculo com grupo/jornada e link de suporte. Acesso ao produto e matrícula permanecem conceitos distintos.
- Emulação 375 × 812: a primeira imagem aparentava corte; após foco no conteúdo e Cmd+0, nova imagem mostrou cabeçalho/menu, hero e ações dentro da largura. Nenhum ajuste experimental de CSS foi necessário. É obrigatório normalizar zoom da página além da escala de exibição do DevTools.
- Na sessão autenticada, após recarregar, primeiro Tab alcançou “Pular para o conteúdo”; Return navegou a #participant-content e focou seu container; próximo Tab alcançou “Meu progresso”, ultrapassando o cabeçalho. Menu abriu e Escape fechou, com foco no acionador.
- Clique nativo em Sair dentro da emulação não produziu navegação; depois de fechar DevTools, clique no botão desktop encerrou a sessão e voltou ao login. Não considerar o clique móvel como aprovado.
- Conta sem produtos autenticou e exibiu “Nenhum produto ativo nesta conta”. Tentativa explícita de /player/home terminou em /dashboard, sem acesso visual ao game. Isso testa encaminhamento React; não comprova 403 em todos os endpoints legados. Logs da API mostraram listas vazias de jogos/jogadas/rodadas/evidências; autorização por produto da API diária continua coberta pela suíte Django anterior.
- Segunda conta saiu pelo botão Sair; janela anônima encerrada, janela pessoal preservada. Nenhum aceite jurídico, instalação PWA, envio de evidência, chamado, compra ou contato externo executado.

Leitura SQL no banco descartável após a prova confirmou uma única concessão MENTORSHIP, nenhuma GAME criada e zero grupos. APIs de sessão/documentos/programas responderam 200; ausência de documentos dispensou qualquer aceite. Sem dados de participantes reais em telas ou capturas observadas.

Limites: não foi criada jornada vinculada nem conteúdo de mentoria; sem teste de aula, formulário/envio, aparelhos/Safari ou aprovação da consultoria. CONS-09.6 permanece aberto com o avanço registrado. Nenhuma alteração de código de aplicação neste recorte; somente plano, roteiro e auditoria. Não repetidos builds/lint/suítes por validação manual e documentação apenas. Arquivo next-env restaurado ao caminho de desenvolvimento anterior após a prévia; git diff --check executado. API/frontend temporários encerrados, pg_ctl stop confirmou server stopped. Sem commit, push ou deploy.

## Consultoria — jornada vinculada, conclusão e foco — 14/11/2026

Continuidade no banco descartável consultoria_visual_preview: grupo com o PlayerProfile sintético, jornada diária criada pelo endpoint existente com identidade administrativa somente de teste, primeira cartada textual e programa/módulo com dois conteúdos LINK locais. Conteúdo marcado explicitamente como sintético, sem orientação clínica ou fatos da oferta real. Nenhuma concessão GAME adicionada. Preparação inicial pelo APIClient recebeu Host inválido; repetida com HTTP_HOST local permitido. Um comando auxiliar de preparação sem caminho de settings falhou antes de acessar dados; corrigido apenas o script temporário. Não foram alteradas configurações da aplicação para essas falhas.

API 8001 e frontend 3001 isolados, como no recorte anterior; cluster somente por socket Unix. Chrome nativo em janela anônima:

- Login da participante com apenas MENTORSHIP, abertura do portal, programa/módulo e conteúdo de teste. Diálogo real recebeu foco no botão Fechar; Tab/Tab alcançou Marcar como concluído. Conclusão atualizou progresso de 0% para 100% do primeiro conteúdo; Escape devolveu foco ao acionador.
- Identificada perda de foco no acionador de conclusão porque disabled removia a possibilidade de foco durante/após gravação. Alterado somente esse botão para aria-disabled; a guarda existente de workingRef/content.is_completed continua impedindo chamadas repetidas. CSS inclui aria-disabled para conservar o estado visual. Segundo conteúdo sintético permitiu retestar: Return concluiu, foco permaneceu no botão, Return adicional não alterou o estado; Escape devolveu foco ao acionador. Total de dois conteúdos concluídos e progresso 100%.
- Abertura do game incluído com jornada vinculada exibiu cartada, campos e indicadores. Enviada intenção textual sintética: retorno de sucesso, 10 pontos e histórico com um item. Enviada evidência textual sintética: retorno de sucesso, total 40 pontos e um dia participado. Histórico aberto mostrou os dois textos sintéticos e estados registrados.
- Navegação de volta ao game preservou os registros carregados da API. Consulta SQL posterior confirmou uma DailyParticipation, soma 40 e dois ContentProgress concluídos, sem duplicação de registros. Isso não é teste de concorrência de rede; idempotência permanece coberta pela suíte Django anterior.
- Diálogo com título longo conferido por screenshot em 320 × 812, após foco no conteúdo/Cmd+0: título em múltiplas linhas, fechar/material/conclusão legíveis dentro da prova. Cartada concluída conferida em 375 × 812; título, instrução sintética e estados registrados legíveis. Busca nativa do DevTools usada para localizar o título no painel; não houve execução de código no navegador.
- Saída pelo botão Sair retornou ao login; janela anônima encerrada e janela pessoal preservada. Nenhum aceite jurídico, compra, instalação PWA, contato externo ou dado pessoal utilizado. Links de material apontavam ao guia local; não foram abertos. Vídeo, arquivo protegido, upload e erro de rede não foram exercitados.

CONS-09.6 marcado concluído para o recorte técnico local de integração/entrada/participação, somando esta prova e os estados sem grupo/sem produto anteriores. O texto do item explicita a distinção: não conclui homologação integral de telas/aparelhos, revisão do conteúdo real, aprovação da consultoria ou produção, ainda previstas em CONS-12.3/12.8 e fase 13. Prazos técnicos renderizados na jornada sintética não confirmam duração da oferta comercial.

Arquivos de aplicação alterados: frontend/src/app/mentorship/page.tsx e MentorshipPage.module.css. Documentos: plano, PROJECT_CONTEXT.md, roteiro de prévia e auditoria. Validações executadas: npm run lint sem erros/oito avisos legados; builds ativo e padrão com prévia false aprovados; npx tsc --noEmit aprovado após build padrão; diff conferido. Referência Next local use-client.md consultada. Backend/regras de pontos/acesso inalterados, sem repetir suíte Django neste recorte; 111 testes aprovados no recorte anterior.

Encerramento: API/frontend de teste e PostgreSQL temporário encerrados; pg_ctl informou server stopped. Dados reais e processos preexistentes preservados. Build padrão restaurado e next-env devolvido ao caminho anterior de desenvolvimento. Sem dependências novas, commit, push ou deploy.

## Consultoria — suporte distingue erro de vazio e permite recuperação — 14/11/2026

Recorte de CONS-12.3/04.6b. Inspeção encontrou falha inicial de getSupportTickets exibida junto do estado “Você ainda não abriu chamados”, sem repetição de leitura. Separados loadError/loading dos erros de gravação. Histórico indisponível não é tratado como resposta vazia. Adicionado botão Tentar novamente com guarda síncrona contra repetição, aria-disabled durante consulta e permanência no DOM para conservar foco após falha. Sucesso de repetição remove o aviso e foca título Histórico com tabIndex=-1. Cleanup lógico ignora resposta da consulta após desmontagem. Seleção vigente/link de chamado preservados; rascunhos e rotinas de criação/resposta/download não foram alterados. CSS Module mantém tokens/fallback legado, foco e alvo mínimo.

Validação automatizada: `npm run test:support-recovery` aprovou quatro testes com componente real transpilado, hooks/serviço simulados: falha sem falso vazio; vazio legítimo; bloqueio de repetição, botão focável, rascunho preservado e foco programado após sucesso; resposta tardia sem atualização após desmontagem. Não são testes de DOM, layout, leitor de tela ou autorização Django. Preservação de rascunho foi verificada nessa simulação, sem envio de mensagem.

Validação no Chrome nativo: conta sintética no PostgreSQL descartável anterior; API 8001 e prévia 3001 isoladas. Middleware e settings somente em /private/tmp introduziram 503 apenas no GET /api/v1/support/tickets/ enquanto um arquivo sinalizador existia. Login/sessão/documentos continuaram normais. Nenhuma injeção de código no navegador ou alteração do backend da aplicação.

Observado: falha mostra mensagem e Histórico indisponível; clicar Tentar novamente com 503 persistente manteve foco no botão. Após retirar o sinalizador de falha, Return executou consulta bem-sucedida, exibiu vazio legítimo e focou cabeçalho Histórico. Falha reativada para screenshot em 375 × 812 com zoom normalizado: mensagem, botão e coluna do histórico legíveis. Não foi afirmado teste de recuperação por toque/mobile ou leitor de tela. Saída da conta pelo botão Sair, janela anônima encerrada e perfil pessoal preservado. Nenhum chamado, resposta ou anexo enviado.

Arquivos de aplicação: frontend/src/app/player/support/page.tsx e PlayerSupportPage.module.css. Teste novo: frontend/scripts/support-recovery.test.mjs e comando em package.json. Plano/roteiro/auditoria atualizados. `npm run lint` passou com zero erros/oito avisos legados; build ativo aprovado. Encerramento de build padrão/TypeScript registrado abaixo. Referência Next local use-client.md e serviços/tipos existentes consultados. Sem alteração de contrato, autenticação, dados reais, pontuação ou dependência nova; suíte Django não repetida neste recorte de frontend.

Ambiente temporário encerrado: sinalizador de falha removido, API/frontend parados, pg_ctl confirmou server stopped. Middleware de falha existe somente no diretório temporário e não integra a configuração da aplicação. CONS-12.3/04.6b continuam abertos para revisão integral. Sem commit, push ou deploy.

Encerramento técnico: build padrão com ENABLE_CONSULTORIA_SITE=false e ENABLE_CONSULTORIA_PREVIEW=false aprovado; npx tsc --noEmit aprovado. next-env restaurado ao caminho anterior de desenvolvimento e git diff --check aprovado.

## Consultoria — Lighthouse móvel e experimento de prioridade revertido — 14/11/2026

Avanço de CONS-12.5: build atualizado com prévia false servido apenas em 127.0.0.1:3002; Lighthouse executado pela UI nativa do Chrome/DevTools, janela anônima. Navegador precisou de nova observação após mudança de estado do aplicativo antes de prosseguir; nenhuma ação em janela pessoal foi usada para auditoria. Ferramenta 13.5.0, Navigation/Mobile, Moto G Power emulado, Slow 4G e throttling simulate. Não instalado pacote nem usada API programática de controle do navegador.

Uma amostra por página: home, mentoria e game retornaram desempenho 96, acessibilidade automatizada 100, Best Practices 100, SEO 100, FCP/Speed Index 1,1 s, LCP 2,7 s, TBT arredondado 0 ms e CLS 0. URLs e horários confirmados nos JSONs exportados, não presumidos a partir da aba. Valores numéricos não arredondados/configuração e hashes dos relatórios em docs/qa/consultoria-lighthouse-2026-11-14.json. Isso não comprova conformidade integral, dados de campo, INP ou desempenho de hospedagem/rede real.

Diagnóstico da home identificou foto do hero como LCP, descoberta no HTML/não lazy, mas sem indicação de prioridade alta; economia estimada desse insight era zero. Referência local Next image.md consultada (preload/priority/loading/fetchPriority). Experimento no Hero compartilhado substituiu priority por eager/high, sem mudar imagem ou sizes. Build experimental e HTML servido confirmaram os atributos. Nova medição da home: desempenho 96, LCP 2,9 s, TBT 10 ms, demais valores arredondados preservados. Sem ganho comprovado nessa amostra; diferença não prova causalidade/regressão estatística. Experimento integralmente revertido. Nenhuma melhoria de velocidade declarada ou mudança de produto mantida por essa tentativa. Revisões de CSS/JS sugeridas pelo relatório não foram feitas sem análise de consumidores/novas medições.

Relatórios salvos pela própria UI em /private/tmp/consultoria-lighthouse-{home,mentoria,game,home-experimento}-20261114.json. No primeiro diálogo de exportação, pasta/nome foram reconferidos e ajustados por setValue antes de salvar; os quatro arquivos corretos foram lidos para extração. Resumo versionado não contém screenshots base64 ou traces grandes; relatórios completos continuam locais/temporários. Leituras dos JSONs foram análise de artefatos exportados, sem consultar internals do browser. Um diagnóstico da mentoria era notApplicable e não tinha details; consulta inicial dessa chave falhou e foi corrigida ao inspecionar seu estado, sem invalidar a auditoria.

Verificações: builds ativo inicial/experimental e build padrão final aprovados; npm run lint com zero erros/oito avisos legados; npx tsc --noEmit aprovado após build padrão; smoke updated do build experimental aprovou 25 respostas/contratos e 83 links/fragmentos. Após reversão, Hero conserva exatamente a implementação anterior. Alterações finais deste recorte são plano, roteiro, docs/CONSULTORIA_PERFORMANCE.md, resumo JSON e auditoria. Sem nova dependência, backend, dados reais, commit, push ou deploy. Nenhuma suíte Django repetida.

Servidor temporário de 3002 e janela anônima encerrados; perfil/processos existentes preservados. Configuração padrão de build restaurada; next-env devolvido ao caminho anterior. git diff --check conferido. CONS-12.5 continua aberto para amostragem ampliada, aparelhos/redes reais, interatividade e instalação/offline/cache privado.

## Consultoria — validação de anexos antes do envio no suporte — 14/11/2026

Recorte de CONS-12.3/04.6b. Rastreado seletor → estado do formulário → supportService/FormData → serializers Django. Backend já define 10 × 1024 × 1024 bytes e extensões .jpg/.jpeg/.png/.webp/.pdf/.txt/.doc/.docx. Interface da participante antes usava apenas accept e texto parcial; isso não impede seleção nem evita envio de arquivo inválido.

Criado frontend/src/lib/supportAttachments.ts, espelhando somente limite/extensões existentes, sem MIME presumido ou nova regra comercial. Criação e resposta verificam o arquivo ao selecionar e antes de chamar o serviço. Mensagens claras, aria-invalid/descrição associada e opção de remover o anexo. Remoção limpa o seletor e erro sem apagar rascunho; foco retorna ao input (no reply, após remontagem por key). Extensões aceitam maiúsculas; nomes sem sufixo permitido ou acima do limite são recusados. Servidor continua autoridade e seus validadores/permissões/storage não foram alterados. Não migrado admin nem outros domínios.

Testes executados:

- npm run test:support-attachments: cinco cenários aprovados, incluindo comparação de constantes com serializer Django, anexo opcional, limite exato/um byte acima, maiúsculas e extensões inválidas/disfarçadas. São verificações de metadados, sem certificar conteúdo ou segurança de um arquivo.
- npm run test:support-recovery: seis cenários aprovados (quatro anteriores e dois novos). Componente real com hooks/serviços simulados: anexo inválido na criação e grande na resposta não chamam o serviço; remover preserva assunto. Simulação não substitui DOM/browser.
- npm run lint: zero erros/oito avisos legados; build atualizado aprovado. Build padrão e TypeScript finais registrados no encerramento.

Chrome nativo, conta/banco/API descartáveis em 8001, frontend 3001 isolado. Abriu diálogo de novo chamado; digitados assunto/descrição sintéticos; selecionado arquivo temporário de 10 MB + 1 byte, sem enviar formulário. Apareceu “O anexo deve ter no máximo 10 MB.” Remover anexo limpou o seletor/aviso e preservou ambos os textos. Primeiro ensaio revelou que o botão removido deixava de ser focável; ajustado retorno ao seletor e repetido: foco confirmado no input limpo. Escape devolveu foco a Abrir novo chamado; saída pelo botão Sair e janela anônima encerrada. Nada foi transmitido como chamado/anexo; consulta SQL confirmou zero SupportTicket. Não testados upload válido, reply por navegador, leitor de tela ou celular neste recorte.

Arquivo sintético de seleção criado somente em /private/tmp e removido após o ensaio. API/frontend temporários e cluster PostgreSQL encerrados; pg_ctl informou server stopped. Dados reais/processos preexistentes preservados. Sem edição de .env real, migration, backend, concessões, contrato, dependência nova, envio de mensagem, commit, push ou deploy. Suíte Django não repetida, pois nenhum comportamento servidor mudou.

Arquivos: suporte da participante TSX/CSS, novo helper supportAttachments.ts, scripts/support-attachments.test.mjs, extensão de support-recovery.test.mjs, package.json, plano, roteiro e auditoria. Referência local Next use-client.md consultada. CONS-12.3/04.6b permanecem abertos para homologação integral.

Encerramento: build padrão com site/prévia false e npx tsc --noEmit aprovados. next-env restaurado ao caminho anterior; git diff --check aprovado.

## Consultoria — zoom 200% e redimensionamento público — 14/11/2026

Recorte de CONS-04.4b/12.3, sem mudança no código da aplicação. Consultados contexto/plano, DESIGN/CONSULTORIA, instruções frontend, arquitetura/guia e PublicNavigation/ConsultoriaShell. Build ativo com ENABLE_CONSULTORIA_SITE=true e ENABLE_CONSULTORIA_PREVIEW=false aprovado, servido somente em 127.0.0.1:3002.

Chrome nativo, janela anônima: zoom 200% confirmado na interface do navegador. Home: menu aberto, Tab até Magaly Abreu, próximo Tab até A mentoria, Enter navegou e fechou menu. Na mentoria, CTA alcançou #condicoes; título, introdução e primeiros campos provisórios legíveis. No game, #como-funciona mostrou introdução/primeiro passo legíveis em uma coluna. Não afirmada inspeção integral das páginas nesse zoom.

Emulação responsiva: home em 1024/1440 px com cabeçalho, acesso, hero e retrato visíveis; retorno a 390 × 812 e abertura do menu com os quatro links legíveis. Zoom herdado no início da emulação produziu aparente corte, resolvido focando a página e redefinindo a 100%; não foi considerado defeito de CSS. Foco permaneceu no controle de largura do DevTools em parte da emulação; por isso essa amostra não comprova teclado/toque móvel. Teste de teclado em 200% foi realizado antes, na página fora da emulação.

Janela anônima encerrada e janela pessoal anterior observada novamente. Apenas servidor temporário 3002 encerrado; processos existentes 3000/8000 preservados. Não iniciados backend/banco temporário, nem enviados formulários. Plano e roteiro atualizados com cobertura parcial; itens mantidos abertos para homologação integral e aparelhos reais. Sem dependências, commit, push ou deploy. Não repetidos lint/testes Django, pois não houve alteração de aplicação.

Encerramento: build padrão com site/prévia false e npx tsc --noEmit aprovados. next-env restaurado ao caminho anterior de desenvolvimento; nova verificação TypeScript e git diff --check executadas no encerramento. Caminhos locais dos documentos alterados conferidos.

## Consultoria — regressão de eventos da navegação pública — 14/11/2026

Recorte de CONS-04.4b/12.3: planejada inspeção de 768 px/orientação. Build atualizado aprovado, mas controle nativo do Chrome retornou cgWindowNotFound duas vezes; inventário confirmou processo em execução e host de browser indisponível, sem janela acessível. Não foram abertos servidor, sessão autenticada ou janela de teste. Nenhum teste visual de 768 px/orientação declarado; não contornado o controle de UI por outro mecanismo.

Trabalho independente concluído: novo frontend/scripts/public-navigation.test.mjs e comando test:public-navigation em package.json. Seis testes aprovados com componente real transpilado por TypeScript, hooks/pathname/eventos simulados. Verificam aria-controls, alternância/ausência de listeners duplicados, Escape somente no menu e retorno de foco, eventos internos/externos de foco/ponteiro, clique em link/descendente, clique sem link, mudança de rota e limpeza na desmontagem. Não são testes de DOM, acessibilidade integral, CSS, resize ou toque. Nenhuma mudança no componente ou na aplicação.

Plano/roteiro atualizados; CONS-04.4b/12.3 continuam abertos. Backend, dados reais, portas existentes, dependências e contratos preservados; nenhuma suíte Django necessária neste recorte. Sem commit, push ou deploy. Encerramento de lint/build padrão/TypeScript registrado após execução.

Encerramento executado: npm run lint aprovado com zero erros/oito avisos legados; builds atualizado e padrão aprovados; npx tsc --noEmit aprovado. next-env restaurado ao caminho anterior de desenvolvimento. git diff --check e caminhos locais dos arquivos/documentos alterados conferidos.

## Consultoria — leitura inicial da comunidade sem resultados de contexto anterior — 14/11/2026

Avanço de CONS-04.6b/12.3. Rastreado PlayerCommunityPage → communityService → cliente API existente. Inspeção mostrou que falha da primeira consulta podia coexistir com estado de grupo vazio/publicações antigas, e respostas fora de ordem podiam substituir resultados do grupo atual. Backend e autorização não foram alterados.

No efeito da primeira página, limpa posts/nextPage/comentários expandidos ao consultar grupo/jogo; cleanup marca consulta cancelada e bloqueia atualizações tardias de sucesso/erro/finalização. Falha usa estado próprio separado de erro de escrita; há nova tentativa com guarda por ref, aria-disabled sem retirar foco durante espera e foco programado ao cabeçalho após sucesso, condicionado à consulta ainda ativa. Rascunho da publicação permanece. CSS local inclui foco do cabeçalho e cursor de espera. Nada foi transmitido como publicação/comentário.

Novo scripts/community-feed.test.mjs e comando test:community-feed em frontend/package.json. Cinco testes aprovados: falha versus vazio com recuperação e rascunho; limpeza ao trocar grupo com falha; resposta antiga de sucesso; falha antiga/desmontagem; repetição bloqueada/botão focável/foco programado. Simulação transpila componente real e substitui hooks/serviços, não executa DOM, rede, CSS, leitor de tela ou autorização. Primeiro ensaio falhou em dois casos porque fixture sintética não incluía reaction_counts; fixture corrigida. Lint inicial apontou setState diretamente no efeito; inicialização ficou dentro da rotina de consulta, seguindo a convenção existente, e lint subsequente passou com zero erros/oito avisos legados. Referência Next local use-client.md consultada.

Este recorte limita-se à leitura da primeira página: paginação, ranking e operações de escrita concorrentes ainda exigem revisão própria, registrada no backlog. Não há alegação de correção integral da comunidade ou nova proteção de acesso. Validação visual não executada neste recorte; controle do Chrome estava indisponível na tentativa anterior. CONS-04.6b/12.3 mantidos abertos. Sem dependências, banco/API temporários, backend, alteração de portas existentes, commit, push ou deploy.

Encerramento: builds atualizado e padrão com prévia false aprovados; npm run test:community-feed (cinco testes), npm run lint (zero erros/oito avisos legados) e npx tsc --noEmit aprovados. next-env restaurado ao caminho anterior; TypeScript e git diff --check conferidos após restauração. Caminhos locais da documentação afetada verificados.

## Consultoria — paginação e ranking da comunidade em troca de contexto — 14/11/2026

Continuidade de CONS-04.6b/12.3, limitada a consultas. Rastreado page.tsx → communityService → api existente. Paginação anterior podia anexar resultados do grupo anterior, finalizar o estado de uma nova consulta ou repetir a mesma chamada por cliques antes do rerender. Ranking anterior mantinha resultados antigos até resposta e transformava falha em ausência de pontuação.

Implementação: geração da consulta inicial invalida paginação ao mudar filtros/repetir leitura/desmontar. Guarda síncrona por ref impede chamadas simultâneas; sucesso/erro/finalização de geração antiga são ignorados. Nova primeira página reinicia guarda, espera e erro. Página adicional preserva feed em falha, informa erro próprio e permite repetir a mesma página; IDs já presentes são deduplicados. Botão usa aria-disabled e guarda funcional, sem ficar desfocável durante espera. Ranking limpa resultados no início da consulta, usa carregamento/erro separados e cleanup ignora respostas antigas; Todos remove os resultados anteriores. Não altera contratos, permissões, pontuação ou serviços.

frontend/scripts/community-feed.test.mjs ampliado para dez testes, todos aprovados: cinco anteriores e cinco novos de paginação/erro/repetição/deduplicação/desmontagem/ranking. Hooks e serviços simulados com componente real transpilado; não são teste de DOM, navegador, rede, autorização ou aparelhos. Fixture de jogos/ranking adicionada somente ao teste. Consulta ao guia local Next use-client.md. Lint inicial passou com aviso adicional de leitura de ref no cleanup; geração capturada no efeito para atribuição na limpeza, removendo esse aviso.

Arquivos deste recorte: frontend/src/app/player/community/page.tsx, frontend/scripts/community-feed.test.mjs, plano, roteiro e auditoria. Nenhuma alteração de CSS adicional. CONS-04.6b/12.3 continuam abertos; operações de escrita concorrentes e homologação visual aguardam revisão própria. Sem banco/servidor iniciado, dados reais, alteração de processos existentes, dependências, commit, push ou deploy. Suíte Django não repetida: nenhum backend/contrato/autorização/pontuação alterado.

Encerramento executado: npm run test:community-feed aprovou dez testes; npm run lint sem erros/oito avisos legados após ajuste; builds atualizado e padrão aprovados com prévia false, além de npx tsc --noEmit. next-env restaurado ao caminho anterior de desenvolvimento; TypeScript e git diff --check conferidos novamente. Caminhos locais da documentação afetada verificados.

## Consultoria — criação de publicações/comentários durante troca de contexto — 14/11/2026

Recorte de CONS-04.6b/12.3. Rastreado formulário → createCommunityPost/createCommunityComment → cliente API/FormData e tipos existentes. Antes, sucesso tardio podia inserir publicação do grupo anterior e limpar rascunho editado durante a espera; chamadas repetidas antes do rerender não tinham guarda síncrona.

Guardas por ref e geração de contexto bloqueiam repetição e ignoram sucesso/erro/finalização de envio anterior após troca ou desmontagem. Nova consulta reinicia controles de envio; retorno antigo não libera uma nova guarda. Sucesso limpa texto/arquivo/evidência somente se o valor atual coincide com o snapshot enviado; comentário preserva rascunho editado. Publicação retornada é inserida sem duplicar ID já presente. A requisição já iniciada não é cancelada no servidor; destino permanece o payload original. Não alterados contratos, serviços, autorização, regras de publicação, backend ou CSS neste recorte.

Seis testes novos em scripts/community-feed.test.mjs: repetição/sucesso preservando edição; retorno de grupo anterior; falha atual e desmontagem; comentário repetido preservando edição; retorno antigo sem liberar guarda de novo envio; comentário tardio após troca. Total 16 testes aprovados, componente real transpilado com hooks/serviços simulados. Não houve rede, postagem/comentário real, banco temporário ou alteração de processos. Não comprovam DOM, aparelho, autorização ou idempotência no servidor. Guia local Next use-client.md consultado.

Arquivos alterados: frontend/src/app/player/community/page.tsx, frontend/scripts/community-feed.test.mjs, plano, roteiro e esta auditoria. Reações/exclusões/leitura de comentários concorrentes e homologação visual ainda pendentes; CONS-04.6b/12.3 permanecem abertos. Sem dependência nova, commit, push ou deploy; suíte Django não repetida pois backend/contratos não mudaram. Resultados finais de lint/build/TypeScript registrados após execução.

Encerramento executado: 16 testes de comunidade aprovados; npm run lint sem erros/oito avisos legados; builds atualizado e padrão com prévia false aprovados; npx tsc --noEmit aprovado após restaurar next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — reações, exclusões e leitura de comentários por contexto — 14/11/2026

Continuidade de CONS-04.6b/12.3. Rastreado PlayerCommunityPage → serviços existentes. Reações, exclusões e consulta de comentários não verificavam se a resposta ainda pertencia ao contexto atual. Ref de ações por publicação passou a ser compartilhada entre criar comentário, reagir e excluir, evitando concorrência/repetição da mesma publicação antes do rerender. Retornos de sucesso/erro/finalização são descartados após mudança da geração ou desmontagem. Consulta de comentários possui guarda própria e o painel evita IDs abertos duplicados. Confirmação nativa da exclusão de publicação preservada. Não modificados serviços, payloads, autorização, backend ou CSS. Ações enviadas continuam podendo ser processadas no servidor; descarte local não cancela operações nem implementa idempotência no backend.

Cinco testes novos de componente transpilado com hooks/serviços simulados: reação repetida/retorno antigo; leitura repetida/falha antiga; exclusão de publicação cancelada/confirmada/repetida/retorno antigo; exclusão de comentário com contagem atualizada uma vez; rejeições após desmontagem. Total 21 aprovados. O harness foi corrigido para target ES2020, pois a transpilação ES5 anterior não representava iteração de Set usada pelo componente; normalização de espaços no seletor/assert de texto corrigida. Esses ajustes são do teste, não de produto. Nenhuma reação, exclusão ou comentário real foi enviado.

Arquivos: frontend/src/app/player/community/page.tsx e frontend/scripts/community-feed.test.mjs, plano, roteiro e esta auditoria. Lint sem erros/oito avisos legados. Sem teste visual neste recorte; conferir foco após exclusão e interação entre leitura de comentários e mutações simultâneas em homologação integrada. CONS-04.6b/12.3 permanecem abertos. Sem dependências, banco/servidores iniciados, alteração de processos existentes, commit, push ou deploy. Suíte Django não repetida por ausência de mudança de backend/contratos/autorização.

Encerramento: builds atualizado e padrão aprovados com prévia false; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos. Os 21 testes e lint descritos acima foram efetivamente executados.

## Consultoria — erro do contexto inicial separado de ausência de grupos — 14/11/2026

Continuidade de CONS-04.6b/12.3. Contagem do backlog solicitada pelo responsável: 35 itens marcados concluídos e 59 pendentes, sendo 54 nas fases até publicação e cinco de evolução futura. Contagem literal de checkboxes; itens parcialmente implementados/aguardando confirmação continuam abertos e não são funcionalidades integralmente ausentes.

Rastreado carregamento inicial de PlayerCommunityPage → getGroups/getGames/getEvidences existentes. Promise.all antes podia falhar e, após remover loading, exibir ausência de grupos baseada no array inicial vazio. Introduzidos erro/contador próprios e guarda de repetição, mantendo a consulta conjunta existente. Falha apresenta Recarregar comunidade; botão permanece focável enquanto aguarda. Sucesso limpa erro, mantém o vazio legítimo e programa foco ao título após nova tentativa. Cleanup ignora sucesso/erro/finalização de consulta após desmontagem. CSS local inclui foco visível do título. Sem mudança de API, autorização ou backend.

Três testes novos no harness existente: falha/recuperação com repetição e foco programado; ausência legítima de grupos; sucesso/falha após saída. Total 24 aprovados. Seletor de teste antigo para foco do feed foi especificado por div porque o título também passou a aceitar foco; não houve regressão de foco presumida a partir do seletor genérico. Testes transpõem componente com hooks/serviços simulados, sem DOM/browser/rede ou comprovação de acessibilidade integral. Lint passou sem erros/oito avisos legados.

Arquivos deste recorte: frontend/src/app/player/community/page.tsx, PlayerCommunityPage.module.css, frontend/scripts/community-feed.test.mjs, plano, roteiro e auditoria. Homologação visual continua pendente, CONS-04.6b/12.3 abertos. Sem dados reais, servidor/banco iniciado, dependência, alteração de processos existentes, commit, push ou deploy. Suíte Django não repetida por ausência de mudança de backend.

Encerramento: builds atualizado e padrão aprovados com prévia false; 24 testes aprovados; lint sem erros/oito avisos legados; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — nova tentativa na leitura do desempenho — 14/11/2026

Recorte de CONS-04.6b/12.3. Rastreado PlayerPerformancePage → getPlays/getEvidences → API existente. Tela distinguia falha de vazio, mas não oferecia nova tentativa e não impedia atualizações após desmontagem. Criada recuperação com contador/guarda síncrona, botão aria-disabled focável durante espera, retorno programado ao título após sucesso e cleanup de consulta. Mensagem de erro permanece enquanto tenta novamente; totais/histórico continuam ocultos até sucesso. Cálculos de pontos e contagens existentes não alterados. CSS local do botão preserva legado e aplica paleta vinho/marfim apenas no tema ativo; foco visível no título.

Novo frontend/scripts/performance-recovery.test.mjs e comando test:performance-recovery em package.json. Quatro testes aprovados: erro sem totais zerados/vazio; recuperação com repetição e foco; totais 40/30/10 e evidência aprovada preservados em fixture sintética; sucesso/falha após desmontagem. Componente real transpilado com hooks e serviços simulados, sem DOM/rede/servidor ou conformidade visual presumida. Guia Next local use-client.md consultado.

Arquivos: frontend/src/app/player/performance/page.tsx, PlayerPerformancePage.module.css, teste novo, package.json, plano/roteiro/auditoria. Sem mudança de backend, contratos, autorização, regra de pontuação, dependência, dados reais ou processos existentes. Homologação visual/integração real permanecem pendentes e CONS-04.6b/12.3 abertos. Sem commit, push ou deploy; nenhuma suíte Django repetida.

Encerramento executado: quatro testes de performance-recovery aprovados; lint sem erros/oito avisos legados; builds atualizado e padrão aprovados com prévia false; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — recuperação das consultas do ranking — 14/11/2026

Recorte de CONS-04.6b/12.3. Inspecionados instruções, contexto/plano, design/briefing, scoringService/getGameRanking e gameService/getGames. Listagem de jogos não tinha cleanup nem nova tentativa; consulta do ranking já descartava resposta antiga, mas não permitia repetir sem trocar filtros/recarregar.

Adicionados contadores e guardas síncronas para Recarregar jogos e Tentar novamente. Lista passa a ignorar respostas após desmontagem. Ranking mantém seleção na tentativa, descarta retorno substituído e preserva mensagem existente para 403. Erro permanece visível durante nova tentativa para manter o botão focável; sucesso programa foco no título da tela/seção correspondente. Troca de jogo limpa estado da tentativa anterior. CSS local inclui botão e foco, com tema da consultoria condicionado e legado preservado. Sem nova regra de acesso/pontuação, contrato, serviço, backend ou dependência. Guia Next local use-client.md consultado.

Novo scripts/ranking-recovery.test.mjs e comando test:ranking-recovery em package.json. Quatro testes aprovados com componente real transpilado/hooks/serviços simulados: lista falha versus vazio/recuperação/foco; ranking falha/recuperação no mesmo jogo/foco; troca durante tentativa ignora retorno antigo; lista/ranking ignoram sucesso/falha após desmontagem. Não executam DOM, navegador, rede, aparelho ou autorização real. Não declarada conformidade visual.

Arquivos: frontend/src/app/player/ranking/page.tsx, PlayerRankingPage.module.css, teste novo, package.json, plano/roteiro/auditoria. CONS-04.6b/12.3 mantidos abertos para homologação integrada/visual. Sem banco, dados reais, processos iniciados/alterados, commit, push ou deploy. Suíte Django não repetida por ausência de mudança de backend. Resultados finais registrados após execução.

Encerramento executado: quatro testes ranking-recovery aprovados; lint sem erros/oito avisos legados; builds atualizado e padrão com prévia false aprovados; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — roteiro navegável da revisão para aprovação — 14/11/2026

Avanço de CONS-12.7. Prévia já apresentava páginas/guia/dados pendentes, porém sem roteiro único de revisão. Criada /preview/consultoria/revisao, Server Component sob o layout bloqueado de prévia existente, com metadados descritivos e noindex herdado. Roteiro liga home, mentoria, game, guia e Herbalife; lista critérios por página, dados centralizados em consultoriaPendingDetails, conferência móvel/acesso e formato do retorno. Não tem formulário, persistência, criação de contas ou aceite automático; diferencia aprovação de proposta e autorização de publicação. Aviso das prévias recebe link ao roteiro; páginas definitivas com preview=false não recebem esse link.

Arquivos: nova page.tsx/ReviewPage.module.css em frontend/src/app/preview/consultoria/revisao, ConsultoriaShell.tsx, scripts/check_consultoria_routes.py e documentação afetada. CSS Modules utiliza tema/tipografia/componentes existentes, com listas, cards e dados em uma coluna até 760 px. Referências locais Next layouts-and-pages.md e generate-metadata.md consultadas; primeira tentativa do caminho .mdx inexistente corrigida para .md. Sem dependências ou APIs novas.

Lint sem erros/oito avisos legados; build site=true/preview=true aprovado. Servidor temporário somente em 127.0.0.1:3002: sandbox inicialmente recusou bind e conexão local, repetidos com permissões concedidas. Smoke preview aprovou 14 respostas/contratos e 140 links/fragmentos, incluindo H1/noindex, ausência de formulário, quatro seções e distinção entre aprovação/publicação. Isso testa HTML HTTP, não autorização, DOM ou aparelhos.

Controle nativo do Chrome voltou a disponibilizar janela. Criada janela anônima separada para URL local; página anterior não utilizada. Conferidos primeira tela desktop com zoom normalizado, atalho Dados a confirmar e amostra em 390 × 812: card comercial e introdução/primeiros dois campos provisórios legíveis em coluna. Zoom normalizado após foco na página ao iniciar emulação. Não conferidas integralmente todas as seções, teclado, Safari ou aparelhos. Janela de teste encerrada, anterior preservada. Sem formulários enviados ou dados reais consultados na aplicação.

Servidor temporário encerrado antes de restaurar build padrão. CONS-12.7 permanece aberto para versão hospedada/aprovação e demais ativos pendentes; este roteiro não substitui o backlog. Sem commit, push ou deploy. Não repetida suíte Django por ausência de mudança em backend/contratos. Verificações de encerramento registradas após execução.

Encerramento: build padrão site=false/preview=false e TypeScript aprovados. Smoke legacy aprovou 25 respostas/contratos, incluindo HTTP 404 da nova rota e preservação do redirecionamento legado. Servidor 3002 encerrado novamente. next-env restaurado ao caminho anterior; TypeScript, git diff --check e caminhos locais afetados conferidos no encerramento.

## Consultoria — amostras 768 px e horizontal no Chrome — 14/11/2026

Continuidade de CONS-12.3/04.4b, sem alteração de código da aplicação. Build site=true/preview=true aprovado; servidor temporário em 127.0.0.1:3002 com permissão concedida. Chrome nativo em janela anônima separada, mantendo janela anterior. Emulação responsiva: 768 × 812 e zoom normalizado após focar conteúdo. Roteiro #paginas: título e primeiros dois cartões/links legíveis em duas colunas; home: header, acesso, menu, título/CTA/retrato visíveis.

Mudança do viewport para 812 × 390: menu público aberto com quatro links e acesso da participante visíveis. Foco observado no acionador; Tab, Tab, Enter navegou à mentoria e fechou painel. Conferida primeira tela da mentoria (título e retrato, conteúdo posterior abaixo da dobra) e #como-funciona do game (título/introdução e início dos três passos). Sem alegação de leitura integral, rotação em aparelho, toque, Safari ou formulários. Nenhum defeito de CSS confirmado nas amostras, nenhuma alteração de aplicação necessária.

Plano e roteiro atualizados com cobertura parcial. Roteiro documental também corrigiu afirmações desatualizadas sobre número de prévias e CONS-09.6; verificação inicial identificada como histórico para não contradizer ensaios posteriores. CONS-12.3/04.4b continuam abertos. Janela anônima encerrada e anterior preservada; servidor 3002 encerrado. Processos existentes não alterados. Sem dados reais/contas/envios, backend/banco iniciado, dependência, commit, push ou deploy. Não repetidos lint/testes Django por ausência de mudança de aplicação.

Encerramento: builds atualizado/prévia habilitada e padrão/prévia desabilitada aprovados; TypeScript aprovado. next-env restaurado ao caminho anterior; nova conferência TypeScript, git diff --check e caminhos locais afetados executados.

## Consultoria — sucesso de senha separado de falha da sessão — 14/11/2026

Recorte de CONS-04.6d/04.6b/12.3. Inspecionados ChangePasswordForm, Configurações, accountService/changePassword/getCurrentUser e auth/saveAuthUser. O mesmo catch tratava alteração de senha e refresh do usuário: senha já salva seguida de erro de leitura resultava em mensagem incorreta para conferir a senha atual.

Formulário agora registra sucesso/limpa campos imediatamente após resposta de changePassword; depois atualiza sessão em rotina própria. Falha posterior informa senha alterada e oferece Atualizar sessão, que chama somente getCurrentUser/saveAuthUser. Guarda existente também cobre repetição dessa ação; campos/submit bloqueados enquanto sessão pendente. Redirecionamento preservado somente após refresh bem-sucedido. Falha da alteração mantém mensagem/campos existentes. CSS local acrescenta cursor de espera e foco visível do botão, sem mudar tema ou símbolos. Não alterados payloads, backend, política de senha, tokens ou permissões. Referência Next local use-client.md consultada.

Novo frontend/scripts/change-password.test.mjs e comando test:change-password no package.json: quatro testes aprovados com componente real transpilado e serviços/hooks simulados. Cobrem alteração salva/refresh falho/repetição apenas do refresh; bloqueio de duplicação do refresh; falha da própria alteração com campos preservados/sem leitura da sessão; alteração repetida antes de rerender chama serviço uma vez. Valores são strings sintéticas apenas em memória dos testes; nenhuma senha real digitada/transmitida/alterada e nenhuma API chamada. Não comprovam DOM, navegador, política de senha servidor ou fluxo real de credenciais.

Arquivos: ChangePasswordForm.tsx/.module.css, teste novo, package.json, plano, roteiro e auditoria. Lint sem erros/oito avisos legados. Homologação integrada/visual permanece em CONS-04.6b/12.3. Sem dependência, banco/servidor iniciado, dados reais, alteração de processos, commit, push ou deploy; suíte Django não repetida por ausência de mudança de backend.

Revisão do diff identificou aria-disabled da nova tentativa incluindo sessionPending indevidamente, embora a ação funcionasse. Corrigido para refletir somente isSubmitting; teste ampliado confirma aria-disabled=false quando a nova tentativa está disponível. Quatro testes novamente aprovados. Builds finais repetidos após essa correção.

Encerramento executado: builds finais atualizado e padrão com prévia false aprovados; quatro testes de senha e lint descritos acima executados; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — associação e foco das validações de senha — 14/11/2026

Continuidade de CONS-04.6d/04.6b/12.3. ChangePasswordForm já apresentava mensagens locais, porém sem associação ao campo nem foco programado para correção. Reutilizados useId/refs existentes, acrescentando estado do campo inválido e refs para três inputs. Obrigatórios → primeiro vazio; confirmação divergente → confirmação; senha curta → nova senha. aria-invalid/aria-describedby ligam campo e mensagem. Ajuda persistente e minLength=8 refletem o mínimo já implementado, sem alteração de política servidor. Durante envio válido, indicação local anterior é limpa; erros genéricos de API continuam sem atribuição presumida a campo.

Três testes novos em scripts/change-password.test.mjs cobrem cada validação, associação a ID existente, foco programado e zero chamadas ao serviço. Sete testes totais aprovados; valores sintéticos somente no harness, sem API ou credencial real. Não são ensaios de DOM, validação nativa, leitor de tela ou navegador. Guia local Next use-client.md e contratos de conta existentes consultados. Nenhuma mudança de backend, payload, segurança da sessão, cálculo de pontos ou CSS neste recorte.

Arquivos: ChangePasswordForm.tsx, scripts/change-password.test.mjs e plano/roteiro/auditoria. CONS-04.6b/12.3 permanecem abertos para integração e homologação visual. Sem servidor/banco iniciado, dados reais, nova dependência, alteração de processos, commit, push ou deploy. Suíte Django não repetida por ausência de mudança no servidor.

Encerramento executado: sete testes de senha aprovados; lint sem erros/oito avisos legados; builds atualizado e padrão com prévia false aprovados; TypeScript aprovado após restauração de next-env ao caminho anterior. git diff --check e caminhos locais afetados conferidos.

## Consultoria — recuperação da leitura inicial da home do game — 20/11/2026

Recorte de CONS-04.6b. A home por rodadas usava o mesmo estado de erro para a leitura inicial e para ações em modais; uma falha inicial podia não oferecer recuperação e não havia proteção contra retorno após sair da tela. A leitura inicial agora possui estado próprio, nova tentativa com guarda síncrona e botão que permanece focável durante a consulta. Falha não é apresentada como ausência de jogos. Após sucesso da nova tentativa, o foco retorna ao título principal; cleanup do efeito descarta atualizações de sucesso, falha e finalização após desmontagem. O carregamento posterior às ações de jogar carta/enviar evidência não teve seu contrato alterado.

Adicionado `frontend/scripts/player-home-recovery.test.mjs` e comando `test:player-home-recovery`: quatro cenários aprovados com o componente real transpilado, hooks/serviços simulados — falha versus ausência legítima com bloqueio de repetição/foco, sucesso ou falha após saída, erro de cartas separado de ausência no modal e confirmação repetida de jogada com uma única chamada. O teste não exercita DOM, API, browser, autorização, envio de jogada/evidência ou homologação visual.

Arquivos de aplicação: `frontend/src/app/player/home/page.tsx` e `PlayerHomePage.module.css`; `frontend/package.json` recebeu apenas o comando do teste. Validações executadas: `npm run test:player-home-recovery` (quatro cenários aprovados), `npm run lint` (zero erros e oito avisos legados), `npx tsc --noEmit`, `npm run build` e `git diff --check`, todos aprovados. O build alterou temporariamente a referência gerada em `next-env.d.ts`, restaurada ao estado de desenvolvimento após a validação. Não houve alteração de backend, contratos, autorização, regra de pontuação, dados reais, dependências, commit, push ou deploy. CONS-04.6b e CONS-12.3 permanecem abertos para integração e homologação visual/autenticada.

## Consultoria — recuperação dos desafios-relâmpago — 20/11/2026

Continuidade de CONS-04.6b. A consulta inicial de desafios-relâmpago ocultava a área quando falhava e não descartava respostas depois da saída da participante. A leitura agora tem nova tentativa com guarda síncrona, mantém o botão focável enquanto carrega, devolve foco ao título após recuperar e ignora atualizações tardias após desmontagem. Recarregamento posterior ao envio continua usando o mesmo serviço e payload; não foram modificados ranking, pontuação, regras de participação, contratos ou autorização.

Validações executadas: `npm run build` e `npm run lint` (zero erros/oito avisos legados) aprovados. `npx tsc --noEmit`, executado após o build, encontrou falha preexistente em `.next/types/validator.ts` relacionada aos tipos de rotas gerados (`Route`/`LayoutRoutes`); o build do Next concluiu sua própria etapa de TypeScript sem erros. A referência de desenvolvimento em `next-env.d.ts` foi restaurada após o build. Não houve API, dados reais, dependência, commit, push ou deploy. CONS-04.6b e CONS-12.3 continuam abertos para testes de integração e homologação visual/autenticada.

## Consultoria — leitura segura da jornada diária — 20/11/2026

Continuidade de CONS-04.6b. A jornada diária já oferecia nova tentativa, mas consultas concorrentes do foco da janela/temporizador poderiam atualizar estado fora de ordem e retornos posteriores à saída não eram descartados. A leitura passou a ter geração de requisição, guarda para repetição manual e foco no título da jornada após recuperação. Ações de intenção/evidência, seus payloads, validações, pontos, histórico e download não foram alterados.

Validações executadas: `npm run lint` (zero erros/oito avisos legados), `npm run build` e `git diff --check` aprovados. O build concluiu a etapa TypeScript do Next sem erros; `next-env.d.ts` foi restaurado à referência de desenvolvimento depois da geração. Sem API, backend, dados reais, dependências, commit, push ou deploy. CONS-04.6b e CONS-12.3 permanecem abertos para integração e homologação visual/autenticada.

## Consultoria — recuperação de cartas no modal de jogada — 20/11/2026

Continuidade de CONS-04.6b. A falha ao consultar cartas no modal era apresentada junto da ausência legítima de cartas. O carregamento agora tem estado de erro próprio, nova tentativa sem fechar o modal e contador de requisição que descarta retorno após fechamento ou tentativa posterior. Não foram alterados seleção, regras de naipe, criação de jogada, evidências, pontos, API ou autorização.

Validações executadas: `npm run lint` (zero erros/oito avisos legados), `npm run build` e `git diff --check` aprovados; a etapa TypeScript interna do build concluiu sem erros. A referência de desenvolvimento em `next-env.d.ts` foi restaurada após a geração. CONS-04.6b e CONS-12.3 seguem abertos para teste de integração/homologação visual.

## Consultoria — bloqueio síncrono de jogada e evidência — 20/11/2026

Continuidade de CONS-04.6b. Os botões já eram desabilitados pelo estado React, mas um segundo clique antes do re-render ainda poderia iniciar envio duplicado. Adicionados guardas síncronos independentes para jogar carta e enviar evidência, também usados ao fechar cada modal. As rotas, payloads, validações do servidor, pontuação e tratamento de erro foram preservados.

Validações executadas: `npm run lint` (zero erros/oito avisos legados), `npm run build` e `git diff --check` aprovados; TypeScript interno do build sem erros. `next-env.d.ts` restaurado à referência de desenvolvimento após o build. Sem API, backend, dados reais, dependências, commit, push ou deploy.

## Consultoria — validações reproduzíveis sem navegador — 20/11/2026

O host de navegador não estava disponível para ampliar a homologação visual. Foram executados, sem iniciar aplicação nem alterar dados: `npm run test:consultoria-content`, `npm run check:contrast`, `npm run test:public-navigation`, `npm run test:player-home-recovery` e `git diff --check`, todos aprovados. A matriz de 16 pares sólidos passou; rosé/marfim e dourado/marfim permanecem restritos a uso decorativo. Esses resultados não substituem os ensaios de teclado, toque, foco real, DOM, aparelhos ou contraste sobre imagens previstos em CONS-04.4b/12.3.

O smoke local `npm run test:local-preview` também foi executado e aprovado. Ele é uma verificação automatizada do ambiente/documentação de prévia, não uma inspeção HTTP servida ou homologação visual.

Regressão adicional aprovada em 20/11/2026: `npm run test:pwa`, `npm run test:pwa-install`, `npm run test:legal-recovery`, `npm run test:support-recovery`, `npm run test:support-attachments` e `npm run test:change-password`. São harnesses de componente/worker e não substituem teste de instalação, navegador, dispositivo, leitor de tela, autorização ou API reais.

Também aprovados em 20/11/2026: `npm run test:community-feed`, `npm run test:performance-recovery`, `npm run test:ranking-recovery` e `npm run test:ui-utils`, além de `git diff --check`. Esses testes cobrem estados e respostas simuladas das telas; CONS-04.6b/12.3 continuam abertos para integração e homologação visual/autenticada.

Validação backend tentada em 20/11/2026: a configuração local continha `DEBUG=release`, valor inválido para o parser; usando apenas `DEBUG=false` no processo, `python manage.py check` passou sem problemas e `makemigrations --check --dry-run` não encontrou alterações. `python manage.py test apps.accounts` não iniciou porque o PostgreSQL local não estava acessível para criar o banco de teste (`django.db.utils.OperationalError`). Nenhum `.env`, dado ou configuração persistente foi alterado.

## Consultoria — triagem do material “Primeira etapa” — 20/11/2026

Lido `docs/consultoria/Primeira_etapa.md`, material fornecido pela consultoria. Ele reforça requisitos já previstos de apresentação das marcas, textos da home, depoimentos autorizados, separação Herbalife, revisão móvel/links/metadados e definição comercial posterior. Foram identificados e priorizados no backlog como CONS-P0.1 a CONS-P0.4: texto específico e identificação profissional proposta para a prévia; exclusão de Magaly Rica e tratamento de Bistrô Slim como Instagram comercial sem site/destino inventado; identificação de consultoria independente Herbalife e separação entre compra/distribuição; inventário das menções conflitantes sobre duração/inclusão do game. O material não confirma preço, duração, encontros, elegibilidade, checkout, Instagram/WhatsApp reais, ativos visuais ou autorização de publicação; esses bloqueios permanecem ativos.

Implementação da prioridade P0: a home condicionada à chave da consultoria recebeu hero, CTA, frase secundária e apresentação profissional conforme o material; a página Herbalife passou a explicitar consultoria independente e a diferença entre cadastro para compra e oportunidade de distribuição. Magaly Rica não aparece no código inspecionado; Bistrô Slim foi registrado somente como destino comercial pendente no painel de revisão, sem URL ou navegação criada. Criado `docs/consultoria/MENCOES_DURACAO_E_GAME.md` com o inventário revisável de duração/inclusão. Validações executadas: `npm run test:consultoria-content`, `npm run lint` (zero erros/oito avisos legados) e `npm run build`, aprovados. A geração do build alterou temporariamente `next-env.d.ts`, restaurado ao caminho de desenvolvimento. Não houve publicação, alteração de API, dados, dependências, commit, push ou deploy.

O inventário foi detalhado com os locais exatos da divergência: a home legada anunciava bônus de 21 dias, enquanto a página legada da mentoria descrevia três jogos de 21 dias; a apresentação condicionada à chave mantém duração como “A confirmar”.

## Consultoria — substituição de redação pública legada — 20/11/2026

Após autorização expressa do responsável, `/`, `/public/consultoria` e `/public/ultima-cartada` tiveram a redação legada atualizada para a primeira etapa. O hero público passa a usar o título, subtítulo, CTA e frase secundária fornecidos; foram removidas promessas de seis meses, bônus e jornadas de 21 dias, além dos trechos editoriais substituídos pela consultoria. A página da mentoria agora informa o direito de participantes da mentoria ao Game Cartada Viva, sem generalizá-lo para outras modalidades. Metadados e manifesto também deixaram de usar “jogo terapêutico”.

Não foram definidos nem publicados duração, preço, encontros, inscrição, checkout, WhatsApp/Instagram ou acesso independente ao game. Validações executadas: busca estática das expressões substituídas nas superfícies públicas, `npm run lint` (zero erros; oito avisos existentes de `<img>`), `npm run build` (TypeScript interno aprovado) e `git diff --check`. O build alterou temporariamente `frontend/next-env.d.ts`; o arquivo foi restaurado à referência de desenvolvimento. Não houve deploy, commit, push, dados reais, mudança de backend ou alteração de contrato.

## Consultoria — destinos públicos não confirmados — 20/11/2026

As rotas legadas ainda continham o WhatsApp e o Instagram genéricos/antigos, apesar de `CONS-01.4` manter esses destinos pendentes. A home e a página de consultoria agora levam para as condições informativas da mentoria; a página da mentoria direciona ao mesmo conteúdo quando não há checkout configurado. Um checkout Hotmart só é exibido se `NEXT_PUBLIC_HOTMART_CHECKOUT_URL` já contiver URL HTTPS autorizada. Não foi configurado contato, checkout ou rede social novos.

Validações executadas: `npm run lint` (zero erros; oito avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — otimização das imagens da home pública — 20/11/2026

As quatro fotografias da home legada foram migradas de `<img>` para `next/image`, com dimensões intrínsecas verificadas, `sizes` responsivos e prioridade somente na imagem principal. Os seletores existentes do CSS Module continuam aplicáveis ao elemento renderizado; fontes, arquivos, textos alternativos, conteúdo e rotas não mudaram. A revisão visual em navegador/aparelhos continua pendente.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes fora desta home), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — rota pública informativa do Game — 20/11/2026

`/public/cartada-viva` deixou de redirecionar para a mentoria e passou a apresentar a página informativa já implementada para o Game Cartada Viva. A rota mantém o vínculo explícito com a mentoria, não disponibiliza compra/acesso independente e preserva `/login` somente para participantes. Metadados próprios do game passaram a ser usados também no modo público padrão. O redirecionamento de `/public/consultoria` não foi alterado neste recorte.

O verificador `scripts/check_consultoria_routes.py` foi atualizado para exigir a resposta 200 da rota do game, um único H1, texto de inclusão e ausência de destino legado/prévia. Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno), `git diff --check` e `python3 scripts/check_consultoria_routes.py --mode legacy --base-url http://127.0.0.1:3002` (25 respostas e contratos aprovados). O servidor Next foi iniciado localmente apenas para essa verificação. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — redirecionamento da rota de consultoria — 20/11/2026

`/public/consultoria` passou a redirecionar permanentemente para `/public/ultima-cartada` também no modo público padrão. A URL antiga foi preservada para links existentes, enquanto a mentoria tornou-se a apresentação única da oferta principal. A página informativa do Game permanece em `/public/cartada-viva`; não houve mudança em login, acesso ao game, checkout ou condições comerciais.

O roteiro de smoke foi atualizado para exigir esse redirecionamento no modo padrão. Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno), `git diff --check` e `python3 scripts/check_consultoria_routes.py --mode legacy --base-url http://127.0.0.1:3003` (25 respostas e contratos aprovados). O servidor Next foi iniciado localmente apenas para essa verificação. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — remoção de apresentação legada inacessível — 20/11/2026

Após consolidar o redirecionamento de `/public/consultoria`, o arquivo da rota foi reduzido ao `permanentRedirect` para a mentoria. A rota, o status HTTP e o destino foram preservados; foram removidos somente componentes, textos e imports que já não podiam ser exibidos. Isso evita manter uma segunda apresentação editorial desatualizada no código.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — âncoras da mentoria pública — 20/11/2026

A navegação e o CTA “Conhecer a mentoria” em `/public/ultima-cartada` ainda apontavam para `#mentoria`, ID removido quando a seção foi consolidada em `#condicoes`. Ambos passaram a usar o destino existente. O smoke público padrão agora confere todas as âncoras da página da mentoria contra IDs presentes no HTML.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno), `git diff --check` e `python3 scripts/check_consultoria_routes.py --mode legacy --base-url http://127.0.0.1:3004` (25 respostas e contratos aprovados). O servidor Next foi iniciado localmente apenas para essa verificação. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — cobertura de âncoras públicas no smoke — 20/11/2026

O roteiro de smoke passou a validar âncoras internas da home, mentoria, Game e página comercial Herbalife no modo público padrão. A regra compara cada fragmento local aos IDs presentes no HTML da própria página e interrompe a validação se houver destino ausente. A execução atual confirmou os quatro conjuntos de âncoras, além dos contratos existentes de status, rotas autenticadas e PWA.

Validações executadas: `python3 scripts/check_consultoria_routes.py --mode legacy --base-url http://127.0.0.1:3004` (25 respostas e contratos aprovados) e `git diff --check`. O servidor Next já iniciado localmente foi usado apenas para essa verificação. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — inclusão do Game na home pública — 20/11/2026

O card do Cartada Viva na home pública passou a informar que quem participa da Mentoria A Última Cartada tem direito de participar do Game. A redação preserva a natureza educacional da experiência e não acrescenta duração, preço, checkout, modalidade independente ou direito de acesso além do confirmado.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — identidades da mentoria e do Game — 20/11/2026

A página pública da mentoria passou a identificar a oferta como “A Última Cartada — Mentoria” e a experiência complementar como “Cartada Viva — Game” em título, cabeçalho, legendas, seção do game e FAQ. “Metodologia” permanece somente como explicação da abordagem vinculada à mentoria, sem ser apresentada como produto autônomo. Símbolos, regras de acesso, condições comerciais e conteúdo de jogo não foram alterados.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — sincronização do mapa público na documentação — 20/11/2026

Atualizados `docs/CONSULTORIA_NAVEGACAO.md`, `PROJECT_CONTEXT.md`, `IMPLEMENTATION_PLAN.md`, `README.md` e `frontend/.env.example` para registrar o estado atual: game público informativo, consultoria redirecionada à mentoria e chave de apresentação ainda limitada às superfícies condicionadas. A documentação não declara aprovação visual, publicação ou confirmação de condições comerciais.

Validação executada: `git diff --check` e conferência dos caminhos locais referidos. Não houve mudança de código executável, deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — navegação direta para a mentoria — 20/11/2026

Os links remanescentes da home pública que ainda usavam a denominação “Consultoria” passaram a apontar diretamente para `/public/ultima-cartada`, com o rótulo “A Última Cartada”. A alteração evita navegação por redirecionamento e reforça a hierarquia de marca definida pela primeira etapa. Não foram modificados login, condições comerciais, contatos ou rotas autenticadas.

Validações executadas: `npm run lint` (zero erros; quatro avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — revisão de linguagem e separação comercial na home — 20/11/2026

A home pública legada ainda continha expressões de culpabilização, “sabotagem”, emagrecimento e resultado permanente. Elas foram substituídas por linguagem de contexto, escolhas possíveis, aprendizado e continuidade, coerente com a primeira etapa. A chamada da Herbalife passou a identificá-la como atividade comercial separada, sem sugerir compra ou uso de produto como parte exigida da mentoria ou do game.

Validações executadas: busca estática nas superfícies públicas revisadas, `npm run lint` (zero erros; oito avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — apresentação profissional na mentoria pública — 20/11/2026

A seção de apresentação em `/public/ultima-cartada` passou a usar o texto fornecido em `docs/consultoria/Primeira_etapa.md`: formação original em Fisioterapia, trajetória profissional, aprofundamento em Psicologia, propósito e identificação “Magaly Abreu · Psicóloga · CRP 17/5894”. A fotografia profissional existente foi preservada. Não foram acrescentados títulos, especialidades, contatos ou condições comerciais além do material fornecido.

Validações executadas: `npm run lint` (zero erros; oito avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — contato comercial Herbalife condicionado — 20/11/2026

A página pública legada da Herbalife deixava o número comercial antigo fixado no código. Ela passou a reutilizar `getHerbalifeContact`, que só constrói link de WhatsApp quando `CONSULTORIA_HERBALIFE_WHATSAPP_NUMBER` estiver configurado com número válido e confirmado. Sem esse valor, os CTAs permanecem no passo a passo e nas dúvidas da própria página. A URL oficial da Herbalife e o link de cadastro HTTPS configurável foram preservados; compra, distribuição e mentoria continuam separados.

Validações executadas: `npm run lint` (zero erros; oito avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.

## Consultoria — suspensão preventiva de depoimentos públicos — 20/11/2026

Em atenção à primeira etapa da consultoria e enquanto `CONS-01.7` permanece pendente, os dois vídeos de depoimentos foram removidos da home pública legada, assim como o item de navegação correspondente. Os arquivos e o componente foram preservados no repositório; nenhum relato foi apagado, alterado ou atribuído a Magaly. A eventual reativação exige conferência de identidade, vínculo e autorização de divulgação.

Validações executadas: `npm run lint` (zero erros; oito avisos existentes), `npm run build` (incluindo TypeScript interno) e `git diff --check`. `frontend/next-env.d.ts` foi restaurado após o build. Não houve deploy, mensagens externas, backend, dados, dependências, commit ou push.
