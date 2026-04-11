import { memo, useEffect, useMemo, useState } from 'react';
import pkg from '../../../package.json';
import type { SessionSpec } from '../../app/sessionSpec';
import { useFangz } from '../../app/FangzContext';
import type { FangzSave } from '../../shared/persistence/fangzStore';
import { GENERATOR_MODES, type GeneratorMode } from '../../shared/game/generatorMode';
import { rankFromChars, rankProgress, type RankId } from '../../shared/game/rank';
import {
  formatHistoryTimestamp,
  formatPresenceSeconds,
  formatSessionKindLabel,
  formatSessionModeLabel,
} from '../../shared/lib/hubFormat';
import { useI18n } from '../../shared/i18n/I18nContext';
import { HubSettingsStrip } from './HubSettingsStrip';

export type HubPanel = 'none' | 'history' | 'online' | 'profile' | 'quests' | 'custom';

function parseMode(raw: string | null): GeneratorMode {
  if (raw && GENERATOR_MODES.includes(raw as GeneratorMode)) return raw as GeneratorMode;
  return 'words';
}

function continueSpecFromSave(save: FangzSave): SessionSpec {
  const k = save.meta.lastRunKind;
  const mode = parseMode(save.meta.lastRunMode ?? save.meta.lastMode);
  if (k === 'custom') return { kind: 'custom', mode, custom: save.custom };
  if (k === 'speed60') return { kind: 'speed60' };
  return { kind: 'standard', mode };
}

function rankKey(id: RankId): 'rankWatcher' | 'rankOperator' | 'rankPredator' | 'rankCore' {
  switch (id) {
    case 'watcher':
      return 'rankWatcher';
    case 'operator':
      return 'rankOperator';
    case 'predator':
      return 'rankPredator';
    default:
      return 'rankCore';
  }
}

type TileAccent = 'acid' | 'blood' | 'frost' | 'amber';

const accentBar: Record<TileAccent, string> = {
  acid: 'bg-gradient-to-b from-acid/90 to-acid/20',
  blood: 'bg-gradient-to-b from-blood/90 to-blood/20',
  frost: 'bg-gradient-to-b from-frost/70 to-frost/15',
  amber: 'bg-gradient-to-b from-amber-400/90 to-amber-500/20',
};

type HubTileProps = {
  moduleId: string;
  title: string;
  sub: string;
  onClick: () => void;
  accent: TileAccent;
  className?: string;
};

