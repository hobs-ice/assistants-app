import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.macalfer.app',
  appName: 'MacAlfer',
  webDir: 'build',
  ios: {
    scrollEnabled: true,
    contentInset: 'always',
    allowsLinkPreview: false
  },
  plugins: {
    Browser: {
      presentationStyle: 'fullscreen'
    }
  }
};


export default config;


