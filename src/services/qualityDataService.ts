export interface QualityRecord {
  mes: string;
  empresa: string;
  canal: string;
  optimo: number;
  aceptable: number;
  deficiente: number;
  total: number;
}

export interface QualityAPIResponse {
  status: string;
  data: Record<string, QualityRecord[]>;
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAaoiCDmc3mzwOZZK9H0DC3qQAf039YuXAOoTyEYvf8rsy0VknojVgl15SbBo3A9ND/exec';

export const qualityDataService = {
  async fetchQualityData(): Promise<Record<string, QualityRecord[]>> {
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      if (!response.ok) {
        throw new Error('Error al conectar con App Script API');
      }
      
      const json: QualityAPIResponse = await response.json();
      return json.data || {};
    } catch (error) {
      console.error('Fetch quality data error:', error);
      return {};
    }
  }
};
