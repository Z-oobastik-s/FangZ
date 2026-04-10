import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'fangz-animations';

function readStored(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === '0') return false;
    return true;
  } catch {
    return true;
  }
}

/** Call before React mounts so the first paint respects saved preference. */
export function applyAnimationsAttrFromStorage(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-animations', readStored() ? 'on' : 'off');
}

type AnimationPreferenceValue = {
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  toggleAnimations: () => void;
};

const AnimationPreferenceContext = createContext<AnimationPreferenceValue | null>(null);

export function AnimationPreferenceProvider({ children }: { children: ReactNode }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(readStored);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-animations', animationsEnabled ? 'on' : 'off');
    try {
      localStorage.setItem(STORAGE_KEY, animationsEnabled ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [animationsEnabled]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled((v) => !v);
  }, []);

  const value = useMemo(
    () => ({
      animationsEnabled,
      setAnimationsEnabled,
      toggleAnimations,
    }),
    [animationsEnabled, toggleAnimations],
  );

  return (
    <AnimationPreferenceContext.Provider value={value}>{children}</AnimationPreferenceContext.Provider>
  );
}

export function useAnimationPreference(): AnimationPreferenceValue {
  const ctx = useContext(AnimationPreferenceContext);
  if (!ctx) throw new Error('useAnimationPreference requires AnimationPreferenceProvider');
  return ctx;
}
