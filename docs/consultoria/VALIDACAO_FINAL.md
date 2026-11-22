# Roteiro de validação final da consultoria

Data: 22/11/2026. Este roteiro organiza apenas o que ainda impede aceite ou publicação. Não é autorização de deploy e não deve ser usado para preencher dados por suposição.

## 1. Retorno da titular e ativos

- Confirmar duração, formato, encontros, materiais, suporte e condições da Mentoria e do Game.
- Confirmar identificação profissional final, WhatsApp, Instagram e eventual checkout da Mentoria.
- Entregar/autorizar monograma, assinatura, logos, favicon e imagens de compartilhamento nos formatos e superfícies de uso aprovados.
- Confirmar origem, retratada, escopo de uso das fotografias, cartas e eventuais depoimentos.
- Confirmar que Herbalife permanece atividade separada e que nenhum destino/handle de Bistrô Slim será publicado sem aprovação.

Registre cada retorno na [ficha de aceite](FICHA_DE_ACEITE_DA_PRIMEIRA_ETAPA.md) e na auditoria antes de alterar uma configuração pública.

Itens do backlog: `CONS-03.4`, `CONS-06.1`, `CONS-07.1`, `CONS-07.5`, `CONS-11.2` e `CONS-12.8`.

## 2. Homologação visual e funcional

- Conferir home, Mentoria, Game e Herbalife em 320/375/390/768/1024/1440 px, zoom 200%, orientação e conteúdo longo.
- Conferir navegação por teclado, menu, foco, Escape, atalhos, FAQ e links em nova aba.
- Conferir Safari/iPhone e Android/Chrome, incluindo instalação/atualização/offline da PWA e ausência de dados privados no cache.
- Com contas descartáveis, conferir login, encaminhamentos por produto/papel, documentos legais, dashboard, jornada, comunidade, suporte e recuperação de erros.

Os testes locais podem ser iniciados com `npm run test:consultoria`; o smoke HTTP e a prévia estão descritos em [CONSULTORIA_PREVIEW.md](../CONSULTORIA_PREVIEW.md). Eles não substituem os cenários acima.

Itens do backlog: `CONS-03.5`, `CONS-11.3b` e `CONS-12.3`.

## 3. Decisão de privacidade que ainda não existe

- Se houver interesse em formulário, definir dados mínimos, finalidade, acesso, retenção, exclusão, controles contra abuso e testes antes de desenvolver qualquer endpoint ou interface.
- Atualizar Termos e Privacidade somente se essa decisão mudar o tratamento de dados, com texto submetido à responsável antes de publicação.

Itens do backlog: `CONS-10.4` e `CONS-10.5`.

## 4. Gate de publicação

- Registrar autorização expressa com responsável, data, versão e escopo.
- Preencher somente variáveis aprovadas e manter destinos não aprovados vazios.
- Executar o gate em [PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md), incluindo backup/restauração e rollback.
- Publicar apenas no ambiente autorizado; depois conferir URLs, metadados, contato, PWA e acesso real em produção.

Itens do backlog: `CONS-13.1`, `CONS-13.2`, `CONS-13.3`, `CONS-13.4` e `CONS-13.5`.

## 5. Fora desta liberação

Não iniciar demonstração gratuita, Game pago independente, cadastro/checkout novo, analytics, automações de mensagem ou coleta de leads. A fase 14 foi explicitamente excluída desta liberação; uma decisão futura requer recorte, privacidade, autorização e implementação próprios.

Itens do backlog: `CONS-14.1`, `CONS-14.2`, `CONS-14.3`, `CONS-14.4` e `CONS-14.5`.
