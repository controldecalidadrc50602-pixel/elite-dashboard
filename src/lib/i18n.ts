import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Global Dashboard',
        projects: 'My Projects',
        tasks: 'Task Manager',
        logout: 'Sign Out'
      },
      stats: {
        total: 'Total Projects',
        optimal: 'Optimal Health',
        risk: 'At Risk',
        avgScore: 'Avg. Audit Score'
      },
      projects: {
        title: 'Client Status',
        newProject: 'New Project',
        individualTitle: 'Account Audit',
        activeServices: 'Active Services',
        strategicHealth: 'Strategic Health',
        auditDetail: 'Detailed Audit',
        since: 'Client since'
      },
      status: {
        stable: 'Stable',
        growth: 'Growth',
        risk: 'At Risk',
        critical: 'Critical'
      },
      audit: {
        history: 'Audit History',
        new: 'Register New Audit',
        qualitative: 'Qualitative Feedback',
        quantitative: 'Quantitative Score',
        status: 'Strategic Status',
        sign: 'Sign Audit'
      }
    }
  },
  es: {
    translation: {
      nav: {
        dashboard: 'Dashboard Global',
        projects: 'Mis Clientes',
        tasks: 'Gestor de Tareas',
        logout: 'Cerrar Sesión'
      },
      stats: {
        total: 'Proyectos Totales',
        optimal: 'Estado Óptimo',
        risk: 'Cuentas en Riesgo',
        avgScore: 'Score de Auditoría'
      },
      projects: {
        title: 'Estatus de Clientes',
        newProject: 'Nuevo Proyecto',
        individualTitle: 'Auditoría de Cuentas',
        activeServices: 'Servicios Activos',
        strategicHealth: 'Salud Estratégica',
        auditDetail: 'Auditoría Detallada',
        since: 'Cliente desde'
      },
      status: {
        stable: 'Estable',
        growth: 'Crecimiento',
        risk: 'En Riesgo',
        critical: 'Crítico'
      },
      audit: {
        history: 'Historial de Auditorías',
        new: 'Registrar Nueva Auditoría',
        qualitative: 'Feedback Cualitativo',
        quantitative: 'Puntaje Cuantitativo',
        status: 'Estado Estratégico',
        sign: 'Firmar Auditoría'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
