/** Polls deployed `version.json` and reloads when GitHub Pages serves a new build. */
export function startVersionCheck(): void {
  if (import.meta.env.DEV) return;

  // `new URL(rel, import.meta.env.BASE_URL)` throws when BASE_URL is a bare path like `/FangZ/`
  // (invalid base). Resolve against the current page URL instead.
  const base = import.meta.env.BASE_URL || './';
  const root = new URL(base, window.location.href);
  const url = new URL('version.json', root).href;
  let last: string | null = null;

  const run = async () => {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;
      const text = await res.text();
      if (last === null) {
        last = text;
        return;
      }
      if (text !== last) {
        window.location.reload();
      }
    } catch {
      /* offline */
    }
  };

  void run();
  window.setInterval(() => void run(), 45_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void run();
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) void run();
  });
  window.addEventListener('focus', () => void run());
}
