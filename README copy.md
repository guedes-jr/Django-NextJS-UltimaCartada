# Pacote de contexto para Codex — Cartada Viva / A Última Cartada

Este ZIP contém arquivos de orientação para serem adicionados ao repositório `Django-NextJS-UltimaCartada`.

## Arquivos principais

- `AGENTS.md`: instruções principais para agentes de IA.
- `PROJECT_CONTEXT.md`: contexto funcional do sistema.
- `IMPLEMENTATION_PLAN.md`: plano completo de continuidade.
- `DEPLOYMENT.md`: documentação de deploy em VPS.
- `docs/CODEX_PROMPTS.md`: prompts prontos para usar no Codex.
- `docs/LOCAL_DEVELOPMENT.md`: comandos de desenvolvimento local.
- `docs/PRODUCTION_CHECKLIST.md`: checklist de produção.
- `docs/GIT_WORKFLOW.md`: fluxo de trabalho com Git.
- `scripts/deploy-cartada`: script base de atualização no servidor.
- `backend/.env.example`: exemplo de variáveis do backend.
- `frontend/.env.example`: exemplo de variáveis do frontend.

## Como aplicar no projeto

Copie os arquivos para a raiz do repositório, preservando a estrutura de pastas:

```bash
cp -R codex_context_cartada_viva/* /caminho/do/Django-NextJS-UltimaCartada/
```

Depois commite:

```bash
git add AGENTS.md PROJECT_CONTEXT.md IMPLEMENTATION_PLAN.md DEPLOYMENT.md docs scripts backend/.env.example frontend/.env.example
git commit -m "docs: add project context for codex"
git push origin main
```

## Como usar no Codex

Prompt recomendado:

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.
Execute apenas o Passo 46.
Antes de alterar, inspecione os arquivos existentes relacionados.
Mantenha os padrões atuais do projeto.
Ao final, informe arquivos alterados, resumo das mudanças e comandos de teste.
```
