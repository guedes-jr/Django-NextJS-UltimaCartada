# Diagnóstico técnico — briefing da consultoria

Data: 13/11/2026. Fontes: [briefing integral](../CONSULTORIA.md), cinco imagens anexadas na conversa e inspeção estática dos arquivos abaixo. Este diagnóstico não é uma homologação visual ou auditoria completa de produção. Não houve alteração da aplicação, acesso ao site publicado, execução de testes ou consulta ao banco nesta tarefa.

## Estado encontrado e ajuste necessário

| Superfície | Evidência encontrada | Ajuste planejado |
| --- | --- | --- |
| Home | `frontend/src/app/page.tsx`: header/rodapé Cartada Viva, links “Consultoria”, “6 meses”, “21 dias”, “Sem efeito sanfona” e “Sem recomeços”; Instagram genérico | Magaly como marca principal, mentoria principal, game incluído, fatos confirmados e revisão de promessas/contatos |
| Página de consultoria | `frontend/src/app/public/consultoria/page.tsx`: título, marca, textos e mensagem WhatsApp como consultoria | Entrada legada redirecionada à página da mentoria após aprovar mapa de URLs |
| Página Última Cartada | `frontend/src/app/public/ultima-cartada/page.tsx`: método como eixo, game em três jogos de 21 dias e FAQ condicionando inclusão à modalidade | Página da mentoria; metodologia explicativa, inclusão inequívoca do game e duração comercial confirmada |
| Página do game | `frontend/src/app/public/cartada-viva/page.tsx`: redirecionamento permanente para Última Cartada | Página informativa própria, sem lançar modalidade independente |
| Checkout | Página Última Cartada aceita Hotmart por `NEXT_PUBLIC_HOTMART_CHECKOUT_URL`, com fallback WhatsApp | Conferir autorização e oferta de mentoria existente; não estender para nova compra do game |
| Navegação | `frontend/src/components/landing/PublicNavigation.tsx`: menu móvel com Esc, foco e fechamento ao navegar | Reutilizar comportamento e revisar hierarquia, destinos e estilo |
| Identidade atual | `frontend/src/app/globals.css`: Arial, preto/dourado/creme e aliases `--landing-*` | Introduzir paleta aprovada e Cormorant Garamond/Montserrat sem regressão dos consumidores |
| Metadados | `frontend/src/app/layout.tsx` e `manifest.ts`: “Jogo terapêutico e mentoria em grupo”, identidade Cartada Viva | Separar marca principal e produto, atualizar descrições, ícones e compartilhamento |
| Produtos | `backend/apps/entitlements/models.py` e `services.py`: GAME/MENTORSHIP separados; `user_has_product` consulta produto exato, com exceção administrativa | Implementar/refletir direito ao game para mentoria válida, respeitando validade, revogação e escopo |
| Sessão e acesso | `frontend/src/lib/auth.ts`: `hasProduct` verifica array; ProtectedRoute, login e dashboard consomem produtos; serializers de accounts expõem concessões | Sincronizar produtos efetivos e encaminhamento sem confiar somente na interface |
| Fotografias e marcas | `frontend/public/landing/professional/`, `cartada-viva-logo.png`, `cartada-viva-mark.png`, favicon e ícones existentes | Inventariar procedência, versões, subtítulos e adequação; existência de arquivo não comprova aprovação |
| Depoimentos | Home usa vídeos em `frontend/public/testimonials/`; há avatares em `frontend/public/landing/` | Confirmar autorizações e evitar representar genéricos como clientes |

Não foi rastreado exaustivamente cada endpoint de produto nesta tarefa; esse rastreamento e seus testes são entregas explícitas da fase 9. Não se afirma que o restante do sistema está ausente ou incorreto com base apenas nesta inspeção.

## Referências visuais recebidas

Cinco imagens: monograma MA branco em disco preto; monograma preto com duplo círculo em branco; assinatura branca em preto; assinatura preta horizontal em branco; outra aplicação vertical do monograma preto em branco. As três imagens do monograma não representam necessariamente três símbolos distintos. O traço manuscrito e os contornos são ativos a preservar, não fontes para redesenho.

