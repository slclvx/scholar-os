import { useState } from 'react';
import { useUI } from '../../store/useAppStore';
import { usePomodoro } from '../../hooks/usePomodoro';
import { HUBS, NAV_SECTIONS } from '../../utils/constants';

export function TopBar() {
  const { activeHub, activeSection, sidebarOpen, toggleSidebar, theme, setTheme,
    notifications, markNotificationRead, markAllRead, clearNotifications } = useUI();
  const pomodoro = usePomodoro();
  const [notifOpen, setNotifOpen] = useState(false);

  const hub = HUBS.find((h) => h.id === activeHub);
  const section = NAV_SECTIONS[activeHub]?.find((s) => s.id === activeSection);
  const unread = notifications.filter((n) => !n.read).length;

  const modeColors = { work: '#f97316', break: '#22c55e', long: '#6366f1' };

  return (
    <div style={{
      height: 56, background: 'hsl(222,84%,4%)',
      borderBottom: '1px solid hsl(217,33%,11%)',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Sidebar toggle */}
      <button onClick={toggleSidebar} style={{
        background: 'none', border: 'none', color: '#475569',
        cursor: 'pointer', fontSize: 18, padding: '4px 6px', borderRadius: 6,
        fontFamily: 'inherit',
      }}>☰</button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        <span style={{ color: hub?.color || '#6366f1', fontWeight: 700 }}>{hub?.label}</span>
        <span style={{ color: '#1f2937' }}>›</span>
        <span style={{ color: '#64748b' }}>{section?.label}</span>
      </div>

      {/* Pomodoro pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'hsl(222,47%,8%)',
        border: `1px solid ${pomodoro.active ? modeColors[pomodoro.mode] + '44' : 'hsl(217,33%,15%)'}`,
        borderRadius: 20, padding: '5px 14px',
        transition: 'border-color .3s',
      }}>
        <span style={{ fontSize: 13, color: modeColors[pomodoro.mode], animation: pomodoro.active ? 'pulse 2s infinite' : 'none' }}>
          {pomodoro.mode === 'work' ? '🍅' : '☕'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
          {pomodoro.display}
        </span>
        <span style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: .5 }}>
          {pomodoro.mode === 'work' ? 'focus' : pomodoro.mode}
        </span>
        <button onClick={pomodoro.active ? pomodoro.pause : pomodoro.start} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
          color: pomodoro.active ? '#f97316' : '#6366f1',
          padding: '0 2px',
        }}>
          {pomodoro.active ? 'PAUSE' : 'START'}
        </button>
        {pomodoro.active && (
          <button onClick={pomodoro.reset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: '#374151', fontFamily: 'inherit', padding: 0,
          }}>RST</button>
        )}
      </div>

      {/* Sessions count */}
      <div style={{ fontSize: 12, color: '#374151' }}>
        🍅 <span style={{ color: '#f97316', fontWeight: 700 }}>{pomodoro.sessions}</span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          fontSize: 14, fontFamily: 'inherit', color: '#64748b',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen((o) => !o)}
          style={{
            background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
            borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
            fontSize: 14, fontFamily: 'inherit', color: '#64748b', position: 'relative',
          }}
        >
          🔔
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: -3, right: -3, width: 16, height: 16,
              background: '#ef4444', borderRadius: '50%', fontSize: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700,
            }}>{unread}</span>
          )}
        </button>

        {notifOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 44,
            width: 320, background: 'hsl(222,47%,8%)',
            border: '1px solid hsl(217,33%,15%)', borderRadius: 12,
            boxShadow: '0 20px 40px rgba(0,0,0,.6)',
            zIndex: 200, overflow: 'hidden',
            animation: 'fadeIn .15s ease',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid hsl(217,33%,15%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Notifications</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 11, color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>Mark all read</button>
                <button onClick={clearNotifications} style={{ background: 'none', border: 'none', fontSize: 11, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
              </div>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#374151', fontSize: 13 }}>All clear! 🎉</div>
              ) : notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid hsl(222,47%,6%)',
                    background: n.read ? 'transparent' : 'hsl(239,84%,67%,.04)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', marginTop: 4, flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{n.title}</div>
                      {n.body && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{n.body}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
