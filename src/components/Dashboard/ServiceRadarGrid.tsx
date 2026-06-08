import React, { useState, useMemo } from 'react';
import { Project, ClientService } from '../../types/project';
import { Search, Download, RefreshCw, Server, Globe, MessageSquare, HeadphonesIcon, Cpu } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ServiceRadarGridProps {
  projects: Project[];
}

interface FlattenedService {
  project: Project;
  service: ClientService;
  id: string; // Unique ID for the flattened item
}

const ServiceRadarGrid: React.FC<ServiceRadarGridProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten the services into a single array
  const allServices = useMemo<FlattenedService[]>(() => {
    const list: FlattenedService[] = [];
    projects.forEach(p => {
      p.services?.forEach(s => {
        list.push({ project: p, service: s, id: `${p.id}-${s.id}` });
      });
    });
    return list;
  }, [projects]);

  const filteredServices = useMemo(() => {
    return allServices.filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.service.name.toLowerCase().includes(q) ||
        item.project.client.toLowerCase().includes(q) ||
        item.service.type?.toLowerCase().includes(q) ||
        item.project.adminStatus.toLowerCase().includes(q)
      );
    });
  }, [allServices, searchQuery]);

  const totalPages = Math.ceil(filteredServices.length / entriesPerPage);
  const currentData = filteredServices.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleOpenProject = (id: string) => {
    document.dispatchEvent(new CustomEvent('open-client-modal', { detail: { id } }));
  };

  const handleExportToExcel = () => {
    try {
      const data = filteredServices.map(item => ({
        ID_Servicio: item.service.id,
        Empresa: item.project.client,
        Tipo_Servicio: item.service.type || 'N/A',
        Nombre_Instancia: item.service.name,
        Fecha_Alta: item.service.startDate,
        Status_Cliente: item.project.adminStatus,
        Responsable: item.service.responsible || item.project.accountManager || 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, 
        { wch: 15 }, { wch: 15 }, { wch: 20 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Radar de Servicios");
      XLSX.writeFile(wb, `RC506_Radar_Servicios_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting Radar to Excel:', error);
    }
  };

  const getServiceIcon = (type?: string) => {
    switch (type) {
      case 'IPBX': return <Server size={18} className="text-blue-500" />;
      case 'Servicios Web': return <Globe size={18} className="text-emerald-500" />;
      case 'Botmaker': return <MessageSquare size={18} className="text-purple-500" />;
      case 'Contact Center': return <HeadphonesIcon size={18} className="text-orange-500" />;
      default: return <Cpu size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* KPI Header */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Layers size={20} className="text-blue-500" />
          Radar de Instancias de Servicio
        </h3>
        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg">{allServices.length}</span>
            <span className="text-slate-500">Servicios Activos Total</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600 text-lg">{allServices.filter(s => s.service.type === 'Servicios Web').length}</span>
            <span className="text-emerald-500">Web & Cloud</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600 text-lg">{allServices.filter(s => s.service.type === 'IPBX' || s.service.type === 'Contact Center').length}</span>
            <span className="text-blue-500">Comunicaciones</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-600 text-lg">{allServices.filter(s => s.service.type === 'Botmaker').length}</span>
            <span className="text-purple-500">Bots & IA</span>
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
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={16} /> Exportar Excel
          </button>
          <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            type="text" 
            placeholder="Buscar instancia o cliente..." 
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
              <th className="px-6 py-4 w-16">#</th>
              <th className="px-6 py-4">Cliente (Cuenta)</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Instancia de Servicio</th>
              <th className="px-6 py-4">Status Cliente</th>
              <th className="px-6 py-4">Fecha Alta</th>
              <th className="px-6 py-4">Responsable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {currentData.length > 0 ? currentData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-400">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="px-6 py-4">
                  <span 
                    onClick={() => handleOpenProject(item.project.id)}
                    className="font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer transition-colors flex items-center gap-2"
                  >
                    {item.project.logoUrl ? (
                      <img src={item.project.logoUrl} className="w-5 h-5 object-contain" alt="Logo" />
                    ) : (
                      <div className="w-5 h-5 bg-slate-200 rounded-full" />
                    )}
                    {item.project.client}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(item.service.type)}
                    <span className="font-medium">{item.service.type || 'Otros'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-600 font-medium">{item.service.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    item.project.adminStatus === 'Activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    item.project.adminStatus === 'En Proceso' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {item.project.adminStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(item.service.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{item.service.responsible || item.project.accountManager || 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron instancias de servicio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="text-sm text-slate-500">
          Mostrando desde {(currentPage - 1) * entriesPerPage + 1} hasta {Math.min(currentPage * entriesPerPage, filteredServices.length)} de {filteredServices.length} servicios
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

export default ServiceRadarGrid;
