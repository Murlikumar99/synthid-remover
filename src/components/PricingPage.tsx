import React, { useState } from 'react';
import {
  Check,
  X,
  ArrowRight,
  Lock,
  Clock,
  CreditCard,
  Coins,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { PRICING_FAQS } from '../data/siteContent';
import { SplitTextReveal, KineticHighlight } from './AnimatedTypography';

interface PricingPageProps {
  creatorsImageUrl: string;
  mayaAvatarUrl: string;
  theoAvatarUrl: string;
  onStartTrial: (planName: 'Starter' | 'Grow', billing: 'monthly' | 'yearly') => void;
  onGoToTool: () => void;
}

export function PricingPage({
  creatorsImageUrl,
  mayaAvatarUrl,
  theoAvatarUrl,
  onStartTrial,
  onGoToTool,
}: PricingPageProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const starterMonthlyRate = billing === 'yearly' ? '$7' : '$12';
  const growMonthlyRate = billing === 'yearly' ? '$14' : '$24';
  const billingNote = billing === 'yearly' ? 'billed annually' : 'billed monthly';

  return (
    <div className="relative overflow-hidden">
      {/* Subtle dotted hero backdrop */}
      <div className="pricing-dots-bg absolute inset-x-0 top-0 h-[420px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#f3efff] border border-[#e2d9ff] text-[12px] font-semibold text-[#6336ff] mb-6">
          Pricing
        </div>
        <h1 className="text-[40px] sm:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.06] text-[#0d0d0d] mb-5">
          <SplitTextReveal text="Stop getting flagged" />
          <br />
          <SplitTextReveal text="as" delay={0.12} />{' '}
          <KineticHighlight className="text-[#6336ff]">
            <SplitTextReveal text="AI content." delay={0.18} />
          </KineticHighlight>
        </h1>
        <p className="text-[16px] sm:text-[17.5px] text-zinc-500 leading-[1.6] max-w-xl mx-auto mb-9">
          Remove the hidden SynthID watermark and C2PA data that mark your images and videos as AI.
          Every account gets one free removal. Paid plans add credits for more.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div
          role="tablist"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 p-1.5 rounded-2xl border border-[#ececef] bg-white shadow-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              billing === 'monthly'
                ? 'bg-[#f1ecff] text-[#6336ff]'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={billing === 'yearly'}
            onClick={() => setBilling('yearly')}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              billing === 'yearly'
                ? 'bg-[#f1ecff] text-[#6336ff]'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </section>

      {/* Starter & Grow Pricing Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Starter Card */}
          <div className="lg:col-span-5 rounded-[24px] border border-[#ececef] bg-white p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-[#0d0d0d] mb-3">Starter</h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3efff] border border-[#e2d9ff] text-[11px] font-semibold text-[#6336ff] mb-4">
                1-day trial for $1
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[44px] font-extrabold tracking-tight text-[#0d0d0d] font-mono-tabular">
                  $1
                </span>
                <span className="text-[13px] text-zinc-500">1-day trial</span>
              </div>
              <p className="text-[13px] text-zinc-500 mb-6">
                then <strong className="text-[#0d0d0d] font-semibold">{starterMonthlyRate}</strong>/mo{' '}
                {billingNote}
              </p>

              <button
                type="button"
                onClick={() => onStartTrial('Starter', billing)}
                className="w-full py-3 px-4 rounded-xl border border-[#e2e2e7] bg-white hover:bg-zinc-50 text-[13.5px] font-bold text-[#0d0d0d] transition-colors cursor-pointer mb-6"
              >
                Start $1 trial
              </button>

              <div className="border-t border-zinc-100 pt-6">
                <ul className="space-y-3 text-[13.5px] text-[#0d0d0d]">
                  {[
                    '500 credits / month',
                    'Removes SynthID watermarks',
                    'Image & video support',
                    'Video clips up to 30 seconds',
                    'Every video frame cleaned',
                    'Pixel-for-pixel quality',
                    'Email support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#6336ff] text-white inline-flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Grow Card (Most Popular) */}
          <div className="lg:col-span-7 relative rounded-[24px] border-[1.5px] border-[#6336ff] bg-white p-7 sm:p-8 shadow-[0_20px_50px_-15px_rgba(99,54,255,0.18)] flex flex-col justify-between">
            <div className="absolute -top-3.5 left-7 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3efff] border border-[#d6c8ff] text-[11px] font-bold text-[#6336ff]">
              <Zap className="w-3 h-3" />
              <span>Most popular</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h2 className="text-[22px] font-bold text-[#0d0d0d] mb-3">Grow</h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3efff] border border-[#e2d9ff] text-[11px] font-semibold text-[#6336ff] mb-4">
                  1-day trial for $1
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[44px] font-extrabold tracking-tight text-[#0d0d0d] font-mono-tabular">
                    $1
                  </span>
                  <span className="text-[13px] text-zinc-500">1-day trial</span>
                </div>
                <p className="text-[13px] text-zinc-500 mb-6">
                  then <strong className="text-[#0d0d0d] font-semibold">{growMonthlyRate}</strong>/mo{' '}
                  {billingNote}
                </p>

                <button
                  type="button"
                  onClick={() => onStartTrial('Grow', billing)}
                  className="w-full py-3 px-4 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[13.5px] font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mb-4"
                >
                  <span>Start $1 trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[12.5px] text-zinc-500 leading-relaxed">
                  Higher volume across images and video, for serious publishing and client work.
                </p>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#0d0d0d] mb-4">
                  Everything in Starter, plus:
                </p>
                <ul className="space-y-3 text-[13.5px] text-[#0d0d0d]">
                  {['1,000 credits / month', 'Priority processing'].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#6336ff] text-white inline-flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img
                    src={mayaAvatarUrl}
                    alt="Creator avatar"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  />
                  <img
                    src={theoAvatarUrl}
                    alt="Studio lead avatar"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  />
                  <span className="w-8 h-8 rounded-full bg-[#f3efff] text-[#6336ff] text-[11px] font-bold inline-flex items-center justify-center ring-2 ring-white">
                    +40k
                  </span>
                </div>
                <div>
                  <div className="text-[12.5px] font-bold text-[#0d0d0d] font-mono-tabular">
                    4.9 / 5.0 Rating
                  </div>
                  <div className="text-[12px] text-zinc-500">Loved by 40,000+ creators</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#0d0d0d]">
                <span className="w-7 h-7 rounded-lg bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <span>Private, in-browser</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-zinc-500">
          Every plan starts with a $1, 1-day trial · cancel before it ends to avoid renewal charges.
        </p>
      </section>

      {/* How the credits work */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#ececef]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3efff] text-[11.5px] font-semibold text-[#6336ff] mb-3">
            Good to know
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#0d0d0d]">
            How the credits work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="rounded-2xl border border-[#ececef] bg-white p-6">
            <div className="w-9 h-9 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-4">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0d0d0d] mb-2">
              5 credits per image or minute of audio
            </h3>
            <p className="text-[13.5px] text-zinc-500 leading-relaxed">
              Audio uses 5 credits per started minute, up to 5 minutes. Video uses 15 credits per
              second, up to 30 seconds. Your first image, or audio up to a minute, is free.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ececef] bg-white p-6">
            <div className="w-9 h-9 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0d0d0d] mb-2">
              Credits reset at renewal
            </h3>
            <p className="text-[13.5px] text-zinc-500 leading-relaxed">
              Unused monthly credits reset at renewal. Annual plan credits arrive in monthly
              installments and reset at the annual renewal.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ececef] bg-white p-6">
            <div className="w-9 h-9 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-4">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#0d0d0d] mb-2">No card to start</h3>
            <p className="text-[13.5px] text-zinc-500 leading-relaxed">
              A new workspace gets one free image removal, or audio up to a minute. A payment method
              is required when you subscribe to a paid plan.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onGoToTool}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#6336ff] hover:text-[#5326ee] cursor-pointer"
          >
            <span>Clean your first file free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* RemoveSynthID vs. Others Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#ececef]">
        <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight text-[#0d0d0d] text-center mb-10">
          RemoveSynthID vs. Others
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#ececef] bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ececef] bg-[#faf9fe] text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-5">Feature</th>
                <th className="py-4 px-5 text-[#6336ff]">RemoveSynthID</th>
                <th className="py-4 px-5">ChromaStudio</th>
                <th className="py-4 px-5">GptCleanup</th>
                <th className="py-4 px-5">Web-Based Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ececef] text-[13.5px]">
              {[
                {
                  feature: 'Works On Images',
                  cols: ['Included', 'Included', 'Included', 'Varies'],
                },
                {
                  feature: 'Works On Videos',
                  cols: ['Included', 'Unavailable', 'Unavailable', 'Unavailable'],
                },
                {
                  feature: '100% Local Processing',
                  cols: ['Included', 'Included', 'Included', 'Unavailable'],
                },
                {
                  feature: 'SynthID Removal Accuracy',
                  cols: ['99.9% (5/5)', '80% (4/5)', '60% (3/5)', '40% (2/5)'],
                },
                {
                  feature: 'No Quality Loss',
                  cols: ['Included', 'Included', 'Included', 'Unavailable'],
                },
                {
                  feature: 'Fast GPU Acceleration',
                  cols: ['Included', 'Limited', 'Unavailable', 'Unavailable'],
                },
              ].map((row) => (
                <tr key={row.feature} className="hover:bg-zinc-50/60">
                  <th scope="row" className="py-4 px-5 font-semibold text-[#0d0d0d]">
                    {row.feature}
                  </th>
                  {row.cols.map((val, idx) => (
                    <td key={idx} className="py-4 px-5 font-mono-tabular">
                      {val === 'Included' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Included</span>
                        </span>
                      ) : val === 'Unavailable' ? (
                        <span className="inline-flex items-center gap-1.5 text-zinc-400">
                          <X className="w-4 h-4" />
                          <span>Unavailable</span>
                        </span>
                      ) : (
                        <span className={idx === 0 ? 'font-bold text-[#6336ff]' : 'text-zinc-600'}>
                          {val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who Uses RemoveSynthID? */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#ececef]">
        <div className="text-center mb-12">
          <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-tight text-[#0d0d0d] mb-3">
            Who Uses RemoveSynthID?
          </h2>
          <p className="text-[15.5px] text-zinc-500">
            Your audience wants a human, not a robot. RemoveSynthID helps you give them one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Creators and Designers',
              desc: 'Publish or deliver visuals that look clean and natural. RemoveSynthID helps creators share Gemini-generated images and videos without embedded AI watermark traces.',
              img: creatorsImageUrl,
            },
            {
              title: 'Businesses and Agencies',
              desc: 'Use AI-assisted visuals across marketing, websites, and campaigns with confidence. RemoveSynthID helps teams deliver content without invisible AI identifiers affecting review, approval, or distribution.',
              img: theoAvatarUrl,
            },
            {
              title: 'Everyday Users',
              desc: 'Share AI-generated content without exposing tools, workflows, or technical details. RemoveSynthID keeps personal and casual use simple, private, and neutral.',
              img: mayaAvatarUrl,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#ececef] bg-white overflow-hidden flex flex-col"
            >
              <div className="h-44 bg-zinc-100 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-[17px] font-bold text-[#0d0d0d] mb-2">{card.title}</h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-[#ececef]">
        <h2 className="text-[30px] sm:text-[36px] font-extrabold tracking-tight text-[#0d0d0d] text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-[#ececef] border-y border-[#ececef]">
          {PRICING_FAQS.map((item, idx) => {
            const expanded = openFaqIndex === idx;
            return (
              <div key={item.question} className="py-4">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpenFaqIndex(expanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left py-1 text-[15px] font-semibold text-[#0d0d0d] hover:text-[#6336ff] transition-colors cursor-pointer"
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
                  <p className="mt-2.5 text-[14px] text-zinc-500 leading-relaxed pr-6">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
