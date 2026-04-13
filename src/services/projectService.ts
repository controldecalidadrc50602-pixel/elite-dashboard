import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../pages/Dashboard';

const STORAGE_KEY = 'elite_projects';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      return data as Project[];
    }
    
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  },

  async saveProjects(projects: Project[]): Promise<void> {
    if (isSupabaseConfigured) {
      // In real scenario, we would upsert individual projects
      // For now, mirroring the local logic
      const { error } = await supabase.from('projects').upsert(projects);
      if (error) throw error;
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  },

  async updateProject(updatedProject: Project, allProjects: Project[]): Promise<Project[]> {
    const newProjects = allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    await this.saveProjects(newProjects);
    return newProjects;
  }
};