Os anexos não estão materializados como arquivos novos neste repositório. Não há nas cinco imagens uma apresentação completa das logos de A Última Cartada e Cartada Viva. Precisam ser conferidas nos originais existentes/fornecidos. Não foi feita edição, vetorização ou geração de imagens nesta etapa. Regras e aplicações propostas estão em [DESIGN.md](../DESIGN.md).

## Estrutura de páginas e botões proposta

| Entrada | Papel proposto | CTA principal | CTA complementar |
| --- | --- | --- | --- |
| `/` | Marca Magaly Abreu | Conhecer a Mentoria A Última Cartada → `/public/ultima-cartada` | Conhecer o Game Cartada Viva → `/public/cartada-viva` |
| `/public/ultima-cartada` | Mentoria | Conversar com Magaly → contato confirmado | Conhecer o game incluído → `/public/cartada-viva` |
| `/public/cartada-viva` | Game informativo | Quero conhecer o game → informação/contato confirmado | Conhecer a mentoria → `/public/ultima-cartada` |
| `/public/consultoria` | URL legada | Redirecionamento permanente à mentoria | Sem terceira oferta |
| Header/rodapé | Acesso de participantes | Entrar na minha área → `/login` | Encaminhamento por produto/papel autorizado |
| `/public/herbilife` | Atividade comercial separada | Destino comercial confirmado | Sem condicionar mentoria/game à compra |

O mapa ainda deve ser aprovado. `/public/cartada-viva` atualmente redireciona à mentoria; remover esse redirecionamento ao implementar a página, evitando ciclo com URLs antigas. Não renomear a área autenticada `/mentorship`, endpoints ou Django Admin.

## Matriz de cobertura do briefing

Referências numéricas remetem às seções de CONSULTORIA.md; “Complemento” indica sua segunda parte. Os IDs e estados de execução vivem somente no plano ativo.

| Requisito | Entregas no plano |
| --- | --- |
| Principal 1 — arquitetura oficial | Fases 1, 2, 5, 6, 7 e 8 |
| Principal 2 — game incluído e duração | Fases 1, 2, 5, 7, 8 e 9 |
| Principal 3 — possibilidade futura sem oferta inventada | Fases 2, 8 e 14 |
| Principal 4 — três páginas com funções distintas | Fases 2, 3, 6, 7 e 8 |
| Principal 5 — nomes e logos | Fases 1, 3, 4 e 5; DESIGN.md §§2–3 |
| Principal 6 — paleta e fontes | Fases 3 e 4; DESIGN.md §§4–5 |
| Principal 7 — narrativa e público | Fases 2, 6, 7 e 12; DESIGN.md §9 |
| Principal 8 — menus e botões | Fases 2, 4, 5 e 12 |
| Principal 9 — identificação e Herbalife | Fases 1, 6 e 10 |
| Principal 10 — privacidade e contato | Fases 1 e 10; métricas futuras na fase 14 |
| Principal 11 — prioridades | Correções de arquitetura antes das páginas completas; lançamento nas fases 12–13; evolução condicionada na fase 14 |
| Principal 12 — diagnóstico, estrutura, propostas, decisões e teste | Este diagnóstico; fases 1–3 e 12–13 |
| Complemento 1 — preservar três identidades | Fases 1, 3 e 4; DESIGN.md §3 |
| Complemento 2 — funções de cor e contraste | Fases 3, 4 e 12; DESIGN.md §4 |
| Complemento 3 — tipografia e assinatura | Fases 3 e 4; DESIGN.md §§3 e 5 |
| Complemento 4 — hierarquia entre páginas | Fases 2, 3, 6, 7 e 8; DESIGN.md §§2 e 8 |
| Complemento 5 — aplicações, ícones e compartilhamento | Fases 1, 3, 4 e 11 |
| Complemento 6 — elementos discretos e fotografias | Fases 1, 3, 4 e 6; DESIGN.md §6 |
| Complemento 7 — experiência no celular | Fases 3, 4 e 12; DESIGN.md §10 |
| Complemento 8 — guia e criativos para Claude | Fase 11; DESIGN.md §11 |
| Complemento 9 — prévias e preservar site atual | Fases 3, 12 e 13 |

## Decisões e dependências externas

