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

const tileBase =
  'group relative flex min-h-[44px] flex-col justify-center border border-white/[0.09] bg-black/45 px-2 py-1.5 text-left shadow-[inset_0_0_0_1px_rgba(0,240,255,0.04)] transition-all duration-200 hover:border-acid/35 hover:bg-black/55 active:scale-[0.99] sm:min-h-[52px] sm:px-3 sm:py-2';

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

  return (
    <main className="relative z-20 flex h-full min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-4">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 sm:grid-cols-[1fr_minmax(260px,400px)_1fr] sm:grid-rows-[auto_minmax(0,1fr)_auto_auto] sm:gap-2">
        <div className="flex justify-center sm:col-span-3">
          <button
            type="button"
            onClick={() => setPanel('history')}
            className={`${tileBase} w-full max-w-md items-center text-center sm:py-2`}
          >
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.42em] text-acid/90">
              {t('hubTileHistory')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.22em] text-ash/45">
              {t('hubHistoryHead')}
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-col gap-1.5 sm:row-span-1">
          <button type="button" onClick={() => setPanel('quests')} className={tileBase}>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-frost/90">
              {t('hubTileQuests')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-ash/40">
              {save.quests.daily_chars?.done ? 'D ok' : `D ${save.quests.daily_chars?.progress ?? 0}/1000`}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onEnter({ kind: 'speed60' })}
            className={`${tileBase} border-blood/20 hover:border-blood/40`}
          >
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-blood/90">
              {t('hubTileSpeed')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-ash/40">60s</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-col items-center justify-between gap-2 border border-acid/25 bg-black/50 px-3 py-3 shadow-[inset_0_0_48px_rgba(0,240,255,0.06)] sm:min-h-[200px] sm:py-4">
          <div className="text-center">
            <h1 className="font-display text-xl font-bold tracking-[0.5em] text-acid sm:text-2xl">FANGZ</h1>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.32em] text-ash/50">{t('hubNucleusSubtitle')}</p>
          </div>
          <div className="w-full space-y-1.5 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-ash/55">
            <p>
              <span className="text-ash/40">id </span>
              <span className="text-frost/90">{save.profile.id}</span>
            </p>
            <div className="mx-auto h-1 max-w-[200px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-acid/70 transition-[width] duration-500"
                style={{ width: `${Math.round(rp.pct * 100)}%` }}
              />
            </div>
            <p className="text-frost/85">
              <span className="text-ash/40">rank </span>
              {t(rankKey(rank))}
            </p>
            {rp.next ? (
              <p className="text-[7px] text-ash/40">
                next gate · {t(rankKey(rp.next))}
              </p>
            ) : null}
            <p className="text-blood/85">
              {t('hubStreak')} {save.meta.streak}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEnter(continueSpec)}
            className="relative w-full max-w-[280px] border border-acid/45 bg-acid/15 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.45em] text-acid shadow-[0_0_24px_rgba(0,240,255,0.18)] transition-all hover:bg-acid/25 active:scale-[0.98]"
          >
            {hasProgress ? t('hubPrimaryContinue') : t('hubPrimaryStart')}
          </button>
          <p className="font-mono text-[7px] uppercase tracking-[0.35em] text-acid/50">{t('hubOpenChannel')}</p>
        </div>

        <div className="flex min-h-0 flex-col gap-1.5">
          <button type="button" onClick={() => setPanel('profile')} className={tileBase}>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-frost/90">
              {t('hubTileProfile')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-ash/40">
              {save.profile.nickname}
            </span>
          </button>
          <button type="button" onClick={() => setPanel('custom')} className={tileBase}>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-acid/85">
              {t('hubTileCustom')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-ash/40">
              {save.custom.charset} / {save.custom.wordCount}
            </span>
          </button>
        </div>

        <div className="flex justify-center sm:col-span-3">
          <button
            type="button"
            onClick={() => setPanel('online')}
            className={`${tileBase} w-full max-w-xl border-amber-500/25 hover:border-amber-500/45`}
          >
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.4em] text-amber-200/90">
              {t('hubTileOnline')}
            </span>
            <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.2em] text-ash/45">
              {t('hubOnlineHead')}
            </span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 sm:col-span-3">
          <button
            type="button"
            onClick={() => onEnter({ kind: 'standard', mode: 'words' })}
            className="w-full max-w-md border border-white/10 bg-black/40 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.38em] text-ash/75 transition-colors hover:border-acid/30 hover:text-acid"
          >
            {t('hubQuickLabel')}
          </button>
          <p className="truncate font-mono text-[7px] uppercase tracking-[0.42em] text-ash/40">{tickerText}</p>
        </div>
      </div>

      {panel !== 'none' ? (
        <div
          className="absolute inset-0 z-50 flex items-stretch justify-center bg-black/86 p-3 backdrop-blur-[1px] sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden border border-white/12 bg-black/92 shadow-[inset_0_0_0_1px_rgba(0,240,255,0.08)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-acid/90">
                {panel === 'history' && t('hubHistoryHead')}
                {panel === 'online' && t('hubOnlineHead')}
                {panel === 'profile' && t('hubProfileHead')}
                {panel === 'quests' && t('hubQuestHead')}
                {panel === 'custom' && t('hubCustomHead')}
              </span>
              <button
                type="button"
                onClick={() => setPanel('none')}
                className="border border-white/15 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.28em] text-ash hover:border-acid/35 hover:text-acid"
              >
                {t('hubPanelClose')}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-ash/75">
              {panel === 'history' && (
                <ul className="space-y-2">
                  {save.sessions.length === 0 ? (
                    <li className="text-ash/50">{t('hubEmptyLog')}</li>
                  ) : (
                    save.sessions.map((s) => (
                      <li
                        key={s.id}
                        className="border-l-2 border-acid/25 pl-2 text-[8px] leading-relaxed text-frost/85"
                      >
                        <span className="text-ash/45">{new Date(s.at).toISOString().replace('T', ' ').slice(0, 19)}</span>
                        <br />
                        {s.kind} / {s.mode} / wpm {s.wpm} / acc {s.acc}% / err {s.errors}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {panel === 'online' && <p className="leading-relaxed text-ash/70">{t('hubOnlineBody')}</p>}
              {panel === 'profile' && (
                <div className="space-y-2 text-[8px]">
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
                <ul className="space-y-3 text-[8px]">
                  <li className="border border-white/[0.07] bg-black/50 p-2">
                    daily_chars: {save.quests.daily_chars?.progress ?? 0}/1000
                    {save.quests.daily_chars?.done ? ' / locked' : ''}
                  </li>
                  <li className="border border-white/[0.07] bg-black/50 p-2">
                    daily_speed: {save.quests.daily_speed?.done ? 'cleared' : 'open'}
                  </li>
                  <li className="border border-white/[0.07] bg-black/50 p-2">
                    weekly_sessions: {save.quests.weekly_sessions?.progress ?? 0}/8
                  </li>
                </ul>
              )}
              {panel === 'custom' && (
                <div className="space-y-3 text-[8px] normal-case tracking-normal">
                  <label className="flex items-center justify-between gap-2">
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
                      className="border border-white/15 bg-black/60 px-2 py-1 text-frost"
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
                    className="mt-2 w-full border border-acid/35 bg-acid/10 py-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-acid hover:bg-acid/20"
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
