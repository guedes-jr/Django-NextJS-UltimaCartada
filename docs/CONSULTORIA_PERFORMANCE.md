# Desempenho — inventário e medições locais

Inventário inicial de 13/11/2026, ampliado com Lighthouse local em 14/11/2026. Recorte de CONS-12.5: medições de laboratório não equivalem a dados de campo, aparelho real ou aceite visual.

## Inventário dos originais usados na apresentação nova

| Arquivo em frontend/public | Dimensões | Bytes |
| --- | --- | ---: |
| landing/professional/acauamedia-130.jpg | 1200 × 1800 | 397.583 |
| landing/professional/acauamedia-117.jpg | 1800 × 1200 | 317.352 |
| cartada-viva-mark.png | 1254 × 1254 | 1.287.634 |

Metadados lidos com sharp já instalado, sem instalar pacotes nem regravar imagens. As dimensões declaradas do retrato e da marca foram preservadas; o hero usa fill em container com altura definida. O símbolo original não foi redesenhado, recolorido ou recortado.

## Respostas do otimizador local

Build atualizado, GET em `/_next/image`, qualidade 75 e Accept=image/webp:

| Arquivo | Largura solicitada | Formato servido | Bytes |
| --- | ---: | --- | ---: |
| acauamedia-130.jpg | 640 | WebP | 14.354 |
| acauamedia-130.jpg | 1920 | WebP | 43.728 |
| acauamedia-117.jpg | 640 | WebP | 11.972 |
| cartada-viva-mark.png | 640 | WebP | 30.724 |

São solicitações sintéticas de tamanhos suportados, não medição do recurso escolhido por um navegador/DPR específico. Não comparar diretamente os bytes dos originais com os otimizados como se representassem uma melhoria nova: o otimizador já existia.

## Ajuste implementado

`sizes` do hero agora considera o limite móvel de 500 px e termina em 540 px no desktop; o retrato abaixo da dobra termina em 570 px. Antes, ambos cresciam indefinidamente com vw mesmo depois do limite do container. A ilustração SVG do sistema acompanha a troca para uma coluna até 980 px e seu limite desktop; o SVG continua vetorial, sem conversão pelo otimizador.

HTML inicial conferido por HTTP: foto principal priorizada; retrato abaixo da dobra e símbolo secundário usam loading=lazy. Os arquivos de fonte locais totalizam 73.284 bytes: Montserrat 35.508 e Cormorant Garamond 37.776. Não houve ampliação de pesos ou fonte externa.

## Homologação ainda necessária

Completar a medição do recurso selecionado e tráfego em 320/375/390/768/1024/1440 px e DPR 1/2/3, conferir nitidez/recorte, LCP, CLS e interatividade com rede móvel e Safari/Chrome. O laboratório abaixo inicia essa avaliação; a inspeção HTTP sozinha não comprova desempenho percebido. Não há orçamento de desempenho aprovado pela consultoria nem aprovação das fotografias por esta medição.

Revisão editorial posterior: a ilustração vetorial da página nova usa `/consultoria/player-journey.svg`, sem as durações/quantidade de jogos do arquivo legado. O SVG original foi preservado; medições de fotos/fontes acima não mudaram.

## Lighthouse móvel — 14/11/2026

Chrome nativo em janela anônima, build de produção atualizado servido exclusivamente em `127.0.0.1:3002`. Lighthouse 13.5.0, Navigation/Mobile, Moto G Power emulado, Slow 4G e limitação simulada de CPU/rede. Uma execução por página; sem login, dados privados ou publicação. Configuração e valores numéricos completos no [resumo JSON](qa/consultoria-lighthouse-2026-11-14.json).

| Página | Desempenho | Acessibilidade automatizada | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 96 | 100 | 1,1 s | 2,7 s | 0 ms | 0 | 1,1 s |
| Mentoria | 96 | 100 | 1,1 s | 2,7 s | 0 ms | 0 | 1,1 s |
| Game | 96 | 100 | 1,1 s | 2,7 s | 0 ms | 0 | 1,1 s |

Best Practices e SEO: 100 nas três amostras. Notas automatizadas não certificam acessibilidade integral, qualidade editorial, ranqueamento ou desempenho no site publicado. TBT não é medição de INP de interações reais. Sem distribuição de resultados ou comparação estatística; latência/servidor local não representam hospedagem e redes reais.

### Experimento sem ganho comprovado

Na home, o diagnóstico identificou a foto do hero como LCP e ausência de indicação fetchpriority=high; o pedido já era descoberto no HTML e não usava lazy. Estimativa de economia desse diagnóstico era zero. Também foram listados CSS bloqueante e JavaScript/CSS não utilizados, cuja eventual revisão exige medir impacto nos consumidores compartilhados.

Testado somente no Hero compartilhado: substituir priority por loading=eager/fetchPriority=high, conforme alternativas da referência local Next.js 16. HTML servido confirmou os atributos na home e mentoria. Repetição da home: desempenho 96, FCP 1,1 s, LCP 2,9 s, TBT 10 ms, CLS 0 e Speed Index 1,1 s. Não houve melhora demonstrada; a amostra isolada também não permite atribuir causalidade à variação. Experimento revertido integralmente, preservando o comportamento anterior. Nenhuma otimização de carregamento é declarada como entregue por essa tentativa.

Relatórios brutos exportados pelo próprio DevTools para `/private/tmp/consultoria-lighthouse-{home,mentoria,game,home-experimento}-20261114.json`. O resumo versionado contém hashes SHA-256 para conferência, sem incorporar capturas base64/trace volumoso. Arquivos temporários dependem de permanência no computador; o resumo preserva métricas e configuração no repositório.

Próxima comparação deve repetir amostras em condições controladas, incluindo servidor/otimizador aquecidos ou frios de forma explícita, antes de concluir melhora ou regressão. Permanecem testes de dispositivo/rede real, interatividade, instalação/offline e cache privado em CONS-12.5/11.3b. O servidor de medição foi encerrado e a configuração padrão de build restaurada.
