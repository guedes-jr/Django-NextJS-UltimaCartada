# Plano de Implementação — Plataforma Web Última Cartada

## Objetivo

Implementar uma aplicação web usando **Python + Django** para digitalizar o jogo **Última Cartada**, usado por uma psicóloga para ajudar pacientes a desenvolverem hábitos saudáveis por meio de gamificação, cartas, rodadas, evidências e pontuação.

A aplicação deverá permitir que a psicóloga gerencie jogadores, grupos, cartas, rodadas, pontos, evidências e desempenho individual/coletivo.

---

## Visão Geral da Aplicação

### Objetivos principais

- [ ] Criar uma plataforma web segura para gerenciamento do jogo.
- [ ] Permitir cadastro de psicólogas, pacientes e grupos.
- [ ] Digitalizar o baralho do jogo.
- [ ] Controlar rodadas diárias automaticamente.
- [ ] Permitir que pacientes joguem cartas dentro dos horários definidos.
- [ ] Permitir envio de evidências por imagem, vídeo ou texto.
- [ ] Calcular pontuação automaticamente.
- [ ] Permitir revisão manual de pontuação pela psicóloga.
- [ ] Exibir ranking individual e por grupo.
- [ ] Gerar relatórios de desempenho.
- [ ] Acompanhar evolução dos hábitos ao longo do jogo.

---

# Fase 1 — Planejamento Técnico Inicial

## Definições do projeto

- [ ] Definir nome oficial da aplicação.
- [ ] Definir identidade visual inicial.
- [ ] Definir se o jogo padrão terá 10 ou 21 dias.
- [ ] Manter duração do jogo configurável no sistema.
- [ ] Definir se o MVP aceitará apenas imagem como evidência ou também vídeo/texto.
- [ ] Definir regra de empate na pontuação.
- [ ] Definir se pacientes poderão ver ranking completo ou apenas a própria pontuação.
- [ ] Definir se a psicóloga poderá criar jogos personalizados.

## Stack recomendada

- [ ] Python.
- [ ] Django.
- [ ] PostgreSQL.
- [ ] Django Templates.
- [ ] Bootstrap 5.
- [ ] HTMX, se necessário.
- [ ] Chart.js para dashboards.
- [ ] Pillow para tratamento de imagens.
- [ ] django-environ para variáveis de ambiente.
- [ ] django-cleanup para remover arquivos antigos.

## Decisão de arquitetura

- [ ] Usar Django monolítico no MVP.
- [ ] Usar Django Admin para gestão inicial.
- [ ] Criar telas customizadas para psicóloga e paciente.
- [ ] Evitar Next.js no MVP para reduzir complexidade.
- [ ] Preparar estrutura para futura API REST, se necessário.

---

# Fase 2 — Estrutura Inicial do Projeto Django

## Criação do projeto

- [ ] Criar ambiente virtual Python.
- [ ] Criar projeto Django.
- [ ] Separar settings em `base.py`, `local.py` e `production.py`.
- [ ] Configurar arquivo `.env`.
- [ ] Configurar PostgreSQL local.
- [ ] Configurar arquivos estáticos.
- [ ] Configurar arquivos de mídia.
- [ ] Configurar timezone para `America/Sao_Paulo` ou fuso adequado.
- [ ] Configurar idioma padrão para `pt-br`.

## Estrutura sugerida

- [ ] Criar pasta `apps/`.
- [ ] Criar app `accounts`.
- [ ] Criar app `players`.
- [ ] Criar app `groups`.
- [ ] Criar app `games`.
- [ ] Criar app `cards`.
- [ ] Criar app `rounds`.
- [ ] Criar app `plays`.
- [ ] Criar app `evidences`.
- [ ] Criar app `scoring`.
- [ ] Criar app `dashboard`.
- [ ] Criar app `reports`.
- [ ] Criar app `notifications`.

## Qualidade inicial

- [ ] Configurar `.gitignore`.
- [ ] Criar `README.md`.
- [ ] Criar `requirements.txt` ou `pyproject.toml`.
- [ ] Configurar lint básico.
- [ ] Configurar formatação de código.
- [ ] Criar primeiro commit Git.

