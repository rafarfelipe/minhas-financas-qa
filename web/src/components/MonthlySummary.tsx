import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { useCategoryTotals } from "@/hooks/useCategoryTotals";
import type { CategoryTotal } from "@/types/domain";

interface MonthlySummaryProps {
  currencyFormatter: Intl.NumberFormat;
  /** Optional retry handler when request failed */
  onRetry?: () => void;
}

export function MonthlySummary({ currencyFormatter, onRetry }: MonthlySummaryProps) {
  const {
    data: categoryTotals,
    isLoading,
    error,
    refetch,
  } = useCategoryTotals({ pageSize: 10 });

  // Handle retry - refetch data and call optional onRetry callback
  const handleRetry = () => {
    refetch();
    if (onRetry) {
      onRetry();
    }
  };

  // Prepare chart data: pick top 10 by absolute value
  const chartData = useMemo(
    () =>
      (categoryTotals ?? [])
        .slice()
        .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
        .slice(0, 10)
        .map((c: CategoryTotal) => ({ name: c.categoria, value: c.total, tipo: c.tipo })),
    [categoryTotals]
  );

  // Extract error message from React Query error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    // React Query wraps errors, try to get a meaningful message
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "object" && error !== null) {
      const maybe = error as { response?: { data?: { message?: string } }; message?: string };
      return maybe.response?.data?.message ?? maybe.message ?? "Erro ao carregar dados";
    }
    return "Erro ao carregar dados";
  }, [error]);

  return (
    <aside className="card rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Resumo Mensal</h3>

      <div className="h-52 flex items-center justify-center mb-4">
        {isLoading ? (
          <div className="text-white/60">Carregando gráfico...</div>
        ) : errorMessage ? (
          <div className="w-full p-4 rounded bg-red-600/10 border border-red-500 text-red-100 flex items-center justify-between">
            <div className="text-sm">
              Ocorreu um erro ao carregar os dados:{" "}
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={handleRetry}
              className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-400 rounded text-white text-sm"
            >
              Tentar novamente
            </button>
          </div>
        ) : chartData.length > 0 ? (
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={2}
                  isAnimationActive={false}
                  label={({ name, value }) =>
                    `${name}: ${currencyFormatter.format(Number(value ?? 0))}`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.tipo === "Receita"
                          ? "#10b981"
                          : entry.tipo === "Despesa"
                          ? "#ef4444"
                          : "#3b82f6"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string | undefined) =>
                    currencyFormatter.format(Number(value ?? 0))
                  }
                />
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  formatter={(value: string) => (
                    <span className="text-white/80">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full border-[16px] border-emerald-500 border-t-blue-500 border-r-orange-500 border-b-red-400 flex items-center justify-center">
            <span className="text-white/40 text-xs">Sem dados</span>
          </div>
        )}
      </div>
    </aside>
  );
}
