import { useState } from 'react';
import { useMission } from '../../store/useAppStore';
import { PROJECT_STATUSES, MILESTONE_STATUSES } from '../../utils/constants';
import { Modal, FormField, Input, Textarea, Select, Btn, IconBtn, SectionHeader, Card, Empty, StatusBadge, ProgressBar } from '../shared/UI';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, addProjectMilestone, updateProjectMilestone } = useMission();
  const [form, setForm] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [milestoneTitle, setMilestoneTitle] = useState('');

  const save = () => {
    if (!form.name.trim()) return;
    const tech = typeof form.techStack === 'string' ? form.techStack.split(',').map((t) => t.trim()).filter(Boolean) : form.techStack;
    const data = { ...form, techStack: tech };
    if (form._new) { const { _new, ...d } = data; addProject(d); } else updateProject(form.id, data);
    setForm(null);
  };

  const project = projects.find((p) => p.id === activeId);

  if (project) {
    const milestones = project.milestones || [];
    const cols = MILESTONE_STATUSES.map((s) => ({ status: s, items: milestones.filter((m) => m.status === s) }));
    const done = milestones.filter((m) => m.status === 'Done').length;
    return (
      <div>
        <button onClick={() => setActiveId(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 12 }}>← All Projects</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>{project.name}</h2>
            <StatusBadge status={project.status} />
            {project.description && <p style={{ fontSize: 13, color: '#64748b', margin: '10px 0 0', maxWidth: 600, lineHeight: 1.6 }}>{project.description}</p>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '7px 14px', color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>GitHub →</a>}
            {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" style={{ background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '7px 14px', color: '#94a3b8', fontSize: 12, textDecoration: 'none' }}>Demo →</a>}
          </div>
        </div>

        {project.techStack?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {project.techStack.map((t) => (
              <span key={t} style={{ padding: '3px 10px', background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 20, fontSize: 11, color: '#a5b4fc' }}>{t}</span>
            ))}
          </div>
        )}

        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Project Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>{done}/{milestones.length}</span>
          </div>
          <ProgressBar value={done} max={milestones.length || 1} />
        </Card>

        {/* Kanban */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          {cols.map((col) => (
            <div key={col.status} style={{ background: 'hsl(222,84%,5%)', borderRadius: 12, padding: 12, minHeight: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span>{col.status}</span><span>{col.items.length}</span>
              </div>
              {col.items.map((m) => (
                <div key={m.id} style={{ background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 6 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {MILESTONE_STATUSES.filter((s) => s !== m.status).map((s) => (
                      <button key={s} onClick={() => updateProjectMilestone(project.id, m.id, { status: s })} style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 12,
                        background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)',
                        color: '#64748b', cursor: 'pointer', fontFamily: 'inherit',
                      }}>→ {s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            placeholder="+ Add milestone..."
            style={{ flex: 1, background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 8, padding: '8px 14px', color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            onKeyDown={(e) => { if (e.key === 'Enter' && milestoneTitle.trim()) { addProjectMilestone(project.id, { title: milestoneTitle, status: 'Todo' }); setMilestoneTitle(''); } }}
          />
          <Btn onClick={() => { if (milestoneTitle.trim()) { addProjectMilestone(project.id, { title: milestoneTitle, status: 'Todo' }); setMilestoneTitle(''); } }}>Add</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Build a portfolio of meaningful work" action={<Btn onClick={() => setForm({ name: '', description: '', status: 'Planning', techStack: '', githubUrl: '', demoUrl: '', _new: true })}>+ New Project</Btn>} />
      {projects.length === 0 ? <Empty icon="💻" text="No projects yet — start building your portfolio!" action={() => setForm({ name: '', description: '', status: 'Planning', techStack: '', githubUrl: '', demoUrl: '', _new: true })} /> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {projects.map((p) => {
            const completed = p.milestones?.filter((m) => m.status === 'Done').length || 0;
            const total = p.milestones?.length || 0;
            return (
              <Card key={p.id} style={{ cursor: 'pointer' }} onClick={() => setActiveId(p.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <StatusBadge status={p.status} />
                  <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <IconBtn onClick={() => setForm({ ...p, techStack: p.techStack?.join(', ') || '' })}>✏️</IconBtn>
                    <IconBtn danger onClick={() => deleteProject(p.id)}>🗑</IconBtn>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{p.name}</div>
                {p.description && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? '…' : ''}</div>}
                {p.techStack?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                    {p.techStack.slice(0, 3).map((t) => (
                      <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'hsl(222,84%,5%)', borderRadius: 12, color: '#a5b4fc' }}>{t}</span>
                    ))}
                  </div>
                )}
                {total > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      <span>Milestones</span><span>{completed}/{total}</span>
                    </div>
                    <ProgressBar value={completed} max={total} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>}
      {form && (
        <Modal title={form._new ? 'New Project' : 'Edit Project'} onClose={() => setForm(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <FormField label="Project Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></FormField>
          </div>
          <FormField label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Tech Stack (comma-separated)"><Input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, TypeScript, Supabase" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="GitHub URL"><Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." /></FormField>
            <FormField label="Live Demo URL"><Input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://..." /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><Btn onClick={save} style={{ flex: 1 }}>Save</Btn><Btn variant="ghost" onClick={() => setForm(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}
