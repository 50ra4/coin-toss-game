import { z } from 'zod';
import { GameModeSchema } from '@/features/game/game.schema';

export const GameResultSchema = z.object({
  mode: GameModeSchema,
  score: z.number().int().min(0),
  isNewRecord: z.boolean(),
  rank: z.number().int().min(1).max(3).nullable(),
  previousBest: z.number().int().min(0),
});
export type GameResult = z.output<typeof GameResultSchema>;
