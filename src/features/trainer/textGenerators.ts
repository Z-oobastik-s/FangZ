import type { CustomGenConfig } from '../../shared/persistence/fangzStore';
import type { GeneratorMode } from '../../shared/game/generatorMode';

/** Lexicon for typing content (follows UI language). */
export type TextLocale = 'en' | 'ru' | 'uk';

const LEXICON_EN: readonly string[] = [
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

/** Short tech-style Russian words for Cyrillic typing. */
const LEXICON_RU: readonly string[] = [
  'поток',
  'код',
  'сбой',
  'риск',
  'узел',
  'канал',
  'сигнал',
  'шифр',
  'вектор',
  'ядро',
  'паника',
  'фатал',
  'взлом',
  'разрыв',
  'охота',
  'добыча',
  'давление',
  'трещина',
  'тишина',
  'статик',
  'сеть',
  'хром',
  'лезвие',
  'напряжение',
  'обрыв',
  'энтропия',
  'протокол',
  'барьер',
  'опасность',
  'очистка',
  'блок',
  'сброс',
  'удар',
  'импульс',
  'реактор',
  'терминал',
  'провал',
  'всплеск',
  'глюк',
  'пустота',
  'яд',
  'катализ',
  'порог',
  'дедлайн',
  'трение',
  'титан',
  'углерод',
  'оксид',
  'сера',
  'ток',
  'дуга',
  'потоки',
  'матрица',
  'решётка',
  'ноль',
  'риск',
  'предел',
  'стык',
  'сталь',
  'жало',
  'кусок',
  'гнев',
  'злость',
  'кризис',
  'стоп',
  'лед',
  'жар',
  'рез',
  'удар',
  'режим',
  'фантом',
  'тень',
  'эхо',
  'шум',
  'фаза',
  'синтез',
  'пакет',
  'буфер',
  'сессия',
  'сеанс',
  'канал',
  'узел',
  'маршрут',
  'след',
  'метка',
  'ключ',
  'замок',
  'щит',
  'броня',
  'каркас',
  'остров',
  'руина',
  'пепел',
  'искра',
  'вспышка',
  'дыра',
  'разрез',
  'контур',
  'срез',
  'фильтр',
  'порог',
  'линия',
  'точка',
  'узор',
  'кольцо',
  'звено',
  'цепь',
  'узел',
];

/** Ukrainian keyboard-oriented short words. */
const LEXICON_UK: readonly string[] = [
  'потік',
  'код',
  'збій',
  'ризик',
  'вузол',
  'канал',
  'сигнал',
  'шифр',
  'вектор',
  'ядро',
  'паніка',
  'фатал',
  'злам',
  'розрив',
  'полювання',
  'добича',
  'тиск',
  'тріщина',
  'тиша',
  'статик',
  'мережа',
  'хром',
  'лезо',
  'напруга',
  'обрив',
  'ентропія',
  'протокол',
  'бар\'єр',
  'небезпека',
  'очищення',
  'блок',
  'скид',
  'удар',
  'імпульс',
  'реактор',
  'термінал',
  'провал',
  'сплеск',
  'глюк',
  'порожнеча',
  'отрута',
  'каталіз',
  'поріг',
  'дедлайн',
  'тертя',
  'титан',
  'вуглець',
  'оксид',
  'сірка',
  'струм',
  'дуга',
  'матриця',
  'решітка',
  'нуль',
  'межа',
  'стик',
  'сталь',
  'жало',
  'шматок',
  'лють',
  'злість',
  'криза',
  'стоп',
  'лід',
  'жар',
  'різ',
  'удар',
  'режим',
  'фантом',
  'тінь',
  'лун',
  'шум',
  'фаза',
  'синтез',
  'пакет',
  'буфер',
  'сесія',
  'сеанс',
  'маршрут',
  'слід',
  'мітка',
  'ключ',
  'замок',
  'щит',
  'броня',
  'каркас',
  'острів',
  'руїна',
  'попіл',
  'іскра',
  'спалах',
  'дірка',
  'розріз',
  'контур',
  'зріз',
  'фільтр',
  'лінія',
  'точка',
  'вузор',
  'кільце',
  'ланка',
  'ланцюг',
];

function lexiconFor(locale: TextLocale): readonly string[] {
  switch (locale) {
    case 'ru':
      return LEXICON_RU;
    case 'uk':
      return LEXICON_UK;
    default:
      return LEXICON_EN;
  }
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomWord(locale: TextLocale): string {
  return pick(lexiconFor(locale));
}

function randomLetter(locale: TextLocale): string {
  if (locale === 'en') {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  const cyr = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
  return pick([...cyr]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildCustomSegment(cfg: CustomGenConfig, locale: TextLocale = 'en'): string {
  const wc = Math.max(2, Math.min(24, cfg.wordCount));

  if (cfg.charset === 'hex') {
    const len = Math.max(24, wc * 4);
    let body = Array.from({ length: len }, () => pick([...'0123456789abcdef'])).join('');
    if (cfg.shuffle) body = shuffle([...body]).join('');
    return cfg.caseSensitive ? body : body.toLowerCase();
  }

  if (cfg.charset === 'alnum') {
    const pool =
      locale === 'en'
        ? 'abcdefghijklmnopqrstuvwxyz0123456789'
        : 'абвгдежзийклмнопрстуфхцчшщъыьэюя0123456789';
    const len = Math.max(24, wc * 5);
    let body = Array.from({ length: len }, () => pick([...pool])).join('');
    if (cfg.shuffle) body = shuffle([...body]).join('');
    return cfg.caseSensitive ? body : body.toLowerCase();
  }

  let words = Array.from({ length: wc }, () => randomWord(locale));
  if (cfg.shuffle) words = shuffle(words);
  const body = words.join(' ');
  if (!cfg.caseSensitive) return body.toLowerCase();
  return body
    .split(' ')
    .map((w) => (w.length ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export function buildSegment(mode: GeneratorMode, locale: TextLocale = 'en'): string {
  switch (mode) {
    case 'letters': {
      const len = 12 + Math.floor(Math.random() * 9);
      return Array.from({ length: len }, () => randomLetter(locale)).join('');
    }
    case 'words': {
      const count = 3 + Math.floor(Math.random() * 4);
      return Array.from({ length: count }, () => randomWord(locale)).join(' ');
    }
    case 'burst': {
      const chunks = 4 + Math.floor(Math.random() * 4);
      const parts: string[] = [];
      for (let i = 0; i < chunks; i++) {
        const w = randomWord(locale);
        const sep = pick([' ', ' ', '  ']);
        parts.push(w + sep);
      }
      return parts.join('').trimEnd();
    }
    case 'pattern': {
      const base =
        locale === 'en'
          ? pick(['ab', '01', 'xy', 'kq'])
          : pick(['аб', '01', 'ув', 'кс']);
      const a = base[0]!;
      const b = base[1]!;
      const len = 18 + Math.floor(Math.random() * 14);
      return Array.from({ length: len }, (_, i) => (i % 2 === 0 ? a : b)).join('');
    }
  }
}
