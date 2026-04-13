import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: authError } = await login(email, password);
    
    if (authError) {
      setError('Acceso denegado. Verifique sus credenciales.');
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-rc-teal" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-rc-teal/10 rounded-[32px] flex items-center justify-center mb-6 border border-rc-teal/20 shadow-inner">
             <div className="w-12 h-12 bg-rc-teal rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rc-teal/20">Rc</div>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">Elite Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-bold text-[10px] uppercase tracking-[0.3em]">Rc506 Solutions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Correo Electrnico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </div>

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
                className={`w-full bg-slate-950/50 border ${error ? 'border-rose-500' : 'border-slate-800'} rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm`}
                placeholder="********"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-rose-500 text-xs font-medium"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rc-teal hover:shadow-2xl hover:shadow-rc-teal/30 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase text-[10px] tracking-[0.2em]"
          >
            {loading ? 'Validando...' : 'Entrar al Ecosistema'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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
