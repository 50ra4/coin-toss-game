import { Link } from 'react-router-dom';

export function GlobalFooter() {
  return (
    <footer className="mt-8 border-t border-gray-200 py-6 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center">
        <nav className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
          <Link
            to="/terms"
            className="hover:text-amber-700 dark:hover:text-casino-gold"
          >
            利用規約
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            to="/privacy"
            className="hover:text-amber-700 dark:hover:text-casino-gold"
          >
            プライバシーポリシー
          </Link>
        </nav>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} Coin Toss Game
        </p>
      </div>
    </footer>
  );
}
