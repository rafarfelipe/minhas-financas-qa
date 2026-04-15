
interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [] as number[];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">Mostrando {Math.min(total, (page - 1) * pageSize + 1)} - {Math.min(total, page * pageSize)} de {total}</div>
      <div className="flex items-center space-x-2">
        <button onClick={handlePrev} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${p === page ? "bg-blue-500 text-white" : ""}`}
          >
            {p}
          </button>
        ))}
        <button onClick={handleNext} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Próximo</button>
      </div>
    </div>
  );
}

export default Pagination;
