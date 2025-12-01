'use client';

// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PixelBlast from '@/components/PixelBlast';
import TopBar from '@/components/TopBar';

type PixelBlock = {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  startRotation: number;
  delay: number;
  duration: number;
  color: string;
};

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pixelBlocks, setPixelBlocks] = useState<PixelBlock[]>([]);

  const blockSize = 20; // Smaller pixels

  const handleBeginJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;

    setIsTransitioning(true);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create pixel grid
    const cols = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);

    // Color palette - mostly dark to cover the page
    const colors = [
      '#000000',
      '#000000',
      '#000000',
      '#0a0a0a',
      '#0a0a0a',
      '#111111',
      '#DC143C',
      '#1a0a0a',
    ];

    const blocks: PixelBlock[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate distance from center for staggered animation
        const centerX = cols / 2;
        const centerY = rows / 2;
        const distFromCenter = Math.sqrt(
          Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
        );
        const maxDist = Math.sqrt(
          Math.pow(centerX, 2) + Math.pow(centerY, 2)
        );
        
        // Delay based on distance from center (outer pixels arrive first)
        const normalizedDist = distFromCenter / maxDist;
        const delay = (1 - normalizedDist) * 0.5 + Math.random() * 0.1;

        blocks.push({
          id: row * cols + col,
          x: col * blockSize,
          y: row * blockSize,
          // Start from random positions off screen
          startX: (Math.random() - 0.5) * width * 2.5,
          startY: (Math.random() - 0.5) * height * 2.5,
          startRotation: (Math.random() - 0.5) * 720,
          delay,
          duration: 0.4 + Math.random() * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    setPixelBlocks(blocks);

    // Calculate when all pixels have finished animating
    const maxAnimationTime = Math.max(
      ...blocks.map((b) => b.delay + b.duration)
    );

    // Navigate after screen is fully covered (add buffer for effect)
    setTimeout(() => {
      router.push('/story');
    }, (maxAnimationTime + 0.7) * 1000);
  };

  return (
    <>
      <main className="flex flex-col min-h-screen bg-black text-white">
        <TopBar />
        <section className="flex flex-col w-full items-center justify-center px-6 min-h-[600px] py-16">
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <PixelBlast
              variant="square"
              pixelSize={6}
              color="#DC143C"
              patternScale={3}
              patternDensity={2.1}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              {/* Subtle dark backdrop for text area */}
              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/40" />

              <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-5xl font-normal md:text-6xl max-w-3xl px-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center">
                  The Harvard Concentration Compass
                </h1>
                <p className="mt-6 text-lg font-normal text-white max-w-2xl px-6 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-center">
                  Exploring the data behind every concentration - from workload
                  to well-being.
                </p>
              </div>
            </div>
            {/* Bottom banner with names */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-4 pointer-events-none translate-y-18">
              <div className="flex items-center justify-center gap-6 text-white text-sm font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span>Kirthi Chigurupati</span>
                <span>Yasmine Moussa</span>
                <span>Said El Kadi</span>
                <span>Vivien Henz</span>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-12 mb-16 flex flex-col items-center justify-center">
          <button
            onClick={handleBeginJourney}
            disabled={isTransitioning}
            className="text-white text-lg font-normal underline underline-offset-4 hover:text-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Begin your data journey
          </button>
        </div>
      </main>

      {/* Pixel glitch overlay - pixels converge to cover the screen */}
      <AnimatePresence>
        {isTransitioning && pixelBlocks.length > 0 && (
          <motion.div
            className="fixed inset-0 z-9999 overflow-hidden pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {pixelBlocks.map((block) => (
              <motion.div
                key={block.id}
                className="absolute"
                style={{
                  width: blockSize,
                  height: blockSize,
                  left: block.x,
                  top: block.y,
                  backgroundColor: block.color,
                  willChange: 'transform',
                }}
                initial={{
                  x: block.startX,
                  y: block.startY,
                  rotate: block.startRotation,
                  scale: 0.5,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  duration: block.duration,
                  delay: block.delay,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
