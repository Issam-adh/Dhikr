import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
      { path: 'library', loadComponent: () => import('./pages/library/library.page').then(m => m.LibraryPage) },
      { path: 'tasbih', loadComponent: () => import('./pages/tasbih/tasbih.page').then(m => m.TasbihPage) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'adhkar/:id', loadComponent: () => import('./pages/adhkar-detail/adhkar-detail.page').then(m => m.AdhkarDetailPage) }
];
