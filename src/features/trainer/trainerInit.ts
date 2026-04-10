import type { SessionSpec } from '../../app/sessionSpec';
import { buildCustomSegment, buildSegment } from './textGenerators';
import type { TrainerState } from './types';

export function buildTrainerStateFromSession(spec: SessionSpec): TrainerState {
  const base = {
    index: 0,
    strikes: 0,
    status: 'live' as const,
    sessionStartedAt: null,
    correctChars: 0,
    incorrectChars: 0,
    segmentsCleared: 0,
    pulseId: 0,
  };

  if (spec.kind === 'standard') {
    return {
      ...base,
      mode: spec.mode,
      target: buildSegment(spec.mode),
      caseSensitive: false,
      maxStrikes: 3,
      customConfig: null,
    };
  }

  if (spec.kind === 'speed60') {
    return {
      ...base,
      mode: 'words',
      target: buildSegment('words'),
      caseSensitive: false,
      maxStrikes: 3,
      customConfig: null,
    };
  }

  const cfg = spec.custom;
  const maxStrikes = cfg.strict ? 3 : 5;
  return {
    ...base,
    mode: spec.mode,
    target: buildCustomSegment(cfg),
    caseSensitive: cfg.caseSensitive,
    maxStrikes,
    customConfig: cfg,
  };
}
