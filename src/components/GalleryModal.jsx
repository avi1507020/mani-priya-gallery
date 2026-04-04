import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryModal = ({ isOpen, onClose, photos, currentIndex, setCurrentIndex, eventName, eventDate, isSlideshow, setIsSlideshow, onDownload }) => {
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
            className="fixed top-4 right-4 md:top-8 md:right-8 z-[110] bg-black/40 hover:bg-rose/80 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-500 hover:scale-110 shadow-2xl group"
            aria-label="Close"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-500">✕</span>
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-6xl pointer-events-none"
          >

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length); }}
              className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-300 pointer-events-auto shadow-xl"
              aria-label="Previous"
            >
              <span className="text-4xl mb-1">‹</span>
            </button>

            <div className="protect-image-wrapper relative flex justify-center items-center h-auto max-h-[80vh] w-full pointer-events-auto">
              <img 
                src={`https://drive.google.com/thumbnail?id=${currentPhoto?.id}&sz=s1600`} 
                alt="Memory" 
                className="max-w-[90vw] max-h-[80vh] md:max-h-[85vh] object-contain rounded-2xl pointer-events-none shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                loading="eager"
              />
              <div className="image-overlay rounded-2xl bg-black/10"></div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % photos.length); }}
              className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-300 pointer-events-auto shadow-xl"
              aria-label="Next"
            >
              <span className="text-4xl mb-1">›</span>
            </button>

            <div className="absolute bottom-[-30px] md:bottom-[-50px] text-center w-full flex flex-col items-center gap-2">
              <p className="font-playfair text-gold text-base md:text-xl drop-shadow-xl font-bold tracking-wide italic">
                ❤️ {eventName} Moment
              </p>
              <button 
                onClick={(e) => onDownload(e, currentPhoto)}
                className="bg-white/10 hover:bg-gold text-white hover:text-dark px-6 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 font-poppins text-xs md:text-sm flex items-center gap-2 pointer-events-auto shadow-lg"
              >
                <span>Download High-Res</span> ⬇
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
