import { useState } from 'react';
import { useMission } from '../../store/useAppStore';
import { STANFORD_CHECKLIST } from '../../utils/constants';
import { Card, ProgressBar, Tabs } from '../shared/UI';

export default function StanfordPrepPage() {
  const { stanfordProgress, toggleStanfordItem, updateStanfordItemNotes } = useMission();
  const [grade, setGrade] = useState(9);
  const [expandedItem, setExpandedItem] = useState(null);

  const checklist = STANFORD_CHECKLIST[grade] || {};
  const allItems = Object.entries(checklist).flatMap(([cat, items]) =>
    items.map((_, idx) => `${grade}.${cat}.${idx}`)
  );
  const completed = allItems.filter((k) => stanfordProgress[k]?.done).length;
  const total = allItems.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>🔴</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, letterSpacing: -.4 }}>Stanford Prep</h2>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          Based on Stanford's stated admissions values: intellectual vitality, demonstrated impact, authentic voice
        </p>
      </div>

      <Tabs tabs={[
        { id: 9, label: '9th Grade' },
        { id: 10, label: '10th Grade' },
        { id: 11, label: '11th Grade' },
        { id: 12, label: '12th Grade' },
      ]} active={grade} onChange={setGrade} />

      {/* Progress overview */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#475569', fontWeight: 700, marginBottom: 4 }}>Grade {grade} Progress</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{completed}<span style={{ color: '#374151', fontSize: 18, fontWeight: 400 }}>/{total} items</span></div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: pct === 100 ? '#22c55e' : '#ec4899' }}>{pct}%</div>
        </div>
        <ProgressBar value={pct} />
      </Card>

      {/* Checklist categories */}
      {Object.entries(checklist).map(([category, items]) => {
        const catItems = items.map((_, idx) => `${grade}.${category}.${idx}`);
        const catDone = catItems.filter((k) => stanfordProgress[k]?.done).length;
        return (
          <Card key={category} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid hsl(217,33%,15%)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{category}</div>
              <div style={{ fontSize: 12, color: catDone === items.length ? '#22c55e' : '#64748b', fontWeight: 700 }}>{catDone}/{items.length}</div>
            </div>
            {items.map((item, idx) => {
              const key = `${grade}.${category}.${idx}`;
              const progress = stanfordProgress[key];
              const done = progress?.done;
              return (
                <div key={idx}>
                  <div
                    onClick={() => toggleStanfordItem(grade, category, idx)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '10px 0', cursor: 'pointer',
                      borderBottom: idx < items.length - 1 ? '1px solid hsl(222,47%,6%)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, marginTop: 2, flexShrink: 0,
                      borderRadius: 5, border: `1.5px solid ${done ? '#22c55e' : '#2a2d3e'}`,
                      background: done ? '#22c55e22' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#22c55e', fontWeight: 700,
                    }}>
                      {done ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1, fontSize: 14, color: done ? '#475569' : '#cbd5e1', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.6 }}>
                      {item}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedItem(expandedItem === key ? null : key); }}
                      style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 12, padding: 0, fontFamily: 'inherit' }}
                    >
                      {expandedItem === key ? '−' : '+ note'}
                    </button>
                  </div>
                  {expandedItem === key && (
                    <div style={{ padding: '4px 0 14px 30px' }}>
                      <textarea
                        value={progress?.notes || ''}
                        onChange={(e) => updateStanfordItemNotes(grade, category, idx, e.target.value)}
                        placeholder="Add your notes..."
                        rows={2}
                        style={{
                          width: '100%', background: 'hsl(222,84%,5%)',
                          border: '1px solid hsl(217,33%,15%)', borderRadius: 8,
                          padding: '8px 12px', color: '#cbd5e1', fontSize: 12,
                          outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        );
      })}

      {/* Footer note */}
      <div style={{ marginTop: 16, padding: '14px 18px', background: 'hsl(222,84%,5%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ec4899', letterSpacing: 1.2, textTransform: 'uppercase' }}>Source</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.6 }}>
            Based on Stanford's publicly stated admissions priorities. Always verify the latest requirements at <span style={{ color: '#a5b4fc' }}>admission.stanford.edu</span> — policies and deadlines can change yearly.
          </div>
        </div>
      </div>
    </div>
  );
}
