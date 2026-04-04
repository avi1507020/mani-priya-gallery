import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useFirebaseStorage } from '../hooks/useFirebaseStorage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import GalleryModal from '../components/GalleryModal';
import DownloadModal from '../components/DownloadModal';

const Photos = ({ eventId, eventTitle }) => {
  const { files, loading, error } = useFirebaseStorage(`${eventId}/photos`);
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
  if (error) return <div className="text-center text-red-500 py-10">Error loading photos.</div>;
  if (!files || files.length === 0) return <EmptyState />;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  const openGallery = (index) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
    setIsSlideshow(false); // Reset slideshow on open
  };

  const handleDownloadClick = (e, file) => {
    e.stopPropagation();
    setSelectedDownloadFile(file);
    setDownloadModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            if(files.length > 0) {
              setSelectedPhotoIndex(0);
              setIsGalleryOpen(true);
              setIsSlideshow(true);
            }
          }}
          className="bg-white/10 hover:bg-white/20 border border-gold/30 text-gold px-4 py-2 rounded-full font-poppins text-sm transition-all flex items-center gap-2"
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
          <div 
            key={file.name} 
            className="mb-4 relative group cursor-pointer rounded-2xl overflow-hidden glass-card"
            onClick={() => openGallery(index)}
          >
            <div className="protect-image-wrapper">
              <img 
                src={file.url} 
                alt="Event memory" 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110 aspect-auto block"
                loading="lazy"
              />
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={(e) => handleDownloadClick(e, file)}
                className="bg-black/50 backdrop-blur-md text-gold text-xs px-3 py-1.5 rounded-full border border-gold/50 hover:bg-gold hover:text-black transition-colors flex items-center gap-1"
              >
                🔒 Download
              </button>
            </div>
            
            <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
              <p className="text-[10px] font-poppins text-white/50 drop-shadow-md">
                Mani ❤️ Priya | {eventTitle || 'Event'}
              </p>
            </div>
          </div>
        ))}
      </Masonry>

      <GalleryModal 
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          setIsSlideshow(false);
        }}
        images={files}
        currentIndex={selectedPhotoIndex}
        setCurrentIndex={setSelectedPhotoIndex}
        eventName={eventTitle || 'Event'}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        fileUrl={selectedDownloadFile?.url}
        fileName={selectedDownloadFile?.name}
        eventName={eventTitle || 'Event'}
      />
    </div>
  );
};

export default Photos;
