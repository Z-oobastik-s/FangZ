import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { SessionSpec, TrainerExitSnapshot } from '../../app/sessionSpec';
import { useI18n } from '../../shared/i18n/I18nContext';
import { FangHud } from './FangHud';
import { TargetRibbon } from './TargetRibbon';
import type { TrainerState } from './types';
import { useTypingTrainer } from './useTypingTrainer';

const TerminatedCurtain = lazy(async () => {
  const m = await import('./TerminatedCurtain');
  return { default: m.TerminatedCurtain };
});

type Props = {
  session: SessionSpec;
  initialState: TrainerState;
  onExit: (snap: TrainerExitSnapshot) => void;
};

const TrainerBrandHeader = memo(function TrainerBrandHeader({
  sessionKind,
  onBack,
}: {
  sessionKind: SessionSpec['kind'];
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <header className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-2 border-b border-white/[0.07] pb-1.5">
      <div className="flex min-w-0 items-start gap-2">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 border border-white/15 bg-black/50 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.28em] text-ash/80 transition-colors hover:border-acid/35 hover:text-acid"
        >
          {t('backHub')}
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold tracking-[0.42em] text-acid sm:text-xl">FANGZ</h1>
          <p className="font-mono text-[7px] uppercase tracking-[0.35em] text-ash/50">{t('brandSubtitle')}</p>
        </div>
      </div>
      <p className="hidden min-w-0 truncate text-center font-mono text-[8px] uppercase leading-tight tracking-[0.18em] text-ash/55 sm:block">
        {sessionKind === 'speed60' ? t('speedTagline') : t('tagline')}
      </p>
      <p className="max-w-[11rem] text-right font-mono text-[7px] uppercase leading-tight tracking-[0.24em] text-ash/50 sm:max-w-[14rem]">
        {t('inputHint')}
      </p>
    </header>
  );
});

const TrainerFooter = memo(function TrainerFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-1 shrink-0 truncate text-center font-mono text-[7px] uppercase tracking-[0.38em] text-ash/35">
      {t('footer')}
    </footer>
  );
});

