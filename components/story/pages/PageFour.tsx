'use client';

import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';

// Division colors are approximated per department code since division labels are absent in the CSV.
const colorForDept = (department: string) => {
  let hash = 0;
  for (let i = 0; i < department.length; i++) hash = department.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

export default function PageFour({ onNext }: { onNext: () => void }) {
  const { departments, selectedDept } = useDataContext();
  const maxHours = useMemo(() => (departments.length ? Math.max(...departments.map((d) => d.avg_hours)) : 0), [departments]);
  const maxEnrollment = useMemo(
    () => (departments.length ? Math.max(...departments.map((d) => d.total_enrollment || d.avg_enrollment)) : 0),
    [departments]
  );

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 px-6 py-16 md:px-12">
      <PageBadge page={4} label="Context" />
      <div className="max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-semibold">Your concentration in context</h2>
        <p className="mt-3 text-white/70">Bubble size = enrollment. Color varies by department code.</p>
      </div>
      <div className="relative h-[420px] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-black/50 to-white/5 p-6 backdrop-blur">
        <div className="absolute inset-6">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border border-white/5">
            <div className="border-b border-r border-white/5 px-2 py-1 text-xs text-white/60">The Gems</div>
            <div className="border-b border-white/5 px-2 py-1 text-xs text-white/60 text-right">Passion Projects</div>
            <div className="border-r border-white/5 px-2 py-1 text-xs text-white/60">Breezy Majors</div>
            <div className="px-2 py-1 text-xs text-white/60 text-right">Grind Zones</div>
          </div>
          {departments.map((item) => {
            const x = maxHours ? (item.avg_hours / maxHours) * 100 : 0;
            const y = item.avg_rating > 0 ? (item.avg_rating / 5) * 100 : 0;
            const size = maxEnrollment ? Math.max(14, ((item.total_enrollment || item.avg_enrollment) / maxEnrollment) * 32) : 14;
            const isSelected = item.department === selectedDept.department;
            return (
              <div
                key={item.department}
                className="absolute rounded-full transition duration-300"
                style={{
                  left: `calc(${x}% - ${size / 2}px)`,
                  bottom: `calc(${y}% - ${size / 2}px)`,
                  width: size,
                  height: size,
                  background: `radial-gradient(circle, ${colorForDept(item.department)}, ${colorForDept(item.department)}dd)`,
                  boxShadow: isSelected
                    ? '0 0 0 3px #e4c45f, 0 0 35px rgba(228,196,95,0.6)'
                    : '0 10px 30px rgba(0,0,0,0.35)',
                  opacity: isSelected ? 1 : 0.85
                }}
                title={`${item.department} — ${item.avg_hours.toFixed(1)} hrs, ${item.avg_rating.toFixed(2)}/5`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm text-white/75 max-w-4xl">
        <p>
          Your concentration, <span className="text-white font-semibold">{selectedDept.department}</span>, sits among peers
          with similar effort/enjoyment balance. Bigger bubbles pull more students.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            Next: The data we don’t have <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
