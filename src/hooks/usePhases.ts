import { useState, useCallback } from 'react';
import { getPhasesByProject, insertPhase, updatePhase, deletePhase, swapPhaseOrder } from '../db/phases';
import type { Phase } from '../types';

export function usePhases(projectId: number) {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPhasesByProject(projectId);
      setPhases(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const add = useCallback(
    async (name: string, budget?: number, start_date?: string, end_date?: string) => {
      await insertPhase(projectId, name, budget, start_date, end_date);
      await load();
    },
    [projectId, load]
  );

  const update = useCallback(
    async (id: number, name: string, budget?: number, start_date?: string, end_date?: string) => {
      await updatePhase(id, name, budget, start_date, end_date);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deletePhase(id);
      await load();
    },
    [load]
  );

  const reorder = useCallback(
    async (idA: number, idB: number) => {
      await swapPhaseOrder(idA, idB);
      await load();
    },
    [load]
  );

  return { phases, loading, load, add, update, remove, reorder };
}
