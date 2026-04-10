import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';
import { applyAnimationsAttrFromStorage } from './shared/perf/animationPreference';
import { startVersionCheck } from './versionCheck';

applyAnimationsAttrFromStorage();

const el = document.getElementById('root');
if (!el) throw new Error('root missing');

function scheduleIdle(fn: () => void) {
  const ric = (
    window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }
  ).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(fn, { timeout: 4000 });
  } else {
    window.setTimeout(fn, 0);
  }
}
scheduleIdle(() => startVersionCheck());

createRoot(el).render(
  <StrictMode>
    <div className="h-[100dvh] min-h-0 overflow-hidden">
      <App />
    </div>
  </StrictMode>,
);
