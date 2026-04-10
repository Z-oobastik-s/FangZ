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
      className={`relative select-none font-mono text-[clamp(1.15rem,4.2vw,2.05rem)] font-medium leading-[1.55] tracking-[0.06em] ${shake} ${dead ? 'opacity-35' : ''}`}
      aria-hidden="true"
    >
      <div className="flex min-h-[min(12rem,28vh)] flex-wrap content-center gap-y-2 break-all sm:min-h-[min(14rem,30vh)]">
        {Array.from(target).map((ch, i) => {
          const isPast = i < index;
          const isCurrent = i === index;
          return (
            <span
              key={i}
              className={[
                'inline-flex min-h-[1.75rem] items-end px-[2px] transition-colors duration-100',
                isPast ? 'text-acid [text-shadow:0_0_12px_rgba(0,240,255,0.35)]' : 'text-ash/30',
                isCurrent ? 'relative scale-100 text-acid' : '',
              ].join(' ')}
            >
              {ch === ' ' ? (
                <span className="inline-block min-w-[0.5em] border-b-2 border-acid/25" />
              ) : (
                <span
                  className={
                    isCurrent
                      ? [
                          'relative inline-block after:pointer-events-none after:absolute after:-inset-x-1 after:-inset-y-1.5',
                          'after:border after:border-acid/50 after:shadow-glow-acid-sm after:content-[""]',
                          'text-shadow-[0_0_20px_rgba(0,240,255,0.55)]',
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
