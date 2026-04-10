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
      className={`relative select-none font-mono text-[clamp(1.05rem,2.8vw,1.65rem)] leading-relaxed tracking-wide ${shake} ${dead ? 'opacity-40' : ''}`}
      aria-hidden="true"
    >
      <div className="flex min-h-[3.2rem] flex-wrap content-center gap-y-1 break-all">
        {Array.from(target).map((ch, i) => {
          const isPast = i < index;
          const isCurrent = i === index;
          return (
            <span
              key={i}
              className={[
                'inline-flex min-h-[1.6rem] items-end px-[1px] transition-colors duration-75',
                isPast ? 'text-acid/90' : 'text-ash/35',
                isCurrent ? 'relative text-acid' : '',
              ].join(' ')}
            >
              {ch === ' ' ? (
                <span className="inline-block min-w-[0.55em] border-b border-ash/50" />
              ) : (
                <span
                  className={
                    isCurrent
                      ? 'after:absolute after:-inset-x-0.5 after:-inset-y-1 after:border after:border-acid/40 after:content-[""]'
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
