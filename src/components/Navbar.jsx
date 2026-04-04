import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicContext } from './MusicToggle'; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safe extraction in case MusicContext is not wrapping immediately in some test environments
  const musicContext = useContext(MusicContext) || { isPlaying: false, toggleMusic: () => {} };
  const { isPlaying, toggleMusic } = musicContext;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full h-[60px] md:h-[68px] lg:h-[72px] px-4 md:px-8 lg:px-16 flex justify-between items-center z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/80 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-white/5 backdrop-blur-sm border-b border-white/10'
      }`}
    >
      <Link to="/" className="font-playfair font-bold italic truncate flex-shrink-0 z-50">
        <span className="hidden sm:inline text-xl md:text-xl lg:text-xl bg-clip-text text-transparent bg-gradient-to-r from-gold to-rose drop-shadow-md">
          💍 Mani & Priya
        </span>
        <span className="sm:hidden text-lg bg-clip-text text-transparent bg-gradient-to-r from-gold to-rose drop-shadow-md">
          💍 M & P
        </span>
      </Link>
      
      <div className="hidden md:flex flex-1"></div>
      
      <div className="hidden md:flex items-center gap-4 lg:gap-5 z-50">
        <Link to="/" className="text-sm font-poppins text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <span className="text-white/20 select-none text-sm">|</span>
        <button 
          onClick={toggleMusic}
          className="bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 px-4 py-1.5 rounded-full flex items-center justify-center gap-2 group shadow-sm text-sm"
        >
          <span className="flex items-center h-full drop-shadow-md opacity-80">
            {isPlaying ? '🎶' : '🔇'}
          </span>
        </button>
      </div>

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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
            className="absolute top-[60px] left-0 w-full bg-dark/95 backdrop-blur-2xl border-b border-white/10 md:hidden flex flex-col px-6 py-2 z-40 overflow-hidden shadow-2xl"
          >
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-poppins text-white/80 hover:text-white transition-colors py-4 border-b border-white/5"
            >
              Home
            </Link>
            <div className="py-4 flex items-center justify-between">
              <span className="text-base font-poppins text-white/80">Background Music</span>
              <button 
                onClick={toggleMusic}
                className="bg-white/10 active:bg-white/20 border border-white/20 transition-all duration-300 px-5 py-2 rounded-full flex items-center justify-center gap-2"
              >
                <span className="text-base">{isPlaying ? '🎶' : '🔇'}</span>
                <span className="text-sm font-poppins text-white/90">
                  {isPlaying ? 'Playing' : 'Muted'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
