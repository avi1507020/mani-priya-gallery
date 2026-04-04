import { useState, useEffect } from 'react';
import { fetchDriveFiles } from '../services/googleDrive';

export const useDriveMedia = (eventId, type) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const getMedia = async () => {
      setLoading(true);
      setError(null);
      if (isMounted) setFiles([]); // Clear previous files while fetching
      
      try {
        const data = await fetchDriveFiles(eventId, type);
        if (isMounted) {
          setFiles(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error fetching media files');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (eventId && type) {
      getMedia();
    }

    return () => {
      isMounted = false;
      setFiles([]); // Cleanup on unmount or id change
    };
  }, [eventId, type]);

  return { files, loading, error };
};
