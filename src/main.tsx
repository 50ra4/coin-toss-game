import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadStorageData } from '@/features/storage/storageOperations';
import { App } from '@/App';
import '@/styles/globals.css';

// レンダリング前にダークモードのクラスを適用（フラッシュ防止）
const initialData = loadStorageData();
document.documentElement.classList.toggle(
  'dark',
  initialData.preferences.darkMode
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
