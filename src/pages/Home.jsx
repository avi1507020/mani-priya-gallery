import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import FloatingHearts from '../components/FloatingHearts';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if(eventsList.length > 0) {
            setEvents(eventsList);
        } else {
            throw new Error("Empty DB");
        }
      } catch (error) {
        console.warn("Could not fetch events from Firestore or DB empty. Showing fallback data.");
        setEvents([
          { id: 'ashirwad', emoji: '🎉', title: 'Ashirwad Ceremony', date: '22 Feb 2026', status: 'active', description: 'The beginning of forever...' },
          { id: 'prewedding', emoji: '📸', title: 'Pre-Wedding Shoot', date: 'March 2026', status: 'coming-soon', description: 'Capturing our love story...' },
          { id: 'marriage', emoji: '💍', title: 'The Wedding', date: 'May 2026', status: 'coming-soon', description: 'Tying the knot...' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    if (event.status === 'active') {
      navigate(`/event/${event.id}`, { state: { event } });
    } else {
      toast('Coming Soon ✨', { icon: '🔒' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen relative flex flex-col w-full">
      <FloatingHearts />
      <Navbar />

      <main className="flex-1 flex flex-col items-center pt-10 pb-20 px-4 relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gold-500 via-peach to-rose-500 drop-shadow-[0_2px_10px_rgba(255,77,141,0.5)]">
            💍 Mani & Priya
          </h1>
          <h2 className="text-xl md:text-2xl font-poppins text-white/90 mb-3">
            Our Beautiful Journey ❤️
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lavender italic font-playfair tracking-wide"
          >
            From Ashirwad to Forever ✨
          </motion.p>
        </motion.div>

        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 77, 141, 0.4)' }}
                onClick={() => handleCardClick(event)}
                className="glass-card p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group h-full"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{event.emoji}</div>
                <h3 className="font-playfair text-2xl text-white mb-2">{event.title}</h3>
                
                <div className="bg-gold/20 border border-gold/50 text-gold px-4 py-1 rounded-full text-xs font-poppins font-medium mb-4">
                  {event.date}
                </div>
                
                <p className="font-poppins text-sm text-white/70 mb-8 flex-grow min-h-[40px]">
                  {event.description}
                </p>
                
                <div className={`mt-auto px-6 py-2 rounded-full font-poppins text-sm font-medium transition-colors w-full ${
                  event.status === 'active' 
                    ? 'bg-rose-500/20 border border-rose-500 text-white shadow-[0_0_15px_rgba(255,77,141,0.5)] group-hover:bg-rose-500'
                    : 'bg-white/5 border border-white/10 text-white/50'
                }`}>
                  {event.status === 'active' ? '✨ View Gallery' : '🔒 Coming Soon'}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
