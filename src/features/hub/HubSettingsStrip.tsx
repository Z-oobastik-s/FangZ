import { memo } from 'react';
import { useAmbient } from '../../shared/ambient/AmbientContext';
import { CompactVolumeControl } from '../../shared/ambient/CompactVolumeControl';
import { useGameSettings } from '../../shared/game/GameSettingsContext';
import { useI18n } from '../../shared/i18n/I18nContext';
import { LOCALES, type Locale } from '../../shared/i18n/types';
import { HubAnimationsToggle } from './HubAnimationsToggle';

const localeShort: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
  ru: 'RU',
};

const btn =
  'inline-flex min-h-[28px] items-center justify-center border px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] transition-colors active:translate-y-px sm:text-[9px] sm:tracking-[0.18em]';

/** Global locale, SFX, ambient, compact volume, motion: lives on the hub only. */
export const HubSettingsStrip = memo(function HubSettingsStrip() {
  const { t, locale, setLocale } = useI18n();
  const { soundEnabled, toggleSound } = useGameSettings();
  const { enabled: ambientOn, setEnabled: setAmbientOn } = useAmbient();

  return (
    <section
      className="flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-1.5 border-b border-acid/15 bg-black/45 px-2 py-1.5 sm:gap-x-3 sm:px-3"
      aria-label={t('hubSettingsTitle')}
    >
      <span className="hidden font-mono text-[7px] uppercase tracking-[0.2em] text-ash/45 sm:inline">{t('lang')}</span>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={[
            btn,
            l === locale
              ? 'border-acid/55 bg-acid/10 text-acid'
              : 'border-white/10 bg-black/50 text-ash hover:border-acid/25 hover:text-frost/90',
          ].join(' ')}
          aria-pressed={l === locale}
        >
          {localeShort[l]}
        </button>
      ))}
      <span className="mx-0.5 hidden h-4 w-px bg-white/10 sm:inline" aria-hidden="true" />
      <button
        type="button"
        onClick={toggleSound}
        className={[
          btn,
          soundEnabled ? 'border-acid/35 text-acid/90' : 'border-white/10 text-ash/75',
        ].join(' ')}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? t('sfxOn') : t('sfxOff')}
      </button>
      <button
        type="button"
        onClick={() => setAmbientOn(!ambientOn)}
        className={[
          btn,
          ambientOn ? 'border-acid/30 text-acid/85' : 'border-white/10 text-ash/70',
        ].join(' ')}
        aria-pressed={ambientOn}
      >
        {ambientOn ? t('ambientTrackOn') : t('ambientTrackOff')}
      </button>
      <CompactVolumeControl disabled={!ambientOn} />
      <span className="mx-0.5 hidden h-4 w-px bg-white/10 md:inline" aria-hidden="true" />
      <HubAnimationsToggle />
    </section>
  );
});
