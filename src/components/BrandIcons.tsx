import React, { useState, useEffect } from 'react';

export function SynthIdLogoMark({ className = 'w-6 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover/brand:scale-110`}
      aria-hidden="true"
    >
      <path
        d="M5 4C12 10.5 18 16.5 18 21C18 25.5 12 31.5 5 38"
        stroke="url(#synthid_grad_1)"
        strokeWidth="4.2"
        strokeLinecap="round"
        className="animate-logo-wave-1"
      />
      <path
        d="M14 9C19.5 14 24 18 24 21C24 24 19.5 28 14 33"
        stroke="url(#synthid_grad_2)"
        strokeWidth="3.6"
        strokeLinecap="round"
        opacity="0.72"
        className="animate-logo-wave-2"
      />
      <defs>
        <linearGradient id="synthid_grad_1" x1="5" y1="4" x2="18" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b9a2ff" />
          <stop offset="0.5" stopColor="#7c56ff" />
          <stop offset="1" stopColor="#bca6ff" />
        </linearGradient>
        <linearGradient id="synthid_grad_2" x1="14" y1="9" x2="24" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4c6ff" />
          <stop offset="0.5" stopColor="#9474ff" />
          <stop offset="1" stopColor="#d4c6ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BrandWordmark({ variant = 'header' }: { variant?: 'header' | 'footer' | 'login' }) {
  if (variant === 'footer') {
    return (
      <span className="group/brand inline-flex items-center gap-2.5 select-none">
        <SynthIdLogoMark className="w-4 h-6 shrink-0" />
        <span className="text-[15px] font-bold tracking-tight text-[#0d0d0d]">
          removesynthid<span className="text-[#6336ff]">.io</span>
        </span>
      </span>
    );
  }
  return (
    <span className="group/brand inline-flex items-center gap-2 select-none">
      <SynthIdLogoMark className={variant === 'login' ? 'w-7 h-9 shrink-0' : 'w-6 h-8 shrink-0'} />
      <span className="inline-flex items-baseline gap-1">
        <span className={`${variant === 'login' ? 'text-xl' : 'text-[17px]'} font-bold tracking-tight text-[#0d0d0d]`}>
          SynthID
        </span>
        <span className={`${variant === 'login' ? 'text-xs' : 'text-[10px]'} font-medium text-zinc-400 tracking-normal`}>
          Remover
        </span>
      </span>
    </span>
  );
}

interface SocialBadgeItem {
  id: 'youtube' | 'facebook' | 'tiktok' | 'instagram';
  name: string;
  tagCleared: string;
  waveClass: string;
  bgClass: string;
}

const SOCIAL_BADGE_ITEMS: SocialBadgeItem[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    tagCleared: 'YouTube · AI label cleared',
    waveClass: 'animate-social-wave-1',
    bgClass: 'bg-[#FF0000]',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    tagCleared: 'Facebook · C2PA stripped',
    waveClass: 'animate-social-wave-2',
    bgClass: 'bg-[#1877F2]',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    tagCleared: 'TikTok · AIGC flag removed',
    waveClass: 'animate-social-wave-3',
    bgClass: 'bg-[#000000]',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    tagCleared: 'Instagram · Made with AI off',
    waveClass: 'animate-social-wave-4',
    bgClass: 'ig-radial-bg',
  },
];

/**
 * Interactive animated Hero platform icon cluster (YouTube, Facebook, TikTok, Instagram).
 * Features continuous phase-shifted harmonic wave float, auto-cycling radar highlight ring,
 * fan-out spacing on cluster hover, individual 3D hover lift + status pill tooltip, and inner SVG glyph animations.
 */
