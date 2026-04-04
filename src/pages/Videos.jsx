import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseStorage } from '../hooks/useFirebaseStorage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import DownloadModal from '../components/DownloadModal';

const Videos = ({ eventId, eventTitle }) => {
  const { files, loading, error } = useFirebaseStorage(`${eventId}/videos`);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 py-10">Error loading videos.</div>;
  if (!files || files.length === 0) return <EmptyState />;

  const handleDownloadClick = (e, file) => {
    e.stopPropagation();
    setSelectedDownloadFile(file);
    setDownloadModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map((file) => (
          <div key={file.name} className="glass-card p-4 rounded-2xl flex flex-col relative group transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,77,141,0.3)]">
            <div 
              className="relative w-full aspect-video bg-black/40 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center protect-image-wrapper"
              onClick={() => setSelectedVideo(file)}
            >
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center bg-black/40 text-gold text-2xl group-hover:bg-gold group-hover:text-black transition-colors z-20">
                ▶
              </div>
              <p className="absolute bottom-4 text-center w-full font-poppins text-sm text-white/50">
                Click to play
              </p>
            </div>
            
            <div className="mt-4 flex justify-between items-center px-2">
              <h4 className="font-poppins text-white truncate pr-4 text-sm" title={file.name}>
                {file.name.replace(/\.[^/.]+$/, "")}
              </h4>
              <button 
                onClick={(e) => handleDownloadClick(e, file)}
                className="bg-white/10 hover:bg-gold hover:text-black border border-gold/30 text-gold text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shrink-0"
              >
                🔒 Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
            ></motion.div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close video"
              >
                ✕
              </button>
              
              <ReactPlayer 
                url={selectedVideo.url} 
                controls 
                width="100%" 
                height="100%" 
                playing={true}
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default Videos;
