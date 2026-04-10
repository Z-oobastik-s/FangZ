import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { computeAccuracy, computeCpm, computeWpm } from '../../shared/lib/metrics';
import { playErrorBlast, playStrikeTick, playTerminateDrone, resumeAudio } from '../../shared/lib/audio';
import { pulseError, pulseTerminate } from '../../shared/lib/haptics';
import type { GeneratorMode } from './types';
import { createInitialTrainerState, trainerReducer } from './typingReducer';

export function useTypingTrainer(soundEnabled: boolean) {
  const [state, dispatch] = useReducer(trainerReducer, undefined, () => createInitialTrainerState());
  const [now, setNow] = useState(() => Date.now());
  const prev = useRef(state);

  useEffect(() => {
    if (state.sessionStartedAt && state.status === 'live') {
      const id = window.setInterval(() => setNow(Date.now()), 200);
      return () => window.clearInterval(id);
    }
    setNow(Date.now());
    return undefined;
  }, [state.sessionStartedAt, state.status]);

  useEffect(() => {
    const p = prev.current;
    prev.current = state;
    if (state.pulseId === p.pulseId) return;

    if (state.correctChars > p.correctChars) {
      if (soundEnabled) void resumeAudio().then(() => playStrikeTick());
    }
    if (state.incorrectChars > p.incorrectChars) {
      if (soundEnabled) void resumeAudio().then(() => playErrorBlast());
      pulseError(state.strikes);
    }
    if (state.status === 'dead' && p.status !== 'dead') {
      if (soundEnabled) void resumeAudio().then(() => playTerminateDrone());
      pulseTerminate();
    }
  }, [soundEnabled, state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.status === 'dead') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Tab') return;
      if (e.repeat) return;
      const k = e.key;
      if (k.length > 1 && k !== ' ') return;
      if (k === ' ') e.preventDefault();
      dispatch({ type: 'KEY', key: k, at: Date.now() });
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [state.status]);

  const metrics = useMemo(
    () => ({
      wpm: computeWpm(state.correctChars, state.sessionStartedAt, now),
      cpm: computeCpm(state.correctChars, state.sessionStartedAt, now),
      accuracy: computeAccuracy(state.correctChars, state.incorrectChars),
    }),
    [now, state.correctChars, state.incorrectChars, state.sessionStartedAt],
  );

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const setMode = useCallback((mode: GeneratorMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  return { state, metrics, restart, setMode };
}
