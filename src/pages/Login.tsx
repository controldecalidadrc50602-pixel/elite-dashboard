import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/20">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Elite Status</h1>
          <p className="text-slate-400 mt-2">Executive Project Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contrasea de Acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-950/50 border ${error ? 'border-rose-500' : 'border-slate-800'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all`}
                placeholder="Introduzca contrasea..."
              />
            </div>
            {error && <p className="text-rose-500 text-xs mt-2">Acceso denegado. Intente de nuevo.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-lg shadow-cyan-900/20"
          >
            Entrar al Tablero
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Sistemas Corporativos V3
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
