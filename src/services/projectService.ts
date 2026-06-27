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
const PORTALS_COLLECTION = 'portals';

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Extrae SOLO los datos permitidos para la Capa de Exhibición
const extractShowcaseData = (project: Project) => {
  return {
    id: project.id,
    client: project.client,
    logoUrl: project.logoUrl || null,
    startDate: project.startDate,
    services: project.services?.map(s => ({
      id: s.id,
      name: s.name,
      score: s.score,
      type: s.type || null
    })) || [],
    evaluations: project.evaluations || [],
    healthFlag: project.healthFlag,
    opsPulse: project.opsPulse || null,
    quarterlyAssessment: project.quarterlyAssessment || null,
    slug: project.slug || generateSlug(project.client),
    brandColor: project.brandColor || '#3b82f6', // Tailwind blue-500 default
  };
};
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
        if (!project.slug) {
          project.slug = generateSlug(project.client);
        }
        const docRef = doc(db, PROJECTS_COLLECTION, project.id);
        const sanitizedProject = sanitizeForFirestore(project);
        batch.set(docRef, sanitizedProject, { merge: true });

        // Save to portals
        if (project.slug) {
          const portalRef = doc(db, PORTALS_COLLECTION, project.slug);
          batch.set(portalRef, extractShowcaseData(project), { merge: true });
        }
      }
      
      await batch.commit();
    } catch (err) {
      console.error('Firestore save error:', err);
      throw err;
    }
  },

  async addProject(project: Project, allProjects: Project[], userName: string = 'Sistema'): Promise<Project[]> {
    try {
      const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        date: dateStr,
        user: userName,
        action: 'Alta',
        details: 'Alta del expediente en el sistema.',
        type: 'Update' as const
      };

      project.activityLogs = [newActivity];

      // Si tiene evaluación inicial, la guardamos en el histórico
      if (project.quarterlyAssessment) {
         const newHistory = {
            id: Math.random().toString(36).substr(2, 9),
            date: dateStr,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            assessment: { ...project.quarterlyAssessment },
            healthFlag: project.healthFlag || 'Verde',
            recordedBy: userName
         };
         project.history = [newHistory];
      }

      if (!project.slug) {
        project.slug = generateSlug(project.client);
      }

      const sanitizedProject = sanitizeForFirestore(project);
      await setDoc(doc(db, PROJECTS_COLLECTION, project.id), sanitizedProject);
      
      // Save to portals
      if (project.slug) {
        await setDoc(doc(db, PORTALS_COLLECTION, project.slug), extractShowcaseData(project));
      }
      
      return [...allProjects, project];
    } catch (err) {
      console.error('Firestore add error:', err);
      return allProjects;
    }
  },

  async updateProject(updatedProject: Project, allProjects: Project[], userName: string = 'Sistema'): Promise<Project[]> {
    try {
      const oldProject = allProjects.find(p => p.id === updatedProject.id);
      const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

      // Lógica Activity Log
      let actionDetails = 'Actualización general del expediente.';
      let activityType: 'StatusChange' | 'Comment' | 'Update' | 'Alert' = 'Update';

      if (oldProject && oldProject.healthFlag !== updatedProject.healthFlag) {
        actionDetails = `Cambio de Health Score de ${oldProject.healthFlag} a ${updatedProject.healthFlag}.`;
        activityType = 'StatusChange';
      } else if (oldProject && oldProject.adminStatus !== updatedProject.adminStatus) {
        actionDetails = `Estado cambiado a ${updatedProject.adminStatus}.`;
        activityType = 'StatusChange';
      }

      const newActivity = {
        id: Math.random().toString(36).substr(2, 9),
        date: dateStr,
        user: userName,
        action: 'Modificación',
        details: actionDetails,
        type: activityType
      };

      const newActivityLogs = [newActivity, ...(oldProject?.activityLogs || [])].slice(0, 50);
      updatedProject.activityLogs = newActivityLogs;

      // Lógica History Log
      let newHistoryLogs = [...(oldProject?.history || [])];
      
      const oldAssessmentStr = JSON.stringify(oldProject?.quarterlyAssessment || {});
      const newAssessmentStr = JSON.stringify(updatedProject.quarterlyAssessment || {});
      
      // Si la evaluación trimestral cambió, guardamos un snapshot histórico
      if (oldAssessmentStr !== newAssessmentStr && updatedProject.quarterlyAssessment) {
        const newHistory = {
          id: Math.random().toString(36).substr(2, 9),
          date: dateStr,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          assessment: { ...updatedProject.quarterlyAssessment },
          healthFlag: updatedProject.healthFlag || 'Verde',
          recordedBy: userName
        };
        // Evitamos doble snapshot en el mismo mes si ya se hizo uno
        const existingMonthIndex = newHistoryLogs.findIndex(h => h.month === newHistory.month && h.year === newHistory.year);
        if (existingMonthIndex >= 0) {
           newHistoryLogs[existingMonthIndex] = newHistory; // Sobrescribimos el del mes actual
        } else {
           newHistoryLogs.push(newHistory);
        }
      }
      
      updatedProject.history = newHistoryLogs;

      if (!updatedProject.slug) {
        updatedProject.slug = generateSlug(updatedProject.client);
      }

      const sanitizedProject = sanitizeForFirestore(updatedProject);
      await setDoc(doc(db, PROJECTS_COLLECTION, updatedProject.id), sanitizedProject, { merge: true });
      
      // Save to portals
      if (updatedProject.slug) {
        await setDoc(doc(db, PORTALS_COLLECTION, updatedProject.slug), extractShowcaseData(updatedProject), { merge: true });
      }
      
      return allProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
    } catch (err) {
      console.error('Firestore update error:', err);
      return allProjects;
    }
  },

  async deleteProject(id: string, allProjects: Project[]): Promise<Project[]> {
    try {
      const projectToDelete = allProjects.find(p => p.id === id);
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      
      if (projectToDelete?.slug) {
        await deleteDoc(doc(db, PORTALS_COLLECTION, projectToDelete.slug));
      }
      
      return allProjects.filter(p => p.id !== id);
    } catch (err) {
      console.error('Firestore delete error:', err);
      return allProjects;
    }
  }
};