---

# Fase 3 — Autenticação e Permissões

## Usuário customizado

- [ ] Criar modelo customizado de usuário com `AbstractUser`.
- [ ] Adicionar campo de tipo de usuário.
- [ ] Criar papéis: Super Admin, Psicóloga, Paciente e Observador.
- [ ] Configurar login.
- [ ] Configurar logout.
- [ ] Configurar recuperação de senha.
- [ ] Criar controle de usuário ativo/inativo.

## Permissões

- [ ] Super Admin pode acessar tudo.
- [ ] Psicóloga pode acessar apenas seus grupos, pacientes e jogos.
- [ ] Paciente pode acessar apenas seus próprios dados.
- [ ] Observador pode visualizar dados permitidos sem editar.
- [ ] Bloquear URLs administrativas para usuários sem permissão.
- [ ] Criar mixins ou decorators de autorização.

## Segurança inicial

- [ ] Proteger rotas com login obrigatório.
- [ ] Configurar CSRF corretamente.
- [ ] Configurar permissões no Django Admin.
- [ ] Impedir acesso direto a dados de outros pacientes.

---

# Fase 4 — Cadastro de Psicólogas e Pacientes

## Psicólogas

- [ ] Criar perfil de psicóloga.
- [ ] Vincular perfil de psicóloga ao usuário.
- [ ] Criar tela de cadastro de psicóloga no admin.
- [ ] Criar listagem de psicólogas para Super Admin.
- [ ] Criar status ativo/inativo.

## Pacientes/Jogadores

- [ ] Criar modelo `Player`.
- [ ] Vincular jogador a um usuário.
- [ ] Vincular jogador a uma psicóloga responsável.
- [ ] Adicionar nome completo.
- [ ] Adicionar apelido/nome de exibição.
- [ ] Adicionar telefone, se necessário.
- [ ] Adicionar observações internas simples.
- [ ] Criar status ativo/inativo.
- [ ] Criar tela de cadastro de pacientes.
- [ ] Criar listagem de pacientes.
- [ ] Criar edição de paciente.
- [ ] Criar filtro por psicóloga.

## Cuidados com dados sensíveis

- [ ] Evitar armazenar diagnóstico clínico.
- [ ] Evitar armazenar anotações terapêuticas profundas.
- [ ] Armazenar somente dados necessários ao jogo.
- [ ] Criar aviso de privacidade.
- [ ] Criar termo de consentimento, se necessário.

---

# Fase 5 — Grupos de Jogadores

## Modelo de grupo

- [ ] Criar modelo `PlayerGroup`.
- [ ] Adicionar nome do grupo.
- [ ] Vincular grupo à psicóloga responsável.
- [ ] Permitir adicionar vários jogadores.
- [ ] Definir limite padrão de 10 participantes.
- [ ] Permitir alterar limite por grupo.
- [ ] Adicionar status: rascunho, ativo, encerrado.
- [ ] Criar data de criação.

## Gestão de grupo

- [ ] Criar tela de cadastro de grupo.
- [ ] Criar tela de edição de grupo.
- [ ] Criar listagem de grupos.
- [ ] Criar detalhe do grupo.
- [ ] Exibir participantes do grupo.
- [ ] Permitir remover participante.
- [ ] Impedir paciente duplicado no mesmo grupo.
- [ ] Validar limite máximo de participantes.

---

# Fase 6 — Cadastro dos Naipes

## Modelo de naipe

- [ ] Criar modelo `Suit`.
- [ ] Criar campo nome.
- [ ] Criar campo símbolo.
- [ ] Criar campo cor.
- [ ] Criar campo descrição.
- [ ] Criar campo tema comportamental.
- [ ] Criar status ativo/inativo.

## Naipes padrão

- [ ] Criar naipe Copas.
- [ ] Associar Copas a atividades físicas.
- [ ] Criar naipe Paus.
- [ ] Associar Paus a alimentação saudável.
- [ ] Criar naipe Ouros.
- [ ] Associar Ouros a gratidão, respiração e mindfulness.
- [ ] Criar naipe Espadas.
- [ ] Associar Espadas a alegria, comunidade e interação social.

