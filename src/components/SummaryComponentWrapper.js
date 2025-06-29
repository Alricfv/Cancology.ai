import React, { useState, useEffect } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import MobileSummaryComponent from './MobileSummaryComponent';
import SummaryComponent from '../SummaryComponent';
import { isMobileDevice } from '../utils/platformDetection';

/**
 * A wrapper component that renders different summary components based on the detected platform
 */
const SummaryComponentWrapper = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect if the device is mobile on component mount
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
      setIsLoading(false);
    };
    
    // Brief delay to ensure all device detection APIs are available
    const timeoutId = setTimeout(checkMobile, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="#5770D2" thickness="4px" />
      </Center>
    );
  }
  
  // Render the appropriate component based on the detected platform
  return isMobile ? 
    <MobileSummaryComponent {...props} /> : 
    <SummaryComponent {...props} />;
};

export default SummaryComponentWrapper;
