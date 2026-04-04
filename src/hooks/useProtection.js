import { useEffect } from 'react';

export const useProtection = () => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();

    // Disable drag
    const handleDragStart = (e) => e.preventDefault();

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['s', 'u', 'p'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.key === 'F12') ||
        (e.key === 'PrintScreen')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // Add global CSS to disable user select on images
    const style = document.createElement('style');
    style.id = 'protection-global-styles';
    style.innerHTML = `
      img {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        pointer-events: none;
      }
      .protect-image-wrapper {
        position: relative;
        display: inline-block;
      }
      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      const existingStyle = document.getElementById('protection-global-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
};
