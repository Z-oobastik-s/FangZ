import { TypingTrainer } from '../features/trainer/TypingTrainer';
import { AmbientProvider } from '../shared/ambient/AmbientContext';
import { I18nProvider } from '../shared/i18n/I18nContext';

export function App() {
  return (
    <I18nProvider>
      <AmbientProvider>
        <div className="relative min-h-dvh min-h-[100dvh] fangz-grid fangz-scanlines">
          <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/40 to-transparent" />
          <TypingTrainer />
        </div>
      </AmbientProvider>
    </I18nProvider>
  );
}
