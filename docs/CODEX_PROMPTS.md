# CODEX_PROMPTS.md — Prompts prontos para usar no Codex

## Prompt base

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Antes de alterar qualquer arquivo, inspecione a estrutura atual do projeto e os arquivos relacionados à tarefa.

Mantenha os padrões existentes:
- Django REST Framework no backend;
- Next.js com TypeScript no frontend;
- CSS Modules;
- services em frontend/src/services;
- types em frontend/src/types;
- chamadas HTTP usando frontend/src/lib/api.ts;
- autenticação usando frontend/src/lib/auth.ts.

Faça a menor alteração funcional possível.
Não altere a stack.
Não adicione Tailwind.
Não remova funcionalidades existentes.

Ao final, informe:
- arquivos alterados;
- resumo das mudanças;
- comandos de teste executados ou recomendados.
```

---

## Passo 46 — Melhorar jogar carta

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Execute apenas o Passo 46: Melhorar experiência do jogador ao jogar carta.

Antes de alterar, inspecione:
- frontend/src/app/player/home/page.tsx
- frontend/src/app/player/home/*.module.css
- frontend/src/services/playService.ts
- frontend/src/services/cardService.ts
- frontend/src/services/roundService.ts
- frontend/src/types/plays.ts
- frontend/src/types/cards.ts

Objetivos:
- destacar rodada ativa;
- listar cartas disponíveis com melhor visual;
- permitir visualizar detalhes da carta;
- pedir confirmação antes de jogar;
- impedir múltiplos cliques;
- mostrar carta jogada após sucesso;
- indicar próximo passo de evidência.

Não altere backend, salvo se encontrar incompatibilidade real de contrato.
Ao final, informe arquivos alterados e comandos de teste.
```

---

## Passo 47 — Melhorar evidências

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Execute apenas o Passo 47: Melhorar envio de evidências.

Antes de alterar, inspecione arquivos de evidenceService, types de evidência e a tela do player.

Objetivos:
- melhorar upload;
- validar arquivo;
- mostrar preview se for imagem;
- impedir envio duplicado;
- exibir status da evidência;
- melhorar erros.

Preserve compatibilidade com o backend atual.
Ao final, informe arquivos alterados e comandos de teste.
```

---

## Passo 48 — Permissões backend

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Execute apenas o Passo 48: Revisar permissões do backend.

Objetivos:
- ADMIN pode gerenciar tudo;
- PLAYER só pode ver dados próprios;
- PLAYER não pode acessar dados de outro jogador;
- endpoints administrativos devem negar PLAYER;
- QuerySets devem filtrar por request.user quando aplicável.

Inspecione todos os ViewSets antes de alterar.
Faça mudanças incrementais.
Ao final, informe arquivos alterados e comandos de teste.
```

---

## Passo 49 — Seeds

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Execute apenas o Passo 49: Criar seeds/dados iniciais.

Crie um comando Django idempotente para popular dados de demonstração:
- admin de teste;
- player de teste;
- grupo;
- cartas;
- jogo;
- rodadas.

O comando deve poder ser executado mais de uma vez sem duplicar dados.
Ao final, informe o comando de uso.
```

---

## Passo 50 — Polimento responsivo

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md.

Execute apenas o Passo 50: Polimento visual e responsivo.

Revise principalmente:
- player/home;
- admin/dashboard;
- admin/players;
- admin/groups;
- admin/games;
- admin/rounds;
- menus;
- tabelas;
- estados vazios.

Não altere regras de negócio.
Ao final, informe arquivos alterados e comandos de teste.
```

---

## Passo 51 — Deploy final

```txt
Leia AGENTS.md, PROJECT_CONTEXT.md, IMPLEMENTATION_PLAN.md e DEPLOYMENT.md.

Execute apenas o Passo 51: Preparação final de deploy.

Revise:
- .env.example;
- configuração do Django Admin em /django-admin/;
- script deploy-cartada;
- documentação de deploy;
- compatibilidade do frontend com NEXT_PUBLIC_API_URL=/api/v1.

Não inclua segredos reais.
Ao final, informe arquivos alterados e comandos de teste.
```
