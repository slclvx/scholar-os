import { uid } from '../../utils/helpers';
import { todayStr } from '../../utils/dates';

// Pre-built starter profile: A/B Block, 4 classes per day, no times yet
const SEED_PROFILE = {
  id: uid(),
  name: 'My A/B Schedule',
  rotationType: 'rotating_day', // alternates A then B based on school days
  anchorDate: todayStr(), // user can change this; "today is A day"
  days: [
    {
      id: uid(),
      label: 'A Day',
      weekType: 'A',
      blocks: [
        { id: uid(), label: 'Block 1', startTime: '08:00', endTime: '09:30', classId: null, blockType: 'class' },
        { id: uid(), label: 'Block 2', startTime: '09:40', endTime: '11:10', classId: null, blockType: 'class' },
        { id: uid(), label: 'Lunch',   startTime: '11:10', endTime: '11:50', classId: null, blockType: 'lunch' },
        { id: uid(), label: 'Block 3', startTime: '11:55', endTime: '13:25', classId: null, blockType: 'class' },
        { id: uid(), label: 'Block 4', startTime: '13:35', endTime: '15:05', classId: null, blockType: 'class' },
      ],
    },
    {
      id: uid(),
      label: 'B Day',
      weekType: 'B',
      blocks: [
        { id: uid(), label: 'Block 5', startTime: '08:00', endTime: '09:30', classId: null, blockType: 'class' },
        { id: uid(), label: 'Block 6', startTime: '09:40', endTime: '11:10', classId: null, blockType: 'class' },
        { id: uid(), label: 'Lunch',   startTime: '11:10', endTime: '11:50', classId: null, blockType: 'lunch' },
        { id: uid(), label: 'Block 7', startTime: '11:55', endTime: '13:25', classId: null, blockType: 'class' },
        { id: uid(), label: 'Block 8', startTime: '13:35', endTime: '15:05', classId: null, blockType: 'class' },
      ],
    },
  ],
};

export const createScheduleSlice = (set) => ({
  scheduleProfiles: [SEED_PROFILE],
  activeProfileId: SEED_PROFILE.id,
  scheduleExceptions: {}, // { 'YYYY-MM-DD': { type, overrideDayId, customBlocks, note } }
  notificationsEnabled: false,

  // ── Profile management ────────────────────────────────────────────────
  addScheduleProfile: (data) => set((s) => {
    const profile = {
      id: uid(),
      name: 'New Schedule',
      rotationType: 'weekly',
      anchorDate: todayStr(),
      days: [],
      ...data,
    };
    return {
      scheduleProfiles: [...s.scheduleProfiles, profile],
      activeProfileId: s.activeProfileId || profile.id,
    };
  }),
  updateScheduleProfile: (id, data) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) => p.id === id ? { ...p, ...data } : p),
  })),
  deleteScheduleProfile: (id) => set((s) => {
    const remaining = s.scheduleProfiles.filter((p) => p.id !== id);
    return {
      scheduleProfiles: remaining,
      activeProfileId: s.activeProfileId === id ? (remaining[0]?.id || null) : s.activeProfileId,
    };
  }),
  duplicateScheduleProfile: (id) => set((s) => {
    const orig = s.scheduleProfiles.find((p) => p.id === id);
    if (!orig) return {};
    // Deep clone and assign new IDs
    const cloned = {
      ...orig,
      id: uid(),
      name: orig.name + ' (Copy)',
      days: orig.days.map((day) => ({
        ...day,
        id: uid(),
        blocks: day.blocks.map((b) => ({ ...b, id: uid() })),
      })),
    };
    return { scheduleProfiles: [...s.scheduleProfiles, cloned] };
  }),
  setActiveProfile: (id) => set({ activeProfileId: id }),

  // ── Day management ────────────────────────────────────────────────────
  addDay: (profileId, dayData) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            days: [...p.days, {
              id: uid(),
              label: dayData?.label || `Day ${p.days.length + 1}`,
              blocks: [],
              ...dayData,
            }],
          }
        : p
    ),
  })),
  updateDay: (profileId, dayId, data) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId
        ? { ...p, days: p.days.map((d) => d.id === dayId ? { ...d, ...data } : d) }
        : p
    ),
  })),
  deleteDay: (profileId, dayId) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId ? { ...p, days: p.days.filter((d) => d.id !== dayId) } : p
    ),
  })),

  // ── Block management ──────────────────────────────────────────────────
  addBlock: (profileId, dayId, blockData) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            days: p.days.map((d) =>
              d.id === dayId
                ? {
                    ...d,
                    blocks: [...d.blocks, {
                      id: uid(),
                      label: 'New Block',
                      startTime: '08:00',
                      endTime: '09:00',
                      classId: null,
                      blockType: 'class',
                      ...blockData,
                    }],
                  }
                : d
            ),
          }
        : p
    ),
  })),
  updateBlock: (profileId, dayId, blockId, data) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            days: p.days.map((d) =>
              d.id === dayId
                ? { ...d, blocks: d.blocks.map((b) => b.id === blockId ? { ...b, ...data } : b) }
                : d
            ),
          }
        : p
    ),
  })),
  deleteBlock: (profileId, dayId, blockId) => set((s) => ({
    scheduleProfiles: s.scheduleProfiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            days: p.days.map((d) =>
              d.id === dayId ? { ...d, blocks: d.blocks.filter((b) => b.id !== blockId) } : d
            ),
          }
        : p
    ),
  })),

  // ── Exceptions (holidays, override days, etc) ─────────────────────────
  setException: (dateStr, exception) => set((s) => ({
    scheduleExceptions: { ...s.scheduleExceptions, [dateStr]: exception },
  })),
  removeException: (dateStr) => set((s) => {
    const { [dateStr]: _, ...rest } = s.scheduleExceptions;
    return { scheduleExceptions: rest };
  }),

  // ── Notifications toggle ──────────────────────────────────────────────
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
});
