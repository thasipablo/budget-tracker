import { getDatabase } from './database';
import type { ProjectExpense } from '../types';

const SELECT_WITH_CATEGORY = `
  SELECT pe.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
  FROM project_expenses pe
  LEFT JOIN categories c ON pe.category_id = c.id
`;

export async function getExpensesByPhase(phaseId: number): Promise<ProjectExpense[]> {
  const db = await getDatabase();
  return db.getAllAsync<ProjectExpense>(
    `${SELECT_WITH_CATEGORY} WHERE pe.phase_id = ? ORDER BY pe.date DESC`,
    [phaseId]
  );
}

export async function getExpenseById(id: number): Promise<ProjectExpense | null> {
  const db = await getDatabase();
  return db.getFirstAsync<ProjectExpense>(
    `${SELECT_WITH_CATEGORY} WHERE pe.id = ?`,
    [id]
  );
}

export async function insertProjectExpense(
  phaseId: number,
  projectId: number,
  amount: number,
  date: string,
  categoryId?: number,
  note?: string
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO project_expenses (phase_id, project_id, amount, category_id, date, note) VALUES (?, ?, ?, ?, ?, ?)',
    [phaseId, projectId, amount, categoryId ?? null, date, note ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateProjectExpense(
  id: number,
  amount: number,
  date: string,
  categoryId?: number,
  note?: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE project_expenses SET amount = ?, category_id = ?, date = ?, note = ? WHERE id = ?',
    [amount, categoryId ?? null, date, note ?? null, id]
  );
}

export async function deleteProjectExpense(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM project_expenses WHERE id = ?', [id]);
}