---

# Fase 7 — Cadastro e Importação das Cartas

## Modelo de carta

- [ ] Criar modelo `Card`.
- [ ] Vincular carta a um naipe.
- [ ] Criar campo valor.
- [ ] Criar campo nome.
- [ ] Criar campo descrição.
- [ ] Criar campo instrução da tarefa.
- [ ] Criar campo imagem.
- [ ] Criar campo categoria comportamental.
- [ ] Criar campo nível de dificuldade.
- [ ] Criar campo tempo estimado.
- [ ] Criar campo exige evidência.
- [ ] Criar campo tipo de evidência permitido.
- [ ] Criar campo status ativo/inativo.

## Importação do baralho

- [ ] Padronizar nomes dos arquivos das cartas.
- [ ] Conferir se o baralho terá 48 ou 52 cartas.
- [ ] Validar ausência das cartas Copas 10, J, Q e K, se permanecerem fora do jogo.
- [ ] Criar comando `import_cards`.
- [ ] Ler imagens da pasta de cartas.
- [ ] Criar cartas automaticamente no banco.
- [ ] Associar imagem a cada carta.
- [ ] Permitir reprocessamento sem duplicar cartas.

## Gestão de cartas

- [ ] Criar tela de listagem de cartas.
- [ ] Criar tela de detalhe da carta.
- [ ] Criar tela de edição da carta.
- [ ] Criar filtros por naipe.
- [ ] Criar filtros por categoria.
- [ ] Criar filtros por status.
- [ ] Permitir ativar/desativar carta.

---

# Fase 8 — Configurações do Jogo

## Modelo de configuração

- [ ] Criar estrutura de regras configuráveis.
- [ ] Definir duração padrão do jogo.
- [ ] Definir quantidade de rodadas por dia.
- [ ] Definir horários das rodadas.
- [ ] Definir pontos da menor carta.
- [ ] Definir pontos da maior carta.
- [ ] Definir pontos das cartas intermediárias.
- [ ] Definir pontos extras por evidência aprovada.
- [ ] Definir limite de rodadas iniciadas por jogador por dia.
- [ ] Definir se jogada fora de horário será bloqueada ou registrada com 0 ponto.
- [ ] Definir se ranking será visível para pacientes.
- [ ] Definir prazo de envio de evidência.
- [ ] Definir se desafio surpresa estará habilitado.

## Tela de configuração

- [ ] Criar tela para editar regras do jogo.
- [ ] Criar valores padrão.
- [ ] Permitir copiar configuração de um jogo anterior.
- [ ] Validar horários de rodadas para evitar sobreposição.

---

# Fase 9 — Criação de Jogos/Desafios

## Modelo de jogo

- [ ] Criar modelo `Game`.
- [ ] Adicionar nome do jogo.
- [ ] Adicionar descrição.
- [ ] Vincular jogo a um grupo.
- [ ] Vincular jogo a uma psicóloga.
- [ ] Definir data de início.
- [ ] Definir data de fim.
- [ ] Definir duração em dias.
- [ ] Criar status: rascunho, ativo, finalizado, cancelado.
- [ ] Criar campo de regras customizadas.
- [ ] Criar configuração de ranking visível.
- [ ] Criar configuração de evidência obrigatória.

## Fluxo de criação

- [ ] Psicóloga cria jogo em rascunho.
- [ ] Psicóloga seleciona grupo.
- [ ] Psicóloga define duração.
- [ ] Psicóloga define regras.
- [ ] Sistema valida dados.
- [ ] Sistema gera prévia das rodadas.
- [ ] Psicóloga revisa.
- [ ] Psicóloga ativa jogo.

---

# Fase 10 — Geração de Rodadas

## Modelo de rodada

- [ ] Criar modelo `Round`.
- [ ] Vincular rodada ao jogo.
- [ ] Vincular rodada ao grupo.
- [ ] Criar campo dia do jogo.
- [ ] Criar campo número da rodada.
- [ ] Criar horário inicial.
- [ ] Criar horário final.
- [ ] Criar campo naipe definido.
- [ ] Criar campo jogador que iniciou.
- [ ] Criar status: agendada, aberta, fechada, calculada.

