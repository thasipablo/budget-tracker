import { getDatabase } from './database';
import type { Transaction, TransactionType } from '../types';

const SELECT_WITH_CATEGORY = `
  SELECT t.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
  FROM transactions t
  LEFT JOIN categories c ON t.category_id = c.id
`;

export async function getTransactions(): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(
    `${SELECT_WITH_CATEGORY} ORDER BY t.date DESC`
  );
}

export async function getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(
    `${SELECT_WITH_CATEGORY} WHERE t.type = ? ORDER BY t.date DESC`,
    [type]
  );
}

export async function getTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(
    `${SELECT_WITH_CATEGORY} WHERE t.category_id = ? ORDER BY t.date DESC`,
    [categoryId]
  );
}

export async function getRecentTransactions(limit: number): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(
    `${SELECT_WITH_CATEGORY} ORDER BY t.date DESC LIMIT ?`,
    [limit]
  );
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Transaction>(
    `${SELECT_WITH_CATEGORY} WHERE t.id = ?`,
    [id]
  );
}

export async function insertTransaction(
  amount: number,
  type: TransactionType,
  categoryId: number,
  date: string,
  note?: string
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO transactions (amount, type, category_id, date, note) VALUES (?, ?, ?, ?, ?)',
    [amount, type, categoryId, date, note ?? null]
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(
  id: number,
  amount: number,
  type: TransactionType,
  categoryId: number,
  date: string,
  note?: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE transactions SET amount = ?, type = ?, category_id = ?, date = ?, note = ? WHERE id = ?',
    [amount, type, categoryId, date, note ?? null, id]
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function getSummary(
  startDate?: string,
  endDate?: string
): Promise<{ totalIncome: number; totalExpenses: number }> {
  const db = await getDatabase();
  let query = 'SELECT type, SUM(amount) as total FROM transactions';
  const params: string[] = [];
  if (startDate && endDate) {
    query += ' WHERE date >= ? AND date <= ?';
    params.push(startDate, endDate);
  }
  query += ' GROUP BY type';
  const rows = await db.getAllAsync<{ type: string; total: number }>(query, params);
  const totalIncome = rows.find((r) => r.type === 'income')?.total ?? 0;
  const totalExpenses = rows.find((r) => r.type === 'expense')?.total ?? 0;
  return { totalIncome, totalExpenses };
}

export async function getExpensesByCategory(
  startDate?: string,
  endDate?: string
): Promise<{ category_id: number; category_name: string; category_color: string; total: number }[]> {
  const db = await getDatabase();
  let query = `
    SELECT t.category_id, c.name AS category_name, c.color AS category_color, SUM(t.amount) AS total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
  `;
  const params: string[] = [];
  if (startDate && endDate) {
    query += ' AND t.date >= ? AND t.date <= ?';
    params.push(startDate, endDate);
  }
  query += ' GROUP BY t.category_id ORDER BY total DESC';
  return db.getAllAsync(query, params);
}

export async function getMonthlyTotals(months: number): Promise<
  { month: string; income: number; expense: number }[]
> {
  const db = await getDatabase();
  const query = `
    SELECT
      strftime('%Y-%m', date) AS month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE date >= date('now', '-' || ? || ' months')
    GROUP BY month
    ORDER BY month ASC
  `;
  return db.getAllAsync(query, [months.toString()]);
}
