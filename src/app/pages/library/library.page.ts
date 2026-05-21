import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  IonFab,
  IonFabButton,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { add, star, starOutline, trashOutline } from "ionicons/icons";
import { Adhkar, AdhkarCategory } from "../../models/adhkar.model";
import { AdhkarService } from "../../services/adhkar.service";

@Component({
  selector: "app-library",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonModal,
    IonInput,
    IonTextarea,
    IonButtons,
    IonFab,
    IonFabButton,
  ],
  template: ` <ion-header
      ><ion-toolbar
        ><ion-title>Adhkar Library</ion-title></ion-toolbar
      ></ion-header
    >
    <ion-content class="ion-padding patterned">
      <ion-searchbar
        [(ngModel)]="term"
        (ionInput)="refresh()"
        placeholder="Search adhkar"
      ></ion-searchbar>
      <ion-select
        [(ngModel)]="category"
        (ionChange)="refresh()"
        interface="popover"
        label="Category"
      >
        <ion-select-option value="all">All</ion-select-option>
        <ion-select-option *ngFor="let c of categories" [value]="c">{{
          c
        }}</ion-select-option>
      </ion-select>

      <ion-list class="rounded-list">
        <ion-item
          *ngFor="let item of filtered"
          [routerLink]="['/adhkar', item.id]"
          detail="true"
        >
          <ion-label
            ><h2 class="arabic-small">{{ item.arabic }}</h2>
            <p>{{ item.translation }}</p>
            <small
              >{{ item.category }} • {{ item.source || "Custom" }}</small
            ></ion-label
          >
          <ion-button
            fill="clear"
            slot="end"
            (click)="$event.stopPropagation(); toggleFav(item)"
            ><ion-icon
              [name]="item.favourite ? 'star' : 'star-outline'"
            ></ion-icon
          ></ion-button>
          <ion-button
            *ngIf="item.custom"
            fill="clear"
            color="danger"
            slot="end"
            (click)="$event.stopPropagation(); remove(item)"
            ><ion-icon name="trash-outline"></ion-icon
          ></ion-button>
        </ion-item>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end"
        ><ion-fab-button (click)="openAdd = true"
          ><ion-icon name="add"></ion-icon></ion-fab-button
      ></ion-fab>

      <ion-modal [isOpen]="openAdd" (didDismiss)="openAdd = false">
        <ng-template>
          <ion-header
            ><ion-toolbar
              ><ion-title>Add custom adhkar</ion-title
              ><ion-buttons slot="end"
                ><ion-button (click)="openAdd = false"
                  >Close</ion-button
                ></ion-buttons
              ></ion-toolbar
            ></ion-header
          >
          <ion-content class="ion-padding">
            <ion-textarea
              label="Arabic"
              labelPlacement="stacked"
              [(ngModel)]="form.arabic"
              autoGrow="true"
            ></ion-textarea>
            <ion-input
              label="Transliteration"
              labelPlacement="stacked"
              [(ngModel)]="form.transliteration"
            ></ion-input>
            <ion-textarea
              label="English translation"
              labelPlacement="stacked"
              [(ngModel)]="form.translation"
              autoGrow="true"
            ></ion-textarea>
            <ion-input
              label="Source"
              labelPlacement="stacked"
              [(ngModel)]="form.source"
            ></ion-input>
            <ion-select label="Category" [(ngModel)]="form.category"
              ><ion-select-option value="Custom">Custom</ion-select-option
              ><ion-select-option *ngFor="let c of categories" [value]="c">{{
                c
              }}</ion-select-option></ion-select
            >
            <ion-button expand="block" (click)="saveCustom()">Save</ion-button>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>`,
})
export class LibraryPage {
  private service = inject(AdhkarService);
  term = "";
  category: AdhkarCategory | "all" = "all";
  categories: AdhkarCategory[] = [
    "Morning",
    "Evening",
    "After Prayers",
    "Before Sleep",
    "Daily",
    "Custom",
  ];
  filtered: Adhkar[] = [];
  openAdd = false;
  form: Partial<Adhkar> = {
    category: "Custom",
    arabic: "",
    transliteration: "",
    translation: "",
  };
  constructor() {
    addIcons({ add, star, starOutline, trashOutline });
  }
  ionViewWillEnter() {
    this.refresh();
  }
  refresh() {
    this.filtered = this.service.search(this.term, this.category);
  }
  async toggleFav(item: Adhkar) {
    await this.service.toggleFavourite(item.id);
    this.refresh();
  }
  async remove(item: Adhkar) {
    await this.service.delete(item.id);
    this.refresh();
  }
  async saveCustom() {
    if (
      !this.form.arabic ||
      !this.form.translation ||
      !this.form.transliteration ||
      !this.form.category
    )
      return;
    await this.service.save(this.form as any);
    this.form = {
      category: "Custom",
      arabic: "",
      transliteration: "",
      translation: "",
    };
    this.openAdd = false;
    this.refresh();
  }
}
