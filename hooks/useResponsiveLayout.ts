import { useState, useEffect, useCallback } from 'react'
import { useDeviceCapabilities } from './useDeviceCapabilities'

export interface Breakpoints {
  mobile: number
  tablet: number
  desktop: number
}

export interface LayoutConfig {
  breakpoints: Breakpoints
  orientation: 'portrait' | 'landscape'
}

export interface ResponsiveLayoutState {
  screenSize: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
  isTablet: boolean
  isMobile: boolean
  isDesktop: boolean
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
}

const DEFAULT_CONFIG: LayoutConfig = {
  breakpoints: DEFAULT_BREAKPOINTS,
  orientation: 'portrait',
}

export const useResponsiveLayout = (initialConfig: Partial<LayoutConfig> = {}) => {
  const deviceCapabilities = useDeviceCapabilities()

  const [config, setConfig] = useState<LayoutConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig
  })

  const [layoutState, setLayoutState] = useState<ResponsiveLayoutState>({
    screenSize: 'mobile',
    orientation: 'portrait',
    isTablet: false,
    isMobile: true,
    isDesktop: false
  })

  const updateLayoutState = useCallback(() => {
    // Use enhanced device capabilities instead of basic window dimensions
    const { isMobile, isTablet, screenSize, orientation } = deviceCapabilities

    // Map device capabilities screen size to our layout screen size
    let layoutScreenSize: 'mobile' | 'tablet' | 'desktop' = 'mobile'
    if (screenSize === 'large') {
      layoutScreenSize = 'desktop'
    } else if (screenSize === 'medium' || isTablet) {
      layoutScreenSize = 'tablet'
    }

    const isDesktop = layoutScreenSize === 'desktop'

    setLayoutState({
      screenSize: layoutScreenSize,
      orientation,
      isTablet,
      isMobile,
      isDesktop
    })

    // Update config orientation
    setConfig(prev => ({
      ...prev,
      orientation
    }))
  }, [deviceCapabilities])

  const handleOrientationChange = useCallback(() => {
    // Small delay to ensure dimensions are updated
    setTimeout(updateLayoutState, 100)
  }, [updateLayoutState])

  useEffect(() => {
    updateLayoutState()

    window.addEventListener('resize', updateLayoutState)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', updateLayoutState)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [updateLayoutState, handleOrientationChange])

  const updateBreakpoints = useCallback((newBreakpoints: Partial<Breakpoints>) => {
    setConfig(prev => ({
      ...prev,
      breakpoints: {
        ...prev.breakpoints,
        ...newBreakpoints
      }
    }))
  }, [])

  return {
    config,
    layoutState,
    updateBreakpoints,
    setConfig
  }
}