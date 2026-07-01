// Phase 1: Mock guard API – real API calls are commented out below
// import { apiClient } from './client';
import { mockNotices } from '../data/mockData';
import type { MockNotice } from '../data/models';

export async function guardCheckIn(_lat: number, _lng: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function guardCheckOut(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function getNotices(): Promise<MockNotice[]> {
  return mockNotices;
}
