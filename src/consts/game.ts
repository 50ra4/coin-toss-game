export const GAME_MODES = {
  tenRounds: 'tenRounds',
  survival: 'survival',
} as const;

export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];

export const COIN_SIDES = {
  heads: 'heads',
  tails: 'tails',
} as const;

export type CoinSide = (typeof COIN_SIDES)[keyof typeof COIN_SIDES];

export const MODE_NAMES = {
  tenRounds: '10回モード',
  survival: 'サバイバルモード',
} as const;

export const SCORE_UNITS = {
  tenRounds: '回正解',
  survival: '連続正解',
} as const;
