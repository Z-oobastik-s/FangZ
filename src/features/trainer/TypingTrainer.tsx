import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nContext';
import { FangHud } from './FangHud';
import { TargetRibbon } from './TargetRibbon';
import { useTypingTrainer } from './useTypingTrainer';

const TerminatedCurtain = lazy(async () => {
  const m = await import('./TerminatedCurtain');
  return { default: m.TerminatedCurtain };
});

type Flash = 'hit' | 'miss' | null;

export function TypingTrainer() {
  const { t, strikesA11y } = useI18n();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { state, metrics, wallTime, restart, setMode } = useTypingTrainer(soundEnabled);
  const liveId = useId();
  const [flash, setFlash] = useState<Flash>(null);
  const prevMetrics = useRef({ c: state.correctChars, i: state.incorrectChars });

  const elapsed = useMemo(() => {
    if (!state.sessionStartedAt) return '00:00';
    const ms = Math.max(0, wallTime - state.sessionStartedAt);
    const mm = Math.floor(ms / 60_000);
    const ss = Math.floor((ms % 60_000) / 1000);
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }, [wallTime, state.sessionStartedAt]);

  useEffect(() => {
    const p = prevMetrics.current;
    let next: Flash = null;
    if (state.correctChars > p.c) next = 'hit';
    else if (state.incorrectChars > p.i) next = 'miss';
    prevMetrics.current = { c: state.correctChars, i: state.incorrectChars };

    if (!next) return undefined;
    setFlash(next);
    const ms = next === 'miss' ? 280 : 160;
    const tmr = window.setTimeout(() => setFlash(null), ms);
    return () => window.clearTimeout(tmr);
  }, [state.correctChars, state.incorrectChars]);

  const phase = state.status === 'dead' ? 'dead' : state.strikes >= 2 ? 'warn' : 'live';

  return (
    <main
      className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-2 pb-1.5 pt-1.5 sm:px-4 sm:pb-2 sm:pt-2"
      role="application"
      aria-label={t('appAria')}
    >
      <header className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-2 border-b border-white/[0.07] pb-1.5">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold tracking-[0.42em] text-acid sm:text-xl">
            FANGZ
          </h1>
          <p className="font-mono text-[7px] uppercase tracking-[0.35em] text-ash/50">{t('brandSubtitle')}</p>
        </div>
        <p className="hidden min-w-0 truncate text-center font-mono text-[8px] uppercase leading-tight tracking-[0.18em] text-ash/55 sm:block">
          {t('tagline')}
        </p>
        <p className="max-w-[11rem] text-right font-mono text-[7px] uppercase leading-tight tracking-[0.24em] text-ash/50 sm:max-w-[14rem]">
          {t('inputHint')}
        </p>
      </header>

      <section
        aria-labelledby={liveId}
        className="relative mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-white/[0.08] bg-black/55 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.06)]"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] bg-black/30 px-2 py-1 sm:px-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-acid shadow-glow-acid-sm" aria-hidden="true" />
            <span
              id={liveId}
              className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.4em] text-acid/90"
            >
              {t('capturePlane')}
            </span>
          </div>
          <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.35em] text-blood">
            <span className="text-ash/45">{t('strikesLive')} </span>
            <span className="tabular-nums">
              {state.strikes}
              <span className="text-ash/35">/3</span>
            </span>
          </div>
        </div>

        <div
          className="fz-capture-shell relative min-h-0 flex-1 overflow-hidden transition-[box-shadow,filter] duration-200"
          data-phase={phase}
          data-flash={flash ?? undefined}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,240,255,0.1), transparent 55%)',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/30 to-transparent" />
          <div className="relative flex h-full min-h-0 items-stretch p-2 sm:p-3">
            <TargetRibbon
              target={state.target}
              index={state.index}
              strikes={state.strikes}
              dead={state.status === 'dead'}
            />
          </div>
        </div>
      </section>

      <FangHud
        className="mt-1.5 shrink-0"
        mode={state.mode}
        strikes={state.strikes}
        status={state.status}
        segmentsCleared={state.segmentsCleared}
        metrics={metrics}
        elapsed={elapsed}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onMode={setMode}
      />

      <footer className="mt-1 shrink-0 truncate text-center font-mono text-[7px] uppercase tracking-[0.38em] text-ash/35">
        {t('footer')}
      </footer>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {state.status === 'dead' ? t('terminatedA11y') : strikesA11y(state.strikes, state.index)}
      </p>

      {state.status === 'dead' ? (
        <Suspense fallback={null}>
          <TerminatedCurtain onRestore={restart} />
        </Suspense>
      ) : null}
    </main>
  );
}
