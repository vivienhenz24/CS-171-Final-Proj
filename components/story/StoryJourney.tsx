'use client';

import { useState } from 'react';
import { DataProvider } from './dataContext';
import { PageTransition } from './PageTransition';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageTwoPartB from './pages/PageTwoPartB';
import PageThree from './pages/PageThree';
import PageFour from './pages/PageFour';
import PageFive from './pages/PageFive';
import PageSix from './pages/PageSix';

export default function StoryJourney() {
  const [page, setPage] = useState<1 | 2 | '2b' | 3 | 4 | 5 | 6>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState<1 | 2 | '2b' | 3 | 4 | 5 | 6 | null>(null);

  const handlePageChange = (newPage: 1 | 2 | '2b' | 3 | 4 | 5 | 6) => {
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
        {page === 3 && <PageThree onBack={() => handlePageChange('2b')} onNext={() => handlePageChange(4)} />}
        {page === 4 && <PageFour onNext={() => handlePageChange(5)} />}
        {page === 5 && <PageFive onNext={() => handlePageChange(6)} />}
        {page === 6 && <PageSix onReset={() => handlePageChange(1)} />}
      </div>
      <PageTransition isTransitioning={isTransitioning} onTransitionComplete={handleTransitionComplete} />
    </DataProvider>
  );
}
