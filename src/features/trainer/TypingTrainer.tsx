import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
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
  const { state, metrics, restart, setMode } = useTypingTrainer(soundEnabled);
  const liveId = useId();
  const [flash, setFlash] = useState<Flash>(null);
  const prevMetrics = useRef({ c: state.correctChars, i: state.incorrectChars });

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
      className="relative z-10 mx-auto flex min-h-dvh min-h-[100dvh] max-w-5xl flex-col px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10"
      role="application"
      aria-label={t('appAria')}
    >
      <header className="mb-8 flex flex-col gap-6 border-b border-white/[0.06] pb-8 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="hidden h-12 w-1 shrink-0 bg-gradient-to-b from-acid via-wire to-blood sm:block" aria-hidden="true" />
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-[0.55em] text-frost/95 sm:text-4xl">
              <span className="bg-gradient-to-r from-acid via-frost to-acid-dim bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,240,255,0.4)]">
                FANGZ
              </span>
            </h1>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.42em] text-ash/55">{t('brandSubtitle')}</p>
          </div>
        </div>
        <p className="max-w-xs text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.32em] text-ash/65 sm:text-left">
          {t('inputHint')}
        </p>
      </header>

      <section
        aria-labelledby={liveId}
        className="relative flex flex-col gap-0 overflow-hidden rounded-sm fz-glass fz-glass-edge shadow-capture"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] bg-black/20 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-acid shadow-glow-acid-sm animate-fz-ticker"
              aria-hidden="true"
            />
            <span
              id={liveId}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.5em] text-acid/90"
            >
              {t('capturePlane')}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-blood">
            <span className="text-ash/50">{t('strikesLive')}</span>
            <span className="tabular-nums text-blood">
              {state.strikes}
              <span className="text-ash/40">/3</span>
            </span>
          </div>
        </div>

        <div
          className="fz-capture-shell relative min-h-[min(42vh,22rem)] transition-[box-shadow,filter] duration-300 sm:min-h-[min(46vh,26rem)]"
          data-phase={phase}
          data-flash={flash ?? undefined}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(0,240,255,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(139,92,246,0.1), transparent 50%)',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/35 to-transparent" />
          <div className="relative px-4 py-6 sm:px-8 sm:py-10">
            <TargetRibbon
              target={state.target}
              index={state.index}
              strikes={state.strikes}
              dead={state.status === 'dead'}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </section>

      <p className="mx-auto mt-6 max-w-2xl text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-ash/70 sm:mt-8 sm:text-[11px] sm:tracking-[0.32em]">
        {t('tagline')}
      </p>

      <FangHud
        className="mt-10 sm:mt-12"
        mode={state.mode}
        strikes={state.strikes}
        status={state.status}
        segmentsCleared={state.segmentsCleared}
        metrics={metrics}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onMode={setMode}
      />

      <footer className="mt-auto border-t border-white/[0.05] pt-8 text-center font-mono text-[9px] uppercase tracking-[0.38em] text-ash/40 sm:pt-10">
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
