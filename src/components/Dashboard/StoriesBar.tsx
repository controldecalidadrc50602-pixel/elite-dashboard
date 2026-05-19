import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types/project';
import { ChevronLeft, ChevronRight, Search, X, Grid, ShieldAlert } from 'lucide-react';

interface StoriesBarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ projects, selectedProjectId, onSelectProject }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModal, setShowAllModal] = useState(false);

  // Ordenar proyectos por nivel de criticidad de salud
  const sortedProjects = [...projects].sort((a, b) => {
    const healthOrder = { 'Negra': 0, 'Roja': 1, 'Amarilla': 2, 'Verde': 3 };
    return (healthOrder[a.healthFlag as keyof typeof healthOrder] || 4) - 
           (healthOrder[b.healthFlag as keyof typeof healthOrder] || 4);
  });

  // Filtrar burbujas al vuelo si el usuario usa el mini-buscador
  const filteredProjects = sortedProjects.filter(p => 
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Verificar si hay desplazamiento para mostrar/ocultar flechas
  const checkScrollLimits = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 5);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 5
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollLimits);
      // Ejecución inicial después del render
      setTimeout(checkScrollLimits, 300);
    }
    return () => container?.removeEventListener('scroll', checkScrollLimits);
  }, [projects, searchQuery]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getHealthRing = (flag: string, isSelected: boolean) => {
    if (isSelected) return 'border-rc-teal scale-110 shadow-[0_0_20px_rgba(59,188,169,0.4)]';
    switch (flag) {
      case 'Verde': return 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
      case 'Amarilla': return 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      case 'Roja': return 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      case 'Negra': return 'border-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.15)]';
      default: return 'border-white/10';
    }
  };

  // Si hay más de 12 clientes, limitamos la barra principal a 11 y mostramos el selector "+ Ver Todos"
  const limitActive = projects.length > 15;
  const displayedProjects = limitActive && !isSearching 
    ? filteredProjects.slice(0, 12) 
    : filteredProjects;

  const remainingCount = projects.length - displayedProjects.length;

  return (
    <div className="relative w-full group/bar py-2">
      {/* Flechas de Navegación del Carrusel */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-6 z-20 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)] flex items-center justify-center shadow-lg cursor-pointer hover:bg-rc-teal hover:text-black transition-colors"
          >
            <ChevronLeft size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-6 z-20 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)] flex items-center justify-center shadow-lg cursor-pointer hover:bg-rc-teal hover:text-black transition-colors"
          >
            <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contenedor Principal de la Barra */}
      <div className="flex items-center gap-4 w-full">
        {/* Controles de Lupa y Filtro Rápido */}
        {projects.length > 6 && (
          <div className="flex items-center border-r border-[var(--glass-border)] pr-4 gap-2 shrink-0">
            <button
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) setSearchQuery('');
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isSearching 
                  ? 'border-rc-teal bg-rc-teal/10 text-rc-teal' 
                  : 'border-[var(--glass-border)] bg-[var(--card-bg)] text-slate-500 hover:text-[var(--text-primary)] hover:border-rc-teal/30'
              }`}
              title="Buscar Clientes al vuelo"
            >
              {isSearching ? <X size={14} /> : <Search size={14} />}
            </button>
            
            <AnimatePresence>
              {isSearching && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Filtro rápido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--text-primary)] focus:outline-none focus:border-rc-teal/50"
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Scroll Horizontal de Burbujas */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto pb-3 pt-1 no-scrollbar select-none"
        >
          <div className="flex items-center gap-5 px-1 w-max">
            {/* Hub Global */}
            <div 
              onClick={() => onSelectProject(null)}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${
                selectedProjectId === null 
                ? 'border-rc-teal bg-rc-teal/10 scale-110 shadow-[0_0_20px_rgba(59,188,169,0.3)]' 
                : 'border-dashed border-rc-teal/30 bg-rc-teal/[0.02] group-hover:border-rc-teal'
              }`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-rc-teal ${selectedProjectId === null ? 'bg-rc-teal/20' : 'bg-rc-teal/10'}`}>
                  <span className="text-[9px] font-black tracking-widest">HUB</span>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${selectedProjectId === null ? 'text-rc-teal' : 'text-slate-500 group-hover:text-rc-teal'}`}>
                Global
              </span>
            </div>

            {/* Clientes Mapeados */}
            {displayedProjects.map((project, idx) => {
              const isSelected = selectedProjectId === project.id;
              return (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => onSelectProject(project.id)}
                  className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
                >
                  <div className={`p-0.5 rounded-full border-2 transition-all duration-500 ${getHealthRing(project.healthFlag, isSelected)}`}>
                    <div className="w-13 h-13 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center justify-center overflow-hidden relative">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt={project.client} className="w-8 h-8 object-contain relative z-10 filter" />
                      ) : (
                        <span className="text-[11px] font-black text-rc-teal uppercase relative z-10">{project.client.charAt(0)}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                    </div>
                  </div>
                  <span className={`text-[9px] font-black truncate max-w-[65px] tracking-tight transition-colors duration-500 uppercase ${isSelected ? 'text-rc-teal' : 'text-[var(--text-primary)] group-hover:text-rc-teal'}`}>
                    {project.client}
                  </span>
                </motion.div>
              );
            })}

            {/* Burbuja Especial '+ Ver Todos' para Escalabilidad de 100 Clientes */}
            {limitActive && remainingCount > 0 && (
              <motion.div 
                whileHover={{ scale: 1.06 }}
                onClick={() => setShowAllModal(true)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="p-0.5 rounded-full border-2 border-dashed border-slate-500/20 group-hover:border-rc-teal transition-all duration-500">
                  <div className="w-13 h-13 rounded-full bg-[var(--card-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-rc-teal/5 transition-all">
                    <Grid size={16} className="text-slate-500 group-hover:text-rc-teal transition-colors" />
                    <span className="text-[8px] font-bold text-rc-teal mt-0.5">+{remainingCount}</span>
                  </div>
                </div>
                <span className="text-[9px] font-black tracking-tight text-slate-500 group-hover:text-rc-teal transition-colors uppercase">
                  Ver Todos
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Inteligente y Escalable para buscar entre los 100 clientes (Estilo Antigravity) */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[40px] shadow-2xl flex flex-col overflow-hidden p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[var(--glass-border)]">
                <div>
                  <h3 className="text-2xl font-light text-[var(--text-primary)] tracking-tight">Directorio Completo de Clientes</h3>
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Ecosistema Estratégico ({projects.length} en total)</p>
                </div>
                <button 
                  onClick={() => setShowAllModal(false)}
                  className="w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Lupa / Buscador principal */}
              <div className="my-6 p-4 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-2xl flex items-center gap-4 focus-within:border-rc-teal/40 transition-colors">
                <Search size={16} className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Escribe el nombre del cliente o servicio contratado..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--text-primary)] placeholder:text-slate-500 uppercase tracking-wider"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Lista Deslizable */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[45vh]">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project.id);
                          setShowAllModal(false);
                        }}
                        className="p-5 rounded-3xl bg-[var(--card-bg)] border border-[var(--glass-border)] hover:border-rc-teal/40 hover:bg-white/[0.01] transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black/30 rounded-xl flex items-center justify-center p-1.5 border border-[var(--glass-border)] group-hover:border-rc-teal/20 transition-all">
                            {project.logoUrl ? (
                              <img src={project.logoUrl} alt={project.client} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[10px] font-bold text-rc-teal uppercase">{project.client.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-[var(--text-primary)] block uppercase tracking-wider">{project.client}</span>
                            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest mt-1 block">
                              {project.services?.length || 0} Servicios Activos
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            project.healthFlag === 'Verde' ? 'bg-emerald-500 animate-pulse' : 
                            project.healthFlag === 'Amarilla' ? 'bg-amber-500' : 'bg-rose-500'
                          } shadow-[0_0_8px_currentColor]`} />
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            {project.healthFlag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center border border-dashed border-[var(--glass-border)] rounded-3xl bg-[var(--card-bg)]/[0.2]">
                    <ShieldAlert className="text-slate-600 mb-4" size={32} strokeWidth={1.5} />
                    <p className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">Ningún cliente coincide con la búsqueda</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoriesBar;
