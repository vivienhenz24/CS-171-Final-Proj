'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDataContext } from '../dataContext';
import { PageBadge } from './common';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

type LatestSemesterData = {
  semester: string;
  avgRating: number;
  difference: number;
  year: number;
  term: string;
} | null;

export default function PageThree({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const { selectedDept, timeseries } = useDataContext();
  const [userRating, setUserRating] = useState<number | ''>('');
  const [submitted, setSubmitted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate latest semester's average rating for the department
  const latestSemesterData = useMemo(() => {
    if (!selectedDept || !timeseries.length || !submitted || userRating === '') return null;

    // Filter timeseries for selected department
    const deptData = timeseries.filter(d => d.department === selectedDept.department);
    if (!deptData.length) return null;

    // Group by semester and calculate weighted average rating
    const grouped = d3.group(deptData, d => d.semester);
    
    const aggregated = Array.from(grouped, ([semester, entries]) => {
      // Calculate weighted average rating (weighted by number of students)
      const totalRating = entries.reduce((sum, e) => sum + (e.rating * e.num_students), 0);
      const totalStudents = entries.reduce((sum, e) => sum + e.num_students, 0);
      const avgRating = totalStudents > 0 ? totalRating / totalStudents : 0;
      
      const year = entries[0]?.year || 0;
      const term = entries[0]?.term || '';
      
      // Sort order: Fall = 0, Spring = 1
      const termOrder = term === 'Fall' ? 0 : 1;
      const sortKey = year * 10 + termOrder;
      
      return {
        semester,
        avgRating,
        year,
        term,
        sortKey
      };
    });

    // Sort by year and term, get the latest
    const sorted = aggregated.sort((a, b) => b.sortKey - a.sortKey);
    const latest = sorted[0];
    
    if (!latest) return null;
    
    // Calculate difference: user rating - average rating
    const difference = typeof userRating === 'number' ? userRating - latest.avgRating : 0;
    
    return {
      semester: latest.semester,
      avgRating: latest.avgRating,
      difference,
      year: latest.year,
      term: latest.term
    };
  }, [timeseries, selectedDept, submitted, userRating]);

  // Draw the comparison chart
  useEffect(() => {
    if (!svgRef.current || !latestSemesterData || !submitted || userRating === '' || typeof userRating !== 'number') return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 50, right: 40, bottom: 70, left: 70 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data for comparison
    const barData = [
      { label: 'Your Rating', value: userRating, color: '#FFD700' },
      { label: 'Latest Semester Average', value: latestSemesterData.avgRating, color: '#DC143C' }
    ];

    // Scales
    const xScale = d3.scaleBand()
      .domain(barData.map(d => d.label))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .nice()
      .range([height, 0]);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '13px')
      .attr('font-weight', '500');

    g.select('.domain').attr('stroke', 'rgba(255,255,255,0.2)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.2)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '12px');

    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.2)');

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .text('Rating (out of 5)');

    // Bars
    g.selectAll('.bar')
      .data(barData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.value))
      .attr('fill', d => d.color)
      .attr('rx', 6)
      .attr('opacity', 0.9)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('y', yScale(d.value) - 2)
          .attr('height', height - yScale(d.value) + 2);
      })
      .on('mouseleave', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('y', yScale(d.value))
          .attr('height', height - yScale(d.value));
      });

    // Value labels on bars
    g.selectAll('.bar-label')
      .data(barData)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .attr('font-weight', '600')
      .text(d => d.value.toFixed(2));

    // Semester label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', '11px')
      .text(`Latest semester: ${latestSemesterData.semester}`);

  }, [latestSemesterData, submitted, userRating]);

  const handleSubmit = () => {
    if (typeof userRating === 'number' && userRating >= 1 && userRating <= 5) {
      setSubmitted(true);
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setUserRating('');
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 1 && num <= 5) {
        setUserRating(num);
      }
    }
  };

  if (!selectedDept) return null;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center gap-8 px-6 py-16 md:px-12 bg-gradient-to-b from-black via-[#0f101a] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />

      <div className="relative flex flex-col items-center gap-4">
        <PageBadge page={3} label="Rate your experience" />
        <div className="flex items-center gap-2 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <button onClick={onPrev} className="underline underline-offset-4 hover:text-white">
            Back
          </button>
        </div>
      </div>

      <div className="relative max-w-5xl text-center">
        <h2 className="text-3xl font-normal md:text-4xl">How satisfied are you with {selectedDept.departmentName}?</h2>
        <p className="mt-3 text-white/70">
          Rate your concentration on a scale of 1 to 5, then see how your experience compares to the latest semester average.
        </p>
      </div>

      {!submitted ? (
        <div className="relative flex flex-col items-center gap-8 max-w-md w-full">
          <div className="w-full">
            <label htmlFor="rating-input" className="block text-sm text-white/70 mb-3 text-center font-normal">
              Your rating (1-5)
            </label>
            <input
              id="rating-input"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={userRating}
              onChange={handleRatingChange}
              className="w-full px-6 py-4 rounded-xl border border-white/20 bg-white/5 text-white text-center text-3xl font-normal focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all backdrop-blur-sm"
              placeholder="Enter 1-5"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={typeof userRating !== 'number' || userRating < 1 || userRating > 5}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-3 text-sm font-normal hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-4xl overflow-visible flex justify-center">
            {latestSemesterData ? (
              <div ref={containerRef} className="relative flex justify-center">
                <svg ref={svgRef} style={{ overflow: 'visible' }} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-white/50 text-sm">
                No data available for {selectedDept.departmentName} in the latest semester.
              </div>
            )}
          </div>

          {latestSemesterData && (
            <div className="relative text-sm text-white/70 max-w-2xl text-center space-y-2">
              <p>
                Your rating of <span className="text-white font-medium">{typeof userRating === 'number' ? userRating.toFixed(1) : ''}/5</span> compares to the 
                latest semester average of <span className="text-white font-medium">{latestSemesterData.avgRating.toFixed(2)}/5</span> for{' '}
                <span className="text-[#FFD700] font-medium">{selectedDept.departmentName}</span>.
              </p>
              {latestSemesterData.difference > 0.1 && (
                <p className="text-green-400 font-medium">You&apos;re more satisfied than the latest semester average!</p>
              )}
              {latestSemesterData.difference < -0.1 && (
                <p className="text-[#DC143C] font-medium">You&apos;re less satisfied than the latest semester average.</p>
              )}
              {Math.abs(latestSemesterData.difference) <= 0.1 && (
                <p className="text-white/80 font-medium">Your rating matches the latest semester average closely.</p>
              )}
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
        </>
      )}
    </section>
  );
}

