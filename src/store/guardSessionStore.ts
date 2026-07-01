import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as guardApi from '../api/guard';
import { useOfflineQueueStore } from './offlineQueueStore';

interface GuardSessionState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkInLat: number | null;
  checkInLng: number | null;
  checkIn: (lat: number, lng: number) => Promise<void>;
  checkOut: () => Promise<void>;
}

export const useGuardSessionStore = create<GuardSessionState>()(
  persist(
    (set, get) => ({
      isCheckedIn: false,
      checkInTime: null,
      checkInLat: null,
      checkInLng: null,

      checkIn: async (lat, lng) => {
        try {
          await guardApi.guardCheckIn(lat, lng);
        } catch (error) {
          // If offline/error, queue it
          useOfflineQueueStore.getState().enqueue({
            type: 'CHECK_IN',
            payload: { lat, lng },
          });
        }
        // Update local state immediately regardless (optimistic)
        set({
          isCheckedIn: true,
          checkInTime: new Date().toISOString(),
          checkInLat: lat,
          checkInLng: lng,
        });
      },

      checkOut: async () => {
        try {
          await guardApi.guardCheckOut();
        } catch (error) {
          useOfflineQueueStore.getState().enqueue({
            type: 'CHECK_OUT',
            payload: {},
          });
        }
        set({
          isCheckedIn: false,
          checkInTime: null,
          checkInLat: null,
          checkInLng: null,
        });
      },
    }),
    {
      name: 'vms-guard-session',
    }
  )
);
