/**
 * Type alias for ID fields across the application
 */
export type ID = string;

/**
 * Enum representing transaction types
 */
export enum TipoTransacao {
  Despesa = "despesa",
  Receita = "receita",
}

/**
 * Enum representing category finality/purpose
 */
export enum Finalidade {
  Despesa = "despesa",
  Receita = "receita",
  Ambas = "ambas",
}

/**
 * Domain model for Categoria (Category)
 */
export interface Categoria {
  id: ID;
  descricao: string;
  finalidade: Finalidade;
}

/**
 * Domain model for Pessoa (Person)
 */
export interface Pessoa {
  id: ID;
  nome: string;
  dataNascimento: Date;
  idade: number;
}

/**
 * Domain model for Transacao (Transaction)
 */
export interface Transacao {
  id: ID;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: ID;
  pessoaId: ID;
  data: Date;
}

/**
 * Category total type for summary views
 */
export type CategoriaTipo = "Receita" | "Despesa" | "Outro";

/**
 * Category total interface for charts and summaries
 */
export interface CategoryTotal {
  categoria: string;
  total: number;
  tipo: CategoriaTipo;
}

/**
 * Total by person interface for reports
 */
export interface TotalPorPessoa {
  pessoaId: ID;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}
