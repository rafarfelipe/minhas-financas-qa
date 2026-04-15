import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import type { PagedResult } from "@/types/api";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface LazySelectProps<T> {
  value?: T | null;
  onChange: (v: T | null) => void;
  load: (args: { page: number; pageSize: number; search?: string }, signal?: AbortSignal) => Promise<PagedResult<T>>;
  renderOption: (item: T) => string;
  getKey: (item: T) => string;
  placeholder?: string;
  pageSize?: number;
  debounceMs?: number;
  id?: string;
  ariaLabel?: string;
}

export function LazySelect<T>({ value, onChange, load, renderOption, getKey, placeholder = "", pageSize = DEFAULT_PAGE_SIZE, debounceMs = 500, id, ariaLabel }: LazySelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const loadRef = useRef(load);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-positioning logic
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // max-h-64 is 256px + some margin
      if (spaceBelow < 280 && rect.top > spaceBelow) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }
  }, [open]);

  // Update loadRef when load prop changes
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    if (value) setSearch(renderOption(value));
  }, [value, setSearch, renderOption]);

  // Cleanup and lifecycle management
  useEffect(() => {
    // Reset to true on mount/remount (crucial for React Strict Mode in dev)
    isMountedRef.current = true;

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      isMountedRef.current = false;
      document.removeEventListener("mousedown", handleClickOutside);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const fetchData = useCallback(async (nextPage: number, q: string, replace: boolean) => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);

    try {
      const res = await loadRef.current({ page: nextPage, pageSize, search: q || undefined }, abortController.signal);

      if (isMountedRef.current && !abortController.signal.aborted) {
        setTotal(res.total ?? 0);
        setPage(res.page ?? nextPage);
        setItems(prev => (replace ? res.items : [...prev, ...res.items]));
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Ignore abort errors
        return;
      }
      console.error("LazySelect fetch error:", err);
    } finally {
      if (isMountedRef.current && abortControllerRef.current === abortController) {
        setLoading(false);
      }
    }
  }, [pageSize]);

  // Effect to handle search and initial open
  useEffect(() => {
    if (!open && search === "") {
      return;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If typing, use debounce
    if (search !== "") {
      setLoading(true); // Immediate feedback
      debounceTimerRef.current = setTimeout(() => {
        void fetchData(1, search, true);
      }, debounceMs);
    } else if (open && items.length === 0) {
      // Immediate load if opening for the first time with no search
      void fetchData(1, "", true);
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [open, search, fetchData, debounceMs, items.length]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearch(q);
    setItems([]); // Clear results while typing
    setOpen(true);
  }

  function handleSelect(item: T) {
    onChange(item);
    setOpen(false);
  }

  const handleLoadMore = async () => {
    if (loading) return;
    await fetchData(page + 1, search, false);
  };

  const dropdownId = id ? `${id}-options` : `lazy-select-${Math.random().toString(36).slice(2, 9)}-options`;

  // Se houver um valor selecionado e não estivermos pesquisando, mostramos o valor como placeholder ou valor do input
  // Mas para não interferir na pesquisa, vamos usar o placeholder dinâmico se search estiver vazio.
  const displayPlaceholder = value && search === "" ? String(renderOption(value)) : placeholder;
  return (
    <div className="relative" ref={containerRef}>
      <div className="flex space-x-2">
        <input
          id={id}
          aria-label={ariaLabel ?? placeholder}
          aria-controls={dropdownId}
          className="w-full p-2 border rounded"
          placeholder={displayPlaceholder}
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          className="px-3 py-2 border rounded"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={open ? "Fechar lista" : "Abrir lista"}
          onClick={() => { setOpen(o => !o); }}
        >
          {open ? "Fechar" : "Abrir"}
        </button>
      </div>

      {open && (
        <div
          id={dropdownId}
          role="listbox"
          aria-label={ariaLabel ?? "Opções"}
          className={`absolute z-20 w-full bg-background border rounded shadow max-h-64 overflow-auto ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {items.length === 0 && !loading && <div className="p-2 text-sm text-gray-500">Nenhum resultado</div>}
          {items.map(item => (
            <div
              key={getKey(item)}
              role="option"
              aria-selected={value ? getKey(value) === getKey(item) : false}
              className="p-2 hover:bg-primary cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {renderOption(item)}
            </div>
          ))}
          {loading && <div className="p-2"><LoadingSpinner size={18} label="Carregando" /></div>}
          {items.length < total && !loading && (
            <div className="p-2 text-center">
              <button className="px-3 py-1 border rounded text-sm" aria-label="Carregar mais" onClick={() => void handleLoadMore()}>
                Carregar mais
              </button>
            </div>
          )}
        </div>
      )}
      {value && (
        <div className="mt-1 text-sm text-gray-700">Selecionado: {renderOption(value)}</div>
      )}
    </div>
  );
}