## Modelo de agenda de rodada

- [ ] Criar modelo `RoundSchedule`.
- [ ] Criar campo ordem.
- [ ] Criar campo nome.
- [ ] Criar horário inicial.
- [ ] Criar horário final.

## Rodadas padrão

- [ ] Criar Rodada 1: 06h às 10h.
- [ ] Criar Rodada 2: 10h às 14h.
- [ ] Criar Rodada 3: 14h às 18h.
- [ ] Criar Rodada 4: 18h às 22h.

## Geração automática

- [ ] Ao ativar jogo, gerar rodadas automaticamente.
- [ ] Criar 4 rodadas por dia por padrão.
- [ ] Gerar rodadas conforme duração configurada.
- [ ] Impedir geração duplicada.
- [ ] Permitir recriar rodadas somente em rascunho.

---

# Fase 11 — Registro de Jogadas

## Modelo de jogada

- [ ] Criar modelo `Play`.
- [ ] Vincular jogada à rodada.
- [ ] Vincular jogada ao jogo.
- [ ] Vincular jogada ao grupo.
- [ ] Vincular jogada ao jogador.
- [ ] Vincular jogada à carta.
- [ ] Salvar naipe da carta.
- [ ] Salvar valor da carta.
- [ ] Salvar data/hora da jogada.
- [ ] Salvar se está dentro do horário.
- [ ] Salvar se é jogador iniciador da rodada.
- [ ] Salvar pontuação base.
- [ ] Salvar pontuação extra.
- [ ] Salvar pontuação total.
- [ ] Criar status: pendente, válida, inválida, revisada.
- [ ] Criar motivo de invalidação.
- [ ] Criar observação da psicóloga.

## Regras de validação

- [ ] Validar se o jogo está ativo.
- [ ] Validar se a rodada está aberta.
- [ ] Validar se o jogador pertence ao grupo.
- [ ] Validar se o jogador já jogou na rodada.
- [ ] Validar se a carta está ativa.
- [ ] Validar se a carta pertence ao naipe da rodada, quando já definido.
- [ ] Definir naipe da rodada quando for a primeira jogada.
- [ ] Validar se o jogador pode iniciar rodada.
- [ ] Validar limite de 2 rodadas iniciadas por dia.
- [ ] Validar se o naipe já foi usado no mesmo dia.
- [ ] Registrar tentativa inválida, se necessário.

---

# Fase 12 — Área do Paciente

## Tela inicial do paciente

- [ ] Mostrar jogo ativo.
- [ ] Mostrar grupo atual.
- [ ] Mostrar rodada atual.
- [ ] Mostrar horário da rodada.
- [ ] Mostrar naipe atual, se já definido.
- [ ] Mostrar cartas disponíveis.
- [ ] Mostrar botão para jogar carta.
- [ ] Mostrar botão para enviar evidência.
- [ ] Mostrar pontuação atual.
- [ ] Mostrar mensagem motivacional.

## Tela de cartas

- [ ] Exibir cartas em layout visual.
- [ ] Filtrar cartas permitidas na rodada atual.
- [ ] Permitir filtro por naipe.
- [ ] Permitir filtro por categoria.
- [ ] Marcar cartas indisponíveis.
- [ ] Exibir instrução da tarefa.
- [ ] Confirmar antes de jogar carta.

## Histórico do paciente

- [ ] Mostrar jogadas anteriores.
- [ ] Mostrar cartas jogadas.
- [ ] Mostrar evidências enviadas.
- [ ] Mostrar pontuação recebida.
- [ ] Mostrar status da evidência.
- [ ] Mostrar posição no ranking, se permitido.

---

# Fase 13 — Upload e Validação de Evidências

## Modelo de evidência

- [ ] Criar modelo `Evidence`.
- [ ] Vincular evidência à jogada.
- [ ] Criar campo arquivo.
- [ ] Criar campo tipo: imagem, vídeo ou texto.
- [ ] Criar campo descrição enviada pelo paciente.
- [ ] Criar data/hora de envio.
- [ ] Criar status: pendente, aprovada, rejeitada.
- [ ] Criar campo validado por.
- [ ] Criar data/hora de validação.
- [ ] Criar observação da psicóloga.

