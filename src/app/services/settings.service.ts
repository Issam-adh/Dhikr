import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ReminderSettings } from '../models/adhkar.model';
import { LocalStoreService } from './local-store.service';

const KEY = 'settings:v1';

export const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: true,

  /**
   * Default selected frequency.
   */
  frequencyMinutes: 15,

  /**
   * Default custom value displayed in Settings.
   *
   * Important:
   * The notification scheduler currently enforces a minimum of 15 minutes.
   */
  customFrequencyMinutes: 1,

  /**
   * JavaScript weekday indexes:
   * 0 = Sunday
   * 1 = Monday
   * 2 = Tuesday
   * 3 = Wednesday
   * 4 = Thursday
   * 5 = Friday
   * 6 = Saturday
   */
  activeDays: [0, 1, 2, 3, 4, 5, 6],

  startTime: '08:00',
  endTime: '23:00',

  fixedTimes: [
    '05:30',
    '13:00',
    '21:45'
  ],

  selectedAdhkarIds: [],

  selectedCategories: [
    'Daily',
    'Custom'
  ],

  /**
   * Replace these IDs if your adhkar seed file uses different IDs.
   *
   * The value must match the exact "id" of the corresponding adhkar
   * inside adhkar.seed.ts or your saved adhkar data.
   */
  weeklyAdhkarByDay: {
    // Sunday: Astaghfirullah
    0: 'astaghfirullah',

    // Monday: Subhan Allahi wa bihamdih
    1: 'subhan-allahi-wa-bihamdih',

    // Tuesday: Alhamdu lillah
    2: 'alhamdulillah',

    // Wednesday: La ilaha illa Allah
    3: 'la-ilaha-illa-allah',

    // Thursday: La hawla wa la quwwata illa billah
    4: 'la-hawla-wa-la-quwwata',

    // Friday: Salawat upon the Prophet ﷺ
    5: 'salawat',

    // Saturday: Allahumma a'inni ala dhikrika...
    6: 'allahumma-a-inni'
  },

  mode: 'sequential',

  preparePrompt: true,
  dailyInspirationEnabled: false,
  darkMode: false,
  afterPrayerEnabled: false
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private store = inject(LocalStoreService);

  private subject = new BehaviorSubject<ReminderSettings>(
    structuredClone(DEFAULT_SETTINGS)
  );

  readonly settings$ = this.subject.asObservable();

  async init(): Promise<void> {
    const savedSettings = await this.store.get<ReminderSettings>(
      KEY,
      structuredClone(DEFAULT_SETTINGS)
    );

    const mergedSettings: ReminderSettings = {
      ...structuredClone(DEFAULT_SETTINGS),
      ...(savedSettings || {}),
      weeklyAdhkarByDay: {
        ...DEFAULT_SETTINGS.weeklyAdhkarByDay,
        ...(savedSettings?.weeklyAdhkarByDay || {})
      }
    };

    this.subject.next(mergedSettings);
    this.applyDarkMode(mergedSettings.darkMode);
  }

  getSnapshot(): ReminderSettings {
    return this.subject.value;
  }

  async update(
    patch: Partial<ReminderSettings>
  ): Promise<void> {
    const current = this.subject.value;

    const next: ReminderSettings = {
      ...current,
      ...patch,
      weeklyAdhkarByDay: {
        ...current.weeklyAdhkarByDay,
        ...(patch.weeklyAdhkarByDay || {})
      }
    };

    await this.store.set(KEY, next);

    this.subject.next(next);
    this.applyDarkMode(next.darkMode);
  }

  async resetToDefaults(): Promise<void> {
    const defaults = structuredClone(DEFAULT_SETTINGS);

    await this.store.set(KEY, defaults);

    this.subject.next(defaults);
    this.applyDarkMode(defaults.darkMode);
  }

  private applyDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark', enabled);
  }
}