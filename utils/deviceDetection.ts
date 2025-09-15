import { DeviceCapabilities, ScreenInfo, TouchCapabilities } from '@/types/device';

export const detectScreenSize = (): 'small' | 'medium' | 'large' => {
  if (typeof window === 'undefined') return 'medium';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'small';
  if (width < 1024) return 'medium';
  return 'large';
};

export const detectOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

export const detectTouchCapabilities = (): TouchCapabilities => {
  if (typeof window === 'undefined') {
    return {
      maxTouchPoints: 0,
      hasTouch: false,
      supportsPointerEvents: false,
      supportsHover: false,
    };
  }

  try {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const supportsPointerEvents = 'PointerEvent' in window;
    
    // Safely check for hover support with fallback
    let supportsHover = false;
    try {
      supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    } catch (e) {
      // Fallback: assume hover support if matchMedia fails
      supportsHover = !hasTouch;
    }

    return {
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hasTouch,
      supportsPointerEvents,
      supportsHover,
    };
  } catch (error) {
    // Fallback to safe defaults if any detection fails
    console.warn('Touch capability detection failed:', error);
    return {
      maxTouchPoints: 0,
      hasTouch: false,
      supportsPointerEvents: false,
      supportsHover: true,
    };
  }
};

export const getScreenInfo = (): ScreenInfo => {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      pixelRatio: 1,
      availableWidth: 1024,
      availableHeight: 768,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    availableWidth: screen.availWidth,
    availableHeight: screen.availHeight,
  };
};

export const isMobileDevice = (): boolean => {
  const screenSize = detectScreenSize();
  const touchCapabilities = detectTouchCapabilities();
  
  // Primary indicator: small screen with touch
  if (screenSize === 'small' && touchCapabilities.hasTouch) {
    return true;
  }

  // Secondary indicator: touch device without hover support
  if (touchCapabilities.hasTouch && !touchCapabilities.supportsHover) {
    return true;
  }

  return false;
};

export const isTabletDevice = (): boolean => {
  const screenSize = detectScreenSize();
  const touchCapabilities = detectTouchCapabilities();
  
  // Medium screen with touch capabilities
  if (screenSize === 'medium' && touchCapabilities.hasTouch) {
    return true;
  }

  // Large screen with touch but no hover (some tablets)
  if (screenSize === 'large' && touchCapabilities.hasTouch && !touchCapabilities.supportsHover) {
    return true;
  }

  return false;
};

export const detectDeviceCapabilities = (): DeviceCapabilities => {
  try {
    const touchCapabilities = detectTouchCapabilities();
    const isMobile = isMobileDevice();
    const isTablet = isTabletDevice();

    return {
      isMobile,
      isTablet,
      hasTouch: touchCapabilities.hasTouch,
      supportsHover: touchCapabilities.supportsHover,
      screenSize: detectScreenSize(),
      orientation: detectOrientation(),
    };
  } catch (error) {
    // Fallback to safe defaults if detection fails
    console.warn('Device capability detection failed:', error);
    return {
      isMobile: false,
      isTablet: false,
      hasTouch: false,
      supportsHover: true,
      screenSize: 'medium',
      orientation: 'portrait',
    };
  }
};