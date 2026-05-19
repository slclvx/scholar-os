import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { fromMinutes, toMinutes, getDayTemplate } from '../../utils/scheduleEngine';
import { todayStr, formatFull } from '../../utils/dates';
import {
  Modal, FormField, Input, Select, Btn, IconBtn,
  SectionHeader, Card, Empty, Tabs
} from '../shared/UI';
import { requestNotificationPermission } from '../../hooks/useClassChangeNotifications';

const WEEKDAYS = [
  { val: 1, label: 'Mon' },
  { val: 2, label: 'Tue' },
  { val: 3, label: 'Wed' },
  { val: 4, label: 'Thu' },
  { val: 5, label: 'Fri' },
  { val: 0, label: 'Sun' },
  { val: 6, label: 'Sat' },
];

const BLOCK_TYPES = [
  { val: 'class', label: 'Class', emoji: '📚' },
  { val: 'lunch', label: 'Lunch', emoji: '🍽' },
  { val: 'break', label: 'Break', emoji: '☕' },
  { val: 'study_hall', label: 'Study Hall', emoji: '📖' },
  { val: 'passing', label: 'Passing', emoji: '🚶' },
  { val: 'custom', label: 'Custom', emoji: '✨' },
];

const ROTATION_OPTIONS = [
  { val: 'rotating_day', label: 'Rotating (A/B, or A/B/C/D)', desc: 'Days alternate based on school days' },
  { val: 'weekly', label: 'Weekly (same every Mon, Tue, etc)', desc: 'Each weekday has fixed classes' },
  { val: 'alternating_week', label: 'Alternating weeks (Week A / Week B)', desc: 'Schedule flips each week' },
];

