import { LazySelect } from "@/components/atoms/LazySelect";
import { loadPagedFromApi } from "@/lib/apiUtils";
import { TipoTransacao } from "@/types/domain";
import type { Categoria } from "@/types/domain";

interface LazyCategoriaSelectProps {
  value?: Categoria | null;
  onChange: (v: Categoria | null) => void;
  selectedTipo?: TipoTransacao;
  error?: { message?: string } | undefined;
}

export function CategoriaSelect({ value, onChange, selectedTipo, error }: LazyCategoriaSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="categoria-select" className="text-sm font-medium">Categoria</label>
      <LazySelect
        placeholder="Pesquisar categorias..."
        value={value}
        onChange={onChange}
        id="categoria-select"
        ariaLabel="Lista de categorias"
        getKey={(c: Categoria) => c.id}
        renderOption={(c: Categoria) => c.descricao}
        load={({ page, pageSize, search }) => loadPagedFromApi<Categoria>("/categorias", { page, pageSize, search, tipo: selectedTipo })}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
export { CategoriaSelect as LazyCategoriaSelect };
