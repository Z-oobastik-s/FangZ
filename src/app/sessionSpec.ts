import type { CustomGenConfig } from '../shared/persistence/fangzStore';
import type { GeneratorMode } from '../shared/game/generatorMode';

export type SessionSpec =
  | { kind: 'standard'; mode: GeneratorMode }
  | { kind: 'speed60' }
  | { kind: 'custom'; mode: GeneratorMode; custom: CustomGenConfig };

export type TrainerExitSnapshot = {
  wpm: number;
  acc: number;
  incorrectChars: number;
  correctChars: number;
  durationSec: number;
};
