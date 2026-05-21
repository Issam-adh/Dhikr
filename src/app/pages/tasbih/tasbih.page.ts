import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { TasbihService } from '../../services/tasbih.service';

@Component({
  selector: 'app-tasbih', standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonButton],
  template: `
  <ion-header><ion-toolbar><ion-title>Tasbih</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding patterned">
    <ion-card class="tasbih-card" *ngFor="let c of counters$ | async">
      <ion-card-content>
        <h2>{{ c.label }}</h2>
        <div class="counter">{{ c.count }}</div>
        <p *ngIf="c.target">Target: {{ c.target }}</p>
        <ion-button size="large" expand="block" (click)="inc(c.id)">+1</ion-button>
        <ion-button expand="block" fill="outline" (click)="reset(c.id)">Reset</ion-button>
      </ion-card-content>
    </ion-card>
  </ion-content>`
})
export class TasbihPage { private tasbih = inject(TasbihService); counters$ = this.tasbih.counters$; inc(id: string){ void this.tasbih.increment(id); } reset(id: string){ void this.tasbih.reset(id); } }
