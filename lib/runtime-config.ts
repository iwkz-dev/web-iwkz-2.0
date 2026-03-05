export interface RuntimeConfig {
  ramadanUrl?: string | null;
  paypalHostId?: string;
  paypalUrl?: string;
  isDevelopment?: boolean;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const response = await fetch('/api/runtime-config', {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {};
    }

    const data = (await response.json()) as RuntimeConfig;
    return data;
  } catch {
    return {};
  }
}
