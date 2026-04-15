import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  // some types in @tanstack/react-query are strict; cast to any to keep runtime options while satisfying TS
  defaultOptions: ({
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Erro ao carregar dados";
        toast.error(message);
      },
    },
    mutations: {
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : "Erro na requisição";
        toast.error(message);
      },
    },
  } as unknown) as never,
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
