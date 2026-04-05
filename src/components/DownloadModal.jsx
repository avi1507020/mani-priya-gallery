import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addWatermark } from '../utils/watermark';
import toast from 'react-hot-toast';

const DownloadModal = ({ isOpen, onClose, file, eventName }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputs = useRef([]);

  const CORRECT_PIN = '2511';

  const handleInput = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(data)) return;
    
    const newPin = [...pin];
    data.split('').forEach((char, i) => {
      if (i < 4) newPin[i] = char;
    });
    setPin(newPin);
    if (newPin[3]) inputs.current[3].focus();
  };

  const handleUnlock = async () => {
    const finalPin = pin.join('');
    if (finalPin === CORRECT_PIN) {
      setIsSuccess(true);
      try {
        // Start "downloading" progress
        let p = 0;
        const interval = setInterval(() => {
          p += 5;
          if (p <= 100) setProgress(p);
          else clearInterval(interval);
        }, 80);

        const highResUrl = `https://lh3.googleusercontent.com/d/${file.id}=s1600`;
        const response = await fetch(highResUrl);
        const blobRaw = await response.blob();
        
        // Use our watermark utility
        const blob = await addWatermark(highResUrl, eventName);
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `ManiPriya_${eventName.replace(/\s+/g, '_')}_${file.name || 'memory.jpg'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        setTimeout(() => {
          toast.success("Memory Unlocked! 💕");
          onClose();
          // Reset state for next use
          setPin(['', '', '', '']);
          setIsSuccess(false);
          setProgress(0);
        }, 2500);
      } catch (err) {
        toast.error("Process failed. Please try again.");
        setIsSuccess(false);
      }
    } else {
      setIsWrong(true);
      toast.error("Wrong Code 💔");
      setTimeout(() => setIsWrong(false), 2500);
    }
  };

  useEffect(() => {
    if (isOpen && !isSuccess) {
      setPin(['', '', '', '']);
      setTimeout(() => inputs.current[0]?.focus(), 500);
    }
  }, [isOpen]);

  if (!isOpen || !file) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={window.innerWidth < 768 ? { y: '100%' } : { scale: 0.8, opacity: 0 }}
          animate={window.innerWidth < 768 ? { y: 0 } : { scale: 1, opacity: 1 }}
          exit={window.innerWidth < 768 ? { y: '100%' } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#1A0A2E] via-[#FF4D8D]/10 to-[#1A0A2E] backdrop-blur-3xl border border-gold/25 shadow-[0_30px_80px_rgba(0,0,0,0.6)] rounded-t-3xl md:rounded-3xl p-6 md:p-8 overflow-hidden"
        >
          {/* Mobile Drag Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

          {/* Success State */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="text-6xl mb-4"
                >✅</motion.div>
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-center text-white">
                  <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">
                    Downloading... 💕
                  </span>
                </h3>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="absolute top-0 left-0 h-full bg-gold rounded-full"
                  />
                </div>
                <p className="text-white/40 text-xs mt-4 font-poppins italic">Your memory is being saved ❤️</p>
              </motion.div>
            ) : (
              <motion.div key="input" exit={{ opacity: 0 }}>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all touch-target">✕</button>

                {/* Lock Section */}
                <div className="flex flex-col items-center mt-2 md:mt-0">
                  <motion.div 
                    animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
                    className="text-4xl md:text-5xl"
                  >🔐</motion.div>
                  <div className="w-16 h-3 bg-gold/30 blur-xl rounded-full mx-auto mt-2" />
                </div>

                <h3 className="text-xl md:text-2xl font-playfair font-bold text-center mt-4">
                  <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">
                    Secret Love Code 💖
                  </span>
                </h3>
                <p className="text-white/50 text-xs md:text-sm text-center mt-2 font-poppins">
                  Enter 4-digit code to unlock your memory
                </p>

                {/* PIN Boxes */}
                <div className="flex gap-2 justify-center mt-6">
                  {pin.map((digit, i) => (
                    <motion.input
                      key={i}
                      ref={el => inputs.current[i] = el}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleInput(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                      className={`w-12 h-14 md:w-14 md:h-16 bg-white/5 border-2 rounded-xl text-center text-xl md:text-2xl text-white font-bold font-poppins outline-none transition-all
                        ${isWrong ? 'border-red-500' : digit ? 'border-gold/50 bg-gold/5' : 'border-white/15 focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)]'}
                      `}
                    />
                  ))}
                </div>

                {/* Unlock Button */}
                <button
                  onClick={handleUnlock}
                  disabled={pin.some(d => !d)}
                  className="w-full h-12 md:h-13 mt-6 bg-gradient-to-br from-gold to-orange-500 text-dark font-bold rounded-2xl transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🔓 Unlock Memories
                </button>

                {/* Error Message */}
                <AnimatePresence>
                  {isWrong && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs md:text-sm text-center mt-3 font-poppins font-medium"
                    >
                      💔 Wrong Code! Ask Mani or Priya 😊
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="text-white/20 text-[10px] md:text-xs text-center mt-6 font-poppins">
                  💡 Hint: Ask Mani or Priya for the code 😊
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadModal;
