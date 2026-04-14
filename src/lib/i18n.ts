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
        no_results: 'No matching records found',
        welcome_ready: 'Ready for Excellence',
        first_client_desc: 'No clients registered yet. Start by adding your first project to visualize real-time analytics.',
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
        title: 'Strategic Account Control',
        active_assignments: 'Active Professional Goals',
        search_placeholder: 'Filter by area, responsibility or name...',
        new_task: 'New Professional Task',
        table_state: 'STATUS',
        table_task_project: 'GOAL / UNIT',
        table_priority: 'LEVEL',
        table_due_date: 'TIMELINE',
        table_actions: 'CONTROL',
        notes_placeholder: 'Qualitative insights...',
        priority_high: 'Critical',
        priority_medium: 'Strategic',
        priority_low: 'Tactical'
      },
      projects: {
        title: 'Clients Portfolio',
        newProject: 'New Project',
        name_required: 'Client name is required',
        services_required: 'At least one service with a valid name is required',
        strategicHealth: 'Strategic Health',
        activeServices: 'Active Services',
        service_details: 'Unit Services',
        audit_history: 'Audit History',
        audit_cases: 'Cases & Alerts',
        add_service: 'Add Service',
        service_name: 'Service Name',
        description: 'Description',
        quality_score: 'Quality Score',
        quick_audit: 'Quick Executive Audit',
        since: 'Since',
        no_description: 'No description provided.',
        add_alert: 'New Alert/Case',
        alert_desc: 'Incident Description',
        alert_type: 'Type',
        alert_severity: 'Severity',
        severity_low: 'Low',
        severity_medium: 'Medium',
        severity_high: 'High',
        type_technical: 'Technical',
        type_operational: 'Operational',
        type_strategic: 'Strategic',
        status_open: 'Open',
        status_resolved: 'Resolved',
        recent_alerts: 'Early Warnings'
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
        no_results: 'Búsqueda sin resultados',
        welcome_ready: 'Listo para la Excelencia',
        first_client_desc: 'Aún no tienes clientes registrados. Comienza agregando tu primer proyecto para visualizar métricas en tiempo real.',
        audit_execution: 'Auditoría Ejecutiva',
        table_client: 'CLIENTE',
        table_health: 'HEALTH',
        table_history: 'HISTORIAL RECIENTE',
        table_status: 'ESTADO',
        no_records: 'Sin registros'
      },
      tasks: {
        title: 'Control de Cuentas Estratégicas',
        active_assignments: 'Objetivos Profesionales Activos',
        search_placeholder: 'Filtrar por área, responsable o nombre...',
        new_task: 'Nueva Tarea Profesional',
        table_state: 'ESTADO',
        table_task_project: 'OBJETIVO / UNIDAD',
        table_priority: 'PRIORIDAD',
        table_due_date: 'CRONOGRAMA',
        table_actions: 'ACCIONES',
        notes_placeholder: 'Insights cualitativos...',
        priority_high: 'Crítico',
        priority_medium: 'Estratégico',
        priority_low: 'Táctico'
      },
      projects: {
        title: 'Portafolio de Clientes',
        newProject: 'Nuevo Cliente',
        name_required: 'El nombre del cliente es obligatorio',
        services_required: 'Debes añadir al menos un servicio con nombre válido',
        strategicHealth: 'Salud Estratégica',
        activeServices: 'Servicios Activos',
        service_details: 'Unidades / Servicios',
        audit_history: 'Historial / Bitácora',
        audit_cases: 'Casos y Alertas',
        add_service: 'Añadir Servicio',
        service_name: 'Nombre del Servicio',
        description: 'Descripción',
        quality_score: 'Puntaje de Calidad',
        quick_audit: 'Auditoría Ejecutiva Rápida',
        since: 'Desde',
        no_description: 'Sin descripción disponible.',
        add_alert: 'Nueva Alerta / Caso',
        alert_desc: 'Descripción del Incidente',
        alert_type: 'Tipo',
        alert_severity: 'Severidad',
        severity_low: 'Baja',
        severity_medium: 'Media',
        severity_high: 'Alta',
        type_technical: 'Técnico',
        type_operational: 'Operativo',
        type_strategic: 'Estratégico',
        status_open: 'Abierto',
        status_resolved: 'Resuelto',
        recent_alerts: 'Alertas Tempranas'
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
        sign: 'Firmar Auditoría',
        date: 'Fecha de Reporte'
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
