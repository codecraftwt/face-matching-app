import { API_BASE_URL } from '../config/api';

/** All app data (employees, attendance) is stored in MongoDB and accessed only through this API. */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (e: any) {
    const rawMsg = e?.message || 'Network error';
    console.warn('[API] Request failed to', url, rawMsg);
    const msg = `Cannot reach backend at ${url}. Check: (1) Backend running: cd backend && npm start (2) Same Wi‑Fi (3) PC IP in src/config/api.ts (4) Firewall: allow Node on port 3000`;
    const err = new Error(msg);
    (err as any).code = 'NETWORK_ERROR';
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { error?: string }).error || res.statusText);
    (err as any).status = res.status;
    (err as any).code = (data as { error?: string }).error;
    throw err;
  }
  return data as T;
}

export const api = {
  employees: {
    create: (emp_id: string, name: string, embedding: number[]) =>
      request<{ emp_id: string; name: string }>('/api/employees', {
        method: 'POST',
        body: JSON.stringify({ emp_id, name, embedding }),
      }),
    list: () =>
      request<{ emp_id: string; name: string; embedding: number[] }[]>(
        '/api/employees'
      ),
    count: () =>
      request<{ count: number }>('/api/employees/count').then((r) => r.count),
    delete: (empId: string) =>
      request<{ ok: boolean }>(`/api/employees/${encodeURIComponent(empId)}`, {
        method: 'DELETE',
      }),
  },
  attendance: {
    mark: (emp_id: string, name: string) =>
      request<{ action: string }>('/api/attendance', {
        method: 'POST',
        body: JSON.stringify({ emp_id, name }),
      }),
    list: () =>
      request<
        { emp_id: string; name: string; check_in: string; check_out: string | null; duration: number | null }[]
      >('/api/attendance'),
    exportCsv: async (): Promise<string> => {
      const url = `${API_BASE_URL}/api/attendance/export`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Export failed');
      return res.text();
    },
  },
};
