import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addWatermark } from '../utils/watermark';
import toast from 'react-hot-toast';

const DownloadModal = ({ isOpen, onClose, file, eventName }) => {
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsSuccess(true);
      setIsDownloading(true);
      
      try {
        if (file.mimeType && file.mimeType.includes('video')) {
          // Video: Open drive download link directly
          window.open(file.downloadUrl, '_blank');
        } else {
          // Photos: fetch and canvas watermark
          const highResUrl = file.thumbnailUrl.replace(/=w\d+/, '=w1600');
          const blob = await addWatermark(highResUrl, eventName);
          const blobUrl = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = file.name || 'mani-priya-moment.jpg';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
        
        toast.success("Downloaded with love! 💖");
        setTimeout(() => {
          onClose();
          setPin('');
          setIsSuccess(false);
          setIsDownloading(false);
        }, 2000);
      } catch (err) {
        console.error("Download failed:", err);
        toast.error("Failed to process download");
        setIsDownloading(false);
      }
    } else {
      setErrorShake(true);
      toast.error('Wrong Code 💔 Try Again');
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: errorShake ? [-10, 10, -10, 10, 0] : 0 
          }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: errorShake ? 0.4 : 0.3 }}
          className={`glass-card p-8 w-full max-w-sm relative z-10 flex flex-col items-center ${errorShake ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : ''}`}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white" aria-label="Close">✕</button>
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            {isSuccess ? '💖' : '🔒'}
          </motion.div>
          
          <h3 className="font-playfair text-2xl mb-1 text-center text-white">
            {isSuccess ? 'Unlocked 💕' : 'Enter Secret Love Code 💖'}
          </h3>
          {!isSuccess && (
            <p className="text-sm text-white/60 text-center mb-6">
              This gallery is protected with love 🔐
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={isSuccess || isDownloading}
              className="bg-white/10 border border-gold/50 rounded-lg py-3 px-4 text-center tracking-widest text-xl text-white outline-none focus:border-gold focus:bg-white/20 transition-all font-poppins"
              placeholder="••••"
              autoFocus
            />
            
            <button
              type="submit"
              disabled={isSuccess || isDownloading || pin.length < 4}
              className="bg-gradient-to-r from-rose to-pink-400 py-3 rounded-lg font-poppins font-semibold text-white shadow-lg hover:shadow-rose/50 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDownloading ? 'Processing...' : 'Unlock 💕'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadModal;
