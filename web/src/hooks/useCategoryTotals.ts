import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type CategoryTotal, type CategoriaTipo } from "@/types/domain";
import { type CategoryTotalApiResponse } from "@/types/api";
import { normalizePagedResponse } from "@/lib/apiUtils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * Maps API response to domain CategoryTotal
 */
function mapCategoryTotalResponse(item: CategoryTotalApiResponse): CategoryTotal {
  const saldo = Number(
    item.saldo ??
      item.Saldo ??
      (Number(item.totalReceitas ?? item.TotalReceitas ?? 0) -
        Number(item.totalDespesas ?? item.TotalDespesas ?? 0))
  );

  const tipo: CategoriaTipo = saldo >= 0 ? "Receita" : "Despesa";

  return {
    categoria: item.descricao ?? item.Descricao ?? "",
    total: saldo,
    tipo,
  };
}

/**
 * Hook to fetch category totals for the MonthlySummary component
 * Uses React Query for caching, automatic refetching, and error handling
 */
export function useCategoryTotals(params?: { pageSize?: number }) {
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: ["categoryTotals", { pageSize }],
    queryFn: async (): Promise<CategoryTotal[]> => {
      const response = await api.get("/totais/categorias", {
        params: { pageSize },
      });
      const normalized = normalizePagedResponse<CategoryTotalApiResponse>(
        response.data
      );
      return normalized.items.map(mapCategoryTotalResponse);
    },
    // Stale time of 5 minutes - data won't be refetched on remount unless stale
    staleTime: 5 * 60 * 1000,
    // Retry failed requests 2 times with exponential backoff
    retry: 2,
    // Refetch on window focus for fresh data
    refetchOnWindowFocus: true,
  });
}

// Re-export types for convenience
export type { CategoryTotal, CategoriaTipo };