export default function SchedulePage() {
  const profiles = useAppStore((s) => s.scheduleProfiles);
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const classes = useAppStore((s) => s.classes);
  const exceptions = useAppStore((s) => s.scheduleExceptions);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);

  const setActiveProfile = useAppStore((s) => s.setActiveProfile);
  const addScheduleProfile = useAppStore((s) => s.addScheduleProfile);
  const updateScheduleProfile = useAppStore((s) => s.updateScheduleProfile);
  const deleteScheduleProfile = useAppStore((s) => s.deleteScheduleProfile);
  const duplicateScheduleProfile = useAppStore((s) => s.duplicateScheduleProfile);

  const addDay = useAppStore((s) => s.addDay);
  const updateDay = useAppStore((s) => s.updateDay);
  const deleteDay = useAppStore((s) => s.deleteDay);

  const addBlock = useAppStore((s) => s.addBlock);
  const updateBlock = useAppStore((s) => s.updateBlock);
  const deleteBlock = useAppStore((s) => s.deleteBlock);

  const setException = useAppStore((s) => s.setException);
  const removeException = useAppStore((s) => s.removeException);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);

  const profile = profiles.find((p) => p.id === activeProfileId);
  const [activeDayId, setActiveDayId] = useState(profile?.days[0]?.id);
  const [profileModal, setProfileModal] = useState(null);
  const [blockModal, setBlockModal] = useState(null);
  const [exceptionModal, setExceptionModal] = useState(null);

  const today = todayStr();
  const todayTemplate = profile ? getDayTemplate(profile, today, exceptions) : null;

  const handleEnableNotifs = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setNotificationsEnabled(true);
    } else if (result === 'denied') {
      alert('Notifications were blocked. You can re-enable them in your browser settings.');
    } else if (result === 'unsupported') {
      alert('Your browser does not support notifications.');
    }
  };

  if (!profile) {
    return (
      <div>
        <SectionHeader title="Schedule" subtitle="Set up your school schedule to enable Live Now" />
        <Empty
          icon="📅"
          text="No schedule profile yet"
          action={() => setProfileModal({ name: 'My Schedule', rotationType: 'rotating_day', anchorDate: today, days: [], _new: true })}
          actionLabel="+ Create Schedule"
        />
      </div>
    );
  }

  const activeDay = profile.days.find((d) => d.id === activeDayId) || profile.days[0];
  const dayTabs = profile.days.map((d) => ({ id: d.id, label: d.label }));

  return (
    <div>
      <SectionHeader
        title="Schedule"
        subtitle="Build your school day — Live Now uses this to show your current class"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" onClick={handleEnableNotifs}>
              {notificationsEnabled ? '🔔 Notifications On' : '🔕 Enable Notifications'}
            </Btn>
            <Btn onClick={() => setProfileModal({ name: 'New Schedule', rotationType: 'rotating_day', anchorDate: today, days: [], _new: true })}>
              + New Profile
            </Btn>
          </div>
        }
      />

      {/* Profile selector */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>Active Schedule</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Select
                value={activeProfileId}
                onChange={(e) => { setActiveProfile(e.target.value); const p = profiles.find(x => x.id === e.target.value); setActiveDayId(p?.days[0]?.id); }}
                style={{ flex: 1, maxWidth: 320 }}
              >
                {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <Btn variant="ghost" onClick={() => setProfileModal({ ...profile })}>Edit</Btn>
              <Btn variant="ghost" onClick={() => duplicateScheduleProfile(profile.id)}>Duplicate</Btn>
              {profiles.length > 1 && (
                <Btn variant="ghost" onClick={() => { if (confirm('Delete this schedule?')) deleteScheduleProfile(profile.id); }}>Delete</Btn>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
              {ROTATION_OPTIONS.find((o) => o.val === profile.rotationType)?.label}
              {profile.rotationType !== 'weekly' && profile.anchorDate && ` · Anchor: ${profile.anchorDate}`}
            </div>
          </div>
          {todayTemplate && (
            <div style={{ background: 'hsl(222,84%,5%)', padding: '10px 16px', borderRadius: 10, textAlign: 'center', minWidth: 110 }}>
              <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Today is</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#a5b4fc', marginTop: 2 }}>{todayTemplate.label}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Day tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {dayTabs.length > 0 && (
          <Tabs tabs={dayTabs} active={activeDayId || dayTabs[0].id} onChange={setActiveDayId} />
        )}
        <button
          onClick={() => {
            addDay(profile.id, { label: `Day ${profile.days.length + 1}` });
          }}
          style={{
            padding: '6px 14px', borderRadius: 7,
            background: 'transparent', border: '1px dashed hsl(217,33%,20%)',
            color: '#64748b', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            marginBottom: 20,
          }}
        >
          + Day
        </button>
      </div>

      {/* Active day editor */}
      {activeDay ? (
        <Card padding={0}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid hsl(217,33%,15%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <input
                value={activeDay.label}
                onChange={(e) => updateDay(profile.id, activeDay.id, { label: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: '#f1f5f9', fontSize: 17, fontWeight: 700, outline: 'none', fontFamily: 'inherit', width: 180 }}
              />
              {/* Weekday selection for weekly/alternating */}
              {(profile.rotationType === 'weekly' || profile.rotationType === 'alternating_week') && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {WEEKDAYS.map((wd) => {
                    const on = activeDay.weekdays?.includes(wd.val);
                    return (
                      <button
                        key={wd.val}
                        onClick={() => {
                          const cur = activeDay.weekdays || [];
                          const next = on ? cur.filter((v) => v !== wd.val) : [...cur, wd.val];
                          updateDay(profile.id, activeDay.id, { weekdays: next });
                        }}
                        style={{
                          padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: on ? '#6366f1' : 'transparent',
                          color: on ? '#fff' : '#475569',
                          border: `1px solid ${on ? '#6366f1' : 'hsl(217,33%,15%)'}`,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        {wd.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {profile.rotationType === 'alternating_week' && (
                <Select value={activeDay.weekType || 'A'} onChange={(e) => updateDay(profile.id, activeDay.id, { weekType: e.target.value })} style={{ width: 100 }}>
                  <option value="A">Week A</option>
                  <option value="B">Week B</option>
                </Select>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" onClick={() => setBlockModal({ profileId: profile.id, dayId: activeDay.id, startTime: '08:00', endTime: '09:00', label: 'New Block', blockType: 'class', classId: '', _new: true })}>
                + Block
              </Btn>
              {profile.days.length > 1 && (
                <IconBtn danger onClick={() => { if (confirm(`Delete ${activeDay.label}?`)) deleteDay(profile.id, activeDay.id); }}>🗑</IconBtn>
              )}
            </div>
          </div>

          {/* Block list */}
          <div style={{ padding: 4 }}>
            {activeDay.blocks.length === 0 ? (
              <Empty icon="⏰" text="No blocks yet — add your first class" action={() => setBlockModal({ profileId: profile.id, dayId: activeDay.id, startTime: '08:00', endTime: '09:00', label: 'Block 1', blockType: 'class', classId: '', _new: true })} actionLabel="+ Add Block" />
            ) : (
              [...activeDay.blocks]
                .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
                .map((b) => {
                  const cls = classes.find((c) => c.id === b.classId);
                  const blockTypeInfo = BLOCK_TYPES.find((t) => t.val === b.blockType) || BLOCK_TYPES[0];
                  return (
                    <div key={b.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 8, margin: 4,
                      borderLeft: `3px solid ${cls?.color || b.color || '#475569'}`,
                      background: 'hsl(222,84%,5%)',
                    }}>
                      <div style={{ minWidth: 130, fontSize: 13, color: '#cbd5e1', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {fromMinutes(toMinutes(b.startTime))} — {fromMinutes(toMinutes(b.endTime))}
                      </div>
                      <span style={{ fontSize: 16 }}>{blockTypeInfo.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                          {cls?.name || b.label || blockTypeInfo.label}
                        </div>
                        {cls && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {cls.teacher} {cls.room && `· Room ${cls.room}`}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
                        {Math.round((toMinutes(b.endTime) - toMinutes(b.startTime)))}m
                      </div>
                      <IconBtn onClick={() => setBlockModal({ ...b, profileId: profile.id, dayId: activeDay.id })}>✏️</IconBtn>
                      <IconBtn danger onClick={() => deleteBlock(profile.id, activeDay.id, b.id)}>🗑</IconBtn>
                    </div>
                  );
                })
            )}
          </div>
        </Card>
      ) : (
        <Empty icon="📅" text="No day templates yet" action={() => addDay(profile.id, { label: 'Day 1' })} actionLabel="+ Add First Day" />
      )}

      {/* Exceptions section */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', margin: 0, letterSpacing: 1.2, textTransform: 'uppercase' }}>Exceptions & Holidays</h3>
          <Btn variant="ghost" onClick={() => setExceptionModal({ date: today, type: 'holiday', note: '', _new: true })}>
            + Add Exception
          </Btn>
        </div>
        {Object.keys(exceptions || {}).length === 0 ? (
          <div style={{ padding: '16px 20px', background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 12, color: '#475569', fontSize: 13 }}>
            No exceptions. Add holidays, minimum days, or override days here.
          </div>
        ) : (
          <Card padding={0}>
            {Object.entries(exceptions).sort(([a], [b]) => a.localeCompare(b)).map(([dateStr, ex]) => (
              <div key={dateStr} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid hsl(222,47%,6%)' }}>
                <div style={{ minWidth: 130, fontSize: 13, color: '#cbd5e1' }}>{formatFull(dateStr)}</div>
                <span style={{ fontSize: 11, padding: '2px 8px', background: 'hsl(217,33%,14%)', borderRadius: 12, color: '#a5b4fc', fontWeight: 600 }}>{ex.type.replace('_', ' ')}</span>
                <div style={{ flex: 1, fontSize: 12, color: '#64748b' }}>{ex.note}</div>
                <IconBtn danger onClick={() => removeException(dateStr)}>🗑</IconBtn>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Profile modal */}
      {profileModal && (
        <Modal title={profileModal._new ? 'New Schedule Profile' : 'Edit Profile'} onClose={() => setProfileModal(null)}>
          <FormField label="Profile Name">
            <Input value={profileModal.name} onChange={(e) => setProfileModal({ ...profileModal, name: e.target.value })} placeholder="e.g. OC Comets A/B" autoFocus />
          </FormField>
          <FormField label="Rotation Type">
            <Select value={profileModal.rotationType} onChange={(e) => setProfileModal({ ...profileModal, rotationType: e.target.value })}>
              {ROTATION_OPTIONS.map((o) => <option key={o.val} value={o.val}>{o.label}</option>)}
            </Select>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
              {ROTATION_OPTIONS.find((o) => o.val === profileModal.rotationType)?.desc}
            </div>
          </FormField>
          {profileModal.rotationType !== 'weekly' && (
            <FormField label="Anchor Date" hint="The starting date for the rotation. For A/B: pick a school day you know was 'A'.">
              <Input type="date" value={profileModal.anchorDate} onChange={(e) => setProfileModal({ ...profileModal, anchorDate: e.target.value })} />
            </FormField>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn onClick={() => {
              if (!profileModal.name?.trim()) return;
              if (profileModal._new) {
                const { _new, ...d } = profileModal;
                addScheduleProfile(d);
              } else {
                updateScheduleProfile(profileModal.id, profileModal);
              }
              setProfileModal(null);
            }} style={{ flex: 1 }}>Save</Btn>
            <Btn variant="ghost" onClick={() => setProfileModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Block modal */}
      {blockModal && (
        <Modal title={blockModal._new ? 'New Block' : 'Edit Block'} onClose={() => setBlockModal(null)}>
          <FormField label="Block Type">
            <Select value={blockModal.blockType} onChange={(e) => setBlockModal({ ...blockModal, blockType: e.target.value })}>
              {BLOCK_TYPES.map((t) => <option key={t.val} value={t.val}>{t.emoji} {t.label}</option>)}
            </Select>
          </FormField>
          {blockModal.blockType === 'class' && (
            <FormField label="Class (optional)" hint="Link to a class from your Classes page for grade, teacher, color">
              <Select value={blockModal.classId || ''} onChange={(e) => setBlockModal({ ...blockModal, classId: e.target.value || null })}>
                <option value="">— No class (use label below) —</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
          )}
          <FormField label="Label" hint="Used if no class is linked">
            <Input value={blockModal.label} onChange={(e) => setBlockModal({ ...blockModal, label: e.target.value })} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Start Time"><Input type="time" value={blockModal.startTime} onChange={(e) => setBlockModal({ ...blockModal, startTime: e.target.value })} /></FormField>
            <FormField label="End Time"><Input type="time" value={blockModal.endTime} onChange={(e) => setBlockModal({ ...blockModal, endTime: e.target.value })} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn onClick={() => {
              if (blockModal._new) {
                const { _new, profileId, dayId, ...d } = blockModal;
                addBlock(profileId, dayId, d);
              } else {
                const { profileId, dayId, id, ...d } = blockModal;
                updateBlock(profileId, dayId, id, d);
              }
              setBlockModal(null);
            }} style={{ flex: 1 }}>Save</Btn>
            <Btn variant="ghost" onClick={() => setBlockModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Exception modal */}
      {exceptionModal && (
        <Modal title="Schedule Exception" onClose={() => setExceptionModal(null)}>
          <FormField label="Date"><Input type="date" value={exceptionModal.date} onChange={(e) => setExceptionModal({ ...exceptionModal, date: e.target.value })} /></FormField>
          <FormField label="Type">
            <Select value={exceptionModal.type} onChange={(e) => setExceptionModal({ ...exceptionModal, type: e.target.value })}>
              <option value="holiday">Holiday (no school)</option>
              <option value="no_school">No school</option>
              <option value="override_day">Override with different day</option>
            </Select>
          </FormField>
          {exceptionModal.type === 'override_day' && (
            <FormField label="Use this day's schedule instead">
              <Select value={exceptionModal.overrideDayId || ''} onChange={(e) => setExceptionModal({ ...exceptionModal, overrideDayId: e.target.value })}>
                <option value="">— Pick a day —</option>
                {profile.days.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </Select>
            </FormField>
          )}
          <FormField label="Note (optional)"><Input value={exceptionModal.note || ''} onChange={(e) => setExceptionModal({ ...exceptionModal, note: e.target.value })} placeholder="e.g. Memorial Day, Snow Day" /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn onClick={() => {
              const { _new, date, ...rest } = exceptionModal;
              setException(date, rest);
              setExceptionModal(null);
            }} style={{ flex: 1 }}>Save</Btn>
            <Btn variant="ghost" onClick={() => setExceptionModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
