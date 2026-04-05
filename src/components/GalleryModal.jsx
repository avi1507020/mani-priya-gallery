import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryModal = ({ 
  isOpen, 
  onClose, 
  photos, 
  currentIndex, 
  setCurrentIndex, 
  eventName, 
  isSlideshow, 
  setIsSlideshow, 
  onDownload 
}) => {
  const [touchStart, setTouchStart] = useState(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length, setCurrentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === photos.length - 1;

  // Swipe handling
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 60) handleNext();
    if (diff < -60) handlePrev();
    setTouchStart(null);
  };

  const dotsCount = Math.min(photos.length, 12);
  const startDot = Math.max(0, Math.min(currentIndex - 5, photos.length - dotsCount));
  const visibleDots = Array.from({ length: dotsCount }, (_, i) => startDot + i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/92 backdrop-blur-2xl"
        />

        {/* Close Button - FIXED */}
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          style={{ 
            top: window.innerWidth < 768 ? '68px' : window.innerWidth < 1024 ? '72px' : '80px',
            right: window.innerWidth < 768 ? '12px' : window.innerWidth < 1024 ? '16px' : '24px'
          }}
          className="fixed z-[9999] w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-md border-[1.5px] border-white/30 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer transition-colors"
        >
          <span className="text-lg md:text-xl font-light">✕</span>
        </motion.button>

        {/* Prev Button - FIXED */}
        <motion.button 
          animate={{ opacity: isFirst ? 0 : 1 }}
          disabled={isFirst}
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[999] w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 md:bg-white/15 backdrop-blur-md border border-white/20 md:border-white/25 text-white flex items-center justify-center shadow-xl transition-all hover:bg-white/30 md:hover:translate-x-[-3px] disabled:pointer-events-none"
        >
          <span className="text-2xl md:text-3xl mb-1 mr-0.5">‹</span>
        </motion.button>

        {/* Next Button - FIXED */}
        <motion.button 
          animate={{ opacity: isLast ? 0 : 1 }}
          disabled={isLast}
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 md:bg-white/15 backdrop-blur-md border border-white/20 md:border-white/25 text-white flex items-center justify-center shadow-xl transition-all hover:bg-white/30 md:hover:translate-x-[3px] disabled:pointer-events-none"
        >
          <span className="text-2xl md:text-3xl mb-1 ml-0.5">›</span>
        </motion.button>

        {/* Image Display */}
        <div 
          className="relative z-10 w-full h-full flex flex-col items-center justify-center md:p-10 pointer-events-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex items-center justify-center pointer-events-auto"
            >
              <img 
                src={`https://drive.google.com/thumbnail?id=${currentPhoto?.id}&sz=s1600`} 
                alt="Memory" 
                className="max-w-[95vw] tablet:max-w-[85vw] desktop:max-w-[80vw] max-h-[75vh] tablet:max-h-[80vh] desktop:max-h-[85vh] object-contain rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption & Navigation (Bar FIXED at bottom) */}
        <div className="fixed bottom-0 left-0 right-0 z-[150] pb-4 md:pb-6 pt-8 md:pt-12 px-4 md:px-8 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
          {/* Dot Navigation */}
          <div className="flex justify-center gap-1.5 md:gap-2 mb-3 md:mb-4 pointer-events-auto">
            {visibleDots.map((dotIndex) => (
              <motion.div
                key={dotIndex}
                layout
                onClick={() => setCurrentIndex(dotIndex)}
                className={`cursor-pointer transition-all duration-300 ${
                  currentIndex === dotIndex 
                  ? 'bg-gold w-5 h-2 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]' 
                  : 'bg-white/25 w-2 h-2 rounded-full'
                }`}
              />
            ))}
          </div>

          <div className="text-center">
            <h4 className="font-playfair text-white text-sm md:text-base font-medium">
              ❤️ {eventName} Moment
            </h4>
            <p className="text-white/50 text-xs mt-1 font-poppins">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
          
          <div className="mt-4 flex justify-center pointer-events-auto md:hidden">
            <button 
              onClick={(e) => onDownload(e, currentPhoto)}
              className="bg-gold text-dark font-bold text-xs px-5 py-2 rounded-full shadow-lg flex items-center gap-2 active:scale-95"
            >
              <span>🔒 Unlock & Save</span>
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default GalleryModal;
