import { memo, useMemo } from 'react';
import { prefersReducedMotion } from '../../shared/lib/motion';

type Props = {
  target: string;
  index: number;
  strikes: number;
  dead: boolean;
};

/** Renders past | current | rest as three nodes to avoid O(n) spans per frame. */
export const TargetRibbon = memo(function TargetRibbon({ target, index, strikes, dead }: Props) {
  const reduceMotion = useMemo(() => prefersReducedMotion(), []);
  const shake =
    !reduceMotion && strikes > 0 && strikes < 3 ? (strikes === 1 ? 'animate-glitch' : 'animate-pulse-blood') : '';

  const past = target.slice(0, index);
  const cur = target[index];
  const future = target.slice(index + 1);

  return (
    <div
      className={`relative h-full min-h-0 w-full select-none font-mono text-[clamp(0.68rem,min(2.5vmin,3.8vw),1.12rem)] font-semibold leading-snug tracking-[0.05em] ${shake} ${dead ? 'opacity-35' : ''}`}
      aria-hidden="true"
    >
      <div className="flex h-full min-h-0 w-full flex-wrap content-center justify-center [contain:layout]">
        <span className="whitespace-pre-wrap break-all text-acid [text-shadow:0_0_10px_rgba(0,240,255,0.3)]">
          {past}
        </span>
        <span
          className={
            cur === undefined
              ? 'inline-block min-w-[0.35em]'
              : cur === ' '
                ? 'relative inline-flex min-w-[0.45em] items-end justify-center border-b-2 border-acid/35 text-acid [text-shadow:0_0_16px_rgba(0,240,255,0.45)]'
                : 'relative inline-block text-acid after:pointer-events-none after:absolute after:-inset-x-0.5 after:-inset-y-1 after:border after:border-acid/45 after:content-[""] [text-shadow:0_0_16px_rgba(0,240,255,0.45)]'
          }
        >
          {cur === undefined ? '' : cur === ' ' ? '\u00a0' : cur}
        </span>
        <span className="whitespace-pre-wrap break-all text-ash/28">{future}</span>
      </div>
    </div>
  );
});
