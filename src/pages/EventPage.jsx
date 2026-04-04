import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Photos from './Photos';
import Videos from './Videos';
import toast from 'react-hot-toast';

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('photos');
  const [eventData, setEventData] = useState(location.state?.event || null);

  useEffect(() => {
    const fetchEvent = async () => {
      // If we didn't receive event state from Home, fetch it
      if (!eventData) {
        try {
          const docRef = doc(db, 'events', eventId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setEventData({ id: docSnap.id, ...docSnap.data() });
          } else {
            // Check fallback for demo purposes
            const fallbackEvents = {
              'ashirwad': { id: 'ashirwad', emoji: '🎉', title: 'Ashirwad Ceremony', date: '22 Feb 2026', coverGradient: 'from-rose-500 to-pink-400', description: 'The beginning of forever...' }
            };
            if(fallbackEvents[eventId]) {
                setEventData(fallbackEvents[eventId]);
            } else {
                toast.error("Event not found");
                navigate('/');
            }
          }
        } catch(e) {
          console.error("Error fetching event", e);
          const fallbackEvents = {
            'ashirwad': { id: 'ashirwad', emoji: '🎉', title: 'Ashirwad Ceremony', date: '22 Feb 2026', coverGradient: 'from-rose-500 to-pink-400', description: 'The beginning of forever...' }
          };
          if(fallbackEvents[eventId]) {
              setEventData(fallbackEvents[eventId]);
          } else {
              toast.error("Event not found");
              navigate('/');
          }
        }
      }
    };
    fetchEvent();
  }, [eventId, eventData, navigate]);

  if (!eventData) return null; // or a loading spinner

  const gradientClass = eventData.coverGradient || "from-rose-500 to-pink-400";

  return (
    <div className="min-h-screen relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-white/70 hover:text-white font-poppins mb-6 transition-colors glass-card px-4 py-2 w-max"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back Home
      </button>

      <div className={`w-full rounded-3xl p-8 mb-8 relative overflow-hidden bg-gradient-to-r ${gradientClass}`}>
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

      <div className="flex justify-center mb-8">
        <div className="glass-card p-1 rounded-full flex gap-2 w-max">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-2 rounded-full font-poppins text-sm transition-all duration-300 ${
              activeTab === 'photos' ? 'bg-gold text-black font-semibold shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            📷 Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 rounded-full font-poppins text-sm transition-all duration-300 ${
              activeTab === 'videos' ? 'bg-gold text-black font-semibold shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'
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
              className="w-full absolute left-0"
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
              className="w-full absolute left-0"
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
