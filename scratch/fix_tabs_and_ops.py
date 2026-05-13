import os
import re

def fix_project_modal_tabs_and_ops():
    path = r'c:\\Users\\Marilyn\\OneDrive\\Documentos\\GitHub\\Minuta\\Minuta-IA-V3-main\\elite-dashboard\\src\\components\\Modals\\ProjectModal.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new sections without using f-strings for the whole block to avoid confusion with {}
    
    new_ops_type_rendering = r'''<div className="space-y-4">
                                <label>Tipo de Operación (Selección Múltiple)</label>
                                <div className="grid grid-cols-2 gap-3">
                                  {['Servicio al Cliente', 'Ventas', 'Cobranza', 'Soporte Técnico'].map(type => {
                                    const currentTypes = (formData.opsPulse?.operationType || '').split(',').map(t => t.trim()).filter(Boolean);
                                    const isSelected = currentTypes.includes(type);
                                    return (
                                      <button
                                        key={type} type="button"
                                        onClick={() => {
                                          let newTypes;
                                          if (isSelected) {
                                            newTypes = currentTypes.filter(t => t !== type);
                                          } else {
                                            newTypes = [...currentTypes, type];
                                          }
                                          setFormData({
                                            ...formData, 
                                            opsPulse: { 
                                              ...formData.opsPulse!, 
                                              operationType: newTypes.join(', ') 
                                            }
                                          });
                                        }}
                                        className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                          isSelected 
                                          ? 'bg-rc-teal text-black border-rc-teal shadow-lg shadow-rc-teal/20' 
                                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                      >
                                        {type}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="p-4 bg-rc-teal/5 border border-rc-teal/20 rounded-2xl">
                                   <p className="text-[10px] font-black text-rc-teal uppercase tracking-widest mb-1">Resumen de Operación</p>
                                   <p className="text-[11px] font-bold text-white">{(formData.opsPulse?.operationType || 'No especificado')}</p>
                                </div>
                             </div>'''

    services_section = r'''{activeTab === 'services' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Servicios</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Catálogo de Servicios Activos.</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newServices = [...(formData.services || [])];
                            newServices.push({ 
                              id: Math.random().toString(36).substr(2, 9), 
                              name: '', 
                              description: '', 
                              startDate: new Date().toISOString().split('T')[0], 
                              score: 5,
                              type: 'Contact Center'
                            });
                            setFormData({...formData, services: newServices});
                          }}
                          className="px-6 py-3 bg-rc-teal/10 border border-rc-teal/20 text-rc-teal rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rc-teal/20 transition-all"
                        >
                          <Plus size={16} /> Agregar Servicio
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-6">
                        {formData.services?.map((service, index) => (
                          <div key={service.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] relative group hover:border-rc-teal/30 transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Servicio</label>
                                  <input 
                                    value={service.name}
                                    onChange={e => {
                                      const s = [...(formData.services || [])];
                                      s[index].name = e.target.value;
                                      setFormData({...formData, services: s});
                                    }}
                                    placeholder="Ej: Atención VIP / Soporte N1"
                                    className="w-full text-sm font-black uppercase tracking-widest"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                                  <textarea 
                                    value={service.description}
                                    onChange={e => {
                                      const s = [...(formData.services || [])];
                                      s[index].description = e.target.value;
                                      setFormData({...formData, services: s});
                                    }}
                                    placeholder="Breve descripción del alcance..."
                                    className="w-full h-20 resize-none text-xs font-medium"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría Técnica</label>
                                  <select 
                                    value={service.type}
                                    onChange={e => {
                                      const s = [...(formData.services || [])];
                                      s[index].type = e.target.value as any;
                                      setFormData({...formData, services: s});
                                    }}
                                    className="w-full text-xs font-black uppercase tracking-widest"
                                  >
                                    <option value="Botmaker">Botmaker</option>
                                    <option value="Yeastar">Yeastar</option>
                                    <option value="IPBX">IPBX</option>
                                    <option value="Contact Center">Contact Center</option>
                                    <option value="Servicios Web">Servicios Web</option>
                                    <option value="Capacitaciones">Capacitaciones</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha Inicio</label>
                                  <input 
                                    type="date"
                                    value={service.startDate}
                                    onChange={e => {
                                      const s = [...(formData.services || [])];
                                      s[index].startDate = e.target.value;
                                      setFormData({...formData, services: s});
                                    }}
                                    className="w-full text-xs font-medium"
                                  />
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const s = (formData.services || []).filter(item => item.id !== service.id);
                                    setFormData({...formData, services: s});
                                  }}
                                  className="col-span-2 py-3 bg-rose-500/10 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all mt-2"
                                >
                                  Eliminar Servicio
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}'''

    assets_section = r'''{activeTab === 'assets' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Activos y Sistemas</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestión de Activos y Sistemas.</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newAssets = [...(formData.assets || [])];
                            newAssets.push({ id: Math.random().toString(36).substr(2, 9), model: '', quantity: 0, category: 'Hardware', notes: '', assignedPosition: '' });
                            setFormData({...formData, assets: newAssets});
                          }}
                          className="px-6 py-3 bg-rc-teal text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-rc-teal/20"
                        >
                          <Plus size={16} /> Registrar Activo
                        </button>
                      </header>

                      <div className="grid grid-cols-1 gap-8 pb-12">
                        {formData.assets?.map((asset, index) => (
                            <div key={asset.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] relative group flex flex-col gap-8 hover:border-rc-teal/30 transition-all">
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
                        </div>
                        ))}
                      </div>
                    </motion.div>
                  )}'''

    evaluation_section = r'''{activeTab === 'evaluation' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Evaluación del Cliente</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salud de la Relación.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Evalúa el compromiso mutuo mediante rúbricas clave para detectar riesgos comerciales de forma temprana.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                           { id: 'projectLeader', label: 'Líder de Proyecto Definido' },
                           { id: 'timelyDocumentation', label: 'Entrega Documentación a Tiempo' },
                           { id: 'advisoryReceptivity', label: 'Receptivo a Asesoría' },
                           { id: 'effectiveServiceUse', label: 'Uso Efectivo del Servicio' },
                           { id: 'serviceContinuity', label: 'Continuidad en el Uso' },
                           { id: 'reportValuation', label: 'Valora Informes de Gestión' },
                           { id: 'paymentPunctuality', label: 'Puntualidad en Pagos' }
                        ].map((item) => (
                           <div 
                              key={item.id}
                              onClick={() => {
                                 const evalData = { ...formData.clientEvaluation! };
                                 evalData[item.id as keyof typeof evalData] = !evalData[item.id as keyof typeof evalData];
                                 setFormData({ ...formData, clientEvaluation: evalData as any });
                              }}
                              className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
                           >
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
                              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                 formData.clientEvaluation?.[item.id as keyof typeof formData.clientEvaluation] 
                                 ? 'bg-rc-teal border-rc-teal text-black shadow-lg shadow-rc-teal/20' 
                                 : 'border-white/10 text-transparent'
                              }`}>
                                 <CheckCircle size={18} strokeWidth={3} />
                              </div>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  )}'''

    # Build the full content area replacement
    full_animate_content = r'''<AnimatePresence mode="wait">
                  {activeTab === 'basic' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Identidad</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración base de la cuenta.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Define la imagen corporativa, los responsables estratégicos y el pulso inicial de salud del cliente.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-[1fr,2fr] gap-12 p-10 bg-black/10 rounded-[48px] border border-white/5">
                        <div className="space-y-6">
                           <div className="w-full aspect-square bg-slate-900/40 rounded-[32px] border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden relative group transition-all hover:border-[var(--rc-turquoise)]/30">
                              {formData.logoUrl ? (
                                <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-contain p-6" />
                              ) : (
                                <div className="text-center p-4 opacity-40">
                                  <Upload size={40} className="mx-auto mb-3 text-rc-teal" />
                                  <span className="text-[10px] font-black uppercase tracking-widest block">Logo Cliente</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-[var(--rc-turquoise)]/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all backdrop-blur-sm">
                                <Upload size={32} className="text-[var(--bg-primary)] mb-2" />
                                <span className="text-[10px] font-black text-[var(--bg-primary)] uppercase">Cambiar Imagen</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                              </label>
                           </div>
                           <p className="text-[9px] font-bold text-slate-500 uppercase text-center px-4">Arrastra o haz clic para subir el logo corporativo</p>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label>Nombre del Cliente</label>
                            <input 
                              required value={formData.client}
                              onChange={e => setFormData({...formData, client: e.target.value})}
                              placeholder="Ej: Rc506 Solutions"
                              className="w-full text-lg font-black uppercase tracking-widest"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                               <label>Account Manager (Rc506)</label>
                               <input 
                                 value={formData.accountManager}
                                 onChange={e => setFormData({...formData, accountManager: e.target.value})}
                                 placeholder="Nombre del Responsable"
                                 className="w-full"
                               />
                             </div>
                             <div className="space-y-2">
                               <label>Bandera de Salud</label>
                               <select 
                                 value={formData.healthFlag}
                                 onChange={e => setFormData({...formData, healthFlag: e.target.value as any})}
                                 className="w-full font-black uppercase tracking-widest appearance-none cursor-pointer"
                               >
                                 <option value="Verde">🟢 Óptimo (Verde)</option>
                                 <option value="Amarilla">🟡 Preventivo (Amarilla)</option>
                                 <option value="Roja">🔴 Riesgo (Roja)</option>
                                 <option value="Negra">⚫ Crítico (Negra)</option>
                               </select>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Colaborador Enlace (Cliente)</label>
                          <div className="grid grid-cols-2 gap-4">
                             <input 
                               placeholder="Nombre"
                               value={formData.partnerLiaison?.name}
                               onChange={e => setFormData({...formData, partnerLiaison: { ...formData.partnerLiaison!, name: e.target.value } })}
                               className="w-full"
                             />
                             <input 
                               placeholder="Correo"
                               value={formData.partnerLiaison?.email}
                               onChange={e => setFormData({...formData, partnerLiaison: { ...formData.partnerLiaison!, email: e.target.value } })}
                               className="w-full"
                             />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label>Fecha de Onboarding</label>
                          <input 
                            type="date" required value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                            className="w-full font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label>Objetivo Estratégico (Éxito del Cliente)</label>
                        <textarea 
                          value={formData.strategicObjective}
                          onChange={e => setFormData({...formData, strategicObjective: e.target.value})}
                          placeholder="Define qué éxito busca el cliente con esta operación..."
                          className="w-full h-24 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'ops' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Operaciones</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capacidad Instalada y HC.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Gestiona el personal, planes de contingencia y la matriz de turnos para asegurar la continuidad del servicio.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-6">
                            ''' + new_ops_type_rendering + r'''
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                 <label>Personal Contratado (Plan)</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcContracted}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcContracted: parseInt(e.target.value) || 0 } })}
                                   className="w-full text-lg font-black"
                                   placeholder="Cant. según contrato"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label>Personal Real (En Piso)</label>
                                 <input 
                                   type="number" value={formData.opsPulse?.hcReal}
                                   onChange={e => setFormData({...formData, opsPulse: { ...formData.opsPulse!, hcReal: parseInt(e.target.value) || 0 } })}
                                   className="w-full text-lg font-black"
                                   placeholder="Cant. actual"
                                 />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6 p-8 bg-black/10 rounded-[40px] border border-white/5">
                            <label>Estatus de Backup (Contingencia)</label>
                            <div className="flex flex-col gap-3">
                              {['Disponible', 'En Uso', 'Crítico'].map(status => (
                                <button
                                  key={status} type="button"
                                  onClick={() => setFormData({...formData, opsPulse: { ...formData.opsPulse!, backupStatus: status as any } })}
                                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                    formData.opsPulse?.backupStatus === status 
                                    ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                                    : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <label>Matriz de Horarios y Turnos</label>
                            <button 
                              type="button"
                              onClick={() => {
                                const newShifts = [...(formData.opsPulse?.shifts || [])];
                                newShifts.push({ id: Math.random().toString(36).substr(2, 9), name: `Turno ${String.fromCharCode(65 + newShifts.length)}`, timeRange: '08:00 - 17:00', peopleCount: 0 });
                                setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: newShifts } });
                              }}
                              className="text-[var(--rc-turquoise)] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-[var(--rc-turquoise)]/10 rounded-xl hover:bg-[var(--rc-turquoise)]/20 transition-all"
                            >
                               <Plus size={14} /> Configurar Turnos
                            </button>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.opsPulse?.shifts?.map((shift, idx) => (
                               <div key={shift.id} className="p-6 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between gap-6 relative group">
                                  <div className="flex-1 grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{shift.name}</span>
                                        <input 
                                          value={shift.timeRange}
                                          onChange={e => {
                                             const s = [...(formData.opsPulse?.shifts || [])];
                                             s[idx].timeRange = e.target.value;
                                             setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: s } });
                                          }}
                                          className="bg-transparent border-none p-0 text-xs font-black uppercase tracking-widest focus:ring-0 w-full"
                                        />
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Personal</span>
                                        <input 
                                          type="number" value={shift.peopleCount}
                                          onChange={e => {
                                             const s = [...(formData.opsPulse?.shifts || [])];
                                             s[idx].peopleCount = parseInt(e.target.value) || 0;
                                             setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: s } });
                                          }}
                                          className="bg-transparent border-none p-0 text-xs font-black focus:ring-0 w-full"
                                        />
                                     </div>
                                  </div>
                                  <button 
                                     type="button"
                                     onClick={() => setFormData({...formData, opsPulse: { ...formData.opsPulse!, shifts: formData.opsPulse?.shifts?.filter(s => s.id !== shift.id) } })}
                                     className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-lg"
                                  >
                                     <X size={14} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tech' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Tech DNA</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ADN Tecnológico.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Registra la infraestructura de red, conectividad y redundancia que soporta la operación del cliente.
                           </p>
                        </div>
                      </header>

                      <div className="space-y-2">
                        <label>Modalidad de Operación</label>
                        <div className="flex gap-4">
                          {['RC506', 'WYP', 'IPBX', 'HÍBRIDO'].map(mode => (
                            <button
                              key={mode} type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, operationMode: mode as any } })}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.techDNA?.operationMode === mode 
                                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)] shadow-lg' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Proveedor de Internet (ISP)</label>
                          <input 
                            value={formData.techDNA?.isp}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, isp: e.target.value } })}
                            placeholder="Ej: Liberty / Telecable"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label>Velocidad Contratada (Mbps)</label>
                          <input 
                            value={formData.techDNA?.internetSpeed}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, internetSpeed: e.target.value } })}
                            placeholder="Ej: 500/500 symmetrical"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label>Tipo de Conectividad</label>
                          <select 
                            value={formData.techDNA?.connectivityType}
                            onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, connectivityType: e.target.value as any } })}
                            className="w-full font-black uppercase tracking-widest cursor-pointer"
                          >
                            <option value="Fibra Óptica">Fibra Óptica</option>
                            <option value="Radiofrecuencia">Radiofrecuencia</option>
                            <option value="Cobre">Cobre</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label>Redundancia de Proveedor</label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, redundancy: true } })}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                formData.techDNA?.redundancy 
                                ? 'bg-[var(--rc-turquoise)] text-[var(--bg-primary)] border-[var(--rc-turquoise)]' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
                              }`}
                            >
                              Sí, Tiene
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, techDNA: { ...formData.techDNA!, redundancy: false } })}
                              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                !formData.techDNA?.redundancy 
                                ? 'bg-slate-800 text-white border-white/10' 
                                : 'bg-white/5 border-white/5 text-[var(--text-secondary)]'
                              }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>

                       <div className="grid grid-cols-2 gap-8 p-8 bg-black/10 rounded-[32px] border border-white/5">
                         <div className="space-y-2">
                           <label>País de Operación</label>
                           <select 
                             value={formData.techDNA?.country}
                             onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, country: e.target.value as any } })}
                             className="w-full font-black uppercase tracking-widest cursor-pointer"
                           >
                             <option value="Costa Rica">Costa Rica</option>
                             <option value="Venezuela">Venezuela</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label>SIP Trunk Virtual</label>
                           <select 
                             value={formData.techDNA?.sipTrunkVirtual}
                             onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, sipTrunkVirtual: e.target.value as any } })}
                             className="w-full font-black uppercase tracking-widest cursor-pointer"
                           >
                             {['Navegalo', 'Vocex', 'ICE', 'Call My Way', 'Callcentric', 'Voip.ms', 'Movistar Vzla.', 'N/A.'].map(opt => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                         </div>
                      </div>

                      <div className="space-y-2 p-8 bg-black/10 rounded-[32px] border border-white/5">
                         <label>Línea Telefónica / Troncal (ID Físico)</label>
                         <input 
                           value={formData.techDNA?.phoneLine}
                           onChange={e => setFormData({...formData, techDNA: { ...formData.techDNA!, phoneLine: e.target.value } })}
                           placeholder="Ej: Sip Trunk / Análoga / Cloud"
                           className="w-full"
                         />
                      </div>
                    </motion.div>
                  )}

                  ''' + services_section + r'''

                  ''' + assets_section + r'''

                  {activeTab === 'strategy' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <header className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="section-title">Estrategia</h2>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rc-teal animate-pulse" />
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calidad y SLA.</p>
                          </div>
                        </div>
                        <div className="max-w-[300px] p-4 bg-rc-teal/5 border border-rc-teal/10 rounded-2xl">
                           <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                              Configura los tiempos de respuesta y las tareas recurrentes que definen el éxito y cumplimiento del proyecto.
                           </p>
                        </div>
                      </header>

                      <div className="grid grid-cols-[1.5fr,2fr] gap-12">
                         <div className="p-8 bg-black/10 border border-white/5 rounded-[40px] space-y-8">
                            <div className="space-y-2">
                               <div className="flex justify-between items-center">
                                  <label>Parámetros Globales de SLA</label>
                                  <span className="text-2xl font-black text-rc-teal">{formData.strategy?.defaultTaskWeight}/10</span>
                               </div>
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-4">Importancia promedio de las tareas</p>
                               <input 
                                 type="range" min="1" max="10" step="1"
                                 value={formData.strategy?.defaultTaskWeight}
                                 onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, defaultTaskWeight: parseInt(e.target.value) } })}
                                 className="w-full accent-rc-teal"
                               />
                            </div>
                            <div className="space-y-4 pt-6 border-t border-white/5">
                               <label>SLA de Respuesta (Horas)</label>
                               <div className="relative">
                                  <input 
                                    type="number" value={formData.strategy?.responseSla}
                                    onChange={e => setFormData({...formData, strategy: { ...formData.strategy!, responseSla: parseInt(e.target.value) || 0 } })}
                                    className="w-full pl-6 pr-20 py-4 text-xl font-black"
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Horas</span>
                               </div>
                               <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">Tiempo máximo prometido al cliente para resolver incidencias técnicas.</p>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <label>Tareas Recurrentes (Base)</label>
                               <button 
                                 type="button"
                                 onClick={() => {
                                    const tasks = [...(formData.strategy?.recurringTasks || [])];
                                    tasks.push('');
                                    setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: tasks } })
                                 }}
                                 className="p-2 text-[var(--rc-turquoise)] hover:bg-[var(--rc-turquoise)]/10 rounded-lg transition-all"
                               >
                                  <Plus size={20} />
                                </button>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                               {formData.strategy?.recurringTasks?.map((task, idx) => (
                                  <div key={idx} className="flex items-center gap-3 group">
                                     <div className="w-2 h-2 rounded-full bg-[var(--rc-turquoise)] shrink-0" />
                                     <input 
                                       placeholder="Ej: Reporte de Calidad Semanal"
                                       value={task}
                                       onChange={e => {
                                          const t = [...(formData.strategy?.recurringTasks || [])];
                                          t[idx] = e.target.value;
                                          setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: t } });
                                       }}
                                       className="flex-1 bg-white/5 border-none py-3 px-4 rounded-xl text-[11px] font-bold text-white placeholder:text-slate-600 focus:bg-white/10"
                                     />
                                     <button 
                                       type="button"
                                       onClick={() => {
                                          const t = (formData.strategy?.recurringTasks || []).filter((_, i) => i !== idx);
                                          setFormData({...formData, strategy: { ...formData.strategy!, recurringTasks: t } });
                                       }}
                                       className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <X size={14} />
                                     </button>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  ''' + evaluation_section + r'''
                </AnimatePresence>'''

    # Handle imports
    if 'CheckCircle' not in content:
        content = content.replace('Headphones, Settings, Shield', 'Headphones, Settings, Shield, CheckCircle')

    # Replace the full AnimatePresence block
    full_animate_pattern = r'<AnimatePresence mode="wait">[\s\S]+?</AnimatePresence>'
    content = re.sub(full_animate_pattern, full_animate_content, content, count=1, flags=re.MULTILINE)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_project_modal_tabs_and_ops()
print("ProjectModal refactored successfully.")
