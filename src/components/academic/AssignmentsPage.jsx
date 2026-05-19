import { useState } from 'react';
import { useAcademic } from '../../store/useAppStore';
import { daysUntil, formatDisplay, urgencyColor, todayStr } from '../../utils/dates';
import { ASSIGNMENT_STATUSES, PRIORITIES } from '../../utils/constants';
import { sortByDate } from '../../utils/dates';
import {
  Modal, FormField, Input, Textarea, Select, Btn, IconBtn,
  SectionHeader, Table, TableRow, StatusBadge, PriorityBadge,
  Empty, FilterPills,
} from '../shared/UI';

const COLS = '32px 1fr 130px 100px 80px 80px 70px';

export default function AssignmentsPage() {
  const { assignments, classes, addAssignment, updateAssignment, deleteAssignment } = useAcademic();
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(null);

  const filtered = filter === 'All' ? assignments : assignments.filter((a) => a.status === filter);
  const sorted = sortByDate(filtered, 'due');

  const openAdd = () => setForm({ title: '', class: classes[0]?.name || '', due: '', status: 'Not Started', priority: 'Medium', notes: '', _new: true });
  const openEdit = (a) => setForm({ ...a });
  const close = () => setForm(null);

  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) {
      const { _new, ...data } = form;
      addAssignment(data);
    } else {
      updateAssignment(form.id, form);
    }
    close();
  };

  const toggle = (a) => updateAssignment(a.id, { status: a.status === 'Done' ? 'Not Started' : 'Done' });

  return (
    <div>
      <SectionHeader
        title="Assignments"
        subtitle="Track every task and deadline across all classes"
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <FilterPills options={['All', ...ASSIGNMENT_STATUSES]} active={filter} onChange={setFilter} />
            <Btn onClick={openAdd}>+ Add</Btn>
          </div>
        }
      />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Total', val: assignments.length, color: '#64748b' },
          { label: 'In Progress', val: assignments.filter((a) => a.status === 'In Progress').length, color: '#6366f1' },
          { label: 'Overdue', val: assignments.filter((a) => a.status !== 'Done' && a.due && daysUntil(a.due) < 0).length, color: '#ef4444' },
          { label: 'Done', val: assignments.filter((a) => a.status === 'Done').length, color: '#22c55e' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '8px 14px', background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 10, fontSize: 13 }}>
            <span style={{ color: s.color, fontWeight: 700 }}>{s.val}</span>
            <span style={{ color: '#475569', marginLeft: 5 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <Table columns={COLS}>
        <><span /><span>Task</span><span>Class</span><span>Due</span><span>Priority</span><span>Status</span><span /></>
        {sorted.length === 0
          ? <Empty icon="📄" text="No assignments yet" action={openAdd} actionLabel="+ Add Assignment" />
          : sorted.map((a) => {
            const days = daysUntil(a.due);
            return (
              <TableRow key={a.id} columns={COLS}>
                <div
                  onClick={() => toggle(a)}
                  style={{
                    width: 18, height: 18, border: `1.5px solid ${a.status === 'Done' ? '#22c55e' : '#2a2d3e'}`,
                    borderRadius: 4, background: a.status === 'Done' ? '#22c55e22' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 11, color: '#22c55e', flexShrink: 0,
                  }}
                >
                  {a.status === 'Done' ? '✓' : ''}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: a.status === 'Done' ? '#475569' : '#e2e8f0', textDecoration: a.status === 'Done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </div>
                  {a.notes && <div style={{ fontSize: 11, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes}</div>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{a.class || '—'}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(days) }}>
                  {a.due ? formatDisplay(a.due) : '—'}
                  {days !== null && <span style={{ display: 'block', fontSize: 10, color: urgencyColor(days) }}>
                    {days < 0 ? `${Math.abs(days)}d late` : days === 0 ? 'today' : `${days}d`}
                  </span>}
                </div>
                <PriorityBadge priority={a.priority} />
                <StatusBadge status={a.status} />
                <div style={{ display: 'flex', gap: 2 }}>
                  <IconBtn onClick={() => openEdit(a)}>✏️</IconBtn>
                  <IconBtn danger onClick={() => deleteAssignment(a.id)}>🗑</IconBtn>
                </div>
              </TableRow>
            );
          })}
      </Table>

      {form && (
        <Modal title={form._new ? 'New Assignment' : 'Edit Assignment'} onClose={close}>
          <FormField label="Title">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Chapter 5 Problem Set" autoFocus />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Class">
              <Select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}>
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="">Other</option>
              </Select>
            </FormField>
            <FormField label="Due Date">
              <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
            </FormField>
            <FormField label="Priority">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {ASSIGNMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField label="Notes">
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn onClick={save} style={{ flex: 1 }}>Save</Btn>
            <Btn variant="ghost" onClick={close}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
