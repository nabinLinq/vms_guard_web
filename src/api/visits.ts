import { apiClient } from './client';
import type { MockVisit } from '../data/models';
import { mockInsideVisits, mockWaitingVisits, mockFrequentVisitors } from '../data/mockData';

export async function getInsideVisits(): Promise<MockVisit[]> {
  // Phase 1: Mock
  return mockInsideVisits;
}

export async function getWaitingVisits(): Promise<MockVisit[]> {
  // Phase 1: Mock
  return mockWaitingVisits;
}

export async function getFrequentVisitors(): Promise<MockVisit[]> {
  // Phase 1: Mock
  return mockFrequentVisitors;
}

export async function checkoutVisit(visitId: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function validateScanCode(code: string): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Code ${code} validated` });
    }, 500);
  });
}

export async function submitWalkin(data: any): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
