import { create } from "zustand";

import { TipoTransacao, Finalidade } from "@/types/domain";

interface FormState {
  pessoaForm: {
    nome: string;
    dataNascimento: Date;
  };
  categoriaForm: {
    descricao: string;
    finalidade: Finalidade;
  };
  transacaoForm: {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: string;
    data: Date;
    pessoaId: string;
  };
}

interface FormActions {
  setPessoaForm: (data: Partial<FormState["pessoaForm"]>) => void;
  resetPessoaForm: () => void;
  setCategoriaForm: (data: Partial<FormState["categoriaForm"]>) => void;
  resetCategoriaForm: () => void;
  setTransacaoForm: (data: Partial<FormState["transacaoForm"]>) => void;
  resetTransacaoForm: () => void;
}

const initialState: FormState = {
  pessoaForm: {
    nome: "",
    dataNascimento: new Date(),
  },
  categoriaForm: {
    descricao: "",
    finalidade: Finalidade.Ambas,
  },
  transacaoForm: {
    descricao: "",
    valor: 0,
    tipo: TipoTransacao.Despesa,
    categoriaId: "",
    data: new Date(),
    pessoaId: "",
  },
};

export const useFormStore = create<FormState & FormActions>((set) => ({
  ...initialState,
  setPessoaForm: (data) =>
    set((state) => ({
      pessoaForm: { ...state.pessoaForm, ...data },
    })),
  resetPessoaForm: () => set(() => ({ pessoaForm: initialState.pessoaForm })),
  setCategoriaForm: (data) =>
    set((state) => ({
      categoriaForm: { ...state.categoriaForm, ...data },
    })),
  resetCategoriaForm: () => set(() => ({ categoriaForm: initialState.categoriaForm })),
  setTransacaoForm: (data) =>
    set((state) => ({
      transacaoForm: { ...state.transacaoForm, ...data },
    })),
  resetTransacaoForm: () => set(() => ({ transacaoForm: initialState.transacaoForm })),
}));