Duração da mentoria e do game; jornadas incluídas; validade/revogação de acesso; estrutura real do acompanhamento; identificação profissional; contatos oficiais; originais das três marcas e subtítulos; autorizações de fotos/depoimentos; posição comercial da Herbalife; solução de interesse/contato; validade da oferta Hotmart existente; responsáveis e janela da campanha de novembro.

Acesso independente, preço, checkout novo, gratuidade, jornadas introdutórias e métricas comerciais não foram decididos. A inclusão do game na mentoria está confirmada no briefing; a implementação não deve recolocar essa inclusão em dúvida ao pedir detalhes operacionais.

## Critério global de conclusão

Uma visitante deve compreender quem é Magaly, o que encontra na Mentoria A Última Cartada e como o Game Cartada Viva se conecta a ela. A participante autorizada deve conseguir acessar o game incluído sem nova compra. Propostas e versão de teste precedem publicação expressamente autorizada; resultados de produção precisam de registro próprio.

## Matriz editorial da versão atualizada — revisão de 13/11/2026

Revisão estática do conteúdo das páginas novas, seções, FAQs e metadados. Não é aceite editorial externo, revisão jurídica ou validação da versão legada que permanece como padrão até ativação aprovada.

| Informação | Fonte atual | Onde se aplica | Estado |
| --- | --- | --- | --- |
| Magaly Abreu — Psicóloga e Mentora | `content.ts`, briefing | Home, header, rodapé, login | Nome público e função confirmados; identificação completa pendente |
| A Última Cartada — Mentoria | `content.ts`, componentes e metadados | Home, mentoria, dashboard, portal | Oferta principal; metodologia como abordagem de suporte |
| Cartada Viva — Game incluído | `consultoria.inclusion`, `Questions`, `Inclusion` | Três páginas, FAQ, cards e área autenticada | Inclusão confirmada, sem compra adicional do game |
| Duração da mentoria e game | `consultoriaOfferDetails` | Quadro de condições, FAQ, painel de revisão | A confirmar; sem publicar 21 dias, três jogos ou seis meses como oferta confirmada |
| Formato, encontros, materiais/suporte | `consultoriaOfferDetails` | Mentoria e painel de revisão | A confirmar |
| Mensagem central e frase simbólica | `consultoria.message`/`symbolicPhrase`, briefing | Home, rodapé e criativos | Frases do briefing preservadas |
| Participação independente no game | FAQ e página informativa | Game e metadados | Sem oferta autônoma lançada, preço ou checkout novo |
| Limite do game educativo | FAQ e rodapé | Três páginas | Não substitui atendimento psicológico, nutricional ou médico; sem inferir formato clínico da mentoria |
| Promessas de resultado | Textos novos revisados | Hero, benefícios, FAQ, CTA | Sem garantia de emagrecimento, manutenção definitiva ou ausência de dificuldades |
| Contato e inscrição | Helpers em `content.ts` e env.example | Contato da mentoria/game e atividade Herbalife | Somente números/destinos confirmados; nenhum valor real inventado |
| Atividade Herbalife | Página e metadados próprios | Rota comercial e rodapé | Separada, sem compra apresentada como requisito; sem desconto fixo ou resultado de saúde prometido |

A busca estática por expressões antigas (“Sem efeito sanfona”, “Sem recomeços”, “Método Última Cartada”, “Consultoria personalizada”) e por durações não confirmadas não encontrou ocorrências nos componentes da nova apresentação. A leitura dos textos manteve linguagem de possibilidades, autonomia e retomada. O teste HTTP do modo atualizado verifica inclusão explícita, condições provisórias e ausência das durações antigas nas páginas de mentoria/game.

Os convites “Conhecer as condições de participação” passaram a apontar ao quadro de condições da mentoria, em vez de somente à área de contato. Confirmação de dados, autorização de imagem, aprovação de texto e validação visual continuam na revisão final.

### Revalidação editorial de 13/11/2026 — ilustração e percursos

O SVG legado continha três jogos de 21 dias; não era evidência da oferta confirmada. A apresentação nova agora usa `/consultoria/player-journey.svg`, sem prazos/quantidade de jornadas, e distingue jornada diária do percurso por rodadas no texto. O original legado permanece intocado. Sete itens técnicos 06.3/06.4/07.3/08.2/08.4/08.5/08.6 foram revalidados e registrados na auditoria; nenhum aceite externo, logo faltante ou dado comercial foi presumido.
