import { useState } from 'react';
import { useCollege } from '../../store/useAppStore';
import { formatDisplay, daysUntil } from '../../utils/dates';
import { COLLEGE_TIERS, COLLEGE_STATUSES, ESSAY_STATUSES, TEST_TYPES, AWARD_LEVELS, AWARD_COLORS, TIER_COLORS, ACTIVITY_CATEGORIES } from '../../utils/constants';
import { Modal, FormField, Input, Textarea, Select, Btn, IconBtn, SectionHeader, Card, Table, TableRow, StatusBadge, Empty, ProgressBar, RangeInput } from '../shared/UI';
import { sumBy } from '../../utils/helpers';

// ── College Tracker ────────────────────────────────────────────────────────────
export function CollegeTrackerPage() {
  const { colleges, addCollege, updateCollege, deleteCollege } = useCollege();
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addCollege(d); } else updateCollege(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="College Tracker" subtitle="Organize your entire application journey" action={<Btn onClick={() => setForm({ name: '', tier: 'Target', status: 'Researching', deadline: '', notes: '', _new: true })}>+ Add College</Btn>} />
      {COLLEGE_TIERS.map((tier) => {
        const tierColleges = colleges.filter((c) => c.tier === tier);
        return (
          <div key={tier} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: TIER_COLORS[tier] }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase' }}>{tier} ({tierColleges.length})</span>
            </div>
            {tierColleges.length === 0 ? (
              <div style={{ padding: '14px 0', fontSize: 13, color: '#374151' }}>No {tier.toLowerCase()} schools added yet</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {tierColleges.map((c) => (
                  <Card key={c.id} accent={TIER_COLORS[tier]}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <StatusBadge status={c.status} />
                      <div style={{ display: 'flex', gap: 4 }}>
                        <IconBtn onClick={() => setForm({ ...c })}>✏️</IconBtn>
                        <IconBtn danger onClick={() => deleteCollege(c.id)}>🗑</IconBtn>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{c.name}</div>
                    {c.deadline && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Due: {formatDisplay(c.deadline)}</div>}
                    {c.notes && <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{c.notes}</div>}
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {form && (
        <Modal title={form._new ? 'Add College' : 'Edit College'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="College Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Tier"><Select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>{COLLEGE_TIERS.map((t) => <option key={t}>{t}</option>)}</Select></FormField>
            <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{COLLEGE_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
            <FormField label="Application Deadline"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></FormField>
          </div>
          <FormField label="Notes"><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── Essay Organizer ────────────────────────────────────────────────────────────
export function EssayOrganizerPage() {
  const { essays, colleges, addEssay, updateEssay, deleteEssay } = useCollege();
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addEssay(d); } else updateEssay(form.id, form);
    setForm(null);
  };
  const COLS = '1.5fr 130px 110px 80px 70px 60px';
  return (
    <div>
      <SectionHeader title="Essay Organizer" subtitle="Track and craft every application essay" action={<Btn onClick={() => setForm({ title: '', college: colleges[0]?.name || '', prompt: '', wordLimit: 650, words: 0, status: 'Not Started', _new: true })}>+ Add Essay</Btn>} />
      <Table columns={COLS}>
        <><span>Essay</span><span>College</span><span>Status</span><span>Words</span><span>Limit</span><span /></>
        {essays.length === 0 ? <Empty icon="✍️" text="No essays tracked yet" action={() => setForm({ title: 'Common App Essay', college: '', prompt: '', wordLimit: 650, words: 0, status: 'Not Started', _new: true })} /> :
          essays.map((e) => (
            <TableRow key={e.id} columns={COLS}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{e.title}</div>
                {e.prompt && <div style={{ fontSize: 11, color: '#475569' }}>{e.prompt.slice(0, 60)}…</div>}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{e.college || '—'}</div>
              <StatusBadge status={e.status} />
              <div style={{ fontSize: 13, fontWeight: 700, color: e.words >= e.wordLimit * 0.9 ? '#22c55e' : '#a5b4fc' }}>{e.words}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{e.wordLimit}</div>
              <div style={{ display: 'flex', gap: 2 }}><IconBtn onClick={() => setForm({ ...e })}>✏️</IconBtn><IconBtn danger onClick={() => deleteEssay(e.id)}>🗑</IconBtn></div>
            </TableRow>
          ))}
      </Table>
      {form && (
        <Modal title={form._new ? 'New Essay' : 'Edit Essay'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Essay Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus /></FormField>
            <FormField label="College"><Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} /></FormField>
            <FormField label="Word Limit"><Input type="number" value={form.wordLimit} onChange={(e) => setForm({ ...form, wordLimit: +e.target.value })} /></FormField>
            <FormField label="Words Written"><Input type="number" value={form.words} onChange={(e) => setForm({ ...form, words: +e.target.value })} /></FormField>
          </div>
          <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{ESSAY_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
          <FormField label="Prompt"><Textarea rows={2} value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── Score Tracker ──────────────────────────────────────────────────────────────
export function ScoreTrackerPage() {
  const { scores, addScore, updateScore, deleteScore } = useCollege();
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.test) return;
    if (form._new) { const { _new, ...d } = form; addScore(d); } else updateScore(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Score Tracker" subtitle="SAT, ACT, AP Exams, and more" action={<Btn onClick={() => setForm({ test: 'SAT', subject: '', score: '', maxScore: '', date: '', goal: '', _new: true })}>+ Add Score</Btn>} />
      {scores.length === 0 ? <Empty icon="📈" text="Track your test scores here" action={() => setForm({ test: 'SAT', subject: '', score: '', maxScore: '1600', date: '', goal: '', _new: true })} /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {scores.map((s) => (
            <Card key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1.5, textTransform: 'uppercase' }}>{s.test}</span>
                <div style={{ display: 'flex', gap: 4 }}><IconBtn onClick={() => setForm({ ...s })}>✏️</IconBtn><IconBtn danger onClick={() => deleteScore(s.id)}>🗑</IconBtn></div>
              </div>
              {s.subject && <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{s.subject}</div>}
              <div style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{s.score || '—'}<span style={{ fontSize: 16, color: '#374151', fontWeight: 400 }}>/{s.maxScore || '?'}</span></div>
              {s.goal && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Goal: <span style={{ color: '#22c55e', fontWeight: 700 }}>{s.goal}</span></div>}
              {s.date && <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{formatDisplay(s.date)}</div>}
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title="Test Score" onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Test"><Select value={form.test} onChange={(e) => setForm({ ...form, test: e.target.value })}>{TEST_TYPES.map((t) => <option key={t}>{t}</option>)}</Select></FormField>
            <FormField label="Subject (if AP)"><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></FormField>
            <FormField label="Score"><Input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} /></FormField>
            <FormField label="Max Score"><Input type="number" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} /></FormField>
            <FormField label="Goal Score"><Input type="number" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></FormField>
            <FormField label="Test Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── Awards ─────────────────────────────────────────────────────────────────────
export function AwardsPage() {
  const { awards, addAward, updateAward, deleteAward } = useCollege();
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.title.trim()) return;
    if (form._new) { const { _new, ...d } = form; addAward(d); } else updateAward(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Awards & Honors" subtitle="Showcase your achievements" action={<Btn onClick={() => setForm({ title: '', level: 'School', date: '', description: '', _new: true })}>+ Add Award</Btn>} />
      {awards.length === 0 ? <Empty icon="🏆" text="No awards yet — add your first achievement!" action={() => setForm({ title: '', level: 'School', date: '', description: '', _new: true })} /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {awards.map((a) => (
            <Card key={a.id} accent={AWARD_COLORS[a.level]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: AWARD_COLORS[a.level], letterSpacing: 1, textTransform: 'uppercase' }}>{a.level}</span>
                <div style={{ display: 'flex', gap: 4 }}><IconBtn onClick={() => setForm({ ...a })}>✏️</IconBtn><IconBtn danger onClick={() => deleteAward(a.id)}>🗑</IconBtn></div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>🏆 {a.title}</div>
              {a.date && <div style={{ fontSize: 12, color: '#64748b' }}>{formatDisplay(a.date)}</div>}
              {a.description && <div style={{ fontSize: 12, color: '#475569', marginTop: 8, lineHeight: 1.5 }}>{a.description}</div>}
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title="Award / Honor" onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus /></FormField>
            <FormField label="Level"><Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>{AWARD_LEVELS.map((l) => <option key={l}>{l}</option>)}</Select></FormField>
            <FormField label="Date Received"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
          </div>
          <FormField label="Description"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── Scholarships ───────────────────────────────────────────────────────────────
export function ScholarshipPage() {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship } = useCollege();
  const [form, setForm] = useState(null);
  const totalWon = sumBy(scholarships.filter((s) => s.status === 'Won'), 'amount');
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addScholarship({ ...d, amount: +d.amount }); } else updateScholarship(form.id, { ...form, amount: +form.amount });
    setForm(null);
  };
  const COLS = '1.5fr 110px 90px 80px 60px';
  return (
    <div>
      <SectionHeader title="Scholarship Tracker" subtitle="Fund your future" action={<Btn onClick={() => setForm({ name: '', amount: '', deadline: '', status: 'Researching', requirements: '', link: '', _new: true })}>+ Add</Btn>} />
      {totalWon > 0 && <Card style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28 }}>💵</span>
        <div><div style={{ fontSize: 12, color: '#64748b' }}>Total Won</div><div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e' }}>${totalWon.toLocaleString()}</div></div>
      </Card>}
      <Table columns={COLS}>
        <><span>Scholarship</span><span>Amount</span><span>Deadline</span><span>Status</span><span /></>
        {scholarships.length === 0 ? <Empty icon="💵" text="Start tracking scholarships" /> :
          scholarships.map((s) => (
            <TableRow key={s.id} columns={COLS}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{s.name}</div>
                {s.requirements && <div style={{ fontSize: 11, color: '#475569' }}>{s.requirements.slice(0, 50)}</div>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{s.amount ? `$${Number(s.amount).toLocaleString()}` : '—'}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.deadline ? formatDisplay(s.deadline) : '—'}</div>
              <StatusBadge status={s.status} />
              <div style={{ display: 'flex', gap: 2 }}><IconBtn onClick={() => setForm({ ...s })}>✏️</IconBtn><IconBtn danger onClick={() => deleteScholarship(s.id)}>🗑</IconBtn></div>
            </TableRow>
          ))}
      </Table>
      {form && (
        <Modal title="Scholarship" onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Amount ($)"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
            <FormField label="Deadline"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Researching','Applying','Applied','Won','Rejected'].map((s) => <option key={s}>{s}</option>)}</Select></FormField>
          </div>
          <FormField label="Requirements"><Input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── Activities ─────────────────────────────────────────────────────────────────
export function ActivitiesPage() {
  const { activities, addActivity, updateActivity, deleteActivity } = useCollege();
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const save = () => {
    if (!form.name.trim()) return;
    if (form._new) { const { _new, ...d } = form; addActivity(d); } else updateActivity(form.id, form);
    setForm(null);
  };
  return (
    <div>
      <SectionHeader title="Activities Tracker" subtitle="Common App & Stanford format" action={<Btn onClick={() => setForm({ name: '', category: 'Athletics', role: '', organization: '', hoursPerWeek: 0, weeksPerYear: 0, isLeadership: false, impact: '', description: '', _new: true })}>+ Add Activity</Btn>} />
      <div style={{ marginBottom: 16, padding: '12px 16px', background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 10, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
        💡 Common App allows up to <strong style={{ color: '#a5b4fc' }}>10 activities</strong>, each with a 150-character description. Use this tracker to plan and refine your list.
      </div>
      {activities.length === 0 ? <Empty icon="⭐" text="No activities tracked yet" action={() => setForm({ name: '', category: 'Athletics', role: '', organization: '', hoursPerWeek: 0, weeksPerYear: 0, isLeadership: false, impact: '', description: '', _new: true })} /> :
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activities.map((a, idx) => (
            <Card key={a.id}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1f2937', width: 28, flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{a.name}</span>
                      {a.isLeadership && <span style={{ marginLeft: 8, fontSize: 10, background: '#16173a', color: '#6366f1', padding: '2px 8px', borderRadius: 20, fontWeight: 700, letterSpacing: .5 }}>LEADERSHIP</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <IconBtn onClick={() => setPreview(a)}>👁</IconBtn>
                      <IconBtn onClick={() => setForm({ ...a })}>✏️</IconBtn>
                      <IconBtn danger onClick={() => deleteActivity(a.id)}>🗑</IconBtn>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    {a.role && `${a.role} · `}{a.organization && `${a.organization} · `}{a.category}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: a.description ? 10 : 0 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {a.hoursPerWeek}h/week · {a.weeksPerYear}wk/yr</span>
                  </div>
                  {a.description && (
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, background: 'hsl(222,84%,5%)', padding: '8px 12px', borderRadius: 8 }}>
                      "{a.description}"
                      <span style={{ marginLeft: 8, color: a.description.length > 150 ? '#ef4444' : '#475569', fontSize: 11 }}>
                        {a.description.length}/150
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>}
      {form && (
        <Modal title={form._new ? 'Add Activity' : 'Edit Activity'} onClose={() => setForm(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Activity Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{ACTIVITY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></FormField>
            <FormField label="Your Role / Title"><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></FormField>
            <FormField label="Organization"><Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></FormField>
            <FormField label="Hours / Week"><Input type="number" min={0} value={form.hoursPerWeek} onChange={(e) => setForm({ ...form, hoursPerWeek: +e.target.value })} /></FormField>
            <FormField label="Weeks / Year"><Input type="number" min={0} max={52} value={form.weeksPerYear} onChange={(e) => setForm({ ...form, weeksPerYear: +e.target.value })} /></FormField>
          </div>
          <FormField label="Description (150 char max for Common App)">
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={200} />
            <div style={{ fontSize: 11, color: form.description?.length > 150 ? '#ef4444' : '#475569', marginTop: 4 }}>{form.description?.length || 0}/150 characters</div>
          </FormField>
          <FormField label="Impact / Achievements"><Textarea rows={2} value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} /></FormField>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.isLeadership} onChange={(e) => setForm({ ...form, isLeadership: e.target.checked })} />
            This is a leadership role
          </label>
          <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
      {preview && (
        <Modal title="Common App Preview" onClose={() => setPreview(null)}>
          <div style={{ background: '#fff', color: '#000', padding: 20, borderRadius: 10, fontFamily: 'Georgia, serif' }}>
            <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Activity Type</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{preview.category}</div>
            <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Position / Leadership</div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>{preview.role || '—'}</div>
            <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Organization Name</div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>{preview.organization || '—'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div><div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Hours/Week</div><div style={{ fontSize: 13 }}>{preview.hoursPerWeek}</div></div>
              <div><div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Weeks/Year</div><div style={{ fontSize: 13 }}>{preview.weeksPerYear}</div></div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Description</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, borderTop: '1px solid #eee', paddingTop: 8 }}>{preview.description || '(No description)'}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
