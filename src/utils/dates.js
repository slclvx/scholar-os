// All date operations live here — no inline date math anywhere else

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export const toDateStr = (date) => {
  if (!date) return null;
  if (typeof date === 'string') return date.slice(0, 10);
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
};

export const formatDisplay = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

export const formatFull = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export const urgencyColor = (days) => {
  if (days === null) return '#6b7280';
  if (days < 0) return '#ef4444';
  if (days <= 2) return '#f97316';
  if (days <= 7) return '#eab308';
  return '#22c55e';
};

export const sortByDate = (arr, key) =>
  [...arr].sort((a, b) => {
    if (!a[key]) return 1;
    if (!b[key]) return -1;
    return a[key].localeCompare(b[key]);
  });

export const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return toDateStr(d);
  });
};

export const getLast30Days = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return toDateStr(d);
  });
};

export const getWeekDayLabel = (dateStr) => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const d = new Date(dateStr + 'T00:00:00');
  return days[d.getDay()];
};

export const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};
