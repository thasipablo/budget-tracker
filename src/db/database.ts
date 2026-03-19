import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('budget.db');
  return db;
}

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Drinks', color: '#FF6B6B', icon: '🍔' },
  { name: 'Transport', color: '#FF9F43', icon: '🚗' },
  { name: 'Shopping', color: '#A29BFE', icon: '🛍️' },
  { name: 'Health', color: '#55EFC4', icon: '💊' },
  { name: 'Entertainment', color: '#FD79A8', icon: '🎬' },
  { name: 'Bills', color: '#636E72', icon: '📄' },
  { name: 'Other', color: '#B2BEC3', icon: '📦' },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', color: '#00B894', icon: '💼' },
  { name: 'Freelance', color: '#0984E3', icon: '💻' },
  { name: 'Investment', color: '#6C5CE7', icon: '📈' },
  { name: 'Gift', color: '#FDCB6E', icon: '🎁' },
  { name: 'Other', color: '#74B9FF', icon: '💰' },
];

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL,
      type  TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      color TEXT NOT NULL DEFAULT '#6C63FF',
      icon  TEXT NOT NULL DEFAULT '💰'
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      amount      REAL NOT NULL,
      type        TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category_id INTEGER NOT NULL,
      date        TEXT NOT NULL,
      note        TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  // Seed default categories if needed
  const count = await database.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM categories'
  );
  if (!count || count.c === 0) {
    for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
      await database.runAsync(
        'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
        [cat.name, 'expense', cat.color, cat.icon]
      );
    }
    for (const cat of DEFAULT_INCOME_CATEGORIES) {
      await database.runAsync(
        'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
        [cat.name, 'income', cat.color, cat.icon]
      );
    }
  }
}
