/** Shared typing modes: hub and trainer must agree without cross-feature imports. */
export const GENERATOR_MODES = ['words', 'letters', 'burst', 'pattern'] as const;
export type GeneratorMode = (typeof GENERATOR_MODES)[number];
