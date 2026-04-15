import { useTransacoes } from "@/hooks/useTransacoes";
// TipoTransacao imported in TransactionsCard where needed
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { HomeHeader } from "@/components/HomeHeader";
import { StatCards } from "@/components/StatCards";
import { TransactionsCard } from "@/components/TransactionsCard";
import { MonthlySummary } from "@/components/MonthlySummary";
import { currencyFormatter } from "@/lib/formatters";

interface TotalPorCategoria {
  categoriaId?: string;
  descricao?: string;
  totalReceitas?: number;
  totalDespesas?: number;
  // support possible PascalCase coming from backend
  Descricao?: string;
  TotalReceitas?: number;
  TotalDespesas?: number;
}

export function Home() {
  const { data: transacoesData, isLoading } = useTransacoes({ page: 1, pageSize: 5 });
  const transacoes = transacoesData?.items ?? [];

  const now = new Date();
  const month = now.getMonth() + 1; // JS months are 0-based
  const year = now.getFullYear();

  const { data: resumoCategorias, isLoading: isResumoLoading } = useQuery<TotalPorCategoria[]>({
    queryKey: ["resumo-mensal", month, year],
    queryFn: async () => {
      const resp = await api.get<TotalPorCategoria[] | { items: TotalPorCategoria[] }>("/totais/categorias", {
        params: { "periodo.mes": month, "periodo.ano": year, page: 1, pageSize: 10 },
      });

      if (Array.isArray(resp.data)) return resp.data;
      return (resp.data as { items: TotalPorCategoria[] }).items || [];
    },
  });

  const totals = (resumoCategorias ?? []).reduce(
    (acc, c: TotalPorCategoria) => {
      const rece = (c.totalReceitas ?? c.TotalReceitas) ?? 0;
      const desp = (c.totalDespesas ?? c.TotalDespesas) ?? 0;
      acc.receitas += Number(rece) || 0;
      acc.despesas += Number(desp) || 0;

      const descricao = (c.descricao ?? c.Descricao ?? "").toString().toLowerCase();
      if (descricao.includes("invest")) {
        acc.investimentos += (Number(rece) - Number(desp)) || 0;
      }

      return acc;
    },
    { receitas: 0, despesas: 0, investimentos: 0 }
  );

  const saldoAtual = totals.receitas - totals.despesas;

  return (
    <div className="space-y-6">
      <HomeHeader />

      <StatCards currencyFormatter={currencyFormatter} isResumoLoading={isResumoLoading} isLoading={isLoading} saldoAtual={saldoAtual} totals={totals} />

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        <div className="space-y-4">
          <TransactionsCard transacoes={transacoes} isLoading={isLoading} currencyFormatter={currencyFormatter} />
        </div>

        <MonthlySummary currencyFormatter={currencyFormatter} />
      </section>
    </div>
  );
}
