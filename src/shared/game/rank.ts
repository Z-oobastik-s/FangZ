export type RankId = 'watcher' | 'operator' | 'predator' | 'core';

const ORDER: RankId[] = ['watcher', 'operator', 'predator', 'core'];

const THRESHOLD: Record<RankId, number> = {
  watcher: 0,
  operator: 3000,
  predator: 25000,
  core: 120000,
};

export function rankFromChars(totalChars: number): RankId {
  let r: RankId = 'watcher';
  for (const id of ORDER) {
    if (totalChars >= THRESHOLD[id]) r = id;
  }
  return r;
}

export function rankProgress(totalChars: number): { id: RankId; next: RankId | null; pct: number } {
  const id = rankFromChars(totalChars);
  const idx = ORDER.indexOf(id);
  const next = idx < ORDER.length - 1 ? ORDER[idx + 1]! : null;
  if (!next) return { id, next: null, pct: 1 };
  const lo = THRESHOLD[id];
  const hi = THRESHOLD[next];
  const pct = Math.min(1, Math.max(0, (totalChars - lo) / (hi - lo)));
  return { id, next, pct };
}
