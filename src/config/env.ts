// config/env.ts
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  GEOFENCE_RADIUS_M: Number(import.meta.env.VITE_GEOFENCE_RADIUS_M ?? 200),
  APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
} as const;
