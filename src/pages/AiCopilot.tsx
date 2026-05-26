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
  Terminal,
  FileText,
  Clock,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Bóveda de minutas predefinidas de alto nivel para simular la carga y lectura
interface ExampleMinuta {
  title: string;
  date: string;
  client: string;
  rawText: string;
  summaryOutput: string;
}

const exampleMinutas: ExampleMinuta[] = [
  {
    title: "Minuta: Comité Técnico de Integración IPBX",
    date: "2026-05-18",
    client: "Alimentos Premium S.A.",
    rawText: "Comité de Integración de Telefonía IPBX.\nAsistentes: Ing. Carlos Gómez (Alimentos Premium), QA Team (RC506).\n\nTemas tratados:\n1. Latencia detectada en las llamadas entrantes a través de la troncal SIP de Navegalo. Se observa un delay de 450ms.\n2. Sincronización de extensiones IPBX con la base de datos de recursos humanos para marcado rápido.\n\nCompromisos acordados:\n- [ACUERDO] Carlos Gómez entregará el mapeo de red local antes del viernes.\n- [COMPROMISO] El equipo de QA de RC506 realizará una auditoría de paquetes en la troncal SIP mañana a primera hora. [CRÍTICO]\n- [PENDIENTE] Confirmación de compra de las 12 licencias Yeastar adicionales.",
    summaryOutput: `### [ANÁLISIS] Minuta de Comité Técnico - Alimentos Premium S.A.
*Fecha de Reunión: 18 de Mayo, 2026*

Se ha procesado y estructurado la minuta del comité técnico. A continuación se presenta el informe analítico de alivio ocular optimizado para la toma de decisiones:

---

## 1. Temas Críticos Identificados
- **Degradación de Voz:** Se reporta una latencia inaceptable de \\\`450ms\\\` en la troncal SIP de Navegalo. Esto supera el estándar de la industria (máximo tolerado de 150ms), lo que afecta directamente el SLA del servicio.
- **Marcar Directo:** Pendiente la unificación de los directorios activos de RRHH con el servidor IPBX de Yeastar.

---

## 2. Acuerdos y Plan de Contingencia
[CRÍTICO] **Incidencia en Troncal SIP:** QA Team (RC506) debe activar el sniffer de red y auditar la pérdida de paquetes. Se estima que hay un problema de ruteo local del ISP o saturación de ancho de banda.

---

## 3. Matriz de Compromisos & Hitos

| Responsable | Compromiso / Acuerdo | Estado | Fecha Límite |
| :--- | :--- | :--- | :--- |
| **Ing. Carlos Gómez** | Enviar mapeo de red e infraestructura interna. | [PENDIENTE] | Viernes 22 de Mayo |
| **Equipo QA (RC506)** | Auditoría de tráfico y captura de logs en firewall local. | [ACUERDO] | Mañana a las 08:00 AM |
| **Administración** | Compra y provisión de 12 licencias Yeastar extra. | [PENDIENTE] | Cierre de Mes |

---

> [RECOMENDACIÓN ESTRATÉGICA DE IA]
> Si la latencia en la troncal SIP no desciende de 150ms tras la auditoría, recomendamos habilitar de inmediato el nodo de contingencia en la **Troncal SIP Virtual de Call My Way** (redundancia activa) establecida en el TechDNA de la cuenta para resguardar la estabilidad operativa.`
  },
  {
    title: "Minuta: Seguimiento de Hito de Botmaker Híbrido",
    date: "2026-05-15",
    client: "Logística Global CR",
    rawText: "Reunión de seguimiento mensual de Canales Digitales.\nAsistentes: Laura Montero (Directora de Ventas), Tech Lead (RC506).\n\nTemas tratados:\n1. El Botmaker Híbrido (IA Generativa + Flujos) ha atendido 12,400 chats este mes.\n2. Se detecta una tasa de descarrilamiento del 8% en las preguntas del catálogo de envíos internacionales. El bot no entiende ciertas jergas arancelarias.\n3. Se requiere que el bot derive de inmediato a un agente humano de soporte si el cliente expresa inconformidad repetida.\n\nCompromisos:\n- [ACUERDO] Laura Montero pasará el glosario de términos aduaneros y aranceles actualizados.\n- [COMPROMISO] Tech Lead integrará la regla de derivación por lenguaje natural en el orquestador del bot. [PENDIENTE]",
    summaryOutput: `### [ANÁLISIS] Minuta de Canales Digitales - Logística Global CR
*Fecha de Reunión: 15 de Mayo, 2026*

Hemos decodificado el rendimiento del canal de soporte automatizado. El ecosistema opera a un ritmo saludable, pero con una oportunidad crítica de afinamiento:

---

## 1. Resumen de Desempeño Operativo
- **Volumen de Operación:** \\\`12,400 chats\\\` atendidos con éxito este periodo.
- **Eficiencia del Ecosistema:** La tasa de resolución por autogestión es del **92%**. El restante **8%** presenta fallas de entendimiento conversacional en el catálogo internacional debido al uso de terminología técnica y jergas aduaneras locales.

---

## 2. Plan de Optimización Inmediata
- **Glosario Semántico:** Se requiere inyectar un dataset de sinónimos de aranceles al modelo de lenguaje (LLM).
- **Control de Fuga:** Implementar un disparador de derivación rápida por NLU (análisis de sentimiento negativo) para desviar llamadas conflictivas hacia agentes del Call Center.

---

## 3. Matriz de Compromisos & Responsabilidades

- Laura Montero entregará el **Glosario de Términos Aduaneros** y códigos arancelarios el lunes por la tarde. [PENDIENTE]
- El Tech Lead de RC506 modificará los disparadores en la consola de Botmaker para activar la derivación automática por acumulación de *Sentiment Score* bajo. [ACUERDO]

---

> [RECOMENDACIÓN ESTRATÉGICA DE IA]
> Un 8% de descarrilamiento en 12,400 chats equivale a 992 usuarios frustrados. Al habilitar la derivación automática por NLU, reduciremos el abandono a cero. Se sugiere programar una sesión de entrenamiento sobre la interfaz del gestor de flujos para el personal de ventas.`
  },
  {
    title: "Minuta de Emergencia: Caída de Enlace y Redundancia",
    date: "2026-05-19",
    client: "Financiera del Sur",
    rawText: "Comité de Crisis por Incidente de Telecomunicaciones.\nAsistentes: Gerencia de IT (Financiera del Sur), Operaciones (RC506).\n\nHechos:\nA las 10:15 AM se reportó caída total de internet de fibra óptica principal (proveedor A). El enlace redundante de radiofrecuencia (proveedor B) entró en funcionamiento de manera automática, sin embargo, el ancho de banda se limitó a 30 Mbps, provocando congelamiento en 5 terminales de operadores del Contact Center.\n\nCompromisos:\n- [ACUERDO] Financiera del Sur abrirá un reclamo formal con el proveedor A por corte de fibra de 3 horas.\n- [COMPROMISO] RC506 ajustará la compresión de códecs de audio (cambiar G.711 a G.729) en el contact center para optimizar el consumo de ancho de banda a 10 Mbps mientras dure la emergencia. [CRÍTICO]",
    summaryOutput: `### [CRÍTICO] Incidente de Redundancia y Enlace - Financiera del Sur
*Fecha de Evento: Hoy, 19 de Mayo, 2026*

Informe de auditoría de crisis inmediata procesado con el estándar de alta legibilidad ergonómica:

---

## 1. Diagnóstico de la Falla
- **Evento:** Caída total de fibra óptica principal (corte físico del ISP primario).
- **Efecto en Redundancia:** El failover automático operó con éxito hacia el enlace de radiofrecuencia. No obstante, la limitación a \\\`30 Mbps\\\` generó saturación en el canal debido al alto peso del tráfico de datos combinado con códecs de voz sin comprimir. Esto congeló 5 puestos del Contact Center.

---

## 2. Acción de Mitigación Realizada
[ACUERDO] **Ajuste de Códecs de Voz:** El equipo de operaciones de RC506 comprimió el tráfico de audio. Cambiar de \`G.711\` a \`G.729\` redujo el consumo por llamada de **80 Kbps a solo 8 Kbps**, estabilizando inmediatamente las 5 estaciones afectadas sin pérdida sensible de fidelidad de voz.

---

## 3. Compromisos de Estabilidad Estratégica

- **Financiera del Sur:** Realizar reclamo al operador de fibra por violación del SLA de disponibilidad y corte de 3 horas. [PENDIENTE]
- **Operaciones RC506:** Mantener el monitoreo de tráfico de red en la consola de LiveOps y programar el retorno a G.711 una vez restaurada la fibra óptica principal. [ACUERDO]

---

> [RECOMENDACIÓN ESTRATÉGICA DE IA]
> El failover funcionó a nivel de red, pero el diseño de capacidad colapsó. Recomendamos formalizar un plan de calidad de servicio (QoS) en el router de borde para priorizar de forma absoluta los paquetes de voz VoIP por sobre la navegación web comercial durante emergencias.`
  }
];

const AiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hola. Soy el Copilot de Inteligencia de **Ecosistema RC506**. 

He sido equipado con la nueva **Visual de Lectura Ergonómica y de Alivio Ocular (Antigravity Style)**. 

### ¿Cómo puedo ayudarte hoy?
- **Lector de Minutas:** Pega el texto plano de cualquier acta o minuta de reunión en el chat para analizarla.
- **Bóveda:** Selecciona una minuta real de los ejemplos laterales en el panel derecho para ver cómo la estructuro y analizo al instante.
- **Comercial:** Pregúntame sobre la salud de tus clientes o riesgos de SLA detectados.

*Prueba cargando una minuta para experimentar el renderizado de alta legibilidad, viñetas premium y relieve tipográfico.*`,
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

  // Función de formateo de Markdown Ergonómico Inline
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\])/g;
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-emerald-400 font-mono text-[11px] mx-1">
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-white text-[13.5px]">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('[') && part.endsWith(']')) {
        const tagContent = part.slice(1, -1);
        let tagStyle = "bg-rc-teal/10 text-rc-teal border-rc-teal/20";
        if (tagContent === "ACUERDO" || tagContent === "COMPROMISO") {
          tagStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        } else if (tagContent === "CRÍTICO" || tagContent === "ANÁLISIS") {
          tagStyle = "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.1)]";
        } else if (tagContent === "PENDIENTE") {
          tagStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        }
        return (
          <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider mx-1 ${tagStyle}`}>
            {tagContent}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Renderizador principal de bloques de Markdown
  const renderMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;
    let tableRows: string[][] = [];
    let inTable = false;

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key} className="space-y-4 my-6 pl-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[13px] leading-relaxed text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rc-teal mt-2 flex-shrink-0 shadow-[0_0_8px_#3BC7AA]" />
                <span className="flex-1">{renderInlineMarkdown(item)}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const dataRows = tableRows.slice(2);

        elements.push(
          <div key={key} className="my-6 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/20 shadow-xl overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-[var(--glass-border)]">
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {h.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {dataRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-6 py-4 text-[12px] text-slate-300 font-medium leading-relaxed">
                        {renderInlineMarkdown(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Tablas Markdown simple (que inicien con |)
      if (line.trim().startsWith('|')) {
        flushList(`list-before-table-${i}`);
        inTable = true;
        const cells = line.split('|').slice(1, -1);
        tableRows.push(cells);
        continue;
      } else if (inTable && !line.trim().startsWith('|')) {
        flushTable(`table-end-${i}`);
      }

      // Encabezados
      if (line.startsWith('### ')) {
        flushList(`list-before-h3-${i}`);
        elements.push(
          <h4 key={`h3-${i}`} className="text-[14px] font-bold text-white uppercase tracking-wider mt-6 mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-rc-teal rounded-full shadow-[0_0_8px_#3BC7AA]" />
            {renderInlineMarkdown(line.slice(4))}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        flushList(`list-before-h2-${i}`);
        elements.push(
          <h3 key={`h2-${i}`} className="text-[16px] font-bold text-white tracking-tight mt-8 mb-4 border-b border-[var(--glass-border)] pb-3 uppercase tracking-[0.15em] text-rc-teal flex items-center gap-3">
            <Zap size={14} className="text-rc-teal" />
            {renderInlineMarkdown(line.slice(3))}
          </h3>
        );
      } else if (line.startsWith('# ')) {
        flushList(`list-before-h1-${i}`);
        elements.push(
          <h2 key={`h1-${i}`} className="text-xl font-light text-white tracking-tighter mt-10 mb-6 pb-3 border-b border-white/10 uppercase tracking-[0.2em]">
            {renderInlineMarkdown(line.slice(2))}
          </h2>
        );
      }
      // Citas / Blockquotes
      else if (line.startsWith('> ')) {
        flushList(`list-before-quote-${i}`);
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-3 border-rc-teal bg-rc-teal/[0.02] px-6 py-5 italic text-slate-400 my-6 rounded-r-3xl border-t border-b border-white/[0.01] shadow-[inset_10px_0_30px_rgba(59,198,170,0.01)] leading-relaxed text-[13px]">
            {renderInlineMarkdown(line.slice(2))}
          </blockquote>
        );
      }
      // Listas
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        inList = true;
        listItems.push(line.trim().slice(2));
      }
      // Separadores
      else if (line.trim() === '---') {
        flushList(`list-before-hr-${i}`);
        elements.push(<div key={`hr-${i}`} className="h-px w-full bg-[var(--glass-border)] my-6" />);
      }
      // Código en bloque
      else if (line.startsWith('```')) {
        flushList(`list-before-code-${i}`);
        const codeLines: string[] = [];
        let lang = line.slice(3).trim();
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <div key={`codeblock-${i}`} className="my-6 rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-2xl bg-black/40">
            {lang && (
              <div className="px-6 py-2.5 bg-black/30 border-b border-[var(--glass-border)] flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2 text-rc-teal"><Terminal size={10} /> {lang}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            )}
            <pre className="p-6 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-emerald-400/90 custom-scrollbar bg-black/20">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
      }
      // Líneas vacías
      else if (line.trim() === '') {
        flushList(`list-before-empty-${i}`);
      }
      // Párrafos normales
      else {
        flushList(`list-before-p-${i}`);
        elements.push(
          <p key={`p-${i}`} className="text-[13px] leading-relaxed text-slate-300 font-medium my-3">
            {renderInlineMarkdown(line)}
          </p>
        );
      }
    }

    if (inList) flushList('list-final');
    if (inTable) flushTable('table-final');

    return elements;
  };

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const isMinutaAction = textToSend.toLowerCase().includes('minuta') || 
                          textToSend.toLowerCase().includes('acuerdo') || 
                          textToSend.toLowerCase().includes('compromiso') ||
                          textToSend.length > 150;

    setTimeout(() => {
      let responseContent = "";

      if (isMinutaAction) {
        const matchedExample = exampleMinutas.find(ex => 
          textToSend.includes(ex.client) || textToSend.slice(0, 40).includes(ex.title.slice(0, 20))
        );

        if (matchedExample) {
          responseContent = matchedExample.summaryOutput;
        } else {
          responseContent = `### [ANÁLISIS] Minuta de Reunión Procesada con Éxito
*Procesador de Inteligencia RC506 V4.0 - Alivio Ocular Activo*

He escaneado y estructurado el texto de tu reunión. A continuación, presento el diagnóstico y plan de acción:

---

## 1. Diagnóstico y Temas Identificados
- **Resumen:** Se procesó un texto de reunión con una extensión de \\\` ${textToSend.length} caracteres \\\`.
- **Estructuración:** He extraído de forma automática las tareas, responsables y puntos de contingencia aplicando lógica difusa NLU.

---

## 2. Matriz de Compromisos Extraída

- [ACUERDO] **Revisión General:** El equipo de desarrollo debe unificar el protocolo de integración de red.
- [COMPROMISO] **Hito de Seguimiento:** Programar la próxima mesa de trabajo en un plazo máximo de 7 días. [PENDIENTE]

---

> [RECOMENDACIÓN ESTRATÉGICA DE IA]
> Detectamos que el texto provisto carece de fechas límites explícitas. Para asegurar el cumplimiento estricto del SLA, se sugiere reescribir las asignaciones asignando un día y hora de entrega inamovibles.`;
        }
      } else {
        responseContent = `### Consulta Analizada
*Ecosistema de Inteligencia RC506*

He analizado tu consulta: \\\` "${textToSend}" \\\`.

### Resumen de Estado de la Cartera
1. **Calidad Global:** Operando a un **94.2%** de rendimiento promedio en los 10 pilares.
2. **Alertas Críticas:** 1 alerta de red activa en Financiera del Sur.
3. **Recomendación:** Puedes revisar la **Bóveda de Minutas** en el panel derecho haciendo clic en cualquiera de ellas para ver cómo analizo incidentes y compromisos en tiempo real.`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleLoadMinutaExample = (minuta: ExampleMinuta) => {
    handleSend(`Analizar la siguiente minuta:\n\n${minuta.rawText}`);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8 bg-[var(--bg-main)]">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-rc-teal/10 rounded-xl flex items-center justify-center text-rc-teal shadow-2xl shadow-rc-teal/20 border border-rc-teal/20">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight uppercase leading-none">Visor de Minutas e IA</h1>
            <p className="label-executive mt-1">Lector Ergonómico con Alivio Ocular V4.2</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Chat / Visor de Textos */}
        <div className="flex-1 flex flex-col glass-card relative overflow-hidden rounded-[36px]">
          <div className="absolute inset-0 bg-gradient-to-b from-rc-teal/[0.01] to-transparent pointer-events-none" />
          
          {/* Cabecera interna del lector */}
          <div className="px-8 py-5 border-b border-[var(--glass-border)] bg-black/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList size={16} className="text-rc-teal" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pantalla de Lectura Activa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Visualizador Ergonómico</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 30, stiffness: 250 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-[18px] flex-shrink-0 flex items-center justify-center border transition-all ${
                      m.role === 'user' 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-rc-teal/10 border-rc-teal/20 text-rc-teal shadow-[0_0_15px_rgba(59,198,170,0.1)]'
                    }`}>
                      {m.role === 'user' ? <MessageSquare size={20} strokeWidth={1.5} /> : <Bot size={20} strokeWidth={1.5} />}
                    </div>
                    
                    <div className={`p-8 rounded-[32px] border relative ${
                      m.role === 'user'
                      ? 'bg-white/[0.02] border-white/5 text-white'
                      : 'bg-white/[0.01] border-[var(--glass-border)] text-slate-200'
                    } shadow-md`}>
                      <div className="absolute top-4 right-6 text-[8px] font-semibold text-slate-600 uppercase tracking-widest">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      <div className="space-y-1">
                        {m.role === 'assistant' ? renderMarkdown(m.content) : (
                          <pre className="text-[13px] leading-relaxed font-medium font-sans whitespace-pre-wrap">{m.content}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex gap-5"
                >
                  <div className="w-12 h-12 rounded-[18px] bg-rc-teal/10 border border-rc-teal/20 flex items-center justify-center text-rc-teal shadow-[0_0_15px_rgba(59,198,170,0.1)]">
                    <RefreshCw size={20} className="animate-spin" strokeWidth={1.5} />
                  </div>
                  <div className="p-8 bg-rc-teal/[0.02] border border-rc-teal/10 rounded-[32px] flex items-center">
                    <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-2 bg-rc-teal/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-[var(--glass-border)] bg-black/20">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Pega tu minuta cruda de reunión o haz una pregunta..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 pr-16 text-sm text-white focus:ring-2 focus:ring-rc-teal/20 focus:border-rc-teal/50 transition-all placeholder:text-slate-600 outline-none resize-none custom-scrollbar"
                  style={{ minHeight: '56px', maxHeight: '160px' }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Terminal size={14} className="text-slate-700" />
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-rc-teal text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-rc-teal/20 cursor-pointer flex-shrink-0"
              >
                <Send size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">Shift + Enter para salto de línea</span>
              <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">NLU Minuta Reader Activo</span>
            </div>
          </div>
        </div>

        {/* Bóveda Lateral de Minutas de Reunión */}
        <div className="w-[380px] flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide right-panel-hide">
          
          <div className="glass-card p-8 rounded-[32px] border border-[var(--glass-border)] relative overflow-hidden bg-black/10">
            <div className="absolute inset-0 bg-gradient-to-b from-rc-teal/[0.01] to-transparent pointer-events-none" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <ClipboardList size={14} className="text-rc-teal" /> Bóveda de Minutas
            </h3>
            
            <p className="text-[10.5px] text-slate-500 leading-relaxed font-medium mb-6">
              Selecciona una minuta real pre-cargada para auditar su formateo ergonómico en la pantalla del lector:
            </p>

            <div className="space-y-4">
              {exampleMinutas.map((minuta) => (
                <button
                  key={minuta.title}
                  onClick={() => handleLoadMinutaExample(minuta)}
                  className="w-full p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-left hover:border-rc-teal/40 hover:bg-white/[0.02] transition-all flex flex-col gap-3 group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[8px] font-black text-rc-teal uppercase tracking-widest">
                      {minuta.client}
                    </span>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={10} />
                      <span className="text-[8px] font-semibold uppercase">{minuta.date}</span>
                    </div>
                  </div>
                  <div className="text-[12px] font-bold text-white tracking-tight leading-snug group-hover:text-rc-teal transition-colors">
                    {minuta.title.replace("Minuta: ", "")}
                  </div>
                  <div className="flex items-center justify-between w-full pt-1">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                      {minuta.rawText.split('\n').length * 10} palabras
                    </span>
                    <span className="text-[8px] font-black text-rc-teal uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      Procesar <ArrowUpRight size={10} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-[var(--glass-border)] bg-rc-teal/[0.01]">
            <h3 className="text-[10px] font-black text-rc-teal uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Sparkles size={14} /> Estructura de Lectura
            </h3>
            <ul className="space-y-5">
              {[
                { title: 'Markdown Dinámico', desc: 'Renderiza títulos, tablas e hitos ergonómicos.', color: 'text-rc-teal bg-rc-teal/10 border-rc-teal/20' },
                { title: 'Detección Semántica', desc: 'Identifica y resalta automáticamente tags como [ACUERDO] y [CRÍTICO].', color: 'text-amber-400 bg-amber-400/10 border-amber-500/20' },
                { title: 'Alivio Ergonómico', desc: 'Contraste seda que disminuye la fatiga en lecturas prolongadas.', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' }
              ].map(cap => (
                <li key={cap.title} className="flex gap-4 items-start">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border font-bold text-xs ${cap.color}`}>
                    {cap.title.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-white uppercase tracking-tight">{cap.title}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{cap.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCopilot;
