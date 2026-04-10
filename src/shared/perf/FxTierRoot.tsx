import { useLayoutEffect } from 'react';

function computeLite(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const hc = navigator.hardwareConcurrency;
  if (typeof hc === 'number' && hc > 0 && hc <= 4) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return true;
  return false;
}

/** Sets `data-fx` on `<html>`: `lite` reduces continuous animations (scan beam, hub pulse, pulse dots). */
export function FxTierRoot() {
  useLayoutEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-fx', computeLite() ? 'lite' : 'full');
    };
    apply();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return null;
}
