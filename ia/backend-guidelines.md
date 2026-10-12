# Padrões do backend

Leia `../backend/AGENTS.md` e [architecture.md](architecture.md). Preserve apps por domínio e imports `apps.<app>`.

## HTTP e contratos

Use ModelViewSet para CRUD, ReadOnlyModelViewSet para leitura, APIView/função para operações específicas já estabelecidas. Ações customizadas têm verbo e `url_path` compatíveis com consumidores. Serializers declaram campos explicitamente e tornam identidade, status e pontos derivados somente leitura quando apropriado.

Confira URL real, serializer e testes antes de alterar payload. Não transforme respostas de listas em paginação sem adaptar services/tipos e manter compatibilidade. Erros devem seguir o contrato DRF já consumido (detail ou campos), sem expor internals.

## Domínio e persistência

Reutilize services do próprio app, preferindo métodos claros com parâmetros de domínio; não imponha uma classe base comum. O código tem classes de serviço e funções (`entitlements/services.py`); siga o padrão local.

Use transaction.atomic em fluxos com gravações dependentes. Para concorrência, avalie constraints, select_for_update e idempotência dentro da transação no ponto real de conflito. Pontuação/revisão não deve aplicar bônus duas vezes. Evite efeitos externos antes do commit de uma operação.

Models guardam schema/invariantes; serializers validam formato e relações; services conduzem regras complexas; views autorizam e coordenam HTTP. Não mover tudo para services em uma correção pequena.

Migrations são versionadas; não alterar migrations aplicadas nem trocar AUTH_USER_MODEL. Consultas usam select_related para FK/OneToOne, prefetch_related para coleções e agregações no banco. Antes de adicionar índices, verifique os já existentes (inclusive os de FKs) e a consulta afetada.

## Autorização e testes

Confirme papel, queryset, FK de entrada, ação e produto. Admin global, mediador de grupo e participante têm escopos distintos. Use helpers reais de User e entitlements; não confie em is_staff nem no frontend.

Teste regra afetada em `apps/<dominio>/tests.py`, com terceiros/grupos distintos e produtos vencidos quando pertinente. Para pontuação/transação, cubra repetição, rollback e limites temporais. Execute check, detecção de migrations pendentes e testes conforme `../AGENTS.md`.

Seeds/commands existentes ficam no app responsável. `seed_demo` atualiza senhas e datas; usar somente em desenvolvimento. Mídia e dados sensíveis não devem ser incluídos em fixtures reais ou logs.
