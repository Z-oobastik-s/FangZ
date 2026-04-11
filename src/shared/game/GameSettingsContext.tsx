import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const SFX_KEY = 'fangz-sfx-enabled';

function readSfx(): boolean {
  try {
    const v = localStorage.getItem(SFX_KEY);
    if (v === '0') return false;
    return true;
  } catch {
    return true;
  }
}

type Value = {
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  toggleSound: () => void;
};

const Ctx = createContext<Value | null>(null);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(readSfx);

  const setSoundEnabled = useCallback((v: boolean) => {
    setSoundEnabledState(v);
    try {
      localStorage.setItem(SFX_KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SFX_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ soundEnabled, setSoundEnabled, toggleSound }),
    [soundEnabled, setSoundEnabled, toggleSound],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGameSettings(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGameSettings requires GameSettingsProvider');
  return v;
}
