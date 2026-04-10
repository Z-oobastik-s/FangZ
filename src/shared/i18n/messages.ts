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
  | 'strikesA11y'
  | 'backHub'
  | 'speedPlane'
  | 'customPlane'
  | 'speedTagline'
  | 'speedResultTitle'
  | 'speedClose'
  | 'hubNucleusSubtitle'
  | 'hubPrimaryStart'
  | 'hubPrimaryContinue'
  | 'hubOpenChannel'
  | 'hubTileSpeed'
  | 'hubTileCustom'
  | 'hubTileHistory'
  | 'hubTileOnline'
  | 'hubTileProfile'
  | 'hubTileQuests'
  | 'hubQuickLabel'
  | 'hubTicker0'
  | 'hubTicker1'
  | 'hubTicker2'
  | 'hubTicker3'
  | 'hubPanelClose'
  | 'hubHistoryHead'
  | 'hubEmptyLog'
  | 'hubOnlineHead'
  | 'hubOnlineBody'
  | 'hubProfileHead'
  | 'hubQuestHead'
  | 'hubCustomHead'
  | 'hubApply'
  | 'hubWordCount'
  | 'hubShuffle'
  | 'hubCase'
  | 'hubCharset'
  | 'hubStrict'
  | 'hubCharsetAlpha'
  | 'hubCharsetAlnum'
  | 'hubCharsetHex'
  | 'rankWatcher'
  | 'rankOperator'
  | 'rankPredator'
  | 'rankCore'
  | 'hubStreak';

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
    backHub: 'back',
    speedPlane: 'speed window / 60s',
    customPlane: 'custom synthesis',
    speedTagline: 'sixty seconds. no narrative. only throughput and failure rate.',
    speedResultTitle: 'window closed / metrics',
    speedClose: 'close channel',
    hubNucleusSubtitle: 'central routing node',
    hubPrimaryStart: 'start',
    hubPrimaryContinue: 'continue',
    hubOpenChannel: 'open channel',
    hubTileSpeed: 'speed test',
    hubTileCustom: 'custom text',
    hubTileHistory: 'history',
    hubTileOnline: 'online',
    hubTileProfile: 'profile',
    hubTileQuests: 'tasks',
    hubQuickLabel: 'instant words',
    hubTicker0: 'system active',
    hubTicker1: 'errors logged',
    hubTicker2: 'channel standby',
    hubTicker3: 'signal unstable',
    hubPanelClose: 'close',
    hubHistoryHead: 'observation log',
    hubEmptyLog: 'no sessions recorded',
    hubOnlineHead: 'wide-area channel',
    hubOnlineBody:
      'live routing is not wired yet. when it opens, this is where exposure begins. expect latency and identity leaks.',
    hubProfileHead: 'operator dossier',
    hubQuestHead: 'directives',
    hubCustomHead: 'synthesis controls',
    hubApply: 'commit preset',
    hubWordCount: 'word count',
    hubShuffle: 'shuffle',
    hubCase: 'case match',
    hubCharset: 'charset',
    hubStrict: 'strict faults',
    hubCharsetAlpha: 'alpha',
    hubCharsetAlnum: 'alnum',
    hubCharsetHex: 'hex',
    rankWatcher: 'watcher',
    rankOperator: 'operator',
    rankPredator: 'predator',
    rankCore: 'core',
    hubStreak: 'serial continuity',
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
    backHub: 'назад',
    speedPlane: 'вікно швидкості / 60с',
    customPlane: 'кастомний синтез',
    speedTagline: 'шістдесят секунд. без історії. лише пропускна здатність і збої.',
    speedResultTitle: 'вікно закрито / метрики',
    speedClose: 'закрити канал',
    hubNucleusSubtitle: 'центральний вузол маршрутизації',
    hubPrimaryStart: 'старт',
    hubPrimaryContinue: 'продовжити',
    hubOpenChannel: 'відкрити канал',
    hubTileSpeed: 'тест швидкості',
    hubTileCustom: 'свій текст',
    hubTileHistory: 'історія',
    hubTileOnline: 'онлайн',
    hubTileProfile: 'профіль',
    hubTileQuests: 'завдання',
    hubQuickLabel: 'миттєві слова',
    hubTicker0: 'система активна',
    hubTicker1: 'помилки журналюються',
    hubTicker2: 'канал у режимі очікування',
    hubTicker3: 'сигнал нестабільний',
    hubPanelClose: 'закрити',
    hubHistoryHead: 'журнал спостереження',
    hubEmptyLog: 'сеансів немає',
    hubOnlineHead: 'канал широкого доступу',
    hubOnlineBody:
      'живий маршрут ще не підключено. коли відкриється, тут починається відкритість. очікуй затримку та витік ідентичності.',
    hubProfileHead: 'досьє оператора',
    hubQuestHead: 'директиви',
    hubCustomHead: 'керування синтезом',
    hubApply: 'застосувати пресет',
    hubWordCount: 'кількість слів',
    hubShuffle: 'перемішати',
    hubCase: 'регістр',
    hubCharset: 'набір',
    hubStrict: 'жорсткі збої',
    hubCharsetAlpha: 'alpha',
    hubCharsetAlnum: 'alnum',
    hubCharsetHex: 'hex',
    rankWatcher: 'спостерігач',
    rankOperator: 'оператор',
    rankPredator: 'хижак',
    rankCore: 'ядро',
    hubStreak: 'серійна безперервність',
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
    backHub: 'назад',
    speedPlane: 'окно скорости / 60с',
    customPlane: 'кастомный синтез',
    speedTagline: 'шестьдесят секунд. без истории. только пропускная способность и сбои.',
    speedResultTitle: 'окно закрыто / метрики',
    speedClose: 'закрыть канал',
    hubNucleusSubtitle: 'центральный узел маршрутизации',
    hubPrimaryStart: 'старт',
    hubPrimaryContinue: 'продолжить',
    hubOpenChannel: 'открыть канал',
    hubTileSpeed: 'тест скорости',
    hubTileCustom: 'свой текст',
    hubTileHistory: 'история',
    hubTileOnline: 'онлайн',
    hubTileProfile: 'профиль',
    hubTileQuests: 'задания',
    hubQuickLabel: 'мгновенный старт',
    hubTicker0: 'система активна',
    hubTicker1: 'ошибки фиксируются',
    hubTicker2: 'канал в ожидании',
    hubTicker3: 'сигнал нестабилен',
    hubPanelClose: 'закрыть',
    hubHistoryHead: 'журнал наблюдения',
    hubEmptyLog: 'сессий нет',
    hubOnlineHead: 'канал широкого доступа',
    hubOnlineBody:
      'живой маршрут ещё не подключён. когда откроется, здесь начинается открытость. жди задержку и утечку идентичности.',
    hubProfileHead: 'досье оператора',
    hubQuestHead: 'директивы',
    hubCustomHead: 'управление синтезом',
    hubApply: 'применить пресет',
    hubWordCount: 'число слов',
    hubShuffle: 'перемешать',
    hubCase: 'регистр',
    hubCharset: 'набор',
    hubStrict: 'жёсткие сбои',
    hubCharsetAlpha: 'alpha',
    hubCharsetAlnum: 'alnum',
    hubCharsetHex: 'hex',
    rankWatcher: 'наблюдатель',
    rankOperator: 'оператор',
    rankPredator: 'хищник',
    rankCore: 'ядро',
    hubStreak: 'серийная непрерывность',
  },
};

export function getMessage(locale: Locale, key: MessageKey): string {
  return catalog[locale][key];
}

export function formatStrikesA11y(locale: Locale, strikes: number, index: number): string {
  return getMessage(locale, 'strikesA11y').replace('{s}', String(strikes)).replace('{i}', String(index));
}
