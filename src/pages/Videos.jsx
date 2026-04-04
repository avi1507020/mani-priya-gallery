import React, { useState } from 'react';
import { useDriveMedia } from '../hooks/useDriveMedia';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import DownloadModal from '../components/DownloadModal';

const Videos = ({ eventId, eventTitle }) => {
  const { files, loading, error } = useDriveMedia(eventId, "videos");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-rose py-10">{error}</div>;
  if (!files || files.length === 0) return <EmptyState message="No videos uploaded yet" />;

  const handleDownloadClick = (e, file) => {
    e.stopPropagation();
    setSelectedDownloadFile(file);
    setDownloadModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map((file) => (
          <div key={file.id} className="glass-card p-4 rounded-2xl flex flex-col relative shadow-xl overflow-hidden">
            <div className="relative w-full aspect-video bg-black/40 rounded-xl overflow-hidden flex items-center justify-center protect-image-wrapper">
              <iframe
                src={file.embedUrl}
                title={file.name}
                width="100%"
                height="100%"
                allow="autoplay"
                allowFullScreen
                className="absolute inset-0 z-0 border-0"
              ></iframe>
            </div>
            
            <div className="mt-4 flex flex-col gap-2 items-center px-2">
              <h4 className="font-poppins text-white truncate text-center w-full text-sm" title={file.name}>
                {file.name.replace(/\.[^/.]+$/, "")}
              </h4>
              <button 
                onClick={(e) => handleDownloadClick(e, file)}
                className="bg-white/10 hover:bg-gold hover:text-black border border-gold/30 text-gold text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-1 shadow-md w-full justify-center"
                aria-label="Download Video"
              >
                🔒 Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        file={selectedDownloadFile}
        eventName={eventTitle || 'Event'}
      />
    </div>
  );
};

export default Videos;
