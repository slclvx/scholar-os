import { usePomodoro } from '../../hooks/usePomodoro';
import { Card, ProgressBar } from '../shared/UI';

const PLAYLISTS = [
  { name: 'Lo-fi Beats', url: 'https://www.youtube.com/results?search_query=lofi+hip+hop+study', emoji: '🎵', desc: 'Chill beats to focus' },
  { name: 'Classical Focus', url: 'https://www.youtube.com/results?search_query=classical+music+studying', emoji: '🎻', desc: 'Bach, Debussy, Mozart' },
  { name: 'Brown Noise', url: 'https://www.youtube.com/results?search_query=brown+noise+focus+4+hours', emoji: '🌊', desc: 'Deep concentration' },
  { name: 'Jazz Study', url: 'https://www.youtube.com/results?search_query=jazz+study+music', emoji: '🎷', desc: 'Smooth and creative' },
  { name: 'Nature Sounds', url: 'https://www.youtube.com/results?search_query=nature+sounds+study+rain', emoji: '🌿', desc: 'Rain & forest ambience' },
  { name: 'Video Game OST', url: 'https://www.youtube.com/results?search_query=video+game+ost+study+music', emoji: '🎮', desc: 'Designed for focus' },
];

const TIPS = [
  'Use active recall — test yourself instead of re-reading.',
  'Space your review sessions across multiple days (SM-2 algorithm).',
  "Teach concepts out loud using the Feynman Technique.",
  'Eliminate phone notifications completely during focus sessions.',
  "Write summaries in your own words after each section.",
  'Sleep is when your brain consolidates memories — protect it.',
  'Connect new concepts to things you already know well.',
  'The Pomodoro Technique prevents mental fatigue and maintains quality.',
  '1% better every day = 37x improvement in a year (Atomic Habits).',
  'Study the hardest material first, when your mind is freshest.',
];

export default function StudyRoomPage() {
  const pom = usePomodoro();
  const tip = TIPS[new Date().getDate() % TIPS.length];

  const modeColors = { work: '#f97316', break: '#22c55e', long: '#6366f1' };
  const modeLabels = { work: 'Focus', break: 'Short Break', long: 'Long Break' };
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference * (1 - pom.progress);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>Study Room</h2>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>Your focused environment for deep, distraction-free work</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Pomodoro */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36, gap: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: modeColors[pom.mode], textTransform: 'uppercase' }}>
            {modeLabels[pom.mode]}
          </div>

          {/* Circular timer */}
          <div style={{ position: 'relative', width: 128, height: 128 }}>
            <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="64" cy="64" r="54" fill="none" stroke="hsl(217,33%,15%)" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={modeColors[pom.mode]}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>
                {pom.display}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={pom.reset} style={{ background: 'hsl(217,33%,15%)', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>↺</button>
            <button onClick={pom.active ? pom.pause : pom.start} style={{
              background: modeColors[pom.mode], border: 'none', borderRadius: 10,
              padding: '10px 32px', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
            }}>
              {pom.active ? '⏸ Pause' : '▶ Start'}
            </button>
            <button onClick={pom.skip} style={{ background: 'hsl(217,33%,15%)', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>⏭</button>
          </div>

          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
            <div>Sessions today: <span style={{ color: '#f97316', fontWeight: 700 }}>{pom.sessions}</span></div>
            <div>Focus time: <span style={{ color: '#f97316', fontWeight: 700 }}>{Math.round(pom.sessions * 25 / 60 * 10) / 10}h</span></div>
          </div>

          {/* Mode quick switch */}
          <div style={{ display: 'flex', gap: 6, background: 'hsl(222,84%,5%)', padding: 4, borderRadius: 8 }}>
            {[['work','🍅 Focus'],['break','☕ Break'],['long','🌿 Long']].map(([m, l]) => (
              <div key={m} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, color: pom.mode === m ? '#fff' : '#475569', background: pom.mode === m ? modeColors[m] : 'transparent', cursor: 'default' }}>{l}</div>
            ))}
          </div>
        </Card>

        {/* Tip + Music */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>Study Tip of the Day</div>
            <div style={{ padding: '14px 16px', background: 'hsl(222,84%,5%)', borderRadius: 10, borderLeft: '3px solid #6366f1' }}>
              <div style={{ fontSize: 14, color: '#a5b4fc', lineHeight: 1.7, fontStyle: 'italic' }}>"{tip}"</div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>Study Playlists</div>
            {PLAYLISTS.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 0', borderBottom: '1px solid hsl(222,47%,6%)',
                textDecoration: 'none', color: '#e2e8f0', transition: 'color .12s',
              }}>
                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{p.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#374151', fontSize: 12 }}>→</span>
              </a>
            ))}
          </Card>
        </div>
      </div>

      {/* Technique guide */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 14 }}>Pomodoro Technique</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { step: '1', label: 'Choose a task', desc: 'Pick one meaningful task to work on', color: '#6366f1' },
            { step: '2', label: 'Focus 25 min', desc: 'Work with zero distractions until timer ends', color: '#f97316' },
            { step: '3', label: 'Short break', desc: 'Take a 5-minute break to reset your brain', color: '#22c55e' },
            { step: '4', label: 'Repeat × 4', desc: 'After 4 sessions, take a 15-minute long break', color: '#ec4899' },
          ].map((s) => (
            <div key={s.step} style={{ padding: '14px 16px', background: 'hsl(222,84%,5%)', borderRadius: 10, borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 6 }}>{s.step}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
