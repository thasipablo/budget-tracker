import { useState, useCallback } from 'react';
import {
  getExpensesByPhase,
  insertProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
} from '../db/projectExpenses';
import type { ProjectExpense } from '../types';

export function useProjectExpenses(phaseId: number) {
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpensesByPhase(phaseId);
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  }, [phaseId]);

  const add = useCallback(
    async (projectId: number, amount: number, date: string, categoryId?: number, note?: string) => {
      await insertProjectExpense(phaseId, projectId, amount, date, categoryId, note);
      await load();
    },
    [phaseId, load]
  );

  const update = useCallback(
    async (id: number, amount: number, date: string, categoryId?: number, note?: string) => {
      await updateProjectExpense(id, amount, date, categoryId, note);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteProjectExpense(id);
      await load();
    },
    [load]
  );

  return { expenses, loading, load, add, update, remove };
}
