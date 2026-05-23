# Arquitetura do Projeto

## Visão geral

O projeto Última Cartada / Cartada Viva é uma aplicação web para digitalizar um jogo terapêutico de hábitos saudáveis. O sistema permite que uma psicóloga ou administradora cadastre jogadores, grupos, jogos, cartas, rodadas, jogadas, evidências e acompanhe pontuação/desempenho.

## Stack

### Backend

- Python 3.11+
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- Apps por domínio dentro de `backend/apps`

### Frontend

- Next.js App Router
- TypeScript
- CSS Modules
- Axios ou cliente HTTP centralizado em `src/lib/api`
- Sem Tailwind CSS

## Estrutura backend recomendada

```txt
backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── apps/
│   ├── accounts/
│   ├── players/
│   ├── groups/
│   ├── games/
│   ├── rounds/
│   ├── cards/
│   ├── plays/
│   ├── evidences/
│   └── scoring/
├── manage.py
└── requirements.txt
```

## Estrutura frontend recomendada

```txt
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── player/
│   │   └── login/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   └── ui/
│   ├── services/
│   ├── types/
│   ├── lib/
│   └── styles/
├── package.json
└── next.config.ts
```

## Camadas do backend

### Models

Representam entidades persistidas no banco.

### Serializers

Validam entrada e formatam saída da API. Devem ficar enxutos.

### Views/ViewSets

Controlam transporte HTTP, autenticação, permissionamento e chamam services.

### Services

Concentram regra de negócio:

- criação de jogadas;
- geração de rodadas;
- pontuação;
- revisão de evidências;
- ranking;
- resumo de jogo.

### Management commands

Usados para carga inicial de dados, como naipes, cartas oficiais e geração auxiliar.

## Camadas do frontend

### Pages

Rotas do Next.js. Devem montar tela, controlar estados locais e chamar services.

### Services

Chamadas HTTP centralizadas.

### Types

Contratos TypeScript usados nas páginas e services.

### Components

Componentes reutilizáveis, como `Modal`, layouts e proteção de rotas.

## Princípios

- Separar domínio, transporte e apresentação.
- Evitar lógica de negócio em páginas React.
- Evitar lógica de negócio em serializers/views Django.
- Usar modais para cadastros no painel admin.
- Manter APIs REST previsíveis.
- Projetar pensando em evolução do MVP para produção.
