/**
 * Utility functions for detecting device platforms
 */
export const isMobileDevice = () => {
  // Check for common mobile user agent patterns
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  const hasTouchScreen = (
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || 
     navigator.maxTouchPoints > 0 || 
     navigator.msMaxTouchPoints > 0)
  );
  
  const hasSmallScreen = (
    typeof window !== 'undefined' && 
    window.innerWidth <= 768
  );

  // Consider it a mobile device if user agent matches OR it has both touch capability AND a small screen
  return mobileRegex.test(userAgent) || (hasTouchScreen && hasSmallScreen);
};

export const isIOSDevice = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /iPhone|iPad|iPod/i.test(userAgent);
};

export const isAndroidDevice = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /Android/i.test(userAgent);
};


export const isSafariBrowser = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  return /^((?!chrome|android).)*safari/i.test(userAgent);
};
