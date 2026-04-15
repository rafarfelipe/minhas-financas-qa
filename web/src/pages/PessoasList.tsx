import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/organisms/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PessoaForm } from "@/components/molecules/PessoaForm";
import { usePessoas, useDeletePessoa, type Pessoa } from "@/hooks/usePessoas";

export function PessoasList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: pessoasData, isLoading } = usePessoas({ page, pageSize });
  const pessoas = pessoasData?.items ?? [];
  const deletePessoa = useDeletePessoa();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | undefined>();

  const handleEdit = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa);
    setIsDialogOpen(true);
  };

  const handleDelete = async (pessoa: Pessoa) => {
    setPessoaToDelete(pessoa);
    setConfirmOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingPessoa(undefined);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingPessoa(undefined);
  };

  const [pessoaToDelete, setPessoaToDelete] = useState<Pessoa | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const confirmDelete = async () => {
    if (!pessoaToDelete) return;
    try {
      await deletePessoa.mutateAsync(pessoaToDelete.id);
    } catch (error) {
      console.error("Error deleting pessoa:", error);
    } finally {
      setConfirmOpen(false);
      setPessoaToDelete(undefined);
    }
  };

  const columns = useMemo(() => [
    { key: "nome" as keyof Pessoa, header: "Nome" },
    { key: "dataNascimento" as keyof Pessoa, header: "Data de Nascimento", render: (value: unknown) => value instanceof Date ? value.toLocaleDateString() : new Date(value as string).toLocaleDateString() },
    { key: "idade" as keyof Pessoa, header: "Idade" },
  ], []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPessoa(undefined)}>Adicionar Pessoa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPessoa ? "Editar Pessoa" : "Adicionar Pessoa"}</DialogTitle>
            </DialogHeader>
            <PessoaForm
              pessoa={editingPessoa}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={pessoas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pessoasData ? { total: pessoasData.total, page: pessoasData.page, pageSize: pessoasData.pageSize, onPageChange: setPage } : undefined}
      />
          <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deletar Pessoa"
        description={pessoaToDelete ? `Tem certeza que deseja deletar ${pessoaToDelete.nome}?` : ""}
            onConfirm={confirmDelete}
            isLoading={deletePessoa.isPending}
      />
    </div>
  );
}
