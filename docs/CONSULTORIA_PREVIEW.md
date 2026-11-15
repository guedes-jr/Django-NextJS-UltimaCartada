# Prévia da nova apresentação Magaly Abreu

Primeiro recorte implementado em 13/11/2026. Requisitos e status no [plano ativo](../IMPLEMENTATION_PLAN.md); padrão em [DESIGN.md](../DESIGN.md). Esta é uma proposta navegável em desenvolvimento, ainda sem homologação visual da consultoria.

## Abrir localmente

Com as dependências frontend já instaladas e o Django de desenvolvimento disponível em `127.0.0.1:8000`:

```bash
cd frontend
npm run dev:consultoria
```

Abra `http://127.0.0.1:3001`. Esse comando ativa a apresentação atualizada e as prévias somente nessa instância, usa `.next-consultoria-preview` para coexistir com o desenvolvimento comum e encaminha `/api/v1` ao Django local. Não edita `.env.local`, CORS ou dados. Se a porta 3001 estiver ocupada, confira o processo antes de iniciar outra instância.

Os caminhos de revisão são:

- `/preview/consultoria`: home da marca Magaly Abreu.
- `/preview/consultoria/mentoria`: Mentoria A Última Cartada.
- `/preview/consultoria/game`: Game Cartada Viva.
- `/preview/consultoria/herbalife`: atividade comercial apresentada separadamente.
- `/preview/consultoria/guia-visual`: paleta, fontes, componentes, provas de aplicação e fundos de criativos (rascunhos).
- `/preview/consultoria/revisao`: roteiro de aprovação, links das propostas e dados a confirmar.

No comando acima, as URLs definitivas também mostram a proposta. No desenvolvimento comum (`npm run dev`) e no build sem ativação explícita, as páginas existentes são preservadas. A ativação pública depende de aprovação.

O encaminhamento é opt-in (`CONSULTORIA_LOCAL_API_PROXY=true`) e funciona apenas em desenvolvimento, com destino fixo em loopback. Produção mantém o encaminhamento do Nginx. O comando define `NEXT_PUBLIC_API_URL=/api/v1` para evitar a falha CORS de uma prévia em porta diferente. Requisições continuam sujeitas à autorização Django. Em 14/11/2026, a API local retornou lista vazia de documentos jurídicos: Termos e Privacidade exibiram “Documento em preparação”. Não publicar minutas nem executar seeds/migrations apenas para visualizar essas páginas.

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
- `ENABLE_CONSULTORIA_PREVIEW`: desenvolvimento permite a prévia. Builds de produção só a disponibilizam com o valor exato `true`; por padrão todas as páginas de prévia respondem 404. Use apenas em homologação apropriada, mediante decisão do responsável; mudar exige rebuild. Essa chave e `noindex` não são autenticação nem devem proteger dados confidenciais.
- `CONSULTORIA_HERBALIFE_WHATSAPP_NUMBER`: contato comercial confirmado da Herbalife. Não herda automaticamente o número da mentoria; vazio não ativa link comercial. O endereço de inscrição continua usando a variável existente `NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL`, validada como HTTPS sem credenciais; configurar somente após confirmação do destino pela responsável.
- `CONSULTORIA_WHATSAPP_NUMBER`: número oficial confirmado, somente dígitos com código de país. Sem número válido não há link externo de contato; a prévia informa que o canal aguarda confirmação. Com o valor configurado, o link abre a conversa com texto da mentoria ou do game, sem enviar mensagem automaticamente. Não copiar números da versão antiga sem confirmar.

Não habilitar a prévia na produção pública nem substituir as páginas atuais sem a aprovação prevista no briefing e autorização expressa de publicação. Os metadados usam `noindex, nofollow`; não houve publicação nesta entrega.

## Dados provisórios autorizados

O responsável autorizou prosseguir com dados padrão provisórios e pediu nova pergunta no final. O painel “Dados provisórios para revisão final” apresenta os campos como “A confirmar”, centralizados em `consultoriaPendingDetails` no arquivo `content.ts`. Não há duração, telefone, perfil ou registro profissional fictícios; WhatsApp sem valor confirmado permanece sem link externo. Perguntar novamente em CONS-12.8 e substituir os placeholders antes da publicação. A ausência desses dados não interrompe o desenvolvimento visual.

## O que revisar

1. Hierarquia: Magaly como marca principal, mentoria principal e game incluído.
2. Leitura da primeira tela e navegação entre as três experiências.
3. Paleta, fontes, imagens, espaçamento, FAQ, botões e rodapé.
4. Layout em 320/375/390/768/1024/1440 px, zoom 200%, teclado, foco, menu, Esc e links de contato.
5. Fotografias, arquivos oficiais de marca e aplicações claras/escuras. A identificação textual de Magaly é provisória e não substitui a assinatura original.
6. Formato/duração da mentoria, duração e condições do game, identificação profissional completa, WhatsApp e Instagram.

