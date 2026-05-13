import os
import re

def fix_project_details_modal():
    path = r'c:\Users\Marilyn\OneDrive\Documentos\GitHub\Minuta\Minuta-IA-V3-main\elite-dashboard\src\components\ProjectDetailsModal.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix tabs definition
    content = content.replace(
        "{ id: 'milestones', label: 'Hitos', icon: Calendar }",
        "{ id: 'milestones', label: 'Activos', icon: Headphones }"
    )

    # 2. Restore admin tab content AND update assets tab
    # I'll look for the block I replaced
    admin_pattern = r'\{activeTab === \'admin\' && \(\s+<div className="max-w-2xl mx-auto space-y-4">\s+\{/\* \.\.\. admin fields \.\.\. \*/\}\s+</div>\s+\)\}'
    
    admin_content = '''{activeTab === 'admin' && (
                        <div className="max-w-2xl mx-auto space-y-4">
                           {[
                              { id: 'projectLeader', label: 'Líder de Proyecto Asignado' },
                              { id: 'timelyDocumentation', label: 'Entrega Info Oportuna' },
                              { id: 'advisoryReceptivity', label: 'Receptivo a Asesoría' },
                              { id: 'effectiveServiceUse', label: 'Uso Efectivo del Servicio' },
                              { id: 'serviceContinuity', label: 'Continuidad en el Uso' },
                              { id: 'reportValuation', label: 'Valora Informes de Gestión' },
                              { id: 'paymentPunctuality', label: 'Puntualidad en Pagos' }
                           ].map(item => (
                              <div 
                                 key={item.id}
                                 className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all"
                              >
                                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                                 <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                    editedProject.clientEvaluation?.[item.id as keyof typeof editedProject.clientEvaluation] 
                                    ? 'bg-rc-teal border-rc-teal text-black shadow-lg shadow-rc-teal/20' 
                                    : 'border-white/10 text-transparent'
                                 }`}>
                                    <CheckCircle size={18} strokeWidth={3} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}'''

    content = re.sub(admin_pattern, admin_content, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_project_modal():
    path = r'c:\Users\Marilyn\OneDrive\Documentos\GitHub\Minuta\Minuta-IA-V3-main\elite-dashboard\src\components\Modals\ProjectModal.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Rename Hardware to Activos y Sistemas
    content = content.replace("Gestión de Hardware.", "Gestión de Activos y Sistemas.")

    # Update asset initialization
    content = content.replace(
        "model: '', quantity: 1, purchaseDate: new Date().toISOString().split('T')[0],",
        "category: 'Hardware', model: '', quantity: 1, purchaseDate: new Date().toISOString().split('T')[0], notes: '',"
    )

    # Update asset fields grid
    # Looking for line 983 area
    old_grid = r'<div className="flex-1 grid grid-cols-4 gap-6">[\s\S]+?<div className="space-y-1">[\s\S]+?<label className="text-\[8px\] opacity-60">Cantidad</label>'
    new_grid = '''<div className="flex-1 grid grid-cols-5 gap-6">
                                <div className="space-y-1">
                                   <label className="text-[8px] opacity-60">Categoría</label>
                                   <select 
                                     value={asset.category || 'Hardware'}
                                     onChange={e => {
                                       const a = [...(formData.assets || [])];
                                       a[index].category = e.target.value as any;
                                       setFormData({...formData, assets: a});
                                     }}
                                     className="w-full text-[10px] font-black uppercase bg-transparent border-none p-0 focus:ring-0"
                                   >
                                      <option value="Hardware">Hardware</option>
                                      <option value="Sistema">Sistema</option>
                                      <option value="Conectividad">Conectividad</option>
                                      <option value="Licencia">Licencia</option>
                                   </select>
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[8px] opacity-60">Modelo / Nombre</label>
                                   <input 
                                     placeholder="Ej: CRM Interno"
                                     value={asset.model}
                                     onChange={e => {
                                       const a = [...(formData.assets || [])];
                                       a[index].model = e.target.value;
                                       setFormData({...formData, assets: a});
                                     }}
                                     className="w-full text-xs font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0"
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[8px] opacity-60">Cantidad</label>'''

    content = re.sub(old_grid, new_grid, content)

    # Add the missing fields (Position/VPN and Notes) after Quantity
    # Looking for Quantity input
    quantity_pattern = r'(<input[\s\S]+?type="number" value=\{asset\.quantity\}[\s\S]+?className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0"\s+/>\s+</div>)'
    new_fields = r'''\1
                                <div className="space-y-1">
                                   <label className="text-[8px] opacity-60">Posición / VPN</label>
                                   <input 
                                     placeholder="Ej: Pos 1 / Cisco VPN"
                                     value={asset.assignedPosition}
                                     onChange={e => {
                                       const a = [...(formData.assets || [])];
                                       a[index].assignedPosition = e.target.value;
                                       setFormData({...formData, assets: a});
                                     }}
                                     className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0"
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[8px] opacity-60">Notas / Detalles Libres</label>
                                   <input 
                                     placeholder="Ej: Requiere token..."
                                     value={asset.notes || ''}
                                     onChange={e => {
                                       const a = [...(formData.assets || [])];
                                       a[index].notes = e.target.value;
                                       setFormData({...formData, assets: a});
                                     }}
                                     className="w-full text-[10px] font-medium bg-transparent border-none p-0 focus:ring-0 italic"
                                   />
                                </div>'''
    
    content = re.sub(quantity_pattern, new_fields, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_project_details_modal()
fix_project_modal()
print("Fixes applied successfully.")
