# BUG-003: Endpoint GET /transacoes retorna 500 por schema desatualizado do SQLite

## Severidade: Crítica

## Descrição
O endpoint `GET /api/v1.0/transacoes` retorna **HTTP 500 Internal Server Error** com a mensagem:

```
SQLite Error 1: 'no such column: t.Data'.
```

O banco de dados SQLite (`minhasfinancas.db`) foi criado antes da coluna `Data` ser adicionada à entidade `Transacao`. Como a aplicação usa `Database.EnsureCreated()` em vez de migrations, o schema do banco **não é atualizado automaticamente** quando a aplicação reinicia.

## Arquivo afetado
- `api/MinhasFinancas.Infrastructure/Data/MinhasFinancasDbContext.cs` — configura `.HasColumnType("date")` para `t.Data` (linha 60-63)
- `api/MinhasFinancas.API/Program.cs` — usa `EnsureCreated()` (linha 56)

## Evidência nos testes
```bash
curl http://localhost:5000/api/v1.0/transacoes?page=1&pageSize=5
# Retorna: SQLite Error 1: 'no such column: t.Data'.
```

## Como reproduzir
1. Iniciar a API (`dotnet run` em `api/MinhasFinancas.API`)
2. Executar `GET /api/v1.0/transacoes`
3. Resposta: HTTP 500 com erro de SQLite

## Impacto
- Listagem de transações no frontend **não funciona**
- Consulta de totais por pessoa/categoria pode retornar dados inconsistentes
- Testes E2E que verificam transações na lista falham

## Sugestão de correção
- Usar EF Core Migrations ao invés de `EnsureCreated()`, ou
- Deletar o arquivo `minhasfinancas.db` e reiniciar a API para recriar o banco com o schema correto
