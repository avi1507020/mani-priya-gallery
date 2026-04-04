import React, { createContext, useState, useRef, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const musicRef = ref(storage, 'music/bg.mp3');
        const url = await getDownloadURL(musicRef);
        setAudioUrl(url);
        audioRef.current.src = url;
        audioRef.current.loop = true;
      } catch (error) {
        console.error("Music not found. Please upload to /music/bg.mp3 in Storage.", error);
      }
    };
    fetchMusic();

    return () => {
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && audioRef.current.src) {
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => setIsPlaying(prev => !prev);

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};
