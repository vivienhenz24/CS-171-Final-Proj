'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { getSalary } from '@/lib/salaryMapping';

export default function PageFive({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { selectedDept } = useDataContext();

  if (!selectedDept) return null;

  const hoursPerWeek = selectedDept.avg_hours * 3.5;
  const satisfaction = selectedDept.avg_rating;
  const expectedSalary = getSalary(selectedDept.department);

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12">
      <div className="flex flex-col items-center gap-4">
        <PageBadge page={4} label="Your future" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">What to expect</h2>
        <p className="mt-3 text-white/70">
          Here&apos;s what your journey in <span className="text-white">{selectedDept.departmentName}</span> looks like
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Hours per Week */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="text-4xl md:text-5xl font-normal text-white mb-2">
            {hoursPerWeek.toFixed(1)}
          </div>
          <div className="text-sm text-white/60 uppercase tracking-wide mb-1">Hours per Week</div>
          <div className="text-xs text-white/50 text-center">
            Average weekly workload
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="text-4xl md:text-5xl font-normal text-white mb-2">
            {satisfaction.toFixed(1)}
          </div>
          <div className="text-sm text-white/60 uppercase tracking-wide mb-1">Satisfaction Score</div>
          <div className="text-xs text-white/50 text-center">
            Out of 5.0
          </div>
        </div>

        {/* Expected Salary */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="text-4xl md:text-5xl font-normal text-white mb-2">
            ${(expectedSalary / 1000).toFixed(0)}k
          </div>
          <div className="text-sm text-white/60 uppercase tracking-wide mb-1">Expected Salary</div>
          <div className="text-xs text-white/50 text-center">
            After graduation
          </div>
        </div>
      </div>

      <div className="max-w-3xl text-center text-sm text-white/70">
        <p>
          These metrics reflect the typical experience for students in{' '}
          <span className="text-white">{selectedDept.departmentName}</span>. 
          Your individual path may vary based on course selection, career goals, and opportunities.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
