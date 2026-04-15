import { z } from "zod";
import { TipoTransacao, Finalidade } from "@/types/domain";

export const pessoaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(200, "Nome deve ter no máximo 200 caracteres"),
  // cast to `unknown` to accommodate different Zod type signatures across versions
  dataNascimento: z.date({ required_error: "Data de nascimento é obrigatória" } as unknown as never),
});

export const categoriaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  finalidade: z.nativeEnum(Finalidade),
});

export const transacaoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  valor: z.number().positive("Valor deve ser positivo"),
  tipo: z.nativeEnum(TipoTransacao),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
  pessoaId: z.string().min(1, "Pessoa é obrigatória"),
  data: z.date({ required_error: "Data da transação é obrigatória" } as unknown as never),
});

export type PessoaFormData = z.infer<typeof pessoaSchema>;
export type CategoriaFormData = z.infer<typeof categoriaSchema>;
export type TransacaoFormData = z.infer<typeof transacaoSchema>;
