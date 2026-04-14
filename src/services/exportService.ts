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
   * EXPORT INDIVIDUAL PROJECT PDF
   * Deep report for a single client.
   */
  exportIndividualPDF: (project: Project, t: any) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Re-use branding logic (Simplified for consistency)
    const applyBranding = (pdf: jsPDF) => {
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setFillColor(255, 255, 255);
      pdf.ellipse(pageWidth / 2, 45, pageWidth * 0.8, 15, 'F');
      pdf.setFillColor(15, 23, 42); pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(8);
      pdf.text(`Elite Report: ${project.client}`, 10, pageHeight - 6);
    };

    applyBranding(doc);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(project.client.toUpperCase(), 20, 60);
    
    doc.setFontSize(10);
    doc.setTextColor(59, 199, 170); // RC Teal
    doc.text(`REPORTE ESTRATÉGICO INDIVIDUAL | ID: ${project.id}`, 20, 68);

    // Current Performance Summary
    autoTable(doc, {
      startY: 85,
      head: [['Indicador de Salud', 'Estado Actual']],
      body: [
        ['Puntaje Cuantitativo', `${project.evaluations[0]?.quantitative || '0'} / 5.0`],
        ['Estatus Estratégico', project.evaluations[0]?.status || 'Stable'],
        ['Fecha de Inicio de Relación', project.startDate],
        ['Resumen de Gestión', project.evaluations[0]?.qualitative || 'No se han registrado auditorías recientes.']
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 199, 170], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // History Table
    const finalY = (doc as any).lastAutoTable.finalY || 140;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('HISTORIAL DE AUDITORÍAS', 20, finalY + 20);

    autoTable(doc, {
      startY: finalY + 25,
      head: [['Fecha', 'Score', 'Estatus', 'Análisis Cualitativo']],
      body: project.evaluations.map(e => [
        `${e.month}/${e.year}`,
        e.quantitative,
        e.status,
        e.qualitative
      ]),
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 }
    });

    doc.save(`Reporte_Elite_${project.client.replace(/\s+/g, '_')}.pdf`);
  }
};
