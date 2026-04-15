import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { categoriaSchema, type CategoriaFormData } from "@/lib/schemas";
import { FinalidadeSelect } from "./FinalidadeSelect";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useCreateCategoria } from "@/hooks/useCategorias";

interface CategoriaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoriaForm({ onSuccess, onCancel }: CategoriaFormProps) {
  const createCategoria = useCreateCategoria();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
  });

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      await createCategoria.mutateAsync(data);
      toast.success("Categoria salva com sucesso!");
      onSuccess();
    } catch {
      toast.error("Erro ao salvar categoria. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Descrição"
        name="descricao"
        placeholder="Digite a descrição"
        register={register}
        error={errors.descricao}
      />
      <FinalidadeSelect register={register} name="finalidade" error={errors.finalidade} />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createCategoria.isPending}>
          {createCategoria.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}