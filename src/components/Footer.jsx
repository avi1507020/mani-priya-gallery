import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="w-full bg-white/5 backdrop-blur-sm border-t border-white/10 py-4 md:py-6 px-4 mt-auto relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        
        <div className="mb-1">
          <h2 className="font-playfair text-base md:text-lg bg-clip-text text-transparent bg-gradient-to-r from-gold to-yellow-400">
            💍 Mani & Priya — Our Journey
          </h2>
        </div>
        
        <div className="mt-1 flex items-center justify-center gap-1.5 font-poppins text-white/50 text-[10px] md:text-xs">
          <span>Made with</span>
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-rose inline-block text-sm"
          >
            ❤️
          </motion.span>
          <span>for our forever journey</span>
        </div>

        <div className="w-24 h-[1px] bg-white/10 mx-auto my-3 md:my-4"></div>

        <div className="flex flex-col items-center">
          <p className="font-poppins text-white/60 text-[10px] md:text-xs flex items-center gap-1">
            💻 Developed by 
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="text-rose inline-block"
            >
              ❤️
            </motion.span>
          </p>
          <p className="font-poppins text-white font-medium text-[11px] md:text-sm mt-0.5">
            Avishek Senapati
          </p>
          <p className="font-poppins text-white/40 text-[9px] md:text-[10px] mt-0.5">
            QA Automation Engineer
          </p>
        </div>

        <div className="mt-3 md:mt-4">
          <p className="font-poppins text-white/30 text-[9px] md:text-[10px]">
            © 2026 Mani & Priya. All memories reserved 💕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
