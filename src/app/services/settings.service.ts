import { Injectable, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ReminderSettings } from "../models/adhkar.model";
import { LocalStoreService } from "./local-store.service";

const KEY = "settings:v1";

export const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: true,

  frequencyMinutes: 60,
  activeDays: [0, 1, 2, 3, 4, 5, 6],

  startTime: "08:00",
  endTime: "22:00",

  fixedTimes: [],

  selectedAdhkarIds: [],
  selectedCategories: ["Morning", "Evening", "After Prayers", "Daily"],

  /**
   * Default weekly configuration.
   * You can change these IDs based on your adhkar.seed.ts IDs.
   */
  weeklyAdhkarByDay: {
    0: "daily-001", // Sunday
    1: "morning-001", // Monday
    2: "morning-002", // Tuesday
    3: "after-prayer-001", // Wednesday
    4: "after-prayer-002", // Thursday
    5: "daily-002", // Friday
    6: "evening-001", // Saturday
  },

  mode: "sequential",

  preparePrompt: true,
  dailyInspirationEnabled: false,
  darkMode: false,
  afterPrayerEnabled: false,
};

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private store = inject(LocalStoreService);

  private subject = new BehaviorSubject<ReminderSettings>(DEFAULT_SETTINGS);

  readonly settings$ = this.subject.asObservable();

  async init(): Promise<void> {
    const savedSettings = await this.store.get<ReminderSettings>(
      KEY,
      DEFAULT_SETTINGS,
    );

    const mergedSettings: ReminderSettings = {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
      weeklyAdhkarByDay: {
        ...DEFAULT_SETTINGS.weeklyAdhkarByDay,
        ...(savedSettings?.weeklyAdhkarByDay || {}),
      },
    };

    this.subject.next(mergedSettings);
    this.applyDarkMode(mergedSettings.darkMode);
  }

  getSnapshot(): ReminderSettings {
    return this.subject.value;
  }

  async update(patch: Partial<ReminderSettings>): Promise<void> {
    const next: ReminderSettings = {
      ...this.subject.value,
      ...patch,
      weeklyAdhkarByDay: {
        ...this.subject.value.weeklyAdhkarByDay,
        ...(patch.weeklyAdhkarByDay || {}),
      },
    };

    await this.store.set(KEY, next);
    this.subject.next(next);

    this.applyDarkMode(next.darkMode);
  }

  private applyDarkMode(enabled: boolean): void {
    document.body.classList.toggle("dark", enabled);
  }
}
