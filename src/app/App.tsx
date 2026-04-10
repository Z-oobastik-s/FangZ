import { TypingTrainer } from '../features/trainer/TypingTrainer';

export function App() {
  return (
    <div className="relative min-h-dvh min-h-[100dvh] fangz-grid fangz-scanlines">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acid/40 to-transparent" />
      <TypingTrainer />
    </div>
  );
}
