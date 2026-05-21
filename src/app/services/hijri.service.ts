import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HijriService {
  today(): string {
    try {
      return new Intl.DateTimeFormat('en-GB-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    } catch {
      return 'Hijri date unavailable on this device';
    }
  }
}
