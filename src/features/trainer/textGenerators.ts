import type { CustomGenConfig } from '../../shared/persistence/fangzStore';
import type { GeneratorMode } from './types';

const LEXICON: readonly string[] = [
  'void',
  'shard',
  'pulse',
  'blade',
  'fang',
  'cold',
  'wire',
  'ghost',
  'trace',
  'signal',
  'cipher',
  'vector',
  'syntax',
  'kernel',
  'panic',
  'fatal',
  'abort',
  'inject',
  'exploit',
  'breach',
  'hunter',
  'prey',
  'grind',
  'pressure',
  'fracture',
  'overload',
  'silence',
  'static',
  'neural',
  'chrome',
  'razor',
  'tension',
  'collapse',
  'entropy',
  'protocol',
  'barrier',
  'hazard',
  'purge',
  'lock',
  'drain',
  'rupture',
  'impact',
  'stimulus',
  'reactor',
  'terminal',
  'blackout',
  'surge',
  'glitch',
  'hollow',
  'venom',
  'catalyst',
  'threshold',
  'deadline',
  'friction',
  'titanium',
  'carbon',
  'oxide',
  'sulfur',
  'nitro',
  'voltage',
  'current',
  'arc',
  'flux',
  'matrix',
  'lattice',
  'fangz',
  'fang',
  'zero',
  'null',
  'edge',
  'risk',
  'strain',
  'limit',
  'burst',
  'crash',
  'halt',
  'freeze',
  'burn',
  'cut',
  'strike',
  'fury',
  'rage',
  'steel',
  'iron',
  'obsidian',
  'graphite',
  'silicon',
  'neon',
  'argon',
  'xenon',
  'radon',
  'gamma',
  'beta',
  'alpha',
  'sigma',
  'omega',
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomLetter(): string {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}

function randomWord(): string {
  return pick(LEXICON);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildCustomSegment(cfg: CustomGenConfig): string {
  const wc = Math.max(2, Math.min(24, cfg.wordCount));

  if (cfg.charset === 'hex') {
    const len = Math.max(24, wc * 4);
    let body = Array.from({ length: len }, () => pick([...'0123456789abcdef'])).join('');
    if (cfg.shuffle) body = shuffle([...body]).join('');
    return cfg.caseSensitive ? body : body.toLowerCase();
  }

  if (cfg.charset === 'alnum') {
    const pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const len = Math.max(24, wc * 5);
    let body = Array.from({ length: len }, () => pick([...pool])).join('');
    if (cfg.shuffle) body = shuffle([...body]).join('');
    return cfg.caseSensitive ? body : body.toLowerCase();
  }

  let words = Array.from({ length: wc }, () => randomWord());
  if (cfg.shuffle) words = shuffle(words);
  const body = words.join(' ');
  if (!cfg.caseSensitive) return body.toLowerCase();
  return body
    .split(' ')
    .map((w) => (w.length ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export function buildSegment(mode: GeneratorMode): string {
  switch (mode) {
    case 'letters': {
      const len = 12 + Math.floor(Math.random() * 9);
      return Array.from({ length: len }, () => randomLetter()).join('');
    }
    case 'words': {
      const count = 3 + Math.floor(Math.random() * 4);
      return Array.from({ length: count }, () => randomWord()).join(' ');
    }
    case 'burst': {
      const chunks = 4 + Math.floor(Math.random() * 4);
      const parts: string[] = [];
      for (let i = 0; i < chunks; i++) {
        const w = randomWord();
        const sep = pick([' ', ' ', '  ']);
        parts.push(w + sep);
      }
      return parts.join('').trimEnd();
    }
    case 'pattern': {
      const base = pick(['ab', '01', 'xy', 'kq']);
      const a = base[0]!;
      const b = base[1]!;
      const len = 18 + Math.floor(Math.random() * 14);
      return Array.from({ length: len }, (_, i) => (i % 2 === 0 ? a : b)).join('');
    }
  }
}
