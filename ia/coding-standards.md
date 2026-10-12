# Padrões de código

- Preserve nomenclatura local e nomes em inglês no código; mensagens de interface em português.
- Python: imports `apps.<dominio>`, métodos claros e type hints quando úteis; não introduzir uma abstração genérica para uniformizar apps.
- TypeScript: contratos em `src/types`, payload/resposta tipados, unknown com refinamento para erros; evitar any e assertions que ocultem incompatibilidade.
- Frontend services: `<dominio>Service.ts`; CSS Modules junto à tela/componente. Backend mantém `services.py` ou `services/` conforme app.
- Trate erros esperados com mensagens úteis; não ocultar falhas nem retornar sucesso após erro de persistência.
- Não misturar refatoração ampla, atualização de dependências ou formatação em massa com correção local.
- Registre datas com timezone e regras do domínio; não calcular prazo de evidência apenas no cliente.
- Não alterar banco/model sem migration compatível e inspeção dos dados existentes.
- Testes devem verificar comportamento observável e falhas relevantes, não espelhar a implementação.

Se solicitado, commits seguem `feat:`, `fix:`, `refactor:`, `docs:`, `chore:` ou `test:` com descrição curta. Não fazer commit/push automaticamente só porque um guia antigo sugere.
