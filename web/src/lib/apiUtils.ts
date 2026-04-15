import { api } from "@/lib/api";

/** Represents a generic paged response structure from the API */
export type RawPagedResponse<T> = {
  items?: T[];
  Items?: T[];
  data?: T[];
  total?: number;
  Total?: number;
  totalCount?: number;
  TotalCount?: number;
  page?: number;
  Page?: number;
  pageIndex?: number;
  PageIndex?: number;
  pageSize?: number;
  PageSize?: number;
  page_size?: number;
};

/**
 * Normalizes a paged API response into a standard format.
 * Handles both array responses and object responses with various property naming conventions.
 */
export function normalizePagedResponse<T>(raw: unknown): { items: T[]; total: number; page: number; pageSize: number } {
  if (Array.isArray(raw)) {
    return { items: raw, total: raw.length, page: 1, pageSize: raw.length };
  }

  if (raw && typeof raw === 'object') {
    const obj = raw as RawPagedResponse<T>;
    const maybeItems = obj.items ?? obj.Items ?? obj.data;
    const items = Array.isArray(maybeItems) ? maybeItems : [];

    const total = obj.total ?? obj.Total ?? obj.totalCount ?? obj.TotalCount ?? items.length;
    const page = obj.page ?? obj.Page ?? obj.pageIndex ?? obj.PageIndex ?? 1;
    const pageSize = obj.pageSize ?? obj.PageSize ?? obj.page_size ?? (items.length || 10);

    return { items, total, page, pageSize };
  }

  return { items: [], total: 0, page: 1, pageSize: 10 };
}

/**
 * Maps an enum value using the provided map.
 * Falls back to string conversion if the value is not found in the map.
 */
export function mapEnumValue<T extends Record<string | number, string>>(map: T, value: number | string): string {
  const key = String(value);
  return (map[key] || String(value));
}

/**
 * Loads paged data from the API with the given URL and parameters.
 */
export async function loadPagedFromApi<T>(url: string, params?: Record<string, string | number | undefined>) {
  const response = await api.get(url, { params });
  return normalizePagedResponse<T>(response.data);
}
