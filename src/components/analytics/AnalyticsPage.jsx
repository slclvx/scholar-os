import { useAppStore } from '../../store/useAppStore';
import { getLast30Days, getLast7Days, todayStr } from '../../utils/dates';
import { Card, SectionHeader, ProgressBar } from '../shared/UI';
import { sumBy } from '../../utils/helpers';

export default function AnalyticsPage() {
  const assignments = useAppStore((s) => s.assignments);
  const exams = useAppStore((s) => s.exams);
  const habits = useAppStore((s) => s.habits);
  const habitLogs = useAppStore((s) => s.habitLogs);
  const pomodoroSessions = useAppStore((s) => s.pomodoroSessions);
  const goals = useAppStore((s) => s.goals);
  const scholarships = useAppStore((s) => s.scholarships);
  const colleges = useAppStore((s) => s.colleges);

  const total = assignments.length;
  const done = assignments.filter((a) => a.status === 'Done').length;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  // Habit consistency
  const last30 = getLast30Days();
  const habitConsistency = habits.length === 0 ? 0 : Math.round(
    habits.reduce((sum, h) => {
      const d = last30.filter((day) => habitLogs[h.id]?.[day]).length;
      return sum + (d / 30);
    }, 0) / habits.length * 100
  );

  // Focus time
  const totalSessions = pomodoroSessions.length;
  const totalFocusHours = Math.round(totalSessions * 25 / 60 * 10) / 10;
  const todayFocus = pomodoroSessions.filter((s) => s.completedAt?.startsWith(todayStr())).length;

  // Heatmap data (last 90 days)
  const heatmapDays = Array.from({ length: 91 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (90 - i));
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  // Scholarship totals
  const scholarshipsWon = sumBy(scholarships.filter((s) => s.status === 'Won'), 'amount');
  const scholarshipsApplied = scholarships.filter((s) => ['Applied','Won'].includes(s.status)).length;

  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Insights into your performance and habits" />

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Completion Rate</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>{completionRate}%</div>
          <ProgressBar value={completionRate} color="#22c55e" />
          <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>{done} of {total} assignments</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Habit Consistency</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginBottom: 8 }}>{habitConsistency}%</div>
          <ProgressBar value={habitConsistency} />
          <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>Last 30 days</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Focus Hours</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f97316' }}>{totalFocusHours}h</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 12 }}>{totalSessions} pomodoros · {todayFocus} today</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Scholarships Won</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ec4899' }}>${scholarshipsWon.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 12 }}>{scholarshipsApplied} applied</div>
        </Card>
      </div>

      {/* Habit heatmap */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Habit Heatmap — Last 90 Days</div>
        {habits.length === 0 ? (
          <div style={{ color: '#374151', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>Add habits to see your heatmap</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 3, maxWidth: 600 }}>
            {heatmapDays.map((day) => {
              const completed = habits.filter((h) => habitLogs[h.id]?.[day]).length;
              const intensity = habits.length ? completed / habits.length : 0;
              const bg = intensity === 0 ? 'hsl(217,33%,15%)'
                : intensity < 0.34 ? '#16213e'
                : intensity < 0.67 ? '#4f52d3'
                : intensity < 1 ? '#6366f1'
                : '#a5b4fc';
              return (
                <div
                  key={day}
                  title={`${day}: ${completed}/${habits.length}`}
                  style={{ aspectRatio: '1', background: bg, borderRadius: 3, transition: 'transform .1s' }}
                />
              );
            })}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 11, color: '#475569' }}>
          Less
          <div style={{ width: 12, height: 12, background: 'hsl(217,33%,15%)', borderRadius: 3 }} />
          <div style={{ width: 12, height: 12, background: '#16213e', borderRadius: 3 }} />
          <div style={{ width: 12, height: 12, background: '#4f52d3', borderRadius: 3 }} />
          <div style={{ width: 12, height: 12, background: '#6366f1', borderRadius: 3 }} />
          <div style={{ width: 12, height: 12, background: '#a5b4fc', borderRadius: 3 }} />
          More
        </div>
      </Card>

      {/* Focus chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Pomodoro Sessions — Last 7 Days</div>
          {(() => {
            const days = getLast7Days();
            const counts = days.map((d) => pomodoroSessions.filter((s) => s.completedAt?.startsWith(d)).length);
            const max = Math.max(...counts, 1);
            return (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                {days.map((d, i) => (
                  <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 11, color: counts[i] > 0 ? '#f97316' : '#374151', fontWeight: 700 }}>{counts[i] || ''}</div>
                    <div style={{
                      width: '100%', background: counts[i] > 0 ? 'linear-gradient(180deg, #f97316, #ea580c)' : 'hsl(217,33%,15%)',
                      borderRadius: 6, height: `${Math.max((counts[i] / max) * 90, counts[i] > 0 ? 8 : 4)}px`,
                      transition: 'height .3s',
                    }} />
                    <div style={{ fontSize: 10, color: d === todayStr() ? '#a5b4fc' : '#475569', fontWeight: d === todayStr() ? 700 : 400 }}>{new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Application Progress</div>
          {(() => {
            const total = colleges.length;
            const applied = colleges.filter((c) => ['Applied','Accepted','Rejected','Waitlisted','Enrolled'].includes(c.status)).length;
            const accepted = colleges.filter((c) => ['Accepted','Enrolled'].includes(c.status)).length;
            return (
              <div>
                {[
                  { label: 'Total Schools', val: total, color: '#6366f1' },
                  { label: 'Applied', val: applied, color: '#f97316' },
                  { label: 'Accepted', val: accepted, color: '#22c55e' },
                ].map((s) => (
                  <div key={s.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: '#64748b' }}>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: 700 }}>{s.val}</span>
                    </div>
                    <ProgressBar value={s.val} max={Math.max(total, 1)} color={s.color} />
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      </div>
    </div>
  );
}
