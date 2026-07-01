import { apiClient } from './client';

export async function login(phone: string, pin: string): Promise<{ token: string; user: any }> {
  // Phase 1: Mock
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-jwt-token',
        user: { id: 'u1', name: 'Guard Nabin', phone },
      });
    }, 800);
  });

  // Phase 2: Real API
  // const res = await apiClient.post('/auth/login', { phone, pin });
  // return res.data;
}

export async function requestOtp(phone: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(otp.length >= 4), 800));
}

export async function resetPassword(phone: string, newPin: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}
