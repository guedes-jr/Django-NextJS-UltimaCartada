# UI Patterns

## Admin pages

Padrão obrigatório:

- Header com título, descrição e botão principal.
- Listagem em card.
- Cadastro em modal.
- Feedback de sucesso acima da listagem.
- Erro no modal quando erro ocorrer no cadastro.
- Estado vazio quando não houver dados.
- Tabela responsiva com `overflow-x`.

## Modal

- Usar componente reutilizável `Modal`.
- Título claro.
- Botão de fechar.
- Conteúdo com scroll interno.
- Mobile com modal encaixado na parte inferior.

## Formulários

- Inputs com labels claros.
- Campos obrigatórios com `required`.
- Máscara em telefone.
- Evitar campo desnecessário.
- Botão fica disabled durante envio.

## Identidade visual

Preto, dourado e branco; reutilize os tokens `--brand-*` de `frontend/src/app/globals.css`. Consulte `../frontend-guidelines.md` e componentes atuais antes de ampliar padrões.
