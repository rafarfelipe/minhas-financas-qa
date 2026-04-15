import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Finalidade, type Categoria } from "@/types/domain";
import { type CategoriaApiResponse } from "@/types/api";
import type { PagedResult } from "@/types/api";
import { normalizePagedResponse } from "@/lib/apiUtils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// Re-export types for backward compatibility
export type { Categoria };
export { Finalidade };

/** Convert numeric finalidade from API to Finalidade enum */
function mapFinalidade(value: number | undefined): Finalidade {
  if (value === 0) return Finalidade.Despesa;
  if (value === 1) return Finalidade.Receita;
  return Finalidade.Ambas;
}

/** Map API response to domain Categoria */
function mapCategoriaResponse(item: CategoriaApiResponse): Categoria {
  const id = String(item.id ?? item.Id ?? "");
  const descricao = String(item.descricao ?? item.Descricao ?? "");
  const finalidade = mapFinalidade(item.finalidade ?? item.Finalidade);
  return { id, descricao, finalidade };
}

export function useCategorias(params?: { page?: number; pageSize?: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: ["categorias", { page, pageSize }],
    queryFn: async (): Promise<PagedResult<Categoria>> => {
      const response = await api.get("/categorias", { params: { page, pageSize } });
      const normalized = normalizePagedResponse<CategoriaApiResponse>(response.data);
      const items = normalized.items.map(mapCategoriaResponse);
      return { ...normalized, items };
    },
  });
}

/** Payload type for creating a Categoria */
interface CreateCategoriaPayload {
  Descricao: string;
  Finalidade: number;
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { descricao: string; finalidade: Finalidade }) => {
      // Backend expects DTO with PascalCase property names and enum as numeric value
      const finalidadeNumber =
        data.finalidade === Finalidade.Despesa ? 0 : data.finalidade === Finalidade.Receita ? 1 : 2;

      const payload: CreateCategoriaPayload = {
        Descricao: data.descricao,
        Finalidade: finalidadeNumber,
      };

      const response = await api.post<CategoriaApiResponse>("/categorias", payload);
      return mapCategoriaResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "categorias" });
    },
    onError: () => {
      // Error handling is done in the component for user feedback
    },
  });
}
