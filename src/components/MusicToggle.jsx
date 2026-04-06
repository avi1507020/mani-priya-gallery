import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('musicPlaying');
    return saved === null ? true : saved === 'true';
  });
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef(null);
  const playTriggered = useRef(false);

  useEffect(() => {
    localStorage.setItem('musicPlaying', isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current = new Audio('/bg.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0; 

    const handleCanPlay = () => setIsAudioLoaded(true);
    audioRef.current.addEventListener('canplaythrough', handleCanPlay);

    // Support for browsers that block autoplay
    const handleFirstInteraction = () => {
      if (isPlaying && !playTriggered.current && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            playTriggered.current = true;
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
          })
          .catch(e => console.log('Final autoplay block:', e));
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            playTriggered.current = true;
            let vol = audioRef.current.volume;
            const fadeIn = setInterval(() => {
              vol += 0.05;
              if (vol >= 0.4) {
                vol = 0.4;
                clearInterval(fadeIn);
              }
              audioRef.current.volume = vol;
            }, 50);
          })
          .catch(e => {
            console.log('Autoplay deferred for interaction', e);
          });
      }
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
      }, 50);
    }
  }, [isPlaying]);

  const toggleMusic = () => setIsPlaying(prev => !prev);

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full px-4 py-2.5 text-xs flex items-center justify-center gap-2.5 transition-all duration-300 font-poppins shadow-lg"
      style={{
        backgroundColor: isPlaying ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isPlaying ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isPlaying ? '0 0 20px rgba(255, 215, 0, 0.2)' : '0 4px 12px rgba(0,0,0,0.2)',
        color: 'white',
      }}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">
          {isPlaying ? '🎶' : '🔇'}
        </span>
        <span className="font-medium tracking-wide">
          {isPlaying ? 'Playing' : 'Muted'}
        </span>
      </div>
      
      {isPlaying && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
      )}
    </motion.button>
  );
};

export default MusicToggle;
