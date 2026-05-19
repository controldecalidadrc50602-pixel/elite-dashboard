import { db, auth } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { Project } from '../types/project';

const PROJECTS_COLLECTION = 'projects';

// Injecta campos de auditoría automáticamente
const injectAuditFields = (project: Project): Project => {
  const user = auth.currentUser;
  const identifier = user?.email || user?.uid || 'Unknown Administrator';
  return {
    ...project,
    lastModifiedBy: identifier,
    lastModifiedAt: new Date().toISOString()
  };
};

// Sanitiza los datos para Firestore (elimina undefined, que causa errores)
const sanitizeForFirestore = (obj: any): any => {
  const auditedObj = injectAuditFields(obj as Project);
  return JSON.parse(JSON.stringify(auditedObj, (key, value) => {
    // Si el valor es undefined, lo omitimos del objeto resultante
    return value === undefined ? undefined : value;
  }));
};

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        projects.push({ ...doc.data() as Project, id: doc.id });
      });
      return projects;
    } catch (err) {
      console.error('Firestore fetch error:', err);
      return [];
    }
  },

  subscribeToProjects(callback: (projects: Project[]) => void): () => void {
    const q = collection(db, PROJECTS_COLLECTION);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        projects.push({ ...doc.data() as Project, id: doc.id });
      });
      callback(projects);
    }, (err) => {
      console.error('Firestore subscription error:', err);
      callback([]);
    });
    return unsubscribe;
  },

  async saveProjects(projects: Project[]): Promise<void> {
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
  },

  async addProject(project: Project, allProjects: Project[]): Promise<Project[]> {
    try {
      const sanitizedProject = sanitizeForFirestore(project);
      await setDoc(doc(db, PROJECTS_COLLECTION, project.id), sanitizedProject);
      return [...allProjects, project];
    } catch (err) {
      console.error('Firestore add error:', err);
      return allProjects;
    }
  },

  async updateProject(updatedProject: Project, allProjects: Project[]): Promise<Project[]> {
    try {
      const sanitizedProject = sanitizeForFirestore(updatedProject);
      await setDoc(doc(db, PROJECTS_COLLECTION, updatedProject.id), sanitizedProject, { merge: true });
      return allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    } catch (err) {
      console.error('Firestore update error:', err);
      return allProjects;
    }
  },

  async deleteProject(id: string, allProjects: Project[]): Promise<Project[]> {
    try {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      return allProjects.filter(p => p.id !== id);
    } catch (err) {
      console.error('Firestore delete error:', err);
      return allProjects;
    }
  }
};