## Upload

- [ ] Permitir upload após jogar carta.
- [ ] Validar tamanho máximo do arquivo.
- [ ] Validar extensão permitida.
- [ ] Bloquear arquivos perigosos.
- [ ] Gerar preview da imagem.
- [ ] Armazenar arquivo em pasta protegida.

## Validação pela psicóloga

- [ ] Criar tela de evidências pendentes.
- [ ] Exibir jogador, grupo, carta e rodada.
- [ ] Exibir arquivo enviado.
- [ ] Permitir aprovar evidência.
- [ ] Permitir rejeitar evidência.
- [ ] Permitir adicionar observação.
- [ ] Aplicar pontos extras após aprovação.
- [ ] Remover pontos extras se aprovação for revertida.

---

# Fase 14 — Motor de Pontuação

## Serviços de pontuação

- [ ] Criar serviço para calcular pontuação da rodada.
- [ ] Criar serviço para recalcular pontuação.
- [ ] Criar serviço para calcular ranking.
- [ ] Criar serviço para aplicar pontos extras de evidência.
- [ ] Criar serviço para registrar alterações manuais.

## Regra base

- [ ] Menor carta da rodada recebe 1 ponto.
- [ ] Maior carta da rodada recebe 3 pontos.
- [ ] Cartas intermediárias recebem 2 pontos.
- [ ] Jogador que não jogou recebe 0 ponto.
- [ ] Jogada fora do horário recebe 0 ponto ou é bloqueada.
- [ ] Evidência aprovada adiciona 3 pontos ou valor configurado.

## Empates

- [ ] Definir se empate mantém mesma pontuação.
- [ ] Definir se empate será resolvido pelo horário da jogada.
- [ ] Implementar regra escolhida.
- [ ] Documentar regra no painel do jogo.

## Log de pontuação

- [ ] Criar modelo `ScoreLog`.
- [ ] Registrar pontuação anterior.
- [ ] Registrar pontuação nova.
- [ ] Registrar tipo de alteração.
- [ ] Registrar motivo.
- [ ] Registrar usuário responsável.
- [ ] Registrar data/hora.

---

# Fase 15 — Fechamento de Rodadas

## Fechamento manual no MVP

- [ ] Criar botão para fechar rodada.
- [ ] Validar se horário da rodada terminou.
- [ ] Permitir fechamento forçado pela psicóloga.
- [ ] Calcular pontos da rodada.
- [ ] Atualizar ranking.
- [ ] Marcar rodada como calculada.

## Fechamento automático futuro

- [ ] Configurar Celery.
- [ ] Configurar Redis.
- [ ] Criar tarefa periódica para verificar rodadas vencidas.
- [ ] Fechar rodadas automaticamente.
- [ ] Calcular pontos automaticamente.
- [ ] Enviar notificação após fechamento.

---

# Fase 16 — Painel Administrativo da Psicóloga

## Dashboard geral

- [ ] Mostrar jogos ativos.
- [ ] Mostrar grupos ativos.
- [ ] Mostrar total de pacientes.
- [ ] Mostrar evidências pendentes.
- [ ] Mostrar média de participação do dia.
- [ ] Mostrar ranking parcial.
- [ ] Mostrar alertas importantes.

## Dashboard do grupo

- [ ] Mostrar participantes.
- [ ] Mostrar jogo atual.
- [ ] Mostrar pontuação total do grupo.
- [ ] Mostrar média por jogador.
- [ ] Mostrar participação diária.
- [ ] Mostrar ranking interno.
- [ ] Mostrar rodadas concluídas.
- [ ] Mostrar cartas mais jogadas.
- [ ] Mostrar naipes mais praticados.

## Dashboard individual

