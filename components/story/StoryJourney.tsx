'use client';

import { useState } from 'react';
import { DataProvider } from './dataContext';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageThree from './pages/PageThree';
import PageFour from './pages/PageFour';
import PageFive from './pages/PageFive';
import PageSix from './pages/PageSix';

export default function StoryJourney() {
  const [page, setPage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {page === 1 && <PageOne onNext={() => setPage(2)} />}
        {page === 2 && <PageTwo onPrev={() => setPage(1)} onNext={() => setPage(3)} />}
        {page === 3 && <PageThree onBack={() => setPage(2)} onNext={() => setPage(4)} />}
        {page === 4 && <PageFour onNext={() => setPage(5)} />}
        {page === 5 && <PageFive onNext={() => setPage(6)} />}
        {page === 6 && <PageSix onReset={() => setPage(1)} />}
      </div>
    </DataProvider>
  );
}
