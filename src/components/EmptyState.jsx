import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 w-full h-full min-h-[300px]">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-6"
      >
        ✨
      </motion.div>
      <h3 className="font-playfair text-2xl mb-2">Coming Soon</h3>
      <p className="font-poppins text-white/70 text-sm max-w-xs mx-auto">
        Beautiful memories are being prepared for you...
      </p>
    </div>
  );
};

export default EmptyState;
