# Data Model Summary

## User

Campos esperados:

- username
- email
- first_name
- last_name
- phone
- role
- first_access_completed
- is_active_player
- is_staff
- is_superuser

## PlayerProfile

- user
- nickname
- notes
- is_active
- created_by

## PlayerGroup

- name
- description
- players
- max_players
- is_active
- created_by

## Game

- name
- description
- group
- start_date
- end_date
- duration_days
- status
- evidence_bonus_points
- lowest_card_points
- middle_card_points
- highest_card_points
- max_round_starts_per_player_per_day
- allow_late_play
- show_ranking_to_players
- is_active
- created_by

## Suit

- name
- symbol
- color
- theme
- description
- is_active

## Card

- suit
- value
- code
- title
- description
- instruction
- category
- difficulty
- estimated_minutes
- image
- requires_evidence
- evidence_type
- is_active

## Round

- game
- schedule
- day_number
- date
- starts_at
- ends_at
- selected_suit
- started_by
- status

## Play

- game
- group
- round
- player
- card
- played_at
- is_within_time
- is_round_starter
- base_points
- bonus_points
- total_points
- status
- invalid_reason
- admin_notes

## Evidence

- play
- evidence_type
- file
- text
- status
- reviewed_by
- reviewed_at
- review_notes

## ScoreLog

- player
- game
- group
- round
- play
- action
- previous_points
- new_points
- points_delta
- reason
- created_by
