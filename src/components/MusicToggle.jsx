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
      className="fixed bottom-6 right-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 px-5 py-3 rounded-full flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      <div className={`relative flex items-center justify-center w-5 h-5 transition-colors duration-300 ${isPlaying ? 'text-rose' : 'text-white/60'}`}>
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-poppins font-medium transition-colors ${isPlaying ? 'text-white' : 'text-white/60'} hidden sm:inline`}>
        {isPlaying ? 'Playing' : 'Muted'}
      </span>
    </motion.button>
  );
};

export default MusicToggle;
