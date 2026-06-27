import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PortalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Portal:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-[40px] p-10 text-center backdrop-blur-3xl">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-xl font-light text-white tracking-widest uppercase mb-4">Error de Visualización</h1>
            <p className="text-white/40 text-sm font-light mb-8 leading-relaxed">
              Hemos encontrado un inconveniente técnico al cargar este componente. La información está a salvo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all font-medium tracking-wider uppercase text-xs"
            >
              <RefreshCcw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PortalErrorBoundary;
