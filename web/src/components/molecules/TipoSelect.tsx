import type { FieldPath, FieldValues, UseFormRegister, FieldError } from "react-hook-form";
import { TipoTransacao } from "@/types/domain";

interface TipoSelectProps<TFormData extends FieldValues> {
  register: UseFormRegister<TFormData>;
  name: FieldPath<TFormData>;
  error?: FieldError | undefined;
  disableReceita?: boolean;
}

export function TipoSelect<TFormData extends FieldValues>({ register, name, error, disableReceita = false }: TipoSelectProps<TFormData>) {
  return (
    <div className="space-y-2">
      <label htmlFor={String(name)} className="text-sm font-medium">Tipo</label>
      <select id={String(name)} {...register(name as FieldPath<TFormData>)} className="select w-full p-2 border rounded">
        <option value={TipoTransacao.Despesa}>Despesa</option>
        <option value={TipoTransacao.Receita} disabled={disableReceita}>Receita</option>
      </select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
