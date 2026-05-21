import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ADHKAR_SEED } from '../data/adhkar.seed';
import { Adhkar, AdhkarCategory } from '../models/adhkar.model';
import { LocalStoreService } from './local-store.service';

const KEY = 'adhkar:list:v1';

@Injectable({ providedIn: 'root' })
export class AdhkarService {
  private store = inject(LocalStoreService);
  private subject = new BehaviorSubject<Adhkar[]>([]);
  readonly adhkar$ = this.subject.asObservable();
  readonly categories$ = this.adhkar$.pipe(map(list => Array.from(new Set(list.map(a => a.category)))));

  async init(): Promise<void> {
    const list = await this.store.get<Adhkar[]>(KEY, []);
    if (!list.length) {
      await this.store.set(KEY, ADHKAR_SEED);
      this.subject.next(ADHKAR_SEED);
    } else {
      const merged = [...ADHKAR_SEED.filter(seed => !list.some(a => a.id === seed.id)), ...list];
      this.subject.next(merged);
      await this.store.set(KEY, merged);
    }
  }

  getSnapshot(): Adhkar[] { return this.subject.value; }
  getById(id: string): Adhkar | undefined { return this.subject.value.find(a => a.id === id); }

  search(term = '', category: AdhkarCategory | 'all' = 'all'): Adhkar[] {
    const t = term.trim().toLowerCase();
    return this.subject.value.filter(a => {
      const matchesCat = category === 'all' || a.category === category;
      const matchesTerm = !t || [a.arabic, a.transliteration, a.translation, a.source || ''].join(' ').toLowerCase().includes(t);
      return matchesCat && matchesTerm;
    });
  }

  async save(adhkar: Partial<Adhkar> & Pick<Adhkar, 'arabic' | 'translation' | 'transliteration' | 'category'>): Promise<Adhkar> {
    const now = new Date().toISOString();
    const list = this.subject.value;
    const item: Adhkar = {
      id: adhkar.id || `custom-${crypto.randomUUID()}`,
      arabic: adhkar.arabic,
      translation: adhkar.translation,
      transliteration: adhkar.transliteration,
      category: adhkar.category,
      source: adhkar.source,
      audioUrl: adhkar.audioUrl,
      favourite: adhkar.favourite || false,
      custom: true,
      createdAt: adhkar.createdAt || now,
      updatedAt: now
    };
    const next = list.some(a => a.id === item.id) ? list.map(a => a.id === item.id ? item : a) : [item, ...list];
    await this.store.set(KEY, next);
    this.subject.next(next);
    return item;
  }

  async toggleFavourite(id: string): Promise<void> {
    const next = this.subject.value.map(a => a.id === id ? { ...a, favourite: !a.favourite } : a);
    await this.store.set(KEY, next);
    this.subject.next(next);
  }

  async delete(id: string): Promise<void> {
    const target = this.getById(id);
    if (!target?.custom) return;
    const next = this.subject.value.filter(a => a.id !== id);
    await this.store.set(KEY, next);
    this.subject.next(next);
  }
}
