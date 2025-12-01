'use client';

import { ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';

const SummaryStat = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
    <div className="text-xs uppercase tracking-wide text-white/60 font-normal">{label}</div>
    <div className="text-xl font-normal text-white mt-1">{value}</div>
    <div className="text-xs text-white/50 mt-1">{hint}</div>
  </div>
);

export default function PageSix({ onReset }: { onReset: () => void }) {
  const { selectedDept } = useDataContext();
  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12 bg-gradient-to-b from-black via-[#0f101a] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />

      <div className="relative flex flex-col items-center gap-4">
        <PageBadge page={7} label="Reflect & compare" />
      </div>

      <div className="relative max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">Your Concentration Compass Summary</h2>
        <p className="mt-3 text-white/70 max-w-3xl mx-auto">
          You work {selectedDept.avg_hours * 3.5 > 45 ? 'more' : 'less'} than the average Harvard student. Satisfaction sits
          at {selectedDept.avg_rating.toFixed(2)}/5. Here&apos;s where that places you.
        </p>
      </div>

      <div className="relative grid gap-6 md:grid-cols-2 max-w-5xl w-full">
        <SummaryStat 
          label="Hours per week" 
          value={`${(selectedDept.avg_hours * 3.5).toFixed(1)} hrs`} 
          hint="Average workload" 
        />
        <SummaryStat 
          label="Satisfaction" 
          value={`${selectedDept.avg_rating.toFixed(2)}/5`} 
          hint="Self-reported enjoyment" 
        />
        <SummaryStat
          label="Enrollment"
          value={Math.round(selectedDept.avg_enrollment).toLocaleString()}
          hint="Students (latest semester)"
        />
        <SummaryStat 
          label="Courses tracked" 
          value={`${selectedDept.num_courses}`} 
          hint="From Q-Guide data" 
        />
      </div>

      <div className="relative flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm max-w-3xl w-full">
        <h3 className="text-lg font-normal text-white">What you might do next</h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li>• Follow the dots: pick a nearby concentration to compare satisfaction vs workload.</li>
          <li>• Check requirements: map your semesters against the hours shown.</li>
          <li>• Share: screenshot this summary for advising conversations.</li>
        </ul>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-3 text-sm text-white/75">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20 transition-colors"
        >
          Compare another concentration <ArrowRight className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-normal hover:bg-white/10 transition-colors">
          Download snapshot (coming soon)
        </button>
      </div>
    </section>
  );
}
