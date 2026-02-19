import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Navigate,
} from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader/PageLoader';

const minDelay = <T,>(promise: Promise<T>, ms: number) =>
  Promise.all([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ]).then(([module]) => module);

const MIN_LOADING_TIME_MS = 2000;

const HomePage = lazy(() =>
  minDelay(import('@/pages/HomePage'), MIN_LOADING_TIME_MS),
);
const GamePage = lazy(() =>
  minDelay(import('@/pages/GamePage'), MIN_LOADING_TIME_MS),
);
const ResultPage = lazy(() =>
  minDelay(import('@/pages/ResultPage'), MIN_LOADING_TIME_MS),
);
const TermsPage = lazy(() =>
  minDelay(import('@/pages/TermsPage'), MIN_LOADING_TIME_MS),
);
const PrivacyPolicyPage = lazy(() =>
  minDelay(import('@/pages/PrivacyPolicyPage'), MIN_LOADING_TIME_MS),
);

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/game/:mode', element: <GamePage /> },
        { path: '/result', element: <ResultPage /> },
        { path: '/terms', element: <TermsPage /> },
        { path: '/privacy', element: <PrivacyPolicyPage /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
