import { useState, useCallback } from 'react';
import { getAllProjects, insertProject, updateProject, deleteProject } from '../db/projects';
import type { Project, ProjectStatus } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (status?: ProjectStatus) => {
    setLoading(true);
    try {
      const data = await getAllProjects(status);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(
    async (
      name: string,
      color: string,
      icon: string,
      description?: string,
      budget?: number,
      start_date?: string,
      end_date?: string
    ) => {
      await insertProject(name, color, icon, description, budget, start_date, end_date);
      await load();
    },
    [load]
  );

  const update = useCallback(
    async (
      id: number,
      name: string,
      color: string,
      icon: string,
      status: ProjectStatus,
      description?: string,
      budget?: number,
      start_date?: string,
      end_date?: string
    ) => {
      await updateProject(id, name, color, icon, status, description, budget, start_date, end_date);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteProject(id);
      await load();
    },
    [load]
  );

  return { projects, loading, load, add, update, remove };
}
