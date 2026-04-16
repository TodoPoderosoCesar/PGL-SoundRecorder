import AsyncStorage from '@react-native-async-storage/async-storage';

// Métodos genéricos
export const saveItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error guardando:', e);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (e) {
    console.error('Error leyendo:', e);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error eliminando:', e);
  }
};

// Tipos y métodos específicos para audios
export interface AudioRecord {
  uri: string;
  name: string;
}

const AUDIOS_KEY = 'recorded_audios';

export const saveAudios = (audios: AudioRecord[]): Promise<void> =>
  saveItem<AudioRecord[]>(AUDIOS_KEY, audios);

export const loadAudios = (): Promise<AudioRecord[] | null> =>
  getItem<AudioRecord[]>(AUDIOS_KEY);

export const clearAudios = (): Promise<void> => removeItem(AUDIOS_KEY);
