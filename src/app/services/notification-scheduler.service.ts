import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";

import { Adhkar } from "../models/adhkar.model";
import { AdhkarService } from "./adhkar.service";
import { SettingsService } from "./settings.service";

const CHANNEL_ID = "adhkar-reminders";
const BASE_ID = 50000;
const PREPARE_PROMPT_ID = BASE_ID - 1;
const SCHEDULE_HOURS = 48;

@Injectable({
  providedIn: "root",
})
export class NotificationSchedulerService {
  private adhkar = inject(AdhkarService);
  private settings = inject(SettingsService);
  private router = inject(Router);

  private listenerReady = false;

  async initListeners(): Promise<void> {
    if (this.listenerReady) {
      return;
    }

    this.listenerReady = true;

    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Adhkar reminders",
      description: "Daily adhkar reminders",
      importance: 4,
      visibility: 1,
      sound: "default",
    }).catch(() => undefined);

    await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const adhkarId = event.notification.extra?.["adhkarId"];

        if (adhkarId) {
          void this.router.navigate(["/adhkar", adhkarId]);
        }
      },
    );
  }

  async ensurePermission(): Promise<boolean> {
    const current = await LocalNotifications.checkPermissions();

    if (current.display === "granted") {
      return true;
    }

    const requested = await LocalNotifications.requestPermissions();

    return requested.display === "granted";
  }

  async cancelAllScheduled(): Promise<void> {
    const pending = await LocalNotifications.getPending();

    const ours = pending.notifications.filter((notification) => {
      return (
        notification.id === PREPARE_PROMPT_ID ||
        (notification.id >= BASE_ID && notification.id < BASE_ID + 10000)
      );
    });

    if (ours.length > 0) {
      await LocalNotifications.cancel({
        notifications: ours.map((notification) => ({
          id: notification.id,
        })),
      });
    }
  }

  /**
   * Main scheduling logic:
   *
   * - The app cannot run custom JS code in the background.
   * - So we pre-schedule many individual notifications for the next 48 hours.
   * - For each trigger date, we check the weekday.
   * - Then we use the dua/dhikr selected for that specific weekday.
   *
   * Example:
   * Monday selected adhkar = morning-001
   * Frequency = 30 minutes
   * Range = 08:00 to 22:00
   *
   * Result:
   * Monday 08:00 -> morning-001
   * Monday 08:30 -> morning-001
   * Monday 09:00 -> morning-001
   * etc.
   */
  async rescheduleNext48Hours(): Promise<void> {
    await this.cancelAllScheduled();

    const settings = this.settings.getSnapshot();

    if (!settings.enabled) {
      return;
    }

    const allowed = await this.ensurePermission();

    if (!allowed) {
      return;
    }

    const allAdhkar = this.adhkar.getSnapshot();
    const fallbackPool = this.getFallbackPool();

    const triggerDates = this.buildTriggerDates();
    const notifications: LocalNotificationSchema[] = [];

    let notificationIndex = 0;

    for (const at of triggerDates) {
      const selectedAdhkar = this.getAdhkarForDate(at, allAdhkar, fallbackPool);

      if (!selectedAdhkar) {
        continue;
      }

      notifications.push(
        this.toNotification(BASE_ID + notificationIndex, at, selectedAdhkar),
      );

      notificationIndex++;
    }

    if (settings.preparePrompt) {
      const firstTrigger = triggerDates[0];

      if (firstTrigger) {
        const prepareAt = new Date(firstTrigger.getTime() - 10 * 60_000);

        if (prepareAt.getTime() > Date.now()) {
          notifications.unshift({
            id: PREPARE_PROMPT_ID,
            title: "Prepare your heart",
            body: "Your first adhkar reminder is coming soon.",
            schedule: {
              at: prepareAt,
              allowWhileIdle: true,
            },
            channelId: CHANNEL_ID,
          });
        }
      }
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({
        notifications,
      });
    }
  }

  /**
   * Used by the Home page to display the next upcoming reminder.
   */
  async nextReminderPreview(): Promise<
    { at: Date; adhkar: Adhkar } | undefined
  > {
    const allAdhkar = this.adhkar.getSnapshot();
    const fallbackPool = this.getFallbackPool();

    const triggerDates = this.buildTriggerDates();

    for (const at of triggerDates) {
      const selectedAdhkar = this.getAdhkarForDate(at, allAdhkar, fallbackPool);

      if (selectedAdhkar) {
        return {
          at,
          adhkar: selectedAdhkar,
        };
      }
    }

    return undefined;
  }

  /**
   * New behavior:
   * one fixed dua/dhikr per weekday.
   */
  private getAdhkarForDate(
    at: Date,
    allAdhkar: Adhkar[],
    fallbackPool: Adhkar[],
  ): Adhkar | undefined {
    const settings = this.settings.getSnapshot();

    const weekday = at.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const selectedAdhkarId = settings.weeklyAdhkarByDay?.[weekday];

    if (selectedAdhkarId) {
      const selected = allAdhkar.find((item) => item.id === selectedAdhkarId);

      if (selected) {
        return selected;
      }
    }

    /**
     * Fallback:
     * If the user did not choose an adhkar for this day,
     * use old category/selected pool logic.
     */
    if (!fallbackPool.length) {
      return undefined;
    }

    if (settings.mode === "random") {
      const randomIndex = Math.floor(Math.random() * fallbackPool.length);
      return fallbackPool[randomIndex];
    }

    const index = weekday % fallbackPool.length;
    return fallbackPool[index];
  }

  private getFallbackPool(): Adhkar[] {
    const settings = this.settings.getSnapshot();
    const allAdhkar = this.adhkar.getSnapshot();

    const selectedIds = new Set(settings.selectedAdhkarIds);
    const selectedCategories = new Set(settings.selectedCategories);

    return allAdhkar.filter((item) => {
      return selectedIds.has(item.id) || selectedCategories.has(item.category);
    });
  }

  private buildTriggerDates(): Date[] {
    const settings = this.settings.getSnapshot();

    const now = new Date();
    const end = new Date(now.getTime() + SCHEDULE_HOURS * 60 * 60 * 1000);

    const triggers: Date[] = [];

    const frequency = Math.max(
      15,
      Number(
        settings.customFrequencyMinutes || settings.frequencyMinutes || 60,
      ),
    );

    for (let day = new Date(now); day <= end; day.setDate(day.getDate() + 1)) {
      const weekday = day.getDay();

      if (!settings.activeDays.includes(weekday)) {
        continue;
      }

      const start = this.withTime(day, settings.startTime);
      const finish = this.withTime(day, settings.endTime);

      /**
       * Interval reminders.
       */
      for (
        let t = new Date(start);
        t <= finish;
        t = new Date(t.getTime() + frequency * 60_000)
      ) {
        if (t > now && t <= end) {
          triggers.push(new Date(t));
        }
      }

      /**
       * Extra fixed-time reminders.
       */
      for (const fixedTime of settings.fixedTimes) {
        const t = this.withTime(day, fixedTime);

        if (t > now && t <= end) {
          triggers.push(t);
        }
      }
    }

    /**
     * Remove duplicate timestamps and sort.
     */
    return Array.from(
      new Map(triggers.map((t) => [t.getTime(), t])).values(),
    ).sort((a, b) => a.getTime() - b.getTime());
  }

  private withTime(day: Date, hhmm: string): Date {
    const [hours, minutes] = hhmm.split(":").map(Number);

    const result = new Date(day);

    result.setHours(hours || 0, minutes || 0, 0, 0);

    return result;
  }

  private toNotification(
    id: number,
    at: Date,
    item: Adhkar,
  ): LocalNotificationSchema {
    return {
      id,
      title: "Adhkar Reminder",
      body: `${item.arabic}
${item.translation}`,
      largeBody: `${item.arabic}

${item.transliteration}

${item.translation}`,
      schedule: {
        at,
        allowWhileIdle: true,
      },
      channelId: CHANNEL_ID,
      extra: {
        adhkarId: item.id,
      },
    };
  }
}
