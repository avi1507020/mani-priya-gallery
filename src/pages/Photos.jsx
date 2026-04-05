import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDriveMedia } from '../hooks/useDriveMedia';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import GalleryModal from '../components/GalleryModal';
import DownloadModal from '../components/DownloadModal';

const Photos = ({ eventId, eventTitle }) => {
  const { files, loading, error } = useDriveMedia(eventId, "photos");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);
  const [isSlideshow, setIsSlideshow] = useState(false);

  useEffect(() => {
    if (loading) {
      toast.loading("Fetching memories for you... 💖", { id: 'fetch-media' });
    } else {
      toast.dismiss('fetch-media');
      if (error) {
        toast.error(error);
      } else if (files.length > 0) {
        toast.success(`${files.length} Memories Loaded! ✨`, { duration: 2000, id: 'fetch-success' });
      }
    }
  }, [loading, error, files.length]);

  useEffect(() => {
    let interval;
    if (isSlideshow && isGalleryOpen && files.length > 0) {
      interval = setInterval(() => {
        setSelectedPhotoIndex((prev) => (prev + 1) % files.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSlideshow, isGalleryOpen, files.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-white/10 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-center text-rose py-10 font-poppins">{error}</div>;
  
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >✨</motion.div>
        <h3 className="text-white text-xl font-playfair font-bold">No Photos Yet</h3>
        <p className="text-white/40 text-sm mt-2 font-poppins">Upload photos to Google Drive to see them here</p>
      </div>
    );
  }

  const openGallery = (index) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
    setIsSlideshow(false);
  };

  const handleDownloadClick = (e, file) => {
    e.stopPropagation();
    setSelectedDownloadFile(file);
    setDownloadModalOpen(true);
  };

  const startSlideshow = () => {
    if(files.length > 0) {
      setSelectedPhotoIndex(0);
      setIsGalleryOpen(true);
      setIsSlideshow(true);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 px-4">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-3xl font-playfair font-bold text-white text-left">
            📸 {eventTitle} Memories
          </h2>
          <span className="bg-gold/20 border border-gold/40 text-white/80 text-[10px] md:text-xs px-3 py-1 rounded-full font-poppins font-medium flex items-center gap-1.5 whitespace-nowrap">
            🖼️ {files.length} Photos
          </span>
        </div>
        
        <div className="w-full flex flex-col items-start mb-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8 }}
            className="h-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FF4D8D)' }}
          />
        </div>
        
        <div className="w-full flex justify-end">
          <button
            onClick={startSlideshow}
            className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-full font-poppins text-xs md:text-sm transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <span className="text-gold">▶</span> 
            <span className="hidden md:inline">Slideshow</span>
            <span className="md:hidden">Play</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 phone-large:gap-3 tablet:gap-4 desktop:gap-6 p-3 phone-large:p-4 tablet:p-5 laptop:p-6">
        {files.map((file, index) => (
          <motion.div 
            key={file.id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className="aspect-square relative group rounded-2xl overflow-hidden glass-card shadow-lg border border-white/5 cursor-pointer"
          >
            {/* Photo Number Indicator */}
            <div className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-[10px] text-white/70 font-poppins pointer-events-none border border-white/10">
              {index + 1}
            </div>

            {/* View Button - Mobile Always, Desktop Hover */}
            <div 
              onClick={() => openGallery(index)}
              className="absolute top-2 right-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
            >
              <div className="w-7 h-7 md:w-auto md:h-auto md:px-3 md:py-1.5 bg-white/25 md:bg-white/20 backdrop-blur-md rounded-full text-white text-xs border border-white/30 flex items-center justify-center gap-1.5">
                <span>👁</span>
                <span className="hidden md:inline">View</span>
              </div>
            </div>

            {/* Image Wrapper */}
            <div 
              onClick={() => openGallery(index)}
              className="w-full h-full relative"
            >
              <img 
                src={file.thumbnailUrl} 
                alt={file.name || "Event memory"} 
                className="w-full h-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.parentNode.innerHTML = `
                    <div class="w-full h-full bg-white/10 flex flex-col items-center justify-center gap-1">
                      <span class="text-xl">🖼️</span>
                      <span class="text-[10px] text-white/40 font-poppins">Image unavailable</span>
                    </div>
                  `;
                }}
              />
              
              {/* Overlay - Desktop Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-400 z-10" />
              
              {/* Overlay - Mobile Constant */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden z-10 pointer-events-none" />
            </div>

            {/* Download Button */}
            <button 
              onClick={(e) => handleDownloadClick(e, file)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 
                w-8 h-8 md:w-max md:h-auto md:px-4 md:py-2 
                rounded-full 
                bg-gradient-to-br from-gold to-orange-500 md:from-gold md:to-yellow-500
                text-dark shadow-xl 
                transition-all duration-300 hover:scale-105 active:scale-95
                flex items-center justify-center gap-2"
            >
              <span className="text-xs">🔒</span>
              <span className="hidden lg:inline text-xs font-bold font-poppins">Download</span>
              <span className="hidden md:inline lg:hidden text-xs font-bold font-poppins">Save</span>
            </button>
          </motion.div>
        ))}
      </div>

      <GalleryModal 
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          setIsSlideshow(false);
        }}
        photos={files}
        currentIndex={selectedPhotoIndex}
        setCurrentIndex={setSelectedPhotoIndex}
        eventName={eventTitle || 'Event'}
        isSlideshow={isSlideshow}
        setIsSlideshow={setIsSlideshow}
        onDownload={handleDownloadClick}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        file={selectedDownloadFile}
        eventName={eventTitle || 'Event'}
      />
    </div>
  );
};

export default Photos;
