import React, { useState } from 'react';
import { useDriveMedia } from '../hooks/useDriveMedia';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import DownloadModal from '../components/DownloadModal';
import VideoPlayer from '../components/VideoPlayer';

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

  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      {/* Single-column centered layout, max-width constrained for cinematic feel */}
      <div className="flex flex-col gap-10 items-center w-full">
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            className="glass-card group p-5 rounded-2xl flex flex-col relative shadow-2xl overflow-hidden border border-white/5 hover:border-rose/30 transition-all duration-500 w-full"
            style={{ maxWidth: 720 }}
          >
            {/* ── Styled Video Player ── */}
            <VideoPlayer file={file} />

            {/* ── Title + Download ── */}
            <div className="mt-5 flex flex-col gap-4 items-center">
              <h4
                className="font-poppins text-white/90 font-medium truncate text-center w-full text-base"
                title={file.name}
              >
                ✨ {file.name.replace(/\.[^/.]+$/, '')}
              </h4>
              <button
                onClick={(e) => handleDownloadClick(e, file)}
                className="bg-gold/10 hover:bg-gold text-gold hover:text-dark border border-gold/30 text-sm px-8 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg font-bold w-max"
                aria-label="Download Video"
              >
                🔒 Download Video
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
