import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, libraryOutline, settingsOutline, radioButtonOnOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home"><ion-icon name="home-outline"></ion-icon><ion-label>Home</ion-label></ion-tab-button>
        <ion-tab-button tab="library" href="/tabs/library"><ion-icon name="library-outline"></ion-icon><ion-label>Library</ion-label></ion-tab-button>
        <ion-tab-button tab="tasbih" href="/tabs/tasbih"><ion-icon name="radio-button-on-outline"></ion-icon><ion-label>Tasbih</ion-label></ion-tab-button>
        <ion-tab-button tab="settings" href="/tabs/settings"><ion-icon name="settings-outline"></ion-icon><ion-label>Settings</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>`
})
export class TabsPage { constructor() { addIcons({ homeOutline, libraryOutline, settingsOutline, radioButtonOnOutline }); } }
