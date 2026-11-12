import React, { useState, useEffect, useRef } from 'react';
import { splitTextIntoTokens, scrambleStringAtProgress } from '../utils/synthIdEngine';

const STAGGER_DELAY_CLASSES = [
  'delay-[0ms]',
  'delay-[35ms]',
  'delay-[70ms]',
  'delay-[105ms]',
  'delay-[140ms]',
  'delay-[175ms]',
  'delay-[210ms]',
  'delay-[245ms]',
  'delay-[280ms]',
  'delay-[315ms]',
  'delay-[350ms]',
  'delay-[385ms]',
  'delay-[420ms]',
  'delay-[455ms]',
  'delay-[490ms]',
  'delay-[525ms]',
];

function useInViewOnce(threshold = 0.2): [React.RefObject<HTMLSpanElement | null>, boolean] {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView];
}

interface SplitTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  mode?: 'words' | 'chars';
}

/**
 * Staggered kinetic word/character reveal with masked vertical translation and blur-to-crisp settling.
 * Preserves a clean single-string aria-label for screen readers and accessibility snapshots.
 */
export function SplitTextReveal({
  text,
  className = '',
  wordClassName = '',
  mode = 'words',
}: SplitTextRevealProps) {
  const [containerRef, inView] = useInViewOnce(0.15);
  const tokens = splitTextIntoTokens(text);

  return (
    <span ref={containerRef} className={`inline ${className}`} aria-label={text}>
      {tokens.map((token, wIdx) => {
        const wordDelayClass =
          STAGGER_DELAY_CLASSES[Math.min(wIdx, STAGGER_DELAY_CLASSES.length - 1)];

        return (
          <React.Fragment key={`${token.word}-${wIdx}`}>
            <span
              aria-hidden="true"
              className={`inline-block whitespace-nowrap overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em] ${wordClassName}`}
            >
              {mode === 'words' ? (
                <span
                  className={`kinetic-token-item ${wordDelayClass} ${
                    inView ? 'kinetic-token-visible' : 'kinetic-token-hidden'
                  }`}
                >
                  {token.word}
                </span>
              ) : (
                token.chars.map((ch, cIdx) => {
                  const charStep = Math.min(
                    wIdx * 3 + cIdx,
                    STAGGER_DELAY_CLASSES.length - 1
                  );
                  const charDelayClass = STAGGER_DELAY_CLASSES[charStep];
                  return (
                    <span
                      key={`${ch}-${cIdx}`}
                      className={`kinetic-token-item ${charDelayClass} ${
                        inView ? 'kinetic-token-visible' : 'kinetic-token-hidden'
                      }`}
                    >
                      {ch}
                    </span>
                  );
                })
              )}
            </span>
            {wIdx < tokens.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
}

interface RotatingTextPhraseProps {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}

/**
 * Vertical kinetic slot-machine text rotator with cubic-bezier spring physics and click-to-cycle interaction.
 */
export function RotatingTextPhrase({
  phrases,
  intervalMs = 3200,
  className = '',
}: RotatingTextPhraseProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [phrases, intervalMs]);

  const currentPhrase = phrases[index] || phrases[0] || '';

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`${currentPhrase} — click to cycle media types`}
      onClick={() => setIndex((prev) => (prev + 1) % phrases.length)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }}
      title="Click to cycle media types"
      className={`relative inline-flex items-baseline overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] cursor-pointer select-none group/rotator ${className}`}
    >
      <span
        key={currentPhrase}
        className="animate-kinetic-slot text-[#6336ff] underline decoration-[#6336ff]/25 group-hover/rotator:decoration-[#6336ff]/60 decoration-2 underline-offset-6 transition-colors"
      >
        {currentPhrase}
      </span>
    </span>
  );
}

interface ScrambleDecodeTextProps {
  text: string;
  className?: string;
  durationMs?: number;
  triggerOnHover?: boolean;
}

/**
 * Frequency-domain cipher decode typography animation that resolves hex glyphs into the target string.
 */
export function ScrambleDecodeText({
  text,
  className = '',
  durationMs = 520,
  triggerOnHover = true,
}: ScrambleDecodeTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setDisplayText(scrambleStringAtProgress(text, progress, runKey + 3));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [text, durationMs, runKey]);

  return (
    <span
      aria-label={text}
      onMouseEnter={() => {
        if (triggerOnHover) setRunKey((k) => k + 1);
      }}
      className={`inline-block font-mono-tabular ${className}`}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}

interface KineticHighlightProps {
  children: React.ReactNode;
  editorialSerif?: boolean;
  className?: string;
  underlineColor?: string;
}

/**
 * Animated SVG stroke underline + subtle editorial emphasis on viewport entry and hover.
 */
export function KineticHighlight({
  children,
  editorialSerif = false,
  className = '',
  underlineColor = '#6336ff',
}: KineticHighlightProps) {
  const [ref, inView] = useInViewOnce(0.35);

  return (
    <span
      ref={ref}
      className={`relative inline-block transition-transform duration-200 hover:-translate-y-[1.5px] ${
        editorialSerif ? 'font-editorial text-[1.08em] font-normal px-0.5' : ''
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute left-0 -bottom-1 w-full h-2.5 pointer-events-none overflow-visible"
      >
        <path
          d="M 2 7 Q 100 2 198 6.5"
          fill="none"
          stroke={underlineColor}
          strokeWidth="2.4"
          strokeLinecap="round"
          className={`kinetic-underline-path ${inView ? 'kinetic-underline-drawn' : ''}`}
        />
      </svg>
    </span>
  );
}

/**
 * Infinite horizontal kinetic typography ticker ribbon showcasing the frequency & provenance signals removed.
 */
export function SignalMarqueeRibbon() {
  const items = [
    'SYNTHID PIXEL CARRIER · 0% DETECTED',
    'C2PA CONTENT CREDENTIALS · STRIPPED',
    'PER-FRAME VIDEO WATERMARK · REWRITTEN',
    'JUMBF MANIFEST · REMOVED',
    'EXIF AI PROVENANCE · CLEARED',
    'PSNR > 51.4 dB · PIXEL-IDENTICAL',
    '100% LOCAL IN-BROWSER ENGINE',
  ];

  return (
    <div
      aria-label="Supported watermark removal specifications"
      className="w-full overflow-hidden border-y border-[#ececef] bg-[#faf9fe] py-2.5 select-none"
    >
      <div className="animate-marquee-track items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
            {items.map((item) => (
              <div
                key={`${dup}-${item}`}
                className="inline-flex items-center gap-4 px-5 text-[11px] font-mono-tabular font-semibold tracking-[0.12em] text-zinc-500"
              >
                <span className="text-[#6336ff]">/</span>
                <span className="hover:text-[#6336ff] transition-colors">{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
