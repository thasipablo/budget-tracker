export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
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
