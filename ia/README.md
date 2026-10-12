# Contexto de desenvolvimento com Codex

Este diretório contém referências técnicas consultadas sob demanda. Comece por `../AGENTS.md`, `../PROJECT_CONTEXT.md` e `../IMPLEMENTATION_PLAN.md`; depois leia apenas o que ajuda na tarefa. Não é necessário copiar esta pasta ou carregar todos os arquivos a cada solicitação.

| Referência | Quando consultar |
| --- | --- |
| [architecture.md](architecture.md) | Limites de camadas e fluxo entre frontend, API e banco |
| [domain-map.md](domain-map.md) | Responsabilidade de cada app e relações |
| [api-contracts.md](api-contracts.md) | URLs, contratos e compatibilidade |
| [backend-guidelines.md](backend-guidelines.md) | Models, services, serializers, autorização e migrations |
| [frontend-guidelines.md](frontend-guidelines.md) | Rotas, componentes, sessão, services e UI |
| [coding-standards.md](coding-standards.md) | Nomes, erros, tipos e revisão de alterações |
| [security-checklist.md](security-checklist.md) | Acesso, produtos e mídia |
| [performance-checklist.md](performance-checklist.md) | Consultas, carregamento e índices |
| [delivery-workflow.md](delivery-workflow.md) | Execução, validação e entrega |

Instruções por diretório ficam em `../backend/AGENTS.md` e `../frontend/AGENTS.md`. Prompts atuais: [../docs/CODEX_PROMPTS.md](../docs/CODEX_PROMPTS.md). Evidência da revisão: [../docs/PROJECT_AUDIT.md](../docs/PROJECT_AUDIT.md).

As pastas `.ai-context/`, `.ai-prompts/`, `.ai-commands/` e `.ai-agents/` são referências auxiliares; não habilitam ferramentas, agentes ou execução automática. O pacote `ultima_cartada.skill` é um artefato legado, não foi instalado nem atualizado nesta revisão; prefira os documentos atuais. `.cursorrules` apenas direciona para estas mesmas fontes.

A distribuição de instruções por diretório segue a [documentação oficial de AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md). As regras técnicas aqui são específicas deste repositório.
