import { z } from 'zod';
import type { GameMode, CoinSide } from '@/consts/game';
import { COIN_SIDES, GAME_MODES } from '@/consts/game';

const gameModeValues = Object.values(GAME_MODES) as [GameMode, ...GameMode[]];
export const GameModeSchema = z.enum(gameModeValues);

const coinSideValues = Object.values(COIN_SIDES) as [CoinSide, ...CoinSide[]];
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
