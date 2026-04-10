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
  'shard',
  'fangz',
  'fang',
  'zero',
  'null',
  'void',
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
