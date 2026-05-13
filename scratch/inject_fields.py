
import sys

path = 'src/components/Modals/ProjectModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Add fields to Botmaker (around line 790)
new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    # Match the end of Botmaker config
    if '<option value="Plataforma+ Bots+Agente IA">Plataforma+ Bots+Agente IA</option>' in line:
        # The next two lines are </select> and </div>
        # We find the </div> at the end of Botmaker block
        pass
    
    # I'll use the line numbers from view_file
    if i + 1 == 789: # This is </div> for the select container
        pass
    if i + 1 == 790: # This is </div> for the grid container
        # Inject here
        indent = "                                      "
        new_lines.insert(-1, f'{indent}<div className="space-y-1">\n')
        new_lines.insert(-1, f'{indent}   <label className="text-[8px] opacity-60">Responsable / Líder</label>\n')
        new_lines.insert(-1, f'{indent}   <input \n')
        new_lines.insert(-1, f'{indent}     placeholder="Nombre del responsable"\n')
        new_lines.insert(-1, f'{indent}     value={{service.responsible || \'\'}}\n')
        new_lines.insert(-1, f'{indent}     onChange={{e => {{\n')
        new_lines.insert(-1, f'{indent}        const s = [...(formData.services || [])];\n')
        new_lines.insert(-1, f'{indent}        s[index].responsible = e.target.value;\n')
        new_lines.insert(-1, f'{indent}        setFormData({{...formData, services: s}});\n')
        new_lines.insert(-1, f'{indent}     }}}}\n')
        new_lines.insert(-1, f'{indent}     className="w-full py-2 px-3 text-[10px]"\n')
        new_lines.insert(-1, f'{indent}   />\n')
        new_lines.insert(-1, f'{indent}</div>\n')

# Add fields to Contact Center (around line 894)
final_lines = []
for i, line in enumerate(new_lines):
    final_lines.append(line)
    if 's[index].shiftMatrix = e.target.value;' in line:
        # We are inside the onChange of shiftMatrix
        pass
    if i + 1 == 893 + 13: # Adjusted for Botmaker injection (13 lines added)
        # This is line 893 in original file: </div> for shiftMatrix container
        pass
    if i + 1 == 894 + 13: # This is </div> for the grid container
        indent = "                                      "
        final_lines.insert(-1, f'{indent}<div className="space-y-1">\n')
        final_lines.insert(-1, f'{indent}   <label className="text-[8px] opacity-60">Responsable Operativo</label>\n')
        final_lines.insert(-1, f'{indent}   <input \n')
        final_lines.insert(-1, f'{indent}     placeholder="Ej: Gerente de Ops"\n')
        final_lines.insert(-1, f'{indent}     value={{service.responsible || \'\'}}\n')
        final_lines.insert(-1, f'{indent}     onChange={{e => {{\n')
        final_lines.insert(-1, f'{indent}        const s = [...(formData.services || [])];\n')
        final_lines.insert(-1, f'{indent}        s[index].responsible = e.target.value;\n')
        final_lines.insert(-1, f'{indent}        setFormData({{...formData, services: s}});\n')
        final_lines.insert(-1, f'{indent}     }}}}\n')
        final_lines.insert(-1, f'{indent}     className="w-full py-2 px-3 text-[10px]"\n')
        final_lines.insert(-1, f'{indent}   />\n')
        final_lines.insert(-1, f'{indent}</div>\n')
        final_lines.insert(-1, f'{indent}<div className="space-y-1">\n')
        final_lines.insert(-1, f'{indent}   <label className="text-[8px] opacity-60">Líder / Supervisor</label>\n')
        final_lines.insert(-1, f'{indent}   <input \n')
        final_lines.insert(-1, f'{indent}     placeholder="Ej: Supervisor asignado"\n')
        final_lines.insert(-1, f'{indent}     value={{service.collaborator || \'\'}}\n')
        final_lines.insert(-1, f'{indent}     onChange={{e => {{\n')
        final_lines.insert(-1, f'{indent}        const s = [...(formData.services || [])];\n')
        final_lines.insert(-1, f'{indent}        s[index].collaborator = e.target.value;\n')
        final_lines.insert(-1, f'{indent}        setFormData({{...formData, services: s}});\n')
        final_lines.insert(-1, f'{indent}     }}}}\n')
        final_lines.insert(-1, f'{indent}     className="w-full py-2 px-3 text-[10px]"\n')
        final_lines.insert(-1, f'{indent}   />\n')
        final_lines.insert(-1, f'{indent}</div>\n')

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)
print("Done")
