import { memo } from 'react';

type Props = {
  target: string;
  index: number;
  dead: boolean;
};

/** Max code units shown on each side; keeps one focused line without a wrapping wall of text. */
const MAX_PAST = 44;
const MAX_FUTURE = 64;

function clipPast(s: string): string {
  if (s.length <= MAX_PAST) return s;
  return '\u2026' + s.slice(-(MAX_PAST - 1));
}

function clipFuture(s: string): string {
  if (s.length <= MAX_FUTURE) return s;
  return s.slice(0, MAX_FUTURE - 1) + '\u2026';
}

/** Renders past | current | rest as three nodes to avoid O(n) spans per frame. */
export const TargetRibbon = memo(function TargetRibbon({ target, index, dead }: Props) {
  const past = target.slice(0, index);
  const cur = target[index];
  const future = target.slice(index + 1);
  const pastShown = clipPast(past);
  const futureShown = clipFuture(future);

  return (
    <div
      className={`relative h-full min-h-0 w-full select-none font-mono text-[clamp(0.68rem,min(2.5vmin,3.8vw),1.12rem)] font-semibold leading-snug tracking-[0.05em] ${dead ? 'opacity-35' : ''}`}
      aria-hidden="true"
    >
      <div className="flex h-full min-h-0 w-full items-center justify-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex max-w-full min-w-0 flex-nowrap items-baseline justify-center gap-0 whitespace-nowrap px-0.5 [contain:layout]">
          <span className="min-w-0 shrink whitespace-pre text-acid [text-shadow:0_0_10px_rgba(0,240,255,0.3)]">
            {pastShown}
          </span>
          <span
            className={
              cur === undefined
                ? 'inline-block min-w-[0.35em] shrink-0'
                : cur === ' '
                  ? 'relative inline-flex min-w-[0.45em] shrink-0 items-end justify-center border-b-2 border-acid/35 text-acid [text-shadow:0_0_16px_rgba(0,240,255,0.45)]'
                  : 'relative inline-block shrink-0 text-acid after:pointer-events-none after:absolute after:-inset-x-0.5 after:-inset-y-1 after:border after:border-acid/45 after:content-[""] [text-shadow:0_0_16px_rgba(0,240,255,0.45)]'
            }
          >
            {cur === undefined ? '' : cur === ' ' ? '\u00a0' : cur}
          </span>
          <span className="min-w-0 shrink whitespace-pre text-ash/28">{futureShown}</span>
        </div>
      </div>
    </div>
  );
});
