'use client';

import { useMemo, useState } from 'react';
import { PersonStanding, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';

const PageBadge = ({ page, label }: { page: number; label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white font-semibold">{page}</span>
    <span>{label}</span>
  </div>
);

export default function PageOne({ onNext }: { onNext: () => void }) {
  const { departments, selectedDept, setSelectedDept, loading, error } = useDataContext();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (!query) return departments.slice(0, 8);
    return departments.filter((d) => d.department.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  }, [departments, query]);

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />
      <div className="relative flex flex-col items-center gap-6">
        <PageBadge page={1} label="Arrival" />
        <div className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)]">
          <div>Welcome to the Harvard Concentration Compass.</div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <PersonStanding className="h-12 w-12 text-white" />
            <span>This is you.</span>
          </div>
        </div>
        <p className="max-w-2xl text-lg text-white/80">
          Choose your concentration to begin your journey. Let’s see how students in that field spend their time.
        </p>
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 px-3 py-2">
            <Search className="h-5 w-5 text-white/60" />
            <input
              className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              placeholder="Search Harvard concentrations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 space-y-2">
            {suggestions.map((item) => (
              <button
                key={item.department}
                onClick={() => setSelectedDept(item)}
                className="flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/5"
              >
                <div>
                  <div className="text-sm font-semibold">{item.department}</div>
                  <div className="text-xs text-white/60">{item.num_courses} courses tracked</div>
                </div>
                <Sparkles className="h-4 w-4 text-[#DC143C]" />
              </button>
            ))}
          </div>
        </div>
        {loading && <div className="text-sm text-white/60">Loading real data…</div>}
        {error && <div className="text-sm text-red-300">{error}</div>}
        {selectedDept && (
          <div className="mt-6 flex items-center gap-3 rounded-full border border-[#DC143C]/30 bg-[#DC143C]/15 px-4 py-2 text-sm text-white shadow-[0_10px_40px_rgba(220,20,60,0.35)] transition-all duration-300">
            <span className="font-semibold">{selectedDept.department}</span>
            <span className="text-white/70">ready — jump in.</span>
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/20"
            >
              Begin <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
