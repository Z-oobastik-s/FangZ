import type { MessageKey } from '../i18n/messages';
import type { Locale } from '../i18n/types';
import type { SessionLogEntry } from '../persistence/fangzStore';

type T = (k: MessageKey) => string;

export function formatPresenceSeconds(sec: number, t: T): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return t('hubPresenceFmt').replace('{h}', String(h)).replace('{m}', String(m));
}

export function formatHistoryTimestamp(at: number, locale: Locale): string {
  const tag = locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-GB';
  try {
    return new Date(at).toLocaleString(tag, { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return new Date(at).toISOString().replace('T', ' ').slice(0, 19);
  }
}

export function formatSessionKindLabel(kind: SessionLogEntry['kind'], t: T): string {
  switch (kind) {
    case 'standard':
      return t('sessionKindStandard');
    case 'speed60':
      return t('sessionKindSpeed');
    case 'custom':
      return t('sessionKindCustom');
    default:
      return t('sessionKindStandard');
  }
}

const modeToKey: Record<string, MessageKey> = {
  words: 'modeWords',
  letters: 'modeLetters',
  burst: 'modeBurst',
  pattern: 'modePattern',
};

export function formatSessionModeLabel(mode: string, t: T): string {
  if (mode === 'speed60') return t('sessionModeSpeed60');
  if (mode.startsWith('custom:')) {
    const rest = mode.slice(7);
    const key = modeToKey[rest] ?? 'modeWords';
    return `${t('sessionModeCustomPrefix')} · ${t(key)}`;
  }
  const key = modeToKey[mode] ?? 'modeWords';
  return t(key);
}
