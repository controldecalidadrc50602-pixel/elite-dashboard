import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot
} from 'firebase/firestore';

export interface BrandingConfig {
  companyName: string;
  logoUrl?: string; // Can be Base64
  primaryColor?: string;
}

const BRANDING_DOC_PATH = 'settings/branding';
const STORAGE_KEY = 'elite_branding_config';

export const brandingService = {
  // Default fallback config
  defaultConfig: {
    companyName: 'Rc506 Solutions',
    logoUrl: '' // Empty means use default UI logo
  } as BrandingConfig,

  async getBranding(): Promise<BrandingConfig> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, BRANDING_DOC_PATH);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BrandingConfig;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.error('Error fetching branding:', err);
      }
    }
    
    // Local fallback
    const local = localStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : this.defaultConfig;
  },

  async updateBranding(config: BrandingConfig): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, BRANDING_DOC_PATH);
        await setDoc(docRef, config, { merge: true });
      } catch (err) {
        console.error('Error updating branding:', err);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  /**
   * Real-time listener for branding changes
   */
  subscribeToBranding(callback: (config: BrandingConfig) => void) {
    if (!isFirebaseConfigured) {
      // Manual trigger for first load in demo mode
      this.getBranding().then(callback);
      return () => {};
    }

    const docRef = doc(db, BRANDING_DOC_PATH);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BrandingConfig;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        callback(data);
      } else {
        callback(this.defaultConfig);
      }
    });
  }
};