A inclusão no sistema foi implementada em 13/11/2026: mentoria vigente acrescenta GAME aos produtos efetivos, sem criar concessão ou matrícula automática. Login/sessão e API diária foram testados; CONS-09.6 foi conferido tecnicamente no Chrome com contas sintéticas em 14/11/2026; homologação integral e aprovação continuam pendentes (evidências nas seções posteriores). O dashboard usa a sessão atualizada pelo servidor, e a home distingue acesso de vínculo com grupo/jornada. Não houve deploy ou regularização de dados no banco real.

## Verificação inicial — histórico de 13/11/2026

Lint, TypeScript e build executados; lint com oito avisos preexistentes de imagens em arquivos antigos. Verificadas respostas HTTP das três prévias em desenvolvimento (200), bloqueio no build de produção padrão (404), home atual (200) e redirecionamento legado do game (308). Inspeção do HTML confirmou H1 único, noindex/nofollow, âncoras existentes e alternativas de imagens. Contrastes de pares sólidos medidos e registrados em DESIGN.md.

Na tentativa inicial, a conferência visual/interativa não foi executada: o navegador integrado retornou “The browser access host is unavailable”. Não houve verificação em aparelhos físicos, teste de interação do menu, medição de desempenho real ou aceite de tela. Esses itens permanecem abertos no plano.

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

## Novas referências para revisão

O guia e os fundos estão descritos em [CONSULTORIA_CRIATIVOS.md](CONSULTORIA_CRIATIVOS.md). Para conferir as cinco prévias e os fundos no servidor de desenvolvimento, execute da raiz:

```bash
python3 scripts/check_consultoria_routes.py --mode preview --base-url http://127.0.0.1:3000
```

A nova página Herbalife também está integrada a `/public/herbilife` quando `ENABLE_CONSULTORIA_SITE=true`; com a chave desligada a página anterior permanece. O login e os nomes nas áreas autenticadas foram alinhados às experiências, sem alterar os contratos de autenticação e produtos.

## Tema das áreas de acesso

A mesma chave `ENABLE_CONSULTORIA_SITE` aplica agora cores/fontes da revisão ao login, à estrutura de participantes, aos cards do dashboard e à estrutura/conteúdos da mentoria. A implementação fica em `ConsultoriaAccessTheme.tsx`/CSS Module, envolvida pelos layouts de `/login`, `/dashboard`, `/player/*` e `/mentorship`. Com a chave desligada o wrapper retorna os filhos sem aplicar tema. Não envolve `/admin/*` nem altera autorização.

A seção “Áreas de acesso” do guia visual mostra provas de composição com campos desabilitados e links para propostas. Não faz login, não cria conta e não exibe dados privados. O dashboard real prioriza o card da mentoria e indica o game incluído, mantendo o filtro por produtos da sessão.

A migração é parcial: tabelas, gráficos, cartas e demais componentes legados não foram integralmente revisados. Interação autenticada, modais, zoom e aparelhos reais continuam na homologação. O teste HTTP confirma somente presença/ausência do escopo de tema no HTML do login e das rotas protegidas; não comprova autenticação, estados de dados ou estilo computado no navegador.

## Condições provisórias nas páginas

Mentoria e game apresentam quadro de condições com os dados autorizados como “A confirmar”. `consultoriaOfferDetails`, em `content.ts`, centraliza duração, formato, encontros e materiais/suporte. O painel de revisão e a FAQ de duração usam a mesma fonte. Não há valores comerciais preenchidos por suposição. Confirmar e substituir na revisão final, conforme CONS-12.8; a inclusão do game permanece explícita.

## Conferir diálogos, foco e rolagem

Abra `/preview/consultoria/guia-visual#dialogos`. A demonstração usa o Modal compartilhado da aplicação e não realiza chamadas à API.

1. Abra o diálogo por teclado e confira a entrada do foco; navegue com Tab/Shift+Tab sem alcançar o fundo.
2. Feche com Escape e confira o retorno ao acionador. Repita com o botão de fechar.
3. Marque o bloqueio de fechamento e confira que Escape, fundo e botão não fecham; desmarque antes de encerrar. É uma demonstração local, sem envio real.
4. Abra o segundo diálogo. Ao fechá-lo, confira o foco no primeiro e o bloqueio de rolagem do fundo até encerrar o último.
5. Confira conteúdo longo, rolagem interna, close visível, iPhone/Safari, Android/Chrome e zoom 200%. A variante da mentoria permite fechar pelo fundo; os modais existentes mantêm isso desativado por padrão.
6. No portal da mentoria, após autenticação autorizada, confira feedback de download/conclusão e bloqueio de ações repetidas. Erros devem manter conteúdo e permitir tentar novamente.

