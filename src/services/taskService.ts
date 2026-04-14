import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  writeBatch
} from 'firebase/firestore';
import { Task } from '../components/TaskManager';

const STORAGE_KEY = 'elite_tasks';
const TASKS_COLLECTION = 'tasks';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, TASKS_COLLECTION));
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ ...doc.data() as Task, id: doc.id });
        });
        
        if (tasks.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
        
        return tasks;
      } catch (err) {
        console.error('Firestore task fetch error:', err);
      }
    }
    
    const localData = localStorage.getItem(STORAGE_KEY);
    const tasks = localData ? JSON.parse(localData) : [];
    
    // Fallback con tareas profesionales si está vacío para impresionar al usuario
    if (tasks.length === 0) {
      return [
        {
          id: 'mock-1',
          title: 'Auditoría de Gobernanza V3',
          projectId: 'p1',
          projectName: 'Calidad Corporativa',
          status: 'In Progress',
          priority: 'High',
          assignedTo: 'Marilyn (Lead Auditor)',
          area: 'Gestión de Calidad',
          startTime: new Date(Date.now() - 3600000 * 5).toISOString(), // Hace 5 horas
          endTime: new Date(Date.now() + 3600000 * 2).toISOString(), // En 2 horas
          subtasks: [
            { id: 'st1', title: 'Revisión de protocolos', completed: true },
            { id: 'st2', title: 'Validación de KPI', completed: false }
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'mock-2',
          title: 'Optimización de Canal Contact Center',
          projectId: 'p2',
          projectName: 'Servicios Logísticos',
          status: 'Open',
          priority: 'Medium',
          assignedTo: 'Carlos Ruiz',
          area: 'Contact Center',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() - 3600000).toISOString(), // EXPIRADA (Para mostrar pulso neón)
          subtasks: [],
          createdAt: new Date().toISOString()
        }
      ];
    }
    return tasks;
  },


  async addTask(task: Task, allTasks: Task[]): Promise<Task[]> {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, TASKS_COLLECTION, task.id), task);
      } catch (err) {
        console.error('Firestore task add error:', err);
      }
    }
    
    const newTasks = [...allTasks, task];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  },

  async updateTask(updatedTask: Task, allTasks: Task[]): Promise<Task[]> {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, TASKS_COLLECTION, updatedTask.id), updatedTask, { merge: true });
      } catch (err) {
        console.error('Firestore task update error:', err);
      }
    }

    const newTasks = allTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  },

  async deleteTask(id: string, allTasks: Task[]): Promise<Task[]> {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, TASKS_COLLECTION, id));
      } catch (err) {
        console.error('Firestore task delete error:', err);
      }
    }

    const newTasks = allTasks.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  }
};
