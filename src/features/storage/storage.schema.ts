import { z } from 'zod';

export const TopScoreItemSchema = z.object({
  score: z.number().int().min(0),
});
export type TopScoreItem = z.output<typeof TopScoreItemSchema>;

export const PreferencesSchema = z.object({
  darkMode: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
});
export type Preferences = z.output<typeof PreferencesSchema>;

export const StorageDataSchema = z.object({
  topScores: z.object({
    tenRounds: z.array(TopScoreItemSchema).max(3).default([]),
    survival: z.array(TopScoreItemSchema).max(3).default([]),
  }),
  preferences: PreferencesSchema,
});
export type StorageData = z.output<typeof StorageDataSchema>;

export const defaultStorageData = {
  topScores: {
    tenRounds: [],
    survival: [],
  },
  preferences: {
    darkMode: false,
    soundEnabled: true,
  },
} as const satisfies StorageData;
