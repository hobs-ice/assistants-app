import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.macaifer.app',
  appName: 'Macaifer',
  webDir: 'build',
  ios: {
    scrollEnabled: true,
    contentInset: 'always'
  }
};

export default config;


