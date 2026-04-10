import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SessionSpec, TrainerExitSnapshot } from './sessionSpec';
import { finalizeSession, loadSave, saveStore, type FangzSave, type SessionLogEntry } from '../shared/persistence/fangzStore';

type FangzContextValue = {
  save: FangzSave;
  persist: (next: FangzSave) => void;
  updateCustom: (partial: Partial<FangzSave['custom']>) => void;
  commitSession: (spec: SessionSpec, snap: TrainerExitSnapshot) => void;
};

const FangzContext = createContext<FangzContextValue | null>(null);

export function FangzProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState(() => loadSave());

  const persist = useCallback((next: FangzSave) => {
    setSave(next);
    saveStore(next);
  }, []);

  const updateCustom = useCallback((partial: Partial<FangzSave['custom']>) => {
    setSave((prev) => {
      const next = { ...prev, custom: { ...prev.custom, ...partial } };
      saveStore(next);
      return next;
    });
  }, []);

  const commitSession = useCallback(
    (spec: SessionSpec, snap: TrainerExitSnapshot) => {
      setSave((prev) => {
        const kind: SessionLogEntry['kind'] =
          spec.kind === 'speed60' ? 'speed60' : spec.kind === 'custom' ? 'custom' : 'standard';
        const modeLabel =
          spec.kind === 'standard' ? spec.mode : spec.kind === 'speed60' ? 'speed60' : `custom:${spec.mode}`;
        const entry: Omit<SessionLogEntry, 'id'> = {
          at: Date.now(),
          mode: modeLabel,
          wpm: Math.round(snap.wpm),
          acc: Math.round(snap.acc),
          errors: snap.incorrectChars,
          kind,
        };
        const next = finalizeSession(prev, entry, {
          charsTyped: snap.correctChars,
          durationSec: snap.durationSec,
        });
        saveStore(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ save, persist, updateCustom, commitSession }),
    [save, persist, updateCustom, commitSession],
  );

  return <FangzContext.Provider value={value}>{children}</FangzContext.Provider>;
}

export function useFangz(): FangzContextValue {
  const v = useContext(FangzContext);
  if (!v) throw new Error('useFangz requires FangzProvider');
  return v;
}
