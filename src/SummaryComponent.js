import React, { useRef } from 'react';
import {
  Box,
  Text,
  Button,
  Icon,
  Heading,
  useColorModeValue,
  useToast,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FaCheckCircle, FaPrint } from 'react-icons/fa';
import { getPrescribedTests } from './testPrescription';

// Create a SummaryComponent to show at the end
const SummaryComponent = ({ userResponses, handleOptionSelect }) => {
  const toast = useToast();
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const summaryRef = useRef(null);
  
  // Calculate risk factors
  const calculateRiskScore = () => {
    let riskScore = 0;
    
    // Age risk (higher for older individuals)
    if (userResponses.demographics.age > 60) riskScore += 3;
    else if (userResponses.demographics.age > 40) riskScore += 2;
    else if (userResponses.demographics.age > 30) riskScore += 1;
    
    // Cancer history
    if (userResponses.medicalHistory.personalCancer.diagnosed) riskScore += 4;
    if (userResponses.medicalHistory.familyCancer.diagnosed) riskScore += 3;
    
    // Chronic conditions
    riskScore += Math.min(userResponses.medicalHistory.chronicConditions.length, 3);    // Smoking
    if (userResponses.lifestyle.smoking.current) {riskScore += 3;
      // Using pack-years as a more accurate measure of smoking history
      if (userResponses.lifestyle.smoking.packYears >= 30) riskScore += 3;
      else if (userResponses.lifestyle.smoking.packYears >= 20) riskScore += 2;
      else if (userResponses.lifestyle.smoking.packYears >= 10) riskScore += 1;
    }
      // Alcohol consumption
    if (userResponses.lifestyle.alcohol?.consumes && userResponses.lifestyle.alcohol?.drinksPerWeek > 5) {
      // +1 risk score for every 3 drinks above 5 drinks per week
      const excessDrinks = userResponses.lifestyle.alcohol.drinksPerWeek - 5;
      const additionalRiskScore = Math.floor(excessDrinks / 3);
      riskScore += additionalRiskScore;
    }
    
    // Sexual health risk
    if (userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv) {
      // High risk sexual behavior or HPV/HIV diagnosis increases risk score
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
      if (!userResponses.sexSpecificInfo.female.hpvVaccine && userResponses.demographics.age < 45) riskScore += 1;
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
      recommendations.push("Consider genetic counseling for inherited cancer risk");
    }

    if (userResponses.medicalHistory.chronicConditions.includes("Diabetes")) {
      recommendations.push("Regular HbA1c monitoring");
    }
    
    if (sex === "Male") {
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) {
        recommendations.push("Urological evaluation recommended");
      }

      if (userResponses.sexSpecificInfo.male.testicularIssues) {
        recommendations.push("Testicular self-examinations and specialist consultation");
      }
    }
      // Vaccination recommendations
    if (!userResponses.vaccinations.hpv && age < 45) {
      recommendations.push("Consider HPV vaccination if eligible");
    }
    
    if (!userResponses.vaccinations.hepB) {
      recommendations.push("Consider Hepatitis B vaccination");
    }
      // Sexual health recommendations
    if (userResponses.lifestyle && userResponses.lifestyle.sexualHealth && 
        userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) {
      recommendations.push("Practice safe sex to reduce cancer risk");
    }
    
    // Cancer screening recommendations based on screening history
    if (!userResponses.cancerScreening.hadScreening) {
      if (age >= 45) {
        recommendations.push("Discuss appropriate cancer screening tests with your healthcare provider");
      }
    }
    
    return recommendations;
  };

  const riskScore = calculateRiskScore();
  const healthStatus = getHealthCategory(riskScore);
  const recommendations = getRecommendations();
    // PDF generation function removed - using print functionality only// Function to print the summary using browser's print API
  const printSummary = () => {
    // Show loading toast
    
    try {
      // Import print styles
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = '/printStyles.css'; // Make sure this path is correct
      linkElement.id = 'print-styles';
      document.head.appendChild(linkElement);
      
      // Add print class to the summary
      if (summaryRef.current) {
        summaryRef.current.classList.add('print-section');
        
        // Hide action buttons temporarily
        const actionButtons = summaryRef.current.querySelectorAll('button');
        actionButtons.forEach(button => {
          button.classList.add('no-print');
        });
        
        // Wait a moment for styles to apply
        setTimeout(() => {
          // Trigger browser print
          window.print();
          
          // Clean up after printing dialog closes
          setTimeout(() => {
            // Remove print class
            summaryRef.current.classList.remove('print-section');
            
            // Remove temporary style
            const styleElement = document.getElementById('print-styles');
            if (styleElement) {
              styleElement.remove();
            }
            
            // Restore action buttons
            actionButtons.forEach(button => {
              button.classList.remove('no-print');
            });
            
          
          }, 1000);
        }, 500);
      }
    } catch (error) {
      console.error("Print preparation error:", error);
      toast({
        title: "Print preparation failed",
        description: "There was an issue setting up your summary for printing.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  };  // Apply styling for badge alignment in the UI (these styles will apply to the printed version through printStyles.css)
  React.useEffect(() => {
    // Fix badges in the UI
    const fixBadges = () => {
      const badges = summaryRef.current?.querySelectorAll('.chakra-badge') || [];
      
      // Fix badge styling directly
      badges.forEach(badge => {
        // Apply critical styles directly to badge elements
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.verticalAlign = 'middle';
        badge.style.height = '18px';
        badge.style.lineHeight = '1';
        badge.style.maxWidth = '100%';
        badge.style.whiteSpace = 'nowrap';
        badge.style.position = 'relative';
      });
      
      // Fix box elements containing badges to properly align content
      const allBoxes = summaryRef.current?.querySelectorAll('.chakra-box') || [];
      allBoxes.forEach(box => {
        const badgesInBox = box.querySelectorAll('.chakra-badge');
        if (badgesInBox.length > 0) {
          box.style.display = 'flex';
          box.style.alignItems = 'center';
          box.style.flexWrap = 'wrap';
        }
      });
    };
    
    // Fix badges after component renders
    setTimeout(fixBadges, 500);
  }, []);return (
    <Box 
      width="210mm" 
      minHeight="297mm" 
      mx="auto" 
      p={5} 
      bg="white" 
      boxShadow="md" 
      borderRadius="sm"
      mt={0} 
      ref={summaryRef}
      className="a4-page"
      sx={{
        // A4 proportions and styling
        aspectRatio: '1 / 1.414',  // A4 aspect ratio
        pageBreakAfter: 'always',
        position: 'relative',
        overflow: 'hidden',
        '@media print': {
          margin: 0,
          padding: '10mm 15mm',
          boxShadow: 'none',
          fontSize: '11pt',
          breakInside: 'avoid-page',
          breakBefore: 'page'
        }
      }}
    >{/* Main title */}      
      <Box 
        textAlign="center" 
        mb={4} 
        width="100%"
        borderBottom="2px solid"
        borderColor={accentColor}
        pb={3}
      >
        <Heading size="lg" color={accentColor} fontSize="22pt">Cancer Screening Test</Heading>
        <Heading size="md" mt={1} fontSize="16pt">Summary Report</Heading>
        <Text fontSize="10pt" color="gray.500" mt={1}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </Box>
        {/* Two-column layout with central divider - optimized for A4 */}
      <Flex 
        direction="row" 
        width="100%" 
        justifyContent="space-between" 
        mb={3} 
        overflowX="hidden"
        fontSize="10pt" 
      >
        {/* Left column */}        
        <Box width="48%" pr={3}>
          {/* Demographics section */}
          <Box mb={3}>            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Personal Information
            </Heading>            <Grid templateColumns="repeat(2, 1fr)" gap={2} width="100%">
              <GridItem>
                <Text fontWeight="medium" fontSize="10pt">
                  Age:
                </Text>
                <Text fontSize="10pt">
                  {userResponses.demographics.age}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="medium" fontSize="10pt">
                  Sex:
                </Text>

                <Text fontSize="10pt">
                  {userResponses.demographics.sex}
                </Text>
              </GridItem>
              <GridItem>

                <Text fontWeight="medium" fontSize="10pt">
                  Ethnicity:
                </Text>                
                <Text fontSize="10pt">
                  {userResponses.demographics.ethnicity || 'Not specified'}
                </Text>

              </GridItem>              
              <GridItem>
                <Text fontWeight="medium" fontSize="10pt">
                  Location:
                </Text>
                <Text fontSize="10pt">
                  {userResponses.demographics.country || 'Not specified'}
                </Text>
              </GridItem>
            </Grid>
          </Box>
            {/* Medical History */}
          <Box mb={4}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Medical History
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Personal Cancer:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">
                {userResponses.medicalHistory.personalCancer.diagnosed ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
                {userResponses.medicalHistory.personalCancer.diagnosed && 
                  <Text as="span" ml={2} fontWeight="normal" fontSize="9pt">
                    {userResponses.medicalHistory.personalCancer.type ? 
                      userResponses.medicalHistory.personalCancer.type : "Cancer type"}
                    {userResponses.medicalHistory.personalCancer.ageAtDiagnosis && 
                      ` (Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})`}
                  </Text>}
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Family Cancer:
                </Text>
                <Box display="flex" alignItems="center" flexWrap="wrap">
                {userResponses.medicalHistory.familyCancer.diagnosed ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
                {userResponses.medicalHistory.familyCancer.diagnosed && userResponses.medicalHistory.familyCancer.type && 
                  <Text as="span" ml={2} fontWeight="normal" fontSize="9pt">
                    {userResponses.medicalHistory.familyCancer.type}
                    {userResponses.medicalHistory.familyCancer.relation && ` in ${userResponses.medicalHistory.familyCancer.relation}`}
                    {userResponses.medicalHistory.familyCancer.ageAtDiagnosis && 
                      ` (Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})`}
                  </Text>}
              </Box>              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Chronic Conditions:
              </Text>              
              <Text fontSize="9pt">
                {userResponses.medicalHistory.chronicConditions.length > 0 ? 
                  userResponses.medicalHistory.chronicConditions.join(', ') : 'None'}
              </Text>
            </Grid>
          </Box>
            {/* Lifestyle */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Lifestyle Factors
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Smoking Status:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.smoking.current ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Current Smoker</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Non-Smoker</Badge>}
                {userResponses.lifestyle.smoking.current && 
                  <Text as="span" ml={2} fontSize="9pt">
                    ({userResponses.lifestyle.smoking.packYears} pack-years)
                  </Text>}
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Alcohol Consumption:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.alcohol?.consumes ? 
                  <Badge colorScheme={userResponses.lifestyle.alcohol.drinksPerWeek > 14 ? "red" : userResponses.lifestyle.alcohol.drinksPerWeek > 7 ? "orange" : "yellow"} ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">
                    Yes ({userResponses.lifestyle.alcohol.drinksPerWeek} drinks/week)
                  </Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
              </Box><Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Sexual Health Risk:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">High Risk</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Standard Risk</Badge>}
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Organ Transplant:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.transplant ? 
                  <Badge colorScheme="orange" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
              </Box>
            </Grid>
          </Box>            
          
          {/* Medications & Allergies */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Medications & Allergies
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Current Medications:
              </Text>

              <Text fontSize="9pt">
                {userResponses.medications.length > 0 ? 
                userResponses.medications.join(', ') : 'None reported'}
              </Text>

              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Known Allergies:
              </Text>

              <Text fontSize="9pt">
                {userResponses.allergies && userResponses.allergies !== "None" ? 
                userResponses.allergies : 'None reported'}
              </Text>
            </Grid>          </Box>
          
          {/* Medications & Allergies */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Medications & Allergies
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Current Medications:
              </Text>

              <Text fontSize="9pt">
                {userResponses.medications.length > 0 ? 
                userResponses.medications.join(', ') : 'None reported'}
              </Text>

              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Known Allergies:
              </Text>

              <Text fontSize="9pt">
                {userResponses.allergies && userResponses.allergies !== "None" ? 
                userResponses.allergies : 'None reported'}
              </Text>
            </Grid>
          </Box>

          {/* Gender-specific Information - Moved below Medications & Allergies in left column */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              {userResponses.demographics.sex === "Male" ? "Male" : "Female"}-Specific Screening
            </Heading>
              {userResponses.demographics.sex === "Male" && (
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Urinary Symptoms:
                </Text>                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.urinarySymptoms ? "orange" : "green"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.male.urinarySymptoms ? "YES" : "NO"}
                  </Badge>
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Prostate Test:
                </Text>                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.prostateTest.had ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.male.prostateTest.had ? "YES" : "NO"}
                  </Badge>
                  {userResponses.sexSpecificInfo.male.prostateTest.had ? 
                    <Text as="span" ml={2} fontSize="9pt">
                      (Age {userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})
                    </Text> : 
                    userResponses.demographics.age < 30 ? 
                    <Text as="span" ml={2} fontSize="8pt" color="gray.600">
                      N/A (Not recommended under 30)
                    </Text> : null}
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Testicular Issues:
                </Text>                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.testicularIssues ? "orange" : "green"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.male.testicularIssues ? "YES" : "NO"}
                  </Badge>
                </Box>
              </Grid>
            )}
              {userResponses.demographics.sex === "Female" && (
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  First Period Age:
                </Text>
                <Text fontSize="9pt">
                  {userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}
                </Text>                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Menstruation Status:
                </Text>
                <Text fontSize="9pt">
                  {userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}
                </Text>
                
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Pregnancy History:
                </Text>                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "blue" : "gray"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "YES" : "NO"}
                  </Badge>
                  {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy && 
                    <Text as="span" ml={2} fontSize="9pt">
                      (First at age {userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})
                    </Text>}
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Hormone Treatment:
                </Text>                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hormoneTreatment ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.female.hormoneTreatment ? "YES" : "NO"}
                  </Badge>
                </Box>
                
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  HPV Vaccine:
                </Text>                  <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hpvVaccine ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.female.hpvVaccine ? "YES" : "NO"}
                  </Badge>
                </Box>              </Grid>
            )}
          </Box>
        </Box>        {/* Center divider */}
        <Divider orientation="vertical" height="auto" mx={2} />
        
        {/* Right column */}
        <Box width="48%" pl={3}>          {/* Vaccination and Screening History - Moved to top of right column */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Vaccinations & Screening History
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                HPV Vaccine:
              </Text>              <Box display="flex" alignItems="center">
                <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hpv ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                  {userResponses.vaccinations.hpv ? "YES" : "NO"}
                </Badge>
              </Box>
              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Hepatitis B Vaccine:
              </Text>              <Box display="flex" alignItems="center">
                <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hepB ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                  {userResponses.vaccinations.hepB ? "YES" : "NO"}
                </Badge>
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Cancer Screening History:
              </Text>              <Box>
                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.cancerScreening.hadScreening ? "blue" : "gray"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.cancerScreening.hadScreening ? "YES" : "NO"}
                  </Badge>
                </Box>
                {userResponses.cancerScreening.hadScreening && userResponses.cancerScreening.details && (
                  <Text fontSize="8pt" mt={1}>
                    "{userResponses.cancerScreening.details}"
                  </Text>
                )}
              </Box>
            </Grid>
          </Box>{/* Risk Assessment */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Health Risk Assessment
            </Heading>            <Flex justify="space-between" align="center" mb={2}>
              <Box>
                <Text fontWeight="medium" fontSize="10pt">
                  Risk Level:
                </Text>                <Badge 
                  colorScheme={healthStatus.color} 
                  fontSize="9pt"
                  py={1} 
                  px={2}
                  display="inline-flex"
                  alignItems="center"
                  borderRadius="md">
                  {healthStatus.category}
                </Badge>
              </Box>
              
              <Box textAlign="right">
                <Text fontWeight="medium" fontSize="10pt">
                  Age Group:
                </Text>
                <Text fontSize="9pt">
                  {userResponses.demographics.age < 18 ? 'Pediatric' : 
                    userResponses.demographics.age < 36 ? 'Young Adult' : 
                    userResponses.demographics.age < 56 ? 'Middle-Aged' : 
                    userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'}
                </Text>
              </Box>
            </Flex>
          </Box>
            {/* Recommendations */}
          <Box mb={2}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Recommended Cancer Screening Tests
            </Heading>            <List spacing={1}>
              {getPrescribedTests(userResponses).map((test, index) => (
                <ListItem key={`test-${index}`} display="flex" alignItems="flex-start" mb={2}>
                  <ListIcon as={FaCheckCircle} color="green.500" mt={1} flexShrink={0} fontSize="9pt" />
                  <Box>
                    <Text fontWeight="semibold" fontSize="10pt">{test.name}</Text>
                    <Text fontSize="8pt" color="gray.600">Frequency: {test.frequency}</Text>
                    <Text fontSize="8pt" color="gray.600">{test.reason}</Text>                    <Badge colorScheme={test.priority === "high" ? "red" : test.priority === "medium" ? "orange" : "green"} 
                           fontSize="7pt" mt={1} display="inline-flex" alignItems="center" height="16px">
                      {test.urgency}
                    </Badge>
                  </Box>
                </ListItem>
              ))}            </List>
          </Box>
        </Box>     
      </Flex>      {/* Action Buttons */}      <Flex justifyContent="center" mt={3} gap={4} position="sticky" bottom={0} pb={2}>
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={FaPrint} />}
          size="md"
          onClick={printSummary}>
          Print Summary
        </Button>
        
        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          onClick={() => handleOptionSelect("Start a new screening", "start")}>
          Start New Screening
        </Button>
      </Flex>
    </Box>
  );
};

export default SummaryComponent;
