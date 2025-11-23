'use client';

import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { PageBadge } from './common';

export default function PageFive({ onNext }: { onNext: () => void }) {
  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 px-6 py-16 md:px-12 bg-gradient-to-b from-[#0d0d10] via-[#0f1117] to-[#0b0b10]">
      <PageBadge page={5} label="Data gaps" />
      <div className="max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-semibold">The data we don’t have (yet)</h2>
        <p className="mt-3 text-white/70">
          We scraped what’s open. Locked archives would let us trace trends, equity, and sentiment over decades.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Historical Workload (2005–2025)', desc: 'Trend lines blurred — archives locked.' },
          { title: 'Instructor gender vs popularity', desc: 'Scatter withheld. Transparency pending.' },
          { title: 'Q Comments Sentiment Map', desc: 'Network graph gated behind access.' }
        ].map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30" />
            <div className="relative flex h-40 flex-col justify-between text-white">
              <div className="text-sm text-white/70">{item.title}</div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Lock className="h-4 w-4" />
                <span>{item.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 text-sm text-white/75 max-w-4xl">
        <p>
          Decades of Q scores, comments, and trends remain closed. Unlocking them would reveal how workloads shift, how
          teaching quality differs, and how AI changes engagement.
        </p>
        <Link
          href="https://hodp.org"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Learn about Harvard Q Guide access <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onNext}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Continue to summary <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
