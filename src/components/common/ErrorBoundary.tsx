import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ELITE ERROR BOUNDARY (ZOHO-ELITE STANDARD)
 * Prevents the entire app from crashing and provides a premium recovery UI.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL UI ERROR:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-10 font-light">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full p-16 bg-[#000000] border border-white/5 rounded-[56px] text-center space-y-10 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rc-teal/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-[32px] flex items-center justify-center text-rose-500 mx-auto">
                <AlertTriangle size={32} strokeWidth={1.5} />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-light text-white tracking-tighter uppercase">Interrupción de Sistema</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.4em] leading-relaxed">
                  Se ha detectado una anomalía en la renderización del módulo.<br/>
                  <span className="text-rose-500/60 font-bold">Error: {this.state.error?.name || 'Desconocido'}</span>
                </p>
              </div>

              <div className="h-px w-20 bg-white/5 mx-auto" />

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-slate-200 active:scale-95 flex items-center justify-center gap-3"
                >
                  <RefreshCcw size={16} /> Reiniciar Instancia
                </button>
                <button 
                  onClick={this.handleReset}
                  className="w-full py-4 bg-white/5 text-slate-400 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:text-white hover:bg-white/10 flex items-center justify-center gap-3 border border-white/5"
                >
                  <Home size={14} /> Volver a Seguridad
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
