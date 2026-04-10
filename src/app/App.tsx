import { useCallback, useRef, useState } from 'react';
import type { SessionSpec, TrainerExitSnapshot } from './sessionSpec';
import { FangzProvider, useFangz } from './FangzContext';
import { MainHub, type HubPanel } from '../features/hub/MainHub';
import { TypingTrainer } from '../features/trainer/TypingTrainer';
import { buildTrainerStateFromSession } from '../features/trainer/trainerInit';
import { AmbientProvider } from '../shared/ambient/AmbientContext';
import { I18nProvider } from '../shared/i18n/I18nContext';

function HubOrTrainer() {
  const { commitSession } = useFangz();
  const [session, setSession] = useState<SessionSpec | null>(null);
  const sessionRef = useRef<SessionSpec | null>(null);
  sessionRef.current = session;
  const [panel, setPanel] = useState<HubPanel>('none');
  const [runId, setRunId] = useState(0);

  const onEnter = useCallback((s: SessionSpec) => {
    setRunId((k) => k + 1);
    setSession(s);
  }, []);

  const onExit = useCallback(
    (snap: TrainerExitSnapshot) => {
      const s = sessionRef.current;
      if (!s) return;
      commitSession(s, snap);
      setSession(null);
    },
    [commitSession],
  );

  return (
    <>
      {session ? (
        <div key={runId} className="fz-channel-in relative z-10 h-full min-h-0">
          <TypingTrainer
            session={session}
            initialState={buildTrainerStateFromSession(session)}
            onExit={onExit}
          />
        </div>
      ) : (
        <MainHub panel={panel} setPanel={setPanel} onEnter={onEnter} />
      )}
    </>
  );
}

export function App() {
  return (
    <I18nProvider>
      <AmbientProvider>
        <FangzProvider>
          <div className="fz-shell fz-grid relative h-[100dvh] max-h-[100dvh] min-h-0 overflow-hidden">
            <div className="fz-noise" aria-hidden="true" />
            <div className="fz-scanlines" aria-hidden="true" />
            <div className="fz-scanbeam" aria-hidden="true" />
            <div className="fz-vignette" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-acid/35 to-transparent" />
            <HubOrTrainer />
          </div>
        </FangzProvider>
      </AmbientProvider>
    </I18nProvider>
  );
}
