import { useState } from 'react';
import { useMission } from '../../store/useAppStore';
import { formatDisplay, daysUntil } from '../../utils/dates';
import { Modal, FormField, Input, Textarea, Select, Btn, IconBtn, SectionHeader, Card, ProgressBar, RangeInput, Empty } from '../shared/UI';

export default function MissionControlPage() {
  const { missionGoals, addMissionGoal, updateMissionGoal, deleteMissionGoal,
    addMilestone, updateMilestone, deleteMilestone } = useMission();

  const [form, setForm] = useState(null);
  const [activeGoal, setActiveGoal] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState(null);

  const TYPES = ['Life Vision', 'Annual', 'Quarterly', 'Career', 'Education', 'Personal'];

  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addMissionGoal(d); } else updateMissionGoal(form.id, form);
    setForm(null);
  };

  const goal = missionGoals.find((g) => g.id === activeGoal);

  if (goal) {
    const completed = goal.milestones?.filter((m) => m.status === 'Done').length || 0;
    const total = goal.milestones?.length || 0;
    return (
      <div>
        <button onClick={() => setActiveGoal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 12 }}>← All Goals</button>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{goal.type || 'Mission Goal'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: -.5 }}>{goal.title}</h2>
          {goal.description && <p style={{ fontSize: 14, color: '#64748b', margin: '6px 0 0', lineHeight: 1.6 }}>{goal.description}</p>}
        </div>

        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase' }}>Roadmap Progress</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{completed}/{total} milestones</div>
          </div>
          <ProgressBar value={completed} max={total || 1} color="#f97316" />
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Milestones</h3>
          <Btn onClick={() => setMilestoneForm({ title: '', dueDate: '', status: 'Todo', _new: true })}>+ Add Milestone</Btn>
        </div>

        {!goal.milestones?.length ? (
          <Empty icon="🚩" text="No milestones yet" action={() => setMilestoneForm({ title: '', dueDate: '', status: 'Todo', _new: true })} actionLabel="+ Add Milestone" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goal.milestones.map((m) => {
              const days = daysUntil(m.dueDate);
              return (
                <Card key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
                  <button onClick={() => updateMilestone(goal.id, m.id, { status: m.status === 'Done' ? 'Todo' : 'Done' })} style={{
                    width: 20, height: 20, borderRadius: 5,
                    border: `1.5px solid ${m.status === 'Done' ? '#22c55e' : '#2a2d3e'}`,
                    background: m.status === 'Done' ? '#22c55e22' : 'transparent',
                    cursor: 'pointer', fontSize: 12, color: '#22c55e', fontFamily: 'inherit', fontWeight: 700,
                  }}>{m.status === 'Done' ? '✓' : ''}</button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: m.status === 'Done' ? '#475569' : '#e2e8f0', textDecoration: m.status === 'Done' ? 'line-through' : 'none' }}>{m.title}</div>
                    {m.dueDate && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{formatDisplay(m.dueDate)} {days !== null && `· ${days < 0 ? Math.abs(days) + 'd late' : days === 0 ? 'today' : days + 'd'}`}</div>}
                  </div>
                  <IconBtn danger onClick={() => deleteMilestone(goal.id, m.id)}>🗑</IconBtn>
                </Card>
              );
            })}
          </div>
        )}

        {milestoneForm && (
          <Modal title="New Milestone" onClose={() => setMilestoneForm(null)}>
            <FormField label="Milestone"><Input value={milestoneForm.title} onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} autoFocus /></FormField>
            <FormField label="Target Date"><Input type="date" value={milestoneForm.dueDate} onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })} /></FormField>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Btn onClick={() => {
                if (!milestoneForm.title.trim()) return;
                const { _new, ...d } = milestoneForm;
                addMilestone(goal.id, d);
                setMilestoneForm(null);
              }} style={{ flex: 1 }}>Add</Btn>
              <Btn variant="ghost" onClick={() => setMilestoneForm(null)}>Cancel</Btn>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // Examples
  const EXAMPLES = [
    { icon: '🎓', title: 'Stanford Admission Roadmap', desc: 'Plan every step from now to acceptance' },
    { icon: '💻', title: 'Computer Science Mastery', desc: 'Build deep technical expertise' },
    { icon: '🚀', title: 'Launch Startup Idea', desc: 'From concept to first user' },
    { icon: '🏆', title: 'National Competition', desc: 'Train for competition glory' },
  ];

  return (
    <div>
      <SectionHeader title="Mission Control" subtitle="Long-term strategic planning and milestone tracking" action={<Btn onClick={() => setForm({ title: '', type: 'Annual', description: '', _new: true })}>+ New Mission</Btn>} />

      {missionGoals.length === 0 ? (
        <>
          <Empty icon="🚀" text="Plan your most important life missions" action={() => setForm({ title: '', type: 'Annual', description: '', _new: true })} actionLabel="+ Create First Mission" />
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>Try these examples</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {EXAMPLES.map((ex) => (
                <Card key={ex.title} style={{ cursor: 'pointer' }} onClick={() => setForm({ title: ex.title, type: 'Annual', description: ex.desc, _new: true })}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{ex.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{ex.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{ex.desc}</div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {missionGoals.map((g) => {
            const completed = g.milestones?.filter((m) => m.status === 'Done').length || 0;
            const total = g.milestones?.length || 0;
            const pct = total ? Math.round((completed / total) * 100) : 0;
            return (
              <Card key={g.id} accent="#f97316" style={{ cursor: 'pointer' }} onClick={() => setActiveGoal(g.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316', letterSpacing: 1, textTransform: 'uppercase' }}>{g.type || 'Mission'}</span>
                  <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <IconBtn onClick={() => setForm({ ...g })}>✏️</IconBtn>
                    <IconBtn danger onClick={() => deleteMissionGoal(g.id)}>🗑</IconBtn>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{g.title}</div>
                {g.description && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>{g.description}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{total} milestones</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316' }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color="#f97316" />
              </Card>
            );
          })}
        </div>
      )}

      {form && (
        <Modal title={form._new ? 'New Mission' : 'Edit Mission'} onClose={() => setForm(null)}>
          <FormField label="Mission Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Stanford Admission Roadmap" autoFocus /></FormField>
          <FormField label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</Select></FormField>
          <FormField label="Description / Why this matters"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}
