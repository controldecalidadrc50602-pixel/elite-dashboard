import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  BrainCircuit, 
  Zap, 
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola, soy el Copilot de Inteligencia RC506. ¿En qué puedo ayudarte a optimizar tu cartera hoy? Puedo analizar riesgos, resumir auditorías o proyectar crecimiento.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulación de respuesta IA
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'He analizado la métrica solicitada. Actualmente, la Calidad Global es del 94%. Te recomiendo enfocar los esfuerzos en las 3 cuentas con bandera Roja para asegurar el cumplimiento del SLA este mes.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    "¿Cuáles son las cuentas críticas?",
    "Resumen de Calidad Global",
    "Próximas renovaciones de servicios",
    "Analizar Churn proyectado"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8 bg-[var(--bg-main)]">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-2xl shadow-rc-teal/20">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight uppercase leading-none">IA Copilot</h1>
            <p className="label-executive mt-1">Inteligencia Predictiva V4.0</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col glass-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rc-teal/[0.02] to-transparent pointer-events-none" />
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                      m.role === 'user' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-rc-teal/10 border-rc-teal/20 text-rc-teal'
                    }`}>
                      {m.role === 'user' ? <MessageSquare size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`p-6 rounded-2xl border ${
                      m.role === 'user'
                      ? 'bg-white/[0.03] border-white/5 text-white'
                      : 'bg-rc-teal/[0.03] border-rc-teal/10 text-slate-200'
                    }`}>
                      <p className="text-[13px] leading-relaxed font-medium">{m.content}</p>
                      <span className="text-[8px] font-medium text-slate-600 uppercase tracking-widest mt-4 block">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal">
                    <RefreshCw size={18} className="animate-spin" />
                  </div>
                  <div className="p-6 bg-rc-teal/[0.02] border border-rc-teal/5 rounded-2xl">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-rc-teal/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-[var(--border-ultra-thin)] bg-black/20">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta algo al Copilot..."
                  className="w-full h-14 bg-[var(--bg-input)] border border-[var(--border-ultra-thin)] rounded-xl px-6 text-sm text-white focus:ring-1 focus:ring-rc-teal/30 focus:border-rc-teal/30 transition-all placeholder:text-slate-600"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Terminal size={14} className="text-slate-700" />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-rc-teal text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-rc-teal/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Panel (Right) */}
        <div className="w-[340px] flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide">
          <div className="glass-card p-8">
            <h3 className="label-executive mb-6 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" /> Sugerencias Rápidas
            </h3>
            <div className="space-y-3">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="w-full p-4 bg-[var(--bg-input)] border border-[var(--border-ultra-thin)] rounded-xl text-left text-[11px] font-medium text-slate-300 hover:border-rc-teal/50 hover:text-white transition-all flex items-center justify-between group"
                >
                  {s}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-rc-teal/[0.02]">
            <h3 className="label-executive mb-6 flex items-center gap-2 text-rc-teal">
              <Zap size={14} /> Capacidades AI
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Análisis de Riesgo', desc: 'Identifica banderas Rojas automáticamente.' },
                { title: 'Resúmenes de Calidad', desc: 'Sintetiza los 10 pilares de auditoría.' },
                { title: 'Alertas de SLA', desc: 'Predice vencimientos de servicios.' }
              ].map(cap => (
                <li key={cap.title} className="space-y-1">
                  <p className="text-[11px] font-semibold text-white uppercase tracking-tight">{cap.title}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{cap.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 flex items-center gap-4 border-emerald-500/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white uppercase tracking-tight">Security Node</p>
              <p className="text-[9px] text-emerald-500/70 font-medium uppercase tracking-widest">Encriptación Activa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCopilot;
