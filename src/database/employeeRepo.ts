import { api } from '../services/api';

/** All employee data is stored in MongoDB via the backend API. */
export type Employee = {
    emp_id: string;
    name: string;
    embedding: number[];
};

export const insertEmployee = async (
    empId: string,
    name: string,
    embedding: number[]
): Promise<void> => {
    try {
        await api.employees.create(empId, name, embedding);
    } catch (err: any) {
        if (err?.code === 'EMPLOYEE_EXISTS') {
            throw new Error('EMPLOYEE_EXISTS');
        }
        throw err;
    }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
    const list = await api.employees.list();
    return list.map((e) => ({
        emp_id: e.emp_id,
        name: e.name,
        embedding: e.embedding,
    }));
};

export const getEmployeeCount = async (): Promise<number> => {
    return api.employees.count();
};

export const deleteEmployee = async (empId: string): Promise<void> => {
    await api.employees.delete(empId);
};
