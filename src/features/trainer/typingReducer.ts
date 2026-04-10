import { buildSegment } from './textGenerators';
import type { GeneratorMode, TrainerAction, TrainerState } from './types';

function initialState(mode: GeneratorMode): TrainerState {
  return {
    target: buildSegment(mode),
    index: 0,
    strikes: 0,
    status: 'live',
    sessionStartedAt: null,
    correctChars: 0,
    incorrectChars: 0,
    segmentsCleared: 0,
    mode,
    pulseId: 0,
  };
}

export function createInitialTrainerState(mode: GeneratorMode = 'words'): TrainerState {
  return initialState(mode);
}

export function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'RESTART':
      return initialState(state.mode);

    case 'SET_MODE': {
      if (action.mode === state.mode) return state;
      return initialState(action.mode);
    }

    case 'KEY': {
      if (state.status === 'dead') return state;

      const ch = normalizeKey(action.key);
      if (ch === null) return state;

      const expected = state.target[state.index];
      if (expected === undefined) return state;

      if (ch === expected) {
        const sessionStartedAt = state.sessionStartedAt ?? action.at;
        const nextIndex = state.index + 1;
        const atEnd = nextIndex >= state.target.length;

        if (atEnd) {
          return {
            ...state,
            target: buildSegment(state.mode),
            index: 0,
            strikes: 0,
            status: 'live',
            sessionStartedAt,
            correctChars: state.correctChars + 1,
            segmentsCleared: state.segmentsCleared + 1,
            pulseId: state.pulseId + 1,
          };
        }

        return {
          ...state,
          index: nextIndex,
          sessionStartedAt,
          correctChars: state.correctChars + 1,
          pulseId: state.pulseId + 1,
        };
      }

      const strikes = state.strikes + 1;
      const nextPulse = state.pulseId + 1;

      if (strikes >= 3) {
        return {
          ...state,
          strikes,
          index: 0,
          status: 'dead',
          incorrectChars: state.incorrectChars + 1,
          pulseId: nextPulse,
        };
      }

      return {
        ...state,
        strikes,
        index: 0,
        incorrectChars: state.incorrectChars + 1,
        pulseId: nextPulse,
      };
    }

    default:
      return state;
  }
}

function normalizeKey(raw: string): string | null {
  if (raw === ' ') return ' ';
  if (raw.length !== 1) return null;
  return raw.toLowerCase();
}
