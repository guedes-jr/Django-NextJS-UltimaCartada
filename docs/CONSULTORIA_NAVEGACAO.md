# Mapa de navegação da consultoria

Inspeção e testes locais atualizados em 20/11/2026. Este mapa registra o código do repositório, sem afirmar quais URLs foram divulgadas em campanhas externas. A aprovação editorial e a publicação continuam no plano.

## Rotas e compatibilidade

| URL | Chave desligada (padrão) | ENABLE_CONSULTORIA_SITE=true |
| --- | --- | --- |
| `/` | Home pública com redação da primeira etapa | Magaly Abreu, mentoria principal e game incluído |
| `/public/ultima-cartada` | Mentoria A Última Cartada | Mentoria A Última Cartada |
| `/public/cartada-viva` | Página informativa própria do game (200) | Página informativa própria do game (200) |
| `/public/consultoria` | 308 para `/public/ultima-cartada` | 308 para `/public/ultima-cartada` |
| `/public/herbilife` | Página comercial existente | Apresentação comercial separada, mesma grafia de URL |
| `/login` | Acesso existente | Mesmo acesso, novo tema |
| `/terms`, `/privacy` | Documentos existentes | Mesmas rotas e documentos, tema e marca Magaly na apresentação |
| `/dashboard`, `/mentorship`, `/player/*` | Rotas autenticadas existentes | Mesmas rotas e regras de acesso, tema incremental |
| `/preview/consultoria` e subpáginas | 404 em produção por padrão | Também 404 em produção por padrão |

A chave ENABLE_CONSULTORIA_PREVIEW permite a prévia em ambiente apropriado, independentemente da ativação pública. A prévia usa noindex e links entre suas próprias propostas; login/termos/privacidade mantêm URLs reais. Não é área autenticada de demonstração.

O redirecionamento legado de consultoria termina na mentoria (200) e não forma ciclo em nenhum modo. APIs `/api/v1/`, Django Admin `/django-admin/` e admin Next `/admin/...` não mudaram nem foram requisitados pelo smoke público.

## Botões e âncoras da apresentação nova

| Origem/ação | Destino |
| --- | --- |
| Marca e “Magaly Abreu” | Home do mapa ativo (público ou prévia) |
| “A mentoria” e links da oferta | Página de mentoria do mapa ativo |
| “O game” e links da experiência incluída | Página de game do mapa ativo |
| “Contato” | `#contato` da página atual |
| Condições de participação | `#condicoes` da mentoria/game, ou mentoria com esse fragmento |
| “O game está incluído” | `#game-incluido` da mentoria |
| “Quero conhecer o game” no hero do game | `#como-funciona`, sem checkout ou acesso livre |
| “Entrar na minha área” / “Já participo” | `/login` |
| “Precisa de ajuda? Veja os canais de contato” no login | `/#contato`, seção pública nas duas apresentações; não exige sessão |
| Termos e privacidade | `/terms` e `/privacy` |
| Informações sobre Herbalife | Página comercial do mapa ativo |
| Guia visual e criativos | Apenas na prévia, `/preview/consultoria/guia-visual` |

Contatos externos dependem de configuração e confirmação; o mapa não certifica WhatsApp, Instagram, checkout, entrega de mensagens ou disponibilidade de serviço externo. Valores desconhecidos continuam “A confirmar”. Contato Herbalife permanece separado.

## Entrada autenticada

Login encaminha equipe autorizada ao admin; participantes com ambos os produtos vão ao dashboard, somente mentoria à mentoria e demais casos à home do game. ProtectedRoute consulta o usuário atual, aplica papel/produto e encaminha troca obrigatória de senha/entrada conforme as regras existentes. O direito efetivo da mentoria inclui GAME; não implica matrícula automática em grupo.

PlayerLayout apresenta, conforme papel/produto, dashboard, game, desempenho, comunidade, ranking, mentoria, configurações e suporte. O smoke confere existência e marcador de tema no HTML inicial das oito entradas. Não executa JavaScript, login, encaminhamento real, submissões ou autorização de dados.

## Evidência e limites

`scripts/check_consultoria_routes.py`: 25 respostas no modo público padrão após a integração do game e do redirecionamento de consultoria. Destinos externos não são acessados; fragmentos são conferidos contra IDs dos documentos consultados. O smoke não substitui a revisão editorial, visual ou em aparelhos reais.

Inspeção visual novamente indisponível pelo navegador integrado. Contato, teclado, celular e fluxo autenticado real continuam no roteiro de homologação em [CONSULTORIA_PREVIEW.md](CONSULTORIA_PREVIEW.md). Resultados registrados em [PROJECT_AUDIT.md](PROJECT_AUDIT.md).
