# Contratos de API

Base sugerida:

```txt
/api/v1/
```

## Auth

```txt
POST /api/v1/auth/token/
POST /api/v1/auth/token/refresh/
GET  /api/v1/auth/me/
POST /api/v1/auth/admin/players/create/
```

## Players

```txt
GET    /api/v1/players/players/
GET    /api/v1/players/players/{id}/
```

## Groups

```txt
GET    /api/v1/groups/groups/
POST   /api/v1/groups/groups/
GET    /api/v1/groups/groups/{id}/
PATCH  /api/v1/groups/groups/{id}/
DELETE /api/v1/groups/groups/{id}/
```

Payload de criação:

```json
{
  "name": "Grupo A",
  "description": "Grupo inicial",
  "player_ids": [1, 2, 3],
  "max_players": 10,
  "is_active": true
}
```

## Games

```txt
GET    /api/v1/games/games/
POST   /api/v1/games/games/
GET    /api/v1/games/games/{id}/
PATCH  /api/v1/games/games/{id}/
DELETE /api/v1/games/games/{id}/
POST   /api/v1/games/games/{id}/generate-rounds/
```

## Cards

```txt
GET    /api/v1/cards/suits/
GET    /api/v1/cards/cards/
POST   /api/v1/cards/cards/
GET    /api/v1/cards/cards/{id}/
PATCH  /api/v1/cards/cards/{id}/
DELETE /api/v1/cards/cards/{id}/
```

## Rounds

```txt
GET  /api/v1/rounds/schedules/
GET  /api/v1/rounds/rounds/
POST /api/v1/rounds/rounds/{id}/score/
```

## Plays

```txt
GET  /api/v1/plays/plays/
POST /api/v1/plays/plays/
```

Payload de criação:

```json
{
  "round": 1,
  "card": 5
}
```

## Evidences

```txt
GET  /api/v1/evidences/evidences/
POST /api/v1/evidences/evidences/
POST /api/v1/evidences/evidences/{id}/approve/
POST /api/v1/evidences/evidences/{id}/reject/
```

## Scoring

```txt
GET /api/v1/scoring/games/{game_id}/ranking/
GET /api/v1/scoring/games/{game_id}/summary/
GET /api/v1/scoring/games/{game_id}/players/{player_id}/performance/
```
