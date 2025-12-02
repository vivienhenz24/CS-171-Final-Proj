'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

type PageTransitionProps = {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
};

export function PageTransition({ isTransitioning, onTransitionComplete }: PageTransitionProps) {
  const [pixelBlocks, setPixelBlocks] = useState<PixelBlock[]>([]);
  const blockSize = 20;

  useEffect(() => {
    if (!isTransitioning) {
      setPixelBlocks([]);
      return;
    }

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

    // Call onTransitionComplete after screen is fully covered
    const timer = setTimeout(() => {
      onTransitionComplete();
    }, (maxAnimationTime + 0.7) * 1000);

    return () => clearTimeout(timer);
  }, [isTransitioning, onTransitionComplete]);

  return (
    <AnimatePresence>
      {isTransitioning && pixelBlocks.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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
  );
}


