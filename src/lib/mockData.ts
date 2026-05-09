import { Project } from '../types/project';

export const initialProjects: Project[] = [
  {
    id: '50600',
    client: 'RC506',
    startDate: '2024-01-01',
    services: [
      {
        id: 'S-001',
        name: 'Ventas Automotriz',
        description: 'Gestión de leads y cierre de ventas para sector automotriz.',
        startDate: '2024-01-01',
        score: 4.8,
        botType: 'WhatsApp AI',
        purpose: 'Lead Qualification',
        lastAccess: '2024-05-08 08:30',
        lastUpdate: '2024-05-08 10:15',
        mgmtType: 'Ventas',
        responsible: 'Juan Pérez',
        collaborator: 'María García',
        positionsCount: 15,
        shiftMatrix: 'L-V 08:00 - 18:00',
        logs: [
          { id: 'L-001', date: '2024-05-01', user: 'Admin', action: 'Update', observation: 'Se ajustaron los parámetros del bot para mejorar la conversión.' },
          { id: 'L-002', date: '2024-05-05', user: 'Juan Pérez', action: 'Audit', observation: 'Revisión de calidad mensual completada con 95%.' }
        ]
      }
    ],
    evaluations: [{ month: 3, year: 2024, quantitative: 5.0, qualitative: 'Líder de Estrategia', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 10, hcReal: 10, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'REMOTE', isp: 'Liberty', phoneLine: 'Sip Trunk' },
    assets: []
  },
  {
    id: '50601',
    client: 'Asesores Mena',
    startDate: '2024-01-15',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.8, qualitative: 'Servicio en cumplimiento', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 5, hcReal: 5, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'REMOTE', isp: 'Telecable', phoneLine: 'Cloud' },
    assets: []
  },
  {
    id: '50603',
    client: 'Burbi Lake Lodge',
    startDate: '2024-02-01',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.5, qualitative: 'Operación estable', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 4, hcReal: 3, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'WIP', isp: 'Liberty', phoneLine: 'Analog' },
    assets: []
  },
  {
    id: '50604',
    client: 'CMSJ',
    startDate: '2024-02-05',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.7, qualitative: 'Gestión efectiva', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 8, hcReal: 8, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'REMOTE', isp: 'ICE', phoneLine: 'Cloud' },
    assets: []
  },
  {
    id: '50605',
    client: 'Tabush',
    startDate: '2024-02-10',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.2, qualitative: 'Procesos en revisión', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 12, hcReal: 10, backupStatus: 'En Uso' },
    techDNA: { operationMode: 'HÍBRIDO', isp: 'Telecable', phoneLine: 'Sip Trunk' },
    assets: []
  },
  {
    id: '50607',
    client: 'Plataforma Multicanal',
    startDate: '2024-02-15',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.9, qualitative: 'Excelente desempeño', status: 'Growth' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 15, hcReal: 15, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'REMOTE', isp: 'Liberty', phoneLine: 'Cloud' },
    assets: []
  },
  {
    id: '50609',
    client: 'Canning 34',
    startDate: '2024-02-20',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.4, qualitative: 'Operativo', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 6, hcReal: 6, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'WIP', isp: 'Liberty', phoneLine: 'Cloud' },
    assets: []
  },
  {
    id: '50610',
    client: 'WYP',
    startDate: '2024-03-01',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.6, qualitative: 'Continuidad asegurada', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 20, hcReal: 18, backupStatus: 'Disponible' },
    techDNA: { operationMode: 'HÍBRIDO', isp: 'Telecable', phoneLine: 'Cloud' },
    assets: []
  }
];

export const initialTasks: any[] = [];
