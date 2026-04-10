import { memo, useMemo } from 'react';
import { useAmbient } from '../../shared/ambient/AmbientContext';
import { useI18n } from '../../shared/i18n/I18nContext';
import type { MessageKey } from '../../shared/i18n/messages';
import { LOCALES, type Locale } from '../../shared/i18n/types';
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

const modeKey: Record<GeneratorMode, MessageKey> = {
  words: 'modeWords',
  letters: 'modeLetters',
  burst: 'modeBurst',
  pattern: 'modePattern',
};

const localeShort: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
  ru: 'RU',
};

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
  const { t, locale, setLocale } = useI18n();
  const { enabled: ambientOn, setEnabled: setAmbientOn, volume, setVolume } = useAmbient();
  const phase = derivePhase(strikes, status);

  const phaseText = useMemo(() => {
    if (phase === 'dead') return t('phaseDead');
    if (phase === 'warning') return t('phaseWarn');
    if (strikes === 1) return t('phaseStrike1');
    return t('phaseOpen');
  }, [phase, strikes, t]);

  const volPercent = Math.round(volume * 100);

  return (
    <div className="grid gap-3 border border-wire/30 bg-panel/80 p-3 shadow-[0_0_40px_rgba(124,58,237,0.12)] backdrop-blur-sm sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="WPM" value={metrics.wpm} accent="text-acid" />
        <Stat label="CPM" value={metrics.cpm} accent="text-wire" />
        <Stat label="ACC" value={`${metrics.accuracy}%`} accent="text-ash" />
        <Stat label="SEG" value={segmentsCleared} accent="text-acid" />
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ash/60">{t('lang')}</span>
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={[
                'rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                l === locale
                  ? 'border-acid/70 bg-acid/10 text-acid'
                  : 'border-ash/25 text-ash hover:border-ash/50 hover:text-ash/90',
              ].join(' ')}
              aria-pressed={l === locale}
            >
              {localeShort[l]}
            </button>
          ))}
        </div>

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
              {t(modeKey[m])}
            </button>
          ))}
          <button
            type="button"
            onClick={onToggleSound}
            className="rounded-sm border border-ash/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash hover:border-ash/50"
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? t('sfxOn') : t('sfxOff')}
          </button>
        </div>

        <div className="flex w-full flex-col gap-2 sm:max-w-xs sm:items-end">
          <div className="flex w-full flex-wrap items-center gap-2 sm:justify-end">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ash/60">{t('ambient')}</span>
            <button
              type="button"
              onClick={() => setAmbientOn(!ambientOn)}
              className={[
                'rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                ambientOn
                  ? 'border-wire/50 text-wire'
                  : 'border-ash/25 text-ash hover:border-ash/50',
              ].join(' ')}
              aria-pressed={ambientOn}
            >
              {ambientOn ? t('ambientTrackOn') : t('ambientTrackOff')}
            </button>
          </div>
          <label className="flex w-full flex-col gap-1 sm:items-end">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ash/60">
              {t('ambientVol')} ({volPercent}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volPercent}
              disabled={!ambientOn}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="h-1 w-full max-w-xs cursor-pointer accent-acid disabled:cursor-not-allowed disabled:opacity-40"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={volPercent}
            />
          </label>
        </div>

        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-ash">{phaseText}</div>
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
