import { useEffect, useRef } from 'react';
import { useCurrentClass } from './useCurrentClass';
import { useAppStore } from '../store/useAppStore';
import { formatRemaining } from '../utils/scheduleEngine';

export function useClassChangeNotifications() {
  const current = useCurrentClass();
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const lastNotifiedBlockId = useRef(null);

  useEffect(() => {
    if (!notificationsEnabled) return;
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    if (current.state === 'in_block' && current.currentBlock) {
      const blockId = current.currentBlock.id;

      if (lastNotifiedBlockId.current !== blockId) {
        lastNotifiedBlockId.current = blockId;

        const name = current.currentBlock.displayName;
        const cls = current.currentBlock.class;
        const room = cls?.room ? ` · Room ${cls.room}` : '';
        const teacher = cls?.teacher ? ` · ${cls.teacher}` : '';

        try {
          new Notification(`📚 ${name} starting`, {
            body: `${formatRemaining(current.minutesRemaining)} remaining${room}${teacher}`,
            icon: '/favicon.svg',
            tag: 'class-change',
            silent: false,
          });
        } catch (e) {
          // silent fail — some browsers throw if permission revoked between checks
        }
      }
    }

    if (current.state === 'passing_period' && current.nextBlock) {
      const passingKey = 'passing-' + current.nextBlock.id;

      if (lastNotifiedBlockId.current !== passingKey) {
        lastNotifiedBlockId.current = passingKey;

        try {
          new Notification(`🚶 Passing period`, {
            body: `${current.nextBlock.displayName} in ${formatRemaining(current.minutesUntilNext)}`,
            icon: '/favicon.svg',
            tag: 'class-change',
          });
        } catch (e) {}
      }
    }
  }, [current, notificationsEnabled]);
}

export async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}
