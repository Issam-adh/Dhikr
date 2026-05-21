import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  bookOutline,
  settingsOutline,
  radioButtonOnOutline,
} from "ionicons/icons";
import { HijriService } from "../../services/hijri.service";
import { NotificationSchedulerService } from "../../services/notification-scheduler.service";
import { StreakService } from "../../services/streak.service";
import { INSPIRATION_SEED } from "../../data/inspiration.seed";
import { Adhkar } from "../../models/adhkar.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
  ],
  template: ` <ion-header
      ><ion-toolbar><ion-title>ذِكْر</ion-title></ion-toolbar></ion-header
    >
    <ion-content class="ion-padding patterned">
      <section class="hero-card">
        <div class="bismillah">بِسْمِ ٱللَّٰهِ</div>
        <p>{{ hijriDate }}</p>
        <ion-badge color="warning">Offline first</ion-badge>
      </section>

      <ion-card class="soft-card">
        <ion-card-content>
          <h2>Next reminder</h2>
          <ng-container *ngIf="next; else noNext">
            <div class="next-time">{{ next.at | date : "shortTime" }}</div>
            <p class="arabic">{{ next.adhkar.arabic }}</p>
            <p>{{ next.adhkar.translation }}</p>
            <ion-button [routerLink]="['/adhkar', next.adhkar.id]"
              >Open Reader</ion-button
            >
          </ng-container>
          <ng-template #noNext
            ><p>
              No reminder scheduled. Check Settings and notification
              permissions.
            </p></ng-template
          >
        </ion-card-content>
      </ion-card>

      <ion-card class="soft-card" *ngIf="streak$ | async as streak">
        <ion-card-content>
          <h2>Daily streak</h2>
          <div class="streak">{{ streak.currentStreak }} days</div>
          <p>
            Best: {{ streak.bestStreak }} • Total reads: {{ streak.totalReads }}
          </p>
        </ion-card-content>
      </ion-card>

      <ion-card class="soft-card">
        <ion-card-content>
          <h2>Daily inspiration</h2>
          <p>{{ inspiration.text }}</p>
          <small>{{ inspiration.source }}</small>
        </ion-card-content>
      </ion-card>

      <ion-grid
        ><ion-row>
          <ion-col
            ><ion-button expand="block" routerLink="/tabs/library"
              ><ion-icon slot="start" name="book-outline"></ion-icon
              >Library</ion-button
            ></ion-col
          >
          <ion-col
            ><ion-button expand="block" routerLink="/tabs/tasbih"
              ><ion-icon slot="start" name="radio-button-on-outline"></ion-icon
              >Tasbih</ion-button
            ></ion-col
          >
          <ion-col
            ><ion-button expand="block" routerLink="/tabs/settings"
              ><ion-icon slot="start" name="settings-outline"></ion-icon
              >Settings</ion-button
            ></ion-col
          >
        </ion-row></ion-grid
      >
    </ion-content>`,
})
export class HomePage {
  private hijri = inject(HijriService);
  private scheduler = inject(NotificationSchedulerService);
  private streak = inject(StreakService);
  hijriDate = this.hijri.today();
  streak$ = this.streak.streak$;
  inspiration =
    INSPIRATION_SEED[new Date().getDate() % INSPIRATION_SEED.length];
  next?: { at: Date; adhkar: Adhkar };
  constructor() {
    addIcons({ bookOutline, settingsOutline, radioButtonOnOutline });
  }
  async ionViewWillEnter() {
    this.next = await this.scheduler.nextReminderPreview();
  }
}
