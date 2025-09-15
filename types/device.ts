export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  hasTouch: boolean;
  supportsHover: boolean;
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
}

export interface ScreenInfo {
  width: number;
  height: number;
  pixelRatio: number;
  availableWidth: number;
  availableHeight: number;
}

export interface TouchCapabilities {
  maxTouchPoints: number;
  hasTouch: boolean;
  supportsPointerEvents: boolean;
  supportsHover: boolean;
}