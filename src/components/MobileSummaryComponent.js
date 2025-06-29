import React, { useRef } from 'react';
import {
  Box,
  Text,
  Button,
  Icon,
  Heading,
  useColorModeValue,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
  Flex,
  Grid,
  GridItem,
  Stack
} from '@chakra-ui/react';
import { FaCheckCircle, FaPrint, FaShare, FaDownload, FaEnvelope } from 'react-icons/fa';
import { getPrescribedTests } from '../testPrescription';
import { isIOSDevice, isAndroidDevice } from '../utils/platformDetection';

/**
 * MobileSummaryComponent - Optimized for mobile devices with alternative saving methods
 */
const MobileSummaryComponent = ({ userResponses, handleOptionSelectCall }) => {
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const summaryRef = useRef(null);
  const bgGradient = 'linear(to-b, white, #D4E1F3)';
  
  // Share the summary via native share API if available
  const shareSummary = async () => {
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Create a simple text summary
        const textSummary = generateTextSummary();
        
        await navigator.share({
          title: 'Cancer Screening Summary',
          text: textSummary,
        });
      } 
      // No else block needed - if sharing isn't available, the button won't show
    } catch (error) {
      console.error("Error sharing summary:", error);
      // Silent error - no toast
    }
  };
  
  // Generate a text representation of the summary for sharing
  const generateTextSummary = () => {
    const riskScore = calculateRiskScore();
    const { category } = getHealthCategory(riskScore);
    const prescribedTests = getPrescribedTests(userResponses);
    const recommendations = getRecommendations();
    
    let summary = `CANCER SCREENING SUMMARY\n\n`;
    summary += `Risk Category: ${category}\n\n`;
    summary += `RECOMMENDED SCREENING TESTS:\n`;
    
    prescribedTests.forEach(test => {
      summary += `- ${test.name}: ${test.description}\n`;
    });
    
    summary += `\nGENERAL RECOMMENDATIONS:\n`;
    recommendations.forEach(rec => {
      summary += `- ${rec}\n`;
    });
    
    summary += `\nPlease consult with your healthcare provider about these recommendations.`;
    
    return summary;
  };
  
  // Print function for mobile - adapted for better mobile compatibility
  const printSummary = () => {
    try {
      // First, ensure the content is prepared for printing
      const summary = summaryRef.current;
      
      // Store original styles
      const originalHeight = summary.style.height;
      const originalOverflow = summary.style.overflow;
      const originalMaxHeight = summary.style.maxHeight;
      
      // Create a fullscreen overlay with the content for printing
      const printOverlay = document.createElement('div');
      printOverlay.id = 'print-overlay';
      printOverlay.style.position = 'fixed';
      printOverlay.style.top = '0';
      printOverlay.style.left = '0';
      printOverlay.style.width = '100%';
      printOverlay.style.height = 'auto';
      printOverlay.style.background = 'white';
      printOverlay.style.zIndex = '9999';
      printOverlay.style.overflow = 'auto';
      
      // Clone the summary content without the "no-print" elements
      const contentClone = summary.cloneNode(true);
      const noPrintElements = contentClone.querySelectorAll('.no-print');
      noPrintElements.forEach(el => el.remove());
      printOverlay.appendChild(contentClone);
      
      // Add mobile-optimized print styles
      const style = document.createElement('style');
      style.id = 'mobile-print-styles';
      
      style.innerHTML = `
        @media print {
          .no-print { display: none !important; }
          
          #print-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          .mobile-summary-container {
            width: 100% !important;
            padding: 5mm !important;
            margin: 0 !important;
            font-size: 12px !important;
            height: auto !important;
            overflow: visible !important;
            page-break-inside: avoid !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          h2 { font-size: 16px !important; }
          h3 { font-size: 14px !important; }
          
          /* Force each section to display fully */
          .chakra-box, .chakra-stack {
            page-break-inside: avoid !important;
            display: block !important;
          }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(printOverlay);
      
      // Modify the summary for printing
      summary.style.height = 'auto';
      summary.style.maxHeight = 'none';
      summary.style.overflow = 'visible';
      
      const cleanup = () => {
        // Remove the print overlay
        const overlayElement = document.getElementById('print-overlay');
        if (overlayElement) overlayElement.remove();
        
        // Remove the print styles
        const styleElement = document.getElementById('mobile-print-styles');
        if (styleElement) styleElement.remove();
        
        // Restore original styles
        summary.style.height = originalHeight;
        summary.style.overflow = originalOverflow;
        summary.style.maxHeight = originalMaxHeight;
        
        window.removeEventListener('afterprint', cleanup);
      };
      
      window.addEventListener('afterprint', cleanup);
      // Print without showing tips
      
      setTimeout(() => {
        window.print();
      }, 500);
      
    } catch (error) {
      console.error("Mobile print error:", error);
      // Silent error - no toast
    }
  };
  
  // Function to download a text summary
  const downloadTextSummary = () => {
    try {
      const textSummary = generateTextSummary();
      const element = document.createElement('a');
      const file = new Blob([textSummary], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "Cancer_Screening_Summary.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Text download error:", error);
    }
  };
  
  // Calculate risk factors
  const calculateRiskScore = () => {
    let riskScore = 0;
    
    // Age risk
    if (userResponses.demographics.age > 60) riskScore += 3;
    else if (userResponses.demographics.age > 40) riskScore += 2;
    else if (userResponses.demographics.age > 30) riskScore += 1;
    
    // Cancer history
    if (userResponses.medicalHistory.personalCancer.diagnosed) riskScore += 4;
    if (userResponses.medicalHistory.familyCancer.diagnosed) riskScore += 3;
    
    // Chronic conditions
    riskScore += Math.min(userResponses.medicalHistory.chronicConditions.length, 3);
    
    // Smoking
    if (userResponses.lifestyle.smoking.current) {
      riskScore += 3;
      if (userResponses.lifestyle.smoking.packYears >= 30) riskScore += 3;
      else if (userResponses.lifestyle.smoking.packYears >= 20) riskScore += 2;
      else if (userResponses.lifestyle.smoking.packYears >= 10) riskScore += 1;
    }
    
    // Alcohol consumption
    if (userResponses.lifestyle.alcohol?.consumes && userResponses.lifestyle.alcohol?.drinksPerWeek > 5) {
      const excessDrinks = userResponses.lifestyle.alcohol.drinksPerWeek - 5;
      const additionalRiskScore = Math.floor(excessDrinks / 3);
      riskScore += additionalRiskScore;
    }
    
    // Sexual health risk
    if (userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv) {
      riskScore += 2;
    }
    
    // Transplant
    if (userResponses.lifestyle.transplant) riskScore += 2;
    
    // Sex-specific factors
    if (userResponses.demographics.sex === 'Male') {
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) riskScore += 1;
      if (userResponses.sexSpecificInfo.male.testicularIssues) riskScore += 1;
      if (!userResponses.sexSpecificInfo.male.prostateTest.had && userResponses.demographics.age > 50) riskScore += 2;
    }
    
    if (userResponses.demographics.sex === 'Female') {
      if (userResponses.sexSpecificInfo.female.hormoneTreatment) riskScore += 1;
    }
    
    // Vaccination status
    if (!userResponses.vaccinations.hpv && userResponses.demographics.age < 45) riskScore += 1;
    if (!userResponses.vaccinations.hepB) riskScore += 1;
    
    // Cancer screening history
    if (!userResponses.cancerScreening.hadScreening && userResponses.demographics.age > 40) riskScore += 2;
    
    return riskScore;
  };
  
  const getHealthCategory = (score) => {
    if (score <= 3) return { category: "Low Risk", color: "green" };
    if (score <= 7) return { category: "Moderate Risk", color: "yellow" };
    if (score <= 12) return { category: "High Risk", color: "orange" };
    return { category: "Very High Risk", color: "red" };
  };
  
  const getRecommendations = () => {
    const age = userResponses.demographics.age;
    const sex = userResponses.demographics.sex;
    const hasFamilyCancer = userResponses.medicalHistory.familyCancer.diagnosed;
    const recommendations = [];
    
    // General recommendations
    if (hasFamilyCancer) {
      recommendations.push("Consider genetic counseling to assess inherited cancer risks.");
    }
    
    // Diet and exercise
    recommendations.push("Maintain a healthy diet rich in fruits, vegetables, and whole grains.");
    recommendations.push("Engage in regular physical activity (at least 150 minutes of moderate activity weekly).");
    
    // Based on risk factors
    if (userResponses.lifestyle.smoking.current) {
      recommendations.push("Seek support for smoking cessation - this significantly reduces cancer risk.");
    }
    
    if (userResponses.lifestyle.alcohol?.consumes && userResponses.lifestyle.alcohol?.drinksPerWeek > 5) {
      recommendations.push("Reduce alcohol consumption to no more than 1 drink per day for women or 2 for men.");
    }
    
    return recommendations;
  };
  
  // Get device-specific helper text
  // Device helper text function removed
  
  const riskScore = calculateRiskScore();
  const { category, color } = getHealthCategory(riskScore);
  const prescribedTests = getPrescribedTests(userResponses);
  const recommendations = getRecommendations();
  
  return (
    <Box
      ref={summaryRef}
      className="mobile-summary-container"
      maxW="100%"
      mx="auto"
      my={2}
      p={4}
      bgGradient={bgGradient}
      boxShadow="md"
      borderRadius="lg"
      overflow="auto"
    >
      {/* Alert removed */}

      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Heading as="h2" size="xl" color="#5770D2">Cancer Screening Summary</Heading>
        <Text fontSize="md" color="gray.600" mt={1}>
          Sky Premium Hospital
        </Text>
        <Text fontSize="sm" color="gray.500">
          Date: {new Date().toLocaleDateString()}
        </Text>
      </Box>

      <Divider my={4} />

      {/* Patient Information */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Patient Information
        </Heading>
        <Box mb={3}>
          <Text><strong>Age:</strong> {userResponses.demographics.age}</Text>
          <Text><strong>Sex:</strong> {userResponses.demographics.sex}</Text>
        </Box>

        {/* Sex-specific Information */}
        {userResponses.demographics.sex === "Male" && (
          <Box mt={2}>
            <Text fontSize="sm" fontWeight="bold" mb={1}>Male-specific Information:</Text>
            <Text fontSize="sm"><strong>Urinary Symptoms:</strong> {userResponses.sexSpecificInfo.male.urinarySymptoms ? "Yes" : "No"}</Text>
            <Text fontSize="sm"><strong>Testicular Issues:</strong> {userResponses.sexSpecificInfo.male.testicularIssues ? "Yes" : "No"}</Text>
            <Text fontSize="sm"><strong>Prostate Test:</strong> {userResponses.sexSpecificInfo.male.prostateTest.had ? "Yes" : "No"}</Text>
          </Box>
        )}

        {userResponses.demographics.sex === "Female" && (
          <Box mt={2}>
            <Text fontSize="sm" fontWeight="bold" mb={1}>Female-specific Information:</Text>
            <Text fontSize="sm"><strong>First Period Age:</strong> {userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}</Text>
            <Text fontSize="sm"><strong>Menstruation Status:</strong> {userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}</Text>
            <Text fontSize="sm"><strong>Pregnancy History:</strong> {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "Yes" : "No"}</Text>
            {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy && (
              <Text fontSize="sm"><strong>Age at First Pregnancy:</strong> {userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'}</Text>
            )}
            <Text fontSize="sm"><strong>Hormone Treatment:</strong> {userResponses.sexSpecificInfo.female.hormoneTreatment ? "Yes" : "No"}</Text>
          </Box>
        )}
      </Box>

      {/* Medical History Section */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Medical History
        </Heading>
        <Text><strong>Personal Cancer History:</strong> {userResponses.medicalHistory.personalCancer.diagnosed ? "Yes" : "No"}</Text>
        {userResponses.medicalHistory.personalCancer.diagnosed && userResponses.medicalHistory.personalCancer.details && (
          <Text fontSize="sm" mt={1}>"{userResponses.medicalHistory.personalCancer.details}"</Text>
        )}
        <Text><strong>Family Cancer History:</strong> {userResponses.medicalHistory.familyCancer.diagnosed ? "Yes" : "No"}</Text>
        {userResponses.medicalHistory.familyCancer.diagnosed && userResponses.medicalHistory.familyCancer.details && (
          <Text fontSize="sm" mt={1}>"{userResponses.medicalHistory.familyCancer.details}"</Text>
        )}
        {userResponses.medicalHistory.chronicConditions.length > 0 && (
          <>
            <Text mt={2}><strong>Chronic Conditions:</strong></Text>
            <List pl={4} mt={1} spacing={1}>
              {userResponses.medicalHistory.chronicConditions.map((condition, idx) => (
                <ListItem key={idx} fontSize="sm">{condition}</ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
      
      {/* Vaccination and Screening History */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Vaccinations & Screening History
        </Heading>
        <Text><strong>HPV Vaccine:</strong> {userResponses.vaccinations.hpv ? "Yes" : "No"}</Text>
        <Text><strong>Hepatitis B Vaccine:</strong> {userResponses.vaccinations.hepB ? "Yes" : "No"}</Text>
        <Text><strong>Previous Cancer Screening:</strong> {userResponses.cancerScreening.hadScreening ? "Yes" : "No"}</Text>
        {userResponses.cancerScreening.hadScreening && userResponses.cancerScreening.details && (
          <Text fontSize="sm" mt={1}>"{userResponses.cancerScreening.details}"</Text>
        )}
      </Box>

      {/* Lifestyle Information */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Lifestyle Information
        </Heading>
        <Text><strong>Smoking Status:</strong> {userResponses.lifestyle.smoking.current ? "Current smoker" : userResponses.lifestyle.smoking.former ? "Former smoker" : "Non-smoker"}</Text>
        {(userResponses.lifestyle.smoking.current || userResponses.lifestyle.smoking.former) && (
          <Text><strong>Pack-Years:</strong> {userResponses.lifestyle.smoking.packYears || 'Not specified'}</Text>
        )}
        <Text><strong>Alcohol Consumption:</strong> {userResponses.lifestyle.alcohol?.consumes ? "Yes" : "No"}</Text>
        {userResponses.lifestyle.alcohol?.consumes && (
          <Text><strong>Drinks per Week:</strong> {userResponses.lifestyle.alcohol.drinksPerWeek || 'Not specified'}</Text>
        )}
        <Text><strong>Sexually Active:</strong> {userResponses.lifestyle.sexualHealth?.active ? "Yes" : "No"}</Text>
      </Box>

      {/* Risk Category */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Risk Assessment
        </Heading>
        <Flex justify="center" align="center">
          <Text fontWeight="bold" mr={2}>Risk Category:</Text>
          <Badge 
            colorScheme={color} 
            fontSize="lg" 
            p={2} 
            borderRadius="md" 
            variant="solid"
          >
            {category}
          </Badge>
        </Flex>
        <Text textAlign="center" fontSize="sm" mt={2}>
          Age Group: {
            userResponses.demographics.age < 18 ? 'Pediatric' : 
            userResponses.demographics.age < 36 ? 'Young Adult' : 
            userResponses.demographics.age < 56 ? 'Middle-Aged' : 
            userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'
          }
        </Text>
      </Box>

      <Divider my={4} />

      {/* Recommended Tests */}
      <Box mb={6}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          Recommended Screening Tests
        </Heading>
        <List spacing={3}>
          {prescribedTests.map((test, index) => (
            <ListItem key={index} mb={3}>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              <Text as="span" fontWeight="bold">{test.name}</Text>
              <Box mt={1} ml={6}>
                <Text fontSize="sm">{test.description}</Text>
                <Text fontSize="sm" color="gray.600" mt={1}><strong>Why:</strong> {test.reason}</Text>
                <Text fontSize="sm" color="gray.600"><strong>Frequency:</strong> {test.frequency}</Text>
                <Badge 
                  colorScheme={test.priority === "high" ? "red" : test.priority === "medium" ? "orange" : "green"} 
                  mt={1}
                  fontSize="xs"
                >
                  {test.urgency}
                </Badge>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* General Recommendations */}
      <Box mb={4}>
        <Heading as="h3" size="md" mb={3} color="#5770D2">
          General Recommendations
        </Heading>
        <List spacing={2}>
          {recommendations.map((recommendation, index) => (
            <ListItem key={index}>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              {recommendation}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Disclaimer */}
      <Text fontSize="sm" fontStyle="italic" mt={6}>
        This summary is based on the information you provided and serves as a general guide only. Please consult with your healthcare provider for personalized medical advice.
      </Text>

      {/* Mobile-specific Action Buttons */}
      <Stack direction="column" spacing={3} mt={5} className="no-print">
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={FaPrint} />}
          onClick={printSummary}
          size="md"
          w="100%"
        >
          Print/Save as PDF
        </Button>

        <Button
          colorScheme="purple"
          leftIcon={<Icon as={FaDownload} />}
          onClick={downloadTextSummary}
          size="md"
          w="100%"
        >
          Download Text Summary
        </Button>

        {navigator.share && (
          <Button
            colorScheme="blue"
            leftIcon={<Icon as={FaShare} />}
            onClick={shareSummary}
            size="md"
            w="100%"
          >
            Share Summary
          </Button>
        )}

        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          w="100%"
          onClick={() => handleOptionSelectCall("Start a new screening", "start")}
        >
          Start New Screening
        </Button>

      </Stack>
    </Box>
  );
};

export default MobileSummaryComponent;
