# Mapa de Domínios

## accounts

Responsável por usuários, autenticação e papéis.

Entidades principais:

- User
- UserRole

Papéis:

- ADMIN
- PLAYER

Responsabilidades:

- login com usuário/senha;
- retorno do usuário autenticado;
- criação de jogadores pelo admin;
- suporte futuro para login com Google/Gmail;
- separação de acesso por perfil.

## players

Representa o perfil do jogador/paciente.

Entidades principais:

- PlayerProfile

Responsabilidades:

- dados complementares do jogador;
- apelido;
- telefone;
- observações;
- status ativo/inativo.

## groups

Organiza jogadores em grupos.

Entidades principais:

- PlayerGroup

Responsabilidades:

- agrupar jogadores;
- definir limite de participantes;
- permitir jogos por grupo;
- facilitar desempenho coletivo.

## games

Configura o ciclo de um jogo.

Entidades principais:

- Game
- GameStatus

Responsabilidades:

- vincular jogo a um grupo;
- definir período;
- definir duração;
- definir pontuações;
- controlar ranking para jogadores;
- permitir ou bloquear jogadas atrasadas;
- acionar geração de rodadas.

## rounds

Representa as rodadas do jogo.

Entidades principais:

- Round
- RoundSchedule
- RoundStatus

Responsabilidades:

- gerar rodadas por dia e horário;
- controlar status da rodada;
- armazenar naipe selecionado;
- registrar jogador que iniciou a rodada.

## cards

Representa os naipes e cartas/desafios.

Entidades principais:

- Suit
- Card

Responsabilidades:

- cadastrar naipes;
- cadastrar cartas oficiais;
- definir valor, instrução, categoria, dificuldade e tipo de evidência;
- permitir visualização da carta no admin;
- fornecer cartas para jogadas.

## plays

Representa a jogada de um jogador em uma rodada.

Entidades principais:

- Play
- PlayStatus

Responsabilidades:

- registrar carta jogada;
- validar regras da rodada;
- definir se a jogada iniciou a rodada;
- armazenar pontuação base, bônus e total.

## evidences

Representa evidências enviadas pelo jogador.

Entidades principais:

- Evidence
- EvidenceStatus

Responsabilidades:

- receber texto/imagem/vídeo conforme tipo da carta;
- permitir aprovação/rejeição por ADMIN;
- aplicar bônus na jogada quando aprovada.

## scoring

Representa pontuação, logs e relatórios.

Entidades principais:

- ScoreLog
- ScoreLogAction

Responsabilidades:

- pontuar rodadas;
- registrar logs de pontuação;
- calcular ranking;
- calcular desempenho individual;
- calcular resumo do jogo/grupo.
