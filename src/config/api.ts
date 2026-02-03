import { Platform } from 'react-native';

// For physical device / production: set to your Vercel URL (e.g. https://your-app.vercel.app) or PC IP (http://192.168.1.5:3000)
const PHYSICAL_DEVICE_BACKEND_URL = 'http://192.168.1.5:3000';

const ANDROID_EMULATOR = 'http://10.0.2.2:3000';
const IOS_SIMULATOR = 'http://localhost:3000';

export const API_BASE_URL =
  PHYSICAL_DEVICE_BACKEND_URL ||
  (Platform.OS === 'android' ? ANDROID_EMULATOR : IOS_SIMULATOR);
