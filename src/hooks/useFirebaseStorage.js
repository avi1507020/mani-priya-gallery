import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const useFirebaseStorage = (path) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      if (!path) return;
      setLoading(true);
      setError(null);
      try {
        const listRef = ref(storage, path);
        const res = await listAll(listRef);
        
        const filePromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        });
        
        const filesData = await Promise.all(filePromises);
        if(isMounted) {
            setFiles(filesData);
        }
      } catch (err) {
        if(isMounted) {
            console.error("Error fetching files:", err);
            setError(err.message);
        }
      } finally {
        if(isMounted) {
            setLoading(false);
        }
      }
    };

    fetchFiles();
    return () => { isMounted = false; };
  }, [path]);

  return { files, loading, error };
};
