import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getDayTemplate, getCurrentBlockState } from '../utils/scheduleEngine';
import { todayStr } from '../utils/dates';

export function useCurrentClass() {
  const profiles = useAppStore((s) => s.scheduleProfiles);
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const exceptions = useAppStore((s) => s.scheduleExceptions);
  const classes = useAppStore((s) => s.classes);

  // Re-render every 30 seconds to keep "minutes remaining" current
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const profile = profiles?.find((p) => p.id === activeProfileId);
  if (!profile) return { state: 'no_schedule', message: 'No schedule set up yet' };

  const today = todayStr();
  const dayTemplate = getDayTemplate(profile, today, exceptions || {});

  if (!dayTemplate) {
    const weekday = new Date().getDay();
    if (weekday === 0 || weekday === 6) {
      return { state: 'weekend', message: weekday === 0 ? 'Happy Sunday!' : 'Happy Saturday!' };
    }
    if (exceptions?.[today]?.type === 'holiday') {
      return { state: 'holiday', message: exceptions[today].note || 'Holiday — no school' };
    }
    return { state: 'no_school', message: 'No school today' };
  }

  return getCurrentBlockState(dayTemplate, new Date(), classes);
}
