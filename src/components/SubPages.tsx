import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from '../data/siteContent';

interface BlogPageProps {
  onGoToTool: () => void;
}

export function BlogPage({ onGoToTool }: BlogPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          type="button"
          onClick={() => setSelectedArticle(null)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6336ff] hover:underline mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all guides</span>
        </button>

        <div className="text-[12.5px] text-zinc-500 mb-3">
          <span>{selectedArticle.date}</span>
          <span className="mx-2">·</span>
          <span>{selectedArticle.readTime}</span>
        </div>

        <h1 className="text-[32px] sm:text-[42px] font-extrabold tracking-tight text-[#0d0d0d] leading-tight mb-6">
          {selectedArticle.title}
        </h1>

        <div className="space-y-8 text-[15.5px] text-zinc-600 leading-[1.75]">
          {selectedArticle.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="text-[22px] font-bold text-[#0d0d0d]">{sec.heading}</h2>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 p-7 rounded-2xl border border-[#e2d9ff] bg-[#faf8ff] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#0d0d0d] mb-1">
              Ready to strip SynthID and C2PA from your file?
            </h3>
            <p className="text-[13.5px] text-zinc-500">
              Process images and video locally in your browser with zero quality loss.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToTool}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6336ff] hover:bg-[#5326ee] text-white text-[13.5px] font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Open SynthID Remover</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <div className="max-w-2xl mb-12">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6336ff] mb-3">
          REMOVESYNTHID BLOG
        </div>
        <h1 className="text-[34px] sm:text-[42px] font-extrabold tracking-tight text-[#0d0d0d] leading-tight mb-4">
          Guides for AI Info labels and hidden AI signals
        </h1>
        <p className="text-[16px] text-zinc-500 leading-relaxed">
          Learn how Instagram, TikTok, SynthID, C2PA, and Content Credentials affect the files you
          upload.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_ARTICLES.map((art) => (
          <article
            key={art.slug}
            className="rounded-[24px] border border-[#ececef] bg-white p-7 sm:p-8 flex flex-col justify-between hover:border-[#d6c8ff] transition-colors"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#f3efff] text-[#6336ff] inline-flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5" />
              </div>

              <div className="flex items-center gap-2 text-[12.5px] text-zinc-400 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>{art.date}</span>
              </div>

              <h2 className="text-[19px] font-bold text-[#0d0d0d] leading-snug mb-3">
                {art.title}
              </h2>

              <p className="text-[13.5px] text-zinc-500 leading-relaxed mb-6">{art.summary}</p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setSelectedArticle(art)}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#6336ff] hover:text-[#5326ee] cursor-pointer"
              >
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function LegalModal({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  if (!slug) return null;

  const content = {
    'privacy-policy': {
      title: 'Privacy Policy',
      body: 'RemoveSynthID processes your images, videos, and audio files locally inside your browser session. Media files are never uploaded to external storage buckets or used to train machine learning models. We only store essential account authentication state and credit balances.',
    },
    terms: {
      title: 'Terms & Conditions',
      body: 'RemoveSynthID is provided for creators, studios, and rights-holders to manage metadata and invisible watermarks on content they own or are authorized to modify. Users remain responsible for complying with applicable laws and platform policies.',
    },
    'cancellation-policy': {
      title: 'Cancellation Policy',
      body: 'Every paid plan begins with a $1, 1-day trial. You may cancel your trial or recurring subscription at any time with one click from your account header. Canceling before the trial period ends prevents any recurring renewal charges.',
    },
  }[slug] || {
    title: 'Legal Information',
    body: 'Use RemoveSynthID on content you own or have the rights to.',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl border border-[#ececef] max-w-lg w-full p-6 sm:p-8 shadow-xl">
        <h2 id="legal-modal-title" className="text-[20px] font-bold text-[#0d0d0d] mb-3">
          {content.title}
        </h2>
        <p className="text-[14px] text-zinc-600 leading-relaxed mb-6">{content.body}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#6336ff] text-white text-[13px] font-bold hover:bg-[#5326ee] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
