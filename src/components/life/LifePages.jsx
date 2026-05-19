// LifePages — Goals, Skills, Books, Spending, Journal
import { useState } from 'react';
import { useLife } from '../../store/useAppStore';
import { GOAL_STATUSES, SPENDING_CATEGORIES, MOODS } from '../../utils/constants';
import { formatDisplay, todayStr } from '../../utils/dates';
import { sumBy, groupBy } from '../../utils/helpers';
import { Modal, FormField, Input, Textarea, Select, Btn, IconBtn, SectionHeader, Card, ProgressBar, RangeInput, StatusBadge, Empty } from '../shared/UI';

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useLife();
  const [form, setForm] = useState(null);
  const openAdd = () => setForm({ title: '', specific: '', measurable: '', achievable: '', relevant: '', timebound: '', progress: 0, status: 'Active', _new: true });
  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addGoal(d); } else updateGoal(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="SMART Goals" subtitle="Specific, Measurable, Achievable, Relevant, Time-bound" action={<Btn onClick={openAdd}>+ Add Goal</Btn>} />
      {goals.length === 0 ? <Empty icon="🎯" text="Set your first SMART goal" action={openAdd} /> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {goals.map((g) => (
            <Card key={g.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{g.title}</div>
                  <StatusBadge status={g.status} />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconBtn onClick={() => setForm({ ...g })}>✏️</IconBtn>
                  <IconBtn danger onClick={() => deleteGoal(g.id)}>🗑</IconBtn>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {[['S','Specific',g.specific],['M','Measurable',g.measurable],['A','Achievable',g.achievable],['R','Relevant',g.relevant],['T','Time-bound',g.timebound]].map(([abbr, label, val]) => (
                  <div key={abbr} style={{ background: 'hsl(222,84%,5%)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', marginBottom: 2 }}>{abbr}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{val || '—'}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title={form._new ? 'New Goal' : 'Edit Goal'} onClose={() => setForm(null)}>
          <FormField label="Goal Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Specific — What exactly?"><Input value={form.specific} onChange={(e) => setForm({ ...form, specific: e.target.value })} /></FormField>
            <FormField label="Measurable — How tracked?"><Input value={form.measurable} onChange={(e) => setForm({ ...form, measurable: e.target.value })} /></FormField>
            <FormField label="Achievable — Is it realistic?"><Input value={form.achievable} onChange={(e) => setForm({ ...form, achievable: e.target.value })} /></FormField>
            <FormField label="Relevant — Why it matters"><Input value={form.relevant} onChange={(e) => setForm({ ...form, relevant: e.target.value })} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Deadline"><Input type="date" value={form.timebound} onChange={(e) => setForm({ ...form, timebound: e.target.value })} /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{GOAL_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
          </div>
          <RangeInput label={`Progress: ${form.progress}%`} value={form.progress} onChange={(v) => setForm({ ...form, progress: v })} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// SkillsPage
export function SkillsPage() {
  const { skills, addSkill, updateSkill, deleteSkill } = useLife();
  const [form, setForm] = useState(null);
  const openAdd = () => setForm({ name: '', category: '', level: 0, notes: '', _new: true });
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addSkill(d); } else updateSkill(form.id, form);
    setForm(null);
  };
  const levelColor = (l) => l >= 70 ? '#22c55e' : l >= 40 ? '#6366f1' : '#f97316';
  const levelLabel = (l) => l >= 70 ? 'Advanced' : l >= 40 ? 'Proficient' : l >= 20 ? 'Developing' : 'Beginner';
  return (
    <div>
      <SectionHeader title="Skills Tracker" subtitle="Level up your abilities over time" action={<Btn onClick={openAdd}>+ Add Skill</Btn>} />
      {skills.length === 0 ? <Empty icon="🎨" text="Add your first skill" action={openAdd} /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {skills.map((s) => (
            <Card key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{s.name}</div>
                  {s.category && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.category}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconBtn onClick={() => setForm({ ...s })}>✏️</IconBtn>
                  <IconBtn danger onClick={() => deleteSkill(s.id)}>🗑</IconBtn>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{levelLabel(s.level)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: levelColor(s.level) }}>{s.level}%</span>
              </div>
              <ProgressBar value={s.level} color={levelColor(s.level)} height={8} />
              {s.notes && <div style={{ fontSize: 12, color: '#475569', marginTop: 8, fontStyle: 'italic' }}>→ {s.notes}</div>}
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title={form._new ? 'New Skill' : 'Edit Skill'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Skill Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Tech, Sports, Language..." /></FormField>
          </div>
          <RangeInput label={`Level: ${form.level}%`} value={form.level} onChange={(v) => setForm({ ...form, level: v })} />
          <FormField label="Next Steps"><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// BookTrackerPage
export function BookTrackerPage() {
  const { books, addBook, updateBook, deleteBook } = useLife();
  const [form, setForm] = useState(null);
  const [filter, setFilter] = useState('All');
  const BOOK_STATUSES = ['Want to Read', 'Reading', 'Completed'];
  const filtered = filter === 'All' ? books : books.filter((b) => b.status === filter);
  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addBook(d); } else updateBook(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Book Tracker" subtitle="Leaders are readers" action={
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', ...BOOK_STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${filter === s ? '#6366f1' : 'hsl(217,33%,15%)'}`, background: filter === s ? '#6366f1' : 'transparent', color: filter === s ? '#fff' : '#64748b', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>)}
          <Btn onClick={() => setForm({ title: '', author: '', status: 'Want to Read', rating: 0, notes: '', _new: true })}>+ Add</Btn>
        </div>
      } />
      {filtered.length === 0 ? <Empty icon="📖" text="No books yet — try adding Atomic Habits!" action={() => setForm({ title: '', author: '', status: 'Want to Read', rating: 0, notes: '', _new: true })} /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filtered.map((b) => (
            <Card key={b.id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 4 }}>
                <IconBtn onClick={() => setForm({ ...b })}>✏️</IconBtn>
                <IconBtn danger onClick={() => deleteBook(b.id)}>🗑</IconBtn>
              </div>
              <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{b.status}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, paddingRight: 40 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>by {b.author || '—'}</div>
              <div style={{ fontSize: 16 }}>{'★'.repeat(b.rating)}<span style={{ color: 'hsl(217,33%,20%)' }}>{'★'.repeat(5 - b.rating)}</span></div>
              {b.notes && <div style={{ fontSize: 12, color: '#475569', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>{b.notes}</div>}
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title={form._new ? 'Add Book' : 'Edit Book'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus /></FormField>
            <FormField label="Author"><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{BOOK_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
            <RangeInput label={`Rating: ${'★'.repeat(form.rating)}${'☆'.repeat(5-form.rating)}`} value={form.rating * 20} onChange={(v) => setForm({ ...form, rating: Math.round(v / 20) })} />
          </div>
          <FormField label="Notes"><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// SpendingPage

export function SpendingPage() {
  const { spending, addSpending, deleteSpending } = useLife();
  const [form, setForm] = useState(null);
  const total = sumBy(spending, 'amount');
  const byCat = groupBy(spending, 'category');
  const save = () => {
    if (!form.name?.trim() || !form.amount) return;
    const { _new, ...d } = form; addSpending({ ...d, amount: +d.amount }); setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Spending Tracker" subtitle="Stay mindful of your finances" action={<Btn onClick={() => setForm({ name: '', amount: '', category: 'Food', date: '', _new: true })}>+ Add Entry</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Total Tracked</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#f1f5f9' }}>${total.toFixed(2)}</div>
          <div style={{ marginTop: 16 }}>
            {Object.entries(byCat).map(([cat, items]) => {
              const s = sumBy(items, 'amount');
              return (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: '#64748b' }}>{cat}</span>
                    <span style={{ color: '#a5b4fc', fontWeight: 700 }}>${s.toFixed(2)}</span>
                  </div>
                  <ProgressBar value={s} max={total || 1} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card padding={0}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid hsl(217,33%,15%)', display: 'grid', gridTemplateColumns: '1fr 90px 80px 80px', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase' }}>
            <span>Item</span><span>Category</span><span>Date</span><span>Amount</span>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {spending.length === 0 ? <Empty icon="💳" text="No expenses yet" /> :
              spending.slice().reverse().map((s) => (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 80px', padding: '11px 16px', borderBottom: '1px solid hsl(222,47%,6%)', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#e2e8f0' }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{s.category}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{formatDisplay(s.date)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>${(+s.amount).toFixed(2)}</span>
                    <IconBtn danger onClick={() => deleteSpending(s.id)}>✕</IconBtn>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
      {form && (
        <Modal title="Add Expense" onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Item"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Amount ($)"><Input type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
            <FormField label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{SPENDING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></FormField>
            <FormField label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// JournalPage

export function JournalPage() {
  const { journal, updateJournalEntry } = useLife();
  const [selected, setSelected] = useState(todayStr());
  const entry = journal[selected] || { mood: 3, gratitude: '', highlights: '', reflections: '', tomorrow: '' };
  const upd = (field, val) => updateJournalEntry(selected, { [field]: val });
  const recentDates = Object.keys(journal).sort((a, b) => b.localeCompare(a)).slice(0, 10);
  const allDates = [...new Set([todayStr(), ...recentDates])];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, height: 'calc(100vh - 130px)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Entries</div>
        {allDates.map((d) => (
          <button key={d} onClick={() => setSelected(d)} style={{
            padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
            background: selected === d ? 'hsl(217,33%,14%)' : journal[d] ? 'hsl(222,47%,8%)' : 'transparent',
            border: `1px solid ${selected === d ? '#6366f1' : journal[d] ? 'hsl(217,33%,15%)' : 'transparent'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'inherit',
          }}>
            <div style={{ fontSize: 13, color: selected === d ? '#e2e8f0' : '#64748b' }}>
              {d === todayStr() ? 'Today' : new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            {journal[d] && <span style={{ fontSize: 14 }}>{MOODS[(journal[d].mood || 3) - 1]}</span>}
          </button>
        ))}
      </div>
      <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid hsl(217,33%,15%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
            {selected === todayStr() ? "Today's Entry" : new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => upd('mood', i + 1)} style={{
                fontSize: 20, background: entry.mood === i + 1 ? 'hsl(217,33%,15%)' : 'none',
                border: `1px solid ${entry.mood === i + 1 ? '#6366f1' : 'transparent'}`,
                borderRadius: 8, padding: '3px 7px', cursor: 'pointer',
                opacity: entry.mood === i + 1 ? 1 : 0.4, transition: 'all .15s',
              }}>{m}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {[
            ['gratitude', '🙏 Gratitude', 'What are you thankful for today?', 2],
            ['highlights', '⭐ Highlights', 'What went well?', 2],
            ['reflections', '🧠 Reflections', 'What did you learn or realize?', 3],
            ['tomorrow', '🎯 Tomorrow', "What's your #1 priority for tomorrow?", 1],
          ].map(([field, label, placeholder, rows]) => (
            <div key={field} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 8 }}>{label}</label>
              <textarea
                value={entry[field] || ''}
                onChange={(e) => upd(field, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                style={{ width: '100%', background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '10px 14px', color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'hsl(217,33%,15%)'}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
