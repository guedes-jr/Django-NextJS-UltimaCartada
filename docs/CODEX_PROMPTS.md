# Prompts para desenvolvimento com Codex

Os prompts abaixo referenciam o contexto atual; substitua os campos entre colchetes. Selecione um recorte do backlog em vez de executar fases históricas inteiras.

## Implementação

```text
Leia AGENTS.md, PROJECT_CONTEXT.md e IMPLEMENTATION_PLAN.md, as instruções
locais do diretório e os guias em ia/ pertinentes à tarefa.

Tarefa: [problema e comportamento esperado].
Recorte: [ID do backlog ou escopo específico].
Aceite: [resultado observável e verificável].

Inspecione o fluxo existente antes de editar. Reutilize services, componentes
e tipos. Preserve stack, URLs, papéis, produtos e CSS Modules. Faça a menor
alteração funcional e execute as validações proporcionais ao impacto.
Ao final, informe arquivos alterados, resultado, comandos executados e limitações.
```

## Diagnóstico e correção

```text
Leia as instruções e inspecione os arquivos relacionados.
Erro: [mensagem sem tokens ou dados pessoais].
Reprodução: [rota, papel/produto, passos e ambiente].
Esperado: [comportamento].
Identifique a causa no fluxo real, faça a correção mínima e verifique a regressão.
Preserve alterações pré-existentes. Não reorganize o projeto nem atualize
bibliotecas sem necessidade demonstrada para resolver o erro.
```

## Backend e autorização

```text
Revise o recorte [descrição] de uma regra específica ou de uma falha identificada.
Confira URLs, serializers, queryset, FKs de escrita, ações customizadas,
helpers de User e produtos ativos. Cubra acesso autorizado e acesso de
terceiros, grupos distintos e mediadores quando aplicável.
Reutilize os testes do domínio; registre comandos e resultados reais.
```

## Frontend e acessibilidade

```text
Ajuste [rota/componente] para [resultado]. Leia frontend/AGENTS.md e confira
services/types e componentes existentes. Preserve a identidade preto/dourado/
branco e sessão atual. Verifique loading, erro, vazio e envio repetido.
Para alterações visuais, valide mobile/desktop, teclado, foco e modais.
Informe quais verificações foram executadas e quais dependeram do ambiente.
```

## Revisão sem alteração

```text
Revise [recorte] sem editar. Leia as instruções e rastreie o fluxo entre página,
service, URL, view, serializer, service de domínio e model conforme necessário.
Priorize falhas reproduzíveis, autorização, integridade e regressões.
Informe arquivo/local, impacto e evidência. Separe problemas de hipóteses.
```

## Continuidade

```text
Retome o item [ID] de IMPLEMENTATION_PLAN.md.
Confira o estado atual e evidências em docs/PROJECT_AUDIT.md antes de implementar.
Não use os planos arquivados como tarefas atuais. Se a funcionalidade já existir,
valide a lacuna específica em vez de recriar o fluxo.
```