- [ ] Mostrar pontuação total do jogador.
- [ ] Mostrar posição no ranking.
- [ ] Mostrar dias ativos.
- [ ] Mostrar rodadas jogadas.
- [ ] Mostrar rodadas perdidas.
- [ ] Mostrar evidências aprovadas.
- [ ] Mostrar evidências pendentes.
- [ ] Mostrar evolução diária.
- [ ] Mostrar pontuação por naipe.
- [ ] Mostrar cartas mais jogadas.
- [ ] Mostrar histórico de atividades.

---

# Fase 17 — Ranking

## Rankings necessários

- [ ] Criar ranking geral do jogo.
- [ ] Criar ranking por grupo.
- [ ] Criar ranking diário.
- [ ] Criar ranking semanal, se necessário.
- [ ] Criar ranking por naipe.
- [ ] Criar ranking por evidências aprovadas.
- [ ] Criar ranking por constância.

## Visibilidade

- [ ] Permitir que psicóloga veja todos os rankings.
- [ ] Permitir configurar se paciente verá ranking completo.
- [ ] Permitir paciente ver apenas sua posição, se configurado.
- [ ] Evitar exposição excessiva quando a psicóloga optar por privacidade.

---

# Fase 18 — Relatórios

## Relatório individual

- [ ] Total de pontos.
- [ ] Participação total.
- [ ] Dias ativos.
- [ ] Rodadas jogadas.
- [ ] Rodadas perdidas.
- [ ] Evidências aprovadas.
- [ ] Evidências rejeitadas.
- [ ] Naipes mais praticados.
- [ ] Naipes menos praticados.
- [ ] Cartas mais usadas.
- [ ] Evolução diária.

## Relatório do grupo

- [ ] Participantes ativos.
- [ ] Média de participação.
- [ ] Pontuação total.
- [ ] Ranking final.
- [ ] Cartas mais jogadas.
- [ ] Naipes mais usados.
- [ ] Dias com maior engajamento.
- [ ] Dias com menor engajamento.

## Exportações

- [ ] Exportar CSV.
- [ ] Exportar Excel.
- [ ] Gerar relatório final em PDF, se necessário.
- [ ] Permitir filtro por período.
- [ ] Permitir filtro por grupo.
- [ ] Permitir filtro por jogador.

---

# Fase 19 — Desafio Surpresa

## Modelo de desafio surpresa

- [ ] Criar modelo `SurpriseChallenge`.
- [ ] Vincular ao jogo.
- [ ] Criar título.
- [ ] Criar descrição.
- [ ] Criar data de início.
- [ ] Criar data final.
- [ ] Criar pontos extras.
- [ ] Definir se exige evidência.
- [ ] Definir participantes elegíveis.
- [ ] Criar status ativo/inativo.

## Participação

- [ ] Permitir paciente participar do desafio surpresa.
- [ ] Permitir envio de evidência.
- [ ] Permitir aprovação pela psicóloga.
- [ ] Adicionar pontos extras ao ranking final.

---

# Fase 20 — Notificações

## Notificações internas

- [ ] Criar notificações dentro do sistema.
- [ ] Notificar início de rodada.
- [ ] Notificar fim próximo da rodada.
- [ ] Notificar evidência pendente.
- [ ] Notificar evidência aprovada.
- [ ] Notificar encerramento do dia.

## E-mail

- [ ] Configurar envio de e-mails.
- [ ] Criar template de boas-vindas.
- [ ] Criar lembrete de rodada.
- [ ] Criar resumo diário.

## WhatsApp futuro

- [ ] Avaliar WhatsApp Business API.
- [ ] Avaliar Evolution API.
- [ ] Avaliar Z-API.
- [ ] Avaliar Twilio.
- [ ] Criar estrutura para integração futura.

---

# Fase 21 — Segurança, Privacidade e Auditoria

## Segurança

- [ ] Usar HTTPS em produção.
- [ ] Configurar `SECURE_SSL_REDIRECT`.
- [ ] Configurar cookies seguros.
- [ ] Configurar proteção CSRF.
- [ ] Configurar proteção contra upload malicioso.
- [ ] Limitar tamanho de arquivos.
- [ ] Restringir acesso aos arquivos de mídia.
- [ ] Usar senhas fortes.
- [ ] Configurar recuperação segura de senha.

