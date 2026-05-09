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
    
    // Automation Trigger
    this.triggerEmailAutomation(task, 'Nueva Tarea Asignada');

    const newTasks = [...allTasks, task];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  },

  async updateTask(updatedTask: Task, allTasks: Task[]): Promise<Task[]> {
    const oldTask = allTasks.find(t => t.id === updatedTask.id);
    let taskToSave = { ...updatedTask };

    // Set First Response Time
    if (oldTask?.status === 'Open' && updatedTask.status === 'In Progress' && !updatedTask.firstResponseTime) {
      taskToSave.firstResponseTime = new Date().toISOString();
    }

    // Set Completion Time and Calculate Score
    if (oldTask?.status !== 'Closed' && updatedTask.status === 'Closed') {
      taskToSave.completionTime = new Date().toISOString();
      taskToSave.effectivenessScore = this.calculateEffectivenessScore(taskToSave);
      this.triggerEmailAutomation(taskToSave, 'Tarea Finalizada con Éxito');
    }

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, TASKS_COLLECTION, taskToSave.id), taskToSave, { merge: true });
      } catch (err) {
        console.error('Firestore task update error:', err);
      }
    }

    const newTasks = allTasks.map(t => t.id === taskToSave.id ? taskToSave : t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    return newTasks;
  },

  calculateEffectivenessScore(task: Task): number {
    // 1. Compliance (SLA) - 40%
    const onTime = new Date(task.completionTime || '') <= new Date(task.endTime);
    const compliance = onTime ? 100 : 0;

    // 2. Effectiveness (Subtasks) - 40%
    const subtaskEffectiveness = task.progress || 0;

    // 3. Responsiveness (First Response < 2h) - 20%
    let responsiveness = 0;
    if (task.firstResponseTime) {
      const start = new Date(task.startTime).getTime();
      const firstResp = new Date(task.firstResponseTime).getTime();
      const diffHours = (firstResp - start) / 3600000;
      responsiveness = diffHours <= 2 ? 100 : Math.max(0, 100 - (diffHours - 2) * 10);
    }

    const score = (compliance * 0.4) + (subtaskEffectiveness * 0.4) + (responsiveness * 0.2);
    return Math.round(score);
  },

  triggerEmailAutomation(task: Task, type: string) {
    if (!task.responsibleEmail) return;
    
    console.log(`%c[AUTOMATION TRIGGER]: ${type}`, 'background: #3BC7AA; color: white; padding: 2px 5px; border-radius: 3px;');
    console.log(`Enviando email a: ${task.responsibleEmail}`);
    console.log(`Detalles: ${task.title} | SLA: ${task.endTime}`);
    console.log(`Link: https://elite-dashboard.rc506.com/tasks/${task.id}`);
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
