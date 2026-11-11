/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Check, X, Menu } from 'lucide-react';
import { BrandWordmark, HeroSocialBadges } from './components/BrandIcons';
import { SynthIdToolWorkspace } from './components/SynthIdToolWorkspace';
import { HomeSections } from './components/HomeSections';
import { PricingPage } from './components/PricingPage';
import { LoginPage } from './components/LoginPage';
import { BlogPage, LegalModal } from './components/SubPages';
import {
  SplitTextReveal,
  RotatingTextPhrase,
  ScrambleDecodeText,
  KineticHighlight,
  SignalMarqueeRibbon,
} from './components/AnimatedTypography';
import { TOOL_PRESETS } from './data/siteContent';

const MAYA_AVATAR_URL = '/src/assets/images/avatar-maya.jpg';
const THEO_AVATAR_URL = '/src/assets/images/avatar-theo.jpg';
const SAMPLE_AI_IMAGE_URL = '/src/assets/images/sample-image.jpg';
const CREATORS_WORKSPACE_URL = '/src/assets/images/workspace-preview.jpg';


type PageView = 'home' | 'pricing' | 'blog' | 'login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeToolPreset, setActiveToolPreset] = useState<string | null>(null);
  const [legalSlug, setLegalSlug] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User session & credit state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<'Free' | 'Starter' | 'Grow'>('Free');
  const [freeRemovalsUsed, setFreeRemovalsUsed] = useState(0);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [trialToast, setTrialToast] = useState<string | null>(null);

  // Sync initial path if user opens /pricing, /blog, /login directly
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+/, '');
    if (path === 'pricing') setCurrentPage('pricing');
    else if (path === 'blog') setCurrentPage('blog');
    else if (path === 'login') setCurrentPage('login');
    else if (TOOL_PRESETS[path]) {
      setCurrentPage('home');
      setActiveToolPreset(path);
    }
  }, []);

  const navigateTo = (page: PageView, toolSlug?: string, hashId?: string) => {
    setMobileMenuOpen(false);
    setCurrentPage(page);
    setActiveToolPreset(toolSlug || null);

    const urlPath = toolSlug ? `/${toolSlug}` : page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', hashId ? `${urlPath}#${hashId}` : urlPath);

    if (hashId) {
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSuccessLogin = async (email: string) => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Fallback gracefully if dev server runs client-only
    }
    setUserEmail(email);
    if (creditsBalance === 0 && activePlan === 'Free') {
      setCreditsBalance(5); // 1 free image removal credit equivalent
    }
    navigateTo('home', undefined, 'tool');
    setTrialToast(`Signed in as ${email} · 1 free SynthID removal ready`);
    setTimeout(() => setTrialToast(null), 4000);
  };

  const handleStartTrial = (planName: 'Starter' | 'Grow', billing: 'monthly' | 'yearly') => {
    const grantedCredits = planName === 'Grow' ? 1000 : 500;
    setActivePlan(planName);
    setCreditsBalance((prev) => prev + grantedCredits);
    if (!userEmail) {
      setUserEmail('creator@studio.io');
    }
    setTrialToast(
      `${planName} (${billing}) $1 1-day trial activated · ${grantedCredits.toLocaleString()} credits added`
    );
    setTimeout(() => setTrialToast(null), 4500);
    navigateTo('home', undefined, 'tool');
  };

  const handleConsumeRemoval = (isFree: boolean, creditsUsed: number) => {
    if (isFree) {
      setFreeRemovalsUsed((prev) => prev + 1);
    } else {
      setCreditsBalance((prev) => Math.max(0, prev - creditsUsed));
    }
  };

  const presetConfig = activeToolPreset ? TOOL_PRESETS[activeToolPreset] : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0d0d0d]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ececef]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="/"
            aria-label="RemoveSynthID Home"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="whitespace-nowrap shrink-0"
          >
            <BrandWordmark variant="header" />
          </a>

          {/* Zone 2 & 3: Navigation Links & Primary Action */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-7">
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('blog');
              }}
              className={`text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'blog' ? 'text-[#6336ff] font-semibold' : 'text-zinc-600 hover:text-[#0d0d0d]'
              }`}
            >
              Blog
            </a>
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('pricing');
              }}
              className={`text-[13.5px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentPage === 'pricing'
                  ? 'text-[#6336ff] font-semibold'
                  : 'text-zinc-600 hover:text-[#0d0d0d]'
              }`}
            >
              Pricing
            </a>

            {userEmail ? (
              <div className="flex items-center gap-3">
                <span className="text-[12.5px] text-zinc-600 font-mono-tabular whitespace-nowrap shrink-0">
                  {activePlan} · {creditsBalance} credits
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include',
                      });
                    } catch {
                      // Ignore error
                    }
                    setUserEmail(null);
                    setActivePlan('Free');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 text-[12.5px] font-semibold text-[#0d0d0d] hover:bg-zinc-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('login');
                }}
                className="px-4 py-2 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[13px] font-bold transition-colors whitespace-nowrap shrink-0"
              >
                Sign up
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#ececef] bg-white px-6 py-4 flex flex-col gap-3">
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('blog');
              }}
              className="py-1.5 text-[14px] font-semibold text-[#0d0d0d]"
            >
              Blog
            </a>
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('pricing');
              }}
              className="py-1.5 text-[14px] font-semibold text-[#0d0d0d]"
            >
              Pricing
            </a>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('login');
              }}
              className="py-2.5 px-4 rounded-xl bg-[#6336ff] text-white text-center text-[13.5px] font-bold"
            >
              Sign up
            </a>
          </div>
        )}
      </header>

      {/* Optional Toast Banner */}
      {trialToast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-md rounded-2xl bg-[#0d0d0d] text-white px-4 py-3 shadow-xl flex items-center gap-3 text-[13px]"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <span className="font-medium">{trialToast}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setTrialToast(null)}
            className="text-zinc-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div>
            {/* Hero Section with subtle purple grid */}
            <section className="relative pt-14 sm:pt-20 pb-8 px-6 overflow-hidden">
              <div className="hero-grid-bg absolute inset-0 pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto text-center mb-10">
                <div className="text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#0d0d0d] mb-3">
                  <ScrambleDecodeText
                    text={presetConfig ? presetConfig.badge : 'SynthID Remover'}
                    className="font-sans font-extrabold"
                  />
                </div>

                {presetConfig ? (
                  <h1 className="text-[36px] sm:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.08] text-[#0d0d0d] mb-5 text-balance">
                    <SplitTextReveal text={presetConfig.title} />
                  </h1>
                ) : (
                  <h1 className="text-[38px] sm:text-[62px] font-extrabold tracking-[-0.035em] leading-[1.08] text-[#0d0d0d] mb-5">
                    <SplitTextReveal text="Stop Platforms" /> <HeroSocialBadges />{' '}
                    <SplitTextReveal text="Flagging" delay={0.12} />
                    <br />
                    <SplitTextReveal text="Your" delay={0.18} />{' '}
                    <RotatingTextPhrase
                      phrases={[
                        'AI Images & Videos',
                        'Gemini & Veo Clips',
                        'IG & TikTok Posts',
                        'Client Deliverables',
                      ]}
                    />
                  </h1>
                )}

                <p className="text-[15.5px] sm:text-[17.5px] text-zinc-500 leading-[1.6] max-w-2xl mx-auto">
                  {presetConfig ? (
                    presetConfig.subtitle
                  ) : (
                    <>
                      Strip invisible AI watermarks like{' '}
                      <KineticHighlight className="font-bold text-[#0d0d0d]">
                        SynthID
                      </KineticHighlight>{' '}
                      from any AI-generated image or video, so social platforms like Instagram and
                      TikTok won&apos;t flag your content as AI.
                    </>
                  )}
                </p>
              </div>

              {/* Interactive Tool Dropzone & Scanner Workspace */}
              <div className="relative z-10">
                <SynthIdToolWorkspace
                  sampleImageUrl={SAMPLE_AI_IMAGE_URL}
                  freeRemovalsUsed={freeRemovalsUsed}
                  creditsBalance={creditsBalance}
                  userEmail={userEmail}
                  onConsumeRemoval={handleConsumeRemoval}
                  onNavigate={navigateTo}
                  presetTitle={presetConfig?.dropHeading}
                />
              </div>
            </section>

            {/* Kinetic Signal Typography Marquee Ribbon */}
            <SignalMarqueeRibbon />

            {/* All RemoveSynthID Marketing & Explainer Sections */}
            <HomeSections
              mayaAvatarUrl={MAYA_AVATAR_URL}
              theoAvatarUrl={THEO_AVATAR_URL}
              onScrollToTool={() => navigateTo('home', undefined, 'tool')}
              onNavigatePricing={() => navigateTo('pricing')}
            />
          </div>
        )}

        {currentPage === 'pricing' && (
          <PricingPage
            creatorsImageUrl={CREATORS_WORKSPACE_URL}
            mayaAvatarUrl={MAYA_AVATAR_URL}
            theoAvatarUrl={THEO_AVATAR_URL}
            onStartTrial={handleStartTrial}
            onGoToTool={() => navigateTo('home', undefined, 'tool')}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage onGoToTool={() => navigateTo('home', undefined, 'tool')} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            mayaAvatarUrl={MAYA_AVATAR_URL}
            theoAvatarUrl={THEO_AVATAR_URL}
            onSuccessLogin={handleSuccessLogin}
            onOpenLegal={(slug) => setLegalSlug(slug)}
          />
        )}
      </main>

      {/* Footer matching removesynthid.io */}
      <footer className="border-t border-[#ececef] bg-white pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-3.5">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('home');
                }}
                className="inline-block"
              >
                <BrandWordmark variant="footer" />
              </a>
              <p className="text-[13px] text-zinc-500 leading-relaxed max-w-xs">
                Strip SynthID and C2PA from any Gemini, Veo or Imagen image and video. Clean,
                private, pixel-perfect.
              </p>
            </div>

            {/* Tools Column */}
            <nav aria-label="Tools" className="md:col-span-3 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                Tools
              </h2>
              <ul className="space-y-2.5 text-[13px] text-zinc-600">
                {[
                  { label: 'AI Image Humanizer', slug: 'humanize-ai-image' },
                  {
                    label: 'Remove AI Info from Instagram Post',
                    slug: 'remove-ai-info-from-instagram-post',
                  },
                  {
                    label: 'Remove AI Info from Instagram Story',
                    slug: 'remove-ai-info-from-instagram-story',
                  },
                  {
                    label: 'Remove AI Info from Instagram Reels',
                    slug: 'remove-ai-info-from-instagram-reels',
                  },
                  {
                    label: 'Remove AI Generated Content from TikTok',
                    slug: 'remove-ai-generated-content-from-tiktok',
                  },
                ].map((tool) => (
                  <li key={tool.slug}>
                    <a
                      href={`/${tool.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('home', tool.slug, 'tool');
                      }}
                      className="hover:text-[#6336ff] transition-colors"
                    >
                      {tool.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Learn Column */}
            <nav aria-label="Learn" className="md:col-span-2 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                Learn
              </h2>
              <ul className="space-y-2.5 text-[13px] text-zinc-600">
                <li>
                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('blog');
                    }}
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/#what"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('home', undefined, 'what');
                    }}
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    What is SynthID
                  </a>
                </li>
                <li>
                  <a
                    href="/#how"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('home', undefined, 'how');
                    }}
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('pricing');
                    }}
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('home', undefined, 'faq');
                    }}
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>

            {/* Company Column */}
            <nav aria-label="Company" className="md:col-span-3 space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                Company
              </h2>
              <ul className="space-y-2.5 text-[13px] text-zinc-600">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalSlug('privacy-policy')}
                    className="hover:text-[#6336ff] transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalSlug('terms')}
                    className="hover:text-[#6336ff] transition-colors cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalSlug('cancellation-policy')}
                    className="hover:text-[#6336ff] transition-colors cursor-pointer"
                  >
                    Cancellation Policy
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:support@removesynthid.io"
                    className="hover:text-[#6336ff] transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="pt-8 border-t border-[#ececef] flex flex-wrap items-center justify-between gap-4 text-[12px] text-zinc-400">
            <span>© 2026 removesynthid.io · Not affiliated with Google.</span>
            <span>Use on content you own or have the rights to.</span>
          </div>
        </div>
      </footer>

      <LegalModal slug={legalSlug} onClose={() => setLegalSlug(null)} />
    </div>
  );
}
