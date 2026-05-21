export type AdhkarCategory =
  | "Morning"
  | "Evening"
  | "After Prayers"
  | "Before Sleep"
  | "Daily"
  | "Custom";

export interface Adhkar {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: AdhkarCategory;
  source?: string;
  audioUrl?: string;
  favourite?: boolean;
  custom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ReminderMode = "sequential" | "random";

/**
 * JavaScript weekday index:
 * 0 = Sunday
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Example:
 * {
 *   1: 'morning-001', // Monday
 *   2: 'daily-001',   // Tuesday
 * }
 */
export type WeeklyAdhkarMap = Partial<Record<WeekdayIndex, string>>;

export interface ReminderSettings {
  enabled: boolean;

  /**
   * Reminder interval.
   * Example: 30 = every 30 minutes.
   */
  frequencyMinutes: number;
  customFrequencyMinutes?: number;

  /**
   * Active days.
   * 0 = Sunday ... 6 = Saturday.
   */
  activeDays: number[];

  /**
   * Active time range.
   * Example: 08:00 to 22:00.
   */
  startTime: string;
  endTime: string;

  /**
   * Extra fixed reminder times.
   * Example: ['05:30', '13:00'].
   */
  fixedTimes: string[];

  /**
   * Old/mixed mode fields.
   * They are kept as fallback if a weekday has no selected adhkar.
   */
  selectedAdhkarIds: string[];
  selectedCategories: AdhkarCategory[];

  /**
   * Main feature:
   * one specific dua/dhikr per day.
   * The selected item is repeated many times during that day.
   */
  weeklyAdhkarByDay: WeeklyAdhkarMap;

  /**
   * Used only as fallback if no weekly adhkar is selected for that day.
   */
  mode: ReminderMode;

  preparePrompt: boolean;
  dailyInspirationEnabled: boolean;
  darkMode: boolean;
  afterPrayerEnabled: boolean;

  manualCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ScheduledAdhkarPreview {
  id: number;
  adhkarId: string;
  title: string;
  body: string;
  at: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastReadDate?: string;
  totalReads: number;
  readHistory: Record<string, number>;
  achievements: string[];
}

export interface TasbihCounter {
  id: string;
  label: string;
  count: number;
  target?: number;
}
