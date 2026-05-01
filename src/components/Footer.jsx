import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white/25 backdrop-blur-md border-t border-white/10 mt-auto relative z-20">
      <div className="max-w-7xl mx-auto py-3 px-4 md:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between text-sm font-poppins text-[#1A0A2E]">
          <div className="flex items-center">
            <span className="font-playfair font-semibold">💍 Mani & Priya</span>
            <span className="text-[#1A0A2E] opacity-50 mx-2">·</span>
            <span className="text-[#1A0A2E] opacity-70 text-xs truncate">© 2026</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs">Made with <span className="text-rose-400">❤️</span> by </span>
            <span className="font-bold ml-1">Avishek Senapati</span>
            <span className="text-[#1A0A2E] opacity-50 mx-2">·</span>
            <span className="text-xs opacity-80">SDET | Automation Engineer</span>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col items-center gap-1 md:hidden text-sm font-poppins text-[#1A0A2E]">
          <div className="flex items-center">
            <span className="font-playfair font-semibold">💍 Mani & Priya</span>
            <span className="text-[#1A0A2E] opacity-50 mx-2">·</span>
            <span className="text-[#1A0A2E] opacity-70 text-xs">© 2026</span>
          </div>
          <div className="flex items-center">
            <span>💻</span>
            <span className="font-bold mx-1">Avishek Senapati</span>
            <span className="text-[#1A0A2E] opacity-50 mx-1">·</span>
            <span className="text-xs opacity-80">SDET | Automation Engineer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
