import { useState, useCallback } from 'react';
import { getSummary } from '../db/transactions';
import type { Summary } from '../types';

export function useSummary() {
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const { totalIncome, totalExpenses } = await getSummary(startDate, endDate);
      setSummary({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { summary, loading, load };
}
