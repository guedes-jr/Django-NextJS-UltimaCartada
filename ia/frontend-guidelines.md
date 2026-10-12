# Padrões do frontend

Leia `../frontend/AGENTS.md` e [architecture.md](architecture.md). Stack: Next.js App Router, React, TypeScript e CSS Modules. Bootstrap já é dependência; isso não autoriza trocar o padrão visual ou adicionar Tailwind.

## Composição

Rotas em `src/app`, HTTP em `src/services`, contratos em `src/types`, sessão em `src/lib/auth.ts`, Axios em `src/lib/api.ts`. Componentes reutilizáveis em `src/components`. Reutilize service equivalente antes de criar um novo.

Pages compõem layout e estado de interação; a regra de jogo é do backend. Use AdminLayout/PlayerLayout e ProtectedRoute conforme papel e produto da tela, seguindo os consumidores existentes. Não liberar todos os papéis administrativos para toda rota.

Preserve o padrão de listagem com cabeçalho, ação principal, cadastro/edição em Modal e confirmação para ações destrutivas. Formulários complexos podem seguir componentes especializados existentes; não force refatoração de uma tela apenas para uniformizar apresentação.

## HTTP e sessão

Services retornam response.data tipado; payloads têm tipos explícitos. Erros são tratados como unknown e refinados com as ferramentas existentes. Preserve FormData em uploads e nomes dos campos do serializer. Não criar fetch nas páginas nem outro cliente de refresh.

LocalStorage, File, URL.createObjectURL e hooks exigem contexto cliente. Revogue URLs de preview ao substituir arquivo/desmontar. Não inserir tokens ou informação pessoal em logs.

## Interface

Use tokens --brand-* de globals.css (preto/dourado/branco) e CSS Module da tela/componente. Inclua estados de loading, erro, vazio e sucesso; mantenha botão desabilitado durante envio. Falha de gravação mantém dados/formulário para correção.

Reutilize Modal, PublicNavigation e componentes de domínio. Valide foco, Esc, aria-expanded/controls, labels, contraste, toque e layout em 320 px quando a UI mudar. Tabelas densas precisam de rolagem local ou cards móveis sem ocultar ações.

Preserve contratos de URL, inclusive `/public/herbilife`. Cache PWA não deve incluir sessão, API, telas ou mídias privadas. Não há runner de testes frontend configurado: lint, tsc, build e verificação manual têm finalidades distintas.
