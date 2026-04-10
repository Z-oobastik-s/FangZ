import type { Locale } from './types';

export type MessageKey =
  | 'appAria'
  | 'brandSubtitle'
  | 'tagline'
  | 'inputHint'
  | 'capturePlane'
  | 'footer'
  | 'terminatedTitle'
  | 'terminatedBody'
  | 'restore'
  | 'phaseDead'
  | 'phaseWarn'
  | 'phaseStrike1'
  | 'phaseOpen'
  | 'sfxOn'
  | 'sfxOff'
  | 'ambient'
  | 'ambientVol'
  | 'ambientTrackOn'
  | 'ambientTrackOff'
  | 'lang'
  | 'hudRouting'
  | 'modeWords'
  | 'modeLetters'
  | 'modeBurst'
  | 'modePattern'
  | 'strikesLive'
  | 'metricTime'
  | 'metricFlt'
  | 'terminatedA11y'
  | 'strikesA11y';

const catalog: Record<Locale, Record<MessageKey, string>> = {
  en: {
    appAria: 'FangZ typing capture',
    brandSubtitle: 'tactical input core',
    tagline:
      'blind channel. strict capture. faults purge the buffer. the third fault ends the run.',
    inputHint: 'input: raw keys / space locks scroll',
    capturePlane: 'capture plane',
    footer: 'static edge / no accounts / local only',
    terminatedTitle: 'session terminated',
    terminatedBody: 'three faults. channel closed. the system does not negotiate.',
    restore: 'restore system',
    phaseDead: 'strike lock / terminated',
    phaseWarn: 'threshold 2 / next fault ejects',
    phaseStrike1: 'fault registered / buffer wiped',
    phaseOpen: 'channel open / no mercy',
    sfxOn: 'snd on',
    sfxOff: 'snd off',
    ambient: 'ambient',
    ambientVol: 'drone level',
    ambientTrackOn: 'on',
    ambientTrackOff: 'off',
    lang: 'lang',
    hudRouting: 'routing / fx',
    modeWords: 'words',
    modeLetters: 'letters',
    modeBurst: 'burst',
    modePattern: 'pattern',
    strikesLive: 'strikes',
    metricTime: 'clk',
    metricFlt: 'flt',
    terminatedA11y: 'Terminated. Restore system to continue.',
    strikesA11y: 'Strikes {s}. Segment index {i}.',
  },
  uk: {
    appAria: 'FangZ: захоплення набору',
    brandSubtitle: 'тактичне ядро вводу',
    tagline:
      'сліпий канал. жорсткий контроль. збій чистить буфер. третій збій завершує сеанс.',
    inputHint: 'ввід: сирі клавіші / пробіл блокує прокрутку',
    capturePlane: 'площина захоплення',
    footer: 'статичний край / без акаунтів / лише локально',
    terminatedTitle: 'сеанс завершено',
    terminatedBody: 'три збої. канал закрито. система не веде переговорів.',
    restore: 'відновити систему',
    phaseDead: 'блокування / завершено',
    phaseWarn: 'поріг 2 / наступний збій викидає',
    phaseStrike1: 'збій зафіксовано / буфер очищено',
    phaseOpen: 'канал відкрито / без жалю',
    sfxOn: 'звук вмк',
    sfxOff: 'звук вимк',
    ambient: 'фон',
    ambientVol: 'рівень дрону',
    ambientTrackOn: 'вмк',
    ambientTrackOff: 'вимк',
    lang: 'мова',
    hudRouting: 'маршрут / fx',
    modeWords: 'слова',
    modeLetters: 'літери',
    modeBurst: 'зрив',
    modePattern: 'патерн',
    strikesLive: 'збої',
    metricTime: 'час',
    metricFlt: 'зб',
    terminatedA11y: 'Завершено. Натисніть відновлення, щоб продовжити.',
    strikesA11y: 'Збої {s}. Індекс сегмента {i}.',
  },
  ru: {
    appAria: 'FangZ: захват ввода',
    brandSubtitle: 'тактическое ядро ввода',
    tagline:
      'слепой канал. жёсткий контроль. сбой чистит буфер. третий сбой завершает сеанс.',
    inputHint: 'ввод: сырые клавиши / пробел блокирует прокрутку',
    capturePlane: 'плоскость захвата',
    footer: 'статический край / без аккаунтов / только локально',
    terminatedTitle: 'сеанс завершён',
    terminatedBody: 'три сбоя. канал закрыт. система не ведёт переговоров.',
    restore: 'восстановить систему',
    phaseDead: 'блокировка / завершено',
    phaseWarn: 'порог 2 / следующий сбой выбрасывает',
    phaseStrike1: 'сбой зафиксирован / буфер очищен',
    phaseOpen: 'канал открыт / без пощады',
    sfxOn: 'звук вкл',
    sfxOff: 'звук выкл',
    ambient: 'фон',
    ambientVol: 'уровень дрона',
    ambientTrackOn: 'вкл',
    ambientTrackOff: 'выкл',
    lang: 'язык',
    hudRouting: 'маршрут / fx',
    modeWords: 'слова',
    modeLetters: 'буквы',
    modeBurst: 'срыв',
    modePattern: 'паттерн',
    strikesLive: 'сбои',
    metricTime: 'врм',
    metricFlt: 'сб',
    terminatedA11y: 'Завершено. Нажмите восстановление, чтобы продолжить.',
    strikesA11y: 'Сбои {s}. Индекс сегмента {i}.',
  },
};

export function getMessage(locale: Locale, key: MessageKey): string {
  return catalog[locale][key];
}

export function formatStrikesA11y(locale: Locale, strikes: number, index: number): string {
  return getMessage(locale, 'strikesA11y').replace('{s}', String(strikes)).replace('{i}', String(index));
}
