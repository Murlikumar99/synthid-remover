import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { BrandWordmark, GooglePurpleIcon } from './BrandIcons';
import { SplitTextReveal } from './AnimatedTypography';

interface LoginPageProps {
  mayaAvatarUrl: string;
  theoAvatarUrl: string;
  onSuccessLogin: (email: string) => Promise<void>;
  onOpenLegal: (slug: string) => void;
}

export function LoginPage({
  mayaAvatarUrl,
  theoAvatarUrl,
  onSuccessLogin,
  onOpenLegal,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms & conditions to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await onSuccessLogin(trimmed);
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    if (!acceptedTerms) {
      setAcceptedTerms(true);
    }
    setSubmitting(true);
    try {
      await onSuccessLogin('creator@studio.io');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Value Proposition Column */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h1 className="text-[42px] sm:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.05] text-[#6336ff] mb-4">
              <SplitTextReveal text="Remove SynthID" />
              <br />
              <SplitTextReveal text="watermarks" delay={0.14} />
            </h1>
            <p className="text-[16.5px] text-zinc-500 leading-relaxed max-w-md">
              Remove the hidden SynthID watermark and C2PA data that mark your images and videos as
              AI.
            </p>
          </div>

          <ul className="space-y-5">
            {[
              {
                title: 'Your first premium removal is free',
                desc: 'An image uses 5 credits, audio 5 credits per minute, and video 15 credits per second. Your first image, or audio up to a minute, is free.',
              },
              {
                title: 'Premium processing',
                desc: 'Choose a plan for additional removals and batch processing.',
              },
              {
                title: 'Review your result',
                desc: 'Download the processed file and check the result.',
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <Check className="w-4 h-4 text-[#6336ff] stroke-[2.5] mt-1 shrink-0" />
                <div>
                  <h2 className="text-[16px] font-bold text-[#0d0d0d] mb-0.5">{item.title}</h2>
                  <p className="text-[13.5px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <div className="flex -space-x-2 mb-2.5">
              <img
                src={mayaAvatarUrl}
                alt="Creator"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
              />
              <img
                src={theoAvatarUrl}
                alt="Studio lead"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
              />
              <span className="w-9 h-9 rounded-full bg-[#f3efff] text-[#6336ff] text-xs font-bold inline-flex items-center justify-center ring-2 ring-white">
                +40k
              </span>
            </div>
            <p className="text-[12.5px] text-[#0d0d0d] font-medium">
              Every account gets one free removal. Paid plans add credits for more.
            </p>
          </div>
        </div>

        {/* Right Sign-Up / Login Card */}
        <div className="lg:col-span-6">
          <div className="max-w-[460px] mx-auto rounded-[24px] border border-[#ececef] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(13,13,13,0.08)]">
            <div className="flex justify-center mb-8">
              <BrandWordmark variant="login" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email-input"
                  className="block text-[12.5px] font-bold text-[#0d0d0d] mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Type your email"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-[14px] text-[#0d0d0d] placeholder:text-zinc-400 focus:outline-none focus:border-[#6336ff] focus:ring-2 focus:ring-[#6336ff]/15 transition-all"
                />
              </div>

              <label className="flex items-center gap-2.5 text-[12.5px] text-[#0d0d0d] cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 accent-[#6336ff] cursor-pointer"
                />
                <span>
                  <strong className="font-semibold">I accept the</strong>{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal('terms')}
                    className="text-[#6336ff] font-semibold hover:underline cursor-pointer"
                  >
                    terms &amp; conditions
                  </button>
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12.5px] flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] disabled:opacity-60 text-white text-[13.5px] font-bold transition-colors cursor-pointer"
              >
                {submitting ? 'Signing in…' : 'Continue with Email'}
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-zinc-100 w-full" />
              <span className="bg-white px-3 text-[12px] text-zinc-400">or</span>
              <div className="border-t border-zinc-100 w-full" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[13.5px] font-semibold text-[#0d0d0d] inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <GooglePurpleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
