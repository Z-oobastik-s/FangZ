import { buildCustomSegment, buildSegment } from './textGenerators';
import type { GeneratorMode, TrainerAction, TrainerState } from './types';

function nextSegment(state: TrainerState): string {
  return state.customConfig ? buildCustomSegment(state.customConfig) : buildSegment(state.mode);
}

function freshFromState(prev: TrainerState): TrainerState {
  return {
    ...prev,
    target: nextSegment(prev),
    index: 0,
    strikes: 0,
    status: 'live',
    sessionStartedAt: null,
    correctChars: 0,
    incorrectChars: 0,
    segmentsCleared: 0,
    pulseId: prev.pulseId + 1,
  };
}

export function createInitialTrainerState(mode: GeneratorMode = 'words'): TrainerState {
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
    caseSensitive: false,
    maxStrikes: 3,
    customConfig: null,
  };
}

export function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'RESTART':
      return freshFromState(state);

    case 'SET_MODE': {
      if (action.mode === state.mode && !state.customConfig) return state;
      return {
        ...state,
        mode: action.mode,
        target: buildSegment(action.mode),
        index: 0,
        strikes: 0,
        status: 'live',
        sessionStartedAt: null,
        correctChars: 0,
        incorrectChars: 0,
        segmentsCleared: 0,
        customConfig: null,
        caseSensitive: false,
        maxStrikes: 3,
        pulseId: state.pulseId + 1,
      };
    }

    case 'KEY': {
      if (state.status === 'dead') return state;

      const ch = normalizeIncomingKey(action.key);
      if (ch === null) return state;

      const expected = state.target[state.index];
      if (expected === undefined) return state;

      if (charsMatch(ch, expected, state.caseSensitive)) {
        const sessionStartedAt = state.sessionStartedAt ?? action.at;
        const nextIndex = state.index + 1;
        const atEnd = nextIndex >= state.target.length;

        if (atEnd) {
          return {
            ...state,
            target: nextSegment(state),
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

      if (strikes >= state.maxStrikes) {
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

function normalizeIncomingKey(raw: string): string | null {
  if (raw === ' ') return ' ';
  if (raw.length !== 1) return null;
  return raw;
}

function charsMatch(typed: string, expected: string, caseSensitive: boolean): boolean {
  if (expected === ' ') return typed === ' ';
  if (caseSensitive) return typed === expected;
  return typed.toLowerCase() === expected.toLowerCase();
}
