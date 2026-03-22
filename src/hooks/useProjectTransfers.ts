import { useState, useCallback } from 'react';
import {
  getTransfersByProject,
  insertProjectTransfer,
  deleteProjectTransfer,
} from '../db/projectTransfers';
import type { ProjectTransfer } from '../types';

export function useProjectTransfers(projectId: number) {
  const [transfers, setTransfers] = useState<ProjectTransfer[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransfersByProject(projectId);
      setTransfers(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const add = useCallback(
    async (amount: number, date: string, note?: string) => {
      await insertProjectTransfer(projectId, amount, date, note);
      await load();
    },
    [projectId, load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteProjectTransfer(id);
      await load();
    },
    [load]
  );

  return { transfers, loading, load, add, remove };
}
