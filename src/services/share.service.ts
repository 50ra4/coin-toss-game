import type { GameMode } from '@/consts/game';
import { MODE_NAMES, SCORE_UNITS } from '@/consts/game';

type ShareTextParams = {
  mode: GameMode;
  score: number;
  bestScore: number;
  isNewRecord: boolean;
  rank: number | null;
};

const getScoreText = (mode: GameMode, score: number): string =>
  `${score}${SCORE_UNITS[mode]}`;

export const generateShareText = (params: ShareTextParams): string => {
  const { mode, score, bestScore, isNewRecord, rank } = params;
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const hashtags = '#コイントスゲーム #暇つぶし #ミニゲーム';

  if (isNewRecord && rank === 1) {
    return [
      '🎉🪙 自己ベスト更新！🪙🎉',
      `${MODE_NAMES[mode]}で${getScoreText(mode, score)}！`,
      bestScore > 0 ? `前回ベスト：${getScoreText(mode, bestScore)}` : '',
      hashtags,
      baseUrl,
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (isNewRecord && rank !== null) {
    return [
      '🪙 コイントス予想ゲーム',
      `${MODE_NAMES[mode]}で${getScoreText(mode, score)}！`,
      '自己TOP3入り🎊',
      hashtags,
      baseUrl,
    ].join('\n');
  }

  return [
    '🪙 コイントス予想ゲーム',
    `${MODE_NAMES[mode]}で${getScoreText(mode, score)}！`,
    `自己ベスト：${getScoreText(mode, bestScore)}`,
    hashtags,
    baseUrl,
  ].join('\n');
};

export const shareToX = (text: string): void => {
  const encodedText = encodeURIComponent(text);
  window.open(
    `https://twitter.com/intent/tweet?text=${encodedText}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400'
  );
};

export const shareToThreads = (text: string): void => {
  const encodedText = encodeURIComponent(text);
  window.open(
    `https://threads.net/intent/post?text=${encodedText}`,
    '_blank',
    'noopener,noreferrer,width=600,height=400'
  );
};

export const shareViaWebShareAPI = async (text: string): Promise<void> => {
  if (!navigator.share) {
    throw new Error('Web Share API not supported');
  }

  try {
    await navigator.share({ text });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    throw error;
  }
};
