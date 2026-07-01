import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  badgeNumber: string;
  email: string;
  phone: string;
  guardType: string;
  shiftName: string;
  locationName: string;
  workplaceLocation?: {
    latitude: number;
    longitude: number;
    guardRestrictRadius: number;
    address: string;
  };
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

// Default mock user profile matching Flutter
const mockUserProfile: UserProfile = {
  id: 'u1',
  name: 'Guard Nabin',
  badgeNumber: 'GRD-00124',
  email: 'nabin.guard@vms.com',
  phone: '+977 9800000000',
  guardType: 'Internal Security',
  shiftName: 'Morning Shift (06:00 AM - 02:00 PM)',
  locationName: 'Main Gate Entrance',
  workplaceLocation: {
    latitude: 27.742647,
    longitude: 85.393497, // my mock location
    guardRestrictRadius: 300,
    address: 'Main Gate, Company HQ',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'vms-auth-storage',
    }
  )
);

// For testing phase 1 without full backend auth loop
export const mockLogin = () => {
  useAuthStore.getState().login('mock-jwt-token', mockUserProfile);
};
