import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useProtection } from './hooks/useProtection';
import Home from './pages/Home';
import EventPage from './pages/EventPage';
import FloatingHearts from './components/FloatingHearts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  useProtection();

  return (
    <div className="relative min-h-screen text-white font-poppins w-full flex flex-col bg-animated-gradient selection:bg-rose selection:text-white">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(26, 10, 46, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 77, 141, 0.3)',
            fontFamily: '"Poppins", sans-serif',
          },
        }}
      />

      <FloatingHearts />
      <Navbar />

      <main className="flex-1 w-full relative z-10 flex flex-col pt-[60px] md:pt-[68px] lg:pt-[72px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/event/:eventId/:tabId" element={<EventPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
