import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/organisms/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoriaForm } from "@/components/molecules/CategoriaForm";
import { useCategorias, type Categoria } from "@/hooks/useCategorias";

export function CategoriasList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: categoriasData, isLoading } = useCategorias({ page, pageSize });
  const categorias = categoriasData?.items ?? [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
  };

  const columns = useMemo(() => [
    { key: "descricao" as keyof Categoria, header: "Descrição" },
    {
      key: "finalidade" as keyof Categoria,
      header: "Finalidade",
      render: (value: Categoria["finalidade"]) => {
        if (!value) return "";
        const v = String(value);
        if (v === "despesa") return "Despesa";
        if (v === "receita") return "Receita";
        if (v === "ambas") return "Ambas";
        return v;
      },
    },
  ], []);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Adicionar Categoria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Categoria</DialogTitle>
            </DialogHeader>
            <CategoriaForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={categorias}
        pagination={categoriasData ? { total: categoriasData.total, page: categoriasData.page, pageSize: categoriasData.pageSize, onPageChange: setPage } : undefined}
      />
    </div>
  );
}
