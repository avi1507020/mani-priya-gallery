import React, { useState, useRef, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicContext } from './MusicToggle';

/**
 * VideoPlayer
 * A romantic, app-themed video player wrapper for Google Drive embed iframes.
 *
 * Props:
 *   file  – { id, name, embedUrl, thumbnailUrl }
 */
const VideoPlayer = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Safely consume music context (may be undefined in isolated renders)
  const musicCtx = useContext(MusicContext) || {};
  const { pauseForVideo, resumeAfterVideo } = musicCtx;

  // ── Play handler ─────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    // Stop background music the moment user hits play
    if (typeof pauseForVideo === 'function') pauseForVideo();
    setIsPlaying(true);
  }, [pauseForVideo]);

  // ── Fullscreen toggle ────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // Fullscreen request denied — silently ignore
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Sync isFullscreen state with Escape key / browser chrome exit
  React.useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  // Append autoplay=1 so Drive starts playback immediately when overlay lifts
  const autoplayEmbedUrl = file.embedUrl
    ? `${file.embedUrl}${file.embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : '';

  const videoTitle = file.name.replace(/\.[^/.]+$/, '');

  return (
    <div
      ref={containerRef}
      className="video-player-root relative w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: '16 / 9',
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b1b 100%)',
        boxShadow: '0 0 40px rgba(255, 77, 141, 0.35), 0 0 80px rgba(255, 215, 0, 0.12), 0 8px 32px rgba(0,0,0,0.6)',
        border: '1.5px solid rgba(255, 77, 141, 0.4)',
      }}
    >
      {/* ── Iframe (hidden until play) ──────────────────────────────────── */}
      {isPlaying && (
        <iframe
          src={autoplayEmbedUrl}
          title={videoTitle}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 z-10"
          style={{ display: 'block' }}
        />
      )}

      {/* ── Pre-play Overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(26,10,46,0.85) 0%, rgba(45,27,27,0.9) 100%)' }}
          >
            {/* Thumbnail */}
            {file.thumbnailUrl && (
              <img
                src={file.thumbnailUrl}
                alt={videoTitle}
                draggable="false"
                className="absolute inset-0 w-full h-full object-cover opacity-30 select-none"
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Gradient vignette over thumbnail */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(26,10,46,0.75) 100%)',
              }}
            />

            {/* Play button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              onClick={handlePlay}
              aria-label="Play video"
              className="relative z-10 flex items-center justify-center rounded-full focus:outline-none"
              style={{
                width: 72,
                height: 72,
                background: 'linear-gradient(135deg, #FF4D8D, #FFD700)',
                boxShadow: '0 0 32px rgba(255,77,141,0.6), 0 0 64px rgba(255,215,0,0.2)',
              }}
            >
              {/* Triangle play icon */}
              <svg viewBox="0 0 24 24" fill="white" width="30" height="30" style={{ marginLeft: 4 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>

            {/* Video title */}
            <p
              className="relative z-10 mt-5 text-center font-poppins text-sm font-medium px-6"
              style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
            >
              ✨ {videoTitle}
            </p>

            {/* #PriyaMani watermark on overlay */}
            <span
              className="absolute bottom-3 right-4 font-playfair italic text-xs select-none pointer-events-none z-10"
              style={{ color: 'rgba(255,215,0,0.45)', letterSpacing: '0.04em' }}
            >
              #PriyaMani
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Persistent #PriyaMani watermark (visible during playback) ──── */}
      {isPlaying && (
        <div
          className="absolute bottom-3 right-4 z-30 select-none pointer-events-none font-playfair italic text-xs"
          style={{ color: 'rgba(255,215,0,0.55)', textShadow: '0 1px 6px rgba(0,0,0,0.9)', letterSpacing: '0.04em' }}
        >
          #PriyaMani
        </div>
      )}

      {/* ── Fullscreen button (visible during playback) ───────────────── */}
      {isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className="absolute top-3 right-3 z-30 flex items-center justify-center rounded-full focus:outline-none transition-all duration-200 hover:scale-110"
          style={{
            width: 36,
            height: 36,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,215,0,0.35)',
            color: 'rgba(255,215,0,0.9)',
          }}
        >
          {isFullscreen ? (
            /* Exit fullscreen icon */
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            /* Enter fullscreen icon */
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </motion.button>
      )}

      {/* ── Subtle inner glow ring ────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          boxShadow: 'inset 0 0 0 1.5px rgba(255,77,141,0.2)',
        }}
      />
    </div>
  );
};

export default VideoPlayer;
