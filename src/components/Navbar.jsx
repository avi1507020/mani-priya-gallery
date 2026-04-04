import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-6 flex justify-between items-center z-50 relative"
    >
      <Link to="/" className="font-playfair text-2xl font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-gold-500">
        M & P
      </Link>
      <div className="text-sm font-poppins text-white/70">
        <span className="hidden sm:inline">Our Forever Journey</span>
        <span className="sm:hidden">Forever</span>
      </div>
    </motion.nav>
  );
};

export default Navbar;
