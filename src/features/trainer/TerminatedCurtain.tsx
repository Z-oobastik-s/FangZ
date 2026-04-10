import { memo } from 'react';

type Props = {
  onRestore: () => void;
};

export const TerminatedCurtain = memo(function TerminatedCurtain({ onRestore }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/92 p-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fz-term-title"
    >
      <div className="max-w-md border border-blood/50 bg-panel p-6 shadow-[0_0_80px_rgba(255,45,106,0.18)]">
        <p id="fz-term-title" className="font-mono text-xs uppercase tracking-[0.45em] text-blood">
          session terminated
        </p>
        <p className="mt-3 font-mono text-sm leading-relaxed text-ash">
          three faults. channel closed. system does not negotiate.
        </p>
        <button
          type="button"
          onClick={onRestore}
          className="mt-6 w-full border border-acid/50 bg-acid/5 py-3 font-mono text-xs uppercase tracking-[0.4em] text-acid transition-colors hover:bg-acid/10"
        >
          restore system
        </button>
      </div>
    </div>
  );
});
