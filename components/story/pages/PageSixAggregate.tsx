'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function PageSixAggregate({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { timeseries } = useDataContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelInfo, setLabelInfo] = useState<{ x: number; y: number; hours: number } | null>(null);
  const [showLastLabel, setShowLastLabel] = useState(false);

  // Aggregate timeseries data by semester across ALL departments
  const chartData = useMemo(() => {
    if (!timeseries.length) return [];

    // Group by semester and calculate average hours across all departments
    const grouped = d3.group(timeseries, d => d.semester);
    
    const aggregated = Array.from(grouped, ([semester, entries]) => {
      // Calculate weighted average (weighted by number of students)
      const totalHours = entries.reduce((sum, e) => sum + (e.hours_per_week * e.num_students), 0);
      const totalStudents = entries.reduce((sum, e) => sum + e.num_students, 0);
      const avgHours = totalStudents > 0 ? (totalHours / totalStudents) * 3.5 : 0;
      
      const year = entries[0]?.year || 0;
      const term = entries[0]?.term || '';
      
      // Sort order: Fall = 0, Spring = 1
      const termOrder = term === 'Fall' ? 0 : 1;
      const sortKey = year * 10 + termOrder;
      
      return {
        semester,
        avgHours,
        year,
        term,
        sortKey,
        count: entries.length,
        totalStudents
      };
    });

    // Sort by year and term
    return aggregated.sort((a, b) => a.sortKey - b.sortKey);
  }, [timeseries]);

  // Draw the chart
  useEffect(() => {
    if (!svgRef.current || !chartData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scalePoint()
      .domain(chartData.map(d => d.semester))
      .range([0, width])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.avgHours) || 10])
      .nice()
      .range([height, 0]);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.select('.domain').attr('stroke', 'rgba(255,255,255,0.3)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.3)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', '12px');

    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.3)');

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text('Hours per Week');

    // Line
    const line = d3.line<typeof chartData[0]>()
      .x(d => xScale(d.semester) || 0)
      .y(d => yScale(d.avgHours))
      .curve(d3.curveMonotoneX);

    // Gradient for the line
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'aggregateLineGradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#DC143C');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff6b6b');

    // Draw the line
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#aggregateLineGradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Area under the line
    const area = d3.area<typeof chartData[0]>()
      .x(d => xScale(d.semester) || 0)
      .y0(height)
      .y1(d => yScale(d.avgHours))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#aggregateLineGradient)')
      .attr('fill-opacity', 0.1)
      .attr('d', area);

    // Data points
    g.selectAll('.dot')
      .data(chartData)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.semester) || 0)
      .attr('cy', d => yScale(d.avgHours))
      .attr('r', 6)
      .attr('fill', '#DC143C')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 10);
        
        // Show tooltip
        const tooltip = g.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(d.semester) || 0},${yScale(d.avgHours) - 20})`);

        tooltip.append('rect')
          .attr('x', -50)
          .attr('y', -30)
          .attr('width', 100)
          .attr('height', 25)
          .attr('fill', 'rgba(0,0,0,0.9)')
          .attr('rx', 4);

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -12)
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .text(`${d.avgHours.toFixed(1)} hrs/wk`);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);
        
        g.selectAll('.tooltip').remove();
      });

    // Highlight the most recent data point
    const lastDataPoint = chartData[chartData.length - 1];
    if (lastDataPoint) {
      const lastX = xScale(lastDataPoint.semester) || 0;
      const lastY = yScale(lastDataPoint.avgHours);

      // Highlight the last point with a larger circle (interactive for hover)
      g.append('circle')
        .attr('class', 'last-point')
        .attr('cx', lastX)
        .attr('cy', lastY)
        .attr('r', 10)
        .attr('fill', '#DC143C')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setShowLastLabel(true))
        .on('mouseleave', () => setShowLastLabel(false));

      // Set label position (relative to the SVG container)
      setLabelInfo({
        x: lastX + margin.left,
        y: lastY + margin.top,
        hours: lastDataPoint.avgHours
      });
    }

  }, [chartData]);

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />

      <div className="relative flex flex-col items-center gap-4">
        <PageBadge page={6} label="Everyone's workload" />
        <div className="flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
        </div>
      </div>
      
      <div className="relative max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-normal">How Harvard&apos;s workload has changed</h2>
        <p className="mt-3 text-white/70">
          Average weekly workload across all concentrations over time.
        </p>
      </div>

      <div className="relative w-full max-w-5xl overflow-visible flex justify-center">
        {chartData.length > 0 ? (
          <div ref={containerRef} className="relative" style={{ minWidth: '700px' }}>
            <svg ref={svgRef} style={{ overflow: 'visible' }} />
            {/* Overlay label for most recent data point - shows on hover */}
            {labelInfo && showLastLabel && (
              <div
                className="absolute pointer-events-none z-10 transition-opacity duration-200"
                style={{
                  left: labelInfo.x,
                  top: labelInfo.y - 70,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="relative">
                  <div className="bg-[#DC143C] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                    Average workload: {labelInfo.hours.toFixed(1)} hrs/wk last semester
                  </div>
                  {/* Arrow pointing down */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0 h-0 -bottom-2"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '10px solid #DC143C',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-white/50">
            No time series data available.
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="relative text-sm text-white/70 max-w-3xl text-center">
          <p>
            This represents the weighted average workload across all Harvard concentrations, showing how student workload has evolved over time.
          </p>
        </div>
      )}

      <div className="relative flex flex-col gap-4 text-sm text-white/75 max-w-3xl text-center">
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-normal hover:bg-white/20 mx-auto"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}


