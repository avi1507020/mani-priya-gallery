import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const events = [
  {
    id: "ashirwad",
    title: "Ashirwad Ceremony",
    emoji: "🎉",
    date: "22 February 2026",
    description: "The beautiful beginning of our forever journey",
    status: "active",
    gradient: "from-gold to-yellow-400",
    ribbonColor: "linear-gradient(90deg, #FFD700, #FFA500)",
    borderTop: "#FFD700"
  },
  {
    id: "prewedding",
    title: "Pre-Wedding",
    emoji: "🧑🤝🧑",
    date: "Coming Soon",
    description: "Our story captured before the big day",
    status: "coming-soon",
    gradient: "from-rose to-pink-400",
    ribbonColor: "linear-gradient(90deg, #FF4D8D, #FF8FAB)",
    borderTop: "#FF4D8D"
  },
  {
    id: "marriage",
    title: "Marriage Ceremony",
    emoji: "🔔",
    date: "Coming Soon",
    description: "The day we became one forever",
    status: "coming-soon",
    gradient: "from-lavender to-purple-400",
    ribbonColor: "linear-gradient(90deg, #C8A2C8, #9B59B6)",
    borderTop: "#C8A2C8"
  }
];

const sparkles = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
  delay: Math.random() * 2,
  duration: Math.random() * 2 + 2
}));

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (event) => {
    if (event.status === 'active') {
      navigate(`/event/${event.id}`);
    } else {
      toast('Coming Soon ✨', { icon: '🔒' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col items-center pt-8 md:pt-12 pb-20 px-4 w-full max-w-[1400px] mx-auto min-h-screen relative overflow-hidden">
      
      {/* Background Enhancements */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <div className="w-[60vh] h-[60vh] bg-rose/40 rounded-full blur-[100px] opacity-40 mix-blend-screen overflow-hidden"></div>
      </div>
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute z-0 pointer-events-none text-white drop-shadow-lg"
          style={{ top: sparkle.top, left: sparkle.left, fontSize: '1rem' }}
          animate={{ rotate: 360, opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: sparkle.duration, delay: sparkle.delay, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.div>
      ))}

      <div className="text-center mb-16 relative z-10 w-full">
        {/* Animated Ring */}
        <motion.div 
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0, -5, 0] }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 select-none inline-block mt-4"
        >
          💍
        </motion.div>

        {/* Separated Couple Names */}
        <div className="flex justify-center items-center gap-2 md:gap-4 mb-4 flex-wrap">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold text-transparent px-1"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}
          >
            Mani
          </motion.h1>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl mx-1 md:mx-2 drop-shadow-sm select-none"
          >
            ❤️
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold text-transparent px-1"
            style={{ 
              background: 'linear-gradient(135deg, #FF4D8D, #FF8FAB)', 
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}
          >
            Priya
          </motion.h1>
        </div>
        
        {/* Location Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6 mt-4"
        >
          <div className="bg-gold/10 text-gold border border-gold/30 px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-center justify-center w-max mx-auto sm:mx-0">
            📍 Bankura
          </div>
          <div className="text-xl hidden sm:block select-none opacity-90">💑</div>
          <div className="bg-gold/10 text-gold border border-gold/30 px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-center justify-center w-max mx-auto sm:mx-0">
            📍 Bokaro
          </div>
        </motion.div>

        {/* Existing Subtitle */}
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl font-poppins text-white/80 mb-2 font-medium"
        >
          Our Beautiful Journey ❤️
        </motion.h2>
        
        {/* Updated Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lavender italic font-playfair tracking-wide text-sm md:text-base px-6 mb-2"
        >
          From Bankura to Bokaro, United Forever ✨
        </motion.p>
        
        {/* Animated Divider */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-[2px] mx-auto mt-4 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70"
        />
      </div>

      {/* Redesigned Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 w-full px-4 sm:px-8 lg:px-16"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(255,77,141,0.4)', transition: { duration: 0.3 } }}
            onClick={() => handleCardClick(event)}
            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col relative cursor-pointer overflow-hidden min-h-[380px] w-full group"
            style={{ borderTop: `3px solid ${event.borderTop}` }}
          >
            {/* Top Ribbon Shimmer */}
            <div 
              className="w-full h-[6px] absolute top-0 left-0 overflow-hidden"
              style={{ background: event.ribbonColor }}
            >
              <motion.div 
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-[100px] h-full bg-white/50 skew-x-12"
              />
            </div>
            
            {/* Emoji Area */}
            <div className="mt-8 mb-2 flex justify-center w-full relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] relative">
                <span className="text-4xl sm:text-5xl drop-shadow-md z-10 select-none pb-1">{event.emoji}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-playfair text-xl sm:text-2xl text-white text-center mt-4 drop-shadow-md px-2 min-h-[36px]">
              {event.title}
            </h3>
            
            {/* Date Badge */}
            <div className="flex justify-center mt-2 h-[24px]">
              <div className={`px-4 py-0.5 rounded-full text-[11px] sm:text-xs font-poppins font-semibold shadow-sm flex items-center justify-center ${
                event.status === 'active' 
                  ? 'bg-gold text-dark'
                  : 'bg-white/20 text-white/60'
              }`}>
                {event.date}
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-12 h-px bg-white/20 mx-auto my-4 mix-blend-overlay"></div>
            
            {/* Description */}
            <p className="font-poppins text-sm text-white/70 text-center px-6 flex-grow leading-relaxed min-h-[44px]">
              {event.description}
            </p>
            
            {/* Button */}
            <div className="px-6 pb-6 pt-4 mt-auto w-full">
              <button className={`w-full py-0 h-[44px] md:h-[48px] rounded-xl font-poppins text-sm sm:text-base flex justify-center items-center gap-2 transition-all duration-300 ${
                event.status === 'active'
                  ? 'bg-gradient-to-r from-gold to-yellow-400 text-dark font-semibold group-hover:brightness-110 group-hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-gold/20'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
              }`}>
                {event.status === 'active' ? (
                  <><span className="text-lg pb-0.5">✨</span> View Gallery</>
                ) : (
                  <><span className="text-base opacity-70 pb-0.5">🔒</span> Coming Soon</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
