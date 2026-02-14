import { useCallback } from 'react';
import type { GameMode } from '@/consts/game';
import { Card } from '@/components/Card/Card';
import {
  generateShareText,
  getAppUrl,
  shareToX,
  shareToThreads,
  shareViaWebShareAPI,
  isWebShareSupported,
} from '@/services/share.service';
import { liffService } from '@/services/liff.service';

const IS_WEB_SHARE_SUPPORTED = isWebShareSupported();

type Props = {
  mode: GameMode;
  score: number;
  bestScore: number;
  isNewRecord: boolean;
  rank: number | null;
};

export function ShareSection({
  mode,
  score,
  bestScore,
  isNewRecord,
  rank,
}: Props) {
  const shareText = generateShareText({
    mode,
    score,
    bestScore,
    isNewRecord,
    rank,
  });

  const handleShareX = useCallback(() => {
    shareToX(shareText);
  }, [shareText]);

  const handleShareThreads = useCallback(() => {
    shareToThreads(shareText);
  }, [shareText]);

  const handleShareLine = useCallback(async () => {
    try {
      await liffService.shareTargetPicker(shareText);
    } catch {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getAppUrl())}`,
        '_blank',
        'noopener,noreferrer',
      );
    }
  }, [shareText]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // fallback: do nothing
    }
  }, [shareText]);

  const handleWebShare = useCallback(async () => {
    try {
      await shareViaWebShareAPI(shareText);
    } catch {
      // Web Share API not supported, do nothing
    }
  }, [shareText]);

  return (
    <Card className="p-4">
      <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
        結果をシェアして友達に挑戦状を送ろう！
      </p>
      <div className="mb-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-700 dark:bg-casino-black/50 dark:text-gray-300">
        <pre className="whitespace-pre-wrap">{shareText}</pre>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={handleShareLine}
          className="rounded-lg bg-[#06C755] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          LINE
        </button>
        <button
          onClick={handleShareX}
          className="rounded-lg bg-[#000000] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          X
        </button>
        <button
          onClick={handleShareThreads}
          className="rounded-lg bg-[#000000] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          Threads
        </button>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-transform hover:scale-105 dark:bg-casino-gray dark:text-gray-300"
        >
          Copy
        </button>
        {IS_WEB_SHARE_SUPPORTED && (
          <button
            onClick={handleWebShare}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-transform hover:scale-105 dark:bg-casino-gray dark:text-gray-300"
          >
            Share
          </button>
        )}
      </div>
    </Card>
  );
}
