import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureError } from '../lib/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div class="flex flex-col items-center justify-center rounded-lg border border-red-300 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
          <h2 class="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">Algo salió mal</h2>
          <p class="mb-4 text-sm text-red-600 dark:text-red-300">Ocurrió un error inesperado en este componente.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            class="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}