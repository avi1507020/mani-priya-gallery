export const addWatermark = async (imageUrl, eventName) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Setup text style
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 16px Poppins, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      const text = `Mani ❤️ Priya | ${eventName || 'Our Journey'}`;
      
      // Add a slight dark shadow for visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const padding = 20;
      ctx.fillText(text, canvas.width - padding, canvas.height - padding);
      
      // Return blob
      canvas.toBlob((blob) => {
        if(blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.95);
    };
    img.onerror = (err) => reject(new Error('Failed to load image for watermarking'));
    img.src = imageUrl;
  });
};
