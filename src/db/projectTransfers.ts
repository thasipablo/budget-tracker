import { getDatabase } from './database';
import { insertTransaction } from './transactions';
import type { ProjectTransfer } from '../types';

export async function getTransfersByProject(projectId: number): Promise<ProjectTransfer[]> {
  const db = await getDatabase();
  return db.getAllAsync<ProjectTransfer>(
    'SELECT * FROM project_transfers WHERE project_id = ? ORDER BY date DESC',
    [projectId]
  );
}

export async function insertProjectTransfer(
  projectId: number,
  amount: number,
  date: string,
  note?: string
): Promise<number> {
  const db = await getDatabase();

  const fundingCat = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM categories WHERE name = 'Project Funding' AND project_id IS NULL AND type = 'expense' LIMIT 1"
  );
  if (!fundingCat) throw new Error('Project Funding category not found');

  const transactionId = await insertTransaction(
    amount,
    'expense',
    fundingCat.id,
    date,
    note ?? undefined
  );

  const result = await db.runAsync(
    'INSERT INTO project_transfers (project_id, transaction_id, amount, date, note) VALUES (?, ?, ?, ?, ?)',
    [projectId, transactionId, amount, date, note ?? null]
  );
  return result.lastInsertRowId;
}

export async function deleteProjectTransfer(id: number): Promise<void> {
  const db = await getDatabase();
  const transfer = await db.getFirstAsync<{ transaction_id: number }>(
    'SELECT transaction_id FROM project_transfers WHERE id = ?',
    [id]
  );
  if (transfer) {
    // Deleting the transaction cascades to delete the project_transfer row
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [transfer.transaction_id]);
  }
}
