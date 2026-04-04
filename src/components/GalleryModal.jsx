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
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl max-h-[90vh]"
            onMouseEnter={() => isSlideshow && setIsSlideshow(false)}
          >
            <button 
              onClick={onClose} 
              className="absolute top-0 right-4 md:-right-12 z-20 text-white bg-white/20 hover:bg-white/40 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
              aria-label="Close"
            >✕</button>

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length); }}
              className="absolute left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white text-4xl p-2"
              aria-label="Previous"
            >‹</button>

            <div className="protect-image-wrapper relative flex justify-center items-center h-full w-full max-h-[85vh]">
              <img 
                src={currentPhoto?.thumbnailUrl?.replace(/=w\d+/, '=w1600') || currentPhoto?.thumbnailUrl} 
                alt="Memory" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl pointer-events-none"
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
