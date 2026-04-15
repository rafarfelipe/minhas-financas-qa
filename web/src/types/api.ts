/**
 * Generic paged result type used across API responses.
 * This is the standard shape for paginated API responses.
 */
export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * Generic API error response structure
 */
export type ApiError = {
  message?: string;
  details?: unknown;
};

/**
 * API Response type for Transacao from backend.
 * Uses both camelCase and PascalCase to handle different backend serialization formats.
 */
export interface TransacaoApiResponse {
  id?: string;
  Id?: string;
  descricao?: string;
  Descricao?: string;
  valor?: number;
  Valor?: number;
  tipo?: number;
  Tipo?: number;
  categoriaId?: string;
  CategoriaId?: string;
  pessoaId?: string;
  PessoaId?: string;
  data?: string;
  Data?: string;
  categoriaDescricao?: string;
  CategoriaDescricao?: string;
  pessoaNome?: string;
  PessoaNome?: string;
}

/**
 * API Response type for Categoria from backend.
 * Uses both camelCase and PascalCase to handle different backend serialization formats.
 */
export interface CategoriaApiResponse {
  id?: string;
  Id?: string;
  descricao?: string;
  Descricao?: string;
  finalidade?: number;
  Finalidade?: number;
}

/**
 * API Response type for Pessoa from backend.
 * Uses both camelCase and PascalCase to handle different backend serialization formats.
 */
export interface PessoaApiResponse {
  id?: string;
  Id?: string;
  nome?: string;
  Nome?: string;
  dataNascimento?: string | null;
  DataNascimento?: string | null;
  idade?: number;
  Idade?: number;
}

/**
 * API Response type for category totals from backend
 */
export interface CategoryTotalApiResponse {
  descricao?: string;
  Descricao?: string;
  saldo?: number;
  Saldo?: number;
  totalReceitas?: number;
  TotalReceitas?: number;
  totalDespesas?: number;
  TotalDespesas?: number;
}

/**
 * API Response type for pessoa totals from backend
 */
export interface TotalPorPessoaApiResponse {
  pessoaId?: string;
  PessoaId?: string;
  nome?: string;
  Nome?: string;
  totalReceitas?: number;
  TotalReceitas?: number;
  totalDespesas?: number;
  TotalDespesas?: number;
  saldo?: number;
  Saldo?: number;
}

/**
 * Type alias for backward compatibility.
 * @deprecated Use PagedResult<T> directly instead
 */
export type TransacoesQueryResult = PagedResult<import("./domain").Transacao>;
