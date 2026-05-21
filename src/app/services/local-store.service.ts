import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class LocalStoreService {
  async get<T>(key: string, fallback: T): Promise<T> {
    const result = await Preferences.get({ key });
    if (!result.value) return fallback;
    try { return JSON.parse(result.value) as T; } catch { return fallback; }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  async remove(key: string): Promise<void> { await Preferences.remove({ key }); }
}