## Privacidade

- [ ] Criar política de privacidade.
- [ ] Criar termo de uso.
- [ ] Criar termo de consentimento para participantes.
- [ ] Permitir exclusão de dados quando necessário.
- [ ] Evitar coleta excessiva de informações.

## Auditoria

- [ ] Registrar login de usuários.
- [ ] Registrar criação de jogos.
- [ ] Registrar alteração de regras.
- [ ] Registrar jogadas.
- [ ] Registrar aprovação/rejeição de evidências.
- [ ] Registrar alterações manuais de pontuação.
- [ ] Registrar exclusões importantes.

---

# Fase 22 — Testes

## Testes de modelos

- [ ] Testar criação de usuários.
- [ ] Testar criação de pacientes.
- [ ] Testar criação de grupos.
- [ ] Testar criação de cartas.
- [ ] Testar criação de jogos.
- [ ] Testar geração de rodadas.
- [ ] Testar registro de jogadas.
- [ ] Testar upload de evidências.

## Testes de regra de negócio

- [ ] Testar primeira jogada definindo o naipe.
- [ ] Testar bloqueio de carta com naipe diferente.
- [ ] Testar limite de uma jogada por rodada.
- [ ] Testar limite de rodadas iniciadas por dia.
- [ ] Testar bloqueio de naipe repetido no mesmo dia.
- [ ] Testar jogada fora do horário.
- [ ] Testar cálculo de menor carta.
- [ ] Testar cálculo de maior carta.
- [ ] Testar cálculo de cartas intermediárias.
- [ ] Testar pontos extras por evidência.
- [ ] Testar alteração manual de pontuação.

## Testes de permissão

- [ ] Paciente não pode ver dados de outro paciente.
- [ ] Psicóloga não pode ver grupo de outra psicóloga.
- [ ] Observador não pode editar dados.
- [ ] Super Admin pode acessar tudo.

## Testes de interface

- [ ] Testar em desktop.
- [ ] Testar em celular.
- [ ] Testar em tablet.
- [ ] Testar telas de paciente.
- [ ] Testar telas de psicóloga.
- [ ] Testar upload em mobile.

---

# Fase 23 — Deploy em Produção

## Servidor

- [ ] Escolher VPS.
- [ ] Instalar Ubuntu Server.
- [ ] Criar usuário deploy.
- [ ] Instalar Python.
- [ ] Instalar PostgreSQL.
- [ ] Instalar Nginx.
- [ ] Instalar Gunicorn.
- [ ] Configurar firewall.
- [ ] Configurar domínio.
- [ ] Configurar SSL com Certbot.

## Aplicação

- [ ] Clonar repositório no servidor.
- [ ] Criar ambiente virtual.
- [ ] Instalar dependências.
- [ ] Configurar `.env` de produção.
- [ ] Rodar migrations.
- [ ] Criar superusuário.
- [ ] Coletar arquivos estáticos.
- [ ] Configurar Gunicorn.
- [ ] Configurar systemd.
- [ ] Configurar Nginx.
- [ ] Testar acesso externo.

## Arquivos de mídia

- [ ] Configurar pasta `media`.
- [ ] Configurar permissões corretas.
- [ ] Configurar limite de upload no Nginx.
- [ ] Avaliar storage externo no futuro.

---

# Fase 24 — Backup e Monitoramento

## Backup

- [ ] Criar backup diário do PostgreSQL.
- [ ] Criar backup da pasta `media`.
- [ ] Definir retenção de backups.
- [ ] Testar restauração do banco.
- [ ] Testar restauração dos arquivos.

## Monitoramento

- [ ] Monitorar uso de CPU.
- [ ] Monitorar uso de memória.
- [ ] Monitorar espaço em disco.
- [ ] Monitorar logs do Django.
- [ ] Monitorar logs do Gunicorn.
- [ ] Monitorar logs do Nginx.
- [ ] Criar alerta para disco quase cheio.

---

# Fase 25 — Validação com Grupo Piloto

## Preparação

