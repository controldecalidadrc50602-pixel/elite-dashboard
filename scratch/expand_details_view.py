import os
import re

def expand_details_asset_view():
    path = r'c:\Users\Marilyn\OneDrive\Documentos\GitHub\Minuta\Minuta-IA-V3-main\elite-dashboard\src\components\ProjectDetailsModal.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_view = '''<div key={asset.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col gap-8 group hover:border-rc-teal/30 transition-all shadow-xl shadow-black/10">
                                 <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-rc-teal/10 rounded-[20px] flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                       <Headphones size={28} />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
                                       <div className="md:col-span-3 flex flex-col">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Categoría</span>
                                          <div className="bg-black/20 rounded-2xl px-5 py-4 border border-white/5">
                                             <span className="text-xs font-black text-white uppercase">{asset.category || 'Hardware'}</span>
                                          </div>
                                       </div>
                                       <div className="md:col-span-6 flex flex-col">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Modelo / Nombre</span>
                                          <div className="bg-black/20 rounded-2xl px-5 py-4 border border-white/5">
                                             <span className="text-xs font-black text-white uppercase">{asset.model}</span>
                                          </div>
                                       </div>
                                       <div className="md:col-span-3 flex flex-col">
                                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Cantidad</span>
                                          <div className="bg-black/20 rounded-2xl px-5 py-4 border border-white/5">
                                             <span className="text-xs font-black text-white">{asset.quantity} Unid.</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                    <div className="md:col-span-4 flex flex-col">
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Posición / VPN / Acceso</span>
                                       <div className="bg-black/20 rounded-2xl px-5 py-4 border border-white/5">
                                          <span className="text-xs font-black text-white uppercase">{asset.assignedPosition || 'N/A'}</span>
                                       </div>
                                    </div>
                                    <div className="md:col-span-8 flex flex-col">
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Notas y Detalles Operativos</span>
                                       <div className="bg-black/20 rounded-2xl px-5 py-4 border border-white/5">
                                          <span className="text-sm font-medium text-rc-teal italic leading-relaxed">{asset.notes || 'Sin especificaciones adicionales.'}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>'''

    pattern = r'<div key=\{asset\.id\} className="p-6 bg-white/\[0\.03\] border border-white/5 rounded-\[32px\] flex items-center gap-6 group hover:border-rc-teal/30 transition-all">[\s\S]+?</div>\s+</div>'
    
    # I'll be more precise with the inner map
    full_pattern = r'\{editedProject\.assets\?\.map\(\(asset\) => \(\s+<div key=\{asset\.id\}[\s\S]+?</div>\s+\)\)\}'
    
    replacement = f'{{editedProject.assets?.map((asset) => (\\n                              {new_view}\\n                           ))}}'
    
    if re.search(full_pattern, content):
        content = re.sub(full_pattern, replacement, content)
        print("Details view updated successfully.")
    else:
        print("Details view pattern NOT found.")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

expand_details_asset_view()
