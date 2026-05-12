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
        botType: 'IA Generativa',
        purpose: 'Generar Leads',
        lastAdminAccess: '2024-05-08 08:30',
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
    opsPulse: { hcContracted: 10, hcReal: 10, backupStatus: 'Disponible', operationType: 'Ventas' },
    techDNA: { operationMode: 'RC506', isp: 'Liberty', phoneLine: 'Sip Trunk', country: 'Costa Rica', sipTrunkVirtual: 'Navegalo' },
    adminStatus: 'Activo',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: true, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Verde' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 5, communicationQuality: 5, effectiveResolution: 5, proactivity: 5, technicalKnowledge: 5,
      reliability: 5, flexibility: 5, innovation: 5, serviceCulture: 5, valuePerception: 5
    }
  },
  {
    id: '50601',
    client: 'Asesores Mena',
    startDate: '2024-01-15',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.8, qualitative: 'Servicio en cumplimiento', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 5, hcReal: 5, backupStatus: 'Disponible', operationType: 'Servicio al Cliente' },
    techDNA: { operationMode: 'RC506', isp: 'Telecable', phoneLine: 'Cloud', country: 'Costa Rica', sipTrunkVirtual: 'Vocex' },
    adminStatus: 'Activo',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: true, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Verde' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 4, communicationQuality: 5, effectiveResolution: 4, proactivity: 4, technicalKnowledge: 5,
      reliability: 4, flexibility: 4, innovation: 4, serviceCulture: 5, valuePerception: 5
    }
  },
  {
    id: '50603',
    client: 'Burbi Lake Lodge',
    startDate: '2024-02-01',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.5, qualitative: 'Operación estable', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 4, hcReal: 3, backupStatus: 'Disponible', operationType: 'Servicio al Cliente' },
    techDNA: { operationMode: 'WYP', isp: 'Liberty', phoneLine: 'Analog', country: 'Venezuela', sipTrunkVirtual: 'Movistar Vzla.' },
    adminStatus: 'Prueba',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: false, advisoryReceptivity: true, 
      effectiveServiceUse: false, serviceContinuity: false, reportValuation: true, 
      paymentPunctuality: true, status: 'Amarilla' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 3, communicationQuality: 3, effectiveResolution: 3, proactivity: 4, technicalKnowledge: 4,
      reliability: 3, flexibility: 4, innovation: 3, serviceCulture: 3, valuePerception: 3
    }
  },
  {
    id: '50604',
    client: 'CMSJ',
    startDate: '2024-02-05',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.7, qualitative: 'Gestión efectiva', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 8, hcReal: 8, backupStatus: 'Disponible', operationType: 'Servicio al Cliente' },
    techDNA: { operationMode: 'RC506', isp: 'ICE', phoneLine: 'Cloud', country: 'Costa Rica', sipTrunkVirtual: 'ICE' },
    adminStatus: 'Activo',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: true, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Verde' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 5, communicationQuality: 5, effectiveResolution: 5, proactivity: 5, technicalKnowledge: 4,
      reliability: 5, flexibility: 4, innovation: 4, serviceCulture: 5, valuePerception: 5
    }
  },
  {
    id: '50605',
    client: 'Tabush',
    startDate: '2024-02-10',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.2, qualitative: 'Procesos en revisión', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 12, hcReal: 10, backupStatus: 'En Uso', operationType: 'Ventas' },
    techDNA: { operationMode: 'HÍBRIDO', isp: 'Telecable', phoneLine: 'Sip Trunk', country: 'Venezuela', sipTrunkVirtual: 'Voip.ms' },
    adminStatus: 'Inactivo',
    clientEvaluation: { 
      projectLeader: false, timelyDocumentation: false, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: false, 
      paymentPunctuality: false, status: 'Roja' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 2, communicationQuality: 3, effectiveResolution: 2, proactivity: 2, technicalKnowledge: 3,
      reliability: 3, flexibility: 2, innovation: 2, serviceCulture: 2, valuePerception: 3
    }
  },
  {
    id: '50607',
    client: 'Plataforma Multicanal',
    startDate: '2024-02-15',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.9, qualitative: 'Excelente desempeño', status: 'Growth' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 15, hcReal: 15, backupStatus: 'Disponible', operationType: 'Ventas' },
    techDNA: { operationMode: 'RC506', isp: 'Liberty', phoneLine: 'Cloud', country: 'Costa Rica', sipTrunkVirtual: 'Call My Way' },
    adminStatus: 'Activo',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: true, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Verde' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 5, communicationQuality: 5, effectiveResolution: 5, proactivity: 5, technicalKnowledge: 5,
      reliability: 5, flexibility: 5, innovation: 5, serviceCulture: 5, valuePerception: 5
    }
  },
  {
    id: '50609',
    client: 'Canning 34',
    startDate: '2024-02-20',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.4, qualitative: 'Operativo', status: 'Stable' }],
    healthFlag: 'Amarilla',
    opsPulse: { hcContracted: 6, hcReal: 6, backupStatus: 'Disponible', operationType: 'Servicio al Cliente' },
    techDNA: { operationMode: 'WYP', isp: 'Liberty', phoneLine: 'Cloud', country: 'Venezuela', sipTrunkVirtual: 'Callcentric' },
    adminStatus: 'Prueba',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: false, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Amarilla' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 4, communicationQuality: 4, effectiveResolution: 4, proactivity: 3, technicalKnowledge: 4,
      reliability: 4, flexibility: 4, innovation: 3, serviceCulture: 4, valuePerception: 4
    }
  },
  {
    id: '50610',
    client: 'WYP',
    startDate: '2024-03-01',
    services: [],
    evaluations: [{ month: 3, year: 2024, quantitative: 4.6, qualitative: 'Continuidad asegurada', status: 'Stable' }],
    healthFlag: 'Verde',
    opsPulse: { hcContracted: 20, hcReal: 18, backupStatus: 'Disponible', operationType: 'Servicio al Cliente' },
    techDNA: { operationMode: 'HÍBRIDO', isp: 'Telecable', phoneLine: 'Cloud', country: 'Costa Rica', sipTrunkVirtual: 'Navegalo' },
    adminStatus: 'En Proceso',
    clientEvaluation: { 
      projectLeader: true, timelyDocumentation: true, advisoryReceptivity: true, 
      effectiveServiceUse: true, serviceContinuity: true, reportValuation: true, 
      paymentPunctuality: true, status: 'Verde' 
    },
    assets: [],
    quarterlyAssessment: {
      responseTime: 5, communicationQuality: 5, effectiveResolution: 4, proactivity: 4, technicalKnowledge: 4,
      reliability: 5, flexibility: 5, innovation: 4, serviceCulture: 5, valuePerception: 5
    }
  }
];

export const initialTasks: any[] = [];
