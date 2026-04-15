import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransacaoForm } from '@/components/molecules/TransacaoForm';
import { TipoTransacao } from '@/types/domain';

// Mock the hooks and selects
vi.mock('@/hooks/useTransacoes', () => ({
  useCreateTransacao: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/components/molecules/LazyPessoaSelect', () => ({
  LazyPessoaSelect: ({ value, onChange, error }: { value: any; onChange: (v: any) => void; error?: any }) => (
    <div data-testid="lazy-pessoa-select">
      <select
        data-testid="pessoa-select"
        onChange={(e) => {
          const pessoa = value && value.id === e.target.value ? value : { id: e.target.value, nome: 'Test', idade: 25 };
          onChange(pessoa);
        }}
      >
        <option value="">Select</option>
        <option value="1">Adult</option>
        <option value="2">Minor (age 15)</option>
      </select>
      {error && <span data-testid="pessoa-error">{error.message}</span>}
    </div>
  ),
}));

vi.mock('@/components/molecules/LazyCategoriaSelect', () => ({
  LazyCategoriaSelect: ({ value, onChange }: { value: any; onChange: (v: any) => void }) => (
    <div data-testid="lazy-categoria-select">
      <select
        data-testid="categoria-select"
        onChange={(e) => onChange({ id: e.target.value, descricao: 'Cat' })}
      >
        <option value="">Select</option>
        <option value="1">Categoria</option>
      </select>
    </div>
  ),
}));

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TransacaoForm onSuccess={vi.fn()} onCancel={vi.fn()} />
    </QueryClientProvider>,
  );
}

describe('TransacaoForm', () => {
  it('renders all form fields', () => {
    renderForm();

    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
  });

  it('shows submit and cancel buttons', () => {
    renderForm();

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('has default tipo as Despesa', () => {
    renderForm();

    const tipoSelect = screen.getByLabelText(/tipo/i);
    expect(tipoSelect).toHaveValue('despesa');
  });
});
