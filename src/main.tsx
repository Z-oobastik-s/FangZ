import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';
import { startVersionCheck } from './versionCheck';

const el = document.getElementById('root');
if (!el) throw new Error('root missing');

startVersionCheck();

createRoot(el).render(
  <StrictMode>
    <div className="h-[100dvh] min-h-0 overflow-hidden">
      <App />
    </div>
  </StrictMode>,
);