`npm run test:ui-utils`, em frontend, executa cinco testes do coordenador de bloqueio de rolagem (sobreposição, cleanup idempotente e restauração). Esses testes não executam navegador e não comprovam foco, Escape ou layout. Sem dependências novas; usa Node e TypeScript já disponíveis no projeto.

O componente usa `<dialog>` e `showModal()`, com fechamento passando pelo callback existente, sem forçar o fechamento de formulários ocupados. Referência técnica: [HTML Standard — dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). O navegador integrado continua indisponível; o checklist interativo permanece aberto.

### Offline e instalação

A chave de apresentação também seleciona o worker e a página offline: `/sw.js?presentation=consultoria` e `/offline-consultoria.html` na versão nova; `/sw.js` e `/offline.html` no legado. Apenas um HTML genérico é armazenado. A prova estática pode ser aberta pelo guia visual; usa fontes de sistema quando as fontes da marca não estão disponíveis. Instalação, atualização e recuperação de rede em aparelhos reais continuam pendentes. O smoke HTTP ampliado confere 19 respostas em cada modo de produção e sete na prévia.

### Suporte da participante

Com a apresentação nova ativada, `/player/support` recebe o tema vinho/marfim, tipografia e estados de seleção coerentes. O formulário usa o Modal compartilhado em ambas as apresentações; envio em andamento bloqueia fechamento e repetição. Para homologação com conta de teste: abrir/fechar com teclado, provocar erro de anexo, conferir preservação dos campos, criar chamado, responder com/sem arquivo e baixar anexo. Conferir histórico vazio, mensagens longas, status encerrado e tela estreita. Não usar dados pessoais reais na homologação. A sessão e os endpoints existentes foram preservados.

### Configurações da participante

`/player/settings` acompanha o tema quando a chave está ativa. Na homologação com conta descartável, conferir alteração com senha atual inválida, confirmação divergente, campos vazios e sucesso; validar gerenciador de senhas, teclado, foco e tela estreita. Durante envio os campos e botão ficam bloqueados. Conferir também o tour existente e o formulário compartilhado em `/admin/settings`, cuja paleta continua legada. Não registrar senhas em evidências. Fluxo de serviço/sessão e destino após sucesso preservados.

### Desempenho e ranking

Com a chave ativa, `/player/performance` e `/player/ranking` usam a paleta e tipografia novas; os números e a ordem recebidos pelos serviços permanecem intactos. Na homologação autenticada, conferir estados vazio/carregando/erro, histórico com títulos longos, todos os status de evidência e navegação por teclado até a região de tabela (rolagem horizontal local). Conferir troca rápida de jogo, ranking indisponível/403, participante fora da lista e destaque “você”. Uma falha de ranking deve apresentar “—” nos resumos, sem simular pontuação zero. Validar 320/375/768/1440 px e zoom 200%, inclusive pódio móvel e nomes/pontos longos. Não foram usados dados pessoais reais para essa entrega.

### Comunidade

`/player/community` acompanha o tema da consultoria sob a chave ativa. Conferir com contas de teste: grupo vazio, feed vazio/carregando/erro, seleção de grupo/jogo, publicação com texto/mídia/evidência aprovada, consentimento de compartilhamento, reação, comentários e exclusão própria. Verificar nome longo, comentário longo, vídeo/imagem, botões com teclado e comentários expandidos; testar 320/375/768/1440 px e zoom 200%. Usar somente dados de teste. Tema implementado não equivale a homologação das operações; regras de grupo e endpoints não foram alterados.

### Home do game e jornada diária

A home por rodadas e PlayerDailyJourney acompanham o tema com a chave ativa. Conferir jogos ausentes, seleção de jogo, rodada aberta/fechada, cartas carregando/vazias, seleção da carta por teclado e confirmação. Durante confirmação/envio, conferir bloqueio de fechamento e campos; erro deve manter o conteúdo para correção. Validar evidência com imagem/vídeo, prazo disponível/expirado, histórico e status. Na jornada diária, conferir etapas, dia atual, intenção, evidência, progresso por pilar e histórico, com textos longos e zoom 200%. Usar conta e mídias descartáveis de teste. Desafios e tour possuem migração técnica, com homologação específica ainda pendente. Nenhuma duração técnica deve ser usada como confirmação comercial.

### Desafios e tour

Validar o diálogo de participação com texto/arquivo conforme o tipo real, erro dentro do diálogo, campos preservados em falha e bloqueio durante envio. Após participação salva, falha ao recarregar a lista deve ser identificada como atualização, sem convidar a reenviar. No tour, conferir quatro passos, voltar, pular/concluir, fechamento temporário sem marcar conclusão, falha de salvamento e reabertura por Configurações. Testar Tab/Escape, retorno de foco, rolagem, movimento reduzido, 320 px e zoom. Usar contas descartáveis; esta entrega não executou operações autenticadas.

