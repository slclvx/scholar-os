import { useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useUI } from '../../store/useAppStore';
import { NAV_SECTIONS, HUBS } from '../../utils/constants';
import { SectionHeader, Empty } from '../shared/UI';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const results = useSearch(q);
  const { setActiveHub, setActiveSection } = useUI();

  const goTo = (section) => {
    for (const [hub, sections] of Object.entries(NAV_SECTIONS)) {
      if (sections.find((s) => s.id === section)) {
        setActiveHub(hub);
        setActiveSection(section);
        return;
      }
    }
  };

  const grouped = results.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader title="Search" subtitle="Find anything across Scholar OS" />
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assignments, notes, colleges, habits, anything..."
          style={{
            width: '100%', background: 'hsl(222,47%,8%)',
            border: '1px solid hsl(217,33%,15%)', borderRadius: 12,
            padding: '14px 20px 14px 48px', color: '#e2e8f0',
            fontSize: 16, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          }}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = 'hsl(217,33%,15%)'}
        />
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
      </div>

      {q.length < 2 ? (
        <Empty icon="🔍" text="Start typing to search across all your data" />
      ) : results.length === 0 ? (
        <Empty icon="😶" text={`No results for "${q}"`} />
      ) : (
        <>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{results.length} result{results.length !== 1 ? 's' : ''}</div>
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>{type}</div>
              {items.map((r) => (
                <div key={`${r.type}-${r.id}`}
                  onClick={() => goTo(r.section)}
                  style={{ padding: '12px 16px', background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 10, marginBottom: 6, cursor: 'pointer', transition: 'border-color .12s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(217,33%,15%)'}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{r.title}</div>
                  {r.sub && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{r.sub}</div>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
