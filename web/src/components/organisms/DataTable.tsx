import type { ReactNode } from "react";
import Pagination from "../atoms/Pagination";

interface Column<T> {
  key: keyof T;
  header: string;
  align?: string;
  render?: (value: unknown, item?: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T = unknown>({
  columns,
  data,
  onEdit,
  onDelete,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto card">
      <table className="min-w-full divide-y data-table" aria-label="Tabela de dados">
        <thead className="data-table thead">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-6 py-3"
                style={{ textAlign: (col.align ?? "left") as "left" | "center" | "right" }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left">Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={String((item as unknown as Record<string, unknown>).id ?? JSON.stringify(item))}>
              {columns.map((col) => {
                const key = col.key as keyof typeof item;
                const value = item[key] as unknown;
                const align = col.align ?? "left";
                return (
                  <td
                    key={col.key as string}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ textAlign: align as "left" | "center" | "right" }}
                  >
                    {col.render ? col.render(value, item) : String(value ?? "")}
                  </td>
                );
              })}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium actions">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="edit"
                        aria-label={`Editar ${String(((item as unknown) as Record<string, unknown>).id ?? "registro")}`}
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="delete"
                        aria-label={`Deletar ${String(((item as unknown) as Record<string, unknown>).id ?? "registro")}`}
                    >
                      Deletar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="px-4 py-2">
          <div className="w-full">
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onPageChange={pagination.onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
