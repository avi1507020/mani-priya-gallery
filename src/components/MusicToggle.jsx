import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// ─── Music tracks ────────────────────────────────────────────────────────────
export const TRACKS = [
  { id: 'mani',  label: "🎷 Mani's Favorite",  src: '/music/mani-favorite.mp3' },
  { id: 'priya', label: "🎵 Priya's Favorite", src: '/music/priya-favorite.mp3' },
  { id: 'off',   label: '🔇 Off',               src: null },
];

// ─── Context ─────────────────────────────────────────────────────────────────
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  // Default: music OFF
  const [selectedTrack, setSelectedTrack] = useState('off');

  const bgAudioRef   = useRef(null);   // looping background track
  const welcomeRef   = useRef(null);   // one-time welcome tune
  const welcomePlayed = useRef(false); // guard: play welcome only once

  // ── One-time welcome tune on first user interaction ─────────────────────
  useEffect(() => {
    welcomeRef.current = new Audio('/music/welcome.mp3');
    welcomeRef.current.loop   = false;
    welcomeRef.current.volume = 0.5;

    const playWelcome = () => {
      if (welcomePlayed.current) return;
      welcomePlayed.current = true;
      welcomeRef.current
        .play()
        .catch(() => {}); // silently ignore if still blocked
      // Remove listeners once fired
      document.removeEventListener('click',      playWelcome);
      document.removeEventListener('touchstart', playWelcome);
      document.removeEventListener('keydown',    playWelcome);
    };

    // Try immediate autoplay first
    welcomeRef.current
      .play()
      .then(() => {
        welcomePlayed.current = true;
      })
      .catch(() => {
        // Browser blocked autoplay – defer to first interaction
        document.addEventListener('click',      playWelcome);
        document.addEventListener('touchstart', playWelcome);
        document.addEventListener('keydown',    playWelcome);
      });

    return () => {
      document.removeEventListener('click',      playWelcome);
      document.removeEventListener('touchstart', playWelcome);
      document.removeEventListener('keydown',    playWelcome);
      if (welcomeRef.current) {
        welcomeRef.current.pause();
        welcomeRef.current.src = '';
      }
    };
  }, []); // runs once on mount (page load)

  // ── Background looping track ─────────────────────────────────────────────
  useEffect(() => {
    // Stop previous track
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = '';
      bgAudioRef.current = null;
    }

    const track = TRACKS.find(t => t.id === selectedTrack);
    if (!track || !track.src) return; // "off" selected

    const audio = new Audio(track.src);
    audio.loop   = true;
    audio.volume = 0.4;
    bgAudioRef.current = audio;

    audio.play().catch(() => {
      // If blocked, play on first interaction
      const tryPlay = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click',      tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      };
      document.addEventListener('click',      tryPlay);
      document.addEventListener('touchstart', tryPlay);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [selectedTrack]);

  // ── Video interaction helpers ────────────────────────────────────────────
  // Pause bg music for video playback (does NOT change selectedTrack)
  const pauseForVideo = () => {
    if (bgAudioRef.current && !bgAudioRef.current.paused) {
      bgAudioRef.current.pause();
    }
  };

  // Resume bg music after video stops (only if a track was selected)
  const resumeAfterVideo = () => {
    if (bgAudioRef.current && selectedTrack !== 'off') {
      bgAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <MusicContext.Provider value={{ selectedTrack, setSelectedTrack, TRACKS, pauseForVideo, resumeAfterVideo }}>
      {children}
    </MusicContext.Provider>
  );
};

// ─── MusicToggle (standalone floating button – kept for backward compat) ────
// Not actively used since Navbar manages the dropdown, but exported for safety.
const MusicToggle = () => {
  const { selectedTrack } = useContext(MusicContext);
  const isPlaying = selectedTrack !== 'off';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full px-4 py-2.5 text-xs flex items-center justify-center gap-2.5 transition-all duration-300 font-poppins shadow-lg"
      style={{
        backgroundColor: isPlaying ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: isPlaying ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isPlaying ? '0 0 20px rgba(255, 215, 0, 0.2)' : '0 4px 12px rgba(0,0,0,0.2)',
        color: 'white',
      }}
      aria-label={isPlaying ? 'Music playing' : 'Music off'}
    >
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{isPlaying ? '🎵' : '🔇'}</span>
        <span className="font-medium tracking-wide">{isPlaying ? 'Playing' : 'Muted'}</span>
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
