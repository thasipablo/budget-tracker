import { getDatabase } from './database';
import type { Project, ProjectStatus } from '../types';

const AGGREGATES = `
  COALESCE((SELECT SUM(pe.amount) FROM project_expenses pe WHERE pe.project_id = p.id), 0) AS total_spent,
  COALESCE((SELECT SUM(pt.amount) FROM project_transfers pt WHERE pt.project_id = p.id), 0) AS total_funded,
  (SELECT COUNT(*) FROM phases ph WHERE ph.project_id = p.id) AS phase_count
`;

export async function getAllProjects(status?: ProjectStatus): Promise<Project[]> {
  const db = await getDatabase();
  if (status) {
    return db.getAllAsync<Project>(
      `SELECT p.*, ${AGGREGATES} FROM projects p WHERE p.status = ? ORDER BY p.created_at DESC`,
      [status]
    );
  }
  return db.getAllAsync<Project>(
    `SELECT p.*, ${AGGREGATES} FROM projects p ORDER BY p.created_at DESC`
  );
}

export async function getProjectById(id: number): Promise<Project | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Project>(
    `SELECT p.*, ${AGGREGATES} FROM projects p WHERE p.id = ?`,
    [id]
  );
}

export async function insertProject(
  name: string,
  color: string,
  icon: string,
  description?: string,
  budget?: number,
  start_date?: string,
  end_date?: string
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO projects (name, description, budget, color, icon, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description ?? null, budget ?? null, color, icon, start_date ?? null, end_date ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateProject(
  id: number,
  name: string,
  color: string,
  icon: string,
  status: ProjectStatus,
  description?: string,
  budget?: number,
  start_date?: string,
  end_date?: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE projects SET name = ?, description = ?, budget = ?, color = ?, icon = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?',
    [name, description ?? null, budget ?? null, color, icon, status, start_date ?? null, end_date ?? null, id]
  );
}

export async function deleteProject(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM projects WHERE id = ?', [id]);
}
