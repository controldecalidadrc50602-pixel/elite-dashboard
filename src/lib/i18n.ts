import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Executive View',
        clients: 'Client Portfolio',
        projects: 'Account Audit',
        tasks: 'Task Manager',
        logout: 'Sign Out'
      },
      stats: {
        total: 'Total Clients',
        optimal: 'Optimal Health',
        risk: 'At Risk',
        avgScore: 'Avg. Audit Score',
        trends: 'Strategic Trends',
        offline_mode: 'Offline Mode Active',
        offline_desc: 'Data persisted locally.',
        demo_mode: 'Executive Demo'
      },
      dashboard: {
        audit_pulse: 'Audit Pulse (6m)',
        target: 'Target',
        actual: 'Actual',
        urgency_matrix: 'Urgency Matrix',
        total_cl: 'Total CL',
        optimized: 'Optimized',
        attention: 'Attention',
        critical: 'Critical',
        active_clients: 'Active Clients',
        search_placeholder: 'Filter by name or service...',
        no_clients: 'No clients found',
        audit_execution: 'Executive Audit',
        table_client: 'CLIENT',
        table_health: 'HEALTH',
        table_history: 'RECENT HISTORY',
        table_status: 'STATUS',
        no_records: 'No records'
      },
      months: {
        oct: 'Oct', nov: 'Nov', dec: 'Dec', jan: 'Jan', feb: 'Feb', mar: 'Mar'
      },
      tasks: {
        title: 'Task Management',
        active_assignments: 'Active Assignments',
        search_placeholder: 'Search tasks...',
        new_task: 'New Task',
        table_state: 'STATE',
        table_task_project: 'TASK / PROJECT',
        table_priority: 'PRIORITY',
        table_due_date: 'DUE DATE',
        table_actions: 'ACTIONS',
        notes_placeholder: 'Qualitative notes...',
        priority_high: 'High',
        priority_medium: 'Medium',
        priority_low: 'Low'
      },
      projects: {
        title: 'Clients Portfolio',
        newProject: 'New Project',
        client_name: 'Client / Company Name',
        start_date: 'Relationship Start Date',
        services_contracted: 'Contracted Services',
        service_details: 'Service Details',
        service_name: 'Service Name',
        description: 'Description',
        quality_score: 'Quality Score',
        quick_audit: 'Quick Audit',
        add_service: 'Add Service',
        service_name_placeholder: 'Service name (e.g. CRM Audit)',
        service_desc_placeholder: 'Short description...',
        no_services: 'No services added',
        individualTitle: 'Account Audit',
        activeServices: 'Active Services',
        strategicHealth: 'Strategic Health',
        auditDetail: 'Detailed Audit',
        since: 'Client since',
        audit_history: 'Audit History'
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
        dashboard: 'Resumen Ejecutivo',
        clients: 'Portafolio Clientes',
        projects: 'Auditoría de Cuentas',
        tasks: 'Gestor de Tareas',
        logout: 'Cerrar Sesión'
      },
      common: {
        save: 'Guardar Cambios',
        create: 'Crear Proyecto',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        loading: 'Cargando...',
        month: 'Mes',
        year: 'Año'
      },
      stats: {
        total: 'Clientes Totales',
        optimal: 'Estado Óptimo',
        risk: 'Cuentas en Riesgo',
        avgScore: 'Score Promedio',
        trends: 'Tendencias Estratégicas',
        offline_mode: 'Modo Offline Activo',
        offline_desc: 'Datos persistidos localmente.',
        demo_mode: 'Demo Ejecutiva'
      },
      dashboard: {
        audit_pulse: 'Pulso de Auditoría (6m)',
        target: 'Objetivo',
        actual: 'Actual',
        urgency_matrix: 'Matriz de Urgencia',
        total_cl: 'Total CL',
        optimized: 'Optimizado',
        attention: 'Atención',
        critical: 'Crítico',
        active_clients: 'Clientes Activos',
        search_placeholder: 'Filtrar por nombre o servicio...',
        no_clients: 'No se encontraron clientes',
        audit_execution: 'Auditoría Ejecutiva',
        table_client: 'CLIENTE',
        table_health: 'HEALTH',
        table_history: 'HISTORIAL RECIENTE',
        table_status: 'ESTADO',
        no_records: 'Sin registros'
      },
      months: {
        oct: 'Oct', nov: 'Nov', dec: 'Dic', jan: 'Ene', feb: 'Feb', mar: 'Mar'
      },
      projects: {
        title: 'Portafolio de Clientes',
        newProject: 'Nuevo Proyecto',
        client_name: 'Nombre del Cliente / Empresa',
        start_date: 'Fecha de Inicio de Relación',
        services_contracted: 'Servicios Contratados',
        add_service: 'Añadir Servicio',
        service_name_placeholder: 'Nombre del servicio (Ej: Auditoría CRM)',
        service_desc_placeholder: 'Breve descripción...',
        no_services: 'No hay servicios añadidos',
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
