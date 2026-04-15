import type { FieldPath, FieldValues, UseFormRegister, FieldError } from "react-hook-form";

interface DateInputProps<TFormData extends FieldValues> {
  register: UseFormRegister<TFormData>;
  name: FieldPath<TFormData>;
  error?: FieldError | undefined;
  label?: string;
}

export function DateInput<TFormData extends FieldValues>({ register, name, error, label = "Data" }: DateInputProps<TFormData>) {
  return (
    <div className="space-y-2">
      <label htmlFor={String(name)} className="text-sm font-medium">{label}</label>
      <input id={String(name)} type="date" {...register(name as FieldPath<TFormData>, { valueAsDate: true })} className="w-full p-2 border rounded" />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
