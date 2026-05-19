import { useCurrentClass } from '../../hooks/useCurrentClass';
import { fromMinutes, formatRemaining } from '../../utils/scheduleEngine';

export function LiveNowCard() {
  const current = useCurrentClass();

  // Common wrapper styling
  const wrap = (children, accent = '#6366f1', background) => (
    <div style={{
      background: background || 'linear-gradient(135deg, hsl(222,47%,8%), hsl(222,47%,10%))',
      border: '1px solid hsl(217,33%,15%)',
      borderRadius: 16, padding: 24, marginBottom: 18,
      borderLeft: `4px solid ${accent}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {children}
    </div>
  );

  const label = (text, color = '#475569') => (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 2.5,
      textTransform: 'uppercase', color, marginBottom: 8,
    }}>
      {text}
    </div>
  );

  switch (current.state) {
    case 'no_schedule':
      return wrap(
        <>
          {label('Set Up Required', '#f97316')}
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
            👋 Welcome to Scholar OS
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Build your class schedule to enable Live Now — head to <strong>Schedule</strong> in the sidebar.
          </div>
        </>,
        '#f97316'
      );

    case 'weekend':
    case 'holiday':
    case 'no_school':
    case 'after_school': {
      const messages = {
        weekend: { emoji: '🌞', sub: 'Recharge — class resumes Monday' },
        holiday: { emoji: '🎉', sub: 'No school today' },
        no_school: { emoji: '🌿', sub: 'No active classes' },
        after_school: { emoji: '✅', sub: 'School day is over — well done' },
      };
      const m = messages[current.state];
      return wrap(
        <>
          {label('Now', '#22c55e')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{m.emoji}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{current.message || m.sub}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{m.sub}</div>
            </div>
          </div>
        </>,
        '#22c55e'
      );
    }

    case 'before_school': {
      const nb = current.nextBlock;
      return wrap(
        <>
          {label('Coming Up', '#eab308')}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: nb?.color || '#6366f1' }} />
                <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: -.3 }}>
                  {nb?.displayName || 'First class'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Starts at {fromMinutes(toMinutesFromBlock(nb?.startTime))}
                {nb?.class?.teacher && ` · ${nb.class.teacher}`}
                {nb?.class?.room && ` · Room ${nb.class.room}`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>In</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#eab308' }}>{formatRemaining(current.minutesUntilStart)}</div>
            </div>
          </div>
        </>,
        '#eab308'
      );
    }

    case 'in_block': {
      const b = current.currentBlock;
      const nb = current.nextBlock;
      const startMin = toMinutesFromBlock(b.startTime);
      const endMin = toMinutesFromBlock(b.endTime);
      const accent = b.color;

      return wrap(
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              {label('Now', accent)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 26 }}>{b.blockType === 'lunch' ? '🍽' : '📚'}</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: -.5, lineHeight: 1.1 }}>
                  {b.displayName}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <span>{fromMinutes(startMin)} — {fromMinutes(endMin)}</span>
                {current.dayTemplate?.label && <span>· {current.dayTemplate.label}</span>}
                {b.class?.teacher && <span>· {b.class.teacher}</span>}
                {b.class?.room && <span>· Room {b.class.room}</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 110 }}>
              <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Remaining</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>
                {formatRemaining(current.minutesRemaining)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: 'hsl(217,33%,15%)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{
              height: '100%', width: `${current.progressPercent}%`,
              background: accent, borderRadius: 3,
              transition: 'width 1s linear',
            }} />
          </div>

          {/* Next up */}
          {nb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
              <span style={{ color: '#475569' }}>Next:</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: nb.color }} />
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{nb.displayName}</span>
              <span style={{ color: '#475569' }}>at {fromMinutes(toMinutesFromBlock(nb.startTime))}</span>
            </div>
          )}
        </>,
        accent,
        `linear-gradient(135deg, ${accent}08, hsl(222,47%,9%))`
      );
    }

    case 'passing_period': {
      const nb = current.nextBlock;
      return wrap(
        <>
          {label('Passing Period', '#f97316')}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>🚶</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
                  Heading to {nb.displayName}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Starts at {fromMinutes(toMinutesFromBlock(nb.startTime))}
                {nb.class?.room && ` · Room ${nb.class.room}`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>In</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>
                {formatRemaining(current.minutesUntilNext)}
              </div>
            </div>
          </div>
        </>,
        '#f97316'
      );
    }

    default:
      return null;
  }
}

// Helper for components that need minutes from "HH:MM" string
function toMinutesFromBlock(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}
