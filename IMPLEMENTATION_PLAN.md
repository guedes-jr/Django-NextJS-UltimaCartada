# Backlog ativo — Cartada Viva

Revisado em 12/10/2026. Este é o único plano ativo. As entregas identificadas no código foram retiradas da fila de construção inicial e registradas em `docs/PROJECT_AUDIT.md`. Planos anteriores estão em `docs/archive/planning/`; seu arquivamento não significa aceite integral.

## Como executar

Escolha um item e um recorte verificável. Leia as instruções e o código afetado; confirme a lacuna antes de implementar. Registre testes executados e resultados. Não trate uma auditoria estática como homologação. Ao concluir, registre evidência na auditoria e retire o item daqui; novos requisitos devem indicar origem e critério de aceite.

## Validações técnicas relatadas

O responsável informou: “acredito que todas as pendências técnicas já foram validadas”. Os itens DEV-01 a DEV-05 deixam de ser tratados como trabalho novo obrigatório e ficam registrados como **validação prévia relatada, sem conferência independente nesta revisão**. Não foram fornecidos resultados, ambiente ou datas dessas validações.

| ID | Área com validação prévia relatada |
| --- | --- |
| DEV-01 | Testes backend/frontend, migrations, lint, TypeScript e build |
| DEV-02 | Permissões e isolamento entre usuários, grupos e mediadores |
| DEV-03 | Responsividade e acessibilidade |
| DEV-04 | Uploads e acesso autorizado às mídias |
| DEV-05 | Deploy, HTTPS, PWA, backup/restauração e monitoramento |

Registro de origem e limites em `docs/PROJECT_AUDIT.md`. Reabrir um recorte técnico quando houver falha concreta, mudança que exija regressão ou esclarecimento de que a validação anterior não cobriu aquele recorte. Os testes proporcionais a novas alterações continuam necessários.

Referências operacionais: `DEPLOYMENT.md`, `docs/PRODUCTION_CHECKLIST.md`, `docs/LOCAL_DEVELOPMENT.md`, `PWA_TESTING.md`.

## Evolução de produto a confirmar

Origem: materiais em `doc/` e `doc/ANALISE_DE_ADERENCIA.md`. A auditoria de setembro contém ausências superadas (jornadas, notificações, consentimento e desafios já têm código); revalidar requisito por requisito antes de dimensionar implementação.

| ID | Recorte pendente | Critério de aceite / decisão necessária |
| --- | --- | --- |
| PROD-01 | Implementação técnica da jornada diária entregue; aceite editorial/visual pendente. | Cartadas por dia/etapa, intenção/evidência, histórico privado, pontos configuráveis, progresso por pilar e transição automática implementados. Aplicar migrations no ambiente de destino, cadastrar/publicar as 63 cartadas aprovadas e homologar home/editor. Ver `docs/DAILY_JOURNEY.md` e evidências em `docs/PROJECT_AUDIT.md`. |
| PROD-02 | Cartadas competitivas e saldos separados. | Confirmar modalidades, colocação, transferência, cancelamento/reversão, piso zero e pesos; projetar ledger transacional sem afetar Pontos de Jornada. `FlashChallenge` atual não comprova essas regras. |
| PROD-03 | Privacidade de ranking e relatórios. | Confirmar pódio público/posição privada e acumulado trimestral; impedir exposição de posições vedadas e definir exportação anonimizada e formatos obrigatórios (CSV/PDF). |
| PROD-04 | Pausa, retorno, ausência e ajuda à facilitadora. | Definir limiar de ausência, retorno sem perda de pontos, alerta privado e indicadores de início/pausa/retorno/conclusão; avaliar reutilização de suporte e notificações. |
| PROD-05 | Conteúdo administrável e importação. | Confirmar campos editoriais, alternativas acessíveis e matriz vigente; importação/exportação com schema versionado, validação, relatório de erros e histórico. Conteúdo final aprovado pela responsável, sem inventar cartadas. |
| PROD-06 | Consentimentos e ciclo de dados. | Comparar aceite versionado existente com consentimentos por finalidade, revogação, exclusão, retenção, auditoria de leitura de dados e minimização. Definir operação e testar bloqueios antes de publicar. |
| PROD-07 | Separação institucional/comercial. | Responsável define relação entre Cartada Viva e consultoria/Herbalife diante das restrições dos requisitos; preservar rotas até decisão e plano de migração. |

## Decisões e aceite externo

- Revisar/publicar textos legais: `LEGAL_CONTENT_REVIEW.md`.
- Validar fluxo e conteúdo comercial: `HERBALIFE_CONTENT_REVIEW.md`.
- Aprovar conteúdo editorial definitivo, jogos 2/3, cartadas-relâmpago e calendário anual.
- Homologar grupo piloto com registro de problemas, correções e aceite.
- Confirmar regras de prazos em fins de semana/feriados, reabertura, participação simultânea, moderação e compartilhamento consentido.
- Confirmar concessão de produtos (manual ou integração), progresso obrigatório de mentoria, canais de atendimento/notificação e retenção de auditoria. Código existente representa escolhas técnicas; não substitui validação de negócio.

As perguntas originais completas permanecem na seção 8 do plano de novos requisitos arquivado. E-mail, WhatsApp, pagamentos, automação de fechamento e novas integrações dependem de escopo aprovado; não são parte automática da próxima tarefa.

## Ordem sugerida

Aceite editorial/visual de PROD-01 e decisões PROD-02/03/06/07 → recortes de produto aprovados → validações das alterações entregues → piloto. Revisão jurídica, conteúdo editorial e decisões comerciais podem avançar em paralelo ao trabalho técnico, sem pressupor aprovação.
