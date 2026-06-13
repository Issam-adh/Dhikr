import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonCheckbox,
  IonChip,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';

import {
  Adhkar,
  AdhkarCategory,
  ReminderSettings,
  WeekdayIndex
} from '../../models/adhkar.model';

import {
  DEFAULT_SETTINGS,
  SettingsService
} from '../../services/settings.service';

import {
  NotificationSchedulerService
} from '../../services/notification-scheduler.service';

import {
  AdhkarService
} from '../../services/adhkar.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCheckbox,
    IonChip,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToggle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      class="ion-padding patterned"
      *ngIf="settings"
    >
      <ion-list class="rounded-list">
        <ion-item>
          <ion-label>
            Enable all reminders
          </ion-label>

          <ion-toggle
            [(ngModel)]="settings.enabled"
            (ionChange)="save(false)"
          ></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>
            Dark mode
          </ion-label>

          <ion-toggle
            [(ngModel)]="settings.darkMode"
            (ionChange)="save(false)"
          ></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-select
            label="Frequency"
            labelPlacement="stacked"
            [(ngModel)]="settings.frequencyMinutes"
          >
            <ion-select-option [value]="15">
              Repeat every 15 minutes
            </ion-select-option>

            <ion-select-option [value]="30">
              Repeat every 30 minutes
            </ion-select-option>

            <ion-select-option [value]="60">
              Repeat every 1 hour
            </ion-select-option>

            <ion-select-option [value]="120">
              Repeat every 2 hours
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-input
            type="number"
            min="1"
            label="Custom minutes"
            labelPlacement="stacked"
            [(ngModel)]="settings.customFrequencyMinutes"
            placeholder="1"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            type="time"
            label="Start time"
            labelPlacement="stacked"
            [(ngModel)]="settings.startTime"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            type="time"
            label="End time"
            labelPlacement="stacked"
            [(ngModel)]="settings.endTime"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            label="Fixed extra times"
            labelPlacement="stacked"
            [(ngModel)]="fixedTimesText"
            placeholder="05:30,13:00,21:45"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>
            Prepare prompt<br />
            before first reminder
          </ion-label>

          <ion-toggle
            [(ngModel)]="settings.preparePrompt"
          ></ion-toggle>
        </ion-item>
      </ion-list>

      <h2>Active days</h2>

      <div class="days-container">
        <ion-chip
          *ngFor="let day of days"
          [color]="
            settings.activeDays.includes(day.value)
              ? 'primary'
              : 'medium'
          "
          (click)="toggleDay(day.value)"
        >
          {{ day.label }}
        </ion-chip>
      </div>

      <h2>
        One dua/dhikr for each day
      </h2>

      <p class="note">
        Choose one dua/dhikr for each weekday.
        That same dua/dhikr will be repeated many
        times during that day using your frequency
        and fixed times.
      </p>

      <ion-list class="rounded-list">
        <ion-item
          *ngFor="let day of days"
        >
          <ion-select
            [label]="day.full"
            labelPlacement="stacked"
            interface="popover"
            [(ngModel)]="
              settings.weeklyAdhkarByDay[day.value]
            "
          >
            <ion-select-option value="">
              No adhkar for this day
            </ion-select-option>

            <ion-select-option
              *ngFor="let item of adhkarList"
              [value]="item.id"
            >
              {{ item.arabic }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <h2>
        Fallback categories
      </h2>

      <p class="note">
        If a weekday has no selected dua/dhikr,
        the app can fallback to these categories.
      </p>

      <ion-list class="rounded-list">
        <ion-item
          *ngFor="let category of categories"
        >
          <ion-checkbox
            justify="space-between"
            [checked]="
              settings.selectedCategories.includes(
                category.value
              )
            "
            (ionChange)="
              toggleCategory(category.value)
            "
          >
            {{ category.label }}
          </ion-checkbox>
        </ion-item>
      </ion-list>

      <ion-button
        expand="block"
        (click)="save()"
      >
        Save & Reschedule
      </ion-button>

      <ion-button
        expand="block"
        fill="outline"
        (click)="reset()"
      >
        Reset Defaults
      </ion-button>

      <p class="note">
        Example: Monday = “SubhanAllah”.
        If frequency is 30 minutes and active time
        is 08:00 to 22:00, every Monday notification
        repeats “SubhanAllah”.
      </p>
    </ion-content>
  `,
  styles: [`
    .days-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 24px;
    }

    ion-select::part(text) {
      direction: rtl;
      text-align: right;
      font-family: 'Arial', sans-serif;
      font-size: 1.15rem;
      line-height: 1.8;
    }

    ion-select-option {
      direction: rtl;
      text-align: right;
    }

    .note {
      color: var(--ion-color-medium-shade);
      line-height: 1.45;
    }

    h2 {
      color: var(--ion-color-dark);
      margin-top: 32px;
      margin-bottom: 12px;
    }

    .rounded-list {
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 24px;
    }
  `]
})
export class SettingsPage {
  private settingsService = inject(SettingsService);

  private scheduler = inject(
    NotificationSchedulerService
  );

  private adhkarService = inject(AdhkarService);

  settings!: ReminderSettings;

  fixedTimesText = '';

  adhkarList: Adhkar[] = [];

  categories: Array<{
    label: string;
    value: AdhkarCategory;
  }> = [
    {
      label: 'Morning',
      value: 'Morning'
    },
    {
      label: 'Evening',
      value: 'Evening'
    },
    {
      label: 'After Prayers',
      value: 'After Prayers'
    },
    {
      label: 'Before Sleep',
      value: 'Before Sleep'
    },
    {
      label: 'Daily',
      value: 'Daily'
    },
    {
      label: 'Custom',
      value: 'Custom'
    }
  ];

  days: Array<{
    label: string;
    full: string;
    value: WeekdayIndex;
  }> = [
    {
      label: 'Sun',
      full: 'Sunday',
      value: 0
    },
    {
      label: 'Mon',
      full: 'Monday',
      value: 1
    },
    {
      label: 'Tue',
      full: 'Tuesday',
      value: 2
    },
    {
      label: 'Wed',
      full: 'Wednesday',
      value: 3
    },
    {
      label: 'Thu',
      full: 'Thursday',
      value: 4
    },
    {
      label: 'Fri',
      full: 'Friday',
      value: 5
    },
    {
      label: 'Sat',
      full: 'Saturday',
      value: 6
    }
  ];

  ionViewWillEnter(): void {
    this.settings = structuredClone(
      this.settingsService.getSnapshot()
    );

    if (!this.settings.weeklyAdhkarByDay) {
      this.settings.weeklyAdhkarByDay = {};
    }

    this.fixedTimesText =
      this.settings.fixedTimes.join(',');

    this.adhkarList = [
      ...this.adhkarService.getSnapshot()
    ].sort((a, b) => {
      return a.arabic.localeCompare(
        b.arabic,
        'ar'
      );
    });
  }

  toggleDay(day: WeekdayIndex): void {
    const activeDays = new Set(
      this.settings.activeDays
    );

    if (activeDays.has(day)) {
      activeDays.delete(day);
    } else {
      activeDays.add(day);
    }

    this.settings.activeDays =
      Array.from(activeDays).sort(
        (a, b) => a - b
      );
  }

  toggleCategory(
    category: AdhkarCategory
  ): void {
    const selectedCategories = new Set(
      this.settings.selectedCategories
    );

    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }

    this.settings.selectedCategories =
      Array.from(selectedCategories);
  }

  async save(
    reschedule = true
  ): Promise<void> {
    this.settings.fixedTimes =
      this.fixedTimesText
        .split(',')
        .map(value => value.trim())
        .filter(value => this.isValidTime(value));

    this.settings.weeklyAdhkarByDay =
      Object.fromEntries(
        Object.entries(
          this.settings.weeklyAdhkarByDay || {}
        ).filter(([, adhkarId]) => {
          return Boolean(adhkarId);
        })
      ) as ReminderSettings['weeklyAdhkarByDay'];

    await this.settingsService.update(
      this.settings
    );

    if (reschedule) {
      await this.scheduler
        .rescheduleNext48Hours();
    }
  }

  async reset(): Promise<void> {
    this.settings =
      structuredClone(DEFAULT_SETTINGS);

    this.fixedTimesText =
      this.settings.fixedTimes.join(',');

    await this.settingsService
      .resetToDefaults();

    await this.scheduler
      .rescheduleNext48Hours();
  }

  private isValidTime(
    value: string
  ): boolean {
    return /^([01]\d|2[0-3]):[0-5]\d$/
      .test(value);
  }
}