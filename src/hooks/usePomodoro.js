import { useRef, useState, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const DURATIONS = { work: 25 * 60, break: 5 * 60, long: 15 * 60 };

export function usePomodoro() {
  const logSession = useAppStore((s) => s.logPomodoroSession);

  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work);
  const [active, setActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Refs hold mutable current values so the interval never closes over stale state
  const modeRef = useRef('work');
  const timeRef = useRef(DURATIONS.work);
  const sessionsRef = useRef(0);
  const intervalRef = useRef(null);

  modeRef.current = mode;
  timeRef.current = timeLeft;
  sessionsRef.current = sessions;

  const tick = useCallback(() => {
    if (timeRef.current > 1) {
      setTimeLeft((t) => t - 1);
      return;
    }

    // Session complete
    const currentMode = modeRef.current;
    if (currentMode === 'work') {
      logSession({ duration_minutes: 25, mode: 'work' });
      const newSessions = sessionsRef.current + 1;
      setSessions(newSessions);
      const nextMode = newSessions % 4 === 0 ? 'long' : 'break';
      setMode(nextMode);
      setTimeLeft(DURATIONS[nextMode]);
    } else {
      setMode('work');
      setTimeLeft(DURATIONS.work);
    }
  }, [logSession]);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [active, tick]);

  const start = useCallback(() => setActive(true), []);
  const pause = useCallback(() => setActive(false), []);
  const reset = useCallback(() => {
    setActive(false);
    setMode('work');
    setTimeLeft(DURATIONS.work);
  }, []);
  const skip = useCallback(() => {
    const currentMode = modeRef.current;
    if (currentMode === 'work') {
      const nextMode = (sessionsRef.current + 1) % 4 === 0 ? 'long' : 'break';
      setMode(nextMode);
      setTimeLeft(DURATIONS[nextMode]);
    } else {
      setMode('work');
      setTimeLeft(DURATIONS.work);
    }
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / DURATIONS[mode];

  return {
    mode, timeLeft, active, sessions,
    display: `${minutes}:${seconds}`,
    progress,
    start, pause, reset, skip,
  };
}
