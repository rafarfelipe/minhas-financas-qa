import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transacaoSchema, type TransacaoFormData } from "@/lib/schemas";
import { TipoTransacao } from "@/types/domain";
import toast from "react-hot-toast";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useCreateTransacao } from "@/hooks/useTransacoes";
import { DateInput } from "./DateInput";
import { TipoSelect } from "./TipoSelect";
import { LazyPessoaSelect } from "./LazyPessoaSelect";
import { LazyCategoriaSelect } from "./LazyCategoriaSelect";
import type { Pessoa, Categoria } from "@/types/domain";

interface TransacaoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransacaoForm({ onSuccess, onCancel }: TransacaoFormProps) {
  const createTransacao = useCreateTransacao();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: { tipo: TipoTransacao.Despesa },
  });

  // local selected objects so we can access computed fields (ex: idade)
  const [selectedPessoaObj, setSelectedPessoaObj] = useState<Pessoa | null>(null);
  const [selectedCategoriaObj, setSelectedCategoriaObj] = useState<Categoria | null>(null);

  const selectedPessoa = selectedPessoaObj ?? null;
  const isMinor = selectedPessoa && selectedPessoa.idade < 18;

  // categories filtering is applied when loading categories in the LazySelect

  const onSubmit = async (data: TransacaoFormData) => {
    if (isMinor && data.tipo === TipoTransacao.Receita) {
      toast.error("Menores de 18 anos não podem registrar receitas.");
      return;
    }
    try {
      await createTransacao.mutateAsync(data);
      toast.success("Transação salva com sucesso!");
      onSuccess();
    } catch {
      toast.error("Erro ao salvar transação. Tente novamente.");
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
      <FormField
        label="Valor"
        name="valor"
        type="number"
        step="0.01"
        register={register}
        error={errors.valor}
      />
      <DateInput register={register} name="data" error={errors.data} />
      <div>
        <TipoSelect register={register} name="tipo" error={errors.tipo} disableReceita={!!isMinor} />
        {isMinor && <p className="text-sm text-yellow-600">Menores só podem registrar despesas.</p>}
      </div>
      <LazyPessoaSelect
        value={selectedPessoaObj}
        onChange={(p) => {
          setSelectedPessoaObj(p ?? null);
          setValue("pessoaId", p?.id ?? "");
        }}
        error={errors.pessoaId}
      />
      <LazyCategoriaSelect
        value={selectedCategoriaObj}
        onChange={(c) => {
          setSelectedCategoriaObj(c ?? null);
          setValue("categoriaId", c?.id ?? "");
        }}
        error={errors.categoriaId}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createTransacao.isPending}>
          {createTransacao.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
