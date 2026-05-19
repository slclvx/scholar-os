import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useSearch(query) {
  const s = useAppStore();

  return useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (q.length < 2) return [];
    const results = [];

    const push = (type, id, title, sub, section) => {
      if (title?.toLowerCase().includes(q) || sub?.toLowerCase().includes(q)) {
        results.push({ type, id, title, sub, section });
      }
    };

    s.assignments.forEach((a) => push('Assignment', a.id, a.title, a.class, 'assignments'));
    s.exams.forEach((e) => push('Exam', e.id, e.title, e.class, 'exams'));
    s.classes.forEach((c) => push('Class', c.id, c.name, c.teacher, 'classes'));
    s.notes.forEach((n) => {
      if (n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)) {
        results.push({ type: 'Note', id: n.id, title: n.title, sub: n.class, section: 'notes' });
      }
    });
    s.flashcardDecks.forEach((d) => push('Flashcard Deck', d.id, d.name, d.subject, 'flashcards'));
    s.goals.forEach((g) => push('Goal', g.id, g.title, g.status, 'goals'));
    s.habits.forEach((h) => push('Habit', h.id, h.name, `${h.streak} day streak`, 'habits'));
    s.books.forEach((b) => push('Book', b.id, b.title, b.author, 'books'));
    s.colleges.forEach((c) => push('College', c.id, c.name, c.tier, 'colleges'));
    s.essays.forEach((e) => push('Essay', e.id, e.title, e.college, 'essays'));
    s.scholarships.forEach((sc) => push('Scholarship', sc.id, sc.name, sc.status, 'scholarships'));
    s.activities.forEach((a) => push('Activity', a.id, a.name, a.role, 'activities'));
    s.awards.forEach((a) => push('Award', a.id, a.title, a.level, 'awards'));
    s.projects.forEach((p) => push('Project', p.id, p.name, p.status, 'projects'));
    s.missionGoals.forEach((g) => push('Mission Goal', g.id, g.title, g.status, 'mission'));
    s.skills.forEach((sk) => push('Skill', sk.id, sk.name, sk.category, 'skills'));

    return results.slice(0, 25);
  }, [query, s]);
}
