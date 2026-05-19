import { uid } from '../../utils/helpers';
import { todayStr } from '../../utils/dates';

export const createCollegeSlice = (set) => ({
  colleges: [],
  essays: [],
  scores: [],
  awards: [],
  activities: [],
  scholarships: [],

  // ── Colleges ───────────────────────────────────────────────────────
  addCollege: (data) => set((s) => ({
    colleges: [...s.colleges, {
      id: uid(), createdAt: todayStr(),
      status: 'Researching', tier: 'Target', notes: '', ...data
    }]
  })),
  updateCollege: (id, data) => set((s) => ({
    colleges: s.colleges.map((c) => c.id === id ? { ...c, ...data } : c)
  })),
  deleteCollege: (id) => set((s) => ({
    colleges: s.colleges.filter((c) => c.id !== id)
  })),

  // ── Essays ─────────────────────────────────────────────────────────
  addEssay: (data) => set((s) => ({
    essays: [...s.essays, {
      id: uid(), createdAt: todayStr(),
      status: 'Not Started', wordLimit: 650, words: 0, ...data
    }]
  })),
  updateEssay: (id, data) => set((s) => ({
    essays: s.essays.map((e) => e.id === id ? { ...e, ...data } : e)
  })),
  deleteEssay: (id) => set((s) => ({
    essays: s.essays.filter((e) => e.id !== id)
  })),

  // ── Scores ─────────────────────────────────────────────────────────
  addScore: (data) => set((s) => ({
    scores: [...s.scores, { id: uid(), createdAt: todayStr(), ...data }]
  })),
  updateScore: (id, data) => set((s) => ({
    scores: s.scores.map((sc) => sc.id === id ? { ...sc, ...data } : sc)
  })),
  deleteScore: (id) => set((s) => ({
    scores: s.scores.filter((sc) => sc.id !== id)
  })),

  // ── Awards ─────────────────────────────────────────────────────────
  addAward: (data) => set((s) => ({
    awards: [...s.awards, { id: uid(), createdAt: todayStr(), level: 'School', ...data }]
  })),
  updateAward: (id, data) => set((s) => ({
    awards: s.awards.map((a) => a.id === id ? { ...a, ...data } : a)
  })),
  deleteAward: (id) => set((s) => ({
    awards: s.awards.filter((a) => a.id !== id)
  })),

  // ── Activities ─────────────────────────────────────────────────────
  addActivity: (data) => set((s) => ({
    activities: [...s.activities, {
      id: uid(), createdAt: todayStr(),
      hoursPerWeek: 0, weeksPerYear: 0, isLeadership: false,
      gradesParticipated: [], description: '', ...data
    }]
  })),
  updateActivity: (id, data) => set((s) => ({
    activities: s.activities.map((a) => a.id === id ? { ...a, ...data } : a)
  })),
  deleteActivity: (id) => set((s) => ({
    activities: s.activities.filter((a) => a.id !== id)
  })),

  // ── Scholarships ───────────────────────────────────────────────────
  addScholarship: (data) => set((s) => ({
    scholarships: [...s.scholarships, {
      id: uid(), createdAt: todayStr(),
      status: 'Researching', ...data
    }]
  })),
  updateScholarship: (id, data) => set((s) => ({
    scholarships: s.scholarships.map((sc) => sc.id === id ? { ...sc, ...data } : sc)
  })),
  deleteScholarship: (id) => set((s) => ({
    scholarships: s.scholarships.filter((sc) => sc.id !== id)
  })),
});
