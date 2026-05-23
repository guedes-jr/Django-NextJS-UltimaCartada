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

- Apenas ADMIN pode criar jogadores, grupos, jogos, cartas e revisar evidências.
- Apenas ADMIN pode gerar rodadas e pontuar rodadas manualmente.
- Staff/superuser deve ter `role = ADMIN`.

## Banco

- Usar PostgreSQL.
- Usar migrations versionadas.
- Não alterar migrations antigas sem necessidade depois de aplicadas em ambiente compartilhado.
