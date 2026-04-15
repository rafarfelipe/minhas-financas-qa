import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console (or send to external service)
    // Keep concise: show toast to the user
    console.error("Unhandled error:", error, errorInfo);
    toast.error(error.message || "Ocorreu um erro inesperado");
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" className="p-4">
            <h2 className="text-lg font-bold">Ocorreu um erro</h2>
            <p className="mt-2">Tente atualizar a página ou contate o administrador.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
