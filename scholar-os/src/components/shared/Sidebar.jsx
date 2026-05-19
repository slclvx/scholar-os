import { useUI, useAppStore } from '../../store/useAppStore';
import { HUBS, NAV_SECTIONS } from '../../utils/constants';
import { daysUntil, todayStr } from '../../utils/dates';

export function Sidebar() {
  const { activeHub, activeSection, setActiveHub, setActiveSection } = useUI();
  const assignments = useAppStore((s) => s.assignments);
  const habits = useAppStore((s) => s.habits);
  const habitLogs = useAppStore((s) => s.habitLogs);
  const goals = useAppStore((s) => s.goals);

  const today = todayStr();
  const dueSoon = assignments.filter((a) => {
    if (a.status === 'Done') return false;
    const d = daysUntil(a.due);
    return d !== null && d <= 3;
  }).length;
  const habitsToday = habits.filter((h) => habitLogs[h.id]?.[today]).length;
  const activeGoals = goals.filter((g) => g.status === 'Active').length;

  const navigate = (hub, section) => {
    setActiveHub(hub);
    setActiveSection(section);
  };

  return (
    <aside style={{
      width: 226, background: 'hsl(222,84%,4%)',
      borderRight: '1px solid hsl(217,33%,11%)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid hsl(217,33%,11%)' }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: '#4f52d3', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>Scholar</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: -1, lineHeight: 1 }}>OS</div>
        <div style={{ fontSize: 10, color: '#1f2937', marginTop: 4, letterSpacing: 1.5 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Hub switcher */}
      <div style={{ padding: '12px 10px 8px' }}>
        {HUBS.map((h) => (
          <button
            key={h.id}
            onClick={() => navigate(h.id, NAV_SECTIONS[h.id]?.[0]?.id || h.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 9, border: 'none',
              background: activeHub === h.id ? 'hsl(217,33%,11%)' : 'transparent',
              color: activeHub === h.id ? '#e2e8f0' : '#4b5563',
              fontSize: 13, fontWeight: activeHub === h.id ? 700 : 400,
              cursor: 'pointer', marginBottom: 1, textAlign: 'left',
              transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 15 }}>{h.icon}</span>
            {h.label}
            {activeHub === h.id && (
              <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: h.color }} />
            )}
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: 'hsl(217,33%,11%)', margin: '4px 16px' }} />

      {/* Section nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 10px' }}>
        {(NAV_SECTIONS[activeHub] || []).map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 12px', borderRadius: 8, border: 'none',
              background: activeSection === s.id ? 'hsl(217,33%,11%)' : 'transparent',
              color: activeSection === s.id ? '#e2e8f0' : '#4b5563',
              fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
              cursor: 'pointer', marginBottom: 1, textAlign: 'left',
              transition: 'all .12s', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 14, opacity: activeSection === s.id ? 1 : .6 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>

      {/* Quick stats */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid hsl(217,33%,11%)' }}>
        <div style={{ fontSize: 10, color: '#1f2937', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Quick Stats</div>
        {[
          { label: 'Due soon', val: dueSoon, color: '#f97316' },
          { label: `Habits ${todayStr().slice(5)}`, val: `${habitsToday}/${habits.length}`, color: '#22c55e' },
          { label: 'Active goals', val: activeGoals, color: '#6366f1' },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#374151' }}>{stat.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: stat.color }}>{stat.val}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
