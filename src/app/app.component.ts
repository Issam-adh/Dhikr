import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { NotificationSchedulerService } from './services/notification-scheduler.service';
import { AdhkarService } from './services/adhkar.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>'
})
export class AppComponent {
  private platform = inject(Platform);
  private adhkar = inject(AdhkarService);
  private settings = inject(SettingsService);
  private notifications = inject(NotificationSchedulerService);

  constructor() {
    this.platform.ready().then(async () => {
      await this.adhkar.init();
      await this.settings.init();
      await this.notifications.initListeners();
      await this.notifications.rescheduleNext48Hours();
    });
  }
}
