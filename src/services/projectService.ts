import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { Project } from '../types/project';

const STORAGE_KEY = 'elite_projects';
const PROJECTS_COLLECTION = 'projects';

// Sanitiza los datos para Firestore (elimina undefined, que causa errores)
const sanitizeForFirestore = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // Si el valor es undefined, lo omitimos del objeto resultante
    return value === undefined ? undefined : value;
  }));
};

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
          projects.push({ ...doc.data() as Project, id: doc.id });
        });
        
        // Si hay proyectos en Firestore, sincronizar con local por si acaso
        if (projects.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
        
        return projects;
      } catch (err) {
        console.error('Firestore fetch error, falling back to local:', err);
      }
    }
    
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  },

  async saveProjects(projects: Project[]): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        const batch = writeBatch(db);
        
        for (const project of projects) {
          const docRef = doc(db, PROJECTS_COLLECTION, project.id);
          const sanitizedProject = sanitizeForFirestore(project);
          batch.set(docRef, sanitizedProject, { merge: true });
        }
        
        await batch.commit();
      } catch (err) {
        console.error('Firestore save error:', err);
        throw err;
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  async addProject(project: Project, allProjects: Project[]): Promise<Project[]> {
    if (isFirebaseConfigured) {
      try {
        const sanitizedProject = sanitizeForFirestore(project);
        await setDoc(doc(db, PROJECTS_COLLECTION, project.id), sanitizedProject);
      } catch (err) {
        console.error('Firestore add error:', err);
      }
    }
    
    const newProjects = [...allProjects, project];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    return newProjects;
  },

  async updateProject(updatedProject: Project, allProjects: Project[]): Promise<Project[]> {
    if (isFirebaseConfigured) {
      try {
        const sanitizedProject = sanitizeForFirestore(updatedProject);
        await setDoc(doc(db, PROJECTS_COLLECTION, updatedProject.id), sanitizedProject, { merge: true });
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    const newProjects = allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    return newProjects;
  },

  async deleteProject(id: string, allProjects: Project[]): Promise<Project[]> {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      } catch (err) {
        console.error('Firestore delete error:', err);
      }
    }

    const newProjects = allProjects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    return newProjects;
  }
};

