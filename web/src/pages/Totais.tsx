import { useState, useMemo } from "react";
import { DataTable } from "@/components/organisms/DataTable";
import { useTotaisPessoas, type TotalPorPessoa } from "@/hooks/useTotais";

export function Totais() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);

  const { data: totaisData } = useTotaisPessoas({ page, pageSize });
  const totais = totaisData?.items ?? [];

  const columns = useMemo(() => [
    { key: "nome" as keyof TotalPorPessoa, header: "Pessoa" },
    { key: "totalReceitas" as keyof TotalPorPessoa, header: "Total Receitas", render: (value: unknown) => `R$ ${Number(value).toFixed(2)}` },
    { key: "totalDespesas" as keyof TotalPorPessoa, header: "Total Despesas", render: (value: unknown) => `R$ ${Number(value).toFixed(2)}` },
    { key: "saldo" as keyof TotalPorPessoa, header: "Saldo", render: (value: unknown) => `R$ ${Number(value).toFixed(2)}` },
  ], []);

  const dataWithId = totais.map(total => ({ ...total, id: total.pessoaId }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Totais por Pessoa</h1>
      <DataTable
        columns={columns}
        data={dataWithId}
        pagination={totaisData ? { total: totaisData.total, page: totaisData.page, pageSize: totaisData.pageSize, onPageChange: setPage } : undefined}
      />
    </div>
  );
}