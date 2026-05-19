import { useEffect } from 'react';
import { useUI } from './store/useAppStore';
import { Sidebar } from './components/shared/Sidebar';
import { TopBar } from './components/shared/TopBar';

// Pages
import DashboardPage from './components/dashboard/DashboardPage';
import AssignmentsPage from './components/academic/AssignmentsPage';
import ExamsPage from './components/academic/ExamsPage';
import ClassesPage from './components/academic/ClassesPage';
import NotesPage from './components/academic/NotesPage';
import FlashcardsPage from './components/academic/FlashcardsPage';
import StudyRoomPage from './components/academic/StudyRoomPage';
import HabitTrackerPage from './components/life/HabitTrackerPage';
import { GoalsPage, SkillsPage, BookTrackerPage, SpendingPage, JournalPage } from './components/life/LifePages';
import {
  CollegeTrackerPage, EssayOrganizerPage, ScoreTrackerPage,
  AwardsPage, ScholarshipPage, ActivitiesPage
} from './components/college/CollegePages';
import StanfordPrepPage from './components/stanford/StanfordPrepPage';
import MissionControlPage from './components/mission/MissionControlPage';
import ProjectsPage from './components/projects/ProjectsPage';
import CalendarPage from './components/calendar/CalendarPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SearchPage from './components/shared/SearchPage';

const PAGES = {
  dashboard: DashboardPage,
  assignments: AssignmentsPage,
  exams: ExamsPage,
  classes: ClassesPage,
  notes: NotesPage,
  flashcards: FlashcardsPage,
  study: StudyRoomPage,
  habits: HabitTrackerPage,
  goals: GoalsPage,
  skills: SkillsPage,
  books: BookTrackerPage,
  spending: SpendingPage,
  journal: JournalPage,
  colleges: CollegeTrackerPage,
  essays: EssayOrganizerPage,
  scores: ScoreTrackerPage,
  awards: AwardsPage,
  scholarships: ScholarshipPage,
  activities: ActivitiesPage,
  stanford: StanfordPrepPage,
  mission: MissionControlPage,
  projects: ProjectsPage,
  calendar: CalendarPage,
  analytics: AnalyticsPage,
  search: SearchPage,
};

export default function App() {
  const { theme, activeSection, sidebarOpen } = useUI();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const PageComponent = PAGES[activeSection] || DashboardPage;

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'hsl(222,84%,4%)', color: '#e2e8f0',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(217,33%,18%); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: hsl(217,33%,25%); }
        button { font-family: inherit; }
        input, textarea, select { font-family: inherit; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        [data-theme="light"] { background: #fff; color: #0f172a; }
      `}</style>
      {sidebarOpen && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', animation: 'fadeIn .2s ease' }} key={activeSection}>
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
