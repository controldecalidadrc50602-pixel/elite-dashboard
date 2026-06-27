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

export const portalService = {
  /**
   * Obtiene los datos públicos de un cliente por su slug.
   * Almacenados en la colección "portals" accesible sin autenticación.
   */
  async getPortalBySlug(slug: string): Promise<PortalData | null> {
    try {
      const docRef = doc(db, PORTALS_COLLECTION, slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as PortalData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a los datos del portal.
   * Utilizado para el efecto "Live Showcase".
   */
  subscribeToPortal(slug: string, callback: (data: PortalData | null) => void): () => void {
    const docRef = doc(db, PORTALS_COLLECTION, slug);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as PortalData);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in portal subscription:', error);
      callback(null);
    });
  }
};
