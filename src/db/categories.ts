import { getDatabase } from './database';
import type { Category, TransactionType } from '../types';

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>(
    'SELECT * FROM categories WHERE project_id IS NULL ORDER BY type, name'
  );
}

export async function getCategoriesByType(type: TransactionType): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>(
    'SELECT * FROM categories WHERE type = ? AND project_id IS NULL ORDER BY name',
    [type]
  );
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
}

/** Global expense categories + project-scoped categories for a given project. */
export async function getCategoriesForProject(projectId: number): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>(
    `SELECT * FROM categories
     WHERE type = 'expense'
       AND (project_id IS NULL OR project_id = ?)
     ORDER BY CASE WHEN project_id IS NULL THEN 1 ELSE 0 END, name`,
    [projectId]
  );
}

/** Only project-scoped categories for a given project. */
export async function getCategoriesByProjectId(projectId: number): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>(
    'SELECT * FROM categories WHERE project_id = ? ORDER BY name',
    [projectId]
  );
}

export async function insertCategory(
  name: string,
  type: TransactionType,
  color: string,
  icon: string,
  projectId?: number
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO categories (name, type, color, icon, project_id) VALUES (?, ?, ?, ?, ?)',
    [name, type, color, icon, projectId ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateCategory(
  id: number,
  name: string,
  color: string,
  icon: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ?',
    [name, color, icon, id]
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}
