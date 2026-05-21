import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Clipboard } from "@capacitor/clipboard";
import { Share } from "@capacitor/share";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonToast,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  copyOutline,
  shareSocialOutline,
  checkmarkDoneOutline,
  playOutline,
} from "ionicons/icons";
import { Adhkar } from "../../models/adhkar.model";
import { AdhkarService } from "../../services/adhkar.service";
import { StreakService } from "../../services/streak.service";

@Component({
  selector: "app-adhkar-detail",
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonToast,
  ],
  template: ` <ion-header
      ><ion-toolbar
        ><ion-buttons slot="start"
          ><ion-back-button
            defaultHref="/tabs/library"
          ></ion-back-button></ion-buttons
        ><ion-title>Reader</ion-title></ion-toolbar
      ></ion-header
    >
    <ion-content class="ion-padding patterned" *ngIf="item">
      <ion-card class="reader-card"
        ><ion-card-content>
          <div class="arabic-reader" dir="rtl">{{ item.arabic }}</div>
          <p class="translit">{{ item.transliteration }}</p>
          <p class="translation">{{ item.translation }}</p>
          <small>{{ item.source }}</small>
          <ng-container *ngIf="item.audioUrl">
            <audio #audio [src]="item.audioUrl"></audio>
            <ion-button expand="block" (click)="audio.play()"
              ><ion-icon name="play-outline" slot="start"></ion-icon>Play
              audio</ion-button
            >
          </ng-container>
          <ion-button expand="block" color="success" (click)="markRead()"
            ><ion-icon name="checkmark-done-outline" slot="start"></ion-icon
            >Mark as Read</ion-button
          >
          <ion-button expand="block" fill="outline" (click)="copy()"
            ><ion-icon name="copy-outline" slot="start"></ion-icon
            >Copy</ion-button
          >
          <ion-button expand="block" fill="outline" (click)="share()"
            ><ion-icon name="share-social-outline" slot="start"></ion-icon
            >Share</ion-button
          >
        </ion-card-content></ion-card
      >
      <ion-toast
        [isOpen]="toast"
        message="Saved"
        duration="1200"
        (didDismiss)="toast = false"
      ></ion-toast>
    </ion-content>`,
})
export class AdhkarDetailPage {
  private route = inject(ActivatedRoute);
  private adhkar = inject(AdhkarService);
  private streak = inject(StreakService);
  item?: Adhkar;
  toast = false;
  constructor() {
    addIcons({
      copyOutline,
      shareSocialOutline,
      checkmarkDoneOutline,
      playOutline,
    });
  }
  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get("id") || "";
    this.item = this.adhkar.getById(id);
  }
  text() {
    return this.item
      ? `${this.item.arabic}

${this.item.transliteration}

${this.item.translation}
${this.item.source || ""}`
      : "";
  }
  async markRead() {
    await this.streak.markRead();
    this.toast = true;
  }
  async copy() {
    await Clipboard.write({ string: this.text() });
    this.toast = true;
  }
  async share() {
    await Share.share({ title: "Adhkar", text: this.text() });
  }
}
