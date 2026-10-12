# Security Checklist

## Autenticação

- Usar JWT com refresh token.
- Proteger rotas no frontend e no backend.
- Validar papel do usuário em todo endpoint sensível.
- Não confiar apenas no `ProtectedRoute`.

## Dados de jogadores/pacientes

- Evitar expor informações sensíveis sem necessidade.
- Restringir player ao próprio desempenho e dados permitidos do grupo.
- Evitar logs com informações pessoais.

## Arquivos e evidências

- Validar tipo e tamanho de arquivo.
- Separar mídia privada da mídia pública quando necessário.
- Evitar permitir execução de arquivos enviados.
- Em produção, preferir storage externo seguro.

## Secrets

- Não versionar `.env`.
- Não versionar chaves de API.
- Não versionar banco local, dumps ou arquivos privados.

## Admin

- Use `User.is_admin_user` e `is_game_staff` conforme a ação, incluindo escopo de grupo para mediadores.
- Confira autorização em queryset, FKs de escrita e ações customizadas.
- Superuser é normalizado para DEV; staff PLAYER para GENERAL_ADMIN em User.save(). Não usar is_staff como permissão de negócio.

## Banco

- Usar PostgreSQL.
- Usar migrations versionadas.
- Não alterar migrations antigas sem necessidade depois de aplicadas em ambiente compartilhado.

## Produtos e validação

- Verifique concessões GAME/MENTORSHIP e validade quando exigidas pelo endpoint.
- Reutilize testes de autorização existentes e amplie para grupos distintos.
- Este checklist é critério de revisão, não certificação de segurança do estado atual.
