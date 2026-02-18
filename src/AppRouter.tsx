import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { GamePage } from '@/pages/GamePage';
import { ResultPage } from '@/pages/ResultPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';

const BASENAME = import.meta.env.BASE_URL;

export function AppRouter() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:mode" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
