import type { FieldError, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps<TFormData extends FieldValues> {
  label: string;
  name: FieldPath<TFormData>;
  type?: string;
  placeholder?: string;
  step?: string;
  error?: FieldError;
  register: UseFormRegister<TFormData>;
}

export function FormField<TFormData extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  step,
  error,
  register,
}: FormFieldProps<TFormData>) {
  const regProps =
    type === "date"
      ? register(name as FieldPath<TFormData>, { valueAsDate: true })
      : type === "number"
      ? register(name as FieldPath<TFormData>, { valueAsNumber: true })
      : register(name as FieldPath<TFormData>);
      
  return (
    <div className="space-y-2">
      <Label htmlFor={String(name)}>{label}</Label>
      <Input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        step={step}
        {...regProps}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
