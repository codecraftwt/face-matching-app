import { cosineSimilarity } from '../utils/cosineSimilarity';
import { getAllEmployees } from '../database/employeeRepo';
import { markAttendance } from '../database/attendanceRepo';

const SIMILARITY_THRESHOLD = 0.75;

export const processAttendanceLive = async (
  embedding: number[],
  lastSeenMap: Record<string, number>,
  cooldownMs: number
): Promise<string[]> => {
  const employees = await getAllEmployees();

  console.log('[LIVE][API] Employees count:', employees?.length ?? 0);

  if (!employees || employees.length === 0) {
    console.log('[LIVE][API] No employees found');
    return [];
  }

  let bestMatch: { emp_id: string; name: string; embedding: number[] } | null =
    null;
  let bestScore = 0;

  for (const emp of employees) {
    const score = cosineSimilarity(embedding, emp.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = emp;
    }
  }

  if (!bestMatch || bestScore < SIMILARITY_THRESHOLD) {
    return [];
  }

  const now = Date.now();
  const lastSeen = lastSeenMap[bestMatch.emp_id] || 0;
  if (now - lastSeen < cooldownMs) {
    return [];
  }

  await markAttendance(bestMatch.emp_id, bestMatch.name);
  lastSeenMap[bestMatch.emp_id] = now;
  return [bestMatch.name];
};
