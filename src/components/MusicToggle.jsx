import React, { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';
import { motion } from 'framer-motion';

const MusicToggle = () => {
  const { isPlaying, toggleMusic } = useContext(MusicContext);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 glass-card px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
      aria-label="Toggle background music"
    >
      <span className="text-xl">{isPlaying ? '🎶' : '🔇'}</span>
      <span className="text-xs font-poppins text-white/80 hidden sm:inline">
        {isPlaying ? 'Playing' : 'Muted'}
      </span>
    </motion.button>
  );
};

export default MusicToggle;
