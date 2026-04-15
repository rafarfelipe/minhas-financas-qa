import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Pessoa } from "@/types/domain";
import { type PessoaApiResponse } from "@/types/api";
import type { PagedResult } from "@/types/api";
import { normalizePagedResponse } from "@/lib/apiUtils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// Re-export types for backward compatibility
export type { Pessoa };

/** Map API response to domain Pessoa */
function mapPessoaResponse(item: PessoaApiResponse): Pessoa {
  const id = String(item.id ?? item.Id ?? "");
  const nome = String(item.nome ?? item.Nome ?? "");
  const dataNascimentoStr = item.dataNascimento ?? item.DataNascimento;
  const dataNascimento = dataNascimentoStr ? new Date(dataNascimentoStr) : new Date();
  const idade = item.idade ?? item.Idade ?? 0;
  return { id, nome, dataNascimento, idade };
}

/** Type for pessoa data in cache (could be array or paged result) */
type PessoaCacheData =
  | Pessoa[]
  | { items?: Pessoa[]; total?: number };

export function usePessoas(params?: { page?: number; pageSize?: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: ["pessoas", { page, pageSize }],
    queryFn: async (): Promise<PagedResult<Pessoa>> => {
      const response = await api.get("/pessoas", { params: { page, pageSize } });
      const normalized = normalizePagedResponse<PessoaApiResponse>(response.data);
      const items = normalized.items.map(mapPessoaResponse);
      return { ...normalized, items };
    },
  });
}

/** Payload type for creating/updating a Pessoa */
interface PessoaPayload {
  Nome: string;
  DataNascimento: string;
}

function createPessoaPayload(data: { nome: string; dataNascimento: Date }): PessoaPayload {
  return {
    Nome: data.nome,
    DataNascimento: data.dataNascimento.toISOString(),
  };
}

export function useCreatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { nome: string; dataNascimento: Date }) => {
      const payload = createPessoaPayload(data);
      const response = await api.post<PessoaApiResponse>("/pessoas", payload);
      return mapPessoaResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "pessoas" });
    },
    onError: () => {
      // Error handling is done in the component for user feedback
    },
  });
}

export function useUpdatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { nome: string; dataNascimento: Date } }) => {
      const payload = createPessoaPayload(data);
      const response = await api.put<PessoaApiResponse>(`/pessoas/${id}`, payload);
      return mapPessoaResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "pessoas" });
    },
    onError: () => {
      // Error handling is done in the component for user feedback
    },
  });
}

export function useDeletePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pessoas/${id}`);
    },
    // optimistic update: remove from cache immediately
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ predicate: (q) => q.queryKey[0] === "pessoas" });
      const previous = queryClient.getQueriesData<PessoaCacheData>({ queryKey: ["pessoas"] });

      previous.forEach(([key]) => {
        queryClient.setQueryData<PessoaCacheData>(key, (old) => {
          if (!old) return old;
          // support both paged shape { items: [], total } and simple array
          if (Array.isArray(old)) {
            return old.filter((p) => p.id !== id);
          }
          if (old.items) {
            const items = old.items.filter((p) => p.id !== id);
            return { ...old, items, total: typeof old.total === "number" ? Math.max(0, old.total - 1) : old.total };
          }
          return old;
        });
      });

      return { previous };
    },
    onError: (_err, _id, context?: { previous?: Array<[unknown, PessoaCacheData | undefined]> }) => {
      // rollback
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          if (data !== undefined) {
            queryClient.setQueryData(key as readonly unknown[], data);
          }
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "pessoas" });
    },
  });
}
