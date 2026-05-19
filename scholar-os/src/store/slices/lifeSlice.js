import { uid } from '../../utils/helpers';
import { todayStr, toDateStr } from '../../utils/dates';

export const createLifeSlice = (set, get) => ({
  habits: [],
  habitLogs: {},       // { [habitId]: { [dateStr]: true } }
  goals: [],
  skills: [],
  books: [],
  spending: [],
  journal: {},         // { [dateStr]: { mood, gratitude, highlights, reflections, tomorrow } }

  // ── Habits ─────────────────────────────────────────────────────────
  addHabit: (data) => set((s) => ({
    habits: [...s.habits, {
      id: uid(), streak: 0, color: '#6366f1', icon: '⭐', ...data
    }]
  })),
  updateHabit: (id, data) => set((s) => ({
    habits: s.habits.map((h) => h.id === id ? { ...h, ...data } : h)
  })),
  deleteHabit: (id) => set((s) => {
    const { [id]: _, ...remainingLogs } = s.habitLogs;
    return {
      habits: s.habits.filter((h) => h.id !== id),
      habitLogs: remainingLogs,
    };
  }),
  toggleHabitLog: (habitId, dateStr) => set((s) => {
    const logs = { ...s.habitLogs };
    const habitLog = { ...(logs[habitId] || {}) };

    if (habitLog[dateStr]) delete habitLog[dateStr];
    else habitLog[dateStr] = true;
    logs[habitId] = habitLog;

    // Recalculate streak without stale closure
    let streak = 0;
    const d = new Date();
    while (streak < 366) {
      const ds = toDateStr(d);
      if (!habitLog[ds]) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }

    return {
      habitLogs: logs,
      habits: s.habits.map((h) =>
        h.id === habitId ? { ...h, streak } : h
      ),
    };
  }),

  // ── Goals ──────────────────────────────────────────────────────────
  addGoal: (data) => set((s) => ({
    goals: [...s.goals, {
      id: uid(), progress: 0, status: 'Active',
      createdAt: todayStr(), ...data
    }]
  })),
  updateGoal: (id, data) => set((s) => ({
    goals: s.goals.map((g) => g.id === id ? { ...g, ...data } : g)
  })),
  deleteGoal: (id) => set((s) => ({
    goals: s.goals.filter((g) => g.id !== id)
  })),

  // ── Skills ─────────────────────────────────────────────────────────
  addSkill: (data) => set((s) => ({
    skills: [...s.skills, { id: uid(), level: 0, ...data }]
  })),
  updateSkill: (id, data) => set((s) => ({
    skills: s.skills.map((sk) => sk.id === id ? { ...sk, ...data } : sk)
  })),
  deleteSkill: (id) => set((s) => ({
    skills: s.skills.filter((sk) => sk.id !== id)
  })),

  // ── Books ──────────────────────────────────────────────────────────
  addBook: (data) => set((s) => ({
    books: [...s.books, {
      id: uid(), status: 'Want to Read', rating: 0,
      createdAt: todayStr(), ...data
    }]
  })),
  updateBook: (id, data) => set((s) => ({
    books: s.books.map((b) => b.id === id ? { ...b, ...data } : b)
  })),
  deleteBook: (id) => set((s) => ({
    books: s.books.filter((b) => b.id !== id)
  })),

  // ── Spending ───────────────────────────────────────────────────────
  addSpending: (data) => set((s) => ({
    spending: [...s.spending, {
      id: uid(), date: todayStr(), category: 'Other', ...data
    }]
  })),
  updateSpending: (id, data) => set((s) => ({
    spending: s.spending.map((e) => e.id === id ? { ...e, ...data } : e)
  })),
  deleteSpending: (id) => set((s) => ({
    spending: s.spending.filter((e) => e.id !== id)
  })),

  // ── Journal ────────────────────────────────────────────────────────
  updateJournalEntry: (dateStr, data) => set((s) => ({
    journal: {
      ...s.journal,
      [dateStr]: { ...(s.journal[dateStr] || { mood: 3 }), ...data }
    }
  })),
});
