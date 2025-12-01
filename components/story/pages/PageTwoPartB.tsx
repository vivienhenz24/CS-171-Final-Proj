'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getDivision, divisionColors, Division } from '@/lib/divisionMapping';

type TooltipData = {
  departmentName: string;
  department: string;
  avgHours: number;
  division: Division;
  numCourses: number;
  x: number;
  y: number;
} | null;

export default function PageTwoPartB({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { selectedDept, departments } = useDataContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);

  // Prepare chart data sorted by avg_hours descending (multiplied by 3.5)
  const chartData = useMemo(() => {
    return [...departments]
      .map(d => ({
        ...d,
        avg_hours: d.avg_hours * 3.5,
        division: getDivision(d.department)
      }))
      .sort((a, b) => b.avg_hours - a.avg_hours);
  }, [departments]);

  // Draw the chart
  useEffect(() => {
    if (!svgRef.current || !chartData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 40, bottom: 40, left: 180 };
    const barHeight = 24;
    const barGap = 4;
    const width = 800 - margin.left - margin.right;
    const height = chartData.length * (barHeight + barGap) + margin.top + margin.bottom;

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.avg_hours) || 20])
      .nice()
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(chartData.map(d => d.departmentName))
      .range([0, chartData.length * (barHeight + barGap)])
      .padding(0.15);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(xScale.ticks(5))
      .join('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', chartData.length * (barHeight + barGap))
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-dasharray', '4,4');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${chartData.length * (barHeight + barGap)})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', '12px');

    g.select('.domain').attr('stroke', 'rgba(255,255,255,0.3)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.3)');

    // X axis label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', chartData.length * (barHeight + barGap) + 35)
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .text('Hours per Week');

    // Y axis (department names)
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', d => {
        if (selectedDept && d === selectedDept.departmentName) {
          return '#FFD700'; // Gold for selected
        }
        return 'rgba(255,255,255,0.7)';
      })
      .attr('font-size', '11px')
      .attr('font-weight', d => (selectedDept && d === selectedDept.departmentName) ? '600' : '400');

    g.select('.domain').attr('stroke', 'rgba(255,255,255,0.3)');
    g.selectAll('.tick line').remove();

    // Bars
    g.selectAll('.bar')
      .data(chartData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.departmentName) || 0)
      .attr('width', d => xScale(d.avg_hours))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => {
        if (selectedDept && d.department === selectedDept.department) {
          return '#FFD700'; // Gold for selected concentration
        }
        return divisionColors[d.division];
      })
      .attr('opacity', d => {
        if (selectedDept && d.department === selectedDept.department) {
          return 1;
        }
        return 0.7;
      })
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        const rect = (event.target as SVGRectElement).getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          setTooltip({
            departmentName: d.departmentName,
            department: d.department,
            avgHours: d.avg_hours,
            division: d.division,
            numCourses: d.num_courses,
            x: rect.right - containerRect.left + 10,
            y: rect.top - containerRect.top + rect.height / 2
          });
        }
      })
      .on('mouseleave', function(event, d) {
        if (!(selectedDept && d.department === selectedDept.department)) {
          d3.select(this).attr('opacity', 0.7);
        }
        setTooltip(null);
      });

    // Add hours label at end of each bar
    g.selectAll('.bar-label')
      .data(chartData)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.avg_hours) + 5)
      .attr('y', d => (yScale(d.departmentName) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', d => {
        if (selectedDept && d.department === selectedDept.department) {
          return '#FFD700';
        }
        return 'rgba(255,255,255,0.5)';
      })
      .attr('font-size', '10px')
      .text(d => d.avg_hours.toFixed(1));

  }, [chartData, selectedDept]);

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12">
      <div className="flex flex-col items-center gap-4">
        <PageBadge page={2} label="Compare with everyone" />
        <div className="flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Back to your workload
          </button>
        </div>
      </div>
      
      <div className="max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-normal">How do you compare with everyone?</h2>
        <p className="mt-3 text-white/70">
          See how <span className="text-[#FFD700] font-medium">{selectedDept.departmentName}</span> stacks up against all other concentrations.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: divisionColors['Humanities'] }} />
          <span className="text-white/70">Humanities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: divisionColors['STEM'] }} />
          <span className="text-white/70">STEM</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: divisionColors['Social Sciences'] }} />
          <span className="text-white/70">Social Sciences</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFD700' }} />
          <span className="text-white/70">Your concentration</span>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full max-w-5xl overflow-x-auto">
        {chartData.length > 0 ? (
          <>
            <svg ref={svgRef} style={{ minWidth: '700px' }} />
            
            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: 'translateY(-50%)',
                }}
              >
                <div className="bg-black/95 border border-white/20 rounded-lg px-4 py-3 shadow-xl max-w-xs">
                  <div className="font-medium text-white mb-2">{tooltip.departmentName}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-white/60">Division:</span>
                      <span style={{ color: divisionColors[tooltip.division] }}>{tooltip.division}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/60">Avg Hours/Week:</span>
                      <span className="text-white">{tooltip.avgHours.toFixed(1)} hrs</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/60">Number of Courses:</span>
                      <span className="text-white">{tooltip.numCourses}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-white/50">
            No data available.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 text-sm text-white/75 max-w-3xl text-center">
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20 mx-auto"
        >
          Next: Course Satisfaction <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

