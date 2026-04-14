import { Project } from '../pages/Dashboard';

export const initialProjects: Project[] = [
  {
    id: '1',
    client: 'Corporación Horizon',
    startDate: '2024-01-15',
    status: 'Óptimo',
    services: [
      { id: 's1', name: 'Auditoría Transaccional', description: 'Monitoreo de flujos financieros', startDate: '2024-01-15', score: 95 }
    ],
    evaluations: [
      { month: 5, year: 2026, quantitative: 9.2, qualitative: 'Desempeño excepcional en procesos críticos.', status: 'Growth' },
      { month: 4, year: 2026, quantitative: 8.8, qualitative: 'Estabilidad mantenida tras migración.', status: 'Stable' }
    ],
    alerts: []
  },
  {
    id: '2',
    client: 'Logística Global S.A.',
    startDate: '2023-11-20',
    status: 'Mejorable',
    services: [
      { id: 's2', name: 'Optimización de Procesos', description: 'Reingeniería de última milla', startDate: '2023-11-20', score: 72 }
    ],
    evaluations: [
      { month: 5, year: 2026, quantitative: 6.5, qualitative: 'Retrasos detectados en la fase de implementación.', status: 'At Risk' }
    ],
    alerts: [
      { id: 'a1', date: '2026-04-10', type: 'Operational', severity: 'High', description: 'Cuello de botella en distribución regional.', status: 'Open' }
    ]
  },
  {
    id: '3',
    client: 'Banco Nexus',
    startDate: '2024-02-10',
    status: 'Deficiente',
    services: [
      { id: 's3', name: 'Seguridad IT', description: 'Pentesting y Hardening', startDate: '2024-02-10', score: 45 }
    ],
    evaluations: [
      { month: 5, year: 2026, quantitative: 4.2, qualitative: 'Vulnerabilidades críticas pendientes de parche.', status: 'Critical' }
    ],
    alerts: [
      { id: 'a2', date: '2026-04-12', type: 'Technical', severity: 'High', description: 'Falla persistente en firewall perimetral.', status: 'Open' }
    ]
  }
];

export const initialTasks = [
  { id: 't1', title: 'Revisión trimestral Horizon', project: 'Corporación Horizon', priority: 'Medium', dueDate: '2026-04-20', status: 'Pending' },
  { id: 't2', title: 'Parche de seguridad Nexus', project: 'Banco Nexus', priority: 'High', dueDate: '2026-04-15', status: 'In Progress' }
];
