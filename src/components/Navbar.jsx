import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicContext } from './MusicToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const musicPanelRef = useRef(null);

  // Safe extraction in case MusicContext is not wrapping immediately in some test environments
  const musicContext = useContext(MusicContext) || { selectedTrack: 'off', setSelectedTrack: () => {}, TRACKS: [] };
  const { selectedTrack, setSelectedTrack, TRACKS } = musicContext;
  const isPlaying = selectedTrack !== 'off';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop music panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (musicPanelRef.current && !musicPanelRef.current.contains(e.target)) {
        setMusicPanelOpen(false);
      }
    };
    if (musicPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [musicPanelOpen]);

  const handleTrackSelect = (trackId) => {
    setSelectedTrack(trackId);
    setMusicPanelOpen(false);
    setMobileMenuOpen(false);
  };

  const currentTrackLabel = TRACKS?.find(t => t.id === selectedTrack)?.label ?? '🔇';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full h-[60px] md:h-[68px] lg:h-[72px] px-4 md:px-8 lg:px-16 flex justify-between items-center z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#2D1B1B]/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-[#1E1111]/80 backdrop-blur-sm border-b border-white/10'
      }`}
    >
      <Link to="/" className="font-playfair font-bold italic truncate flex-shrink-0 z-50">
        <span className="hidden sm:inline text-xl md:text-xl lg:text-xl bg-clip-text text-transparent bg-gradient-to-r from-gold to-rose drop-shadow-md">
          💍 Mani &amp; Priya
        </span>
        <span className="sm:hidden text-lg bg-clip-text text-transparent bg-gradient-to-r from-gold to-rose drop-shadow-md">
          💍 M &amp; P
        </span>
      </Link>

      {/* Developer Credit - Perfectly Centered */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-40 pointer-events-none sm:pointer-events-auto px-4 max-w-[30%] sm:max-w-[40%] md:max-w-[50%]">
        <span className="hidden md:block text-white/50 hover:text-white/80 transition-opacity duration-200 text-xs font-poppins cursor-default select-none whitespace-nowrap overflow-hidden text-ellipsis">
          💻 Developed by Avishek ( Mani )
        </span>
        <span className="hidden sm:block md:hidden text-white/50 hover:text-white/80 transition-opacity duration-200 text-xs font-poppins cursor-default select-none whitespace-nowrap overflow-hidden text-ellipsis">
          💻 Avishek ( Mani )
        </span>
        <span className="hidden min-[360px]:block sm:hidden text-white/40 hover:text-white/80 transition-opacity duration-200 text-[10px] font-poppins cursor-default select-none whitespace-nowrap overflow-hidden text-ellipsis">
          💻⚙️ Avishek
        </span>
      </div>

      <div className="hidden md:flex flex-1"></div>

      {/* Desktop nav items */}
      <div className="hidden md:flex items-center gap-4 lg:gap-5 z-50">
        <Link to="/" className="text-sm font-poppins text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <span className="text-white/20 select-none text-sm">|</span>

        {/* ── Desktop Music Button + Dropdown ── */}
        <div className="relative" ref={musicPanelRef}>
          <button
            id="music-panel-btn"
            onClick={() => setMusicPanelOpen(prev => !prev)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 px-4 py-1.5 rounded-full flex items-center justify-center gap-2 group shadow-sm text-sm"
            aria-label="Music options"
            aria-expanded={musicPanelOpen}
          >
            <span className="flex items-center h-full drop-shadow-md opacity-80">
              {isPlaying ? '🎵' : '🔇'}
            </span>
            {isPlaying && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-300"></span>
              </span>
            )}
          </button>

          {/* Desktop dropdown panel */}
          <AnimatePresence>
            {musicPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-2xl z-[60]"
                style={{
                  background: 'rgba(30, 17, 17, 0.97)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                role="menu"
                aria-label="Music selection"
              >
                <div className="px-4 py-2.5 border-b border-white/10">
                  <p className="text-xs font-poppins text-white/50 uppercase tracking-widest">Background Music</p>
                </div>
                <div className="py-1">
                  {TRACKS?.map(track => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackSelect(track.id)}
                      role="menuitem"
                      className={`w-full text-left px-4 py-3 text-sm font-poppins flex items-center gap-3 transition-all duration-200 ${
                        selectedTrack === track.id
                          ? 'bg-white/15 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {selectedTrack === track.id && (
                        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                          {track.src && (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-300"></span>
                            </>
                          )}
                        </span>
                      )}
                      {selectedTrack !== track.id && <span className="w-1.5 flex-shrink-0"></span>}
                      <span>{track.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile hamburger button */}
      <div className="md:hidden flex items-center z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white focus:outline-none w-10 h-10 flex items-center justify-center -mr-2"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={mobileMenuOpen ? "close" : "open"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-2xl leading-none"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
            className="absolute top-[60px] left-0 w-full bg-[#1E1111]/95 backdrop-blur-2xl border-b border-white/10 md:hidden flex flex-col px-6 py-2 z-40 overflow-hidden shadow-2xl"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-poppins text-white/80 hover:text-white transition-colors py-4 border-b border-white/5"
            >
              Home
            </Link>

            {/* ── Mobile Music Options ── */}
            <div className="py-3">
              <p className="text-xs font-poppins text-white/40 uppercase tracking-widest mb-2">Background Music</p>
              <div className="flex flex-col gap-2">
                {TRACKS?.map(track => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-poppins transition-all duration-200 border ${
                      selectedTrack === track.id
                        ? 'bg-white/15 border-white/25 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 active:bg-white/15'
                    }`}
                  >
                    <span className="flex-1">{track.label}</span>
                    {selectedTrack === track.id && track.src && (
                      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-300"></span>
                      </span>
                    )}
                    {selectedTrack === track.id && !track.src && (
                      <span className="text-white/50 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
