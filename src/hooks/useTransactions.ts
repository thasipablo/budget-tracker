import { useState, useCallback } from 'react';
import {
  getTransactions,
  getTransactionsByType,
  getTransactionsByCategory,
  getRecentTransactions,
  insertTransaction,
  updateTransaction,
  deleteTransaction,
} from '../db/transactions';
import type { Transaction, TransactionType } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (opts?: { type?: TransactionType; categoryId?: number; limit?: number }) => {
      setLoading(true);
      try {
        let data: Transaction[];
        if (opts?.limit) {
          data = await getRecentTransactions(opts.limit);
        } else if (opts?.type) {
          data = await getTransactionsByType(opts.type);
        } else if (opts?.categoryId !== undefined) {
          data = await getTransactionsByCategory(opts.categoryId);
        } else {
          data = await getTransactions();
        }
        setTransactions(data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const add = useCallback(
    async (
      amount: number,
      type: TransactionType,
      categoryId: number,
      date: string,
      note?: string
    ) => {
      await insertTransaction(amount, type, categoryId, date, note);
      await load();
    },
    [load]
  );

  const update = useCallback(
    async (
      id: number,
      amount: number,
      type: TransactionType,
      categoryId: number,
      date: string,
      note?: string
    ) => {
      await updateTransaction(id, amount, type, categoryId, date, note);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteTransaction(id);
      await load();
    },
    [load]
  );

  return { transactions, loading, load, add, update, remove };
}