Mapa técnico de rotas, botões e fragmentos: [CONSULTORIA_NAVEGACAO.md](CONSULTORIA_NAVEGACAO.md). Smoke ampliado: 24 respostas em cada modo de produção e 11 na prévia, com validação de destinos internos e fragmentos entre páginas. Essas contagens substituem as contagens anteriores para a versão atual do script.

### Termos e Privacidade

As duas rotas acompanham marca/tema com a chave ativa; no padrão mantêm a apresentação anterior. O texto jurídico e sua versão continuam vindo de getCurrentLegalDocuments, sem edição ou publicação por esta implementação. Homologar documento publicado, ausência, falha de rede, leitura longa, zoom e links legais; confirmar corpo/versão com o responsável. O smoke cobre HTML inicial/marca/tema, sem consultar a API no navegador nem comprovar o conteúdo carregado.

### Documentos pendentes depois do login

LegalAcceptanceGate acompanha o tema nas áreas migradas. Homologar com conta descartável: consulta pendente/carregando, falha de consulta e “Tentar novamente”, nenhum documento pendente, documentos obrigatórios com títulos longos, abertura para leitura em nova aba e erro ao registrar. A seleção começa desmarcada; nenhum aceite é automático. Durante gravação a seleção e o botão ficam bloqueados. A decisão de aceitar deve ser tomada pela pessoa responsável pela conta. Este recorte não executou aceites nem testes autenticados.

Inventário de imagens/fontes, ajuste de sizes e medição do otimizador: [CONSULTORIA_PERFORMANCE.md](CONSULTORIA_PERFORMANCE.md). Não substitui conferência de nitidez, recorte ou Core Web Vitals em aparelhos.

### Preenchimento dos dados finais

`frontend/.env.example` lista campos vazios para duração da mentoria/game, formato, encontros, materiais/suporte, identificação profissional e usuário do Instagram. Preencher somente com texto aprovado pela titular no ambiente apropriado; exige novo build. As variáveis são lidas pelo servidor, mas seus valores são conteúdo público renderizado: não inserir segredos.

`content.ts` mantém condições/FAQ/painel sincronizados. Ausência de fatos conserva “A confirmar”; ausência de identificação/Instagram omite esses elementos do rodapé. Instagram aceita somente usuário com ou sem @ e gera link no domínio fixo instagram.com; não recebe URL arbitrária. Identificação é texto literal escapado pelo React, sem HTML, sem inferência de registro ou título. WhatsApp da mentoria e Herbalife continuam separados.

`npm run test:consultoria-content` verifica oito cenários de configuração/validação sem rede ou destino real. Configuração válida sintaticamente não confirma titularidade, dados profissionais ou aprovação editorial. Testar destinos e revisar informações antes da publicação. O smoke HTTP atual presume fatos provisórios; quando os dados forem confirmados, atualizar seus critérios editoriais para os valores aprovados.

Ilustração do game atualizada: `/consultoria/player-journey.svg`, sem prazos/quantidade de jornadas não confirmados. O smoke atual consulta 25 respostas no modo updated, 24 no legacy e 12 na prévia. A ilustração ainda precisa de conferência visual; não é screenshot de uma participante.

### Conferência visual inicial disponível — 13/11/2026

A inspeção passou a funcionar pela interface nativa do Chrome, em janela anônima, embora o browser integrado continue indisponível. Conferidas primeiras telas: home desktop/375 px, mentoria 375 px e game 375/320 px. Menu público e demonstração de diálogos foram exercitados por teclado em 375 px; tema incompleto do modal do guia foi corrigido e reconferido. São amostras em emulação, sem aprovação da consultoria ou teste integral/mobile real. Evidência e limites exatos em PROJECT_AUDIT.md.

### Continuidade da revisão móvel — 14/11/2026

Antes de emular dimensões, restaurar zoom da página em 100% na janela de teste; uma escala herdada afetou as primeiras observações. Reconferidos cartões/FAQ/rodapé da home, processo/condições da mentoria e ilustração/FAQ do game em 375 px; hero do game em 320 px com zoom normal. São amostras, sem substituir revisão integral, zoom 200% ou aparelho real.

A ilustração do game agora tem “Ampliar ilustração (nova aba)”; abertura verificada no Chrome nativo, sem dados de participantes. Smoke da prévia: 12 respostas e 110 ocorrências de links/fragmentos aprovadas.

### Comercial, offline e consulta legal — 14/11/2026

Herbalife conferida em 768 px (hero, orientações, FAQ e contato separado); arquivo offline conferido em 768/320 px. O botão offline recarrega a prova estática; funcionamento instalado/sem rede ainda precisa de teste próprio. Termos e Privacidade receberam títulos de aba específicos na versão nova e botão de tentar novamente após falha. Recuperação e navegação entre documentos testadas por teclado em 320 px, com consulta ainda falhando no ambiente local. Leitura do documento publicado, ausência de documento e integração completa continuam pendentes. Nenhum conteúdo jurídico foi alterado ou aceito.

