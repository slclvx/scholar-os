import { useState } from 'react';
import { useAcademic } from '../../store/useAppStore';
import { CLASS_COLORS } from '../../utils/constants';
import { Modal, FormField, Input, Select, Btn, IconBtn, SectionHeader, Empty } from '../shared/UI';

export default function ClassesPage() {
  const { classes, assignments, exams, addClass, updateClass, deleteClass } = useAcademic();
  const [form, setForm] = useState(null);

  const openAdd = () => setForm({ name: '', teacher: '', period: '', grade: '', color: CLASS_COLORS[classes.length % CLASS_COLORS.length], _new: true });
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addClass(d); }
    else updateClass(form.id, form);
    setForm(null);
  };

  return (
    <div>
      <SectionHeader
        title="Classes"
        subtitle="Manage your schedule and track grades"
        action={<Btn onClick={openAdd}>+ Add Class</Btn>}
      />

      {classes.length === 0 ? (
        <Empty icon="📚" text="No classes added yet" action={openAdd} actionLabel="+ Add Class" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {classes.map((c) => {
            const classAssign = assignments.filter((a) => a.class === c.name);
            const classExams = exams.filter((e) => e.class === c.name);
            const pending = classAssign.filter((a) => a.status !== 'Done').length;
            return (
              <div key={c.id} style={{
                background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
                borderRadius: 14, padding: 20, borderTop: `3px solid ${c.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, marginTop: 3 }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <IconBtn onClick={() => setForm({ ...c })}>✏️</IconBtn>
                    <IconBtn danger onClick={() => deleteClass(c.id)}>🗑</IconBtn>
                  </div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                  {c.teacher && `${c.teacher} · `}{c.period && `Period ${c.period}`}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.grade || '—'}</div>
                    <div style={{ fontSize: 11, color: '#374151', marginTop: 2 }}>current grade</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{pending} pending</div>
                    <div style={{ fontSize: 12, color: '#374151' }}>{classExams.length} exams</div>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={openAdd} style={{
            background: 'transparent', border: '2px dashed hsl(217,33%,15%)',
            borderRadius: 14, padding: 20, cursor: 'pointer',
            color: '#374151', fontSize: 28, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 160, transition: 'all .15s',
          }}>+</button>
        </div>
      )}

      {form && (
        <Modal title={form._new ? 'New Class' : 'Edit Class'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Class Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Teacher"><Input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} /></FormField>
            <FormField label="Period / Block"><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></FormField>
            <FormField label="Current Grade"><Input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="A, B+, 94%" /></FormField>
          </div>
          <FormField label="Color">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {CLASS_COLORS.map((col) => (
                <button key={col} onClick={() => setForm({ ...form, color: col })} style={{
                  width: 28, height: 28, borderRadius: '50%', background: col, border: `3px solid ${form.color === col ? '#fff' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all .15s',
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
