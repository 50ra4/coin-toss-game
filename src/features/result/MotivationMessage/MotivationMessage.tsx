import { useMemo } from 'react';
import type { GameMode } from '@/consts/game';

const MOTIVATION_MESSAGES = {
  tenRounds: [
    {
      range: [0, 3],
      messages: ['次は勝てる！運は巡ってくる', 'まだまだこれから！'],
    },
    {
      range: [4, 6],
      messages: ['いい調子！半分以上当てたね', 'まずまずの結果！'],
    },
    {
      range: [7, 8],
      messages: ['素晴らしい！かなり勘がいい', 'センス抜群！'],
    },
    {
      range: [9, 10],
      messages: ['ほぼ完璧！予知能力者？', 'パーフェクト！伝説の予想師'],
    },
  ],
  survival: [
    {
      range: [0, 5],
      messages: ['ウォーミングアップ完了！', '次はもっと行ける！'],
    },
    {
      range: [6, 10],
      messages: ['いい調子！集中力が光る', '素晴らしい直感力！'],
    },
    { range: [11, 20], messages: ['驚異的な集中力！', '天才的な予想力！'] },
    {
      range: [21, Infinity],
      messages: ['伝説級！あなたは予言者', '神の領域...！'],
    },
  ],
} as const;

const DEFAULT_MESSAGE = 'お疲れ様！';

const getMotivationMessage = (mode: GameMode, score: number): string => {
  const category = MOTIVATION_MESSAGES[mode].find(
    ({ range: [min, max] }) => score >= min && score <= max,
  );
  if (!category) return DEFAULT_MESSAGE;
  const { messages } = category;
  return (
    messages[Math.floor(Math.random() * messages.length)] ?? DEFAULT_MESSAGE
  );
};

type Props = {
  mode: GameMode;
  score: number;
};

export function MotivationMessage({ mode, score }: Props) {
  const message = useMemo(
    () => getMotivationMessage(mode, score),
    [mode, score],
  );

  return (
    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
      {message}
    </p>
  );
}
