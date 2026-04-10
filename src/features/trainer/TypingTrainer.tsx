import { lazy, Suspense, useId, useState } from 'react';
import { useI18n } from '../../shared/i18n/I18nContext';
import { FangHud } from './FangHud';
import { TargetRibbon } from './TargetRibbon';
import { useTypingTrainer } from './useTypingTrainer';

const TerminatedCurtain = lazy(async () => {
  const m = await import('./TerminatedCurtain');
  return { default: m.TerminatedCurtain };
});

export function TypingTrainer() {
  const { t, strikesA11y } = useI18n();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { state, metrics, restart, setMode } = useTypingTrainer(soundEnabled);
  const liveId = useId();

  return (
    <main
      className="relative mx-auto flex min-h-dvh min-h-[100dvh] max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10"
      role="application"
      aria-label={t('appAria')}
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl tracking-[0.35em] text-acid sm:text-3xl">FANGZ</h1>
          <p className="mt-2 max-w-prose font-mono text-[11px] uppercase leading-relaxed tracking-[0.22em] text-ash">
            {t('tagline')}
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash/70">{t('inputHint')}</div>
      </header>

      <FangHud
        mode={state.mode}
        strikes={state.strikes}
        status={state.status}
        segmentsCleared={state.segmentsCleared}
        metrics={metrics}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onMode={setMode}
      />

      <section
        aria-labelledby={liveId}
        className="relative flex flex-1 flex-col gap-4 border border-ash/20 bg-panel/40 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <span id={liveId} className="font-mono text-[10px] uppercase tracking-[0.4em] text-ash/80">
            {t('capturePlane')}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood/90">
            {t('strikesLive')} {state.strikes}/3
          </span>
        </div>

        <div
          className="relative overflow-hidden rounded-sm border border-acid/15 bg-void/70 p-4 sm:p-5"
          data-phase={state.status === 'dead' ? 'dead' : state.strikes >= 2 ? 'warn' : 'live'}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(600px 240px at 20% 0%, rgba(0,240,255,0.14), transparent 60%), radial-gradient(500px 220px at 100% 20%, rgba(124,58,237,0.16), transparent 55%)',
            }}
          />
          <TargetRibbon
            target={state.target}
            index={state.index}
            strikes={state.strikes}
            dead={state.status === 'dead'}
          />
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {state.status === 'dead' ? t('terminatedA11y') : strikesA11y(state.strikes, state.index)}
        </p>
      </section>

      <footer className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash/50">{t('footer')}</footer>

      {state.status === 'dead' ? (
        <Suspense fallback={null}>
          <TerminatedCurtain onRestore={restart} />
        </Suspense>
      ) : null}
    </main>
  );
}
