import { useState } from 'react';
import { useLife } from '../../store/useAppStore';
import { getLast7Days, getWeekDayLabel, todayStr } from '../../utils/dates';
import { HABIT_ICONS } from '../../utils/constants';
import { Modal, FormField, Input, Btn, IconBtn, SectionHeader, Card, Empty } from '../shared/UI';

const COLORS = ['#6366f1','#ec4899','#14b8a6','#f97316','#22c55e','#eab308','#ef4444','#a855f7'];

export default function HabitTrackerPage() {
  const { habits, habitLogs, addHabit, updateHabit, deleteHabit, toggleHabitLog } = useLife();
  const [form, setForm] = useState(null);
  const today = todayStr();
  const last7 = getLast7Days();

  const openAdd = () => setForm({ name: '', icon: '⭐', color: '#6366f1', _new: true });
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addHabit(d); }
    else updateHabit(form.id, form);
    setForm(null);
  };

  const totalToday = habits.filter((h) => habitLogs[h.id]?.[today]).length;
  const pct = habits.length ? Math.round((totalToday / habits.length) * 100) : 0;

  return (
    <div>
      <SectionHeader
        title="Habit Tracker"
        subtitle="Small daily actions compound into extraordinary results — Atomic Habits"
        action={<Btn onClick={openAdd}>+ Add Habit</Btn>}
      />

      {/* Today's overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: pct === 100 ? '#22c55e' : '#6366f1' }}>{pct}%</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>{totalToday}/{habits.length} today</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 10 }}>7-Day Completion</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 50 }}>
            {last7.map((day) => {
              const done = habits.filter((h) => habitLogs[h.id]?.[day]).length;
              const h = habits.length ? done / habits.length : 0;
              return (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', background: h > 0 ? '#6366f1' : 'hsl(217,33%,15%)',
                    borderRadius: 4, height: `${Math.max(h * 40, h > 0 ? 6 : 4)}px`,
                    opacity: day === today ? 1 : 0.7,
                    transition: 'height .3s',
                  }} />
                  <div style={{ fontSize: 9, color: day === today ? '#a5b4fc' : '#374151', fontWeight: day === today ? 700 : 400 }}>
                    {getWeekDayLabel(day).slice(0, 1)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {habits.length === 0 ? (
        <Empty icon="🔥" text="Add your first habit!" action={openAdd} actionLabel="+ Add Habit" />
      ) : (
        <div style={{ background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px repeat(7, 34px) 60px',
            gap: 4, padding: '10px 16px',
            borderBottom: '1px solid hsl(217,33%,15%)',
            fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase',
          }}>
            <span>Habit</span>
            <span>Streak</span>
            {last7.map((day) => (
              <span key={day} style={{ textAlign: 'center', color: day === today ? '#a5b4fc' : '#475569' }}>
                {getWeekDayLabel(day).slice(0, 1)}<br />{new Date(day + 'T00:00:00').getDate()}
              </span>
            ))}
            <span />
          </div>

          {habits.map((h) => (
            <div key={h.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px repeat(7, 34px) 60px',
              gap: 4, padding: '11px 16px', alignItems: 'center',
              borderBottom: '1px solid hsl(222,47%,6%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{h.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{h.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 13 }}>🔥</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: h.streak > 0 ? '#f97316' : '#475569' }}>
                  {h.streak}d
                </span>
              </div>
              {last7.map((day) => {
                const done = !!habitLogs[h.id]?.[day];
                return (
                  <div key={day} style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => toggleHabitLog(h.id, day)}
                      style={{
                        width: 22, height: 22, borderRadius: 5,
                        background: done ? h.color : 'transparent',
                        border: `1.5px solid ${done ? h.color : '#2a2d3e'}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700,
                        transition: 'all .15s',
                      }}
                    >
                      {done ? '✓' : ''}
                    </button>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: 2 }}>
                <IconBtn onClick={() => setForm({ ...h })}>✏️</IconBtn>
                <IconBtn danger onClick={() => deleteHabit(h.id)}>🗑</IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Atomic Habits insight */}
      <div style={{ marginTop: 16, padding: '14px 18px', background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1.2, textTransform: 'uppercase' }}>Atomic Habits</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>A 1% improvement every day results in being 37x better over one year. Focus on the system, not the outcome.</div>
        </div>
      </div>

      {form && (
        <Modal title={form._new ? 'New Habit' : 'Edit Habit'} onClose={() => setForm(null)}>
          <FormField label="Habit Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Read 20 min, Exercise, No phone before bed" autoFocus /></FormField>
          <FormField label="Icon">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HABIT_ICONS.map((ic) => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })} style={{
                  fontSize: 20, background: form.icon === ic ? 'hsl(217,33%,15%)' : 'transparent',
                  border: `1px solid ${form.icon === ic ? '#6366f1' : 'hsl(217,33%,15%)'}`,
                  borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
                }}>{ic}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Color">
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} style={{
                  width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`,
                }} />
              ))}
            </div>
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}
