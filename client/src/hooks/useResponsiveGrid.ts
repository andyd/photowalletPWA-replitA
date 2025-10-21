import { useState, useEffect } from 'react';

interface GridConfig {
  columns: number;
  gap: number;
  minPhotoSize: number;
}

/**
 * Hook to calculate optimal grid columns based on viewport width
 * Ensures photos are always visible and fill the screen efficiently
 */
export function useResponsiveGrid(): GridConfig {
  const [columns, setColumns] = useState(3);
  
  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      const padding = 32; // 16px on each side
      const gap = 8; // gap between items
      const minPhotoSize = 100; // minimum photo size in pixels
      const maxPhotoSize = 200; // maximum photo size in pixels
      
      // Calculate available width
      const availableWidth = width - padding;
      
      // Calculate how many columns can fit with ideal photo size
      let optimalColumns = 3; // default
      
      // Try different column counts to find the best fit
      for (let cols = 2; cols <= 8; cols++) {
        const photoWidth = (availableWidth - (gap * (cols - 1))) / cols;
        
        // If photos would be in our ideal size range, use this column count
        if (photoWidth >= minPhotoSize && photoWidth <= maxPhotoSize) {
          optimalColumns = cols;
          break;
        }
        
        // If we're getting too small, stop and use previous
        if (photoWidth < minPhotoSize) {
          optimalColumns = Math.max(2, cols - 1);
          break;
        }
      }
      
      // Responsive breakpoints with dynamic sizing
      if (width < 480) {
        // Small phones: 2-3 columns
        optimalColumns = Math.min(optimalColumns, 3);
      } else if (width < 768) {
        // Large phones: 3-4 columns  
        optimalColumns = Math.min(Math.max(optimalColumns, 3), 4);
      } else if (width < 1024) {
        // Tablets: 4-5 columns
        optimalColumns = Math.min(Math.max(optimalColumns, 4), 5);
      } else if (width < 1440) {
        // Small desktop: 5-6 columns
        optimalColumns = Math.min(Math.max(optimalColumns, 5), 6);
      } else {
        // Large desktop: 6-8 columns
        optimalColumns = Math.min(Math.max(optimalColumns, 6), 8);
      }
      
      setColumns(optimalColumns);
    };
    
    calculateColumns();
    
    // Recalculate on resize with debouncing
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateColumns, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return {
    columns,
    gap: 8,
    minPhotoSize: 100,
  };
}

