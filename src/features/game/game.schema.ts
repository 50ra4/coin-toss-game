import { z } from 'zod';
import { COIN_SIDES, GAME_MODES } from '@/consts/game';

const gameModeValues = Object.values(GAME_MODES) as [string, ...string[]];
export const GameModeSchema = z.enum(gameModeValues);

const coinSideValues = Object.values(COIN_SIDES) as [string, ...string[]];
export const CoinSideSchema = z.enum(coinSideValues);

export const GameStateSchema = z.object({
  mode: GameModeSchema,
  currentRound: z.number().int().min(1),
  score: z.number().int().min(0),
  isPlaying: z.boolean(),
  coinResult: CoinSideSchema.nullable(),
  prediction: CoinSideSchema.nullable(),
  consecutiveCorrect: z.number().int().min(0),
});
export type GameState = z.output<typeof GameStateSchema>;
