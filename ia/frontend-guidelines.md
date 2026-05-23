# Frontend Guidelines

## Stack

- Next.js App Router
- TypeScript
- CSS Modules
- Sem Tailwind CSS

## Organização

```txt
src/
├── app/
│   ├── admin/
│   ├── player/
│   └── login/
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
├── services/
├── types/
└── lib/
```

## Páginas admin

Toda página admin deve seguir o padrão:

- cabeçalho com título, descrição e botão principal;
- listagem/tabela na página;
- cadastro em modal;
- edição em modal;
- confirmação em modal pequeno;
- estados de loading, erro e sucesso.

## Modais

- Todo cadastro deve usar modal.
- Não colocar formulário grande fixo na página.
- Após salvar, fechar modal e atualizar listagem.
- Se ocorrer erro, manter modal aberto e mostrar mensagem clara.

## Services

- Toda chamada de API deve ficar em `src/services`.
- Não chamar `api.get/post` direto dentro de várias páginas sem necessidade.
- Services devem retornar `response.data` já tipado.

## Types

- Contratos devem ficar em `src/types`.
- Criar tipos separados por domínio: `players.ts`, `groups.ts`, `games.ts`, `cards.ts`, `scoring.ts`.

## Autenticação

- Usar `ProtectedRoute` para proteger páginas.
- Rotas admin aceitam apenas `ADMIN`.
- Rotas player aceitam apenas `PLAYER`.
- O redirecionamento deve respeitar o papel retornado pelo backend.

## UI

- Visual limpo, leve e responsivo.
- Usar cores principais do projeto: roxo, lilás claro, verde suave e tons neutros.
- Inputs com bordas arredondadas.
- Cards com sombra suave.
- Tabelas com boa leitura.
- Mobile deve ser considerado desde o início.