export function TypingTrainer({ session, initialState, onExit }: Props) {
  const { t, strikesA11y } = useI18n();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tick, setTick] = useState(() => Date.now());
  const [speedPhase, setSpeedPhase] = useState<'idle' | 'run' | 'done'>(() =>
    session.kind === 'speed60' ? 'idle' : 'run',
  );

  const speedLocked = session.kind === 'speed60' && speedPhase === 'done';
  const { state, metrics, wallTime, restart, setMode } = useTypingTrainer(soundEnabled, initialState, {
    inputEnabled: !speedLocked,
  });

  const liveId = useId();
  const captureShellRef = useRef<HTMLDivElement>(null);
  const flashClearRef = useRef<number | null>(null);
  const prevCharsRef = useRef({ c: state.correctChars, i: state.incorrectChars });

  const exitSnapshot = useCallback((): TrainerExitSnapshot => {
    const now = Date.now();
    const durMs =
      state.sessionStartedAt != null ? Math.max(0, now - state.sessionStartedAt) : 0;
    return {
      wpm: metrics.wpm,
      acc: metrics.accuracy,
      incorrectChars: state.incorrectChars,
      correctChars: state.correctChars,
      durationSec: durMs / 1000,
    };
  }, [metrics.accuracy, metrics.wpm, state.correctChars, state.incorrectChars, state.sessionStartedAt]);

  const exitSnapshotRef = useRef(exitSnapshot);
  exitSnapshotRef.current = exitSnapshot;

  const handleExitHub = useCallback(() => {
    onExit(exitSnapshotRef.current());
  }, [onExit]);

  const onToggleSound = useCallback(() => {
    setSoundEnabled((v) => !v);
  }, []);

  useEffect(() => {
    if (session.kind !== 'speed60') return;
    if (state.sessionStartedAt && speedPhase === 'idle') setSpeedPhase('run');
  }, [session.kind, state.sessionStartedAt, speedPhase]);

  useEffect(() => {
    if (speedPhase !== 'run' || session.kind !== 'speed60' || !state.sessionStartedAt) return;
    const id = window.setInterval(() => setTick(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [speedPhase, session.kind, state.sessionStartedAt]);

  useEffect(() => {
    if (session.kind !== 'speed60' || speedPhase !== 'run' || !state.sessionStartedAt) return;
    if (tick >= state.sessionStartedAt + 60_000) setSpeedPhase('done');
  }, [session.kind, speedPhase, state.sessionStartedAt, tick]);

  useLayoutEffect(() => {
    const p = prevCharsRef.current;
    const c = state.correctChars;
    const i = state.incorrectChars;
    const el = captureShellRef.current;
    prevCharsRef.current = { c, i };

    let next: 'hit' | 'miss' | null = null;
    if (c > p.c) next = 'hit';
    else if (i > p.i) next = 'miss';
    if (!next || !el) return;

    if (flashClearRef.current != null) window.clearTimeout(flashClearRef.current);
    el.dataset.flash = next;
    const ms = next === 'miss' ? 280 : 160;
    flashClearRef.current = window.setTimeout(() => {
      if (el.dataset.flash === next) delete el.dataset.flash;
      flashClearRef.current = null;
    }, ms);
    return () => {
      if (flashClearRef.current != null) {
        window.clearTimeout(flashClearRef.current);
        flashClearRef.current = null;
      }
    };
  }, [state.correctChars, state.incorrectChars]);

  const elapsed = useMemo(() => {
    if (session.kind === 'speed60' && state.sessionStartedAt && speedPhase === 'run') {
      const r = Math.max(0, state.sessionStartedAt + 60_000 - tick);
      const ss = Math.ceil(r / 1000);
      const mm = Math.floor(ss / 60);
      const s = ss % 60;
      return `${String(mm).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    if (!state.sessionStartedAt) return '00:00';
    const ms = Math.max(0, wallTime - state.sessionStartedAt);
    const mm = Math.floor(ms / 60_000);
    const ss = Math.floor((ms % 60_000) / 1000);
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }, [session.kind, speedPhase, state.sessionStartedAt, tick, wallTime]);

  const phase =
    state.status === 'dead'
      ? 'dead'
      : state.strikes >= state.maxStrikes - 1 && state.status === 'live'
        ? 'warn'
        : 'live';

  const modeSwitchDisabled = session.kind === 'speed60' || session.kind === 'custom';
  const planeLabel =
    session.kind === 'speed60' ? t('speedPlane') : session.kind === 'custom' ? t('customPlane') : t('capturePlane');

  return (
    <main
      className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-2 pb-1.5 pt-1.5 sm:px-4 sm:pb-2 sm:pt-2"
      role="application"
      aria-label={t('appAria')}
    >
      <TrainerBrandHeader sessionKind={session.kind} onBack={handleExitHub} />

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
              {planeLabel}
            </span>
          </div>
          <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.35em] text-blood">
            <span className="text-ash/45">{t('strikesLive')} </span>
            <span className="tabular-nums">
              {state.strikes}
              <span className="text-ash/35">/{state.maxStrikes}</span>
            </span>
          </div>
        </div>

        <div
          ref={captureShellRef}
          className="fz-capture-shell relative min-h-0 flex-1 overflow-hidden"
          data-phase={phase}
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
        maxStrikes={state.maxStrikes}
        status={state.status}
        segmentsCleared={state.segmentsCleared}
        metrics={metrics}
        elapsed={elapsed}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onMode={setMode}
        modeSwitchDisabled={modeSwitchDisabled}
      />

      <TrainerFooter />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {state.status === 'dead' ? t('terminatedA11y') : strikesA11y(state.strikes, state.index)}
      </p>

      {state.status === 'dead' ? (
        <Suspense fallback={null}>
          <TerminatedCurtain onRestore={restart} />
        </Suspense>
      ) : null}

      {speedLocked ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/88 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm border border-white/12 bg-black/80 p-4 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.08)]">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.45em] text-ash/70">{t('speedResultTitle')}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-frost/90">
              <div>
                <span className="block text-[8px] text-ash/45">{t('metricFlt')}</span>
                <span className="tabular-nums">{metrics.wpm}</span>
              </div>
              <div>
                <span className="block text-[8px] text-ash/45">acc</span>
                <span className="tabular-nums">{metrics.accuracy}%</span>
              </div>
              <div>
                <span className="block text-[8px] text-ash/45">sym</span>
                <span className="tabular-nums">{state.correctChars}</span>
              </div>
              <div>
                <span className="block text-[8px] text-ash/45">err</span>
                <span className="tabular-nums">{state.incorrectChars}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExitHub}
              className="mt-5 w-full border border-acid/35 bg-acid/10 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-acid transition-colors hover:bg-acid/15"
            >
              {t('speedClose')}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
