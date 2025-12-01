'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { getSalary } from '@/lib/salaryMapping';

type TooltipData = {
  departmentName: string;
  hours: number;
  salary: number;
  x: number;
  y: number;
} | null;

export default function PageFive({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { selectedDept, departments } = useDataContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);

  // Prepare data for all departments
  const scatterData = useMemo(() => {
    return departments.map(d => ({
      department: d.department,
      departmentName: d.departmentName,
      hours: d.avg_hours * 3.5,
      salary: getSalary(d.department),
      isSelected: selectedDept && d.department === selectedDept.department,
    }));
  }, [departments, selectedDept]);

  // Calculate max values for scales
  const maxHours = useMemo(() => {
    if (!departments.length) return 0;
    return Math.max(...departments.map(d => d.avg_hours * 3.5));
  }, [departments]);

  const maxSalary = useMemo(() => {
    if (!departments.length) return 0;
    return Math.max(...departments.map(d => getSalary(d.department)));
  }, [departments]);

  useEffect(() => {
    if (!svgRef.current || !departments.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 900;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([14, maxHours * 1.05])
      .nice()
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, maxSalary * 1.05])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${(Number(d) / 1000).toFixed(0)}k`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '12px');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '12px');

    g.selectAll('.domain').attr('stroke', 'white');
    g.selectAll('.tick line').attr('stroke', 'white');

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 50)
      .attr('fill', 'white')
      .attr('font-size', '13px')
      .attr('text-anchor', 'middle')
      .text('Hours per Week');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('fill', 'white')
      .attr('font-size', '13px')
      .attr('text-anchor', 'middle')
      .text('Expected Salary');

    // Draw points
    scatterData.forEach((d) => {
      const cx = xScale(d.hours);
      const cy = yScale(d.salary);
      const r = d.isSelected ? 8 : 5;
      const opacity = d.isSelected ? 1 : 0.6;

      // Glow effect for selected
      if (d.isSelected) {
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', r + 4)
          .attr('fill', '#FFD700')
          .attr('opacity', 0.2);
      }

      // Point with hover handlers
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .attr('fill', d.isSelected ? '#FFD700' : '#DC143C')
        .attr('stroke', d.isSelected ? '#FFD700' : 'rgba(255,255,255,0.3)')
        .attr('stroke-width', d.isSelected ? 2 : 1)
        .attr('opacity', opacity)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this).attr('r', r + 2).attr('opacity', 1);
          
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltip({
              departmentName: d.departmentName,
              hours: d.hours,
              salary: d.salary,
              x: event.clientX - rect.left + 12,
              y: event.clientY - rect.top - 12,
            });
          }
        })
        .on('mouseleave', function() {
          d3.select(this).attr('r', r).attr('opacity', opacity);
          setTooltip(null);
        });

      // Label for selected point
      if (d.isSelected) {
        g.append('text')
          .attr('x', cx)
          .attr('y', cy - 15)
          .attr('fill', '#FFD700')
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .attr('text-anchor', 'middle')
          .text(d.departmentName);
      }
    });

  }, [scatterData, maxHours, maxSalary, selectedDept, departments.length]);

  if (!selectedDept) return null;

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
        <h2 className="text-3xl font-normal md:text-4xl">Was it worth it?</h2>
        <p className="mt-3 text-white/70">
          How workload relates to expected earnings across all concentrations
        </p>
      </div>

      <div ref={containerRef} className="relative w-full max-w-5xl flex justify-center overflow-x-auto">
        <svg ref={svgRef} />
        
        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg border border-white/15 bg-black/95 px-3 py-2 text-sm text-white shadow-xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="font-semibold text-white">{tooltip.departmentName}</div>
            <div className="text-white/80">
              {tooltip.hours.toFixed(1)} hrs/wk • ${(tooltip.salary / 1000).toFixed(0)}k salary
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl text-center text-sm text-white/70">
        <p>
          Each point represents a concentration. Your selection,{' '}
          <span className="text-[#FFD700]">{selectedDept.departmentName}</span>, is highlighted in gold.
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
