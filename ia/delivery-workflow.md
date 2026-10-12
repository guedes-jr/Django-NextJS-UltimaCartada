# Fluxo de desenvolvimento com Codex

1. Leia contexto mínimo em AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md; selecione apenas guias relevantes.
2. Confira git status e inspecione fluxo/contratos/testes com rg e leituras focadas.
3. Defina problema, resultado esperado e um recorte pequeno. Se faltar decisão de negócio, registre a questão e avance no trabalho independente dela.
4. Implemente respeitando arquitetura e padrões locais. Reutilize serviços/tipos; altere backend quando o problema exigir, sem ampliar escopo desnecessariamente.
5. Valide conforme o impacto: Django check/migrations/testes do domínio, frontend lint/tsc/build, UI manual quando houver mudança visual, links/diff para documentação.
6. Revise autorização, efeitos transacionais, contratos, arquivos sensíveis e diff. Atualize contexto/backlog apenas onde a mudança exigir.
7. Entregue resultado, arquivos alterados, comandos executados, falhas/limitações e próximos passos indispensáveis.

## Critério de pronto

Comportamento solicitado implementado, validações apropriadas executadas ou limitações explicitadas, contratos preservados e documentação pertinente atualizada. Implementação encontrada, teste aprovado e aceite de negócio/produção são estados separados.

Não recriar fases já implementadas, não executar migrations/seeds em banco de produção como teste e não incluir commit/deploy como condição automática de pronto. Sem dependências, informe a limitação e use as verificações possíveis; não declare build ou suíte aprovados.

## Documentação

Backlog ativo somente em IMPLEMENTATION_PLAN.md. Regras estáveis em AGENTS.md; arquitetura em ia/architecture.md; evidências e decisões da revisão em docs/PROJECT_AUDIT.md. Planos históricos não são instruções vigentes. Não duplicar o backlog em prompts ou arquivos de agente.
