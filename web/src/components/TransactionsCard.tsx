import { Link } from "react-router-dom";
import { TipoTransacao } from "@/types/domain";

interface Transacao {
  id: string;
  data?: string | Date | null;
  descricao?: string;
  tipo?: string;
  valor: number;
}

interface TransactionsCardProps {
  transacoes: Transacao[];
  isLoading: boolean;
  currencyFormatter: Intl.NumberFormat;
}

export function TransactionsCard({ transacoes, isLoading, currencyFormatter }: TransactionsCardProps) {
  return (
    <div className="card rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Últimas Transações</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/60 text-xs uppercase">
            <th className="text-left py-2 px-2">Data</th>
            <th className="text-left py-2 px-2">Descrição</th>
            <th className="text-left py-2 px-2">Categoria</th>
            <th className="text-right py-2 px-2">Valor</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="py-3 px-2 text-center">Carregando...</td>
            </tr>
          ) : transacoes.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-3 px-2 text-center">Nenhuma transação encontrada</td>
            </tr>
          ) : (
            transacoes.map((t) => (
              <tr key={t.id} className="border-b border-white/[0.04]">
                <td className="py-3 px-2">{t.data ? new Date(t.data).toLocaleDateString("pt-BR") : "-"}</td>
                <td className="py-3 px-2 font-medium">{t.descricao}</td>
                <td className="py-3 px-2">{t.tipo}</td>
                <td className={`py-3 px-2 text-right ${t.tipo === TipoTransacao.Receita ? "text-emerald-400" : "text-red-400"}`}>
                  {currencyFormatter.format(t.valor)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Link to="/transacoes" className="px-5 py-2 rounded-lg hover:bg-blue-700 text-white font-medium transition inline-block text-center">Ver Todas</Link>
      </div>
    </div>
  );
}
