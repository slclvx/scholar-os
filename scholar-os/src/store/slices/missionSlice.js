import { uid } from '../../utils/helpers';
import { todayStr } from '../../utils/dates';

export const createMissionSlice = (set) => ({
  missionGoals: [],
  projects: [],
  stanfordProgress: {}, // { [gradeLevel]: { [category]: { [itemIdx]: { done, notes, date } } } }

  // ── Mission Goals ──────────────────────────────────────────────────
  addMissionGoal: (data) => set((s) => ({
    missionGoals: [...s.missionGoals, {
      id: uid(), createdAt: todayStr(),
      status: 'Active', progress: 0, milestones: [], ...data
    }]
  })),
  updateMissionGoal: (id, data) => set((s) => ({
    missionGoals: s.missionGoals.map((g) => g.id === id ? { ...g, ...data } : g)
  })),
  deleteMissionGoal: (id) => set((s) => ({
    missionGoals: s.missionGoals.filter((g) => g.id !== id)
  })),
  addMilestone: (goalId, milestone) => set((s) => ({
    missionGoals: s.missionGoals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: [...(g.milestones || []), { id: uid(), status: 'Todo', ...milestone }] }
        : g
    )
  })),
  updateMilestone: (goalId, milestoneId, data) => set((s) => ({
    missionGoals: s.missionGoals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, ...data } : m) }
        : g
    )
  })),
  deleteMilestone: (goalId, milestoneId) => set((s) => ({
    missionGoals: s.missionGoals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
        : g
    )
  })),

  // ── Projects ───────────────────────────────────────────────────────
  addProject: (data) => set((s) => ({
    projects: [...s.projects, {
      id: uid(), createdAt: todayStr(),
      status: 'Planning', milestones: [], techStack: [], ...data
    }]
  })),
  updateProject: (id, data) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...data } : p)
  })),
  deleteProject: (id) => set((s) => ({
    projects: s.projects.filter((p) => p.id !== id)
  })),
  addProjectMilestone: (projectId, milestone) => set((s) => ({
    projects: s.projects.map((p) =>
      p.id === projectId
        ? { ...p, milestones: [...(p.milestones || []), { id: uid(), status: 'Todo', ...milestone }] }
        : p
    )
  })),
  updateProjectMilestone: (projectId, milestoneId, data) => set((s) => ({
    projects: s.projects.map((p) =>
      p.id === projectId
        ? { ...p, milestones: p.milestones.map((m) => m.id === milestoneId ? { ...m, ...data } : m) }
        : p
    )
  })),

  // ── Stanford Checklist ─────────────────────────────────────────────
  toggleStanfordItem: (grade, category, idx) => set((s) => {
    const key = `${grade}.${category}.${idx}`;
    const current = s.stanfordProgress[key];
    return {
      stanfordProgress: {
        ...s.stanfordProgress,
        [key]: current?.done
          ? { ...current, done: false }
          : { done: true, date: todayStr(), notes: current?.notes || '' }
      }
    };
  }),
  updateStanfordItemNotes: (grade, category, idx, notes) => set((s) => {
    const key = `${grade}.${category}.${idx}`;
    return {
      stanfordProgress: {
        ...s.stanfordProgress,
        [key]: { ...(s.stanfordProgress[key] || {}), notes }
      }
    };
  }),
});
