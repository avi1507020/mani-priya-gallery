import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full min-h-[300px]">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity }
        }}
        className="text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose to-gold"
      >
        <svg fill="url(#grad1)" viewBox="0 0 24 24" width="1em" height="1em" className="mx-auto drop-shadow-lg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF4D8D', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>
      <p className="font-poppins text-white/80 animate-pulse text-sm">
        Loading our memories... 💕
      </p>
    </div>
  );
};

export default LoadingSpinner;
