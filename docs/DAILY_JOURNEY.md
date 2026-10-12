# Jornada diária — PROD-01

## O que foi implementado

A jornada pode usar uma cartada editorial por dia, organizada nas três etapas existentes de 21 dias. `JourneyDay` define a cartada de um dia de uma etapa; `JourneyGame` mantém a execução por grupo; `DailyParticipation` guarda a atividade privada do participante. Não há dependência de uma rodada nem escolha livre do naipe nesse fluxo.

A liberação é calculada pelo servidor a partir de `Game.start_date + day_number - 1` e do horário configurado na cartada, usando o timezone Django. Somente conteúdo publicado da data atual aparece como cartada jogável. Conteúdo futuro/rascunho não é entregue na resposta do participante. Uma ausência não obriga recuperar dias anteriores.

Intenção e evidência são independentes: o dia conta como jogado com qualquer um dos dois registros. Os pontos sugeridos pelos documentos (10/30) são valores iniciais editáveis por cartada. Cada parcela é gravada uma única vez; reenvios não duplicam pontos. Alterar configuração afeta novas parcelas, sem recalcular pontos já obtidos. Não existe retirada por ausência.

## Compatibilidade com o jogo existente

`Journey.daily_enabled` distingue o programa editorial de jornadas por rodadas. A migration mantém `False` para registros existentes. Novas jornadas criadas no painel têm a opção de fluxo diário marcada; APIs antigas que omitem o campo preservam o comportamento anterior.

No modo diário, a matrícula cria os três jogos, mas não gera rodadas. As rodadas/jogadas anteriores permanecem no banco e no histórico; novas jogadas livres são recusadas pelo serviço de criação de Play para essa jornada. Para uma jornada existente, publique uma cartada no editor e use “Habilitar fluxo diário”. Após registrar participações diárias, o fluxo não pode ser desativado.

A pontuação diária permanece em DailyParticipation, separada de Play/ScoreLog e das mecânicas competitivas. A conexão com os dois saldos e os rankings novos pertence a PROD-02/PROD-03; não presumir que o ranking antigo inclui essa pontuação.

## Configuração e uso

1. Com o ambiente configurado, aplique as migrations de `journeys` (`python manage.py migrate`). As migrations novas adicionam tabelas/flag; não convertem nem removem jogadas existentes.
2. Em `/admin/journeys`, crie ou selecione uma jornada. Use “Conteúdo diário (63 dias)” para cadastrar as 21 cartadas de cada etapa, com pilar, instrução, textos, mensagens, imagem, horário, evidência e pontos.
3. Distribua os quatro pilares por cada etapa de acordo com a matriz aprovada. O painel mostra quantidade cadastrada/publicada; não preenche dias faltantes automaticamente.
4. Publique somente conteúdo revisado. Ative a jornada após conferir calendário, grupos e acesso GAME dos participantes. Para jornadas anteriores, habilite explicitamente o fluxo diário.
5. Em `/player/home`, o participante vê jornada/grupo, etapa atual e cartada do dia. Pode registrar intenção, enviar evidência, consultar histórico privado e alternar progresso por pilar entre etapa e jornada inteira.
6. O painel também oferece indicadores agregados por pilar para cada grupo, sem mostrar intenções/evidências pessoais.
7. Ao terminar uma etapa, a home mostra seu encerramento; o calendário libera a próxima etapa conforme intervalo configurado. Ao terminar os três jogos, permanecem histórico e pontos.

O fluxo não cria textos definitivos das 63 cartadas. Aprovação editorial e importação/versionamento avançado permanecem em PROD-05 e nos aceites externos.

## Calendário e encerramento

`JourneyCalendarService` sincroniza etapas nas consultas de matrículas e no registro de atividade. O fim dos 21 dias encerra o jogo; a próxima etapa inicia em sua data, independentemente de pontos ou dias jogados. Intervalos, jornadas inativas e cancelamentos são respeitados.

Para atualizar estados mesmo sem acessos, está disponível o comando idempotente:

```bash
cd backend
source .venv/bin/activate
python manage.py sync_journey_calendar
```

Seu agendamento em produção é opcional e deve usar o ambiente de execução já configurado. Nenhum cron/serviço foi instalado nesta tarefa.

## Privacidade e integridade

Participações são filtradas por usuário e grupo; mediadores ficam restritos aos grupos vinculados. A ação `progress` anterior também foi corrigida para não listar matrículas de outros grupos da mesma jornada.

Evidências diárias ficam em `PRIVATE_MEDIA_ROOT`, sem URL pública no serializer. Download exige autenticação/autorização e responde com `Cache-Control: private, no-store`. O backend verifica tamanho (10 MB), formato da imagem ou assinatura MP4/WebM e compatibilidade com o tipo solicitado. A assinatura de vídeo não substitui processamento/varredura completa, que pode evoluir na política geral de uploads.

O prazo de evidência reutiliza `Game.evidence_deadline_time`, inicialmente 22h da data da cartada. Intenção pode ser registrada até o fim desse dia; após o prazo, os pontos já obtidos permanecem. Horário de liberação deve ser escolhido antes do prazo para cartadas que pedem evidência.

Conteúdo com participações fica protegido contra alteração/exclusão para preservar o histórico. Apenas a configuração de pontos de novas parcelas pode mudar. Edição com versões substitutas/importação é evolução de PROD-05. O calendário da jornada não pode ser deslocado depois de matricular grupos.

## API adicionada

Base `/api/v1`:

- `/journeys/days/`: CRUD editorial administrativo; leitura da equipe autorizada.
- `GET /journeys/enrollments/daily/`: cartada atual, histórico e progresso do próprio participante com acesso GAME vigente.
- `POST /journeys/enrollments/{id}/intention/`: `{day, text?}`.
- `POST /journeys/enrollments/{id}/evidence/`: `{day, text?, file?}`, com FormData para arquivo.
- `GET /journeys/enrollments/{id}/daily-summary/`: indicadores agregados por pilar para a equipe do grupo, sem textos pessoais.
- `/journeys/participations/`: leitura privada/autorizada dos registros.
- `GET /journeys/participations/{id}/download/`: arquivo privado autorizado.

Games passa a expor `uses_daily_content`, e Journey, `daily_enabled`. URLs existentes foram preservadas.

## Validação

Testes de journeys cobrem calendário, intenção/evidência, configuração/idempotência, isolamento, modo diário/legado, prazo, publicação, uploads, progresso, encerramento e histórico. Com PostgreSQL configurado:

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

Frontend: `npm run lint`, `npx tsc --noEmit`, `npm run build` dentro de `frontend/`. A homologação visual do editor/home ainda precisa ser registrada: a conexão com o navegador desta sessão falhou antes de permitir interação.
