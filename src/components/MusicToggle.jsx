import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(() => {
    return localStorage.getItem('musicPlaying') === 'true';
  });
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('musicPlaying', isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current = new Audio('/bg.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0; 
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.5) {
          vol = 0.5;
          clearInterval(fadeIn);
        }
        audioRef.current.volume = vol;
      }, 100);
    } else {
      let vol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          vol = 0;
          clearInterval(fadeOut);
          audioRef.current.pause();
        } else {
          audioRef.current.volume = vol;
        }
      }, 100);
    }
  }, [isPlaying]);

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic: () => setIsPlaying(!isPlaying) }}>
      {children}
    </MusicContext.Provider>
  );
};

const MusicToggle = () => {
  const { isPlaying, toggleMusic } = useContext(MusicContext);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMusic}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full px-4 py-2 text-xs flex items-center justify-center gap-2 transition-all duration-300 font-poppins"
      style={{
        backgroundColor: isPlaying ? 'rgba(255,215,0,0.15)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: isPlaying ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: isPlaying ? '0 0 12px rgba(255,215,0,0.25)' : 'none',
        color: isPlaying ? 'white' : 'rgba(255,255,255,0.7)',
      }}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      <span>{isPlaying ? '🎶' : '🔇'}</span>
      <span>{isPlaying ? 'Playing' : 'Muted'}</span>
    </motion.button>
  );
};

export default MusicToggle;
