import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Navigate,
} from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader/PageLoader';

const HomePage = lazy(() => import('@/pages/HomePage'));
const GamePage = lazy(() => import('@/pages/GamePage'));
const ResultPage = lazy(() => import('@/pages/ResultPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));

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
