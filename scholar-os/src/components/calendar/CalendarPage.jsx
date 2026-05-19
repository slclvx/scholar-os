// CalendarPage.jsx
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card, Tabs, SectionHeader } from '../shared/UI';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const assignments = useAppStore((s) => s.assignments);
  const exams = useAppStore((s) => s.exams);
  const scholarships = useAppStore((s) => s.scholarships);
  const colleges = useAppStore((s) => s.colleges);
  const essays = useAppStore((s) => s.essays);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Aggregate events
  const events = [
    ...assignments.filter((a) => a.due).map((a) => ({ date: a.due, title: a.title, type: 'assignment', color: '#6366f1', detail: a.class })),
    ...exams.filter((e) => e.date).map((e) => ({ date: e.date, title: e.title, type: 'exam', color: '#ec4899', detail: e.class })),
    ...scholarships.filter((s) => s.deadline).map((s) => ({ date: s.deadline, title: s.name, type: 'scholarship', color: '#22c55e', detail: '$' + (s.amount || 0) })),
    ...colleges.filter((c) => c.deadline).map((c) => ({ date: c.deadline, title: c.name, type: 'college', color: '#f97316', detail: c.tier })),
  ];

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({ day: d, dateStr: ds, events: events.filter((e) => e.date === ds) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <SectionHeader title="Calendar" subtitle="All your deadlines in one view" />
      <Tabs tabs={[{ id: 'month', label: 'Month' }, { id: 'agenda', label: 'Agenda' }]} active={view} onChange={setView} />

      {view === 'month' && (
        <Card padding={0}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid hsl(217,33%,15%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{MONTHS[month]} {year}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setDate(new Date(year, month - 1))} style={{ background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '5px 12px', color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' }}>←</button>
              <button onClick={() => setDate(new Date())} style={{ background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '5px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Today</button>
              <button onClick={() => setDate(new Date(year, month + 1))} style={{ background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '5px 12px', color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' }}>→</button>
            </div>
          </div>
          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid hsl(217,33%,15%)' }}>
            {DAYS.map((d) => (
              <div key={d} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#475569', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          {/* Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((c, i) => (
              <div key={i} style={{
                minHeight: 100, padding: 8, borderRight: '1px solid hsl(222,47%,6%)', borderBottom: '1px solid hsl(222,47%,6%)',
                background: c?.dateStr === todayStr ? 'hsl(217,33%,12%)' : 'transparent',
              }}>
                {c && (
                  <>
                    <div style={{ fontSize: 12, fontWeight: c.dateStr === todayStr ? 800 : 500, color: c.dateStr === todayStr ? '#a5b4fc' : '#64748b', marginBottom: 4 }}>{c.day}</div>
                    {c.events.slice(0, 3).map((e, idx) => (
                      <div key={idx} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: e.color + '22', color: e.color, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.title}
                      </div>
                    ))}
                    {c.events.length > 3 && <div style={{ fontSize: 10, color: '#374151' }}>+{c.events.length - 3} more</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === 'agenda' && (
        <Card>
          {events.length === 0 ? <div style={{ padding: '40px 20px', textAlign: 'center', color: '#374151' }}>No events</div> :
            events.sort((a, b) => a.date.localeCompare(b.date)).map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid hsl(222,47%,6%)' }}>
                <div style={{ width: 60, fontSize: 11, color: '#64748b' }}>{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div style={{ width: 3, background: e.color, borderRadius: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{e.type} · {e.detail}</div>
                </div>
              </div>
            ))}
        </Card>
      )}

      {/* Google Calendar info */}
      <div style={{ marginTop: 16, padding: '14px 18px', background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 20 }}>📅</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: 1.2, textTransform: 'uppercase' }}>Google Calendar Sync</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>Coming soon — connect your Google account to sync events both ways</div>
        </div>
      </div>
    </div>
  );
}
