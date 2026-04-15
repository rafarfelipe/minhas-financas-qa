# BUG-001: Controller captura exceção incorreta para regras de negócio

## Severidade: Alta

## Descrição
O `TransacoesController.Create` captura `ArgumentException` mas **não** captura `InvalidOperationException`.

Quando as regras de negócio da domain lançam `InvalidOperationException` (ex: menor tentando registrar receita, ou transacao com categoria incompatível), a exceção não é tratada pelo controller e resulta em **HTTP 500 Internal Server Error** ao invés de **HTTP 400 Bad Request**.

## Arquivo afetado
`api/MinhasFinancas.API/Controllers/TransacoesController.cs` (linha 63-77)

## Evidência nos testes
- `TransacaoIntegrationTests.CreateAsync_MinorWithReceita_ThrowsInvalidOperationException` — domain lança `InvalidOperationException`
- `TransacaoIntegrationTests.CreateAsync_CategoryMismatch_ThrowsInvalidOperationException` — domain lança `InvalidOperationException`
- `e2e/transacao-flow.spec.ts` — "server returns 500 on category mismatch (BUG-1)"

## Como reproduzir
1. Criar uma pessoa adulta
2. Criar uma categoria de finalidade "Receita"
3. Tentar criar uma transação do tipo "Despesa" usando a categoria de receita
4. A API retorna 500 ao invés de 400

## Regra de negócio afetada
- Categoria só pode ser usada conforme sua finalidade (receita/despesa/ambas)
- Menor de idade não pode ter receitas
