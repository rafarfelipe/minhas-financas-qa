import { LazySelect } from "@/components/atoms/LazySelect";
import { loadPagedFromApi } from "@/lib/apiUtils";
import type { Pessoa } from "@/types/domain";

interface LazyPessoaSelectProps {
  value?: Pessoa | null;
  onChange: (v: Pessoa | null) => void;
  error?: { message?: string } | undefined;
}

export function PessoaSelect({ value, onChange, error }: LazyPessoaSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="pessoa-select" className="text-sm font-medium">Pessoa</label>
      <LazySelect
        placeholder="Pesquisar pessoas..."
        value={value}
        onChange={onChange}
        id="pessoa-select"
        ariaLabel="Lista de pessoas"
        getKey={(p: Pessoa) => p.id}
        renderOption={(p: Pessoa) => p.nome}
        load={({ page, pageSize, search }) => loadPagedFromApi<Pessoa>("/pessoas", { page, pageSize, search })}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
export { PessoaSelect as LazyPessoaSelect };
