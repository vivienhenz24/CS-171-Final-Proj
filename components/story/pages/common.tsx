import React from 'react';

export const PageBadge = ({ page, label }: { page: number; label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white font-semibold">{page}</span>
    <span>{label}</span>
  </div>
);