### Integração local da consulta legal corrigida — 14/11/2026

A falha acima foi diagnosticada: o Django respondia 200, mas não autorizava a origem da porta 3001 por CORS. O comando `dev:consultoria` usa o encaminhamento local descrito no início deste roteiro. A consulta pública passou a retornar 200/lista vazia; a consulta de pendências sem sessão retornou 401. No Chrome nativo, Termos e Privacidade exibiram “Documento em preparação”, coerente com a ausência de documentos publicados. Isso valida o estado vazio integrado; documento publicado, fluxo autenticado e aceite continuam pendentes. Backend, CORS e banco não foram alterados.

### Solicitação de instalação do aplicativo — 14/11/2026

O botão só aparece quando o navegador oferece instalação. Enquanto aguarda, informa “Aguardando o navegador…” e bloqueia repetição sem remover o foco do botão. Falhas ao abrir ou aguardar a escolha exibem aviso acessível, com opção de fechar; o evento já utilizado não é reaproveitado. A pessoa pode continuar no site e consultar a instalação pelo menu do navegador. Escolher não instalar não gera erro. Safari/iPhone pode não oferecer esse evento: não há promessa de botão disponível em todos os aparelhos.

`npm run test:pwa-install` exercita o componente com hooks e eventos simulados, sem abrir ou aceitar instalação. Homologar instalação nativa, aparência/foco do aviso, atualização e offline em aparelhos reais conforme CONS-11.3b.

### Revisão editorial e ajuda pública — 14/11/2026

Leitura técnica das propostas registrada em [CONSULTORIA_REVISAO_EDITORIAL.md](CONSULTORIA_REVISAO_EDITORIAL.md), com escopo, resultado e dependências para aprovação. A ajuda do login agora leva à seção pública `/#contato`, evitando encaminhar visitantes sem sessão ao suporte restrito. Sem contato confirmado, a proposta continua indicando a pendência. Metadados do game informam que o percurso depende da jornada do grupo, sem presumir modo diário para todas as participantes.

O smoke verifica ajuda/âncora nas duas apresentações e ressalva em description/Open Graph/Twitter no modo updated. O modo preview agora consulta também `/` para verificar a âncora da ajuda: 13 respostas, substituindo a contagem anterior de 12; links das propostas continuam conferidos separadamente.

### Teclado na entrada e área de participantes — 14/11/2026

Login com campos vazios agora leva foco à mensagem de validação, inclusive ao repetir o envio; conferido no Chrome nativo, sem credenciais. Tab a partir da mensagem alcançou “Entrar”; Enter repetiu a validação e devolveu foco ao aviso.

PlayerLayout recebeu “Pular para o conteúdo”, disponível ao foco, com destino no main focável programaticamente e cores do tema com fallback legado. O painel de conversa do suporte usa seção nomeada, evitando um segundo main dentro do layout. Conferir em conta de teste a ordem de Tab, ativação do atalho, menu aberto, cabeçalho fixo, zoom e larguras móveis; não houve sessão autenticada neste recorte.

### Validação do acesso no backend — 14/11/2026

`python manage.py check` e `python manage.py makemigrations --check --dry-run` passaram; suíte completa `python manage.py test --noinput` aprovou 111 testes em PostgreSQL descartável, com mídias isoladas. Inclusão do game na mentoria, validade/revogação, login/sessão e isolamento estão cobertos pela suíte. CONS-12.2 concluído com evidência em PROJECT_AUDIT.md; isso não conclui a homologação autenticada no navegador (CONS-09.6).

Para repetir, use o ambiente Python existente e os comandos de backend de AGENTS.md, com banco PostgreSQL de teste e permissão de criação confirmados. Nesta execução, DB_HOST apontou exclusivamente para socket Unix de cluster temporário e MEDIA_ROOT/PRIVATE_MEDIA_ROOT foram sobrescritos em settings temporário. Não reapontar esses testes ao banco real, executar seed_demo ou aplicar migrate no ambiente da aplicação para reproduzir esta evidência.

### Conferência autenticada inicial — 14/11/2026

Chrome nativo com duas contas sintéticas e PostgreSQL/API isolados: conta com apenas MENTORSHIP entrou no dashboard com ambas as experiências; abriu portal da mentoria e game sem nova compra. Sem grupo/jornada, a orientação de vínculo e suporte apareceu corretamente. Conferidos game em 375 × 812, menu/Escape e atalho para conteúdo por Tab/Enter. Conta sem produtos mostrou o estado correspondente e voltou ao dashboard ao tentar abrir o game. Ambas saíram pelo botão Sair.

