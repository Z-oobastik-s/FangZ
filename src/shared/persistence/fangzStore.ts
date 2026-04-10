export const STORAGE_KEY = 'fangz-save-v1';

export type SessionLogEntry = {
  id: string;
  at: number;
  mode: string;
  wpm: number;
  acc: number;
  errors: number;
  kind: 'standard' | 'speed60' | 'custom';
};

export type QuestState = { id: string; progress: number; done: boolean };

export type CustomGenConfig = {
  wordCount: number;
  shuffle: boolean;
  caseSensitive: boolean;
  charset: 'alpha' | 'alnum' | 'hex';
  strict: boolean;
};

export type FangzSave = {
  schemaVersion: 1;
  profile: {
    id: string;
    nickname: string;
    avatarId: number;
    bio: string;
  };
  stats: {
    totalChars: number;
    totalSessions: number;
    totalSeconds: number;
    sumWpm: number;
    sumAcc: number;
    samples: number;
  };
  sessions: SessionLogEntry[];
  meta: {
    lastLoginDay: string;
    streak: number;
    lastMode: string | null;
    /** Generator mode label for continue (e.g. words, or words after custom:words) */
    lastRunMode: string | null;
    lastRunKind: SessionLogEntry['kind'] | null;
    lastSessionAt: number | null;
    totalPresenceSeconds: number;
  };
  quests: Record<string, QuestState>;
  custom: CustomGenConfig;
  unlocked: string[];
};

const defaultCustom: CustomGenConfig = {
  wordCount: 8,
  shuffle: true,
  caseSensitive: false,
  charset: 'alpha',
  strict: true,
};

function uid(): string {
  return `fz_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultSave(): FangzSave {
  return {
    schemaVersion: 1,
    profile: { id: uid(), nickname: 'OPERATOR', avatarId: 0, bio: '' },
    stats: {
      totalChars: 0,
      totalSessions: 0,
      totalSeconds: 0,
      sumWpm: 0,
      sumAcc: 0,
      samples: 0,
    },
    sessions: [],
    meta: {
      lastLoginDay: '',
      streak: 0,
      lastMode: 'words',
      lastRunMode: 'words',
      lastRunKind: null,
      lastSessionAt: null,
      totalPresenceSeconds: 0,
    },
    quests: {
      daily_chars: { id: 'daily_chars', progress: 0, done: false },
      daily_speed: { id: 'daily_speed', progress: 0, done: false },
      weekly_sessions: { id: 'weekly_sessions', progress: 0, done: false },
    },
    custom: defaultCustom,
    unlocked: [],
  };
}

export function loadSave(): FangzSave {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave();
    const p = JSON.parse(raw) as FangzSave;
    if (p.schemaVersion !== 1) return defaultSave();
    return {
      ...defaultSave(),
      ...p,
      profile: { ...defaultSave().profile, ...p.profile },
      stats: { ...defaultSave().stats, ...p.stats },
      meta: { ...defaultSave().meta, ...p.meta },
      quests: { ...defaultSave().quests, ...p.quests },
      custom: { ...defaultCustom, ...p.custom },
      sessions: Array.isArray(p.sessions) ? p.sessions.slice(-64) : [],
      unlocked: Array.isArray(p.unlocked) ? p.unlocked : [],
    };
  } catch {
    return defaultSave();
  }
}

export function saveStore(data: FangzSave): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function touchDailyStreak(save: FangzSave): FangzSave {
  const day = todayKey();
  if (save.meta.lastLoginDay === day) return save;
  const prev = save.meta.lastLoginDay;
  let streak = save.meta.streak;
  if (!prev) streak = 1;
  else {
    const y = new Date(prev + 'T12:00:00Z');
    const t = new Date(day + 'T12:00:00Z');
    const diff = (t.getTime() - y.getTime()) / 86400000;
    if (diff === 1) streak += 1;
    else if (diff > 1) streak = 1;
  }
  return {
    ...save,
    meta: { ...save.meta, lastLoginDay: day, streak },
  };
}

export function appendSession(
  save: FangzSave,
  entry: Omit<SessionLogEntry, 'id'> & { id?: string },
): FangzSave {
  const row: SessionLogEntry = {
    id: entry.id ?? `s_${Date.now().toString(36)}`,
    at: entry.at,
    mode: entry.mode,
    wpm: entry.wpm,
    acc: entry.acc,
    errors: entry.errors,
    kind: entry.kind,
  };
  const sessions = [row, ...save.sessions].slice(0, 64);
  const stats = {
    ...save.stats,
    totalSessions: save.stats.totalSessions + 1,
    sumWpm: save.stats.sumWpm + entry.wpm,
    sumAcc: save.stats.sumAcc + entry.acc,
    samples: save.stats.samples + 1,
  };
  return { ...save, sessions, stats };
}

export function finalizeSession(
  save: FangzSave,
  entry: Omit<SessionLogEntry, 'id'> & { id?: string },
  delta: { charsTyped: number; durationSec: number },
): FangzSave {
  const base = appendSession(save, entry);
  const q = { ...base.quests };

  const dc = q.daily_chars;
  if (dc && !dc.done) {
    const progress = dc.progress + delta.charsTyped;
    q.daily_chars = { ...dc, progress, done: progress >= 1000 };
  }

  const ds = q.daily_speed;
  if (ds && !ds.done && entry.kind === 'speed60' && entry.wpm >= 65) {
    q.daily_speed = { ...ds, progress: entry.wpm, done: true };
  }

  const ws = q.weekly_sessions;
  if (ws && !ws.done) {
    const progress = ws.progress + 1;
    q.weekly_sessions = { ...ws, progress, done: progress >= 8 };
  }

  const unlocked = [...base.unlocked];
  const tc = base.stats.totalChars + delta.charsTyped;
  if (!unlocked.includes('shard_burst') && tc >= 8000) unlocked.push('shard_burst');
  if (!unlocked.includes('void_pattern') && tc >= 40000) unlocked.push('void_pattern');

  let lastRunMode = entry.mode;
  if (entry.kind === 'speed60') lastRunMode = 'words';
  else if (entry.kind === 'custom' && entry.mode.startsWith('custom:')) lastRunMode = entry.mode.slice(7);

  let out: FangzSave = {
    ...base,
    quests: q,
    unlocked,
    stats: {
      ...base.stats,
      totalChars: base.stats.totalChars + delta.charsTyped,
      totalSeconds: base.stats.totalSeconds + delta.durationSec,
    },
    meta: {
      ...base.meta,
      lastMode: entry.mode,
      lastRunKind: entry.kind,
      lastRunMode,
      lastSessionAt: entry.at,
      totalPresenceSeconds: base.meta.totalPresenceSeconds + delta.durationSec,
    },
  };
  if (delta.charsTyped > 0) out = touchDailyStreak(out);
  return out;
}
