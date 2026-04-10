import { memo, useMemo } from 'react';
import { useAmbient } from '../../shared/ambient/AmbientContext';
import { useI18n } from '../../shared/i18n/I18nContext';
import type { MessageKey } from '../../shared/i18n/messages';
import { LOCALES, type Locale } from '../../shared/i18n/types';
import type { GeneratorMode } from './types';
import { derivePhase } from './types';

type Metrics = { wpm: number; cpm: number; accuracy: number };

type Props = {
  className?: string;
  mode: GeneratorMode;
  strikes: number;
  status: 'live' | 'dead';
  segmentsCleared: number;
  metrics: Metrics;
  elapsed: string;
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

const ctrl =
  'inline-flex min-h-[28px] items-center justify-center border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors active:translate-y-px';

export const FangHud = memo(function FangHud({
  className = '',
  mode,
  strikes,
  status,
  segmentsCleared,
  metrics,
  elapsed,
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
  const fltTone = strikes >= 2 ? 'text-blood' : strikes === 1 ? 'text-blood/80' : 'text-acid/90';

  return (
    <div className={`flex min-h-0 flex-col gap-1 ${className}`.trim()}>
      <div className="grid shrink-0 grid-cols-5 gap-px rounded-sm border border-white/[0.09] bg-white/[0.03]">
        <MetricCell label="CPM" value={metrics.cpm} align="left" />
        <MetricCell label="ACC" value={`${metrics.accuracy}%`} align="left" />
        <MetricCell label="WPM" value={metrics.wpm} align="center" primary />
        <MetricCell label={t('metricFlt').toUpperCase()} value={`${strikes}/3`} align="right" valueClass={fltTone} />
        <MetricCell label={t('metricTime').toUpperCase()} value={elapsed} align="right" />
      </div>

      <div className="flex min-h-0 shrink-0 flex-wrap items-center justify-center gap-1 border-t border-white/[0.07] pt-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={[
              ctrl,
              l === locale
                ? 'border-acid/55 bg-acid/10 text-acid'
                : 'border-white/10 bg-black/40 text-ash hover:border-acid/25 hover:text-frost/90',
            ].join(' ')}
            aria-pressed={l === locale}
          >
            {localeShort[l]}
          </button>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-white/10 sm:inline" aria-hidden="true" />
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onMode(m)}
            className={[
              ctrl,
              m === mode
                ? 'border-acid/50 bg-acid/[0.08] text-acid'
                : 'border-white/10 bg-black/40 text-ash hover:border-acid/20 hover:text-frost/90',
            ].join(' ')}
          >
            {t(modeKey[m])}
          </button>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-white/10 sm:inline" aria-hidden="true" />
        <button
          type="button"
          onClick={onToggleSound}
          className={[
            ctrl,
            soundEnabled ? 'border-acid/35 text-acid/90' : 'border-white/10 text-ash/75',
          ].join(' ')}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? t('sfxOn') : t('sfxOff')}
        </button>
        <button
          type="button"
          onClick={() => setAmbientOn(!ambientOn)}
          className={[
            ctrl,
            ambientOn ? 'border-acid/30 text-acid/85' : 'border-white/10 text-ash/70',
          ].join(' ')}
          aria-pressed={ambientOn}
        >
          {ambientOn ? t('ambientTrackOn') : t('ambientTrackOff')}
        </button>
        <label className="flex min-w-[120px] max-w-[200px] flex-1 items-center gap-2 px-1 sm:min-w-[160px]">
          <span className="sr-only">{t('ambientVol')}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volPercent}
            disabled={!ambientOn}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="h-1 w-full cursor-pointer accent-acid disabled:cursor-not-allowed disabled:opacity-30"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volPercent}
          />
        </label>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/[0.06] pt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-ash/55">
        <span className="min-w-0 truncate">
          {phase === 'warning' || strikes >= 1 ? (
            <span className="text-blood/90">{phaseText}</span>
          ) : (
            <span className="text-acid/70">{phaseText}</span>
          )}
        </span>
        <span className="shrink-0 tabular-nums text-ash/45">
          seg {segmentsCleared}
        </span>
      </div>
    </div>
  );
});

function MetricCell({
  label,
  value,
  align,
  primary,
  valueClass,
}: {
  label: string;
  value: string | number;
  align: 'left' | 'center' | 'right';
  primary?: boolean;
  valueClass?: string;
}) {
  const al = align === 'center' ? 'items-center text-center' : align === 'left' ? 'items-start text-left' : 'items-end text-right';
  return (
    <div
      className={`flex min-h-[52px] flex-col justify-center bg-black/45 px-1.5 py-1 sm:min-h-[56px] sm:px-2 ${al}`}
    >
      <span className="font-mono text-[7px] font-medium uppercase tracking-[0.42em] text-ash/45">{label}</span>
      <span
        className={[
          'mt-0.5 font-mono tabular-nums tracking-tight',
          primary
            ? 'text-2xl font-bold text-acid sm:text-3xl [text-shadow:0_0_24px_rgba(0,240,255,0.25)]'
            : `text-base font-semibold sm:text-lg ${valueClass ?? 'text-frost'}`,
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}
