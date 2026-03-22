export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  project_id?: number | null;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  category_id: number;
  date: string; // ISO 8601
  note?: string;
  // joined
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

// Project management

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project {
  id: number;
  name: string;
  description?: string;
  budget?: number;
  color: string;
  icon: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  // joined aggregates
  total_spent?: number;
  total_funded?: number;
  phase_count?: number;
}

export interface Phase {
  id: number;
  project_id: number;
  name: string;
  budget?: number;
  order_index: number;
  start_date?: string;
  end_date?: string;
  // joined aggregates
  total_spent?: number;
  expense_count?: number;
}

export interface ProjectExpense {
  id: number;
  phase_id: number;
  project_id: number;
  amount: number;
  category_id?: number;
  date: string;
  note?: string;
  // joined
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface ProjectTransfer {
  id: number;
  project_id: number;
  transaction_id: number;
  amount: number;
  date: string;
  note?: string;
}
