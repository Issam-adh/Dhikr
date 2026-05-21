import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StreakData } from '../models/adhkar.model';
import { LocalStoreService } from './local-store.service';

const KEY = 'streak:v1';
const DEFAULT: StreakData = { currentStreak: 0, bestStreak: 0, totalReads: 0, readHistory: {}, achievements: [] };

@Injectable({ providedIn: 'root' })
export class StreakService {
  private store = inject(LocalStoreService);
  private subject = new BehaviorSubject<StreakData>(DEFAULT);
  readonly streak$ = this.subject.asObservable();

  constructor() { void this.init(); }

  async init(): Promise<void> { this.subject.next(await this.store.get<StreakData>(KEY, DEFAULT)); }

  async markRead(): Promise<void> {
    const today = this.isoDate(new Date());
    const yesterday = this.isoDate(new Date(Date.now() - 86400000));
    const current = this.subject.value;
    if (current.lastReadDate === today) {
      const sameDay = { ...current, totalReads: current.totalReads + 1, readHistory: { ...current.readHistory, [today]: (current.readHistory[today] || 0) + 1 } };
      await this.persist(sameDay); return;
    }
    const streak = current.lastReadDate === yesterday ? current.currentStreak + 1 : 1;
    const achievements = new Set(current.achievements);
    if (streak >= 7) achievements.add('7-day streak');
    if (current.totalReads + 1 >= 100) achievements.add('Read 100 adhkar');
    await this.persist({ ...current, currentStreak: streak, bestStreak: Math.max(current.bestStreak, streak), lastReadDate: today, totalReads: current.totalReads + 1, readHistory: { ...current.readHistory, [today]: 1 }, achievements: [...achievements] });
  }

  private async persist(data: StreakData): Promise<void> { await this.store.set(KEY, data); this.subject.next(data); }
  private isoDate(d: Date): string { return d.toISOString().slice(0, 10); }
}