- [ ] Criar grupo piloto.
- [ ] Cadastrar poucos pacientes reais ou fictícios.
- [ ] Cadastrar cartas principais.
- [ ] Criar jogo curto de teste.
- [ ] Simular 1 ou 2 dias de rodadas.

## Validação prática

- [ ] Validar se pacientes entendem como jogar.
- [ ] Validar se psicóloga consegue acompanhar o painel.
- [ ] Validar se upload de evidências funciona bem.
- [ ] Validar se cálculo de pontos está correto.
- [ ] Validar se ranking faz sentido.
- [ ] Validar se relatórios são úteis.
- [ ] Coletar feedback da psicóloga.
- [ ] Coletar feedback dos pacientes.

## Ajustes finais

- [ ] Corrigir bugs encontrados.
- [ ] Ajustar textos da interface.
- [ ] Melhorar experiência mobile.
- [ ] Ajustar regras conforme feedback.
- [ ] Preparar versão oficial.

---

# MVP Recomendado

## Funcionalidades obrigatórias para primeira versão

- [ ] Login de psicóloga.
- [ ] Login de paciente.
- [ ] Cadastro de pacientes.
- [ ] Cadastro de grupos.
- [ ] Cadastro/importação de cartas.
- [ ] Criação de jogo.
- [ ] Geração de rodadas.
- [ ] Área do paciente para jogar carta.
- [ ] Validação de regras da rodada.
- [ ] Upload de evidência por imagem.
- [ ] Aprovação de evidência pela psicóloga.
- [ ] Cálculo de pontuação.
- [ ] Ranking simples.
- [ ] Dashboard básico.

## Funcionalidades que podem ficar para depois

- [ ] WhatsApp automático.
- [ ] App mobile.
- [ ] IA para feedback personalizado.
- [ ] Exportação PDF avançada.
- [ ] Badges/conquistas.
- [ ] Desafios surpresa avançados.
- [ ] Vídeos como evidência.
- [ ] API REST completa.
- [ ] Frontend em Next.js.

---

# Ordem Recomendada de Desenvolvimento

- [ ] Criar projeto Django.
- [ ] Configurar PostgreSQL.
- [ ] Criar autenticação.
- [ ] Criar usuários e permissões.
- [ ] Criar pacientes.
- [ ] Criar grupos.
- [ ] Criar naipes.
- [ ] Criar cartas.
- [ ] Importar imagens das cartas.
- [ ] Criar jogos.
- [ ] Criar regras configuráveis.
- [ ] Gerar rodadas.
- [ ] Criar área do paciente.
- [ ] Criar registro de jogadas.
- [ ] Criar validações de jogada.
- [ ] Criar cálculo de pontuação.
- [ ] Criar upload de evidências.
- [ ] Criar aprovação de evidências.
- [ ] Criar ranking.
- [ ] Criar dashboard da psicóloga.
- [ ] Criar relatórios básicos.
- [ ] Testar regras principais.
- [ ] Fazer deploy.
- [ ] Rodar grupo piloto.
- [ ] Ajustar com feedback real.

---

# Pontos Críticos do Projeto

- [ ] Garantir que o motor de regras funcione corretamente.
- [ ] Garantir que a pontuação seja confiável.
- [ ] Garantir que a psicóloga consiga revisar e corrigir pontos.
- [ ] Garantir que os pacientes não acessem dados uns dos outros.
- [ ] Garantir que evidências sejam privadas.
- [ ] Garantir backup dos dados.
- [ ] Garantir boa experiência em celular.
- [ ] Garantir que o sistema seja simples para pacientes usarem.

---

# Observações Finais

A prioridade deste projeto deve ser construir primeiro um **MVP funcional, seguro e fácil de usar**.

O ponto mais importante é implementar bem o **motor do jogo**, com regras claras para:

- Naipe da rodada.
- Horário da rodada.
- Limite de jogadas.
- Limite de rodadas iniciadas.
- Pontuação base.
- Pontuação extra por evidência.
- Ranking.
- Auditoria de alterações.

Depois que essa base estiver funcionando, o sistema pode evoluir para notificações por WhatsApp, relatórios avançados, IA, app mobile e gamificação mais sofisticada.
