import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Root error boundary (spec §26 / R20): never show a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep logs generic; never leak internals to users (R18).
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ error: null });
    window.location.assign('/');
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-bg p-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
            <h1 className="text-lg font-semibold text-fg">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted">
              An unexpected error occurred. You can return to the home page and try again.
            </p>
            <button
              onClick={this.handleReset}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-fg transition hover:opacity-90"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
