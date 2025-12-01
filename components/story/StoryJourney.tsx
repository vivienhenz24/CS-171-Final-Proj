'use client';

import { useState } from 'react';
import { DataProvider } from './dataContext';
import { PageTransition } from './PageTransition';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageTwoPartB from './pages/PageTwoPartB';
import PageFour from './pages/PageFour';
import PageFive from './pages/PageFive';
import PageSixAggregate from './pages/PageSixAggregate';
import PageSeven from './pages/PageSeven';
import PageSix from './pages/PageSix';

export default function StoryJourney() {
  const [page, setPage] = useState<1 | 2 | '2b' | 3 | 4 | 5 | 6 | 7>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState<1 | 2 | '2b' | 3 | 4 | 5 | 6 | 7 | null>(null);

  const handlePageChange = (newPage: 1 | 2 | '2b' | 3 | 4 | 5 | 6 | 7) => {
    setNextPage(newPage);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    if (nextPage !== null) {
      setPage(nextPage);
      setNextPage(null);
      setIsTransitioning(false);
    }
  };

  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {page === 1 && <PageOne onNext={() => handlePageChange(2)} />}
        {page === 2 && <PageTwo onPrev={() => handlePageChange(1)} onNext={() => handlePageChange('2b')} />}
        {page === '2b' && <PageTwoPartB onPrev={() => handlePageChange(2)} onNext={() => handlePageChange(3)} />}
        {page === 3 && <PageFour onPrev={() => handlePageChange('2b')} onNext={() => handlePageChange(4)} />}
        {page === 4 && <PageFive onPrev={() => handlePageChange(3)} onNext={() => handlePageChange(5)} />}
        {page === 5 && <PageSixAggregate onPrev={() => handlePageChange(4)} onNext={() => handlePageChange(6)} />}
        {page === 6 && <PageSeven onPrev={() => handlePageChange(5)} onNext={() => handlePageChange(7)} />}
        {page === 7 && <PageSix onReset={() => handlePageChange(1)} />}
      </div>
      <PageTransition isTransitioning={isTransitioning} onTransitionComplete={handleTransitionComplete} />
    </DataProvider>
  );
}
