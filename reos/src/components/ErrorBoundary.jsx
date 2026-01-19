import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 p-4 text-slate-200">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
              System Critical Error
            </h1>
            <p className="mb-8 text-sm text-slate-400">
              The dashboard encountered an unexpected state. Automatic failsafe
              has prevented a complete crash.
            </p>
            <div className="rounded-lg bg-slate-900 p-4 text-left font-mono text-xs text-red-300 border border-red-500/20 w-full mb-6 overflow-auto max-h-32">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
