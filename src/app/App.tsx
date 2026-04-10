import { TypingTrainer } from '../features/trainer/TypingTrainer';
import { AmbientProvider } from '../shared/ambient/AmbientContext';
import { I18nProvider } from '../shared/i18n/I18nContext';

export function App() {
  return (
    <I18nProvider>
      <AmbientProvider>
        <div className="fz-shell fz-grid relative min-h-dvh min-h-[100dvh]">
          <div className="fz-noise" aria-hidden="true" />
          <div className="fz-scanlines" aria-hidden="true" />
          <div className="fz-scanbeam" aria-hidden="true" />
          <div className="fz-vignette" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-acid/50 to-transparent" />
          <div
            className="pointer-events-none fixed left-1/2 top-0 z-20 h-[42vh] w-[min(92vw,720px)] -translate-x-1/2 animate-fz-breathe rounded-[100%] bg-acid/[0.04] blur-3xl"
            aria-hidden="true"
          />
          <TypingTrainer />
        </div>
      </AmbientProvider>
    </I18nProvider>
  );
}
