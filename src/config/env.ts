// config/env.ts
function requireEnv(key: string): string {
  const val = import.meta.env[key];
  if (!val) {
    console.error(`[VMS Guard] Missing required env var: ${key}`);
    // In dev we might not want to throw hard if testing locally without .env, 
    // but throwing is safer for production. Let's throw to enforce it.
    throw new Error(`[VMS Guard] Missing required env var: ${key}`);
  }
  return val;
}

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Default for local dev if not set
  GEOFENCE_RADIUS_M: Number(import.meta.env.VITE_GEOFENCE_RADIUS_M ?? 200),
  APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
} as const;