const HubTile = memo(function HubTile({ moduleId, title, sub, onClick, accent, className = '' }: HubTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'fz-hub-tile-glow group relative flex h-full min-h-[100px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-sm border border-white/[0.1] bg-gradient-to-br from-black/85 via-black/65 to-black/80 pl-2.5 pr-2 py-2 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[110px] sm:pl-3 sm:py-2.5 lg:min-h-0 lg:py-3 lg:pl-3.5',
        'hover:-translate-y-0.5 hover:border-acid/35 active:translate-y-0',
        className,
      ].join(' ')}
    >
      <span className={`absolute bottom-0 left-0 top-0 w-[3px] ${accentBar[accent]}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2 pl-1">
        <span className="font-mono text-[8px] font-bold tabular-nums tracking-[0.22em] text-acid/55 sm:text-[9px] lg:text-[10px]">
          {moduleId}
        </span>
        <span
          className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-acid/80 shadow-glow-acid-sm animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
      <div className="pl-1">
        <span className="block font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.22em] text-frost/95 sm:text-[11px] sm:tracking-[0.28em] lg:text-xs lg:tracking-[0.3em]">
          {title}
        </span>
        <span className="mt-1 block font-mono text-[8px] uppercase leading-snug tracking-[0.12em] text-ash/65 sm:text-[9px] lg:text-[10px]">
          {sub}
        </span>
      </div>
    </button>
  );
});

type Props = {
  panel: HubPanel;
  setPanel: (p: HubPanel) => void;
  onEnter: (spec: SessionSpec) => void;
};

function MainHubView({ panel, setPanel, onEnter }: Props) {
  const { t, locale } = useI18n();
  const { save, updateCustom } = useFangz();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let id: number | undefined;
    const arm = () => {
      if (id != null) {
        window.clearInterval(id);
        id = undefined;
      }
      if (document.visibilityState !== 'visible') return;
      id = window.setInterval(() => setTick((k) => (k + 1) % 4), 4200);
    };
    arm();
    document.addEventListener('visibilitychange', arm);
    return () => {
      if (id != null) window.clearInterval(id);
      document.removeEventListener('visibilitychange', arm);
    };
  }, []);

  const tickerText = useMemo(() => {
    const keys = ['hubTicker0', 'hubTicker1', 'hubTicker2', 'hubTicker3'] as const;
    return t(keys[tick]!);
  }, [t, tick]);

  const hasProgress = save.stats.totalSessions > 0 || save.meta.lastSessionAt != null;
  const rank = rankFromChars(save.stats.totalChars);
  const rp = rankProgress(save.stats.totalChars);
  const avgWpm = save.stats.samples > 0 ? Math.round(save.stats.sumWpm / save.stats.samples) : 0;
  const avgAcc = save.stats.samples > 0 ? Math.round(save.stats.sumAcc / save.stats.samples) : 0;

  const continueSpec = continueSpecFromSave(save);
  const qProg = save.quests.daily_chars?.progress ?? 0;
  const qDone = save.quests.daily_chars?.done;

  return (
    <main className="fz-hub-root relative z-20 flex h-full min-h-0 flex-col overflow-hidden px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-3">
      {/* Top system strip — full width */}
      <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-acid/20 bg-black/55 px-2 sm:h-12 sm:gap-3 sm:px-3">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-ash/60 sm:text-[9px] sm:tracking-[0.26em]">
          <span className="shrink-0 text-acid/75">sys</span>
          <span className="hidden h-3 w-px bg-white/10 sm:inline" aria-hidden="true" />
          <span className="flex min-w-0 items-center gap-1.5 text-frost/85">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-acid shadow-glow-acid-sm motion-reduce:animate-none" />
            <span className="truncate">sync</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPanel('history')}
          className="min-w-0 max-w-[45%] truncate rounded-sm border border-acid/25 bg-acid/[0.06] px-2.5 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.28em] text-acid transition-colors hover:border-acid/45 hover:bg-acid/10 sm:max-w-none sm:px-4 sm:text-[9px] sm:tracking-[0.36em]"
        >
          {t('hubTileHistory')} · {t('hubHistoryHead')}
        </button>
        <div className="flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ash/55 sm:gap-2.5 sm:text-[9px]">
          <span className="hidden text-ash/40 sm:inline">sym</span>
          <span className="tabular-nums text-frost/90">{save.stats.totalChars}</span>
          <span className="hidden text-ash/35 sm:inline">|</span>
          <span className="tabular-nums text-acid/50">v{pkg.version}</span>
        </div>
      </header>

      <HubSettingsStrip />

      {/* lg: one row M-01 · M-02 · HUB · M-03 · M-04 · mobile: hub on top, then 2×2 */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 py-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-1 lg:gap-3 lg:py-2.5">
        <HubTile
          moduleId="M-01"
          title={t('hubTileQuests')}
          sub={qDone ? `${t('hubQuestHead')} · ok` : `${qProg}/1000`}
          accent="frost"
          onClick={() => setPanel('quests')}
          className="col-start-1 row-start-2 lg:col-start-1 lg:row-start-1"
        />
        <HubTile
          moduleId="M-02"
          title={t('hubTileSpeed')}
          sub="60s · lock"
          accent="blood"
          onClick={() => onEnter({ kind: 'speed60' })}
          className="col-start-2 row-start-2 border-blood/15 hover:border-blood/35 lg:col-start-2 lg:row-start-1"
        />

        <section className="relative col-span-2 row-start-1 flex min-h-[200px] lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:min-h-0">
          <div className="fz-hub-core-shell relative flex h-full min-h-0 w-full min-w-0 flex-col justify-between rounded-sm border border-acid/35 bg-gradient-to-b from-[#030308] via-[#05060f] to-[#020205] px-2.5 py-2.5 shadow-glow-acid-sm sm:px-4 sm:py-3 lg:min-w-[260px]">
            <div className="fz-hub-bracket pointer-events-none opacity-70" aria-hidden="true" />
            <div className="fz-hub-radial-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,240,255,0.12),transparent_55%)]" />
            <div className="relative z-[1] text-center">
              <p className="font-mono text-[7px] uppercase tracking-[0.5em] text-acid/45 sm:text-[8px]">fangz</p>
              <h1 className="font-display text-xl font-bold tracking-[0.38em] text-acid [text-shadow:0_0_24px_rgba(0,240,255,0.35)] sm:text-2xl sm:tracking-[0.42em] lg:text-[1.65rem]">
                FANGZ
              </h1>
              <p className="mt-0.5 font-mono text-[7px] uppercase leading-snug tracking-[0.22em] text-ash/55 sm:text-[8px] lg:leading-tight lg:tracking-[0.26em]">
                {t('hubNucleusSubtitle')}
              </p>
            </div>

            <div className="relative z-[1] space-y-1.5 font-mono text-[8px] uppercase sm:space-y-2 sm:text-[9px] lg:text-[9px]">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                <div className="rounded-sm border border-white/[0.07] bg-black/40 px-1.5 py-1 sm:px-2">
                  <span className="block text-[7px] tracking-[0.2em] text-ash/45">id</span>
                  <span className="mt-0.5 block truncate text-[8px] tracking-[0.1em] text-frost/90">
                    {save.profile.id}
                  </span>
                </div>
                <div className="rounded-sm border border-white/[0.07] bg-black/40 px-1.5 py-1 sm:px-2">
                  <span className="block text-[7px] tracking-[0.2em] text-ash/45">sym</span>
                  <span className="mt-0.5 block tabular-nums text-frost/90">{save.stats.totalChars}</span>
                </div>
              </div>
              <div>
                <div className="mb-0.5 flex justify-between text-[7px] tracking-[0.18em] text-ash/45 sm:text-[8px]">
                  <span>rtg</span>
                  <span className="tabular-nums text-acid/80">{Math.round(rp.pct * 100)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-acid-dim via-acid to-acid/90 transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${Math.round(rp.pct * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 border-t border-white/[0.06] pt-1.5 text-[8px] sm:text-[9px]">
                <span className="text-frost/90">
                  <span className="text-ash/45">rnk </span>
                  {t(rankKey(rank))}
                </span>
                {rp.next ? (
                  <span className="text-blood/85">
                    <span className="text-ash/40">nxt </span>
                    {t(rankKey(rp.next))}
                  </span>
                ) : (
                  <span className="text-acid/60">max</span>
                )}
              </div>
              <p className="border-t border-white/[0.05] pt-1.5 text-blood/90">
                <span className="text-ash/45">{t('hubStreak')} </span>
                <span className="tabular-nums">{save.meta.streak}</span>
              </p>
            </div>

            <div className="relative z-[1] space-y-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => onEnter(continueSpec)}
                className="group relative w-full overflow-hidden rounded-sm border border-acid/55 bg-acid/20 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.36em] text-acid shadow-[0_0_28px_rgba(0,240,255,0.2)] transition-[color,background-color,transform] duration-200 hover:bg-acid/30 active:scale-[0.99] sm:py-2.5 sm:text-[11px] sm:tracking-[0.4em]"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {hasProgress ? t('hubPrimaryContinue') : t('hubPrimaryStart')}
              </button>
              <p className="text-center font-mono text-[7px] uppercase tracking-[0.32em] text-acid/45 sm:text-[8px]">
                {t('hubOpenChannel')}
              </p>
            </div>
          </div>
        </section>

        <HubTile
          moduleId="M-03"
          title={t('hubTileProfile')}
          sub={save.profile.nickname}
          accent="frost"
          onClick={() => setPanel('profile')}
          className="col-start-1 row-start-3 lg:col-start-4 lg:row-start-1"
        />
        <HubTile
          moduleId="M-04"
          title={t('hubTileCustom')}
          sub={`${
            save.custom.charset === 'alpha'
              ? t('hubCharsetOptAlpha')
              : save.custom.charset === 'alnum'
                ? t('hubCharsetOptAlnum')
                : t('hubCharsetOptHex')
          } · ${save.custom.wordCount}`}
          accent="acid"
          onClick={() => setPanel('custom')}
          className="col-start-2 row-start-3 lg:col-start-5 lg:row-start-1"
        />
      </div>

      {/* Bottom strip — full width */}
      <footer className="grid shrink-0 grid-cols-3 gap-1.5 border-t border-acid/15 bg-black/55 px-1 py-2 sm:gap-2 sm:px-2 sm:py-2.5">
        {/* Left: channel / observation line */}
        <div className="flex min-h-[52px] min-w-0 flex-col justify-center rounded-sm border border-white/[0.14] bg-black/60 px-2 py-2 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.05)] sm:min-h-[56px] sm:px-3">
          <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-ash/50 sm:text-[8px]">obs</span>
          <p
            key={tick}
            title={tickerText}
            className="mt-0.5 line-clamp-2 text-left font-mono text-[8px] uppercase leading-snug tracking-[0.14em] text-frost/75 motion-safe:animate-fz-ticker sm:text-[9px] sm:tracking-[0.18em]"
          >
            {tickerText}
          </p>
        </div>
        {/* Center: primary quick action */}
        <button
          type="button"
          onClick={() => onEnter({ kind: 'standard', mode: 'words' })}
          className="fz-hub-tile-glow flex min-h-[52px] min-w-0 flex-col items-center justify-center rounded-sm border border-acid/45 bg-acid/[0.14] px-2 py-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-acid shadow-[0_0_20px_rgba(0,240,255,0.12)] transition-[border-color,background-color,transform] duration-200 hover:border-acid/65 hover:bg-acid/22 sm:min-h-[56px] sm:text-[10px] sm:tracking-[0.32em]"
        >
          {t('hubQuickLabel')}
        </button>
        {/* Right: online */}
        <button
          type="button"
          onClick={() => setPanel('online')}
          className="fz-hub-tile-glow flex min-h-[52px] min-w-0 flex-col justify-center rounded-sm border border-amber-500/40 bg-gradient-to-br from-black/90 via-amber-950/25 to-black/90 px-2 py-2 text-left shadow-[inset_0_0_24px_rgba(245,158,11,0.07)] transition-all hover:border-amber-400/55 sm:min-h-[56px] sm:px-3"
        >
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-amber-200/95 sm:text-[10px] sm:tracking-[0.3em]">
            {t('hubTileOnline')}
          </span>
          <span className="mt-0.5 line-clamp-2 font-mono text-[7px] uppercase leading-snug tracking-[0.12em] text-amber-200/45 sm:text-[8px]">
            {t('hubOnlineHead')}
          </span>
        </button>
      </footer>

      {panel !== 'none' ? (
        <div
          className="absolute inset-0 z-50 flex items-stretch justify-center bg-black/90 p-2 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="fz-glass fz-glass-edge flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-sm border border-white/[0.1] shadow-capture">
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-3 py-2.5 sm:px-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.38em] text-acid/95 sm:text-[11px]">
                {panel === 'history' && t('hubHistoryHead')}
                {panel === 'online' && t('hubOnlineHead')}
                {panel === 'profile' && t('hubProfileHead')}
                {panel === 'quests' && t('hubQuestHead')}
                {panel === 'custom' && t('hubCustomHead')}
              </span>
              <button
                type="button"
                onClick={() => setPanel('none')}
                className="rounded-sm border border-white/15 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.28em] text-ash transition-colors hover:border-acid/40 hover:text-acid"
              >
                {t('hubPanelClose')}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ash/80 sm:px-4 sm:text-[10px] sm:tracking-[0.18em]">
              {panel === 'history' && (
                <ul className="space-y-2.5">
                  {save.sessions.length === 0 ? (
                    <li className="text-ash/50">{t('hubEmptyLog')}</li>
                  ) : (
                    [...save.sessions]
                      .reverse()
                      .map((s) => (
                        <li
                          key={s.id}
                          className="border-l-2 border-acid/35 bg-black/30 py-2 pl-3 text-[8px] leading-relaxed sm:text-[9px]"
                        >
                          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash/50">
                            {formatHistoryTimestamp(s.at, locale)}
                          </div>
                          <div className="mt-1.5 space-y-1 text-frost/90 normal-case tracking-normal">
                            <div>
                              <span className="text-ash/50">{t('hubHistoryLabelKind')}: </span>
                              {formatSessionKindLabel(s.kind, t)}
                            </div>
                            <div>
                              <span className="text-ash/50">{t('hubHistoryLabelMode')}: </span>
                              {formatSessionModeLabel(s.mode, t)}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 tabular-nums">
                              <span>
                                {t('hubLblWpm')} <span className="text-acid/90">{s.wpm}</span>
                              </span>
                              <span>
                                {t('hubLblAcc')} <span className="text-frost/90">{s.acc}%</span>
                              </span>
                              <span>
                                {t('hubLblErr')} <span className="text-blood/80">{s.errors}</span>
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                  )}
                </ul>
              )}
              {panel === 'online' && (
                <p className="leading-relaxed text-ash/75 normal-case tracking-normal">{t('hubOnlineBody')}</p>
              )}
              {panel === 'profile' && (
                <div className="space-y-3 text-[8px] normal-case tracking-normal sm:text-[9px]">
                  <dl className="grid gap-2 rounded-sm border border-white/[0.08] bg-black/40 p-3">
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelId')}</dt>
                      <dd className="max-w-[min(100%,14rem)] truncate text-right text-frost/95">{save.profile.id}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelCall')}</dt>
                      <dd className="text-right text-frost/95">{save.profile.nickname}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelBio')}</dt>
                      <dd className="text-right text-frost/90">{save.profile.bio || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelAvgWpm')}</dt>
                      <dd className="tabular-nums text-acid/90">{avgWpm}</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelAvgAcc')}</dt>
                      <dd className="tabular-nums text-frost/95">{avgAcc}%</dd>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-white/[0.06] pb-2">
                      <dt className="text-ash/55">{t('hubProfileLabelPresence')}</dt>
                      <dd className="tabular-nums text-frost/95">
                        {formatPresenceSeconds(save.meta.totalPresenceSeconds, t)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-ash/55">{t('hubProfileLabelChars')}</dt>
                      <dd className="tabular-nums text-frost/95">{save.stats.totalChars}</dd>
                    </div>
                  </dl>
                </div>
              )}
              {panel === 'quests' && (
                <ul className="space-y-3 text-[8px] sm:text-[9px]">
                  <li className="rounded-sm border border-white/[0.1] bg-black/45 p-3">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-acid/90">
                      {t('questDailyCharsTitle')}
                    </p>
                    <p className="mt-1.5 leading-relaxed text-ash/75 normal-case">{t('questDailyCharsDesc')}</p>
                    <p className="mt-2 font-mono tabular-nums text-frost/90">
                      {save.quests.daily_chars?.progress ?? 0}/1000 ·{' '}
                      {save.quests.daily_chars?.done ? t('questDone') : t('questOpen')}
                    </p>
                  </li>
                  <li className="rounded-sm border border-white/[0.1] bg-black/45 p-3">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-acid/90">
                      {t('questDailySpeedTitle')}
                    </p>
                    <p className="mt-1.5 leading-relaxed text-ash/75 normal-case">{t('questDailySpeedDesc')}</p>
                    <p className="mt-2 font-mono text-frost/90">
                      {save.quests.daily_speed?.done ? t('questCleared') : t('questOpen')}
                    </p>
                  </li>
                  <li className="rounded-sm border border-white/[0.1] bg-black/45 p-3">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-acid/90">
                      {t('questWeeklySessionsTitle')}
                    </p>
                    <p className="mt-1.5 leading-relaxed text-ash/75 normal-case">{t('questWeeklySessionsDesc')}</p>
                    <p className="mt-2 font-mono tabular-nums text-frost/90">
                      {save.quests.weekly_sessions?.progress ?? 0}/8
                    </p>
                  </li>
                </ul>
              )}
              {panel === 'custom' && (
                <div className="space-y-4 text-[8px] normal-case tracking-normal sm:text-[9px]">
                  <p className="leading-relaxed text-ash/75">{t('hubCustomHint')}</p>
                  <div className="rounded-sm border border-acid/20 bg-black/50 p-3">
                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash/55">{t('hubWordCount')}</div>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-black/60 font-mono text-acid hover:border-acid/40"
                        onClick={() => updateCustom({ wordCount: Math.max(2, save.custom.wordCount - 1) })}
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center font-mono text-2xl font-bold tabular-nums text-acid">
                        {save.custom.wordCount}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-black/60 font-mono text-acid hover:border-acid/40"
                        onClick={() => updateCustom({ wordCount: Math.min(24, save.custom.wordCount + 1) })}
                      >
                        +
                      </button>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      value={save.custom.wordCount}
                      onChange={(e) => updateCustom({ wordCount: Number(e.target.value) })}
                      className="mt-3 h-1.5 w-full accent-acid"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => updateCustom({ shuffle: !save.custom.shuffle })}
                      className={[
                        'flex items-center justify-between gap-2 rounded-sm border px-2.5 py-2 text-left font-mono text-[8px] uppercase tracking-[0.14em] transition-colors',
                        save.custom.shuffle
                          ? 'border-acid/45 bg-acid/10 text-acid'
                          : 'border-white/10 bg-black/50 text-ash/80 hover:border-acid/25',
                      ].join(' ')}
                    >
                      <span>{t('hubShuffle')}</span>
                      <span className="text-[10px]">{save.custom.shuffle ? '✓' : '—'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustom({ caseSensitive: !save.custom.caseSensitive })}
                      className={[
                        'flex items-center justify-between gap-2 rounded-sm border px-2.5 py-2 text-left font-mono text-[8px] uppercase tracking-[0.14em] transition-colors',
                        save.custom.caseSensitive
                          ? 'border-acid/45 bg-acid/10 text-acid'
                          : 'border-white/10 bg-black/50 text-ash/80 hover:border-acid/25',
                      ].join(' ')}
                    >
                      <span>{t('hubCase')}</span>
                      <span className="text-[10px]">{save.custom.caseSensitive ? '✓' : '—'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustom({ strict: !save.custom.strict })}
                      className={[
                        'flex items-center justify-between gap-2 rounded-sm border px-2.5 py-2 text-left font-mono text-[8px] uppercase tracking-[0.14em] transition-colors',
                        save.custom.strict
                          ? 'border-acid/45 bg-acid/10 text-acid'
                          : 'border-white/10 bg-black/50 text-ash/80 hover:border-acid/25',
                      ].join(' ')}
                    >
                      <span>{t('hubStrict')}</span>
                      <span className="text-[10px]">{save.custom.strict ? '✓' : '—'}</span>
                    </button>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash/55">{t('hubCharset')}</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {(['alpha', 'alnum', 'hex'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateCustom({ charset: c })}
                          className={[
                            'rounded-sm border px-2 py-2.5 text-center font-mono text-[8px] leading-snug transition-colors sm:text-[9px]',
                            save.custom.charset === c
                              ? 'border-acid/55 bg-acid/12 text-acid'
                              : 'border-white/10 bg-black/55 text-ash/85 hover:border-acid/30',
                          ].join(' ')}
                        >
                          {c === 'alpha' ? t('hubCharsetOptAlpha') : c === 'alnum' ? t('hubCharsetOptAlnum') : t('hubCharsetOptHex')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onEnter({ kind: 'custom', mode: 'words', custom: save.custom });
                      setPanel('none');
                    }}
                    className="w-full rounded-sm border border-acid/45 bg-acid/12 py-2.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-acid/18"
                  >
                    {t('hubApply')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export const MainHub = memo(MainHubView);
