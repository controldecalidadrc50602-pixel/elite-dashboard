import os
import re

def fix_asset_card_layout():
    path = r'c:\Users\Marilyn\OneDrive\Documentos\GitHub\Minuta\Minuta-IA-V3-main\elite-dashboard\src\components\Modals\ProjectModal.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_asset_card = '''<div key={asset.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] relative group flex flex-col gap-8 hover:border-rc-teal/30 transition-all">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-rc-teal/10 rounded-[20px] flex items-center justify-center text-rc-teal group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                                   <Headphones size={28} />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
                                    <div className="md:col-span-3 space-y-2">
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                                       <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                                          <select 
                                            value={asset.category || 'Hardware'}
                                            onChange={e => {
                                              const a = [...(formData.assets || [])];
                                              a[index].category = e.target.value as any;
                                              setFormData({...formData, assets: a});
                                            }}
                                            className="w-full text-xs font-black uppercase bg-transparent border-none p-0 focus:ring-0 text-white cursor-pointer"
                                          >
                                             <option value="Hardware" className="bg-[#121212]">Hardware</option>
                                             <option value="Sistema" className="bg-[#121212]">Sistema</option>
                                             <option value="Conectividad" className="bg-[#121212]">Conectividad</option>
                                             <option value="Licencia" className="bg-[#121212]">Licencia</option>
                                          </select>
                                       </div>
                                    </div>

                                    <div className="md:col-span-6 space-y-2">
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Modelo / Nombre del Activo</label>
                                       <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                                          <input 
                                            placeholder="Ej: CRM Interno / Auriculares Jabra"
                                            value={asset.model}
                                            onChange={e => {
                                              const a = [...(formData.assets || [])];
                                              a[index].model = e.target.value;
                                              setFormData({...formData, assets: a});
                                            }}
                                            className="w-full text-xs font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-white/10"
                                          />
                                       </div>
                                    </div>

                                    <div className="md:col-span-3 space-y-2">
                                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Cantidad</label>
                                       <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                                          <input 
                                            type="number" 
                                            value={asset.quantity}
                                            onChange={e => {
                                              const a = [...(formData.assets || [])];
                                              a[index].quantity = parseInt(e.target.value) || 0;
                                              setFormData({...formData, assets: a});
                                            }}
                                            className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0 text-white"
                                          />
                                       </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-4 space-y-2">
                                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Posición / VPN / Acceso</label>
                                   <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                                      <input 
                                        placeholder="Ej: Posición 45 / GlobalProtect VPN"
                                        value={asset.assignedPosition}
                                        onChange={e => {
                                          const a = [...(formData.assets || [])];
                                          a[index].assignedPosition = e.target.value;
                                          setFormData({...formData, assets: a});
                                        }}
                                        className="w-full text-xs font-black bg-transparent border-none p-0 focus:ring-0 text-white placeholder:text-white/10"
                                      />
                                   </div>
                                </div>

                                <div className="md:col-span-8 space-y-2">
                                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Notas y Detalles Operativos</label>
                                   <div className="bg-black/20 border border-white/5 rounded-2xl p-4 focus-within:border-rc-teal/50 transition-colors">
                                      <input 
                                        placeholder="Escriba aquí cualquier detalle adicional..."
                                        value={asset.notes || ''}
                                        onChange={e => {
                                          const a = [...(formData.assets || [])];
                                          a[index].notes = e.target.value;
                                          setFormData({...formData, assets: a});
                                        }}
                                        className="w-full text-[11px] font-medium bg-transparent border-none p-0 focus:ring-0 text-slate-300 italic placeholder:text-white/10"
                                      />
                                   </div>
                                </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => {
                                 const a = [...(formData.assets || [])];
                                 a.splice(index, 1);
                                 setFormData({...formData, assets: a});
                              }}
                              className="absolute top-6 right-6 p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                            >
                               <Trash2 size={16} />
                            </button>
                        </div>'''

    # Pattern for the entire assets mapping block
    # Note: I'll use a more flexible regex that matches the current 5-column grid I just added
    pattern = r'<div className="grid grid-cols-1 gap-4">[\s\S]+?\{formData\.assets\?\.map\([\s\S]+?</div>\s+\)\)\}\s+</div>'
    
    replacement = f'<div className="grid grid-cols-1 gap-8 pb-12">\\n                        {{formData.assets?.map((asset, index) => (\\n                            {new_asset_card}\\n                        ))}}\\n                      </div>'
    
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        print("Regex match found and replaced.")
    else:
        print("Regex match NOT found. Checking for slightly different structure...")
        # Fallback: maybe it's gap-6 instead of gap-4 (since I might have changed it)
        pattern2 = r'<div className="grid grid-cols-1 gap-[\d]+">[\s\S]+?\{formData\.assets\?\.map\([\s\S]+?</div>\s+\)\)\}\s+</div>'
        if re.search(pattern2, content):
            content = re.sub(pattern2, replacement, content)
            print("Regex pattern 2 match found and replaced.")
        else:
            print("Could not find the target block.")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_asset_card_layout()
