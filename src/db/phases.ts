import { getDatabase } from './database';
import type { Phase } from '../types';

const AGGREGATES = `
  COALESCE((SELECT SUM(pe.amount) FROM project_expenses pe WHERE pe.phase_id = ph.id), 0) AS total_spent,
  (SELECT COUNT(*) FROM project_expenses pe WHERE pe.phase_id = ph.id) AS expense_count
`;

export async function getPhasesByProject(projectId: number): Promise<Phase[]> {
  const db = await getDatabase();
  return db.getAllAsync<Phase>(
    `SELECT ph.*, ${AGGREGATES} FROM phases ph WHERE ph.project_id = ? ORDER BY ph.order_index ASC`,
    [projectId]
  );
}

export async function getPhaseById(id: number): Promise<Phase | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Phase>(
    `SELECT ph.*, ${AGGREGATES} FROM phases ph WHERE ph.id = ?`,
    [id]
  );
}

export async function insertPhase(
  projectId: number,
  name: string,
  budget?: number,
  start_date?: string,
  end_date?: string
): Promise<number> {
  const db = await getDatabase();
  const maxOrder = await db.getFirstAsync<{ max: number | null }>(
    'SELECT MAX(order_index) AS max FROM phases WHERE project_id = ?',
    [projectId]
  );
  const nextIndex = (maxOrder?.max ?? -1) + 1;
  const result = await db.runAsync(
    'INSERT INTO phases (project_id, name, budget, order_index, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [projectId, name, budget ?? null, nextIndex, start_date ?? null, end_date ?? null]
  );
  return result.lastInsertRowId;
}

export async function updatePhase(
  id: number,
  name: string,
  budget?: number,
  start_date?: string,
  end_date?: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE phases SET name = ?, budget = ?, start_date = ?, end_date = ? WHERE id = ?',
    [name, budget ?? null, start_date ?? null, end_date ?? null, id]
  );
}

export async function deletePhase(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM phases WHERE id = ?', [id]);
}

export async function swapPhaseOrder(idA: number, idB: number): Promise<void> {
  const db = await getDatabase();
  const phaseA = await db.getFirstAsync<{ order_index: number }>(
    'SELECT order_index FROM phases WHERE id = ?', [idA]
  );
  const phaseB = await db.getFirstAsync<{ order_index: number }>(
    'SELECT order_index FROM phases WHERE id = ?', [idB]
  );
  if (!phaseA || !phaseB) return;
  await db.runAsync('UPDATE phases SET order_index = ? WHERE id = ?', [phaseB.order_index, idA]);
  await db.runAsync('UPDATE phases SET order_index = ? WHERE id = ?', [phaseA.order_index, idB]);
}
