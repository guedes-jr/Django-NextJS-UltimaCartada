# GIT_WORKFLOW.md — Fluxo de trabalho com Git

## Antes de iniciar uma tarefa

```bash
git checkout main
git pull origin main
```

Criar branch:

```bash
git checkout -b feat/nome-da-tarefa
```

## Depois de alterar

Rodar validações:

```bash
cd backend
source .venv/bin/activate
python manage.py check
```

```bash
cd frontend
npm run build
```

Commit:

```bash
git add .
git commit -m "feat: descrição objetiva"
git push origin feat/nome-da-tarefa
```

## Convenção de commits

- `feat:` nova funcionalidade.
- `fix:` correção de erro.
- `style:` ajuste visual sem mudar regra.
- `refactor:` melhoria interna sem mudar comportamento.
- `docs:` documentação.
- `chore:` configuração, build, deploy, manutenção.

## Exemplos

```bash
git commit -m "feat: improve player card play experience"
git commit -m "feat: improve evidence submission flow"
git commit -m "fix: harden backend role permissions"
git commit -m "feat: add demo seed command"
git commit -m "style: polish responsive interface"
git commit -m "chore: prepare production deployment"
```
