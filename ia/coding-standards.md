# Coding Standards

## Python/Django

- Usar nomes claros e em inglês para código.
- Usar classes de serviço para regra de negócio.
- Usar type hints quando ajudar a leitura.
- Evitar funções longas.
- Evitar duplicação.
- Usar `transaction.atomic` em fluxos críticos.
- Não criar lógica de negócio em templates ou views administrativas.

## TypeScript/Next.js

- Usar tipos explícitos para payloads e respostas.
- Não usar `any` sem necessidade real.
- Componentes devem ser pequenos e claros.
- Services centralizam chamadas HTTP.
- CSS Modules por página/componente.
- Não usar Tailwind.

## Nomenclatura

- Backend apps: plural quando representar coleção de domínio (`players`, `groups`, `games`, `cards`).
- Services: `NomeDoFluxoService`.
- Serializers: `NomeSerializer`, `NomeCreateSerializer`, `NomeReviewSerializer`.
- Frontend services: `playerService.ts`, `gameService.ts`.
- Types: `players.ts`, `games.ts`, `cards.ts`.

## Commits

Padrão:

```txt
feat: add admin games page
fix: correct user role redirect
refactor: move player form to modal
docs: add ai context files
chore: update project rules
```
