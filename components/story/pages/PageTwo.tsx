'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';

const divisionColor = (dept: string) => {
  // Placeholder: lacking explicit division mapping, derive stable hue from dept code.
  let hash = 0;
  for (let i = 0; i < dept.length; i++) hash = dept.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

export default function PageTwo({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { departments, selectedDept } = useDataContext();
  const maxHours = useMemo(() => (departments.length ? Math.max(...departments.map((d) => d.avg_hours)) : 0), [departments]);

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 px-6 py-16 md:px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageBadge page={2} label="How much you work" />
        <div className="flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Change concentration
          </button>
        </div>
      </div>
      <div className="max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-semibold">How much you work</h2>
        <p className="mt-3 text-white/70">
          Average hours per week across concentrations. Sorted descending; colored by division stand-in. Yours glows.
        </p>
      </div>
      <div className="w-full max-w-5xl space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        {departments
          .slice()
          .sort((a, b) => b.avg_hours - a.avg_hours)
          .map((item) => {
            const width = maxHours ? Math.max((item.avg_hours / maxHours) * 100, 8) : 0;
            const isSelected = item.department === selectedDept.department;
            return (
              <div key={item.department} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span className="font-semibold text-white">{item.department}</span>
                  <span>{item.avg_hours.toFixed(1)} hrs/wk</span>
                </div>
                <div className="relative h-10 overflow-hidden rounded-lg border border-white/5 bg-white/5">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${width}%`,
                      background: `linear-gradient(90deg, ${divisionColor(item.department)}88, ${divisionColor(item.department)})`,
                      boxShadow: isSelected ? '0 0 0 2px #e4c45f, 0 10px 30px rgba(0,0,0,0.3)' : 'none',
                      filter: isSelected ? 'saturate(1.5)' : 'saturate(1)'
                    }}
                    title={`${item.department}: ${item.avg_hours.toFixed(1)} hrs/wk`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-semibold text-black mix-blend-screen">
                      <span className="uppercase tracking-wide">You</span>
                      <span>{item.num_courses} courses tracked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex flex-col gap-4 text-sm text-white/75 max-w-3xl">
        <div>
          Students in <span className="font-semibold text-white">{selectedDept.department}</span> report{' '}
          <span className="text-white">{selectedDept.avg_hours.toFixed(1)} hours/week</span> on average.
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Next: Satisfaction <ArrowRight className="h-4 w-4" />
          </button>
          <div className="text-white/60">Hover bars to see who works more.</div>
        </div>
      </div>
    </section>
  );
}
