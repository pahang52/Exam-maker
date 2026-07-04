import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ir.education.examdesigner',
  appName: 'طراح سوالات',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: 'exam-designer.keystore',
      keystoreAlias: 'exam-designer',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: true,
      spinnerColor: '#ffffff',
      androidSpinnerStyle: 'large',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e3a8a',
    },
  },
};

export default config;
