import type { StoredData } from './types';


const DATA_FILE = 'bills.json';

function getDataPath(storagePath: string): string {
  return `${storagePath}/${DATA_FILE}`;
}

export async function loadData(storagePath: string): Promise<StoredData | null> {
  const api = (window as any).electronAPI;
  if (!api) return null;
  return await api.readJson(getDataPath(storagePath));
}

export async function saveData(storagePath: string, data: StoredData): Promise<boolean> {
  const api = (window as any).electronAPI;
  if (!api) return false;
  return await api.writeJson(getDataPath(storagePath), data);
}

export async function loadConfig(): Promise<{ storagePath: string } | null> {
  const api = (window as any).electronAPI;
  if (!api) return null;
  return await api.readConfig();
}

export async function saveConfig(config: { storagePath: string }): Promise<boolean> {
  const api = (window as any).electronAPI;
  if (!api) return false;
  return await api.writeConfig(config);
}

export async function pickFolder(): Promise<string | null> {
  const api = (window as any).electronAPI;
  if (!api) return null;
  return await api.pickFolder();
}

export function defaultStoredData(): StoredData {
  return {
    config: {
      tenant1Name: 'Tenant 1',
      tenant2Name: 'Tenant 2',
      tenant3Name: 'Tenant 3',
      tenant1LastReading: 0,
      tenant2LastReading: 0,
      waterRatioTenant2: 0.334,
      tankerRate: 350,
    },
    bills: [],
  };
}
