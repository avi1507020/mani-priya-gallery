import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
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
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSlideshow, isGalleryOpen, files.length]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-rose py-10">{error}</div>;
  if (!files || files.length === 0) return <EmptyState message="No photos uploaded yet" />;

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    800: 2,
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="mb-6 relative group cursor-pointer rounded-2xl overflow-hidden glass-card shadow-xl border border-white/5"
            onClick={() => openGallery(index)}
          >
            <div className="protect-image-wrapper w-full h-full min-h-[250px] bg-white/5 flex items-center justify-center relative overflow-hidden">
              <img 
                src={file.thumbnailUrl} 
                alt={file.name || "Event memory"} 
                className="w-full h-auto object-cover block transition-all duration-700 ease-out group-hover:scale-110"
                loading="eager"
                onError={(e) => { 
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = "true";
                    e.target.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=s400`;
                  } else {
                    e.target.src = 'https://via.placeholder.com/400x500?text=Memory+Ready+Soon';
                  }
                }}
              />
              
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col items-center justify-end pb-8 gap-4 translate-y-4 group-hover:translate-y-0">
                <div className="bg-gold/90 text-dark px-6 py-2 rounded-full font-poppins font-bold text-sm shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                  View ❤️
                </div>
                <button 
                  onClick={(e) => handleDownloadClick(e, file)}
                  className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg font-medium transition-all"
                  aria-label="Download Photo"
                >
                  <span>Download</span> ⬇
                </button>
              </div>
              
              <div className="image-overlay opacity-50 group-hover:opacity-0 transition-opacity duration-500"></div>
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
