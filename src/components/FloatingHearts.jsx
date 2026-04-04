import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingHearts = () => {
  const hearts = useMemo(() => {
    const colors = ['text-[#FF4D8D]', 'text-[#FFD700]', 'text-[#C8A2C8]'];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * (40 - 16) + 16,
      left: Math.random() * 100, // percentage vw
      duration: Math.random() * (12 - 4) + 4,
      delay: Math.random() * 8,
      colorClass: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * (0.6 - 0.3) + 0.3
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: heart.opacity }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear"
          }}
          className={`absolute ${heart.colorClass}`}
          style={{ left: `${heart.left}vw`, fontSize: `${heart.size}px` }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
