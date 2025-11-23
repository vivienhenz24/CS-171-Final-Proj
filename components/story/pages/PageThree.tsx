'use client';

import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';

const colorForDept = (department: string) => {
  let hash = 0;
  for (let i = 0; i < department.length; i++) hash = department.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

export default function PageThree({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { departments, courses, selectedDept, setSelectedDept } = useDataContext();
  const maxHours = useMemo(() => (departments.length ? Math.max(...departments.map((d) => d.avg_hours)) : 0), [departments]);
  const maxEnrollment = useMemo(
    () => (departments.length ? Math.max(...departments.map((d) => d.total_enrollment || d.avg_enrollment)) : 0),
    [departments]
  );

  if (!selectedDept) return null;

  const topCourses = useMemo(() => {
    return courses
      .filter((c) => c.department === selectedDept.department)
      .sort((a, b) => b.rating - a.rating || b.num_students - a.num_students)
      .slice(0, 3);
  }, [courses, selectedDept.department]);

  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 px-6 py-16 md:px-12 bg-gradient-to-b from-black via-[#0f101a] to-black">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageBadge page={3} label="How satisfied you are" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <button onClick={onBack} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
          <ArrowRight className="h-4 w-4 text-white/40" />
          <button onClick={onNext} className="underline underline-offset-4 hover:text-white">
            Skip ahead
          </button>
        </div>
      </div>
      <div className="max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-semibold">How satisfaction compares to effort</h2>
        <p className="mt-3 text-white/70">
          Each point is a concentration: workload (x) vs satisfaction (y). Size scales with enrollment; color by dept
          code. Yours glows.
        </p>
      </div>
      <div className="relative h-[420px] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur">
        <div className="absolute left-6 top-6 text-xs uppercase tracking-wide text-white/60">Satisfaction ↑</div>
        <div className="absolute bottom-6 right-6 text-xs uppercase tracking-wide text-white/60">Hours/week →</div>
        <div className="absolute inset-6 border border-white/10">
          {departments.map((item) => {
            const x = maxHours ? (item.avg_hours / maxHours) * 100 : 0;
            const y = item.avg_rating > 0 ? (item.avg_rating / 5) * 100 : 0;
            const size = maxEnrollment ? Math.max(10, ((item.total_enrollment || item.avg_enrollment) / maxEnrollment) * 28) : 10;
            const isSelected = item.department === selectedDept.department;
            return (
              <button
                key={item.department}
                className="absolute rounded-full transition duration-300"
                style={{
                  left: `calc(${x}% - ${size / 2}px)`,
                  bottom: `calc(${y}% - ${size / 2}px)`,
                  width: size,
                  height: size,
                  background: colorForDept(item.department),
                  boxShadow: isSelected
                    ? '0 0 0 4px rgba(228,196,95,0.8), 0 0 25px rgba(228,196,95,0.6)'
                    : '0 10px 30px rgba(0,0,0,0.35)',
                  opacity: isSelected ? 1 : 0.85
                }}
                onClick={() => setSelectedDept(item)}
                title={`${item.department} — ${item.avg_hours.toFixed(1)} hrs, ${item.avg_rating.toFixed(2)}/5`}
              >
                {isSelected && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                    {item.department}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your field</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Dept code</span>
          </div>
          <p className="mt-2">
            {selectedDept.department} students average {selectedDept.avg_hours.toFixed(1)} hrs/week and rate
            satisfaction {selectedDept.avg_rating.toFixed(2)}/5. Enrollment (latest snapshot):{' '}
            {Math.round(selectedDept.avg_enrollment).toLocaleString()} students.
          </p>
          {topCourses.length > 0 && (
            <div className="mt-3 text-white/70">
              Top courses by rating:
              <ul className="mt-2 space-y-1">
                {topCourses.map((c) => (
                  <li key={c.fas_id}>
                    <span className="font-semibold text-white">{c.course_code}</span> · {c.rating.toFixed(2)}/5 ·{' '}
                    {c.hours_per_week.toFixed(1)} hrs/wk
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <h3 className="text-lg font-semibold text-white">Takeaway</h3>
          <p className="mt-2">
            Concentrations spread along an effort–enjoyment curve. Low hours and high ratings cluster as “gems”; high
            hours with strong ratings signal passion pockets. Your dot shows where you land.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              Next: Context <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-white/60">Click a dot to peek at another field.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
