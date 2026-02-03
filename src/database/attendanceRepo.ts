import { api } from '../services/api';

/** All attendance data is stored in MongoDB via the backend API. */
export const markAttendance = async (
  empId: string,
  name: string
): Promise<'checkin' | 'checkout'> => {
  const { action } = await api.attendance.mark(empId, name);
  return action === 'checkout' ? 'checkout' : 'checkin';
};
