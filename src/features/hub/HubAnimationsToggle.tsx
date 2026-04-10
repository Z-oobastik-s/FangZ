import { memo } from 'react';
import { useAnimationPreference } from '../../shared/perf/animationPreference';
import { useI18n } from '../../shared/i18n/I18nContext';

/** Compact control for global motion; matches hub strip next to version label. */
export const HubAnimationsToggle = memo(function HubAnimationsToggle() {
  const { animationsEnabled, toggleAnimations } = useAnimationPreference();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleAnimations}
      className={[
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border font-mono transition-colors sm:h-8 sm:w-8',
        animationsEnabled
          ? 'border-acid/35 bg-acid/[0.06] text-acid hover:border-acid/55 hover:bg-acid/10'
          : 'border-white/12 bg-black/50 text-ash/55 hover:border-acid/25 hover:text-ash/80',
      ].join(' ')}
      aria-pressed={animationsEnabled}
      title={animationsEnabled ? t('animToggleDisableTitle') : t('animToggleEnableTitle')}
    >
      <span className="sr-only">
        {animationsEnabled ? t('animToggleDisableTitle') : t('animToggleEnableTitle')}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 sm:h-[17px] sm:w-[17px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {animationsEnabled ? (
          <>
            <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" opacity="0.85" />
          </>
        ) : (
          <>
            <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" opacity="0.35" />
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" opacity="0.35" />
            <path d="M5 5l14 14" strokeWidth="1.5" />
          </>
        )}
      </svg>
    </button>
  );
});
