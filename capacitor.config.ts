import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atw.dgrdriller',
  appName: 'BadanEdriller',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // ปรับเวลาที่แสดง splash screen (มิลลิวินาที)
      launchAutoHide: true,
      backgroundColor: '#ffffff', // สีพื้นหลัง
      androidScaleType: 'CENTER_CROP', // รูปแบบการสเกลของภาพ (เช่น FIT_CENTER หรือ CENTER_CROP)
      showSpinner: false,
    },
  },
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
  },
};

export default config;
