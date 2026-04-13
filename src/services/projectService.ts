import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../pages/Dashboard';

const STORAGE_KEY = 'elite_projects';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        return data as Project[];
      } catch (err) {
        console.error('Supabase fetch error, falling back to local:', err);
      }
    }
    
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  },

  async saveProjects(projects: Project[]): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('projects').upsert(projects);
      if (error) throw error;
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  },

  async addProject(project: Project, allProjects: Project[]): Promise<Project[]> {
    const newProjects = [...allProjects, project];
    await this.saveProjects(newProjects);
    return newProjects;
  },

  async updateProject(updatedProject: Project, allProjects: Project[]): Promise<Project[]> {
    const newProjects = allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    await this.saveProjects(newProjects);
    return newProjects;
  },

  async deleteProject(id: string, allProjects: Project[]): Promise<Project[]> {
    const newProjects = allProjects.filter(p => p.id !== id);
    await this.saveProjects(newProjects);
    return newProjects;
  }
};
