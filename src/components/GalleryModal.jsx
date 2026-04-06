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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState(null);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
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

  // Reset zoom on index change
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === photos.length - 1;

  // Swipe & Pinch handling
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientX);
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setLastPinchDistance(distance);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && lastPinchDistance) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = distance / lastPinchDistance;
      setZoomLevel(prev => Math.min(Math.max(prev * delta, 1), 5));
      setLastPinchDistance(distance);
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length === 0) {
      if (touchStart && zoomLevel === 1) {
        const diff = touchStart - e.changedTouches[0].clientX;
        if (diff > 60) handleNext();
        if (diff < -60) handlePrev();
      }
      setTouchStart(null);
      setLastPinchDistance(null);
    }
  };

  // Wheel zoom handling
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(prev + 0.2, 5));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.2, 1));
    }
  };

  const toggleZoom = () => {
    setZoomLevel(prev => prev > 1 ? 1 : 2.5);
  };

  const dotsCount = Math.min(photos.length, 12);
  const startDot = Math.max(0, Math.min(currentIndex - 5, photos.length - dotsCount));
  const visibleDots = Array.from({ length: dotsCount }, (_, i) => startDot + i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
        {/* Backdrop - Click outside disabled as per request */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/92 backdrop-blur-2xl"
        />

        {/* Close Button - More robust positioning */}
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          className="fixed z-[9999] top-[68px] right-[12px] md:top-20 md:right-8 lg:top-24 lg:right-12 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 backdrop-blur-md border-[1.5px] border-white/30 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer transition-colors"
        >
          <span className="text-lg md:text-xl font-light">✕</span>
        </motion.button>

        {/* Prev Button */}
        <motion.button 
          animate={{ opacity: (isFirst || zoomLevel > 1) ? 0 : 1 }}
          disabled={isFirst || zoomLevel > 1}
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[999] w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 md:bg-white/15 backdrop-blur-md border border-white/20 md:border-white/25 text-white flex items-center justify-center shadow-xl transition-all hover:bg-white/30 md:hover:translate-x-[-3px] disabled:pointer-events-none"
        >
          <span className="text-2xl md:text-3xl mb-1 mr-0.5">‹</span>
        </motion.button>

        {/* Next Button */}
        <motion.button 
          animate={{ opacity: (isLast || zoomLevel > 1) ? 0 : 1 }}
          disabled={isLast || zoomLevel > 1}
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 md:bg-white/15 backdrop-blur-md border border-white/20 md:border-white/25 text-white flex items-center justify-center shadow-xl transition-all hover:bg-white/30 md:hover:translate-x-[3px] disabled:pointer-events-none"
        >
          <span className="text-2xl md:text-3xl mb-1 ml-0.5">›</span>
        </motion.button>

        {/* Image Display */}
        <div 
          className="relative z-10 w-full h-full flex flex-col items-center justify-center md:p-10"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={handleWheel}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ 
                scale: zoomLevel, 
                opacity: 1,
              }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ 
                scale: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2 }
              }}
              onDoubleClick={toggleZoom}
              drag={zoomLevel > 1}
              dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
              dragElastic={0.1}
              className={`relative flex items-center justify-center cursor-${zoomLevel > 1 ? 'grab' : 'zoom-in'} active:cursor-grabbing`}
            >
              <img 
                src={`https://drive.google.com/thumbnail?id=${currentPhoto?.id}&sz=s1600`} 
                alt="Memory" 
                className="max-w-[95vw] tablet:max-w-[85vw] desktop:max-w-[80vw] max-h-[75vh] tablet:max-h-[80vh] desktop:max-h-[85vh] object-contain rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption & Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 z-[150] pb-4 md:pb-6 pt-8 md:pt-12 px-4 md:px-8 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${zoomLevel > 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
