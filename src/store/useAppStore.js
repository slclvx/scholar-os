import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createAcademicSlice } from './slices/academicSlice';
import { createCollegeSlice } from './slices/collegeSlice';
import { createLifeSlice } from './slices/lifeSlice';
import { createMissionSlice } from './slices/missionSlice';
import { createUISlice } from './slices/uiSlice';

const DATA_KEYS = [
  'assignments','exams','classes','notes','flashcardDecks','flashcards','pomodoroSessions',
  'habits','habitLogs','goals','skills','books','spending','journal',
  'colleges','essays','scores','awards','activities','scholarships',
  'missionGoals','projects','stanfordProgress','theme',
];

export const useAppStore = create(
  devtools(
    persist(
      (...args) => ({
        ...createAcademicSlice(...args),
        ...createCollegeSlice(...args),
        ...createLifeSlice(...args),
        ...createMissionSlice(...args),
        ...createUISlice(...args),
      }),
      {
        name: 'scholar-os-v1',
        partialize: (state) =>
          DATA_KEYS.reduce((acc, k) => { acc[k] = state[k]; return acc; }, {}),
      }
    ),
    { name: 'ScholarOS' }
  )
);

// Convenience selector hooks
export const useAcademic = () => useAppStore((s) => ({
  assignments: s.assignments,
  exams: s.exams,
  classes: s.classes,
  notes: s.notes,
  flashcardDecks: s.flashcardDecks,
  flashcards: s.flashcards,
  pomodoroSessions: s.pomodoroSessions,
  addAssignment: s.addAssignment, updateAssignment: s.updateAssignment, deleteAssignment: s.deleteAssignment,
  addExam: s.addExam, updateExam: s.updateExam, deleteExam: s.deleteExam,
  addClass: s.addClass, updateClass: s.updateClass, deleteClass: s.deleteClass,
  addNote: s.addNote, updateNote: s.updateNote, deleteNote: s.deleteNote,
  addDeck: s.addDeck, updateDeck: s.updateDeck, deleteDeck: s.deleteDeck,
  addFlashcard: s.addFlashcard, updateFlashcard: s.updateFlashcard, deleteFlashcard: s.deleteFlashcard,
  logPomodoroSession: s.logPomodoroSession,
}));

export const useCollege = () => useAppStore((s) => ({
  colleges: s.colleges, essays: s.essays, scores: s.scores,
  awards: s.awards, activities: s.activities, scholarships: s.scholarships,
  addCollege: s.addCollege, updateCollege: s.updateCollege, deleteCollege: s.deleteCollege,
  addEssay: s.addEssay, updateEssay: s.updateEssay, deleteEssay: s.deleteEssay,
  addScore: s.addScore, updateScore: s.updateScore, deleteScore: s.deleteScore,
  addAward: s.addAward, updateAward: s.updateAward, deleteAward: s.deleteAward,
  addActivity: s.addActivity, updateActivity: s.updateActivity, deleteActivity: s.deleteActivity,
  addScholarship: s.addScholarship, updateScholarship: s.updateScholarship, deleteScholarship: s.deleteScholarship,
}));

export const useLife = () => useAppStore((s) => ({
  habits: s.habits, habitLogs: s.habitLogs, goals: s.goals,
  skills: s.skills, books: s.books, spending: s.spending, journal: s.journal,
  addHabit: s.addHabit, updateHabit: s.updateHabit, deleteHabit: s.deleteHabit, toggleHabitLog: s.toggleHabitLog,
  addGoal: s.addGoal, updateGoal: s.updateGoal, deleteGoal: s.deleteGoal,
  addSkill: s.addSkill, updateSkill: s.updateSkill, deleteSkill: s.deleteSkill,
  addBook: s.addBook, updateBook: s.updateBook, deleteBook: s.deleteBook,
  addSpending: s.addSpending, updateSpending: s.updateSpending, deleteSpending: s.deleteSpending,
  updateJournalEntry: s.updateJournalEntry,
}));

export const useMission = () => useAppStore((s) => ({
  missionGoals: s.missionGoals, projects: s.projects, stanfordProgress: s.stanfordProgress,
  addMissionGoal: s.addMissionGoal, updateMissionGoal: s.updateMissionGoal, deleteMissionGoal: s.deleteMissionGoal,
  addMilestone: s.addMilestone, updateMilestone: s.updateMilestone, deleteMilestone: s.deleteMilestone,
  addProject: s.addProject, updateProject: s.updateProject, deleteProject: s.deleteProject,
  addProjectMilestone: s.addProjectMilestone, updateProjectMilestone: s.updateProjectMilestone,
  toggleStanfordItem: s.toggleStanfordItem, updateStanfordItemNotes: s.updateStanfordItemNotes,
}));

export const useUI = () => useAppStore((s) => ({
  theme: s.theme, activeHub: s.activeHub, activeSection: s.activeSection,
  sidebarOpen: s.sidebarOpen, notifications: s.notifications, searchQuery: s.searchQuery,
  setTheme: s.setTheme, setActiveHub: s.setActiveHub, setActiveSection: s.setActiveSection,
  setSidebarOpen: s.setSidebarOpen, toggleSidebar: s.toggleSidebar, setSearchQuery: s.setSearchQuery,
  addNotification: s.addNotification, markNotificationRead: s.markNotificationRead,
  markAllRead: s.markAllRead, clearNotifications: s.clearNotifications,
}));
