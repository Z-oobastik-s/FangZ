import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AMBIENT_SRC } from './ambientPaths';

const VOL_KEY = 'fangz-ambient-volume';
const ENABLED_KEY = 'fangz-ambient-enabled';

/** Default about 8% (within requested 5-10%). */
const DEFAULT_VOLUME = 0.08;
const BOOT_DELAY_MS = 5000;

function readVolume(): number {
  try {
    const raw = localStorage.getItem(VOL_KEY);
    if (raw == null) return DEFAULT_VOLUME;
    const n = Number(raw);
    if (!Number.isFinite(n)) return DEFAULT_VOLUME;
    return Math.min(1, Math.max(0, n));
  } catch {
    return DEFAULT_VOLUME;
  }
}

function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(ENABLED_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}

function attachUnlock(el: HTMLAudioElement): void {
  const unlock = () => {
    el.play().catch(() => undefined);
  };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

type AmbientContextValue = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const AmbientContext = createContext<AmbientContextValue | null>(null);

export function AmbientProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(readEnabled);
  const [volume, setVolumeState] = useState(readVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bootDoneRef = useRef(false);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      localStorage.setItem(ENABLED_KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolumeState(next);
    try {
      localStorage.setItem(VOL_KEY, String(next));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = enabled ? volume : 0;
  }, [enabled, volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (!enabled) {
      el.pause();
      return;
    }

    const attempt = () => {
      el.play().catch(() => attachUnlock(el));
    };

    if (bootDoneRef.current) {
      attempt();
      return;
    }

    const id = window.setTimeout(() => {
      bootDoneRef.current = true;
      attempt();
    }, BOOT_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [enabled]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      volume,
      setVolume,
    }),
    [enabled, setEnabled, volume, setVolume],
  );

  return (
    <AmbientContext.Provider value={value}>
      <audio ref={audioRef} src={AMBIENT_SRC} loop preload="auto" className="hidden" aria-hidden="true" />
      {children}
    </AmbientContext.Provider>
  );
}

export function useAmbient(): AmbientContextValue {
  const ctx = useContext(AmbientContext);
  if (!ctx) throw new Error('useAmbient outside AmbientProvider');
  return ctx;
}
