# BUG-002: PessoaService não valida data de nascimento no service layer

## Severidade: Média

## Descrição
`PessoaService.CreateAsync` e `PessoaService.UpdateAsync` **não chamam** `PessoaValidation.ValidarDataNascimento`.

O DTO (`CreatePessoaDto` / `UpdatePessoaDto`) possui o atributo `[CustomValidation(typeof(PessoaValidation), nameof(PessoaValidation.ValidarDataNascimento))]`, que faz a validação funcionar no nível do **controller** (via `ModelState.IsValid`). Porém, se o service for chamado diretamente (ex: por outro service, teste unitário, ou via integração), a validação é ignorada.

## Arquivos afetados
- `api/MinhasFinancas.Application/Services/PessoaService.cs` (linhas 72-92, 97-110)
- `api/MinhasFinancas.Application/DTOs/PessoaDto.cs` (linhas 22-23, 43-44)

## Evidência nos testes
- `PessoaIntegrationTests.CreateAsync_FutureBirthDate_ServiceAcceptsIt` — service layer aceita data futura
- `PessoaValidationTests.ValidarDataNascimento_FutureDate_ReturnsValidationError` — o método de validação funciona corretamente quando chamado
- `PessoaTests.CalcularIdade_FutureBirthDate_NegativeAge` — entity aceita data futura

## Como reproduzir
1. Chamar `PessoaService.CreateAsync` diretamente com `DataNascimento = DateTime.Today.AddDays(30)`
2. A pessoa é criada sem erro

## Regra de negócio afetada
- Data de nascimento não pode estar no futuro
