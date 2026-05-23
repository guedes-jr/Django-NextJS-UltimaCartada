# IA Context — Última Cartada / Cartada Viva

Esta pasta concentra os arquivos de contexto para uso com Cursor, agentes locais e assistentes de código.

O objetivo é manter a IA alinhada com:

- a arquitetura do projeto;
- as tecnologias utilizadas;
- os domínios do jogo;
- as regras de negócio;
- o padrão visual e operacional do painel;
- os cuidados com dados de pacientes/jogadores.

## Como usar

1. Copie a pasta `ia` para a raiz do projeto.
2. Copie o arquivo `.cursorrules` para a raiz do projeto.
3. No Cursor, abra o workspace pela raiz do repositório.
4. Ao pedir alterações, referencie os arquivos desta pasta quando necessário.

## Estrutura

```txt
ia/
├── README.md
├── architecture.md
├── domain-map.md
├── backend-guidelines.md
├── frontend-guidelines.md
├── api-contracts.md
├── coding-standards.md
├── security-checklist.md
├── performance-checklist.md
├── delivery-workflow.md
├── .ai-context/
│   ├── project-overview.md
│   ├── business-rules.md
│   ├── data-model.md
│   └── ui-patterns.md
├── .ai-prompts/
│   ├── backend-feature.prompt.md
│   ├── frontend-page.prompt.md
│   └── debug.prompt.md
├── .ai-commands/
│   ├── review-feature.md
│   ├── generate-service.md
│   └── create-admin-page.md
└── .ai-agents/
    ├── backend-agent.md
    ├── frontend-agent.md
    └── product-agent.md
```
