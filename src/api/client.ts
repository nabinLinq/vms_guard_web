import axios from 'axios';
import { ENV } from '../config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vms_guard_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 refresh (Stubbed for Phase 2)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Phase 2: Add token refresh logic here
    // if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);