export function HeroSocialBadges() {
  const [hoveredId, setHoveredId] = useState<SocialBadgeItem['id'] | null>(null);
  const [activePulseIndex, setActivePulseIndex] = useState<number>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePulseIndex((prev) => (prev + 1) % SOCIAL_BADGE_ITEMS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className="group/badges relative inline-flex items-center align-middle mx-1.5 -space-x-2 hover:space-x-1 transition-all duration-300 select-none"
      aria-label="YouTube, Facebook, TikTok, and Instagram"
    >
      {SOCIAL_BADGE_ITEMS.map((badge, idx) => {
        const isHovered = hoveredId === badge.id;
        const isAutoActive = hoveredId === null && activePulseIndex === idx;

        return (
          <span
            key={badge.id}
            onMouseEnter={() => setHoveredId(badge.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setActivePulseIndex(idx)}
            className={`relative inline-flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isHovered
                ? 'z-30 -translate-y-2 scale-115'
                : isAutoActive
                ? 'z-20 -translate-y-0.5 scale-105'
                : 'z-10 hover:z-30'
            }`}
          >
            {/* Floating Platform Status Tooltip on Hover */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0d0d0d] text-white text-[10px] font-mono-tabular font-semibold tracking-normal shadow-md transition-all duration-200 ${
                isHovered
                  ? 'opacity-100 -translate-y-0.5 scale-100'
                  : 'opacity-0 translate-y-1 scale-95'
              }`}
            >
              {badge.tagCleared}
            </span>

            {/* Outer Radar Ring when active or hovered */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 rounded-full transition-all duration-500 ${
                isHovered
                  ? 'ring-4 ring-[#6336ff]/35 scale-110 opacity-100'
                  : isAutoActive
                  ? 'ring-2 ring-[#6336ff]/25 scale-105 opacity-100'
                  : 'opacity-0 scale-95'
              }`}
            />

            {/* Main Circular Platform Badge */}
            <span
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${badge.bgClass} ${badge.waveClass} ring-2 ring-white inline-flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(0,0,0,0.22)] transition-transform duration-300`}
            >
              {badge.id === 'youtube' && (
                <svg viewBox="0 0 24 24" className="w-6 h-6 animate-glyph-yt" aria-hidden="true">
                  <path fill="#fff" d="M7.8 5.4L19.2 12 7.8 18.6V5.4Z" />
                </svg>
              )}

              {badge.id === 'facebook' && (
                <svg viewBox="0 0 24 24" className="w-6 h-6 animate-glyph-fb" aria-hidden="true">
                  <path
                    fill="#fff"
                    d="M13.35 20.9v-6.6h2.2l.4-2.75h-2.6V9.78c0-.8.28-1.35 1.42-1.35h1.28V6.03a18.3 18.3 0 0 0-2.05-.1c-2.05 0-3.45 1.25-3.45 3.55v1.97H8.6v2.75h2.15v6.6h2.6Z"
                  />
                </svg>
              )}

              {badge.id === 'tiktok' && (
                <svg viewBox="0 0 24 24" className="w-6 h-6 animate-glyph-tiktok" aria-hidden="true">
                  <path
                    fill="#fff"
                    d="M14.2 3.6c.3 1.9 1.6 3.3 3.5 3.5v2.35c-1.25 0-2.42-.42-3.5-1.12v5.3a4.35 4.35 0 1 1-4.35-4.35c.28 0 .55.03.82.09v2.45a1.95 1.95 0 1 0 1.28 1.83V3.6h2.25Z"
                  />
                </svg>
              )}

              {badge.id === 'instagram' && (
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 animate-glyph-ig"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect x="4" y="4" width="16" height="16" rx="5" stroke="#fff" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="3.6" stroke="#fff" strokeWidth="1.8" />
                  <circle cx="16.5" cy="7.5" r="1.15" fill="#fff" />
                </svg>
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function OpenAiPurpleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} animate-model-spin group-hover/model:scale-115 transition-transform duration-300`}
      aria-hidden="true"
    >
      <path
        d="M21.5 10.2a5.2 5.2 0 0 0-.45-4.3 5.3 5.3 0 0 0-5.7-2.55A5.25 5.25 0 0 0 11.4 1.5a5.3 5.3 0 0 0-5.05 3.68 5.25 5.25 0 0 0-3.5 2.55 5.3 5.3 0 0 0 .65 6.18 5.2 5.2 0 0 0 .45 4.3 5.3 5.3 0 0 0 5.7 2.55 5.25 5.25 0 0 0 3.95 1.84 5.3 5.3 0 0 0 5.05-3.68 5.25 5.25 0 0 0 3.5-2.55 5.3 5.3 0 0 0-.65-6.17Z"
        stroke="#6336ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="#6336ff" strokeWidth="1.75" />
    </svg>
  );
}

export function GeminiPurpleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} animate-model-breathe group-hover/model:scale-120 transition-transform duration-300`}
      aria-hidden="true"
    >
      <path
        d="M12 2.5C12 7.75 7.75 12 2.5 12C7.75 12 12 16.25 12 21.5C12 16.25 16.25 12 21.5 12C16.25 12 12 7.75 12 2.5Z"
        fill="#6336ff"
      />
    </svg>
  );
}

export function GooglePurpleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-transform duration-300 group-hover/model:rotate-12 group-hover/model:scale-115`}
      aria-hidden="true"
    >
      <path
        d="M20.6 12.2c0-.63-.06-1.25-.17-1.84H12v3.48h4.82a4.12 4.12 0 0 1-1.79 2.7v2.25h2.9c1.7-1.56 2.67-3.87 2.67-6.59Z"
        fill="#6336ff"
      />
      <path
        d="M12 21c2.42 0 4.45-.8 5.93-2.17l-2.9-2.25c-.8.54-1.83.86-3.03.86-2.33 0-4.3-1.57-5.01-3.68H3.99v2.32A9 9 0 0 0 12 21Z"
        fill="#6336ff"
        opacity="0.85"
      />
      <path
        d="M6.99 13.76A5.42 5.42 0 0 1 6.7 12c0-.61.1-1.2.29-1.76V7.92H3.99A9 9 0 0 0 3 12c0 1.45.35 2.82.99 4.08l3-2.32Z"
        fill="#6336ff"
        opacity="0.7"
      />
      <path
        d="M12 6.56c1.32 0 2.5.45 3.43 1.34l2.57-2.57C16.45 3.89 14.42 3 12 3A9 9 0 0 0 3.99 7.92l3 2.32C7.7 8.13 9.67 6.56 12 6.56Z"
        fill="#6336ff"
        opacity="0.9"
      />
    </svg>
  );
}

