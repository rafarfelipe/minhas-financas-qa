import React from "react";

interface Totals {
  receitas: number;
  despesas: number;
  investimentos: number;
}

interface StatCardsProps {
  currencyFormatter: Intl.NumberFormat;
  isResumoLoading: boolean;
  isLoading: boolean;
  saldoAtual: number;
  totals: Totals;
}

export const StatCards = React.memo(function StatCards({ currencyFormatter, isResumoLoading, isLoading, saldoAtual, totals }: StatCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">💰</div>
        <div>
          <div className="text-sm text-white/90">Saldo Atual</div>
          <div className="text-2xl font-bold">{(isResumoLoading || isLoading) ? "Carregando..." : currencyFormatter.format(saldoAtual)}</div>
        </div>
      </div>
      <div className="rounded-xl p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">⬇️</div>
        <div>
          <div className="text-sm text-white/90">Receitas do Mês</div>
          <div className="text-2xl font-bold">{isResumoLoading ? "Carregando..." : currencyFormatter.format(totals.receitas)}</div>
        </div>
      </div>
      <div className="rounded-xl p-5 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">⬆️</div>
        <div>
          <div className="text-sm text-white/90">Despesas do Mês</div>
          <div className="text-2xl font-bold">{isResumoLoading ? "Carregando..." : currencyFormatter.format(totals.despesas)}</div>
        </div>
      </div>
    </section>
  );
});
