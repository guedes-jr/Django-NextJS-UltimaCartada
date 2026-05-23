# Backend Guidelines

## Organização

- Use apps por domínio dentro de `backend/apps`.
- Configure cada app no `INSTALLED_APPS` com caminho completo, exemplo: `apps.accounts`.
- Use imports absolutos, exemplo: `from apps.games.models import Game`.
- Não criar apps genéricos quando existir domínio claro.

## Views

- Use `ModelViewSet` para CRUD.
- Use `ReadOnlyModelViewSet` para listagem/consulta.
- Use `APIView` para endpoints específicos simples.
- Use `@action` em ViewSets para ações de domínio, exemplo: `generate-rounds`, `approve`, `reject`, `score`.
- Sempre validar papel do usuário quando o endpoint for administrativo.

## Serializers

- Valide entrada.
- Formate saída.
- Não coloque regra de negócio complexa.
- Para criação com campos derivados, usar `create` com transação apenas quando for algo simples.
- Para fluxos complexos, chamar services.

## Services

Use services para regras como:

- criar jogador e perfil;
- gerar rodadas;
- criar jogada;
- revisar evidência;
- pontuar rodada;
- calcular ranking e desempenho.

Padrão:

```python
class NomeDoService:
    def executar(self, ...):
        ...
```

Use `@transaction.atomic` em operações que alteram múltiplas tabelas.

## Querysets

- Use `select_related` para FKs.
- Use `prefetch_related` para M2M.
- Use `annotate`, `Count`, `Sum`, `Q` e `Coalesce` para rankings.
- Evite N+1 em dashboards.

## Permissions

- ADMIN pode gerenciar dados.
- PLAYER só acessa seus dados e dados do grupo/jogo em que participa.
- Nunca confiar apenas no frontend para proteção.

## Banco

- Usar PostgreSQL.
- `AUTH_USER_MODEL` deve apontar para o usuário customizado.
- Não trocar o user model depois que migrations forem aplicadas em banco com dados reais.

## Commands

Use management commands para:

- seed de naipes;
- seed de cartas oficiais;
- geração manual auxiliar;
- rotinas de manutenção.
