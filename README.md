# Minhas Financas - Test Suite

Pirâmide de testes para o sistema "Minhas Financas" (controle de gastos residenciais).

## Estrutura da Pirâmide

```
              E2E (Playwright)
             ~12 tests
          ──────────────────
      Integration (~23 tests)
          ──────────────────
    Unit (~50 tests total)
   Backend Unit (33) + Frontend Unit (17)
```

| Camada | Tecnologia | Arquivos | Foco |
|---|---|---|---|
| Unit (Backend) | xUnit + FluentAssertions | `BackendTests/UnitTests/Tests/` | Domain entities, validation functions |
| Unit (Frontend) | Vitest + Testing Library | `web/src/__tests__/` | Zod schemas, component behavior |
| Integration | xUnit + SQLite in-memory | `BackendTests/IntegrationTests/Tests/` | Service + repository layer, cascade delete |
| E2E | Playwright | `web/e2e/` | Full user flows, bug evidence |

## Como Rodar os Testes

### Pré-requisitos
- .NET 9+ SDK
- Node.js + npm
- SQLite (embutido)

### Backend - Testes Unitários
```bash
cd BackendTests
dotnet test UnitTests/UnitTests.csproj
```

### Backend - Testes de Integração
```bash
cd BackendTests
dotnet test IntegrationTests/IntegrationTests.csproj
```

### Todos os testes backend
```bash
cd BackendTests
dotnet test BackendTests.slnx
```

### Frontend - Testes Unitários (Vitest)
```bash
cd web
npx vitest run
```

### Frontend - E2E (Playwright)
```bash
# A API deve estar rodando em http://localhost:5000
# O frontend deve estar rodando em http://localhost:5173

cd web
npx playwright install  # primeira vez
npx playwright test
npx playwright show-report  # abre o relatório HTML
```

## Bugs Encontrados

### BUG-001: Controller captura exceção incorreta
- **Arquivo**: `evidencias/bugs/BUG-001-controller-catches-wrong-exception.md`
- **Severidade**: Alta
- **Resumo**: `TransacoesController.Create` captura `ArgumentException` mas não `InvalidOperationException`. Regras de negócio violadas (menor com receita, categoria incompatível) retornam HTTP 500 ao invés de 400.
- **Testes que comprovam**: `TransacaoIntegrationTests.CriarAsync_MenorComReceita_LancaInvalidOperationException`, `TransacaoIntegrationTests.CriarAsync_CategoriaIncompativel_LancaInvalidOperationException`, `e2e/transacao-flow.spec.ts` ("servidor retorna 500 em incompatibilidade de categoria (BUG-001)")

### BUG-002: Service não valida data de nascimento
- **Arquivo**: `evidencias/bugs/BUG-002-missing-birth-date-validation.md`
- **Severidade**: Média
- **Resumo**: `PessoaService.CreateAsync`/`UpdateAsync` não chamam `PessoaValidation.ValidarDataNascimento`. O service layer aceita datas de nascimento futuras. A validação só funciona no controller via `ModelState.IsValid`.
- **Testes que comprovam**: `PessoaIntegrationTests.CriarAsync_DataNascimentoFutura_ServiceAceita`, `PessoaValidationTests.ValidarDataNascimento_DataFutura_RetornaErroValidacao`

### BUG-003: Endpoint GET /transacoes retorna 500 por schema desatualizado
- **Arquivo**: `evidencias/bugs/BUG-003-sqlite-schema-missing-data-column.md`
- **Severidade**: Crítica
- **Resumo**: O endpoint `GET /api/v1.0/transacoes` retorna HTTP 500 (`SQLite Error 1: 'no such column: t.Data'`). O banco SQLite foi criado antes da coluna `Data` existir e `EnsureCreated()` não atualiza schema existente.
- **Impacto**: Listagem de transações no frontend não funciona. Testes E2E que verificam lista de transações são afetados.
- **Testes que comprovam**: `e2e/cascade-delete.spec.ts` ("deleting a pessoa also removes their transactions via API" — detecta o 500 e registra o bug)

## Escolhas de Testes

### Por que esses testes?
1. **Foco nas regras de negócio**: Os testes priorizam as regras descritas no escopo (menor sem receita, categoria conforme finalidade, cascade delete)
2. **Cobertura da pirâmide**: Tests unitários validam lógica isolada, integração valida fluxo service/repository, E2E valida o sistema completo
3. **Cada bug tem prova em múltiplas camadas**: BUG-001 é comprovado em teste de integração e E2E; BUG-002 é comprovado em teste unitário (validação existe), integração (service não chama); BUG-003 é detectado pelo E2E test de cascade delete
4. **E2E com abordagem API-first**: Os testes E2E usam a API para criar dados de teste (mais confiável que formulários com validação Zod sensível), focando na verificação de regras de negócio e UI

### Tecnologias
- **Backend**: xUnit, FluentAssertions, NSubstitute (mock), SQLite in-memory
- **Frontend**: Vitest, Testing Library (React), Playwright
- **Evidências**: Playwright HTML report com screenshots, JUnit XML para Vitest, TRX para xUnit

## Evidências de Testes

Os resultados de todas as camadas estão organizados na pasta `evidencias/`:

```
evidencias/
├── e2e-playwright/
│   ├── index.html          ← Playwright HTML report (abrir no navegador)
│   ├── data/               ← Screenshots e traces
│   └── trace/              ← Trace files
├── frontend-unit/
│   └── vitest-junit.xml    ← Relatório JUnit do Vitest (17 testes)
├── backend-unit/
│   └── backend-unit-results.trx  ← Resultados xUnit (33 testes)
├── integration/
│   └── integration-results.trx   ← Resultados integração (23 testes)
└── bugs/
    ├── BUG-001-controller-catches-wrong-exception.md
    ├── BUG-002-missing-birth-date-validation.md
    └── BUG-003-sqlite-schema-missing-data-column.md
```
