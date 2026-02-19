import { memo } from 'react';

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gradient dark:bg-casino-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600 dark:border-casino-gray dark:border-t-casino-gold" />
        <p className="text-sm text-amber-700 dark:text-casino-gold">
          読み込み中...
        </p>
      </div>
    </div>
  );
});
