import { useState, useCallback } from 'react';
import {
  getCategories,
  getCategoriesByType,
  insertCategory,
  updateCategory,
  deleteCategory,
} from '../db/categories';
import type { Category, TransactionType } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (type?: TransactionType) => {
    setLoading(true);
    try {
      const data = type ? await getCategoriesByType(type) : await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(
    async (name: string, type: TransactionType, color: string, icon: string) => {
      await insertCategory(name, type, color, icon);
      await load();
    },
    [load]
  );

  const update = useCallback(
    async (id: number, name: string, color: string, icon: string) => {
      await updateCategory(id, name, color, icon);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteCategory(id);
      await load();
    },
    [load]
  );

  return { categories, loading, load, add, update, remove };
}
