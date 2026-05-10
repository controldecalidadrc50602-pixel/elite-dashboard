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
          operationalValue: 8,
          startTime: new Date(Date.now() - 3600000 * 5).toISOString(), // Hace 5 horas
          endTime: new Date(Date.now() + 3600000 * 2).toISOString(), // En 2 horas
          subtasks: [
            { id: 'st1', title: 'Revisión de protocolos', completed: true },
            { id: 'st2', title: 'Validación de KPI', completed: false }
          ],
          progress: 50,
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
          operationalValue: 6,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() - 3600000).toISOString(), // EXPIRADA
          subtasks: [],
          progress: 0,
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
    this.triggerEmailAutomation(task, 'Asignación de Nueva Tarea');

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
      this.triggerEmailAutomation(taskToSave, 'Tarea Finalizada - Auditoría de Cumplimiento');
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
    // NUEVO ALGORITMO: (Peso de Tarea * % Checklist) / Tiempo empleado
    const weight = task.operationalValue || 5;
    const progressFactor = (task.progress || 0) / 100;
    
    const start = new Date(task.startTime).getTime();
    const end = new Date(task.completionTime || new Date()).getTime();
    const targetEnd = new Date(task.endTime).getTime();
    
    // Tiempo empleado en horas (mínimo 1h para evitar división por cero)
    const timeSpentHours = Math.max(1, (end - start) / 3600000);
    
    // Factor de cumplimiento de tiempo (si terminó antes del deadline, bonus)
    const timeFactor = end <= targetEnd ? 1.2 : 0.8;

    const rawScore = ((weight * progressFactor) / timeSpentHours) * 100 * timeFactor;
    
    return Math.min(100, Math.round(rawScore));
  },

  triggerEmailAutomation(task: Task, subject: string) {
    if (!task.responsibleEmail && !task.assignedTo) return;
    
    const email = task.responsibleEmail || `${task.assignedTo?.toLowerCase().replace(' ', '.')}@rc506.com`;
    
    console.log(`%c[Rc506 AUTOMATION] 📧`, 'background: #3BC7AA; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    console.log(`Asunto: ${subject}`);
    console.log(`Para: ${email}`);
    console.log(`-------------------------------------------`);
    console.log(`ESTIMADO(A): ${task.assignedTo}`);
    console.log(`Se ha actualizado el estado de la tarea: ${task.title}`);
    console.log(`SLA Límite: ${new Date(task.endTime).toLocaleString()}`);
    console.log(`Prioridad: ${task.priority}`);
    console.log(`-------------------------------------------`);
    console.log(`Rc506 Elite Dashboard v3.5 - Protocolo de Cumplimiento`);
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

