import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Project } from '../types/project';
import { Task } from '../components/TaskManager';

/**
 * ELITE EXPORT SERVICE (ZOHO-ELITE STANDARD)
 * Centralized service for generating executive reports.
 */

export const exportService = {
  /**
   * EXPORT TO EXCEL (.xlsx)
   * Generates a workbook with projects and tasks on separate sheets.
   */
  exportToExcel: (projects: Project[], tasks: Task[]) => {
    try {
      // 1. Prepare Projects Data
      const projectData = projects.map(p => ({
        ID: p.id,
        Cliente: p.client,
        Fecha_Inicio: p.startDate,
        Salud_Actual: p.evaluations[0]?.quantitative || 0,
        Feedback_Reciente: p.evaluations[0]?.qualitative || '',
        Estado: p.evaluations[0]?.status || 'Stable',
        Servicios_Activos: p.services.map(s => s.name).join(', ')
      }));

      // 2. Prepare Tasks Data
      const taskData = tasks.map(t => ({
        ID: t.id,
        Tarea: t.title,
        Prioridad: t.priority,
        Estado: t.status,
        Asignado: t.assignedTo,
        Inicio: t.startTime,
        Fin: t.endTime || '-'
      }));

      // 3. Create Workbook
      const wb = XLSX.utils.book_new();
      const projectSheet = XLSX.utils.json_to_sheet(projectData);
      const taskSheet = XLSX.utils.json_to_sheet(taskData);

      XLSX.utils.book_append_sheet(wb, projectSheet, "Portafolio Clientes");
      XLSX.utils.book_append_sheet(wb, taskSheet, "Centro Operaciones");

      // 4. Download
      XLSX.writeFile(wb, `RC506_Elite_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  },

  /**
   * EXPORT TO PDF (BRANDED EXECUTIVE REPORT)
   * Replicates the RC506 branding model: Black header/footer + Curves.
   */
  exportToPDF: (projects: Project[], tasks: Task[], t: any) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper: Draw RC506 Branding (Header & Footer)
    const applyBranding = (pdf: jsPDF) => {
      // --- HEADER ---
      pdf.setFillColor(15, 23, 42); // Navy/Black (Deep primary)
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Draw dynamic curve using an ellipse (simpler & compatible)
      pdf.setFillColor(255, 255, 255);
      pdf.ellipse(pageWidth / 2, 45, pageWidth * 0.8, 15, 'F');

      // Logo Text (RC506 Style)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RC', pageWidth - 45, 18);
      pdf.setTextColor(59, 199, 170); // RC Teal
      pdf.text('506', pageWidth - 30, 18);
      
      // --- FOOTER ---
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Elite Client Dashboard', 10, pageHeight - 6);
      pdf.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, pageWidth - 50, pageHeight - 6);
    };

    // --- PAGE 1: EXECUTIVE SUMMARY ---
    applyBranding(doc);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE CONSOLIDADO', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('ESTADO ESTRATÉGICO DE CUENTAS & OPERACIONES', 20, 68);

    // Score Summary Boxes
    const avgScore = projects.length > 0 
      ? (projects.reduce((acc, p) => acc + (p.evaluations[0]?.quantitative || 0), 0) / projects.length).toFixed(1)
      : '0.0';
    
    autoTable(doc, {
      startY: 85,
      head: [['Métrica de Rendimiento', 'Valor Consolidado']],
      body: [
        ['Total Clientes en Portafolio', projects.length.toString()],
        ['Puntaje de Salud Promedio (Score)', `${avgScore} / 5.0`],
        ['Cuentas en Nivel Crítico / Riesgo', projects.filter(p => p.evaluations[0]?.status === 'Critical' || p.evaluations[0]?.status === 'At Risk').length.toString()],
        ['Tareas de Alta Prioridad Pendientes', tasks.filter(t => t.priority === 'High' && t.status !== 'Closed').length.toString()]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 199, 170], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 }
    });

    // --- PAGE 2: PROJECT LIST ---
    doc.addPage();
    applyBranding(doc);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE PORTAFOLIO', 20, 60);

    autoTable(doc, {
      startY: 70,
      head: [['ID', 'Cliente', 'Salud', 'Estado', 'Último Feedback']],
      body: projects.map(p => [
        p.id,
        p.client.toUpperCase(),
        p.evaluations[0]?.quantitative || '-',
        p.evaluations[0]?.status || 'N/A',
        p.evaluations[0]?.qualitative || 'Sin registros'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15 },
        2: { halign: 'center', fontStyle: 'bold' },
        3: { halign: 'center' }
      }
    });

    // --- PAGE 3: TASK CENTER ---
    doc.addPage();
    applyBranding(doc);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CENTRO DE OPERACIONES', 20, 60);

    autoTable(doc, {
      startY: 70,
      head: [['ID', 'Tarea / Objetivo', 'Prioridad', 'Estado', 'Responsable']],
      body: tasks.map(t => [
        t.id,
        t.title,
        t.priority,
        t.status,
        t.assignedTo
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 3 }
    });

    doc.save(`RC506_Elite_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * EXPORT GLOBAL QUALITY PDF (RC506 INTELLIGENCE CENTER)
   * Consolidates the 10 pillars across all projects.
   */
  exportGlobalQualityPDF: (projects: Project[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const applyBranding = (pdf: jsPDF) => {
      pdf.setFillColor(10, 10, 11); // App dark background
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      // RC506 Logo
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RC', pageWidth - 35, 20);
      pdf.setTextColor(59, 188, 169); // RC Teal
      pdf.text('506', pageWidth - 23, 20);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text('CENTRO DE INTELIGENCIA', 20, 20);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(59, 188, 169);
      pdf.text('REPORTE CONSOLIDADO DE CALIDAD ESTRATÉGICA', 20, 26);

      // Footer
      pdf.setFillColor(10, 10, 11);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.text('HC Rc506 - Gestión de Cartera Premium', 20, pageHeight - 6);
      pdf.text(`Generado: ${new Date().toLocaleString()}`, pageWidth - 60, pageHeight - 6);
    };

    applyBranding(doc);

    // Global Metrics Calculation (Zoho V4.2 Pillars)
    const pillars = [
      { key: 'sla', label: 'SLA' },
      { key: 'comunicacion', label: 'Comunicación' },
      { key: 'resolucion', label: 'Resolución' },
      { key: 'experiencia', label: 'Experiencia' },
      { key: 'continuidad', label: 'Continuidad' },
      { key: 'orden', label: 'Orden' },
      { key: 'conversion', label: 'Conversión' },
      { key: 'adaptacion', label: 'Adaptación' },
      { key: 'cultura', label: 'Cultura' },
      { key: 'valor', label: 'Valor' }
    ];

    const globalPillarAverages = pillars.map(p => {
      const valid = projects.filter(proj => proj.quarterlyAssessment?.[p.key as keyof typeof proj.quarterlyAssessment]);
      const avg = valid.length > 0 
        ? valid.reduce((acc, proj) => acc + (proj.quarterlyAssessment![p.key as keyof typeof proj.quarterlyAssessment] || 0), 0) / valid.length
        : 0;
      return { label: p.label, value: Math.round((avg / 5) * 100), raw: avg.toFixed(2) };
    });

    const globalScore = Math.round(globalPillarAverages.reduce((a, b) => a + b.value, 0) / pillars.length);

    // Summary Hero Section
    doc.setFillColor(59, 188, 169, 0.05);
    doc.roundedRect(20, 55, pageWidth - 40, 40, 5, 5, 'F');
    
    doc.setTextColor(10, 10, 11);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(`${globalScore}%`, pageWidth / 2, 80, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('HEALTH INDEX GLOBAL DE CARTERA', pageWidth / 2, 88, { align: 'center' });

    // Detailed Pillars Table
    autoTable(doc, {
      startY: 105,
      head: [['Pilar de Calidad', 'Score Global (%)', 'Promedio (1-5)']],
      body: globalPillarAverages.map(m => [m.label, `${m.value}%`, m.raw]),
      theme: 'grid',
      headStyles: { fillColor: [10, 10, 11], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'center' }
      }
    });

    doc.save(`Reporte_Calidad_Global_Rc506_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  /**
   * EXPORT INDIVIDUAL PROJECT PDF (SMART VIEW ENHANCED V4.2)
   */
  exportIndividualPDF: (project: Project) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const applyBranding = (pdf: jsPDF) => {
      pdf.setFillColor(10, 10, 11);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      pdf.setTextColor(59, 188, 169);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RC', pageWidth - 35, 22);
      pdf.setTextColor(255, 255, 255);
      pdf.text('506', pageWidth - 22, 22);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(project.client.toUpperCase(), 20, 22);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text('EXPEDIENTE ESTRATÉGICO ELITE V4.2', 20, 28);
      pdf.text(`Responsable: ${project.accountManager || 'N/A'}`, 20, 34);

      // Footer
      pdf.setFillColor(10, 10, 11);
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('Confidencial - Propiedad Intelectual Rc506', 20, pageHeight - 6);
      pdf.text(`Generado: ${new Date().toLocaleString()}`, pageWidth - 60, pageHeight - 6);
    };

    applyBranding(doc);

    // Health Score Dynamic Calculation
    const assessment = project.quarterlyAssessment || {
      sla: 5, comunicacion: 5, resolucion: 5, experiencia: 5, continuidad: 5,
      orden: 5, conversion: 5, adaptacion: 5, cultura: 5, valor: 5
    };

    const avgPillars = Math.round(
      Object.values(assessment).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 10
    );

    // Header Metrics Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 60, pageWidth - 40, 35, 3, 3, 'F');
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${avgPillars}.0`, 45, 82, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('HEALTH INDEX', 45, 88, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN OPERATIVO', 80, 72);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`País: ${project.techDNA?.country || 'N/A'}`, 80, 78);
    doc.text(`Arquitectura: ${project.techDNA?.operationMode || 'N/A'}`, 80, 83);
    doc.text(`Inicio de Servicio: ${project.startDate}`, 80, 88);

    // Detailed Pillars Table (Zoho V4.2 Style)
    const pillarData = [
      ['Pilar SLA', assessment.sla, assessment.sla >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Comunicación', assessment.comunicacion, assessment.comunicacion >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Resolución', assessment.resolucion, assessment.resolucion >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Experiencia', assessment.experiencia, assessment.experiencia >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Continuidad', assessment.continuidad, assessment.continuidad >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Orden', assessment.orden, assessment.orden >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Conversión', assessment.conversion, assessment.conversion >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Adaptación', assessment.adaptacion, assessment.adaptacion >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Cultura', assessment.cultura, assessment.cultura >= 4 ? 'Óptimo' : 'Mejorable'],
      ['Valor', assessment.valor, assessment.valor >= 4 ? 'Óptimo' : 'Mejorable']
    ];

    autoTable(doc, {
      startY: 105,
      head: [['Dimensión Estratégica', 'Score', 'Estatus']],
      body: pillarData,
      theme: 'striped',
      headStyles: { fillColor: [10, 10, 11], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'center' }
      }
    });

    // Tech DNA Section
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setTextColor(10, 10, 11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFRAESTRUCTURA Y CONECTIVIDAD (TECH DNA)', 20, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      body: [
        ['ISP Principal', project.techDNA?.isp || 'N/A', 'Tipo Enlace', project.techDNA?.connectivityType || 'N/A'],
        ['Troncal SIP', project.techDNA?.sipTrunkVirtual || 'N/A', 'Redundancia', project.techDNA?.redundancy ? 'ACTIVA' : 'NINGUNA'],
        ['Velocidad Red', `${project.techDNA?.internetSpeed || 0} Mbps`, 'Personal HC', `${project.opsPulse?.hcReal || 0} / ${project.opsPulse?.hcContracted || 0}`]
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [248, 250, 252] },
        2: { fontStyle: 'bold', fillColor: [248, 250, 252] }
      }
    });

    doc.save(`Reporte_Elite_V4.2_${project.client.replace(/\s+/g, '_')}.pdf`);
  }
};
