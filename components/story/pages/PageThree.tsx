'use client';

import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { divisionColors, getDivision, Division } from '@/lib/divisionMapping';

type TooltipInfo = {
  departmentName: string;
  hours: number;
  rating: number;
  division: Division;
  enrollment: number;
  x: number;
  y: number;
};

export default function PageThree({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { departments, courses, selectedDept, setSelectedDept } = useDataContext();
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [focusDept, setFocusDept] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
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

  const maxHours = useMemo(() => d3.max(chartData, (d) => d.hours) ?? 0, [chartData]);
  const maxEnrollment = useMemo(() => d3.max(chartData, (d) => d.enrollment) ?? 0, [chartData]);

  const width = 900;
  const height = 500;
  const margin = { top: 30, right: 30, bottom: 60, left: 70 };
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

  const selectedRating = selectedDept ? selectedDept.avg_rating : 0;
  const selectedHours = selectedDept ? selectedDept.avg_hours * 3.5 : 0;

  // Calculate median satisfaction and hours for comparison
  const medianRating = useMemo(() => {
    const ratings = chartData.map(d => d.rating).sort((a, b) => a - b);
    const mid = Math.floor(ratings.length / 2);
    return ratings.length % 2 === 0 ? (ratings[mid - 1] + ratings[mid]) / 2 : ratings[mid];
  }, [chartData]);

  const medianHours = useMemo(() => {
    const hours = chartData.map(d => d.hours).sort((a, b) => a - b);
    const mid = Math.floor(hours.length / 2);
    return hours.length % 2 === 0 ? (hours[mid - 1] + hours[mid]) / 2 : hours[mid];
  }, [chartData]);

  // Generate dynamic sentence based on comparison
  const satisfactionMessage = useMemo(() => {
    if (!selectedDept) return '';
    
    const ratingDiff = selectedRating - medianRating;
    const hoursDiff = selectedHours - medianHours;
    const deptName = selectedDept.departmentName;
    
    // High satisfaction, low hours (best case)
    if (ratingDiff > 0.1 && hoursDiff < -2) {
      return `For the amount of work you put in to major in ${deptName}, you are very satisfied compared to others.`;
    }
    // High satisfaction, high hours (hard work pays off)
    if (ratingDiff > 0.1 && hoursDiff > 2) {
      return `Despite the heavy workload in ${deptName}, you are quite satisfied compared to others.`;
    }
    // High satisfaction, average hours
    if (ratingDiff > 0.1) {
      return `For the amount of work you put in to major in ${deptName}, you are pretty satisfied compared to others.`;
    }
    // Low satisfaction, high hours (worst case)
    if (ratingDiff < -0.1 && hoursDiff > 2) {
      return `For the amount of work you put in to major in ${deptName}, you are less satisfied compared to others.`;
    }
    // Low satisfaction, low hours
    if (ratingDiff < -0.1 && hoursDiff < -2) {
      return `Even with a lighter workload in ${deptName}, you are somewhat less satisfied compared to others.`;
    }
    // Low satisfaction, average hours
    if (ratingDiff < -0.1) {
      return `For the amount of work you put in to major in ${deptName}, you are less satisfied compared to others.`;
    }
    // Average satisfaction, high hours
    if (hoursDiff > 2) {
      return `Despite the heavy workload in ${deptName}, your satisfaction is about average compared to others.`;
    }
    // Average satisfaction, low hours
    if (hoursDiff < -2) {
      return `With a lighter workload in ${deptName}, your satisfaction is about average compared to others.`;
    }
    // Default: average satisfaction, average hours
    return `For the amount of work you put in to major in ${deptName}, your satisfaction is about average compared to others.`;
  }, [selectedDept, selectedRating, selectedHours, medianRating, medianHours]);

  const focusedDept = focusDept ? chartData.find((d) => d.department === focusDept) : null;
  const topEnrolledCourses = useMemo(() => {
    if (!focusedDept) return [];
    return courses
      .filter((c) => c.department === focusedDept.department)
      .sort((a, b) => b.num_students - a.num_students || b.rating - a.rating)
      .slice(0, 3);
  }, [courses, focusedDept]);

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-black via-[#0f101a] to-black px-6 py-16 md:px-12">
      <div className="flex flex-col items-center gap-4">
        <PageBadge page={3} label="How satisfied you are" />
        <div className="flex items-center gap-3 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onBack} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">Satisfaction vs. Effort</h2>
        <p className="mt-3 text-white/70">
          {satisfactionMessage}
        </p>
      </div>

      <div
        ref={chartRef}
        className="relative overflow-hidden p-4"
      >
        <svg width={width} height={height}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Axes lines */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={innerHeight}
              stroke="white"
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={innerHeight}
              x2={innerWidth}
              y2={innerHeight}
              stroke="white"
              strokeWidth={1}
            />

            {/* Axes labels */}
            <text x={-margin.left + 10} y={-10} fill="white" fontSize={12}>
              Satisfaction ↑
            </text>
            <text
              x={innerWidth}
              y={innerHeight + 45}
              fill="white"
              fontSize={12}
              textAnchor="end"
            >
              Hours per week →
            </text>

            {/* Axes ticks */}
            {yScale.ticks(6).map((t) => (
              <text key={`ytick-${t}`} x={-12} y={yScale(t) + 4} fill="white" fontSize={11} textAnchor="end">
                {t.toFixed(1)}
              </text>
            ))}
            {xScale.ticks(6).map((t) => (
              <text
                key={`xtick-${t}`}
                x={xScale(t)}
                y={innerHeight + 20}
                fill="white"
                fontSize={11}
                textAnchor="middle"
              >
                {t.toFixed(0)}
              </text>
            ))}

            {/* Points */}
            {chartData.map((d) => {
              const cx = xScale(d.hours);
              const cy = yScale(d.rating);
              const r = maxEnrollment ? Math.max(8, (d.enrollment / maxEnrollment) * 20) : 10;
              const isSelected = selectedDept && d.department === selectedDept.department;
              return (
                <g
                  key={d.department}
                  onMouseEnter={(event) => {
                    const rect = chartRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setTooltip({
                      departmentName: d.departmentName,
                      hours: d.hours,
                      rating: d.rating,
                      division: d.division,
                      enrollment: d.enrollment,
                      x: event.clientX - rect.left + 12,
                      y: event.clientY - rect.top - 12,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => {
                    setSelectedDept(d);
                    setFocusDept(d.department);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 8}
                      fill={divisionColors[d.division]}
                      opacity={0.18}
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={divisionColors[d.division]}
                    stroke={isSelected ? '#FFD700' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={isSelected ? 3 : 1}
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 14px rgba(255,215,0,0.5))' : 'none',
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>


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

      {/* Micro modal */}
      {focusedDept && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0e0f1a] p-6 shadow-2xl">
            <button
              onClick={() => setFocusDept(null)}
              className="absolute right-4 top-4 rounded-full border border-white/15 p-1 text-white/70 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: divisionColors[focusedDept.division] }}
              />
              <h3 className="text-xl font-semibold text-white">{focusedDept.departmentName}</h3>
            </div>
            <p className="mt-2 text-sm text-white/75">
              {focusedDept.department} averages {focusedDept.hours.toFixed(1)} hrs/week with a {focusedDept.rating.toFixed(2)}/5
              {' '}Q score. Enrollment: {Math.round(focusedDept.enrollment).toLocaleString()}.
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Top 3 most-enrolled courses</div>
              {topEnrolledCourses.length > 0 ? (
                <ul className="space-y-2 text-sm text-white/80">
                  {topEnrolledCourses.map((c) => (
                    <li key={c.fas_id} className="flex justify-between gap-3">
                      <div>
                        <span className="font-semibold text-white">{c.course_code}</span>{' '}
                        <span className="text-white/60">· {c.course_title}</span>
                      </div>
                      <div className="text-white/70">
                        {c.rating.toFixed(2)}/5 • {c.hours_per_week.toFixed(1)} hrs • {c.num_students} students
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60">No course data available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
