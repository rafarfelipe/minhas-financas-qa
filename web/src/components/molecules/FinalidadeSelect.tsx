import type { FieldPath, FieldValues, UseFormRegister, FieldError } from "react-hook-form";
import { Finalidade } from "@/types/domain";

interface FinalidadeSelectProps<TFormData extends FieldValues> {
  register: UseFormRegister<TFormData>;
  name: FieldPath<TFormData>;
  error?: FieldError | undefined;
}

export function FinalidadeSelect<TFormData extends FieldValues>({ register, name, error }: FinalidadeSelectProps<TFormData>) {
  return (
    <div className="space-y-2">
      <label htmlFor={String(name)} className="text-sm font-medium">Finalidade</label>
      <select id={String(name)} {...register(name as FieldPath<TFormData>)} className="select w-full p-2 border rounded">
        <option value={Finalidade.Despesa}>Despesa</option>
        <option value={Finalidade.Receita}>Receita</option>
        <option value={Finalidade.Ambas}>Ambas</option>
      </select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
