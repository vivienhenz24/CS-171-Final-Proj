'use client';

import { PersonStanding, ChevronDown } from 'lucide-react';
import { useDataContext } from '../dataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PageBadge = ({ page, label }: { page: number; label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/80 font-normal">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white font-normal">{page}</span>
    <span>{label}</span>
  </div>
);

export default function PageOne({ onNext }: { onNext: () => void }) {
  const { departments, selectedDept, setSelectedDept, loading } = useDataContext();

  return (
    <section className="relative z-10 flex min-h-screen flex-col px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_40%_70%,rgba(22,163,74,0.16),transparent_26%)] blur-3xl opacity-80" />
      
      {/* Badge at top */}
      <div className="relative flex justify-center mb-8">
        <PageBadge page={1} label="Arrival" />
      </div>

      {/* Centered content */}
      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative">
          {/* Spotlight effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-64 h-64 rounded-full blur-2xl animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)'
              }}
            />
          </div>
          
          {/* Person icon with spotlight */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <PersonStanding className="h-24 w-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              {/* Additional glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/10 rounded-full blur-xl" />
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-normal text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              This is you.
            </div>
            
            {/* Dropdown menu */}
            <div className="mt-8">
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={loading}
                  className="inline-flex items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  <span>{selectedDept ? selectedDept.department : 'Select your concentration'}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="max-h-[300px] overflow-y-auto bg-black/95 border-white/20 backdrop-blur-sm"
                  align="center"
                >
                  {departments.map((dept) => (
                    <DropdownMenuItem
                      key={dept.department}
                      onClick={() => setSelectedDept(dept)}
                      className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    >
                      {dept.department}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
