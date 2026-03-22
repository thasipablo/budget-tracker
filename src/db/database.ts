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
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      type       TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      color      TEXT NOT NULL DEFAULT '#6C63FF',
      icon       TEXT NOT NULL DEFAULT '💰',
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT,
      budget      REAL,
      color       TEXT NOT NULL DEFAULT '#007AFF',
      icon        TEXT NOT NULL DEFAULT '🏗️',
      status      TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
      start_date  TEXT,
      end_date    TEXT,
      created_at  TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS phases (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id  INTEGER NOT NULL,
      name        TEXT NOT NULL,
      budget      REAL,
      order_index INTEGER NOT NULL DEFAULT 0,
      start_date  TEXT,
      end_date    TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id    INTEGER NOT NULL,
      project_id  INTEGER NOT NULL,
      amount      REAL NOT NULL,
      category_id INTEGER,
      date        TEXT NOT NULL,
      note        TEXT,
      FOREIGN KEY (phase_id)    REFERENCES phases(id)      ON DELETE CASCADE,
      FOREIGN KEY (project_id)  REFERENCES projects(id)   ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS project_transfers (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id     INTEGER NOT NULL,
      transaction_id INTEGER NOT NULL,
      amount         REAL NOT NULL,
      date           TEXT NOT NULL,
      note           TEXT,
      FOREIGN KEY (project_id)     REFERENCES projects(id)     ON DELETE CASCADE,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
    );
  `);

  // Migration: add project_id column to categories for existing installs
  const catCols = await database.getAllAsync<{ name: string }>('PRAGMA table_info(categories)');
  if (!catCols.find((c) => c.name === 'project_id')) {
    await database.execAsync(
      'ALTER TABLE categories ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE'
    );
  }

  // Seed default global categories for fresh installs
  const count = await database.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM categories WHERE project_id IS NULL'
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
    await database.runAsync(
      'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
      ['Project Funding', 'expense', '#5856D6', '🏗️']
    );
  }

  // Ensure "Project Funding" system category exists for existing installs
  const fundingCat = await database.getFirstAsync<{ id: number }>(
    "SELECT id FROM categories WHERE name = 'Project Funding' AND project_id IS NULL AND type = 'expense'"
  );
  if (!fundingCat) {
    await database.runAsync(
      'INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)',
      ['Project Funding', 'expense', '#5856D6', '🏗️']
    );
  }
}
