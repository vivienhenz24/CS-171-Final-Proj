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

  const width = 900;
  const height = 520;
  const margin = { top: 60, right: 30, bottom: 60, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () => d3.scaleLinear().domain([14, maxHours ? maxHours * 1.05 : 50]).range([0, innerWidth]).nice(),
    [maxHours, innerWidth]
  );
  const yScale = useMemo(
    () => d3.scaleLinear().domain([3.8, 4.8]).range([innerHeight, 0]).nice(),
    [innerHeight]
  );

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-black via-[#0f101a] to-black px-6 py-16 md:px-12">
      <div className="flex flex-col items-center gap-4">
        <PageBadge page={3} label="Context" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="text-white/60">Filter</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
              {filter} <ChevronDown className="h-4 w-4 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 text-white border-white/20 backdrop-blur-sm">
              {(['All', 'STEM', 'Humanities', 'Social Sciences'] as Filter[]).map((f) => (
                <DropdownMenuItem 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className="text-white hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white cursor-pointer"
                >
                  {f}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">Your concentration in context</h2>
        <p className="mt-3 text-white/70">
          Here&apos;s how every concentration stacks up. Bigger bubbles mean more students.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ width, height }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.1),transparent_30%)]" />

        {/* Quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border border-white/20" style={{ padding: '60px 70px 60px 70px' }}>
          <div className="border-b border-r border-white/20 px-2 py-1 text-xs text-white/60">The Gems</div>
          <div className="border-b border-white/20 px-2 py-1 text-right text-xs text-white/60">The Passion Projects</div>
          <div className="border-r border-white/20 px-2 py-1 text-xs text-white/60">The Breezy Majors</div>
          <div className="px-2 py-1 text-right text-xs text-white/60">The Grind Zones</div>
        </div>

        {/* Axes labels */}
        <div className="absolute left-4 top-8 text-xs text-white">Satisfaction ↑</div>
        <div className="absolute bottom-4 right-4 text-xs text-white">Hours/week →</div>

        {/* Bubbles */}
        {filteredData.map((d) => {
          const cx = xScale(d.hours);
          const cy = yScale(d.rating);
          const size = maxEnrollment ? Math.max(14, (d.enrollment / maxEnrollment) * 34) : 14;
          const isSelected = selectedDept && d.department === selectedDept.department;

          return (
            <div
              key={d.department}
              className="absolute transition duration-300 cursor-pointer"
              style={{
                left: `${margin.left + cx - size / 2}px`,
                top: `${margin.top + cy - size / 2}px`,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: divisionColors[d.division],
                boxShadow: isSelected
                  ? '0 0 0 3px #FFD700, 0 0 20px rgba(255,215,0,0.5)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
                opacity: isSelected ? 1 : 0.7,
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
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/90 px-3 py-1 text-xs font-medium text-white">
                  {d.departmentName}
                </span>
              )}
            </div>
          );
        })}


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
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70">
        {(['Humanities', 'STEM', 'Social Sciences'] as Division[]).map((div) => (
          <span key={div} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: divisionColors[div] }} />
            {div}
          </span>
        ))}
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#FFD700]" />
          Your concentration
        </span>
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
