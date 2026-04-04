import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useProtection } from './hooks/useProtection';
import Home from './pages/Home';
import EventPage from './pages/EventPage';
import MusicToggle from './components/MusicToggle';

function App() {
  // Apply globally using custom hook
  useProtection();

  return (
    <div className="w-full min-h-screen text-white font-poppins flex flex-col">
      {/* Toast provider for notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(26, 10, 46, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 77, 141, 0.3)',
            fontFamily: '"Poppins", sans-serif',
            fontSize: '14px',
            borderRadius: '9999px',
          },
          success: {
            iconTheme: {
              primary: '#FFD700',
              secondary: '#1A0A2E',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        {/* Handle unknowns */}
        <Route path="*" element={<Home />} />
      </Routes>

      <MusicToggle />

      <div className="fixed bottom-2 left-0 w-full text-center z-40 pointer-events-none opacity-40">
        <p className="text-[10px] sm:text-xs text-white/50 font-poppins">
          🔒 This gallery is protected. Screenshots may still be possible on some devices. Please respect our privacy.
        </p>
      </div>
    </div>
  );
}

export default App;