A prova usou API temporária em 127.0.0.1:8001 e frontend configurado por processo para esse destino; o comando padrão dev:consultoria continua apontando ao Django existente em 8000. Banco descartável separado recebeu migrations e somente dados sintéticos; sem seed_demo, aceite de documentos, compra ou dados reais. Servidores e janela de teste encerrados. Isso avança CONS-09.6, mas não valida jornada vinculada, aulas, envios, Safari/aparelhos reais ou aprovação da consultoria.

### Jornada e conteúdo vinculados conferidos — 14/11/2026

Continuidade no mesmo banco descartável: turma/jornada diária, cartada textual e dois conteúdos de mentoria sintéticos. No Chrome, abertura do diálogo, conclusão dos conteúdos e progresso até 100% funcionaram. Registradas intenção e evidência textuais sem dados pessoais; histórico mostrou ambas e 40 pontos da regra existente, persistidos após navegar/recarregar. Consulta SQL confirmou uma participação e duas conclusões. Não foram criados direitos GAME adicionais.

Corrigida perda de foco ao concluir conteúdo: o botão usa aria-disabled e a guarda existente, permanecendo focado durante/após a gravação; Escape retorna ao acionador. Diálogo conferido em 320 × 812 e cartada concluída em 375 × 812, com zoom normalizado. Não houve teste de vídeo externo ou download/upload de arquivo.

CONS-09.6 encerra o recorte técnico local com as evidências acima e a prova anterior sem grupo/sem produto. A revisão integral em aparelhos, conteúdo real e aprovação da consultoria continuam pendentes. Este ensaio não aprova a estrutura editorial sintética ou os prazos técnicos como oferta comercial. Ambiente temporário encerrado.

### Recuperação da leitura do suporte — 14/11/2026

Falha ao buscar chamados agora mostra “Histórico indisponível” e “Tentar novamente”; não apresenta a ausência de chamados como resultado de uma consulta que falhou. O botão permanece focável durante a tentativa, com bloqueio de repetição. Recuperação bem-sucedida leva o foco ao título Histórico e mantém os dados dos formulários. Respostas de uma tela já desmontada são ignoradas.

`npm run test:support-recovery`: quatro testes do componente com hooks/serviço simulados, cobrindo erro/vazio, repetição, rascunho, foco programado e resposta tardia. No Chrome, falha 503 introduzida somente na API descartável confirmou erro, repetição e recuperação por Enter com foco no título. Conferida aparência em 375 × 812. Não foram abertos chamados, enviadas respostas ou anexos; esses fluxos continuam no roteiro de homologação integral.

### Medição móvel em laboratório — 14/11/2026

Lighthouse executado pelo DevTools nativo sobre build de produção local: home, mentoria e game tiveram desempenho 96, acessibilidade automatizada 100 e CLS zero nas amostras. Método, demais métricas, limitações e experimento revertido em [CONSULTORIA_PERFORMANCE.md](CONSULTORIA_PERFORMANCE.md). Resumo de configuração/métricas preservado em JSON no repositório; relatórios brutos exportados para /private/tmp. Não são medições do site público nem de aparelhos físicos; CONS-12.5 permanece aberto.

### Anexos de suporte antes do envio — 14/11/2026

Criação e resposta da participante agora conferem tamanho/extensão do anexo antes de chamar o serviço. Limites espelhados do serializer existente: até 10 × 1024 × 1024 bytes, JPG/JPEG/PNG/WEBP/PDF/TXT/DOC/DOCX, sem diferenciar maiúsculas. A interface informa os formatos e permite remover o arquivo sem perder o texto. Campos inválidos são identificados e relacionados à mensagem; a remoção devolve foco ao seletor.

`npm run test:support-attachments` verifica limites e alinhamento com o serializer; `npm run test:support-recovery` inclui bloqueio de criação/resposta antes do serviço e preservação do assunto. São cinco e seis testes, respectivamente. No Chrome, seleção de arquivo sintético acima do limite exibiu erro; remoção limpou seletor/aviso e preservou assunto/descrição. Nenhum arquivo ou chamado foi enviado. A validação real do conteúdo do arquivo continua no servidor; não se presume segurança por extensão. Upload válido, anexos de resposta, leitor de tela e aparelho real ainda precisam de homologação integral.

### Zoom e redimensionamento da navegação pública — 14/11/2026

Build atualizado de produção servido localmente em 127.0.0.1:3002, janela anônima do Chrome. Com zoom do navegador confirmado em 200%, menu da home abriu e permitiu Tab/Enter até a mentoria; CTA levou à seção de condições, com título e primeiros campos legíveis. Introdução e primeiro passo do funcionamento do game também conferidos nesse zoom. São amostras, não inspeção integral das páginas.

Emulação responsiva com zoom normalizado a 100%: cabeçalho/hero da home em 1024 e 1440 px, retorno a 390 × 812 e abertura do menu com os quatro links visíveis. Ao iniciar a emulação, um zoom herdado causou aparente corte; focar a página e redefinir o zoom eliminou o efeito. Nenhuma alteração de CSS necessária. Abertura visual em emulação não comprova toque ou navegação por teclado em aparelho real.

