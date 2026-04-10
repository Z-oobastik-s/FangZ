import { useEffect, useMemo, useState } from 'react';
import type { SessionSpec } from '../../app/sessionSpec';
import { useFangz } from '../../app/FangzContext';
import type { FangzSave } from '../../shared/persistence/fangzStore';
import { GENERATOR_MODES, type GeneratorMode } from '../trainer/types';
import { rankFromChars, rankProgress, type RankId } from '../../shared/game/rank';
import { useI18n } from '../../shared/i18n/I18nContext';

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

function formatPresence(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
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

function HubTile({ moduleId, title, sub, onClick, accent, className = '' }: HubTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'fz-hub-tile-glow group relative flex min-h-[72px] w-full flex-col justify-between overflow-hidden rounded-sm border border-white/[0.1] bg-gradient-to-br from-black/85 via-black/65 to-black/80 pl-3.5 pr-2.5 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[84px] sm:pl-4 sm:py-3',
        'hover:-translate-y-0.5 hover:border-acid/35 active:translate-y-0',
        className,
      ].join(' ')}
    >
      <span className={`absolute bottom-0 left-0 top-0 w-[3px] ${accentBar[accent]}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2 pl-1">
        <span className="font-mono text-[9px] font-bold tabular-nums tracking-[0.28em] text-acid/55 sm:text-[10px]">
          {moduleId}
        </span>
        <span
          className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-acid/80 shadow-glow-acid-sm animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
      </div>
      <div className="pl-1">
        <span className="block font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.28em] text-frost/95 sm:text-xs sm:tracking-[0.32em]">
          {title}
        </span>
        <span className="mt-1 block font-mono text-[9px] uppercase leading-snug tracking-[0.14em] text-ash/65 sm:text-[10px] sm:tracking-[0.18em]">
          {sub}
        </span>
      </div>
    </button>
  );
}

type Props = {
  panel: HubPanel;
  setPanel: (p: HubPanel) => void;
  onEnter: (spec: SessionSpec) => void;
};

export function MainHub({ panel, setPanel, onEnter }: Props) {
  const { t } = useI18n();
  const { save, updateCustom } = useFangz();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((k) => (k + 1) % 4), 4200);
    return () => window.clearInterval(id);
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
    <main className="fz-hub-root relative z-20 flex h-full min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-3 sm:py-2 lg:px-5 lg:py-3">
      {/* Top command strip */}
      <header className="mb-1.5 flex shrink-0 items-stretch gap-2 sm:mb-2 sm:gap-3">
        <div className="hidden w-[7.5rem] shrink-0 flex-col justify-center rounded-sm border border-white/[0.08] bg-black/50 px-2 py-1.5 font-mono text-[8px] uppercase leading-tight tracking-[0.2em] text-ash/55 sm:flex lg:w-[8.5rem]">
          <span className="text-acid/70">sys</span>
          <span className="mt-1 flex items-center gap-1.5 text-[9px] text-frost/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid shadow-glow-acid-sm motion-reduce:animate-none" />
            sync
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPanel('history')}
          className="fz-hub-tile-glow relative min-h-[56px] flex-1 overflow-hidden rounded-sm border border-acid/30 bg-gradient-to-r from-black/80 via-black/60 to-black/80 px-3 py-2 text-center shadow-[inset_0_0_40px_rgba(0,240,255,0.04)] sm:min-h-[64px] sm:px-4"
        >
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-acid/40 to-transparent" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-acid sm:text-[11px] sm:tracking-[0.5em]">
            {t('hubTileHistory')}
          </span>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-ash/55 sm:text-[10px]">
            {t('hubHistoryHead')}
          </span>
        </button>
        <div className="hidden w-[7.5rem] shrink-0 flex-col justify-end rounded-sm border border-white/[0.08] bg-black/50 px-2 py-1.5 text-right font-mono text-[8px] uppercase tracking-[0.18em] text-ash/50 sm:flex lg:w-[8.5rem]">
          <span className="text-ash/40">sym</span>
          <span className="mt-0.5 text-[10px] tabular-nums text-frost/85">{save.stats.totalChars}</span>
        </div>
      </header>

      {/* Main symmetric grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[1fr_minmax(300px,460px)_1fr] lg:gap-3 lg:overflow-hidden">
        <aside className="flex min-h-0 flex-col gap-2 lg:justify-between">
          <HubTile
            moduleId="M-01"
            title={t('hubTileQuests')}
            sub={qDone ? `${t('hubQuestHead')} · ok` : `${qProg}/1000`}
            accent="frost"
            onClick={() => setPanel('quests')}
          />
          <HubTile
            moduleId="M-02"
            title={t('hubTileSpeed')}
            sub="60s · lock"
            accent="blood"
            onClick={() => onEnter({ kind: 'speed60' })}
            className="border-blood/15 hover:border-blood/35"
          />
        </aside>

        <section className="relative flex min-h-0 flex-col justify-between gap-3 lg:min-h-[280px]">
          <div className="fz-hub-core-shell relative flex min-h-0 flex-1 flex-col justify-between rounded-sm border border-acid/35 bg-gradient-to-b from-[#030308] via-[#05060f] to-[#020205] px-3 py-3 shadow-glow-acid-sm sm:px-5 sm:py-4">
            <div className="fz-hub-bracket pointer-events-none opacity-70" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,240,255,0.12),transparent_55%)] opacity-90" />
            <div className="relative z-[1] text-center">
              <p className="font-mono text-[8px] uppercase tracking-[0.55em] text-acid/45 sm:text-[9px]">fangz</p>
              <h1 className="font-display text-2xl font-bold tracking-[0.42em] text-acid [text-shadow:0_0_28px_rgba(0,240,255,0.35)] sm:text-3xl sm:tracking-[0.48em]">
                FANGZ
              </h1>
              <p className="mt-1 font-mono text-[8px] uppercase leading-relaxed tracking-[0.28em] text-ash/55 sm:text-[9px] sm:tracking-[0.32em]">
                {t('hubNucleusSubtitle')}
              </p>
            </div>

            <div className="relative z-[1] space-y-2.5 font-mono text-[9px] uppercase sm:space-y-3 sm:text-[10px]">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <div className="rounded-sm border border-white/[0.07] bg-black/40 px-2 py-1.5 sm:px-2.5">
                  <span className="block text-[8px] tracking-[0.25em] text-ash/45">id</span>
                  <span className="mt-0.5 block truncate text-[9px] tracking-[0.12em] text-frost/90 sm:text-[10px]">
                    {save.profile.id}
                  </span>
                </div>
                <div className="rounded-sm border border-white/[0.07] bg-black/40 px-2 py-1.5 sm:px-2.5">
                  <span className="block text-[8px] tracking-[0.25em] text-ash/45">sym</span>
                  <span className="mt-0.5 block tabular-nums text-frost/90">{save.stats.totalChars}</span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[8px] tracking-[0.2em] text-ash/45 sm:text-[9px]">
                  <span>rtg</span>
                  <span className="tabular-nums text-acid/80">{Math.round(rp.pct * 100)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-acid-dim via-acid to-acid/90 transition-[width] duration-500"
                    style={{ width: `${Math.round(rp.pct * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-white/[0.06] pt-2 text-[9px] sm:text-[10px]">
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
              <p className="border-t border-white/[0.05] pt-2 text-blood/90">
                <span className="text-ash/45">{t('hubStreak')} </span>
                <span className="tabular-nums">{save.meta.streak}</span>
              </p>
            </div>

            <div className="relative z-[1] space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onEnter(continueSpec)}
                className="group relative w-full overflow-hidden rounded-sm border border-acid/55 bg-acid/20 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.42em] text-acid shadow-[0_0_32px_rgba(0,240,255,0.22)] transition-all hover:bg-acid/30 hover:shadow-[0_0_44px_rgba(0,240,255,0.3)] active:scale-[0.99] sm:py-3.5 sm:text-xs sm:tracking-[0.48em]"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {hasProgress ? t('hubPrimaryContinue') : t('hubPrimaryStart')}
              </button>
              <p className="text-center font-mono text-[8px] uppercase tracking-[0.38em] text-acid/45 sm:text-[9px]">
                {t('hubOpenChannel')}
              </p>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-2 lg:justify-between">
          <HubTile
            moduleId="M-03"
            title={t('hubTileProfile')}
            sub={save.profile.nickname}
            accent="frost"
            onClick={() => setPanel('profile')}
          />
          <HubTile
            moduleId="M-04"
            title={t('hubTileCustom')}
            sub={`${save.custom.charset} · ${save.custom.wordCount}`}
            accent="acid"
            onClick={() => setPanel('custom')}
          />
        </aside>
      </div>

      {/* Bottom band */}
      <footer className="mt-2 flex shrink-0 flex-col gap-2 sm:mt-2.5 lg:flex-row lg:items-stretch lg:gap-3">
        <button
          type="button"
          onClick={() => setPanel('online')}
          className="fz-hub-tile-glow relative min-h-[56px] flex-1 overflow-hidden rounded-sm border border-amber-500/35 bg-gradient-to-r from-black/85 via-amber-950/20 to-black/85 px-3 py-2 text-left shadow-[inset_0_0_36px_rgba(245,158,11,0.06)] transition-all hover:-translate-y-0.5 hover:border-amber-400/55 sm:min-h-[60px] sm:px-4"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.42em] text-amber-200/95 sm:text-[11px]">
            {t('hubTileOnline')}
          </span>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-ash/55 sm:text-[10px]">
            {t('hubOnlineHead')}
          </span>
        </button>
        <div className="flex min-h-[52px] flex-col justify-center gap-1.5 rounded-sm border border-white/[0.1] bg-black/55 px-3 py-2 sm:min-h-[60px] sm:min-w-[min(100%,280px)] lg:max-w-sm">
          <button
            type="button"
            onClick={() => onEnter({ kind: 'standard', mode: 'words' })}
            className="w-full rounded-sm border border-acid/25 bg-acid/[0.07] py-2 font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-acid/95 transition-colors hover:border-acid/45 hover:bg-acid/15 sm:text-[10px]"
          >
            {t('hubQuickLabel')}
          </button>
          <p
            key={tick}
            className="truncate text-center font-mono text-[8px] uppercase tracking-[0.35em] text-ash/50 motion-safe:animate-fz-ticker sm:text-[9px]"
          >
            {tickerText}
          </p>
        </div>
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
                    save.sessions.map((s) => (
                      <li
                        key={s.id}
                        className="border-l-2 border-acid/35 bg-black/30 py-1.5 pl-3 text-[8px] leading-relaxed text-frost/90 sm:text-[9px]"
                      >
                        <span className="text-ash/45">
                          {new Date(s.at).toISOString().replace('T', ' ').slice(0, 19)}
                        </span>
                        <br />
                        {s.kind} / {s.mode} / wpm {s.wpm} / acc {s.acc}% / err {s.errors}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {panel === 'online' && (
                <p className="leading-relaxed text-ash/75 normal-case tracking-normal">{t('hubOnlineBody')}</p>
              )}
              {panel === 'profile' && (
                <div className="space-y-2.5 text-[8px] normal-case tracking-normal sm:text-[9px]">
                  <p>
                    <span className="text-ash/45">id </span>
                    {save.profile.id}
                  </p>
                  <p>
                    <span className="text-ash/45">call </span>
                    {save.profile.nickname}
                  </p>
                  <p>
                    <span className="text-ash/45">bio </span>
                    {save.profile.bio || '—'}
                  </p>
                  <p>
                    <span className="text-ash/45">avg wpm </span>
                    {avgWpm}
                  </p>
                  <p>
                    <span className="text-ash/45">avg acc </span>
                    {avgAcc}%
                  </p>
                  <p>
                    <span className="text-ash/45">presence </span>
                    {formatPresence(save.meta.totalPresenceSeconds)}
                  </p>
                  <p>
                    <span className="text-ash/45">chars </span>
                    {save.stats.totalChars}
                  </p>
                </div>
              )}
              {panel === 'quests' && (
                <ul className="space-y-3 text-[8px] sm:text-[9px]">
                  <li className="rounded-sm border border-white/[0.08] bg-black/50 p-3">
                    daily_chars: {save.quests.daily_chars?.progress ?? 0}/1000
                    {save.quests.daily_chars?.done ? ' · ok' : ''}
                  </li>
                  <li className="rounded-sm border border-white/[0.08] bg-black/50 p-3">
                    daily_speed: {save.quests.daily_speed?.done ? 'cleared' : 'open'}
                  </li>
                  <li className="rounded-sm border border-white/[0.08] bg-black/50 p-3">
                    weekly_sessions: {save.quests.weekly_sessions?.progress ?? 0}/8
                  </li>
                </ul>
              )}
              {panel === 'custom' && (
                <div className="space-y-4 text-[8px] normal-case tracking-normal sm:text-[9px]">
                  <label className="flex flex-wrap items-center justify-between gap-2">
                    <span className="uppercase tracking-[0.15em] text-ash/55">{t('hubWordCount')}</span>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      value={save.custom.wordCount}
                      onChange={(e) => updateCustom({ wordCount: Number(e.target.value) })}
                      className="w-40 accent-acid"
                    />
                    <span className="tabular-nums text-frost">{save.custom.wordCount}</span>
                  </label>
                  <label className="flex items-center justify-between gap-2">
                    <span className="uppercase tracking-[0.15em] text-ash/55">{t('hubShuffle')}</span>
                    <input
                      type="checkbox"
                      checked={save.custom.shuffle}
                      onChange={(e) => updateCustom({ shuffle: e.target.checked })}
                      className="accent-acid"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-2">
                    <span className="uppercase tracking-[0.15em] text-ash/55">{t('hubCase')}</span>
                    <input
                      type="checkbox"
                      checked={save.custom.caseSensitive}
                      onChange={(e) => updateCustom({ caseSensitive: e.target.checked })}
                      className="accent-acid"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-2">
                    <span className="uppercase tracking-[0.15em] text-ash/55">{t('hubStrict')}</span>
                    <input
                      type="checkbox"
                      checked={save.custom.strict}
                      onChange={(e) => updateCustom({ strict: e.target.checked })}
                      className="accent-acid"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="uppercase tracking-[0.15em] text-ash/55">{t('hubCharset')}</span>
                    <select
                      value={save.custom.charset}
                      onChange={(e) =>
                        updateCustom({ charset: e.target.value as 'alpha' | 'alnum' | 'hex' })
                      }
                      className="border border-white/15 bg-black/60 px-2 py-1.5 text-frost"
                    >
                      <option value="alpha">{t('hubCharsetAlpha')}</option>
                      <option value="alnum">{t('hubCharsetAlnum')}</option>
                      <option value="hex">{t('hubCharsetHex')}</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onEnter({ kind: 'custom', mode: 'words', custom: save.custom });
                      setPanel('none');
                    }}
                    className="mt-2 w-full rounded-sm border border-acid/40 bg-acid/10 py-2.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-acid transition-colors hover:bg-acid/20"
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
