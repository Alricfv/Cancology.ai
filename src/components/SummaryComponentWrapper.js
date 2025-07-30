import React, { useState, useEffect } from 'react';
import { Spinner, Center } from '@chakra-ui/react';
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
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
      setIsLoading(false);
    };
    
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

  return isMobile ? 
    <MobileSummaryComponent {...props} onStartNewScreening={props.onStartNewScreening} /> : 
    <SummaryComponent {...props} onStartNewScreening={props.onStartNewScreening} />;
};

export default SummaryComponentWrapper;
