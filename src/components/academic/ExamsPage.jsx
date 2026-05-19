// ExamsPage.jsx
import { useState } from 'react';
import { useAcademic } from '../../store/useAppStore';
import { daysUntil, formatDisplay, urgencyColor } from '../../utils/dates';
import { EXAM_STATUSES } from '../../utils/constants';
import { Modal, FormField, Input, Textarea, Select, Btn, IconBtn, SectionHeader, Table, TableRow, StatusBadge, Empty } from '../shared/UI';

const COLS = '1fr 140px 110px 80px 80px 70px';

export default function ExamsPage() {
  const { exams, classes, addExam, updateExam, deleteExam } = useAcademic();
  const [form, setForm] = useState(null);
  const openAdd = () => setForm({ title: '', class: classes[0]?.name || '', date: '', studyHours: 0, topics: '', status: 'Upcoming', _new: true });
  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addExam(d); }
    else updateExam(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Exams" subtitle="Plan and track upcoming tests" action={<Btn onClick={openAdd}>+ Add Exam</Btn>} />
      <Table columns={COLS}>
        <><span>Exam</span><span>Class</span><span>Date</span><span>Study Hrs</span><span>Status</span><span /></>
        {exams.length === 0 ? <Empty icon="📜" text="No exams tracked yet" action={openAdd} /> :
          exams.map((e) => {
            const days = daysUntil(e.date);
            return (
              <TableRow key={e.id} columns={COLS}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{e.title}</div>
                  {e.topics && <div style={{ fontSize: 11, color: '#64748b' }}>{e.topics}</div>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{e.class}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(days) }}>
                  {e.date ? formatDisplay(e.date) : '—'}
                  {days !== null && <span style={{ display: 'block', fontSize: 10 }}>{days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'today' : `${days}d`}</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc' }}>{e.studyHours}h</div>
                <StatusBadge status={e.status} />
                <div style={{ display: 'flex', gap: 2 }}>
                  <IconBtn onClick={() => setForm({ ...e })}>✏️</IconBtn>
                  <IconBtn danger onClick={() => deleteExam(e.id)}>🗑</IconBtn>
                </div>
              </TableRow>
            );
          })}
      </Table>
      {form && (
        <Modal title={form._new ? 'New Exam' : 'Edit Exam'} onClose={() => setForm(null)}>
          <FormField label="Exam Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Class"><Select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}>{classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}</Select></FormField>
            <FormField label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
            <FormField label="Study Hours Planned"><Input type="number" min={0} value={form.studyHours} onChange={(e) => setForm({ ...form, studyHours: +e.target.value })} /></FormField>
          </div>
          <FormField label="Topics to Review"><Textarea rows={2} value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} /></FormField>
          <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{EXAM_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}
