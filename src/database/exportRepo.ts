import RNFS from 'react-native-fs';
import { api } from '../services/api';

/** Fetches attendance from MongoDB via API, writes CSV to device for sharing. */
export const exportAttendanceCSV = async (): Promise<string> => {
  const csv = await api.attendance.exportCsv();
  const path = `${RNFS.DocumentDirectoryPath}/attendance.csv`;
  await RNFS.writeFile(path, csv, 'utf8');
  return path;
};
