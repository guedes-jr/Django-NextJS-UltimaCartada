# PROJECT_CONTEXT.md — Contexto funcional do projeto

## Visão geral

Cartada Viva / A Última Cartada é um sistema web para aplicação e gestão de um jogo terapêutico baseado em cartas, hábitos, ações, rodadas e evidências.

A aplicação possui dois perfis principais:

- ADMIN
- PLAYER

O ADMIN gerencia a estrutura do jogo.  
O PLAYER participa das rodadas, joga cartas, envia evidências e acompanha desempenho.

---

## Objetivo do sistema

Permitir que uma psicóloga ou facilitadora conduza jogos com grupos de participantes, usando cartas como desafios ou direcionadores de hábitos. Cada rodada possui ações, cartas e evidências, permitindo acompanhar evolução, engajamento, pontuação e desempenho individual ou por grupo.

---

## Área ADMIN

O administrador pode:

- cadastrar jogadores;
- editar jogadores;
- ativar/inativar jogadores;
- resetar senha de jogadores;
- criar grupos;
- adicionar/remover jogadores em grupos;
- criar jogos;
- ativar/inativar jogos;
- gerar rodadas;
- cadastrar cartas;
- acompanhar jogadas;
- revisar evidências;
- acompanhar desempenho;
- visualizar ranking;
- exportar relatórios;
- alterar configurações da conta.

---

## Área PLAYER

O jogador pode:

- acessar sua área com login;
- trocar senha obrigatória no primeiro acesso quando necessário;
- visualizar jogo ativo;
- visualizar rodada atual;
- visualizar cartas disponíveis;
- jogar uma carta;
- enviar evidência da ação realizada;
- acompanhar desempenho individual;
- visualizar ranking;
- alterar senha.

---

## Fluxo principal do jogo

1. ADMIN cria jogadores.
2. ADMIN cria um grupo.
3. ADMIN vincula jogadores ao grupo.
4. ADMIN cria um jogo para o grupo.
5. ADMIN gera rodadas para o jogo.
6. PLAYER acessa `/player/home`.
7. PLAYER visualiza a rodada ativa.
8. PLAYER escolhe uma carta.
9. PLAYER confirma a jogada.
10. Sistema registra a jogada.
11. PLAYER envia evidência.
12. ADMIN revisa evidência.
13. Sistema atualiza desempenho/ranking.
14. ADMIN acompanha relatórios.

---

## Entidades principais

### User

Usuário de autenticação.

Campos esperados:

- username;
- email;
- password;
- role;
- first_name;
- last_name;
- must_change_password;
- is_active.

### PlayerProfile

Perfil do jogador.

Usado para vínculo com grupos e dados específicos do participante.

### PlayerGroup

Grupo de jogadores.

Regras:

- pode ter vários jogadores;
- pode estar ativo/inativo;
- pode ter limite de jogadores;
- pode ter um responsável/criador.

### Game

Jogo criado para um grupo.

Regras:

- pertence a um grupo;
- possui período de início/fim;
- possui total de rodadas;
- pode estar ativo/inativo.

### Round

Rodada de um jogo.

Regras:

- pertence a um jogo;
- tem número da rodada;
- pode ter status;
- pode ter data de início/fim.

### Card

Carta do jogo.

Regras:

- possui título;
- descrição;
- instrução/ação;
- pontuação;
- naipe/categoria;
- pode estar ativa/inativa.

### Play

Jogada realizada por um jogador.

Regras:

- pertence a jogador;
- pertence a grupo;
- pertence a jogo;
- pertence a rodada;
- pertence a carta;
- deve evitar duplicidade indevida por rodada quando a regra exigir.

### Evidence

Evidência enviada pelo jogador.

Regras:

- pertence a uma jogada;
- pode conter arquivo/imagem/texto;
- possui status de revisão;
- pode ser aprovada/rejeitada pelo ADMIN.

---

## Regras de permissão

### ADMIN

Pode:

- ver todos os jogadores;
- ver todos os grupos;
- ver todos os jogos;
- ver todas as rodadas;
- ver todas as jogadas;
- ver todas as evidências;
- criar/editar/inativar recursos.

### PLAYER

Pode:

- ver apenas os próprios dados;
- ver grupos dos quais participa;
- ver jogos dos seus grupos;
- ver rodadas dos jogos dos seus grupos;
- criar jogadas apenas para si mesmo;
- enviar evidências apenas para suas jogadas;
- ver próprio desempenho.

PLAYER não pode:

- acessar dados de outros jogadores;
- alterar grupo;
- alterar jogo;
- alterar carta;
- revisar evidência;
- acessar relatórios administrativos.

---

## Regras de UX

### Admin

- Telas devem ser objetivas.
- Tabelas precisam ter estado vazio.
- Ações destrutivas precisam ser claras.
- Erros precisam ser exibidos na tela.
- Evitar travamento em carregamento infinito.

### Player

- Fluxo deve ser simples.
- A rodada atual precisa estar clara.
- A carta jogada precisa estar clara.
- Botão de jogar precisa impedir múltiplos cliques.
- Após jogar, indicar próximo passo: envio da evidência.
- Evidência precisa ter feedback visual de status.

---

## Estado atual conhecido

O projeto já possui:

- autenticação JWT;
- refresh token no frontend;
- landing page pública;
- área admin;
- área player;
- gestão de jogadores;
- gestão de grupos;
- gestão de jogos;
- gestão de rodadas;
- gestão de cartas;
- gestão de jogadas;
- evidências;
- ranking;
- relatórios;
- configurações;
- deploy planejado para VPS Hostinger.

---

## Pontos críticos conhecidos

1. Django Admin não deve usar `/admin/`, pois isso conflita com o admin do Next.js.
2. Produção deve usar `NEXT_PUBLIC_API_URL=/api/v1`.
3. Nginx deve encaminhar `/api/` para Django.
4. Next.js precisa de `npm run build` e `npm run start`.
5. O diretório `.next` pode corromper em desenvolvimento; quando isso ocorrer, remover `.next`.
6. A VPS precisa ter chave SSH autorizada no GitHub para `git pull` via SSH.
7. PLAYER deve ter QuerySets filtrados por usuário.
