import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.busybrainstechhub.app',
  appName: 'BusyBrains Tech-Hub',
  webDir: 'www',
  server: {
    url: 'https://busybrainstech-hub.com.ng',
    androidScheme: 'https'
  }
};

export default config;
