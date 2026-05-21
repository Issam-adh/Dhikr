import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { TasbihCounter } from '../models/adhkar.model';
import { LocalStoreService } from './local-store.service';

const KEY = 'tasbih:v1';
const DEFAULT: TasbihCounter[] = [
  { id: 'subhanallah', label: 'SubhanAllah', count: 0, target: 33 },
  { id: 'alhamdulillah', label: 'Alhamdulillah', count: 0, target: 33 },
  { id: 'allahuakbar', label: 'Allahu Akbar', count: 0, target: 34 }
];

@Injectable({ providedIn: 'root' })
export class TasbihService {
  private store = inject(LocalStoreService);
  private subject = new BehaviorSubject<TasbihCounter[]>(DEFAULT);
  readonly counters$ = this.subject.asObservable();

  constructor() { void this.init(); }
  async init(): Promise<void> { this.subject.next(await this.store.get<TasbihCounter[]>(KEY, DEFAULT)); }
  async increment(id: string): Promise<void> { await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined); await this.save(this.subject.value.map(c => c.id === id ? { ...c, count: c.count + 1 } : c)); }
  async reset(id: string): Promise<void> { await this.save(this.subject.value.map(c => c.id === id ? { ...c, count: 0 } : c)); }
  private async save(counters: TasbihCounter[]): Promise<void> { await this.store.set(KEY, counters); this.subject.next(counters); }
}
