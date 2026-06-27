import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { portalService, PortalData } from '../../services/portalService';
import PortalLoading from '../../components/Portal/PortalLoading';
import PortalTrendChart from '../../components/Portal/PortalTrendChart';

// Helper function to calculate luminance and set a contrast color
const getContrastColor = (hexcolor: string) => {
  const hex = hexcolor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

const Portal = () => {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientSlug) return;
    
    // Iniciar loading
    setLoading(true);

    // Live Showcase: Suscripción en tiempo real a Firebase
    const unsubscribe = portalService.subscribeToPortal(clientSlug, (portalData) => {
      if (portalData) {
        setData(portalData);
        document.documentElement.style.setProperty('--brand-primary', portalData.brandColor || '#ffffff');
        document.documentElement.style.setProperty('--brand-contrast', getContrastColor(portalData.brandColor || '#ffffff'));
        setError(null);
      } else {
        setError('Cliente no encontrado');
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      document.documentElement.style.removeProperty('--brand-primary');
      document.documentElement.style.removeProperty('--brand-contrast');
    };
  }, [clientSlug]);

  if (loading) {
    return <PortalLoading clientName={clientSlug} logoUrl={null} />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-thin text-white/50 tracking-wider mb-4">404</h1>
          <p className="text-white/30 font-light">{error || 'Portal no disponible'}</p>
        </div>
      </div>
    );
  }

  // Animaciones escalonadas para el Bento Grid
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  const healthScore = Object.values(data.quarterlyAssessment || {}).reduce((a: any, b: any) => a + (typeof b === 'number' ? b : 0), 0) as number;

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-20 max-w-[1600px] mx-auto text-white overflow-x-hidden">
      
      {/* Background gradients that follow the brand */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div 
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20"
          style={{ background: `var(--brand-primary)` }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{ background: `var(--brand-primary)` }}
        />
      </div>

      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-24 flex items-center gap-8"
      >
        {data.logoUrl && (
          <img src={data.logoUrl} alt="Logo" className="h-24 object-contain drop-shadow-2xl" />
        )}
        {!data.logoUrl && (
           <h1 className="text-5xl md:text-6xl font-thin tracking-tight">{data.client}</h1>
        )}
      </motion.header>

      {/* Asymmetric Bento Grid - Luxury Showcase */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[250px]"
      >
        {/* Item 1: Health Score (Massive Typography) - 2x2 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-12 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold z-10">Health Score Global</h3>
          <div className="z-10 flex flex-col justify-end h-full mt-10">
             <div className="text-9xl md:text-[12rem] font-thin text-[var(--brand-primary)] leading-none tracking-tighter drop-shadow-2xl">
               {healthScore}<span className="text-6xl opacity-30">%</span>
             </div>
          </div>
        </motion.div>

        {/* Item 2: Data Art Trend Chart - 2x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-8 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold mb-4">Tendencia Operativa</h3>
          <div className="flex-1 w-full relative">
            <PortalTrendChart quarterlyAssessment={data.quarterlyAssessment} brandColor={data.brandColor} />
          </div>
        </motion.div>

        {/* Item 3: Servicios Activos - 1x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Servicios</h3>
          <div className="text-8xl font-thin text-white drop-shadow-lg tracking-tighter">
            {data.services?.length || 0}
          </div>
        </motion.div>

        {/* Item 4: Estatus / Health Flag - 1x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Health Flag</h3>
          <div className="text-4xl font-light text-white uppercase tracking-widest" style={{ color: data.brandColor }}>
            {data.healthFlag}
          </div>
        </motion.div>

        {/* Item 5: ADN Tecnológico - 2x1 (Full width on smaller screens, half on large) */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Infraestructura Core</h3>
          <div className="flex flex-col gap-2 mt-4">
            {/* Si opsPulse no está definido, simulamos una lectura elegante. */}
            <div className="text-2xl font-light text-white uppercase tracking-widest border-l-4 pl-4" style={{ borderColor: 'var(--brand-primary)' }}>
               {data.opsPulse?.techDNA?.operationMode || 'Cloud Híbrida'}
            </div>
            <div className="text-sm font-light text-white/50 tracking-widest ml-5">
               {data.opsPulse?.techDNA?.connectivityType || 'Fibra Óptica'} | {data.opsPulse?.techDNA?.internetSpeed || '1000'} Mbps
            </div>
          </div>
        </motion.div>

        {/* Item 6: Evaluaciones (Opcional, llenando el espacio restante) - 2x1 */}
        <motion.div 
           variants={itemVariants} 
           className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl p-10 group hover:border-[var(--brand-primary)]/40 transition-colors duration-700 flex flex-col justify-between"
        >
          <h3 className="text-white/40 uppercase tracking-[0.4em] text-xs font-bold">Última Revisión</h3>
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-4xl font-light text-white uppercase tracking-tight">
               {data.evaluations && data.evaluations.length > 0 ? data.evaluations[data.evaluations.length - 1].date : 'Ciclo Actual'}
            </div>
            <div className="text-sm font-light text-white/50 tracking-widest">
               Sincronización Inteligente Activa
            </div>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default Portal;
