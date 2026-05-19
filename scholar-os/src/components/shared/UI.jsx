import { useEffect, useRef } from 'react';
import { STATUS_STYLES, PRIORITY_STYLES } from '../../utils/constants';

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(4px)',
        animation: 'fadeIn .15s ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'hsl(222,47%,8%)',
        border: '1px solid hsl(217,33%,15%)',
        borderRadius: 14,
        width: '100%', maxWidth: wide ? 720 : 540,
        maxHeight: '90vh', overflowY: 'auto',
        padding: 28,
        animation: 'slideUp .2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', letterSpacing: -.3 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '2px 6px', borderRadius: 6 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── FormField ──────────────────────────────────────────────────────────────────
export function FormField({ label, children, hint, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block', marginBottom: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: .8,
          textTransform: 'uppercase', color: '#475569',
        }}>
          {label}
        </label>
      )}
      {children}
      {hint && <div style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
export const inputStyle = {
  background: 'hsl(222,84%,5%)',
  border: '1px solid hsl(217,33%,15%)',
  borderRadius: 8, padding: '8px 12px',
  color: '#e2e8f0', fontSize: 13, outline: 'none',
  width: '100%', transition: 'border-color .15s',
  fontFamily: 'inherit',
};

export function Input({ style, ...props }) {
  return (
    <input
      style={{ ...inputStyle, ...style }}
      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
      onBlur={(e) => e.target.style.borderColor = 'hsl(217,33%,15%)'}
      {...props}
    />
  );
}

export function Textarea({ style, ...props }) {
  return (
    <textarea
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, ...style }}
      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
      onBlur={(e) => e.target.style.borderColor = 'hsl(217,33%,15%)'}
      {...props}
    />
  );
}

export function Select({ style, children, ...props }) {
  return (
    <select
      style={{ ...inputStyle, cursor: 'pointer', ...style }}
      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
      onBlur={(e) => e.target.style.borderColor = 'hsl(217,33%,15%)'}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Buttons ────────────────────────────────────────────────────────────────────
export function Btn({ variant = 'primary', children, style, ...props }) {
  const styles = {
    primary: { background: '#6366f1', color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: '#94a3b8', border: '1px solid hsl(217,33%,15%)' },
    danger:  { background: 'transparent', color: '#ef4444', border: '1px solid #1a0a0a' },
  };
  return (
    <button
      style={{
        ...styles[variant],
        borderRadius: 8, padding: '8px 16px', fontSize: 13,
        fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
        transition: 'all .15s', display: 'inline-flex', alignItems: 'center', gap: 6,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconBtn({ children, title, danger, style, ...props }) {
  return (
    <button
      title={title}
      style={{
        background: 'none', border: 'none',
        color: danger ? '#ef4444' : '#475569',
        cursor: 'pointer', fontSize: 14, padding: '3px 5px',
        borderRadius: 5, transition: 'color .15s',
        fontFamily: 'inherit',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Badges ─────────────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: '#111', text: '#6b7280' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px',
      borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: .4,
      background: s.bg, color: s.text,
    }}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const s = PRIORITY_STYLES[priority] || { bg: '#111', text: '#6b7280' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px',
      borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: .4,
      background: s.bg, color: s.text,
    }}>
      {priority}
    </span>
  );
}

export function ColorDot({ color, size = 10 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: color, flexShrink: 0,
    }} />
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
export function Empty({ icon = '📭', text = 'Nothing here yet', action, actionLabel }) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <div style={{ fontSize: 32, opacity: .5 }}>{icon}</div>
      <div style={{ fontSize: 14, color: '#374151' }}>{text}</div>
      {action && (
        <button onClick={action} style={{
          marginTop: 4, background: '#6366f1', color: '#fff',
          border: 'none', borderRadius: 8, padding: '7px 16px',
          fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
        }}>
          {actionLabel || 'Add One'}
        </button>
      )}
    </div>
  );
}

// ── Progress Bar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color, height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ height, background: 'hsl(217,33%,15%)', borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: height / 2,
        width: `${pct}%`,
        background: color || 'linear-gradient(90deg, #6366f1, #ec4899)',
        transition: 'width .4s ease',
      }} />
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
export function Card({ children, style, accent, padding = 20 }) {
  return (
    <div style={{
      background: 'hsl(222,47%,8%)',
      border: '1px solid hsl(217,33%,15%)',
      borderRadius: 12,
      padding,
      borderTop: accent ? `2px solid ${accent}` : undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, letterSpacing: -.4 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────────
export function Table({ columns, children }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid hsl(217,33%,15%)', background: 'hsl(222,47%,8%)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns,
        padding: '10px 16px',
        borderBottom: '1px solid hsl(217,33%,15%)',
        fontSize: 11, fontWeight: 700, letterSpacing: 1,
        color: '#475569', textTransform: 'uppercase',
      }}>
        {children[0]}
      </div>
      <div>{children.slice(1)}</div>
    </div>
  );
}

export function TableRow({ columns, children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: columns,
        padding: '12px 16px',
        alignItems: 'center',
        borderBottom: '1px solid hsl(222,47%,6%)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .12s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(222,47%,6%)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'hsl(222,47%,6%)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '6px 16px', borderRadius: 7, border: 'none',
            background: active === t.id ? 'hsl(222,47%,10%)' : 'transparent',
            color: active === t.id ? '#f1f5f9' : '#64748b',
            fontSize: 13, fontWeight: active === t.id ? 700 : 400,
            cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Filter Pills ───────────────────────────────────────────────────────────────
export function FilterPills({ options, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            padding: '4px 14px', borderRadius: 20, fontSize: 12,
            border: `1px solid ${active === o ? '#6366f1' : 'hsl(217,33%,15%)'}`,
            background: active === o ? '#6366f1' : 'transparent',
            color: active === o ? '#fff' : '#64748b',
            cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, color }) {
  return (
    <Card>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: color || '#f1f5f9', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{label}</div>
    </Card>
  );
}

// ── Range Input ────────────────────────────────────────────────────────────────
export function RangeInput({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: '#475569' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#6366f1' }}
      />
    </div>
  );
}

import { urgencyColor as _urgencyColor } from '../../utils/dates';

export function UrgencyLabel({ days }) {
  const color = _urgencyColor(days);
  const label = days === null ? '—'
    : days < 0 ? `${Math.abs(days)}d late`
    : days === 0 ? 'Today'
    : days === 1 ? 'Tomorrow'
    : `${days}d`;
  return <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>;
}
