import { Injectable } from '@angular/core';
import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

@Injectable({ providedIn: 'root' })
export class PrayerService {
  getTimes(latitude: number, longitude: number, date = new Date()): Record<string, Date> {
    const params = CalculationMethod.MuslimWorldLeague();
    const times = new PrayerTimes(new Coordinates(latitude, longitude), date, params);
    return { fajr: times.fajr, dhuhr: times.dhuhr, asr: times.asr, maghrib: times.maghrib, isha: times.isha };
  }
}
