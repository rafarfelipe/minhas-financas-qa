import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransacaoForm } from "@/components/molecules/TransacaoForm";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { currencyFormatter } from "@/lib/formatters";

interface TotalPorCategoriaApi {
  descricao?: string;
  Descricao?: string;
  totalReceitas?: number;
  TotalReceitas?: number;
  totalDespesas?: number;
  TotalDespesas?: number;
}

export function DashboardPanel() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchResumo = async () => {
    const params: Record<string, string | number> = { pageSize: 10 };
    if (startDate) params["periodo.dataInicio"] = startDate;
    if (endDate) params["periodo.dataFim"] = endDate;

    const resp = await api.get("/totais/categorias", { params });
    const result = resp.data;
    if (Array.isArray(result)) return result as TotalPorCategoriaApi[];
    if (result && typeof result === "object") {
      const obj = result as Record<string, unknown>;
      const maybe = obj.items ?? obj.Items ?? obj.data;
      if (Array.isArray(maybe)) return maybe as TotalPorCategoriaApi[];
    }
    return [] as TotalPorCategoriaApi[];
  };

  const { data: resumoCategorias = [], refetch } = useQuery<TotalPorCategoriaApi[]>({
    queryKey: ["dashboard-resumo", startDate, endDate],
    queryFn: fetchResumo,
  });

  const totals = (resumoCategorias ?? []).reduce(
    (acc: { receitas: number; despesas: number; investimentos: number }, c: TotalPorCategoriaApi) => {
      const rece = Number(c.totalReceitas ?? c.TotalReceitas ?? 0) || 0;
      const desp = Number(c.totalDespesas ?? c.TotalDespesas ?? 0) || 0;
      acc.receitas += rece;
      acc.despesas += desp;
      return acc;
    },
    { receitas: 0, despesas: 0, investimentos: 0 }
  );

  const saldoAtual = totals.receitas - totals.despesas;

  const exportCsv = async () => {
    try {
      const items = await fetchResumo();
      const rows = items.map((it) => {
        const descricao = it.descricao ?? it.Descricao ?? "";
        const total = (Number(it.totalReceitas ?? it.TotalReceitas ?? 0) - Number(it.totalDespesas ?? it.TotalDespesas ?? 0)).toString();
        return `"${descricao.replace(/"/g, '""')}",${total}`;
      });
      const header = "Categoria,Saldo";
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resumo-categorias-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar CSV:", err);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Painel</h2>

        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 bg-white/5 rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 bg-white/5 rounded" />
          <Button onClick={() => refetch()}>Filtrar</Button>
          <Button variant="outline" onClick={exportCsv}>Exportar CSV</Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Adicionar Transação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Transação</DialogTitle>
              </DialogHeader>
              <TransacaoForm onSuccess={handleFormSuccess} onCancel={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-white/80">
        <div>Receitas: {currencyFormatter.format(totals.receitas)}</div>
        <div>Despesas: {currencyFormatter.format(totals.despesas)}</div>
        <div>Saldo: {currencyFormatter.format(saldoAtual)}</div>
      </div>
    </div>
  );
}

export default DashboardPanel;
