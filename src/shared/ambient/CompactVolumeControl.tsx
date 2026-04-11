import { useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useAmbient } from './AmbientContext';

const ctrl =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-white/15 bg-black/50 font-mono text-[10px] text-acid/90 transition-colors hover:border-acid/35 disabled:opacity-30';

/** Narrow horizontal slider + step buttons; avoids a long bar in the HUD/hub. */
export function CompactVolumeControl({ disabled }: { disabled?: boolean }) {
  const { t } = useI18n();
  const { volume, setVolume } = useAmbient();
  const pct = Math.round(volume * 100);

  const bump = useCallback(
    (delta: number) => {
      setVolume(Math.min(1, Math.max(0, volume + delta)));
    },
    [setVolume, volume],
  );

  return (
    <div
      className="inline-flex max-w-full items-center gap-1 rounded-sm border border-white/[0.08] bg-black/35 px-1 py-0.5"
      title={t('ambientVol')}
    >
      <button type="button" className={ctrl} disabled={disabled} onClick={() => bump(-0.05)} aria-label={t('volDown')}>
        −
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        disabled={disabled}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        className="h-1 w-[52px] min-w-0 cursor-pointer accent-acid sm:w-[64px] disabled:cursor-not-allowed disabled:opacity-30"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={t('ambientVol')}
      />
      <button type="button" className={ctrl} disabled={disabled} onClick={() => bump(0.05)} aria-label={t('volUp')}>
        +
      </button>
      <span className="w-6 shrink-0 text-center font-mono text-[8px] tabular-nums text-ash/60" aria-hidden="true">
        {pct}
      </span>
    </div>
  );
}
