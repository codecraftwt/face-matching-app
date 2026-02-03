import { cosineSimilarity } from '../utils/cosineSimilarity';
import { getAllEmployees } from '../database/employeeRepo';
import { markAttendance } from '../database/attendanceRepo';

const SIMILARITY_THRESHOLD = 0.75;

export const processAttendance = async (
  faceEmbedding: number[]
): Promise<string[]> => {
  if (!faceEmbedding || faceEmbedding.length === 0) {
    console.warn('[Attendance] Invalid embedding');
    return [];
  }

  const employees = await getAllEmployees();

  if (employees.length === 0) {
    console.warn('[Attendance] No employees registered');
    return [];
  }

  let bestMatch: { emp_id: string; name: string; embedding: number[] } | null =
    null;
  let bestScore = 0;

  for (const emp of employees) {
    const score = cosineSimilarity(faceEmbedding, emp.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = emp;
    }
  }

  console.log(`[Attendance] Best score: ${bestScore.toFixed(3)}`);

  if (!bestMatch || bestScore < SIMILARITY_THRESHOLD) {
    console.warn('[Attendance] Face not recognized');
    return [];
  }

  await markAttendance(bestMatch.emp_id, bestMatch.name);
  return [bestMatch.name];
};
