import { apiClient } from './client';
import { mockNotices } from '../data/mockData';
import type { MockNotice } from '../data/models';

export async function guardCheckIn(lat: number, lng: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function guardCheckOut(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function getNotices(): Promise<MockNotice[]> {
  return mockNotices;
}
