import { memo } from 'react';
import { useI18n } from '../../shared/i18n/I18nContext';

type Props = {
  onRestore: () => void;
};

export const TerminatedCurtain = memo(function TerminatedCurtain({ onRestore }: Props) {
  const { t } = useI18n();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/95 p-6 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fz-term-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,92,0.12),transparent_55%)]" />
      <div className="relative max-w-md fz-glass fz-glass-edge border-blood/40 p-8 shadow-[0_0_100px_rgba(255,26,92,0.22)]">
        <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-blood/60 to-transparent" />
        <p id="fz-term-title" className="font-display text-sm font-semibold uppercase tracking-[0.5em] text-blood">
          {t('terminatedTitle')}
        </p>
        <p className="mt-4 font-mono text-sm leading-relaxed tracking-wide text-ash">{t('terminatedBody')}</p>
        <button
          type="button"
          onClick={onRestore}
          className="mt-8 w-full border border-acid/45 bg-acid/[0.07] py-3.5 font-mono text-xs font-medium uppercase tracking-[0.45em] text-acid shadow-glow-acid-sm transition-all hover:bg-acid/15 active:scale-[0.99]"
        >
          {t('restore')}
        </button>
      </div>
    </div>
  );
});
