import { TypingTrainer } from '../features/trainer/TypingTrainer';
import { AmbientProvider } from '../shared/ambient/AmbientContext';
import { I18nProvider } from '../shared/i18n/I18nContext';

export function App() {
  return (
    <I18nProvider>
      <AmbientProvider>
        <div className="fz-shell fz-grid relative h-[100dvh] max-h-[100dvh] min-h-0 overflow-hidden">
          <div className="fz-noise" aria-hidden="true" />
          <div className="fz-scanlines" aria-hidden="true" />
          <div className="fz-scanbeam" aria-hidden="true" />
          <div className="fz-vignette" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-acid/35 to-transparent" />
          <TypingTrainer />
        </div>
      </AmbientProvider>
    </I18nProvider>
  );
}
