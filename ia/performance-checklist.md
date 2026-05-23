# Performance Checklist

## Backend

- Usar `select_related` para FKs.
- Usar `prefetch_related` para M2M.
- Usar agregações no banco para ranking e resumo.
- Evitar loop com consulta dentro.
- Paginar listagens grandes.
- Filtrar por jogo/grupo quando possível.

## Frontend

- Não buscar dados repetidos desnecessariamente.
- Services centralizados.
- Carregamento paralelo com `Promise.all` quando fizer sentido.
- Exibir loading e erro sem travar a tela.
- Evitar componentes client quando a página puder ser server, mas aceitar client pages em telas com interação intensa.

## Banco

- Criar índices futuramente para campos usados em filtros frequentes:
  - `game_id`
  - `group_id`
  - `player_id`
  - `round_id`
  - `status`
  - `date`
