import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TipoTransacao, type Transacao } from "@/types/domain";
import { type TransacaoApiResponse } from "@/types/api";
import type { PagedResult } from "@/types/api";
import { normalizePagedResponse } from "@/lib/apiUtils";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// Re-export types for backward compatibility
export type { Transacao };
export { TipoTransacao };

/** Convert numeric tipo from API to TipoTransacao enum */
function mapTipoTransacao(value: number | undefined): TipoTransacao {
  return value === 1 ? TipoTransacao.Receita : TipoTransacao.Despesa;
}

/** Map API response to domain Transacao */
function mapTransacaoResponse(item: TransacaoApiResponse): Transacao {
  const id = String(item.id ?? item.Id ?? "");
  const descricao = String(item.descricao ?? item.Descricao ?? "");
  const valor = Number(item.valor ?? item.Valor ?? 0);
  const tipo = mapTipoTransacao(item.tipo ?? item.Tipo);
  const categoriaId = String(item.categoriaId ?? item.CategoriaId ?? "");
  const pessoaId = String(item.pessoaId ?? item.PessoaId ?? "");
  const dataVal = item.data ?? item.Data;
  const data = dataVal ? new Date(dataVal) : new Date();
  return { id, descricao, valor, tipo, categoriaId, pessoaId, data };
}

/** @deprecated Use PagedResult<Transacao> directly instead */
export type TransacoesQueryResult = PagedResult<Transacao>;

export function useTransacoes(params?: { page?: number; pageSize?: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: ["transacoes", { page, pageSize }],
    queryFn: async (): Promise<PagedResult<Transacao>> => {
      const response = await api.get("/transacoes", { params: { page, pageSize } });
      const normalized = normalizePagedResponse<TransacaoApiResponse>(response.data);
      const items = normalized.items.map(mapTransacaoResponse);
      return { items, total: normalized.total, page: normalized.page, pageSize: normalized.pageSize };
    },
  });
}

/** Payload type for creating a Transacao */
interface CreateTransacaoPayload {
  Descricao: string;
  Valor: number;
  Tipo: number;
  CategoriaId: string;
  PessoaId: string;
  Data: string | undefined;
}

export function useCreateTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      descricao: string;
      valor: number;
      tipo: TipoTransacao;
      categoriaId: string;
      pessoaId: string;
      data: Date;
    }) => {
      // Convert tipo to numeric enum expected by backend (0 = Despesa, 1 = Receita)
      const tipoNumber = data.tipo === TipoTransacao.Despesa ? 0 : 1;

      const payload: CreateTransacaoPayload = {
        Descricao: data.descricao,
        Valor: data.valor,
        Tipo: tipoNumber,
        CategoriaId: data.categoriaId,
        PessoaId: data.pessoaId,
        Data: data.data ? data.data.toISOString() : undefined,
      };

      const response = await api.post<TransacaoApiResponse>("/transacoes", payload);
      return mapTransacaoResponse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "transacoes" });
    },
    onError: () => {
      // Error handling is done in the component for user feedback
    },
  });
}
