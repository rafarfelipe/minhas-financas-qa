import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { pessoaSchema, type PessoaFormData } from "@/lib/schemas";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useCreatePessoa, useUpdatePessoa } from "@/hooks/usePessoas";
import { useFormStore } from "@/stores/formStore";
import { useEffect } from "react";
import { formatDateForInput } from "@/lib/formatters";

interface PessoaFormProps {
  pessoa?: { id: string; nome: string; dataNascimento: Date };
  onSuccess: () => void;
  onCancel: () => void;
}

export function PessoaForm({ pessoa, onSuccess, onCancel }: PessoaFormProps) {
  const createPessoa = useCreatePessoa();
  const updatePessoa = useUpdatePessoa();

  const setPessoaForm = useFormStore((s) => s.setPessoaForm);
  const resetPessoaForm = useFormStore((s) => s.resetPessoaForm);
  const pessoaForm = useFormStore((s) => s.pessoaForm);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: pessoa
      ? {
          nome: pessoa.nome,
          dataNascimento: formatDateForInput(pessoa.dataNascimento) as unknown as Date,
        }
      : {
          nome: pessoaForm.nome,
          dataNascimento: formatDateForInput(pessoaForm.dataNascimento) as unknown as Date,
        },
  });

  // sync external store when editing / opening
  useEffect(() => {
    if (pessoa) {
      // populate store
      setPessoaForm({ nome: pessoa.nome, dataNascimento: pessoa.dataNascimento });
      reset({ nome: pessoa.nome, dataNascimento: formatDateForInput(pessoa.dataNascimento) as unknown as Date });
    } else {
      // use persisted store values
      reset({ nome: pessoaForm.nome, dataNascimento: formatDateForInput(pessoaForm.dataNascimento) as unknown as Date });
    }
  }, [pessoa, pessoaForm.nome, pessoaForm.dataNascimento, setPessoaForm, reset]);

  const onSubmit = async (data: PessoaFormData) => {
    try {
      if (pessoa) {
        await updatePessoa.mutateAsync({ id: pessoa.id, data });
        toast.success("Pessoa atualizada com sucesso!");
      } else {
        await createPessoa.mutateAsync(data);
        toast.success("Pessoa salva com sucesso!");
      }
      // clear persisted form
      resetPessoaForm();
      onSuccess();
    } catch {
      toast.error("Erro ao salvar pessoa. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Nome"
        name="nome"
        placeholder="Digite o nome"
        register={register}
        error={errors.nome}
      />
      <FormField
        label="Data de Nascimento"
        name="dataNascimento"
        type="date"
        register={register}
        error={errors.dataNascimento}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => { resetPessoaForm(); onCancel(); }}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createPessoa.isPending || updatePessoa.isPending}>
          {createPessoa.isPending || updatePessoa.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
