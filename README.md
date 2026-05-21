# Adhkar Reminder — Ionic Angular + Capacitor

Offline-first Islamic mobile app for iOS and Android. It stores adhkar, settings, streaks, and tasbih counters locally, and pre-schedules Local Notifications for the next 48 hours.

## Features included

- Bottom tabs: Home, Library, Tasbih, Settings
- Preloaded adhkar library with Arabic, transliteration, translation, category and source
- Add/delete custom adhkar
- Search and filter by category
- Reminder settings: frequency, custom minutes, days, time range, fixed times, categories, random/sequential mode, global enable switch
- Intelligent pre-scheduling using `@capacitor/local-notifications`
- Notification tap opens the reader page
- Reader page: large Arabic, translation, mark as read, copy, share, optional HTML audio
- Daily streak + achievements foundation
- Hijri date using native Intl Islamic calendar support
- Offline local persistence with `@capacitor/preferences`
- Tasbih counter with haptics
- Prayer service foundation using `adhan`
- Dark mode toggle

## Install

```bash
npm install -g @ionic/cli
npm install
```

## Run in browser

```bash
ionic serve
```

Local notifications only work properly on real iOS/Android devices or emulators, not the browser.

## Add native platforms

```bash
npx cap add android
npx cap add ios
npm run build
npx cap sync
```

## Android run

```bash
ionic capacitor run android
```

For exact notifications on Android 12+, add this permission in `android/app/src/main/AndroidManifest.xml` if exact reminder timing is central to your app:

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

For Android 14, consider `USE_EXACT_ALARM` only if Play policy allows it and exact alarms are core to the app.

## iOS run

```bash
ionic capacitor run ios
```

Open the generated project in Xcode, select your signing team, then run on a real device.

## Important production notes

1. The app schedules the next 48 hours because local notifications cannot execute JavaScript in the background to generate new dynamic content.
2. Ask the user to open the app at least every day or two so the batch refreshes.
3. Re-run `rescheduleNext48Hours()` after settings changes, timezone changes, app resume, or adhkar pool changes.
4. Add native app icons and notification small icons before Play Store/App Store release.
5. Verify Arabic content and references with a qualified source before production release.

## Future enhancements

- Native widgets for iOS/Android
- Full Qibla compass UI with heading support
- Export/import JSON backup
- Optional Firebase sync
- Streak calendar component
- Prayer-based adhkar scheduling UI
