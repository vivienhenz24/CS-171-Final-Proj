'use client';

import { ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';

const SummaryStat = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
    <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
    <div className="text-xl font-semibold text-white">{value}</div>
    <div className="text-xs text-white/50">{hint}</div>
  </div>
);

export default function PageSix({ onReset }: { onReset: () => void }) {
  const { selectedDept } = useDataContext();
  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 px-6 py-16 md:px-12">
      <PageBadge page={5} label="Reflect & compare" />
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-3xl font-semibold">Your Concentration Compass Summary</h2>
          <p className="mt-2 text-white/70">
            You work {selectedDept.avg_hours > 13 ? 'more' : 'less'} than the average Harvard student. Satisfaction sits
            at {selectedDept.avg_rating.toFixed(2)}/5. Here’s where that places you.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SummaryStat label="Hours per week" value={`${selectedDept.avg_hours.toFixed(1)} hrs`} hint="Avg workload" />
            <SummaryStat label="Satisfaction" value={`${selectedDept.avg_rating.toFixed(2)}/5`} hint="Self-reported enjoyment" />
            <SummaryStat
              label="Enrollment"
              value={Math.round(selectedDept.avg_enrollment).toLocaleString()}
              hint="Students (latest)"
            />
            <SummaryStat label="Courses tracked" value={`${selectedDept.num_courses}`} hint="From Q-Guide scrape" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/75">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              Compare another concentration <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
              Download snapshot (coming soon)
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 backdrop-blur">
          <h3 className="text-lg font-semibold text-white">What you might do next</h3>
          <ul className="space-y-2">
            <li>Follow the dots: pick a nearby concentration to compare satisfaction vs workload.</li>
            <li>Check requirements: map your semesters against the hours shown.</li>
            <li>Share: screenshot this summary for advising conversations.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