CONS-04.4b/12.3 continuam abertos: ampliar cobertura para telas autenticadas, 768 px/orientação, conteúdo longo, Safari e aparelhos físicos. Servidor e janela temporários encerrados, preservando os processos existentes.

### Regressão automatizada da navegação pública — 14/11/2026

Executar em frontend: `npm run test:public-navigation`. Seis testes transpilam o componente real e simulam hooks, pathname e eventos do documento: associação aria-controls, alternância sem listeners duplicados, Escape restrito ao menu com retorno de foco, saída por foco/ponteiro sem roubar foco, ativação de links/descendentes, mudança de rota e desmontagem. Não executam DOM, CSS, resize ou toque.

A tentativa seguinte de ampliar a conferência para 768 px/orientação não pôde ser executada: controle nativo retornou cgWindowNotFound em duas tentativas de selecionar o Chrome; inventário também indicou host de acesso aos navegadores indisponível. Essas amostras continuam pendentes; não houve alteração de CSS baseada em hipótese.

### Recuperação da leitura inicial da comunidade — 14/11/2026

A consulta da primeira página limpa publicações/comentários/paginação anteriores ao mudar grupo/jogo. Respostas de uma consulta substituída ou de uma tela desmontada são ignoradas. Falha exibe “Publicações indisponíveis”, sem convite enganoso para começar um grupo vazio. Nova tentativa preserva rascunho; botão permanece focável enquanto aguarda e bloqueia repetição. Após recuperação, foco é programado para Timeline do grupo.

`npm run test:community-feed` em frontend: cinco testes do componente real transpilado, com hooks/serviços/event loop simulados. Não substituem inspeção visual/DOM ou testes de autorização. Conferir por navegador falha/recuperação, teclado, grupos/jogos alternados e respostas lentas. Paginação, ranking e operações de escrita concorrentes não fazem parte desse recorte. Nenhuma publicação/comentário real foi enviado.

### Paginação e ranking da comunidade — 14/11/2026

Paginação agora bloqueia chamadas repetidas antes da próxima renderização, ignora respostas de consultas substituídas e mantém as publicações carregadas quando uma página adicional falha. O mesmo botão permite tentar novamente; IDs já presentes não são duplicados. Ao trocar grupo/jogo, a paginação é reiniciada e sua requisição anterior não altera o novo feed.

Ranking limpa resultados ao mudar grupo/jogo e exibe carregamento, falha e vazio legítimo separadamente. Respostas antigas e após desmontagem são ignoradas. A consulta continua sendo feita pelo serviço existente, sem mudança de pontuação/autorização.

`npm run test:community-feed` passou a dez testes simulados. Os cinco novos cobrem paginação concorrente, repetição após falha com preservação/deduplicação, saída da tela, ranking antigo/falha e seleção Todos. Homologação visual e operações de escrita durante troca de grupo permanecem pendentes.

### Criação de publicações e comentários — 14/11/2026

Guardas síncronas impedem duplicação antes do rerender. Resposta de envio iniciado em grupo/jogo anterior não altera o feed nem os avisos da tela atual; após saída da página também não atualiza estado. Texto/mídia/evidência só são limpos no sucesso se ainda corresponderem ao valor enviado, preservando edição posterior; comentários seguem a mesma regra para o texto.

Trocar filtros não cancela um envio já recebido pela API: ele continua destinado ao grupo/jogo do payload original. O descarte é somente da atualização local atrasada. `npm run test:community-feed`: 16 testes simulados; seis novos cobrem criação, rascunhos, duplicação e troca/saída. Não houve envio real. Reações, exclusões, leitura de comentários e homologação visual seguem pendentes.

### Reações, exclusões e leitura de comentários — 14/11/2026

Ações de uma mesma publicação compartilham guarda síncrona para impedir chamadas concorrentes/repetidas. Reações e exclusões descartam atualizações locais após trocar grupo/jogo ou sair da tela. A confirmação já existente para excluir publicação foi preservada. Leitura de comentários também bloqueia consulta repetida e ignora respostas antigas. Requisições já enviadas continuam sujeitas ao processamento normal da API; não há cancelamento de operação no servidor.

`npm run test:community-feed`: 21 testes simulados, incluindo cinco novos para essas ações. Nenhuma reação/exclusão real executada. Homologação por navegador/aparelhos, foco após exclusão e cenários combinando leitura de comentários com alterações simultâneas no servidor permanecem pendentes.

### Carregamento inicial da comunidade — 14/11/2026

Falha ao consultar grupos/jogos/evidências agora apresenta mensagem própria com Recarregar comunidade; não informa ausência de grupos antes de uma consulta bem-sucedida. Nova tentativa mantém botão focável, bloqueia repetição e programa foco no título após recuperar. Respostas após desmontagem são ignoradas.

