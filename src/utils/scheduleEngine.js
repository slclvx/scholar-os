// Pure logic for figuring out: what day is today? what class is right now?
// Zero React dependencies — easy to test, easy to reason about.

import { todayStr } from './dates';

// Convert "HH:MM" → minutes since midnight
export function toMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Convert minutes → "8:30 AM"
export function fromMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Format minutes-remaining as "1h 26m" or "12m"
export function formatRemaining(mins) {
  if (mins < 1) return 'Less than a minute';
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// Count school days between two dates (excluding weekends + exceptions)
function countSchoolDaysBetween(fromDateStr, toDateStr, exceptions = {}, profile) {
  if (!fromDateStr || !toDateStr) return 0;
  const from = new Date(fromDateStr + 'T00:00:00');
  const to = new Date(toDateStr + 'T00:00:00');
  if (to < from) return -countSchoolDaysBetween(toDateStr, fromDateStr, exceptions, profile);

  let count = 0;
  const d = new Date(from);
  while (d < to) {
    d.setDate(d.getDate() + 1);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const weekday = d.getDay();
    // Skip weekends (most schools)
    if (weekday === 0 || weekday === 6) continue;
    // Skip exceptions marked "no_school"
    if (exceptions[ds]?.type === 'no_school' || exceptions[ds]?.type === 'holiday') continue;
    count++;
  }
  return count;
}

// THE CORE: given a profile + date, figure out which day template applies
export function getDayTemplate(profile, dateStr, exceptions = {}) {
  if (!profile || !profile.days || profile.days.length === 0) return null;

  // 1. Check for date-specific exception first
  const exception = exceptions[dateStr];
  if (exception) {
    if (exception.type === 'no_school' || exception.type === 'holiday') return null;
    if (exception.overrideDayId) {
      return profile.days.find((d) => d.id === exception.overrideDayId);
    }
    if (exception.customBlocks?.length) {
      return { id: 'custom-' + dateStr, label: 'Custom Day', blocks: exception.customBlocks };
    }
  }

  const d = new Date(dateStr + 'T00:00:00');
  const weekday = d.getDay(); // 0=Sun, 6=Sat

  // 2. Auto-skip weekends unless explicitly defined
  const hasWeekendDays = profile.days.some((day) => day.weekdays?.includes(weekday));
  if ((weekday === 0 || weekday === 6) && !hasWeekendDays) return null;

  // 3. Apply rotation logic
  switch (profile.rotationType) {
    case 'weekly':
      // Match day by weekday (Mon/Tue/Wed/etc)
      return profile.days.find((day) => day.weekdays?.includes(weekday)) || null;

    case 'rotating_day': {
      // A/B (or A/B/C/D) rotation, advancing by school day
      if (!profile.anchorDate) return null;
      const schoolDaysSinceAnchor = countSchoolDaysBetween(profile.anchorDate, dateStr, exceptions, profile);
      const idx = ((schoolDaysSinceAnchor % profile.days.length) + profile.days.length) % profile.days.length;
      return profile.days[idx];
    }

    case 'alternating_week': {
      // Week A vs Week B
      if (!profile.anchorDate) return null;
      const anchorD = new Date(profile.anchorDate + 'T00:00:00');
      const daysDiff = Math.floor((d - anchorD) / 86400000);
      const weeksDiff = Math.floor(daysDiff / 7);
      const isWeekA = (((weeksDiff % 2) + 2) % 2) === 0;
      // Days are tagged with weekType: 'A' or 'B' and weekdays array
      const weekType = isWeekA ? 'A' : 'B';
      return profile.days.find((day) =>
        day.weekType === weekType && day.weekdays?.includes(weekday)
      ) || null;
    }

    default:
      return profile.days[0] || null;
  }
}

// Given a day template + current time, figure out exactly what's happening NOW
export function getCurrentBlockState(dayTemplate, now = new Date(), classes = []) {
  if (!dayTemplate || !dayTemplate.blocks || dayTemplate.blocks.length === 0) {
    return { state: 'no_school', dayTemplate };
  }

  const blocks = [...dayTemplate.blocks].sort((a, b) =>
    toMinutes(a.startTime) - toMinutes(b.startTime)
  );

  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const firstStart = toMinutes(blocks[0].startTime);
  const lastEnd = toMinutes(blocks[blocks.length - 1].endTime);

  // Enrich blocks with class info
  const enrich = (b) => {
    if (!b) return null;
    const cls = b.classId ? classes.find((c) => c.id === b.classId) : null;
    return {
      ...b,
      class: cls,
      displayName: cls?.name || b.label || (b.blockType === 'lunch' ? 'Lunch' : 'Block'),
      color: cls?.color || b.color || (b.blockType === 'lunch' ? '#22c55e' : '#6366f1'),
    };
  };

  // Before school
  if (nowMin < firstStart) {
    return {
      state: 'before_school',
      dayTemplate,
      nextBlock: enrich(blocks[0]),
      minutesUntilStart: firstStart - nowMin,
    };
  }

  // After school
  if (nowMin >= lastEnd) {
    return { state: 'after_school', dayTemplate };
  }

  // Inside school day — find current or passing
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const start = toMinutes(b.startTime);
    const end = toMinutes(b.endTime);

    if (nowMin >= start && nowMin < end) {
      return {
        state: 'in_block',
        dayTemplate,
        currentBlock: enrich(b),
        nextBlock: enrich(blocks[i + 1]),
        minutesElapsed: nowMin - start,
        minutesRemaining: end - nowMin,
        progressPercent: Math.min(100, ((nowMin - start) / (end - start)) * 100),
      };
    }

    // Passing period between this block and next
    if (i < blocks.length - 1) {
      const nextStart = toMinutes(blocks[i + 1].startTime);
      if (nowMin >= end && nowMin < nextStart) {
        return {
          state: 'passing_period',
          dayTemplate,
          previousBlock: enrich(b),
          nextBlock: enrich(blocks[i + 1]),
          minutesUntilNext: nextStart - nowMin,
        };
      }
    }
  }

  return { state: 'unknown', dayTemplate };
}
