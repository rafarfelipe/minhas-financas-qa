import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/organisms/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransacaoForm } from "@/components/molecules/TransacaoForm";
import { useTransacoes, type Transacao } from "@/hooks/useTransacoes";
import { formatCurrency, formatDate } from "@/lib/formatters";

export function TransacoesList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: transacoesData, isLoading } = useTransacoes({ page, pageSize });
  const transacoes = transacoesData?.items ?? [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
  };

  const columns = useMemo(() => [
    {
      key: "data" as keyof Transacao,
      header: "Data",
      render: (value: unknown) => formatDate(value as string | Date | null),
    },
    { key: "descricao" as keyof Transacao, header: "Descrição" },
    {
      key: "valor" as keyof Transacao,
      header: "Valor",
      align: "right",
      render: (value: unknown) => formatCurrency(value as number),
    },
    {
      key: "tipo" as keyof Transacao,
      header: "Tipo",
      render: (value: unknown) => (String(value) === "receita" ? "Receita" : String(value) === "despesa" ? "Despesa" : String(value)),
    },
    { key: "categoriaDescricao" as keyof Transacao, header: "Categoria" },
    { key: "pessoaNome" as keyof Transacao, header: "Pessoa" },
  ], []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Adicionar Transação</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Transação</DialogTitle>
            </DialogHeader>
            <TransacaoForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={transacoes}
        pagination={
          transacoesData
            ? { total: transacoesData.total, page: transacoesData.page, pageSize: transacoesData.pageSize, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  );
}
