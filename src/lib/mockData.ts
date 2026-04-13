import { Project } from '../pages/Dashboard';

export const initialProjects: Project[] = [
  {
    id: '1',
    client: 'Finanzas Globales S.A.',
    startDate: '2024-01-15',
    services: [
      { id: 's1', name: 'Plataforma Botmaker', description: 'Bot conversacional con 1 flow principal', startDate: '2024-01-15', score: 5 },
      { id: 's2', name: 'Central Telefónica', description: 'Nube PBX con 5 extensiones activas', startDate: '2024-02-01', score: 4 }
    ],
    evaluations: [
      { date: '2024-04-10', month: 4, year: 2024, quantitative: 5, qualitative: 'La cuenta se mantiene sólida. El cliente está satisfecho con la automatización del bot.', status: 'Stable' },
      { date: '2024-03-12', month: 3, year: 2024, quantitative: 4.8, qualitative: 'Crecimiento sostenido en el uso del bot.', status: 'Stable' },
      { date: '2024-02-15', month: 2, year: 2024, quantitative: 4.5, qualitative: 'Integración inicial completada.', status: 'Growth' }
    ],
    alerts: [
      { id: 'a1', date: '2024-04-12', type: 'Technical', severity: 'Low', description: 'Latencia intermitente en el API de WhatsApp', status: 'Resolved' }
    ],
    status: 'Óptimo'
  },
  {
    id: '2',
    client: 'Industrias del Norte',
    startDate: '2024-02-10',
    services: [
      { id: 's3', name: 'Soporte Técnico', description: 'Mantenimiento preventivo mensual', startDate: '2024-02-10', score: 3 }
    ],
    evaluations: [
      { date: '2024-04-05', month: 4, year: 2024, quantitative: 2, qualitative: 'Existen retrasos técnicos en la infraestructura del cliente. Posible riesgo de cancelación parcial.', status: 'At Risk' },
      { date: '2024-03-20', month: 3, year: 2024, quantitative: 3.5, qualitative: 'Fase de estabilización lenta.', status: 'Stable' }
    ],
    alerts: [
      { id: 'a2', date: '2024-04-13', type: 'Operational', severity: 'High', description: 'Cierre inesperado de 2 extensiones críticas', status: 'Open' }
    ],
    status: 'Mejorable'
  }
];

export const initialTasks = [
  { id: '1', title: 'Auditoría de Seguridad - Fase 1', project: 'Finanzas Globales', status: 'In Progress', priority: 'High', dueDate: '2024-04-15' },
  { id: '2', title: 'Mantenimiento de Servidores Cloud', project: 'Industrias Norte', status: 'Open', priority: 'Medium', dueDate: '2024-04-20' },
  { id: '3', title: 'Actualización de Middleware V3', project: 'Finanzas Globales', status: 'Closed', priority: 'Low', dueDate: '2024-04-10' },
];
