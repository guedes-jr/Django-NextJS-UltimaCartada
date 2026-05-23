# Business Rules

## Papéis

- ADMIN gerencia o sistema.
- PLAYER participa do jogo.

## Rodadas

- Rodadas pertencem a um jogo.
- Rodadas têm data, horário inicial e horário final.
- Rodadas podem ser geradas automaticamente com base no período do jogo e nos horários cadastrados.

## Jogadas

- Jogador só pode jogar em rodada disponível.
- Jogador só pode jogar uma vez por rodada.
- A primeira jogada define o naipe da rodada.
- Demais jogadas devem respeitar o naipe já definido.
- O jogo pode permitir ou bloquear jogada fora do horário.
- Jogador só pode iniciar um número limitado de rodadas por dia.
- Um naipe não deve ser usado mais de uma vez no mesmo dia do jogo.

## Pontuação

- Menor carta recebe pontos configurados em `lowest_card_points`.
- Maior carta recebe pontos configurados em `highest_card_points`.
- Cartas intermediárias recebem `middle_card_points`.
- Evidência aprovada adiciona `evidence_bonus_points`.
- Toda alteração relevante de pontos gera `ScoreLog`.

## Evidências

- PLAYER envia evidência de uma jogada.
- ADMIN aprova ou rejeita.
- Evidência aprovada atualiza bônus da jogada.
- Evidência já revisada não deve ser alterada novamente sem fluxo específico.