export function ByteDancePurpleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} group-hover/model:scale-115 transition-transform duration-300`}
      aria-hidden="true"
    >
      <rect x="3" y="6" width="3.2" height="12" rx="1" fill="#6336ff" className="animate-eq-bar-1" />
      <rect
        x="8.5"
        y="9"
        width="3.2"
        height="9"
        rx="1"
        fill="#6336ff"
        opacity="0.75"
        className="animate-eq-bar-2"
      />
      <rect
        x="14"
        y="4"
        width="3.2"
        height="14"
        rx="1"
        fill="#6336ff"
        opacity="0.9"
        className="animate-eq-bar-3"
      />
      <rect
        x="19"
        y="7.5"
        width="2.8"
        height="10.5"
        rx="1"
        fill="#6336ff"
        opacity="0.65"
        className="animate-eq-bar-4"
      />
    </svg>
  );
}

/**
 * Overlapping 5-platform badge stack (Instagram, TikTok, X, Facebook, YouTube + status dot)
 * matching the embedded SynthID warning callout card when an image is uploaded.
 */
export function PlatformMiniStack({ isClean = false }: { isClean?: boolean }) {
  return (
    <span className="inline-flex items-center -space-x-2 shrink-0 select-none" aria-hidden="true">
      {/* Instagram */}
      <span className="w-8 h-8 rounded-full ig-radial-bg ring-2 ring-[#fff6f6] inline-flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="5" stroke="#fff" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="2" />
          <circle cx="16.5" cy="7.5" r="1.2" fill="#fff" />
        </svg>
      </span>
      {/* TikTok */}
      <span className="w-8 h-8 rounded-full bg-black ring-2 ring-[#fff6f6] inline-flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path
            fill="#fff"
            d="M14.2 3.6c.3 1.9 1.6 3.3 3.5 3.5v2.35c-1.25 0-2.42-.42-3.5-1.12v5.3a4.35 4.35 0 1 1-4.35-4.35c.28 0 .55.03.82.09v2.45a1.95 1.95 0 1 0 1.28 1.83V3.6h2.25Z"
          />
        </svg>
      </span>
      {/* X */}
      <span className="w-8 h-8 rounded-full bg-black ring-2 ring-[#fff6f6] inline-flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
          <path
            fill="#fff"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      </span>
      {/* Facebook */}
      <span className="w-8 h-8 rounded-full bg-[#1877F2] ring-2 ring-[#fff6f6] inline-flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path
            fill="#fff"
            d="M13.35 20.9v-6.6h2.2l.4-2.75h-2.6V9.78c0-.8.28-1.35 1.42-1.35h1.28V6.03a18.3 18.3 0 0 0-2.05-.1c-2.05 0-3.45 1.25-3.45 3.55v1.97H8.6v2.75h2.15v6.6h2.6Z"
          />
        </svg>
      </span>
      {/* YouTube */}
      <span className="w-8 h-8 rounded-full bg-[#FF0000] ring-2 ring-[#fff6f6] inline-flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#fff" d="M7.8 5.4L19.2 12 7.8 18.6V5.4Z" />
        </svg>
      </span>
      {/* Status Indicator Dot */}
      <span
        className={`w-4 h-4 rounded-full ring-2 ring-[#fff6f6] self-end -ml-2.5 mb-0.5 ${
          isClean ? 'bg-emerald-500' : 'bg-[#e53e3e] animate-radar-dot'
        }`}
      />
    </span>
  );
}

