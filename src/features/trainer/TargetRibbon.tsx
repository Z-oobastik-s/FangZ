import { memo, useMemo } from 'react';
import { prefersReducedMotion } from '../../shared/lib/motion';

type Props = {
  target: string;
  index: number;
  strikes: number;
  dead: boolean;
};

export const TargetRibbon = memo(function TargetRibbon({ target, index, strikes, dead }: Props) {
  const reduceMotion = useMemo(() => prefersReducedMotion(), []);
  const shake =
    !reduceMotion && strikes > 0 && strikes < 3 ? (strikes === 1 ? 'animate-glitch' : 'animate-pulse-blood') : '';

  return (
    <div
      className={`relative h-full min-h-0 w-full select-none font-mono text-[clamp(0.68rem,min(2.5vmin,3.8vw),1.12rem)] font-semibold leading-snug tracking-[0.05em] ${shake} ${dead ? 'opacity-35' : ''}`}
      aria-hidden="true"
    >
      <div className="flex h-full min-h-0 w-full flex-wrap content-center justify-center gap-y-1 break-all">
        {Array.from(target).map((ch, i) => {
          const isPast = i < index;
          const isCurrent = i === index;
          return (
            <span
              key={i}
              className={[
                'inline-flex min-h-[1.1em] items-end px-[1px] transition-colors duration-75',
                isPast ? 'text-acid [text-shadow:0_0_10px_rgba(0,240,255,0.3)]' : 'text-ash/28',
                isCurrent ? 'relative text-acid' : '',
              ].join(' ')}
            >
              {ch === ' ' ? (
                <span className="inline-block min-w-[0.45em] border-b border-acid/30" />
              ) : (
                <span
                  className={
                    isCurrent
                      ? [
                          'relative inline-block after:pointer-events-none after:absolute after:-inset-x-0.5 after:-inset-y-1',
                          'after:border after:border-acid/45 after:content-[""]',
                          'text-shadow-[0_0_16px_rgba(0,240,255,0.45)]',
                        ].join(' ')
                      : ''
                  }
                >
                  {ch}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
});
