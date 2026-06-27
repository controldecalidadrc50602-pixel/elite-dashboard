import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const PORTALS_COLLECTION = 'portals';

export interface PortalData {
  id: string;
  client: string;
  logoUrl: string | null;
  startDate: string;
  services: Array<{
    id: string;
    name: string;
    score: number;
    type: string | null;
  }>;
  evaluations: any[];
  healthFlag: 'Verde' | 'Amarilla' | 'Roja' | 'Negra';
  opsPulse: any | null;
  quarterlyAssessment: any | null;
  slug: string;
  brandColor: string;
}

/**
 * Sanitiza datos de Firestore eliminando referencias internas,
 * clases de Firebase, y propiedades no serializables.
 * Esto previene que React 19 detecte cambios fantasma en el estado.
 */
function sanitizeFirebaseData(raw: any): PortalData | null {
  try {
    return JSON.parse(JSON.stringify(raw)) as PortalData;
  } catch {
    console.error('[portalService] Failed to sanitize Firebase data');
    return null;
  }
}

export const portalService = {
  /**
   * Lectura única (one-shot) de los datos del portal.
   */
  async getPortalBySlug(slug: string): Promise<PortalData | null> {
    try {
      const docRef = doc(db, PORTALS_COLLECTION, slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return sanitizeFirebaseData(docSnap.data());
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
      throw error;
    }
  },

  /**
   * Suscripción real-time con sanitización de datos.
   * Los datos pasan por JSON.parse(JSON.stringify()) para eliminar
   * cualquier referencia interna de Firebase que React 19 interprete
   * como un cambio de estado (causando re-renders infinitos).
   */
  subscribeToPortal(slug: string, callback: (data: PortalData | null) => void): () => void {
    const docRef = doc(db, PORTALS_COLLECTION, slug);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const clean = sanitizeFirebaseData(docSnap.data());
        callback(clean);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in portal subscription:', error);
      callback(null);
    });
  }
};
