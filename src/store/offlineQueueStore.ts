import { create } from 'zustand';
import * as idb from 'idb-keyval';
import * as guardApi from '../api/guard';
import * as visitsApi from '../api/visits';

export type ActionType = 'CHECK_IN' | 'CHECK_OUT' | 'WALKIN_SUBMIT' | 'VISIT_CHECKOUT' | 'SCAN_VALIDATE';

export interface PendingAction {
  id: string;
  type: ActionType;
  payload: any;
  createdAt: string;
  retryCount: number;
}

interface OfflineQueueState {
  queue: PendingAction[];
  isSyncing: boolean;
  enqueue: (action: Omit<PendingAction, 'id' | 'createdAt' | 'retryCount'>) => void;
  dequeue: (id: string) => void;
  loadQueue: () => Promise<void>;
  drainQueue: () => Promise<void>;
}

const IDB_KEY = 'vms-offline-queue';

export const useOfflineQueueStore = create<OfflineQueueState>((set, get) => ({
  queue: [],
  isSyncing: false,

  enqueue: async (actionData) => {
    const newAction: PendingAction = {
      ...actionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    
    const newQueue = [...get().queue, newAction];
    set({ queue: newQueue });
    await idb.set(IDB_KEY, newQueue);
  },

  dequeue: async (id) => {
    const newQueue = get().queue.filter((a) => a.id !== id);
    set({ queue: newQueue });
    await idb.set(IDB_KEY, newQueue);
  },

  loadQueue: async () => {
    const queue = await idb.get<PendingAction[]>(IDB_KEY);
    if (queue) {
      set({ queue });
    }
  },

  drainQueue: async () => {
    const { queue, isSyncing, dequeue } = get();
    if (isSyncing || queue.length === 0) return;

    set({ isSyncing: true });

    let successCount = 0;

    for (const action of queue) {
      if (action.retryCount >= 5) continue; // Skip dead letters for now

      try {
        switch (action.type) {
          case 'CHECK_IN':
            await guardApi.guardCheckIn(action.payload.lat, action.payload.lng);
            break;
          case 'CHECK_OUT':
            await guardApi.guardCheckOut();
            break;
          case 'VISIT_CHECKOUT':
            await visitsApi.checkoutVisit(action.payload.visitId);
            break;
          case 'WALKIN_SUBMIT':
            await visitsApi.submitWalkin(action.payload);
            break;
          case 'SCAN_VALIDATE':
            await visitsApi.validateScanCode(action.payload.code);
            break;
        }
        
        // Success
        await dequeue(action.id);
        successCount++;
      } catch (error) {
        // Failed, increment retry count
        const updatedQueue = get().queue.map(a => 
          a.id === action.id ? { ...a, retryCount: a.retryCount + 1 } : a
        );
        set({ queue: updatedQueue });
        await idb.set(IDB_KEY, updatedQueue);
      }
    }

    set({ isSyncing: false });
    
    if (successCount > 0) {
      // We could dispatch an event or use a toast here
      window.dispatchEvent(new CustomEvent('vms-synced', { detail: successCount }));
    }
  },
}));

// Setup online listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineQueueStore.getState().drainQueue();
  });
  
  // Load initial queue
  useOfflineQueueStore.getState().loadQueue();
}
