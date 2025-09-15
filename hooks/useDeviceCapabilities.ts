import { useState, useEffect, useCallback } from 'react';
import { DeviceCapabilities } from '@/types/device';
import { detectDeviceCapabilities } from '@/utils/deviceDetection';

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    // Initialize with server-safe defaults
    return {
      isMobile: false,
      isTablet: false,
      hasTouch: false,
      supportsHover: true,
      screenSize: 'medium',
      orientation: 'portrait',
    };
  });

  const [isLoading, setIsLoading] = useState(true);

  const updateCapabilities = useCallback(() => {
    try {
      const newCapabilities = detectDeviceCapabilities();
      setCapabilities(newCapabilities);
      setIsLoading(false);
    } catch (error) {
      console.warn('Failed to update device capabilities:', error);
      // Keep existing capabilities and just mark as loaded
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial detection
    updateCapabilities();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      try {
        // Small delay to ensure dimensions are updated
        setTimeout(updateCapabilities, 100);
      } catch (error) {
        console.warn('Orientation change handler failed:', error);
      }
    };

    // Listen for resize events (covers orientation changes and window resizing)
    const handleResize = () => {
      try {
        updateCapabilities();
      } catch (error) {
        console.warn('Resize handler failed:', error);
      }
    };

    // Listen for network changes
    const handleConnectionChange = () => {
      try {
        updateCapabilities();
      } catch (error) {
        console.warn('Connection change handler failed:', error);
      }
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Network connection change listener (if supported)
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if ('connection' in navigator) {
        (navigator as any).connection?.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateCapabilities]);

  return {
    ...capabilities,
    isLoading,
    refresh: updateCapabilities,
  };
};