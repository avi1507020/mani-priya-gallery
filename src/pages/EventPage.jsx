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

      <div className={`w-full rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden bg-gradient-to-r ${gradientClass}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="text-7xl bg-white/20 p-6 rounded-full backdrop-blur-md shadow-xl border border-white/30">
            {eventData.emoji}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2 drop-shadow-md">
              {eventData.title}
            </h1>
            <p className="font-poppins text-white/90 text-sm md:text-base bg-black/20 px-3 py-1 rounded-full inline-block mb-2">
              {eventData.date}
            </p>
            <p className="font-poppins text-white/80 max-w-md">
              {eventData.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="glass-card p-1 rounded-full flex gap-2 w-max">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-2 rounded-full font-poppins text-sm transition-all duration-300 ${
              activeTab === 'photos' ? 'bg-gold text-dark font-semibold shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            📷 Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 rounded-full font-poppins text-sm transition-all duration-300 ${
              activeTab === 'videos' ? 'bg-gold text-dark font-semibold shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'
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
