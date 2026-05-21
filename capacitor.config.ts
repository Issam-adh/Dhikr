import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.issam.dhikr",
  appName: "ذِكْر",
  webDir: "www",
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#0f766e",
      sound: "default",
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
