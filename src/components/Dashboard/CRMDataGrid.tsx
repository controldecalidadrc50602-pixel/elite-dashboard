import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Search, Download, RefreshCw, ChevronLeft, ChevronRight, ToggleRight, ToggleLeft, Layers } from 'lucide-react';
import { exportService } from '../../services/exportService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';

interface CRMDataGridProps {
  projects: Project[];
}

const CRMDataGrid: React.FC<CRMDataGridProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const handleToggleStatus = async (project: Project) => {
    const isActive = project.adminStatus === 'Activo' || project.adminStatus === 'En Proceso';
    const newStatus = isActive ? 'Inactivo' : 'Activo';
    await projectService.updateProject({ ...project, adminStatus: newStatus as any }, projects, user?.displayName || user?.email || 'Administrador');
  };

  const handleOpenProject = (id: string) => {
    document.dispatchEvent(new CustomEvent('open-client-modal', { detail: { id } }));
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`¿Estás seguro de desactivar (poner en Inactivo) a ${selectedIds.size} clientes seleccionados?`)) return;
    
    let currentProjects = [...projects];
    for (const id of Array.from(selectedIds)) {
      const p = currentProjects.find(x => x.id === id);
      if (p && p.adminStatus !== 'Inactivo' && p.adminStatus !== 'Archivado') {
        currentProjects = await projectService.updateProject(
          { ...p, adminStatus: 'Inactivo' }, 
          currentProjects, 
          user?.displayName || user?.email || 'Administrador'
        );
      }
    }
    setSelectedIds(new Set());
  };

  const filteredProjects = projects.filter(p => 
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partnerLiaison?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partnerLiaison?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / entriesPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const activeClients = projects.filter(p => p.adminStatus === 'Activo' || p.adminStatus === 'En Proceso').length;
  const inactiveClients = projects.filter(p => p.adminStatus === 'Inactivo' || p.adminStatus === 'Archivado').length;
  const activeContacts = projects.filter(p => p.partnerLiaison?.email && p.adminStatus !== 'Archivado').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* KPI Header - Estilo CRM Clásico */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resumen de clientes
        </h3>
        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg">{projects.length}</span>
            <span className="text-slate-500">Total de clientes</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600 text-lg">{activeClients}</span>
            <span className="text-emerald-500">Clientes activos</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-500 text-lg">{inactiveClients}</span>
            <span className="text-rose-400">Clientes desactivados</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600 text-lg">{activeContacts}</span>
            <span className="text-blue-500">Contactos activos</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 flex items-center justify-between bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <select 
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-slate-400 rounded-lg px-3 py-2 text-sm text-white bg-slate-500 font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-colors hover:bg-slate-600 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button 
            onClick={() => exportService.exportCRMToExcel(projects)}
            className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={16} /> Exportar Excel
          </button>
          <button 
            onClick={handleBulkDeactivate}
            disabled={selectedIds.size === 0}
            className={`flex items-center gap-2 px-5 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm ${
              selectedIds.size > 0 
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                : 'bg-white border-slate-300 text-slate-400 cursor-not-allowed'
            }`}
          >
            Desactivar ({selectedIds.size})
          </button>
          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            type="text" 
            placeholder="Buscar:" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 bg-slate-500 text-white placeholder:text-slate-300 font-medium shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-blue-500" 
                  checked={currentData.length > 0 && selectedIds.size === currentData.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(currentData.map(p => p.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                />
              </th>
              <th className="px-6 py-4 w-16">#</th>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Contacto principal</th>
              <th className="px-6 py-4">Email principal</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Activo</th>
              <th className="px-6 py-4">Status Salud</th>
              <th className="px-6 py-4">Fecha creación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {currentData.length > 0 ? currentData.map((project, index) => (
              <tr key={project.id} className={`transition-colors ${selectedIds.has(project.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    checked={selectedIds.has(project.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedIds);
                      if (e.target.checked) newSet.add(project.id);
                      else newSet.delete(project.id);
                      setSelectedIds(newSet);
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-slate-400">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="px-6 py-4">
                  <span 
                    onClick={() => handleOpenProject(project.id)}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                  >
                    {project.client}
                  </span>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-medium">{project.partnerLiaison?.name || '-'}</td>
                <td className="px-6 py-4 text-rc-teal">{project.partnerLiaison?.email || '-'}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{project.techDNA?.phoneLine || '-'}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleStatus(project)}
                    className="focus:outline-none hover:scale-110 transition-transform active:scale-95"
                    title="Alternar Estado"
                  >
                    {project.adminStatus !== 'Inactivo' && project.adminStatus !== 'Archivado' ? (
                      <ToggleRight size={28} className="text-blue-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-slate-300" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    project.healthFlag === 'Verde' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    project.healthFlag === 'Amarilla' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {project.healthFlag}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(project.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="text-sm text-slate-500">
          Mostrando desde {(currentPage - 1) * entriesPerPage + 1} hasta {Math.min(currentPage * entriesPerPage, filteredProjects.length)} de {filteredProjects.length} entradas
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 border rounded text-sm ${
                currentPage === i + 1 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMDataGrid;
