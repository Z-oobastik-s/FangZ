import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { computeAccuracy, computeCpm, computeWpm } from '../../shared/lib/metrics';
import { playErrorBlast, playStrikeTick, playTerminateDrone, resumeAudio } from '../../shared/lib/audio';
import { pulseError, pulseTerminate } from '../../shared/lib/haptics';
import type { GeneratorMode } from './types';
import { trainerReducer } from './typingReducer';
import type { TrainerState } from './types';

const WALL_TICK_MS = 480;

type Opts = { inputEnabled?: boolean };

export function useTypingTrainer(soundEnabled: boolean, initialState: TrainerState, opts: Opts = {}) {
  const inputEnabled = opts.inputEnabled !== false;
  const [state, dispatch] = useReducer(trainerReducer, initialState, (s) => s);
  const [wallTime, setWallTime] = useState(() => Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;
  const prev = useRef(state);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    if (!state.sessionStartedAt || state.status !== 'live') return;
    const tick = () => setWallTime(Date.now());
    const id = window.setInterval(tick, WALL_TICK_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [state.sessionStartedAt, state.status]);

  useEffect(() => {
    const p = prev.current;
    prev.current = state;
    if (state.pulseId === p.pulseId) return;

    const se = soundEnabledRef.current;
    if (state.correctChars > p.correctChars) {
      if (se) void resumeAudio().then(() => playStrikeTick());
    }
    if (state.incorrectChars > p.incorrectChars) {
      if (se) void resumeAudio().then(() => playErrorBlast());
      pulseError(state.strikes);
    }
    if (state.status === 'dead' && p.status !== 'dead') {
      if (se) void resumeAudio().then(() => playTerminateDrone());
      pulseTerminate();
    }
  }, [state]);

  useEffect(() => {
    if (!inputEnabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (stateRef.current.status === 'dead') return;
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
  }, [inputEnabled]);

  const metrics = useMemo(
    () => ({
      wpm: computeWpm(state.correctChars, state.sessionStartedAt, wallTime),
      cpm: computeCpm(state.correctChars, state.sessionStartedAt, wallTime),
      accuracy: computeAccuracy(state.correctChars, state.incorrectChars),
    }),
    [wallTime, state.correctChars, state.incorrectChars, state.sessionStartedAt],
  );

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const setMode = useCallback((mode: GeneratorMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  return { state, metrics, wallTime, restart, setMode, dispatch };
}
