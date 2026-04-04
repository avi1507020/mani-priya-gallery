import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryModal = ({ isOpen, onClose, photos, currentIndex, setCurrentIndex, eventName, eventDate, isSlideshow, setIsSlideshow }) => {
  if (!isOpen || photos.length === 0) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, setCurrentIndex, onClose]);

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          ></motion.div>
          
          <button 
            onClick={onClose} 
            className="fixed top-4 right-4 md:top-8 md:right-8 z-[110] text-white bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-all duration-300 shadow-xl border border-white/20"
            aria-label="Close"
          >✕</button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl"
          >

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length); }}
              className="absolute left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white text-4xl p-2"
              aria-label="Previous"
            >‹</button>

            <div className="protect-image-wrapper relative flex justify-center items-center h-auto max-h-[80vh] w-full">
              <img 
                src={currentPhoto?.thumbnailUrl?.replace(/=w\d+/, '=w1600') || currentPhoto?.thumbnailUrl} 
                alt="Memory" 
                className="max-w-[95vw] max-h-[80vh] md:max-h-[85vh] object-contain rounded-2xl pointer-events-none shadow-2xl"
                loading="lazy"
              />
              <div className="image-overlay rounded-2xl"></div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % photos.length); }}
              className="absolute right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white text-4xl p-2"
              aria-label="Next"
            >›</button>

            <div className="absolute bottom-[-30px] text-center w-full">
              <p className="font-poppins text-white/80 text-sm drop-shadow-md">
                ❤️ {eventName} Moment {eventDate ? `– ${eventDate}` : ''}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
