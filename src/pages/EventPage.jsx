import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Photos from './Photos';
import Videos from './Videos';

const eventsDict = {
  ashirwad: {
    id: "ashirwad",
    title: "Ashirwad Ceremony",
    emoji: "🎉",
    date: "22 February 2026",
    description: "The beautiful beginning of our forever journey",
    status: "active",
    gradient: "from-pink-500 to-rose-400"
  },
  prewedding: {
    id: "prewedding",
    title: "Pre-Wedding",
    emoji: "💑",
    date: "Coming Soon",
    description: "Our story captured before the big day",
    status: "coming-soon",
    gradient: "from-purple-500 to-lavender-400"
  },
  marriage: {
    id: "marriage",
    title: "Marriage Ceremony",
    emoji: "🔔",
    date: "Coming Soon",
    description: "The day we became one forever",
    status: "coming-soon",
    gradient: "from-yellow-400 to-gold-400"
  }
};

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('photos');
  
  const eventData = eventsDict[eventId];

  if (!eventData) {
    toast.error("Event not found");
    navigate('/');
    return null;
  }

  const gradientClass = eventData.gradient || "from-rose to-pink-400";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-20 pb-8 relative">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-white/80 hover:text-white font-poppins transition-all duration-300 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 backdrop-blur-md rounded-full px-5 py-2 w-max shadow-lg"
        >
          <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span> Back
        </button>
      </div>

      <div className={`w-full rounded-2xl p-6 md:p-10 mb-8 relative overflow-hidden bg-gradient-to-r ${gradientClass} shadow-2xl`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/20 rounded-full backdrop-blur-md shadow-2xl border border-white/40 flex items-center justify-center text-5xl md:text-6xl">
            {eventData.emoji}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              {eventData.title}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 font-poppins">
              <span className="text-white/90 bg-black/20 px-4 py-1 rounded-full text-xs md:text-sm font-medium border border-white/10 backdrop-blur-sm shadow-inner">
                📅 {eventData.date}
              </span>
              <p className="text-white/70 text-sm md:text-base italic tracking-wide">
                {eventData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-full flex gap-1.5 border border-white/10 shadow-xl">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-8 py-2.5 rounded-full font-poppins text-sm transition-all duration-500 flex items-center gap-2 ${
              activeTab === 'photos' 
              ? 'bg-gradient-to-r from-gold to-yellow-400 text-dark font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-105' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            📷 Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-8 py-2.5 rounded-full font-poppins text-sm transition-all duration-500 flex items-center gap-2 ${
              activeTab === 'videos' 
              ? 'bg-gradient-to-r from-gold to-yellow-400 text-dark font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-105' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            🎬 Videos
          </button>
        </div>
      </div>

      <div className="w-full relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Photos eventId={eventId} eventTitle={eventData.title} />
            </motion.div>
          )}
          
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Videos eventId={eventId} eventTitle={eventData.title} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventPage;
