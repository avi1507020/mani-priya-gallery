const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const FOLDER_MAP = {
  ashirwad: {
    photos: import.meta.env.VITE_ASHIRWAD_PHOTOS_ID,
    videos: import.meta.env.VITE_ASHIRWAD_VIDEOS_ID,
  },
  prewedding: {
    photos: import.meta.env.VITE_PREWEDDING_PHOTOS_ID,
    videos: import.meta.env.VITE_PREWEDDING_VIDEOS_ID,
  },
  marriage: {
    photos: import.meta.env.VITE_MARRIAGE_PHOTOS_ID,
    videos: import.meta.env.VITE_MARRIAGE_VIDEOS_ID,
  },
};

export const fetchDriveFiles = async (eventId, type) => {
  try {
    const folderId = FOLDER_MAP[eventId]?.[type];
    if (!folderId) {
      throw new Error(`Folder ID not found for event: ${eventId}, type: ${type}`);
    }

    const mimeTypeQuery = type === 'photos' ? "mimeType contains 'image/'" : "mimeType contains 'video/'";
    
    // Using Drive API v3
    const query = `'${folderId}' in parents and trashed = false and ${mimeTypeQuery}`;
    const fields = "files(id, name, mimeType, createdTime, thumbnailLink, webContentLink, webViewLink)";
    
    const url = `https://www.googleapis.com/drive/v3/files?key=${API_KEY}&q=${encodeURIComponent(query)}&orderBy=createdTime desc&fields=${encodeURIComponent(fields)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Google Drive');
    }
    
    const data = await response.json();
    
    return data.files.map(file => {
      // Modify thumbnailLink to request higher resolution if possible, or fallback manually
      let thumbnailUrl = file.thumbnailLink;
      if (thumbnailUrl) {
          thumbnailUrl = thumbnailUrl.replace(/=s\d+/, '=w800');
      } else {
          thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
      }
        
      return {
        id: file.id,
        name: file.name,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=s800`,
        embedUrl: `https://drive.google.com/file/d/${file.id}/preview`,
        viewUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
        downloadUrl: file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`,
        mimeType: file.mimeType
      };
    });
    
  } catch (error) {
    console.error("Google Drive Fetch Error:", error);
    throw error;
  }
};
