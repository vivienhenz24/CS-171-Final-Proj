'use client';

import { ArrowLeft, ArrowRight, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PageBadge } from './common';

export default function PageSeven({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12 bg-gradient-to-b from-black via-[#0f101a] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />

      <div className="relative flex flex-col items-center gap-4">
        <PageBadge page={6} label="Data gaps" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
        </div>
      </div>

      <div className="relative max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">The data we don&apos;t have (yet)</h2>
        <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
          Harvard guards Q Guide data like Fort Knox. We scraped what&apos;s publicly available, but decades of historical data remain locked behind access gates that would make a Swiss bank jealous.
        </p>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          Because apparently, letting students see how workloads have changed over 20 years is a national security risk.
        </p>
      </div>

      {/* Images */}
      <div className="relative grid gap-8 md:grid-cols-3 w-full max-w-6xl mt-4">
        <div className="relative flex flex-col gap-3">
          <div className="relative w-full rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <Image
              src="/IMG_7468.jpeg"
              alt="Locked data archive"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Lock className="h-4 w-4" />
            <span className="font-medium">Historical Workload (2005–2025)</span>
          </div>
          <p className="text-xs text-white/70">Trend lines blurred — archives locked.</p>
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="relative w-full rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <Image
              src="/IMG_7571.jpeg"
              alt="Protected data"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Instructor Gender vs Popularity</span>
          </div>
          <p className="text-xs text-white/70">Scatter withheld. Transparency pending.</p>
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="relative w-full rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <Image
              src="/IMG_7645.jpeg"
              alt="Gated data access"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <Lock className="h-4 w-4" />
            <span className="font-medium">Q Comments Sentiment Map</span>
          </div>
          <p className="text-xs text-white/70">Network graph gated behind access.</p>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6 text-sm text-white/75 max-w-4xl text-center mt-4">
        <p className="text-white/80 leading-relaxed">
          Decades of Q scores, comments, and trends remain closed. Unlocking them would reveal how workloads shift, how
          teaching quality differs, and how AI changes engagement. But hey, at least we can see this semester&apos;s data. Progress?
        </p>
        <Link
          href="https://hodp.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20 transition-colors"
        >
          Learn about Harvard Q Guide access <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20 transition-colors"
        >
          Continue to summary <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

