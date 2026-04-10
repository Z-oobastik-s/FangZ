import type { CustomGenConfig } from '../../shared/persistence/fangzStore';

export const GENERATOR_MODES = ['words', 'letters', 'burst', 'pattern'] as const;
export type GeneratorMode = (typeof GENERATOR_MODES)[number];

export type TrainerStatus = 'live' | 'dead';

export interface TrainerState {
  target: string;
  index: number;
  strikes: number;
  status: TrainerStatus;
  sessionStartedAt: number | null;
  correctChars: number;
  incorrectChars: number;
  segmentsCleared: number;
  mode: GeneratorMode;
  /** Monotonic id bumped on visual feedback events */
  pulseId: number;
  caseSensitive: boolean;
  maxStrikes: number;
  customConfig: CustomGenConfig | null;
}

export type TrainerAction =
  | { type: 'KEY'; key: string; at: number }
  | { type: 'RESTART' }
  | { type: 'SET_MODE'; mode: GeneratorMode };

export function derivePhase(
  strikes: number,
  status: TrainerStatus,
  maxStrikes: number,
): 'arm' | 'warning' | 'dead' {
  if (status === 'dead' || strikes >= maxStrikes) return 'dead';
  if (strikes >= maxStrikes - 1) return 'warning';
  return 'arm';
}
