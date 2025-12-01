'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { divisionColors, getDivision, Division } from '@/lib/divisionMapping';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Filter = 'All' | 'STEM' | 'Humanities' | 'Social Sciences';

type TooltipInfo = {
  departmentName: string;
  hours: number;
  rating: number;
  enrollment: number;
  division: Division;
  x: number;
  y: number;
};

export default function PageFour({ onNext }: { onNext: () => void }) {
  const { departments, selectedDept } = useDataContext();
  const [filter, setFilter] = useState<Filter>('All');
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseData = useMemo(() => {
    return departments
      .map((d) => ({
        ...d,
        hours: d.avg_hours * 3.5,
        rating: d.avg_rating,
        enrollment: d.total_enrollment || d.avg_enrollment || 0,
        division: getDivision(d.department),
      }))
      .filter((d) => d.hours > 0 && d.rating > 0);
  }, [departments]);

  const filteredData = useMemo(() => {
    if (filter === 'All') return baseData;
    return baseData.filter((d) => d.division === filter);
  }, [baseData, filter]);

  const maxHours = useMemo(() => d3.max(baseData, (d) => d.hours) ?? 0, [baseData]);
  const maxEnrollment = useMemo(() => d3.max(baseData, (d) => d.enrollment) ?? 0, [baseData]);

  if (!selectedDept) return null;

  const selectedHours = selectedDept.avg_hours * 3.5;
  const selectedRating = selectedDept.avg_rating;

  return (
    <section className="relative z-10 flex min-h-screen flex-col gap-8 bg-gradient-to-b from-black via-[#0f101a] to-black px-6 py-16 md:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageBadge page={4} label="Context" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="text-white/60">Filter</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15">
              {filter} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 text-white border-white/20">
              {(['All', 'STEM', 'Humanities', 'Social Sciences'] as Filter[]).map((f) => (
                <DropdownMenuItem key={f} onClick={() => setFilter(f)} className="cursor-pointer">
                  {f}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-5xl space-y-3">
        <h2 className="text-3xl font-semibold md:text-4xl">Your concentration in context</h2>
        <p className="text-white/75">Here’s how every concentration stacks up. Bigger bubbles mean more students.</p>
        <p className="text-white/80">
          Your concentration, <span className="text-white font-semibold">{selectedDept.departmentName}</span>, sits among{' '}
          {filter === 'All' ? 'all fields' : `${filter.toLowerCase()}`} at Harvard. Hover to see details; your bubble is
          labeled.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur"
        style={{ height: 520 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.1),transparent_30%)]" />

        {/* Quadrants */}
        <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 border border-white/5">
          <div className="border-b border-r border-white/5 px-2 py-1 text-xs text-white/60">The Gems</div>
          <div className="border-b border-white/5 px-2 py-1 text-right text-xs text-white/60">The Passion Projects</div>
          <div className="border-r border-white/5 px-2 py-1 text-xs text-white/60">The Breezy Majors</div>
          <div className="px-2 py-1 text-right text-xs text-white/60">The Grind Zones</div>
        </div>

        {/* Axes labels */}
        <div className="absolute left-10 top-8 text-xs uppercase tracking-wide text-white/60">Satisfaction ↑</div>
        <div className="absolute bottom-10 right-10 text-xs uppercase tracking-wide text-white/60">Hours/week →</div>

        {/* Bubbles */}
        {filteredData.map((d) => {
          const xPct = maxHours ? (d.hours / maxHours) * 100 : 0;
          const yPct = (d.rating / 5) * 100;
          const size = maxEnrollment ? Math.max(14, (d.enrollment / maxEnrollment) * 34) : 14;
          const isSelected = selectedDept && d.department === selectedDept.department;

          return (
            <div
              key={d.department}
              className="absolute transition duration-300"
              style={{
                left: `calc(${xPct}% - ${size / 2}px)`,
                bottom: `calc(${yPct}% - ${size / 2}px)`,
                width: size,
                height: size,
                borderRadius: '9999px',
                background: `radial-gradient(circle at 30% 30%, #ffffffcc, ${divisionColors[d.division]})`,
                boxShadow: isSelected
                  ? '0 0 0 3px #e4c45f, 0 0 35px rgba(228,196,95,0.6)'
                  : '0 10px 30px rgba(0,0,0,0.35)',
                opacity: isSelected ? 1 : 0.85,
              }}
              onMouseEnter={(event) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({
                  departmentName: d.departmentName,
                  hours: d.hours,
                  rating: d.rating,
                  enrollment: d.enrollment,
                  division: d.division,
                  x: event.clientX - rect.left + 12,
                  y: event.clientY - rect.top - 12,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {isSelected && (
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-white">
                  {d.department}
                </span>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute right-6 top-6 flex flex-wrap items-center gap-3 text-xs text-white/70">
          {(['Humanities', 'STEM', 'Social Sciences'] as Division[]).map((div) => (
            <span key={div} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: divisionColors[div] }} />
              {div}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-white/15 bg-black/95 px-3 py-2 text-sm text-white shadow-xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="font-semibold text-white">{tooltip.departmentName}</div>
            <div className="text-white/80">
              {tooltip.hours.toFixed(1)} hrs/wk • {tooltip.rating.toFixed(2)}/5 • {tooltip.division}
            </div>
            <div className="text-white/60">Enrollment: {Math.round(tooltip.enrollment).toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm text-white/75 max-w-5xl">
        <p>
          “Zoom out — here’s where your field fits in Harvard’s ecosystem.” Bigger bubbles mean more students — notice
          which fields draw the crowds.
        </p>
        <p>
          Your concentration, <span className="font-semibold text-white">{selectedDept.departmentName}</span>, is{' '}
          {selectedHours.toFixed(1)} hrs/week with a satisfaction of {selectedRating.toFixed(2)}/5 — look for nearby
          bubbles to find your peers.
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
