import { uid } from '../../utils/helpers';
import { todayStr, toDateStr } from '../../utils/dates';
import { SM2_DEFAULTS } from '../../utils/constants';

export const createAcademicSlice = (set) => ({
  assignments: [],
  exams: [],
  classes: [],
  notes: [],
  flashcardDecks: [],
  flashcards: [],
  pomodoroSessions: [],

  // ── Assignments ────────────────────────────────────────────────────
  addAssignment: (data) => set((s) => ({
    assignments: [...s.assignments, {
      id: uid(), createdAt: todayStr(),
      status: 'Not Started', priority: 'Medium', notes: '', ...data
    }]
  })),
  updateAssignment: (id, data) => set((s) => ({
    assignments: s.assignments.map((a) => a.id === id ? { ...a, ...data } : a)
  })),
  deleteAssignment: (id) => set((s) => ({
    assignments: s.assignments.filter((a) => a.id !== id)
  })),

  // ── Exams ──────────────────────────────────────────────────────────
  addExam: (data) => set((s) => ({
    exams: [...s.exams, {
      id: uid(), createdAt: todayStr(),
      status: 'Upcoming', studyHours: 0, topics: '', ...data
    }]
  })),
  updateExam: (id, data) => set((s) => ({
    exams: s.exams.map((e) => e.id === id ? { ...e, ...data } : e)
  })),
  deleteExam: (id) => set((s) => ({
    exams: s.exams.filter((e) => e.id !== id)
  })),

  // ── Classes ────────────────────────────────────────────────────────
  addClass: (data) => set((s) => ({
    classes: [...s.classes, { id: uid(), color: '#6366f1', grade: '', ...data }]
  })),
  updateClass: (id, data) => set((s) => ({
    classes: s.classes.map((c) => c.id === id ? { ...c, ...data } : c)
  })),
  deleteClass: (id) => set((s) => ({
    classes: s.classes.filter((c) => c.id !== id)
  })),

  // ── Notes ──────────────────────────────────────────────────────────
  addNote: (data) => set((s) => ({
    notes: [{
      id: uid(), createdAt: todayStr(), updatedAt: todayStr(),
      content: '', tags: [], ...data
    }, ...s.notes]
  })),
  updateNote: (id, data) => set((s) => ({
    notes: s.notes.map((n) =>
      n.id === id ? { ...n, ...data, updatedAt: todayStr() } : n
    )
  })),
  deleteNote: (id) => set((s) => ({
    notes: s.notes.filter((n) => n.id !== id)
  })),

  // ── Flashcard Decks ────────────────────────────────────────────────
  addDeck: (data) => set((s) => ({
    flashcardDecks: [...s.flashcardDecks, { id: uid(), createdAt: todayStr(), ...data }]
  })),
  updateDeck: (id, data) => set((s) => ({
    flashcardDecks: s.flashcardDecks.map((d) => d.id === id ? { ...d, ...data } : d)
  })),
  deleteDeck: (id) => set((s) => ({
    flashcardDecks: s.flashcardDecks.filter((d) => d.id !== id),
    flashcards: s.flashcards.filter((f) => f.deckId !== id),
  })),

  // ── Flashcards ─────────────────────────────────────────────────────
  addFlashcard: (data) => set((s) => ({
    flashcards: [...s.flashcards, {
      id: uid(), createdAt: todayStr(),
      next_review: todayStr(), ...SM2_DEFAULTS, ...data
    }]
  })),
  updateFlashcard: (id, data) => set((s) => ({
    flashcards: s.flashcards.map((f) => f.id === id ? { ...f, ...data } : f)
  })),
  deleteFlashcard: (id) => set((s) => ({
    flashcards: s.flashcards.filter((f) => f.id !== id)
  })),

  // ── Pomodoro Sessions ──────────────────────────────────────────────
  logPomodoroSession: (data) => set((s) => ({
    pomodoroSessions: [...s.pomodoroSessions, {
      id: uid(), completedAt: new Date().toISOString(), ...data
    }]
  })),
});
