import React, { useState } from 'react';
import {
  Eye,
  Shield,
  Check,
  X,
  Film,
  Image as ImageIcon,
  Tag,
  Layers,
  ArrowRight,
  TrendingUp,
  Lock,
  Camera,
  ChevronDown,
} from 'lucide-react';
import {
  OpenAiPurpleIcon,
  GeminiPurpleIcon,
  GooglePurpleIcon,
  ByteDancePurpleIcon,
} from './BrandIcons';
import {
  SplitTextReveal,
  ScrambleDecodeText,
  KineticHighlight,
} from './AnimatedTypography';
import { HOME_FAQS } from '../data/siteContent';

interface HomeSectionsProps {
  mayaAvatarUrl: string;
  theoAvatarUrl: string;
  onScrollToTool: () => void;
  onNavigatePricing: () => void;
}

export function HomeSections({
  mayaAvatarUrl,
  theoAvatarUrl,
  onScrollToTool,
  onNavigatePricing,
}: HomeSectionsProps) {
  const [activeAvatarQuote, setActiveAvatarQuote] = useState<'maya' | 'theo' | null>(null);
  const [hoveredStatIdx, setHoveredStatIdx] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const models = [
    { name: 'ChatGPT', Icon: OpenAiPurpleIcon },
    { name: 'GPT Image 2', Icon: OpenAiPurpleIcon },
    { name: 'Gemini', Icon: GeminiPurpleIcon },
    { name: 'Nano Banana 2', Icon: GeminiPurpleIcon },
    { name: 'Nano Banana Pro', Icon: GeminiPurpleIcon },
    { name: 'Gemini Omni', Icon: GooglePurpleIcon },
    { name: 'Seedance 2.5', Icon: ByteDancePurpleIcon },
  ];

  const sixSignals = [
    {
      title: 'SynthID pixel signal',
      subtitle: 'Woven into every pixel',
      Icon: Eye,
    },
    {
      title: 'C2PA Content Credential',
      subtitle: 'Signed “AI-made” record',
      Icon: Shield,
    },
    {
      title: 'Per-frame video tag',
      subtitle: 'Embedded across all frames',
      Icon: Film,
    },
    {
      title: 'Generator metadata block',
      subtitle: 'Model provenance data',
      Icon: ImageIcon,
    },
    {
      title: '“Made with AI” flag',
      subtitle: 'Platform-readable marker',
      Icon: Tag,
    },
    {
      title: 'EXIF AI marker',
      subtitle: 'Hidden in the file header',
      Icon: Layers,
    },
  ];

  const communityStats = [
    {
      label: 'Signal',
      highlight: '100%',
      sub: 'of SynthID cleared',
      Icon: Eye,
    },
    {
      label: 'Privacy',
      highlight: '0',
      sub: 'files stored',
      Icon: Lock,
    },
    {
      label: 'Marks',
      highlight: '2',
      sub: 'SynthID + C2PA gone',
      Icon: Shield,
    },
    {
      label: 'Coverage',
      highlight: 'Every',
      sub: 'video frame cleaned',
      Icon: Film,
    },
  ];

  return (
    <div className="space-y-0">
      {/* 1. Supported Models Strip */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 mb-4">
          Clears the hidden watermark from
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {models.map(({ name, Icon }) => (
            <li
              key={name}
              className="group/model inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#ececef] hover:border-[#d6ccff] bg-[#fafafa] hover:bg-[#f7f4ff] text-[13px] font-semibold text-[#0d0d0d] transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. What's hidden inside (#what) */}
      <section id="what" className="border-t border-[#ececef] bg-[#fcfcfd] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              What&apos;s hidden inside
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d] mb-4">
              <SplitTextReveal text="The watermark that" />
              <br />
              <KineticHighlight>
                <SplitTextReveal text="survives the eraser." delay={0.14} />
              </KineticHighlight>
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-relaxed">
              Removing the visible logo cleans what people see. These are the signals machines see,
              and they stay in the file until something rewrites them out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Google SynthID Card */}
            <div className="group/card rounded-[22px] border border-[#ececef] hover:border-[#d6ccff] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-[0_14px_34px_-14px_rgba(99,54,255,0.12)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6336ff] mb-4">
                Google · SynthID
              </div>
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:-rotate-3">
                  <Eye className="w-5 h-5 stroke-[1.8]" />
                </span>
                <h3 className="text-[19px] font-bold tracking-tight text-[#0d0d0d]">
                  An invisible signal baked into the pixels.
                </h3>
              </div>
              <p className="text-[14px] text-zinc-500 leading-[1.65]">
                SynthID is woven into the image data and across every video frame, undetectable to
                your eye, but a clear flag to any model that scans it. It doesn&apos;t wash out with
                a crop or a re-save.
              </p>
            </div>

            {/* C2PA Content Credentials Card */}
            <div className="group/card rounded-[22px] border border-[#ececef] hover:border-[#d6ccff] bg-white p-7 sm:p-8 transition-all duration-300 hover:shadow-[0_14px_34px_-14px_rgba(99,54,255,0.12)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6336ff] mb-4">
                C2PA · Content Credentials
              </div>
              <div className="flex items-center gap-3.5 mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3">
                  <Shield className="w-5 h-5 stroke-[1.8]" />
                </span>
                <h3 className="text-[19px] font-bold tracking-tight text-[#0d0d0d]">
                  A provenance tag that follows the file.
                </h3>
              </div>
              <p className="text-[14px] text-zinc-500 leading-[1.65]">
                Generators also attach C2PA metadata, a signed record that says &apos;AI-made&apos;
                and travels with the file across apps and platforms, long after the visible mark is
                gone.
              </p>
            </div>
          </div>

          {/* Bottom Unified Callout */}
          <div className="group/card rounded-[20px] border border-[#ececef] bg-white p-5 sm:p-6 flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-[#6336ff] text-white inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/card:scale-110">
              <Check className="w-5 h-5 stroke-[2.4]" />
            </span>
            <p className="text-[14px] text-zinc-600 leading-relaxed">
              <strong className="font-bold text-[#0d0d0d]">
                We remove both, on images and video.
              </strong>{' '}
              The SynthID signal and the C2PA tag are stripped in one pass, across every frame of a
              clip, and you download a clean, untagged file.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Before & after Detector Report Table */}
      <section className="border-t border-[#ececef] bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              Before &amp; after
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d] mb-4">
              <SplitTextReveal text="What everyone else" />
              <br />
              <KineticHighlight>
                <SplitTextReveal text="reads in your file." delay={0.14} />
              </KineticHighlight>
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-relaxed">
              The visible logo is only the surface. Here&apos;s what scanners pull out of an
              untouched Gemini or Veo file, and what they find once it&apos;s clean.
            </p>
          </div>

          {/* macOS Window Table */}
          <div className="rounded-[24px] border border-[#ececef] bg-white shadow-[0_24px_60px_-20px_rgba(13,13,13,0.07)] overflow-hidden">
            {/* Window Header */}
            <div className="px-6 py-4 border-b border-[#ececef] flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <ScrambleDecodeText
                text="detector-report · your_file"
                className="text-[12.5px] text-zinc-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf9fe] border-b border-[#ececef] text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                    <th className="py-3.5 px-6">Detector</th>
                    <th className="py-3.5 px-6">Hidden signal</th>
                    <th className="py-3.5 px-6 text-center">Original file</th>
                    <th className="py-3.5 px-6 text-center">After RemoveSynthID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececef] text-[14px]">
                  {[
                    {
                      detector: 'Google SynthID checker',
                      signal: 'Pixel watermark',
                      orig: 'Detected',
                      after: 'Clean',
                    },
                    {
                      detector: 'C2PA verifier',
                      signal: 'Content Credentials',
                      orig: 'Present',
                      after: 'Removed',
                    },
                    {
                      detector: 'AI image detector',
                      signal: 'AI probability',
                      orig: '99% AI',
                      after: 'Not flagged',
                    },
                    {
                      detector: 'Platform upload scan',
                      signal: '“Made with AI”',
                      orig: 'Labeled',
                      after: 'No label',
                    },
                  ].map((row) => (
                    <tr key={row.detector} className="hover:bg-zinc-50/50">
                      <th scope="row" className="py-4 px-6 font-bold text-[#0d0d0d]">
                        {row.detector}
                      </th>
                      <td className="py-4 px-6 text-zinc-500">{row.signal}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[12px] font-semibold text-red-700 font-mono-tabular">
                          <X className="w-3 h-3 stroke-[2.5]" />
                          <span>{row.orig}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[12px] font-semibold text-emerald-700 font-mono-tabular">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{row.after}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3.5 border-t border-[#ececef] bg-[#fcfcfd] flex flex-wrap items-center justify-between gap-2 text-[12px] text-zinc-400">
              <span>Original = your unedited Gemini/Veo export · After = RemoveSynthID output</span>
              <span>Both image &amp; video</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. You made it (6-signal stack + ownership pitch) */}
      <section className="border-t border-[#ececef] bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 6-item list */}
          <div className="lg:col-span-6 rounded-[24px] border border-[#ececef] bg-[#fcfcfd] p-4 space-y-2.5">
            <ul className="space-y-2.5">
              {sixSignals.map(({ title, subtitle, Icon }) => (
                <li
                  key={title}
                  className="group/signal rounded-2xl border border-[#ececef] hover:border-[#d6ccff] bg-white px-4 py-3.5 flex items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-[#f3efff] group-hover/signal:bg-[#6336ff] text-[#6336ff] group-hover/signal:text-white inline-flex items-center justify-center shrink-0 transition-all duration-300 group-hover/signal:scale-110 group-hover/signal:-rotate-3">
                      <Icon className="w-4 h-4 stroke-[1.9]" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-[#0d0d0d] truncate">{title}</div>
                      <div className="text-[12px] text-zinc-400 truncate">{subtitle}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5] transition-transform duration-300 group-hover/signal:scale-125" />
                    <span>Removed</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right editorial pitch */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#f3efff] border border-[#e2d9ff] text-[12px] font-semibold text-[#6336ff]">
              You made it
            </div>
            <h2 className="text-[36px] sm:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d]">
              <SplitTextReveal text="You generated it." />
              <br />
              <SplitTextReveal text="You should own it," delay={0.12} />
              <br />
              <KineticHighlight className="text-[#6336ff]">
                <SplitTextReveal text="visibly and invisibly." delay={0.22} />
              </KineticHighlight>
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-[1.68]">
              Watermarks made sense when AI was experimental. Today you&apos;re using Gemini and Veo
              for client work, campaigns and posts you own. A hidden tag flags it as AI on every
              platform and quietly throttles it. We strip every signal so the file is fully,
              invisibly yours.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onScrollToTool}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[14px] font-bold shadow-[0_10px_25px_-6px_rgba(99,54,255,0.5)] transition-colors cursor-pointer"
              >
                <span>Clean my file</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The whole picture (3-part Bento with Dot Matrix, Upload Scan & Live Confidence Chart) */}
      <section className="border-t border-[#ececef] bg-[#fcfcfd] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              The whole picture
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d] mb-4">
              <SplitTextReveal text="Hidden everywhere." />
              <br />
              <KineticHighlight>
                <SplitTextReveal text="Removed completely." delay={0.14} />
              </KineticHighlight>
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-relaxed">
              The signal is read by every detector and platform, on images and video alike. One pass
              takes it to zero.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ececef] bg-white shadow-[0_20px_50px_-20px_rgba(13,13,13,0.06)] overflow-hidden">
            {/* Top 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#ececef]">
              {/* Left: Read on every platform dot matrix */}
              <div className="p-7 sm:p-9">
                <div className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-500 mb-2">
                  <Eye className="w-4 h-4 text-[#6336ff]" />
                  <span>Read on every platform</span>
                </div>
                <p className="text-[20px] font-bold tracking-tight text-[#0d0d0d] mb-6">
                  Detectors everywhere pull the hidden signal back out.
                </p>

                {/* Dot Matrix Graphic */}
                <div className="relative py-6 px-4 rounded-2xl bg-[#faf9fe] border border-[#f0ecff] flex items-center justify-center">
                  <div
                    className="grid grid-cols-16 gap-2.5 w-full max-w-[360px]"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 128 }).map((_, idx) => {
                      const highlighted = [24, 37, 59, 71, 86, 101, 108].includes(idx);
                      return (
                        <span
                          key={idx}
                          className={`rounded-full mx-auto ${
                            highlighted
                              ? 'w-2.5 h-2.5 bg-[#6336ff] animate-radar-dot'
                              : 'w-1.5 h-1.5 bg-[#dcd5f8]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e5e0fa] shadow-xs text-[12px] font-semibold text-[#0d0d0d]">
                      <span className="w-2 h-2 rounded-full bg-[#6336ff] animate-radar-dot" />
                      <span>Flagged on TikTok, IG &amp; YouTube</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Both marks, gone */}
              <div className="p-7 sm:p-9 bg-[#faf9fe]/60">
                <div className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-500 mb-2">
                  <Shield className="w-4 h-4 text-[#6336ff]" />
                  <span>Both marks, gone</span>
                </div>
                <p className="text-[20px] font-bold tracking-tight text-[#0d0d0d] mb-6">
                  Clean to every scanner that checks.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6336ff]/80" />
                    <span>Upload scan</span>
                  </div>
                  <div className="rounded-xl border border-[#ececef] bg-white px-4 py-3 text-[13px] text-[#0d0d0d] max-w-xs">
                    Checking this file for SynthID &amp; Content Credentials…
                  </div>
                  <div className="flex flex-col items-end pt-2">
                    <div className="rounded-xl bg-[#6336ff] text-white px-4 py-3 text-[13px] font-semibold shadow-sm">
                      Nothing found. SynthID and C2PA already removed. ✓
                    </div>
                    <span className="text-[11px] text-zinc-400 mt-1">now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Full-Width: Detection score, live */}
            <div className="border-t border-[#ececef] p-7 sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-500 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#6336ff]" />
                    <span>Detection score, live</span>
                  </div>
                  <p className="text-[20px] font-bold tracking-tight text-[#0d0d0d] max-w-md">
                    Watch the confidence fall to nothing.{' '}
                    <span className="text-zinc-500 font-semibold">
                      From flagged to clean in one pass.
                    </span>
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[12px] font-semibold text-emerald-700 font-mono-tabular">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>0% detected</span>
                </span>
              </div>

              {/* SVG Chart */}
              <div className="w-full pt-2">
                <svg
                  viewBox="0 0 800 180"
                  className="w-full h-40 overflow-visible"
                  aria-label="Detection confidence falling from 99% to 0%"
                >
                  <defs>
                    <linearGradient id="chart_fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6336ff" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#6336ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="30" x2="800" y2="30" stroke="#f1f1f4" strokeWidth="1" />
                  <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f1f4" strokeWidth="1" />
                  <line x1="0" y1="130" x2="800" y2="130" stroke="#f1f1f4" strokeWidth="1" />
                  <line x1="0" y1="165" x2="800" y2="165" stroke="#ececef" strokeWidth="1" />

                  {/* Area under curve */}
                  <path
                    d="M 0 25 L 160 35 L 320 120 L 480 158 L 640 165 L 800 165 L 800 165 L 0 165 Z"
                    fill="url(#chart_fill)"
                  />
                  {/* Secondary C2PA line */}
                  <path
                    d="M 0 48 L 160 58 L 320 138 L 480 163 L 640 165 L 800 165"
                    fill="none"
                    stroke="#a58aff"
                    strokeWidth="2"
                  />
                  {/* Primary SynthID line */}
                  <path
                    d="M 0 25 L 160 35 L 320 120 L 480 158 L 640 165 L 800 165"
                    fill="none"
                    stroke="#6336ff"
                    strokeWidth="2.6"
                  />
                </svg>

                {/* X-axis stage labels */}
                <div className="grid grid-cols-6 text-[11.5px] text-zinc-400 font-medium pt-2">
                  <span>Original</span>
                  <span className="text-center">Scan</span>
                  <span className="text-center">Lift</span>
                  <span className="text-center">Rewrite</span>
                  <span className="text-center">Verify</span>
                  <span className="text-right font-semibold text-emerald-700">Clean</span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-5 mt-4 text-[12px] text-zinc-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#6336ff]" />
                    <span>SynthID signal</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#a58aff]" />
                    <span>C2PA credential</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How it works (#how) */}
      <section id="how" className="border-t border-[#ececef] bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              How it works
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d] mb-4">
              Three steps, both
              <br />
              watermarks gone.
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-relaxed">
              No uploads to a server. Scan and remove for free, then create a free account to
              download.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                title: 'Drop your file',
                desc: 'An image or a video from ChatGPT, Gemini, Nano Banana, Veo or any model that adds SynthID. It loads straight into the scanner in your browser.',
              },
              {
                num: '02',
                title: 'We locate the signal',
                desc: "The engine isolates SynthID's frequency-domain pattern and the C2PA tag across the pixels, or across every frame of a clip.",
              },
              {
                num: '03',
                title: 'We rewrite it out',
                desc: 'Marked regions are reconstructed so the signal is gone and the visual stays pixel-identical to your original.',
              },
              {
                num: '04',
                title: 'Download clean',
                desc: 'Pull down a file that reads as untagged to detectors and platform upload scanners alike.',
              },
            ].map((step) => (
              <li
                key={step.num}
                className="rounded-[22px] border border-[#ececef] bg-white p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[12px] font-mono-tabular font-bold text-[#6336ff] mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0d0d0d] mb-2.5">{step.title}</h3>
                  <p className="text-[13.5px] text-zinc-500 leading-[1.6]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Free and Premium Comparison */}
      <section className="border-t border-[#ececef] bg-[#fcfcfd] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              Free and Premium
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d] mb-4">
              Start free. Go Premium
              <br />
              when it has to be perfect.
            </h2>
            <p className="text-[15.5px] text-zinc-500 leading-relaxed">
              Both remove SynthID and C2PA. The difference is how much you can do, and whether video
              is included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Free Card */}
            <div className="rounded-[24px] border border-[#ececef] bg-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-[13px] font-semibold text-zinc-500 mb-2">Free</div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[36px] font-extrabold text-[#0d0d0d] font-mono-tabular">
                    $0
                  </span>
                  <span className="text-[13px] text-zinc-400">no card needed</span>
                </div>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed pb-6 border-b border-zinc-100 mb-6">
                  Every account gets one free SynthID removal. Scans, previews and C2PA cleanup stay
                  free.
                </p>

                <ul className="space-y-3 text-[13.5px] mb-8">
                  {[
                    { inc: true, text: 'One free SynthID removal' },
                    { inc: true, text: 'Free C2PA metadata removal' },
                    { inc: true, text: 'Scan and preview every file' },
                    { inc: true, text: 'Image downloads' },
                    { inc: false, text: 'Video downloads' },
                    { inc: false, text: 'Credits for ongoing removals' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-2.5">
                      {item.inc ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-400 inline-flex items-center justify-center shrink-0">
                          <X className="w-3 h-3" />
                        </span>
                      )}
                      <span className={item.inc ? 'text-[#0d0d0d]' : 'text-zinc-400'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onScrollToTool}
                className="w-full py-3 px-4 rounded-xl border border-[#e2e2e7] bg-white hover:bg-zinc-50 text-[13.5px] font-bold text-[#0d0d0d] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Start free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Premium Card */}
            <div className="relative rounded-[24px] border-[1.5px] border-[#6336ff] bg-white p-7 sm:p-8 shadow-[0_20px_50px_-15px_rgba(99,54,255,0.18)] flex flex-col justify-between">
              <div className="absolute -top-3 left-7 px-3 py-0.5 rounded-full bg-[#f3efff] border border-[#d6c8ff] text-[11px] font-bold text-[#6336ff]">
                Pixel-perfect
              </div>

              <div>
                <div className="text-[13px] font-semibold text-[#6336ff] mb-2">Premium</div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[36px] font-extrabold text-[#0d0d0d]">Credits</span>
                  <span className="text-[13px] text-zinc-400">monthly or yearly</span>
                </div>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed pb-6 border-b border-zinc-100 mb-6">
                  Paid plans add credits for ongoing removals on images and video.
                </p>

                <ul className="space-y-3 text-[13.5px] text-[#0d0d0d] mb-8">
                  {[
                    'Credits for ongoing removals',
                    'Images and video',
                    'SynthID + C2PA removed',
                    'Every video frame cleaned',
                    'Pixel-for-pixel quality',
                    'Batch up to 10 images at once',
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={onNavigatePricing}
                className="w-full py-3 px-4 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[13.5px] font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>See Premium plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-[12px] text-zinc-400">
            Scanning and previews are always free, on both plans.
          </p>
        </div>
      </section>

      {/* 8. Under the hood */}
      <section className="border-t border-[#ececef] bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              Under the hood
            </div>
            <h2 className="text-[36px] sm:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d]">
              Built for clean files,
              <br />
              not guesswork.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: Every frame cleaned */}
            <div className="rounded-[24px] border border-[#ececef] bg-white p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#0d0d0d] mb-2">Every frame cleaned</h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">
                  On video, the signal is tracked and rewritten across the whole clip. No flicker,
                  no smear, no missed frames.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ececef] p-4 bg-[#fcfcfd]">
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="h-14 rounded-lg bg-gradient-to-b from-[#6336ff] to-[#7c56ff] flex items-end justify-end p-1"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white text-[#6336ff] inline-flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                  <span className="text-zinc-500">frame 1-240</span>
                  <span className="font-semibold text-emerald-700">all clean</span>
                </div>
              </div>
            </div>

            {/* Card 2: Nothing leaves your device */}
            <div className="rounded-[24px] border border-[#ececef] bg-white p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#0d0d0d] mb-2">
                  Nothing leaves your device
                </h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">
                  Files are processed in your browser session and never archived. No uploads to
                  train on, no copies kept.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ececef] p-5 bg-[#fcfcfd] flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11.5px] font-semibold text-zinc-700">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100">0 uploads</span>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100">0 stored</span>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100">In-browser</span>
                </div>
              </div>
            </div>

            {/* Card 3: Pixel-for-pixel quality */}
            <div className="rounded-[24px] border border-[#ececef] bg-white p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#0d0d0d] mb-2">
                  Pixel-for-pixel quality
                </h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">
                  Resolution, detail, frame rate and bitrate stay exactly as Gemini and Veo rendered
                  them.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ececef] p-3 bg-[#fcfcfd]">
                <div className="h-28 rounded-xl overflow-hidden grid grid-cols-2 divide-x divide-white/40 bg-gradient-to-br from-[#5228e8] via-[#6e45ff] to-[#9b7dff] relative mb-2.5">
                  <div className="p-2 flex flex-col justify-between">
                    <span className="self-start px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-zinc-700">
                      Original
                    </span>
                    <span className="text-white/80 inline-flex items-center">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="p-2 flex flex-col justify-between items-end">
                    <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-emerald-700">
                      Cleaned
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-tabular px-1">
                  <span className="text-zinc-500">1080×1920 · 30fps</span>
                  <span className="font-semibold text-emerald-700">identical</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Who it's for */}
      <section className="border-t border-[#ececef] bg-[#fcfcfd] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6336ff] mb-3">
              Who it&apos;s for
            </div>
            <h2 className="text-[36px] sm:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#0d0d0d]">
              For anyone who made
              <br />
              it, and wants to own it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'You deliver client work',
                desc: 'Ship images and video that read as original. No hidden tag tying a deliverable back to a model.',
                Icon: Camera,
              },
              {
                title: 'You publish for a living',
                desc: "Post Veo clips and Gemini stills without a 'Made with AI' label throttling your reach.",
                Icon: TrendingUp,
              },
              {
                title: 'You just want your files',
                desc: 'Use your own generations freely (wallpapers, posts, projects) without a tracker baked in.',
                Icon: ImageIcon,
              },
            ].map(({ title, desc, Icon }) => (
              <div
                key={title}
                className="rounded-[22px] border border-[#ececef] bg-white p-7 sm:p-8"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0d0d0d] mb-2">{title}</h3>
                <p className="text-[13.5px] text-zinc-500 leading-[1.6]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Our community (Interactive avatars + 4 hoverable metric cards) */}
      <section className="border-t border-[#ececef] bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#f3efff] border border-[#e2d9ff] text-[12px] font-semibold text-[#6336ff] mb-6">
            Our community
          </div>

          <h2 className="text-[34px] sm:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.15] text-[#0d0d0d] mb-6">
            Built for the{' '}
            <span className="relative inline-block align-middle mx-1">
              <button
                type="button"
                aria-label="Maya R."
                onMouseEnter={() => setActiveAvatarQuote('maya')}
                onMouseLeave={() => setActiveAvatarQuote(null)}
                onClick={() =>
                  setActiveAvatarQuote((prev) => (prev === 'maya' ? null : 'maya'))
                }
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-white shadow-md inline-flex items-center justify-center cursor-pointer align-middle"
              >
                <img
                  src={mayaAvatarUrl}
                  alt="Maya R."
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              {activeAvatarQuote === 'maya' && (
                <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 rounded-xl bg-[#0d0d0d] text-white text-left text-[12px] font-normal leading-relaxed shadow-xl">
                  <p className="mb-1.5">
                    &ldquo;The hidden tag was quietly throttling my Veo clips. Cleaned, they post
                    fine. My reach came right back.&rdquo;
                  </p>
                  <p className="text-zinc-400 font-semibold">Maya R. · UGC creator</p>
                </div>
              )}
            </span>{' '}
            creators and the{' '}
            <span className="relative inline-block align-middle mx-1">
              <button
                type="button"
                aria-label="Theo L."
                onMouseEnter={() => setActiveAvatarQuote('theo')}
                onMouseLeave={() => setActiveAvatarQuote(null)}
                onClick={() =>
                  setActiveAvatarQuote((prev) => (prev === 'theo' ? null : 'theo'))
                }
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-white shadow-md inline-flex items-center justify-center cursor-pointer align-middle"
              >
                <img
                  src={theoAvatarUrl}
                  alt="Theo L."
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
              {activeAvatarQuote === 'theo' && (
                <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 rounded-xl bg-[#0d0d0d] text-white text-left text-[12px] font-normal leading-relaxed shadow-xl">
                  <p className="mb-1.5">
                    &ldquo;We run every client deliverable through it before handoff. No &apos;Made
                    with AI&apos; flags, no awkward questions.&rdquo;
                  </p>
                  <p className="text-zinc-400 font-semibold">Theo L. · studio lead</p>
                </div>
              )}
            </span>
            <br />
            teams who want their work back.
          </h2>

          {/* 4-column interactive stat bar */}
          <div className="mt-10 rounded-[22px] border border-[#ececef] bg-[#faf9fe] grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#ececef] overflow-hidden">
            {communityStats.map((stat, idx) => {
              const isHovered = hoveredStatIdx === idx;
              const Icon = stat.Icon;
              return (
                <button
                  key={stat.label}
                  type="button"
                  onMouseEnter={() => setHoveredStatIdx(idx)}
                  onMouseLeave={() => setHoveredStatIdx(null)}
                  onClick={() =>
                    setHoveredStatIdx((prev) => (prev === idx ? null : idx))
                  }
                  className="p-6 sm:p-7 flex flex-col items-center justify-center min-h-[112px] transition-colors hover:bg-[#f3efff]/60 cursor-pointer"
                >
                  {!isHovered ? (
                    <div className="inline-flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#f1ecff] text-[#6336ff] inline-flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[14px] font-bold text-[#0d0d0d]">{stat.label}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-[20px] font-extrabold text-[#6336ff] font-mono-tabular leading-tight">
                        {stat.highlight}
                      </div>
                      <div className="text-[12px] text-zinc-600 font-medium">{stat.sub}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[12px] text-zinc-400">
            Hover a card to see what it means · hover an avatar to read their take
          </p>
        </div>
      </section>

      {/* 11. Long-Form Technical Deep Dive Sections */}
      <section className="border-t border-[#ececef] bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-20">
          {/* What Are SynthID & Nano Banana? */}
          <div>
            <h2 className="text-[30px] sm:text-[38px] font-extrabold tracking-tight text-[#0d0d0d] mb-6">
              What Are SynthID &amp; Nano Banana?
            </h2>
            <div className="space-y-4 text-[15px] text-zinc-600 leading-[1.75]">
              <p>
                SynthID is an invisible watermarking system designed to identify AI-generated media
                without affecting visual appearance. Unlike visible watermarks such as logos or
                overlays, SynthID embeds identification signals directly into the media itself.
                These signals are imperceptible to human viewers but can be detected by specialized
                verification tools.
              </p>
              <p>
                Rather than relying on file metadata, SynthID embeds information inside pixel values
                and frequency-domain patterns. This makes the watermark resilient to common
                transformations such as resizing, compression, format conversion, cropping, and
                light editing. Because the watermark is distributed across the content, removing
                part of the image does not fully remove the signal.
              </p>
              <p>
                This approach represents a shift from traditional provenance systems. Metadata-based
                watermarks can often be stripped by exporting or re-encoding files. SynthID,
                however, becomes part of the media structure itself. That design improves durability
                but also means that standard editing tools cannot remove it.
              </p>
              <p>
                A SynthID remover must therefore operate at the content level, using techniques that
                interact with pixel structure and frequency patterns rather than file headers.
                Understanding this distinction is essential to understanding why specialized
                processing is required.
              </p>
            </div>
          </div>

          {/* Understanding How SynthID Is Detected */}
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#0d0d0d] mb-6">
              Understanding How SynthID Is Detected
            </h2>
            <div className="space-y-4 text-[15px] text-zinc-600 leading-[1.75]">
              <p>
                SynthID detection relies on identifying specific patterns embedded within media
                during generation. These patterns are not visible artifacts. Instead, they exist in
                the frequency characteristics of the content and are distributed across the entire
                image or across many frames in a video.
              </p>
              <p>
                Detection systems analyze these frequency-domain signatures to determine whether a
                piece of media carries a SynthID watermark. Because the signal is distributed rather
                than localized, simple edits such as cropping or resizing rarely remove it entirely.
                Even after re-encoding, detection algorithms may still recognize the embedded
                pattern.
              </p>
              <p>
                This also means that users cannot reliably determine watermark presence through
                visual inspection. Two images may look identical while only one contains a
                detectable watermark. Verification requires access to detection tools capable of
                analyzing frequency patterns rather than surface pixels.
              </p>
              <p>
                A SynthID remover focuses on disrupting these detection signals rather than altering
                the visible appearance of the content. The goal is to interfere with the pattern
                recognition process used by detectors while keeping the output visually unchanged
                for human viewers.
              </p>
            </div>
          </div>

          {/* SynthID vs Metadata-Based Watermarking Systems */}
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#0d0d0d] mb-6">
              SynthID vs Metadata-Based Watermarking Systems
            </h2>
            <div className="space-y-4 text-[15px] text-zinc-600 leading-[1.75]">
              <p>
                Not all AI watermarking systems work the same way. Some systems store provenance
                information in file metadata. These records exist outside the actual media content
                and can often be removed through re-encoding, exporting, or metadata stripping.
              </p>
              <p>
                SynthID operates differently. Instead of storing data separately, it embeds
                watermark information directly into the content’s pixel structure using
                frequency-domain transformations. This makes the watermark far more resistant to
                casual removal and common editing operations.
              </p>
              <p>
                Because of this difference, tools designed to remove metadata watermarks are
                ineffective against SynthID. Removing SynthID requires content-aware processing that
                interacts with the embedded signal itself rather than the file container.
              </p>
              <p>
                This distinction explains why SynthID is considered more robust and why removal
                requires specialized techniques. A SynthID remover must target embedded patterns
                while preserving the visual integrity of the content, which is a fundamentally
                different challenge than stripping metadata.
              </p>
            </div>
          </div>

          {/* Best Practices for Using a SynthID Remover */}
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#0d0d0d] mb-6">
              Best Practices for Using a SynthID Remover
            </h2>
            <div className="space-y-4 text-[15px] text-zinc-600 leading-[1.75]">
              <p>
                For best results, process media as close to the original exported version as
                possible. Heavy compression, repeated re-encoding, or aggressive filtering may
                already alter watermark patterns, which can make outcomes less predictable.
              </p>
              <p>
                Use high-quality files whenever possible. Higher-resolution content typically
                preserves watermark structure more clearly, making controlled disruption more
                effective. Extremely low-quality or heavily degraded files may already have
                inconsistent watermark behavior.
              </p>
              <p>
                Keep original copies of all files. A SynthID remover creates a new processed output,
                but maintaining originals allows you to compare results, validate outcomes, or meet
                provenance requirements later.
              </p>
              <p>
                If verification is important for your workflow, test cleaned outputs using any
                detection tools available to you. Because detection systems vary, validation should
                be performed in the same environment where the content will be evaluated or
                published.
              </p>
            </div>
          </div>

          {/* Limitations and Technical Considerations */}
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[#0d0d0d] mb-8">
              Limitations and Technical Considerations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Watermark Robustness and Variability',
                  body: 'SynthID is intentionally designed to survive common transformations such as resizing, compression, cropping, and format conversion. Different implementations, content types, and generation parameters can affect how strongly the watermark is embedded.',
                },
                {
                  title: 'Detection Systems May Evolve',
                  body: 'SynthID detection methods are not static. Platforms and verification systems can update their detection algorithms over time. Watermark removal should be treated as a best-effort process rather than a permanent or universal solution.',
                },
                {
                  title: 'Not All AI Detection Is Watermark-Based',
                  body: 'Removing SynthID only targets watermark signals embedded in pixel and frequency patterns. Other AI detection systems may analyze visual artifacts, statistical distributions, or contextual signals unrelated to watermarking.',
                },
                {
                  title: 'File Size and Resolution Constraints',
                  body: 'Very large images or high-resolution media files may require more processing time due to browser memory limits. Resizing excessively large files before processing can improve stability.',
                },
                {
                  title: 'Browser and Device Limitations',
                  body: 'Processing happens locally inside the browser. Performance depends on available CPU, memory, and browser capabilities. Using a modern, updated browser improves reliability and performance.',
                },
                {
                  title: 'Edited or Heavily Processed Media',
                  body: 'Media that has already been heavily edited, filtered, or repeatedly re-encoded may have altered watermark patterns. For best outcomes, process media as close to its original exported state as possible.',
                },
                {
                  title: 'No Visual Confirmation of Success',
                  body: 'SynthID watermarks are invisible by design. Successful disruption cannot be confirmed through visual inspection alone. Users should retain original files and validate results where verification is critical.',
                },
                {
                  title: 'Responsible and Compliant Use',
                  body: 'This tool does not grant permission to misrepresent content origin or bypass platform rules. Users remain responsible for complying with applicable laws, disclosure requirements, and platform policies.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#ececef] bg-[#fcfcfd] p-6"
                >
                  <h3 className="text-[16px] font-bold text-[#0d0d0d] mb-2">{card.title}</h3>
                  <p className="text-[13.5px] text-zinc-500 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. 19-Question FAQ Accordion (#faq) */}
      <section
        id="faq"
        aria-label="Frequently Asked Questions About AIhumanize"
        className="border-t border-[#ececef] bg-[#fcfcfd] py-24 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#0d0d0d] text-center mb-12">
            Frequently Asked Questions About AIhumanize
          </h2>

          <div className="divide-y divide-[#ececef] border-y border-[#ececef] bg-white rounded-2xl px-6">
            {HOME_FAQS.map((item, idx) => {
              const expanded = openFaqIndex === idx;
              return (
                <div key={item.question} className="py-4">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setOpenFaqIndex(expanded ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left py-1.5 text-[15px] font-semibold text-[#0d0d0d] hover:text-[#6336ff] transition-colors cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                          expanded ? 'rotate-180 text-[#6336ff]' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {expanded && (
                    <p className="mt-2.5 pb-1 text-[14px] text-zinc-500 leading-relaxed pr-6">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. Bottom Hero CTA with REMOVE Outline Text */}
      <section className="group relative border-t border-[#ececef] bg-white py-28 px-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="remove-outline-text absolute inset-x-0 bottom-2 text-center text-[110px] sm:text-[190px] lg:text-[240px] pointer-events-none select-none"
        >
          <SplitTextReveal text="REMOVE" mode="chars" stagger={0.07} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="text-[40px] sm:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.06] text-[#0d0d0d] mb-4">
            <SplitTextReveal text="Your content." />
            <br />
            <KineticHighlight className="text-[#7c56ff]">
              <SplitTextReveal text="No invisible tags." delay={0.15} />
            </KineticHighlight>
          </h2>
          <p className="text-[16px] text-zinc-500 leading-relaxed mb-8">
            Drop an image or video, watch the SynthID signal lift off, and download a clean file.
            One free removal, no card needed.
          </p>
          <button
            type="button"
            onClick={onScrollToTool}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[14px] font-bold shadow-[0_12px_28px_-6px_rgba(99,54,255,0.55)] transition-colors cursor-pointer"
          >
            <span>Remove SynthID now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
