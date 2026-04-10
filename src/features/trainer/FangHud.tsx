import { memo } from 'react';
import type { GeneratorMode } from './types';
import { derivePhase } from './types';

type Metrics = { wpm: number; cpm: number; accuracy: number };

type Props = {
  mode: GeneratorMode;
  strikes: number;
  status: 'live' | 'dead';
  segmentsCleared: number;
  metrics: Metrics;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onMode: (m: GeneratorMode) => void;
};

const modes: GeneratorMode[] = ['words', 'letters', 'burst', 'pattern'];

export const FangHud = memo(function FangHud({
  mode,
  strikes,
  status,
  segmentsCleared,
  metrics,
  soundEnabled,
  onToggleSound,
  onMode,
}: Props) {
  const phase = derivePhase(strikes, status);

  return (
    <div className="grid gap-3 border border-wire/30 bg-panel/80 p-3 shadow-[0_0_40px_rgba(124,58,237,0.12)] backdrop-blur-sm sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="WPM" value={metrics.wpm} accent="text-acid" />
        <Stat label="CPM" value={metrics.cpm} accent="text-wire" />
        <Stat label="ACC" value={`${metrics.accuracy}%`} accent="text-ash" />
        <Stat label="SEG" value={segmentsCleared} accent="text-acid" />
      </div>

      <div className="flex flex-col gap-2 sm:items-end">
        <div className="flex flex-wrap items-center gap-2">
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              className={[
                'rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                m === mode
                  ? 'border-acid/70 bg-acid/10 text-acid'
                  : 'border-ash/25 text-ash hover:border-ash/50 hover:text-ash/90',
              ].join(' ')}
            >
              {m}
            </button>
          ))}
          <button
            type="button"
            onClick={onToggleSound}
            className="rounded-sm border border-ash/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash hover:border-ash/50"
            aria-pressed={soundEnabled}
          >
            snd {soundEnabled ? 'on' : 'off'}
          </button>
        </div>

        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-ash">
          {phase === 'dead' ? (
            <span className="text-blood">strike lock / terminated</span>
          ) : phase === 'warning' ? (
            <span className="text-blood">threshold 2 / next fault ejects</span>
          ) : strikes === 1 ? (
            <span className="text-blood/90">fault registered / buffer wiped</span>
          ) : (
            <span className="text-acid/80">channel open / no mercy</span>
          )}
        </div>
      </div>
    </div>
  );
});

function Stat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-sm border border-ash/15 bg-void/60 px-2 py-1.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-ash/70">{label}</div>
      <div className={`font-mono text-lg tabular-nums ${accent}`}>{value}</div>
    </div>
  );
}
