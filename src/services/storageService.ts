import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  async uploadLogo(file: File, clientId: string): Promise<string> {
    try {
      const extension = file.name.split('.').pop();
      const filename = `logos/${clientId}_${Date.now()}.${extension}`;
      const storageRef = ref(storage, filename);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }
};