`npm run test:community-feed`: 24 testes simulados. Três novos cobrem falha/recuperação com foco, ausência legítima de grupos e sucesso/erro após saída. Homologação visual permanece pendente; não foram acessados dados reais.

### Recuperação de Meu desempenho — 14/11/2026

Falha de leitura oferece Tentar novamente sem recarregar a página. Durante a espera, botão permanece focável e bloqueia repetição; sucesso programa foco no título. Totais e histórico só aparecem após consulta bem-sucedida, preservando cálculo existente. Respostas após desmontagem são ignoradas.

`npm run test:performance-recovery`: quatro testes simulados do componente real cobrem erro versus totais/vazio, recuperação/foco/repetição, cálculos/estado de evidência e saída durante consulta. Não executam DOM, CSS, servidor ou navegador. Homologação visual e aparelhos seguem pendentes.

### Recuperação do ranking — 14/11/2026

Falha da lista de jogos permite Recarregar jogos; falha do ranking permite Tentar novamente mantendo o jogo selecionado. Botões permanecem focáveis durante a espera e possuem guarda contra repetição. Sucesso programa foco no título correspondente. Trocar de jogo invalida o retorno da consulta anterior; lista e ranking ignoram respostas após saída da tela.

`npm run test:ranking-recovery`: quatro testes simulados do componente real, cobrindo lista/recuperação, ranking/seleção/foco, troca durante tentativa e sucesso/falha após desmontagem. Não há nova permissão de acesso nem cálculo de pontos; mensagem existente para resposta 403 preservada. Homologação visual permanece pendente.

### Roteiro navegável para aprovação — 14/11/2026

Com `npm run dev:consultoria`, abrir http://127.0.0.1:3001/preview/consultoria/revisao. O aviso no topo das prévias também aponta para o roteiro. Ele reúne links para home, mentoria, game, guia visual e Herbalife, critérios de conferência, dados a confirmar e instruções para registrar correções pelo canal já combinado. Não coleta respostas, cria contas ou publica o site.

Os dados vêm de consultoriaPendingDetails, a mesma fonte das condições/configurações existentes. Valores preenchidos precisam de validação final. O bloqueio de produção do layout da prévia continua aplicado ao roteiro, com noindex herdado. Smoke preview ampliado para seis páginas: 14 respostas e 140 links/fragmentos aprovados no build local com prévia habilitada. Chrome: abertura desktop, atalho Dados a confirmar e amostra da seção em 390 × 812 conferidos; não equivale à aprovação nem à homologação integral.

### Amostras em 768 px e orientação horizontal — 14/11/2026

Build de produção atualizado com prévia habilitada, somente em loopback. Chrome anônimo, emulação com zoom normalizado: roteiro em 768 × 812 apresentou os primeiros cartões em duas colunas legíveis; home na mesma largura mostrou header, CTA e retrato. Em 812 × 390, menu da home mostrou quatro links e entrada da participante; com foco no acionador, Tab/Tab/Enter navegou à mentoria e fechou o menu. Primeira tela da mentoria e introdução do funcionamento do game conferidas nessa orientação. Conteúdo abaixo da dobra exige rolagem, como previsto; não declarada inspeção integral.

Nenhuma alteração de CSS necessária nas amostras. Não são ensaios de rotação de aparelho físico, toque, Safari ou todas as seções/formulários. Plano mantém CONS-12.3 aberto. Servidor e janela temporários encerrados, build padrão restaurado.

### Troca de senha e recuperação da sessão — 14/11/2026

Se a alteração de senha for salva e a consulta posterior da sessão falhar, o formulário informa que a senha foi alterada e oferece Atualizar sessão. Esse botão consulta somente os dados do usuário; não reenvia a senha. Campos são limpos após alteração confirmada e ficam bloqueados enquanto a sessão aguarda atualização. Redirecionamento só ocorre após atualização bem-sucedida. Falha da própria alteração mantém os campos para correção.

`npm run test:change-password`: quatro testes com componente real transpilado/serviços simulados. Nenhuma credencial real foi digitada, transmitida ou alterada. Conferência visual/integração real ainda pendente.

### Validação acessível da troca de senha — 14/11/2026

Erros locais de campo obrigatório, confirmação diferente e nova senha curta identificam o campo com aria-invalid, associam a mensagem por aria-describedby e programam foco no campo correspondente. Nova senha tem ajuda persistente e minLength=8, refletindo a regra cliente já existente; servidor continua responsável pelas demais validações. Erro genérico da API não é atribuído arbitrariamente a um campo.

`npm run test:change-password`: sete testes simulados no total; três novos verificam campo/mensagem/foco e ausência de chamada do serviço para entradas locais inválidas. Não houve digitação ou alteração de credencial real. Validação nativa do navegador, leitor de tela e fluxo real permanecem pendentes.
