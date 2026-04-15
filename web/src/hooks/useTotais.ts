import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type TotalPorPessoa } from "@/types/domain";
import type { PagedResult } from "@/types/api";
import { normalizePagedResponse } from "@/lib/apiUtils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// Re-export types for backward compatibility
export type { TotalPorPessoa };

export function useTotaisPessoas(params?: { page?: number; pageSize?: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: ["totais-pessoas", { page, pageSize }],
    queryFn: async (): Promise<PagedResult<TotalPorPessoa>> => {
      const response = await api.get("/totais/pessoas", { params: { page, pageSize } });
      const normalized = normalizePagedResponse<TotalPorPessoa>(response.data);
      return normalized;
    },
  });
}
