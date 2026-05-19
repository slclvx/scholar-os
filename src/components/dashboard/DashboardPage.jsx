import { useAppStore } from '../../store/useAppStore';
import { daysUntil, urgencyColor, todayStr, formatDisplay, greet } from '../../utils/dates';
import { sortByDate } from '../../utils/dates';
import { Card, StatCard, ProgressBar } from '../shared/UI';
import { LiveNowCard } from './LiveNowCard';

export default function DashboardPage() {
  const assignments = useAppStore((s) => s.assignments);
  const exams = useAppStore((s) => s.exams);
  const classes = useAppStore((s) => s.classes);
  const habits = useAppStore((s) => s.habits);
  const habitLogs = useAppStore((s) => s.habitLogs);
  const goals = useAppStore((s) => s.goals);
  const pomodoroSessions = useAppStore((s) => s.pomodoroSessions);

  const today = todayStr();
  const upcoming = sortByDate(assignments.filter((a) => a.status !== 'Done'), 'due').slice(0, 6);
  const todayHabits = habits.map((h) => ({ ...h, done: !!habitLogs[h.id]?.[today] }));
  const habitsToday = todayHabits.filter((h) => h.done).length;
  const dueToday = assignments.filter((a) => a.status !== 'Done' && a.due === today).length;

  const todayPom = pomodoroSessions.filter((s) => s.completedAt?.startsWith(today)).length;
  const focusHours = Math.round((todayPom * 25) / 60 * 10) / 10;

  const weeklyHabitPct = habits.length === 0 ? 0 : Math.round(
    habits.reduce((sum, h) => {
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      });
      const done = last7.filter((day) => habitLogs[h.id]?.[day]).length;
      return sum + done / 7;
    }, 0) / habits.length * 100
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: -.5 }}>
          Good {greet()}, Scholar 👋
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, margin: '4px 0 0' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Live Now */}
      <LiveNowCard />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard icon="📄" value={dueToday} label="Due today" color="#f97316" />
        <StatCard icon="🔥" value={`${habitsToday}/${habits.length}`} label="Habits today" color="#22c55e" />
        <StatCard icon="🎯" value={goals.filter((g) => g.status === 'Active').length} label="Active goals" color="#6366f1" />
        <StatCard icon="⏱" value={`${focusHours}h`} label="Focus today" color="#ec4899" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Upcoming deadlines */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>
            Upcoming Deadlines
          </div>
          {upcoming.length === 0 ? (
            <div style={{ color: '#374151', fontSize: 14, padding: '16px 0', textAlign: 'center' }}>All caught up! 🎉</div>
          ) : upcoming.map((a) => {
            const days = daysUntil(a.due);
            const color = urgencyColor(days);
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid hsl(222,47%,6%)' }}>
                <div style={{ width: 3, height: 36, background: color, borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{a.class || '—'}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
                  {days === null ? 'No date' : days < 0 ? `${Math.abs(days)}d late` : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                </div>
              </div>
            );
          })}
        </Card>

        {/* Today's habits */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 14 }}>
            Today's Habits
          </div>
          <div style={{ marginBottom: 14 }}>
            <ProgressBar value={habitsToday} max={habits.length || 1} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#475569' }}>{habitsToday} of {habits.length}</span>
              <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700 }}>{weeklyHabitPct}% this week</span>
            </div>
          </div>
          {todayHabits.slice(0, 7).map((h) => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: h.done ? h.color : 'transparent',
                border: `1.5px solid ${h.done ? h.color : '#2a2d3e'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#fff', fontWeight: 700,
              }}>
                {h.done ? '✓' : ''}
              </div>
              <span style={{
                fontSize: 13, color: h.done ? '#64748b' : '#e2e8f0',
                textDecoration: h.done ? 'line-through' : 'none',
              }}>
                {h.icon} {h.name}
              </span>
              {h.streak > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#f97316' }}>🔥{h.streak}</span>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Goals progress */}
      {goals.filter((g) => g.status === 'Active').length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Active Goals</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {goals.filter((g) => g.status === 'Active').slice(0, 3).map((g) => (
              <div key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{g.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Classes quick view */}
      {classes.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Classes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {classes.slice(0, 8).map((c) => (
              <div key={c.id} style={{
                padding: '10px 14px', background: 'hsl(222,84%,5%)', borderRadius: 10,
                borderLeft: `3px solid ${c.color}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.grade || '—'}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Atomic Habits quote */}
      <div style={{
        padding: '16px 20px', background: 'linear-gradient(135deg, hsl(222,47%,7%), hsl(222,47%,9%))',
        border: '1px solid hsl(217,33%,15%)', borderRadius: 12, borderLeft: '3px solid #6366f1',
      }}>
        <div style={{ fontSize: 13, color: '#a5b4fc', fontStyle: 'italic', lineHeight: 1.7 }}>
          "You do not rise to the level of your goals. You fall to the level of your systems."
        </div>
        <div style={{ fontSize: 10, color: '#1f2937', marginTop: 6, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
          — James Clear, Atomic Habits
        </div>
      </div>
    </div>
  );
}
