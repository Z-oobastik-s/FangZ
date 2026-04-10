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

const btnBase =
  'rounded-sm border px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] transition-all duration-150 active:scale-[0.98]';

export const FangHud = memo(function FangHud({
  className = '',
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
    <div
      className={`fz-glass fz-glass-edge rounded-sm p-4 shadow-capture sm:p-6 ${className}`.trim()}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <Stat label="WPM" value={metrics.wpm} tone="acid" />
        <Stat label="CPM" value={metrics.cpm} tone="wire" />
        <Stat label="ACC" value={`${metrics.accuracy}%`} tone="frost" />
        <Stat label="SEG" value={segmentsCleared} tone="acid" />
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-5 sm:mt-6 sm:pt-6">
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-ash/50">{t('lang')}</span>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={[
                    btnBase,
                    l === locale
                      ? 'border-acid/60 bg-acid/10 text-acid shadow-glow-acid-sm'
                      : 'border-white/10 bg-black/25 text-ash/80 hover:border-acid/25 hover:text-frost/90',
                  ].join(' ')}
                  aria-pressed={l === locale}
                >
                  {localeShort[l]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:items-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-ash/50 lg:text-center">
              {t('hudRouting')}
            </span>
            <div className="flex flex-wrap justify-start gap-2 lg:justify-center">
              {modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onMode(m)}
                  className={[
                    btnBase,
                    m === mode
                      ? 'border-wire/55 bg-wire/10 text-frost shadow-glow-wire'
                      : 'border-white/10 bg-black/25 text-ash/80 hover:border-wire/30 hover:text-frost/90',
                  ].join(' ')}
                >
                  {t(modeKey[m])}
                </button>
              ))}
              <button
                type="button"
                onClick={onToggleSound}
                className={[
                  btnBase,
                  soundEnabled
                    ? 'border-acid/35 text-acid/90'
                    : 'border-white/10 bg-black/25 text-ash/70 hover:border-white/20',
                ].join(' ')}
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? t('sfxOn') : t('sfxOff')}
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:items-end">
            <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-ash/50">{t('ambient')}</span>
            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none lg:items-end">
              <button
                type="button"
                onClick={() => setAmbientOn(!ambientOn)}
                className={[
                  btnBase,
                  'w-fit',
                  ambientOn
                    ? 'border-wire/50 bg-wire/10 text-frost shadow-glow-wire'
                    : 'border-white/10 bg-black/25 text-ash/70',
                ].join(' ')}
                aria-pressed={ambientOn}
              >
                {ambientOn ? t('ambientTrackOn') : t('ambientTrackOff')}
              </button>
              <label className="flex w-full flex-col gap-2 lg:items-end">
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-ash/50">
                  {t('ambientVol')} <span className="text-acid/80">{volPercent}%</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volPercent}
                  disabled={!ambientOn}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="h-1.5 w-full max-w-xs cursor-pointer accent-acid disabled:cursor-not-allowed disabled:opacity-35"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={volPercent}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-4 text-center sm:mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ash/75 animate-fz-ticker">
          {phase === 'warning' || strikes >= 1 ? (
            <span className="text-blood/95">{phaseText}</span>
          ) : (
            <span className="text-acid/75">{phaseText}</span>
          )}
        </p>
      </div>
    </div>
  );
});

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: 'acid' | 'wire' | 'frost';
}) {
  const toneCls =
    tone === 'acid'
      ? 'text-acid shadow-glow-acid-sm'
      : tone === 'wire'
        ? 'text-frost shadow-glow-wire'
        : 'text-frost/90';

  return (
    <div className="group relative overflow-hidden rounded-sm border border-white/[0.08] bg-black/35 px-3 py-3 sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-ash/55">{label}</div>
      <div className={`mt-1 font-mono text-xl tabular-nums sm:text-2xl ${toneCls}`}>{value}</div>
    </div>
  );
}
