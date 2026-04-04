import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import { useDriveMedia } from '../hooks/useDriveMedia';
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
    let interval;
    if (isSlideshow && isGalleryOpen && files.length > 0) {
      interval = setInterval(() => {
        setSelectedPhotoIndex((prev) => (prev + 1) % files.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSlideshow, isGalleryOpen, files]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-rose py-10">{error}</div>;
  if (!files || files.length === 0) return <EmptyState message="No photos uploaded yet" />;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

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
      <div className="flex justify-end mb-6">
        <button
          onClick={startSlideshow}
          className="bg-white/10 hover:bg-white/20 border border-gold/30 text-gold px-4 py-2 rounded-full font-poppins text-sm transition-all flex items-center gap-2"
          aria-label="Start Slideshow"
        >
          <span>▶</span> Slideshow
        </button>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {files.map((file, index) => (
          <motion.div 
            key={file.id} 
            whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
            className="mb-4 relative group cursor-pointer rounded-2xl overflow-hidden glass-card shadow-lg"
            onClick={() => openGallery(index)}
          >
            <div className="protect-image-wrapper w-full h-full">
              <img 
                src={file.thumbnailUrl} 
                alt={file.name || "Event memory"} 
                className="w-full h-auto object-cover block"
                loading="lazy"
                onError={(e) => { 
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = "true";
                    e.target.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=s400`;
                  } else {
                    e.target.src = 'https://via.placeholder.com/400x500?text=Memory+Ready+Soon';
                  }
                }}
              />
              <div className="image-overlay"></div>
            </div>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center pointer-events-none">
              <span className="text-white font-poppins font-medium drop-shadow-md">View 💕</span>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button 
                onClick={(e) => handleDownloadClick(e, file)}
                className="bg-gold text-dark text-xs px-3 py-1.5 rounded-full hover:bg-white hover:text-dark transition-colors flex items-center gap-1 shadow-lg font-medium"
                aria-label="Download Photo"
              >
                🔒 Download
              </button>
            </div>
          </motion.div>
        ))}
      </Masonry>

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
