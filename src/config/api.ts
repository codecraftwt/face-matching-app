import { Platform } from 'react-native';

// Physical Android device: replace with your PC IP (run "ipconfig" → IPv4 Address). Same Wi‑Fi as phone.
const PHYSICAL_DEVICE_BACKEND_URL = 'http://192.168.1.5:3000';

// const ANDROID_EMULATOR = 'http://10.0.2.2:3000';
const ANDROID_EMULATOR = 'https://5zwz9zl4-3000.inc1.devtunnels.ms';

const IOS_SIMULATOR = 'http://localhost:3000';

export const API_BASE_URL = ANDROID_EMULATOR
