import { memo, useMemo } from 'react';
import { useI18n } from '../../shared/i18n/I18nContext';
import type { MessageKey } from '../../shared/i18n/messages';
import type { GeneratorMode } from './types';
import { derivePhase } from './types';

type Metrics = { wpm: number; cpm: number; accuracy: number };

type Props = {
  className?: string;
  mode: GeneratorMode;
  strikes: number;
  maxStrikes: number;
  status: 'live' | 'dead';
  segmentsCleared: number;
  metrics: Metrics;
  elapsed: string;
  onMode: (m: GeneratorMode) => void;
  modeSwitchDisabled?: boolean;
};

const modes: GeneratorMode[] = ['words', 'letters', 'burst', 'pattern'];

const modeKey: Record<GeneratorMode, MessageKey> = {
  words: 'modeWords',
  letters: 'modeLetters',
  burst: 'modeBurst',
  pattern: 'modePattern',
};

const ctrl =
  'inline-flex min-h-[28px] items-center justify-center border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors active:translate-y-px';

const HudMetricsRow = memo(function HudMetricsRow({
  metrics,
  elapsed,
  strikes,
  maxStrikes,
}: {
  metrics: Metrics;
  elapsed: string;
  strikes: number;
  maxStrikes: number;
}) {
  const { t } = useI18n();
  const nearMax = maxStrikes > 1 ? strikes >= maxStrikes - 1 : strikes >= 1;
  const fltTone = nearMax ? 'text-blood' : strikes === 1 ? 'text-blood/80' : 'text-acid/90';

  return (
    <div className="grid shrink-0 grid-cols-5 gap-px rounded-sm border border-white/[0.09] bg-white/[0.03]">
      <MetricCell label={t('metricCpm')} value={metrics.cpm} align="left" />
      <MetricCell label={t('metricAcc')} value={`${metrics.accuracy}%`} align="left" />
      <MetricCell label={t('metricWpm')} value={metrics.wpm} align="center" primary />
      <MetricCell
        label={t('metricFlt').toUpperCase()}
        value={`${strikes}/${maxStrikes}`}
        align="right"
        valueClass={fltTone}
      />
      <MetricCell label={t('metricTime').toUpperCase()} value={elapsed} align="right" />
    </div>
  );
});

const HudModeRow = memo(function HudModeRow({
  mode,
  modeSwitchDisabled,
  onMode,
}: {
  mode: GeneratorMode;
  modeSwitchDisabled: boolean;
  onMode: (m: GeneratorMode) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-0 shrink-0 flex-wrap items-center justify-center gap-1 border-t border-white/[0.07] pt-1">
      <span className="hidden font-mono text-[7px] uppercase tracking-[0.2em] text-ash/45 sm:inline">{t('hudRouting')}</span>
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          disabled={modeSwitchDisabled}
          onClick={() => onMode(m)}
          className={[
            ctrl,
            m === mode
              ? 'border-acid/50 bg-acid/[0.08] text-acid'
              : 'border-white/10 bg-black/40 text-ash hover:border-acid/20 hover:text-frost/90',
            modeSwitchDisabled ? 'pointer-events-none opacity-35' : '',
          ].join(' ')}
        >
          {t(modeKey[m])}
        </button>
      ))}
    </div>
  );
});

const HudPhaseRow = memo(function HudPhaseRow({
  strikes,
  maxStrikes,
  status,
  segmentsCleared,
}: {
  strikes: number;
  maxStrikes: number;
  status: 'live' | 'dead';
  segmentsCleared: number;
}) {
  const { t } = useI18n();
  const phase = derivePhase(strikes, status, maxStrikes);

  const phaseText = useMemo(() => {
    if (phase === 'dead') return t('phaseDead');
    if (phase === 'warning') return t('phaseWarn');
    if (strikes === 1) return t('phaseStrike1');
    return t('phaseOpen');
  }, [phase, strikes, t]);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/[0.06] pt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-ash/55">
      <span className="min-w-0 truncate">
        {phase === 'warning' || strikes >= 1 ? (
          <span className="text-blood/90">{phaseText}</span>
        ) : (
          <span className="text-acid/70">{phaseText}</span>
        )}
      </span>
      <span className="shrink-0 tabular-nums text-ash/45">
        {t('hudSeg')} {segmentsCleared}
      </span>
    </div>
  );
});

export const FangHud = memo(function FangHud({
  className = '',
  mode,
  strikes,
  maxStrikes,
  status,
  segmentsCleared,
  metrics,
  elapsed,
  onMode,
  modeSwitchDisabled = false,
}: Props) {
  return (
    <div className={`flex min-h-0 flex-col gap-1 ${className}`.trim()}>
      <HudMetricsRow
        metrics={metrics}
        elapsed={elapsed}
        strikes={strikes}
        maxStrikes={maxStrikes}
      />
      <HudModeRow mode={mode} modeSwitchDisabled={modeSwitchDisabled} onMode={onMode} />
      <HudPhaseRow strikes={strikes} maxStrikes={maxStrikes} status={status} segmentsCleared={segmentsCleared} />
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
  const al =
    align === 'center' ? 'items-center text-center' : align === 'left' ? 'items-start text-left' : 'items-end text-right';
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
