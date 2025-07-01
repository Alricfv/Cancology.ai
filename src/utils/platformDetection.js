/**
 * Utility functions for detecting device platforms
 * 
 * This module provides helper functions to detect different device types and browsers.
 * It's used primarily for the Summary component to provide optimized PDF saving experiences
 * on mobile devices vs. desktop browsers.
 */

/**
 * Checks if the current device is a mobile device
 * @returns {boolean} True if the current device is a mobile device
 */
export const isMobileDevice = () => {
  // Check for common mobile user agent patterns
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // Check for touch capability as a supplementary indicator
  const hasTouchScreen = (
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || 
     navigator.maxTouchPoints > 0 || 
     navigator.msMaxTouchPoints > 0)
  );
  
  // Check for screen size typical of mobile devices
  const hasSmallScreen = (
    typeof window !== 'undefined' && 
    window.innerWidth <= 768
  );

  // Consider it a mobile device if user agent matches OR
  // it has both touch capability AND a small screen
  return mobileRegex.test(userAgent) || (hasTouchScreen && hasSmallScreen);
};

/**
 * Checks if the device is likely an iOS device (iPhone, iPad)
 * @returns {boolean} True if the device is likely an iOS device
 */
export const isIOSDevice = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /iPhone|iPad|iPod/i.test(userAgent);
};

/**
 * Checks if the device is likely an Android device
 * @returns {boolean} True if the device is likely an Android device
 */
export const isAndroidDevice = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /Android/i.test(userAgent);
};

/**
 * Checks if the current browser is Safari
 * @returns {boolean} True if the browser is Safari
 */
export const isSafariBrowser = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /^((?!chrome|android).)*safari/i.test(userAgent);
};
