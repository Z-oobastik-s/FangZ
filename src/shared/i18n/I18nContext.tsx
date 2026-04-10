import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { formatStrikesA11y, getMessage, type MessageKey } from './messages';
import { isLocale, type Locale } from './types';

const STORAGE_KEY = 'fangz-locale';

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const raw = navigator.language?.toLowerCase() ?? 'en';
  if (raw.startsWith('uk') || raw.startsWith('ua')) return 'uk';
  if (raw.startsWith('ru')) return 'ru';
  return 'en';
}

function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && isLocale(v)) return v;
  } catch {
    /* ignore */
  }
  return null;
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: MessageKey) => string;
  strikesA11y: (strikes: number, index: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? detectLocale());

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'uk' ? 'uk' : locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => getMessage(locale, key),
      strikesA11y: (s, i) => formatStrikesA11y(locale, s, i),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n outside I18nProvider');
  return ctx;
}
