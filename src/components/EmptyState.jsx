import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ message = "Beautiful memories are being prepared for you..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 w-full min-h-[300px] glass-card rounded-3xl opacity-80">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-6 drop-shadow-xl"
      >
        ✨
      </motion.div>
      <h3 className="font-playfair text-2xl mb-2 text-white">Coming Soon</h3>
      <p className="font-poppins text-white/60 text-sm max-w-xs mx-auto">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
