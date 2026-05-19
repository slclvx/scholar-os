import { useState } from 'react';
import { useAcademic } from '../../store/useAppStore';
import { formatDisplay } from '../../utils/dates';
import { Btn, IconBtn, Empty } from '../shared/UI';

export default function NotesPage() {
  const { notes, classes, addNote, updateNote, deleteNote } = useAcademic();
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = notes.filter((n) =>
    !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const current = notes.find((n) => n.id === activeId);

  const handleNew = () => {
    addNote({ title: 'Untitled Note', class: classes[0]?.name || '', content: '' });
    setTimeout(() => setActiveId(notes[0]?.id), 50);
  };

  const update = (field, val) => {
    if (!activeId) return;
    updateNote(activeId, { [field]: val });
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 130px)' }}>
      {/* Sidebar */}
      <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
              borderRadius: 8, padding: '7px 10px', color: '#e2e8f0', fontSize: 12,
              outline: 'none', fontFamily: 'inherit',
            }}
          />
          <Btn onClick={handleNew} style={{ padding: '7px 12px', fontSize: 16 }}>+</Btn>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ color: '#374151', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>No notes yet</div>
          ) : filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveId(n.id)}
              style={{
                padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                background: activeId === n.id ? 'hsl(217,33%,14%)' : 'hsl(222,47%,8%)',
                border: `1px solid ${activeId === n.id ? '#6366f1' : 'hsl(217,33%,15%)'}`,
                transition: 'all .12s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title || 'Untitled'}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{n.class || 'No class'}</div>
              {n.updatedAt && <div style={{ fontSize: 10, color: '#1f2937', marginTop: 3 }}>{formatDisplay(n.updatedAt)}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{
        flex: 1, background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
        borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {current ? (
          <>
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid hsl(217,33%,15%)',
              display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <input
                value={current.title}
                onChange={(e) => update('title', e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  color: '#f1f5f9', fontSize: 17, fontWeight: 700, outline: 'none',
                  fontFamily: 'inherit',
                }}
                placeholder="Note title..."
              />
              <select
                value={current.class}
                onChange={(e) => update('class', e.target.value)}
                style={{
                  background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)',
                  borderRadius: 7, padding: '5px 10px', color: '#94a3b8',
                  fontSize: 12, cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                }}
              >
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="">No class</option>
              </select>
              <IconBtn danger onClick={() => { deleteNote(current.id); setActiveId(null); }}>🗑</IconBtn>
            </div>
            <textarea
              value={current.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Write your notes here... Supports plain text. Use ## for headings, - for bullets, ``` for code blocks."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#cbd5e1', fontSize: 14, lineHeight: 1.9,
                padding: '24px 28px', resize: 'none', fontFamily: "'Georgia', serif",
                fontVariantLigatures: 'common-ligatures',
              }}
            />
            <div style={{ padding: '8px 20px', borderTop: '1px solid hsl(217,33%,15%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#1f2937' }}>
                {current.content ? `${current.content.split(/\s+/).filter(Boolean).length} words` : '0 words'}
              </span>
              <span style={{ fontSize: 11, color: '#1f2937' }}>Auto-saved</span>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#374151' }}>
            <div style={{ fontSize: 40 }}>📔</div>
            <div style={{ fontSize: 14 }}>Select a note or create a new one</div>
            <Btn onClick={handleNew}>+ New Note</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
