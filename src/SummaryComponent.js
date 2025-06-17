import React from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Heading,
  useColorModeValue,
  useToast,
  Divider,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  List,
  ListItem,
  ListIcon,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FaDownload, FaExclamationCircle, FaCheckCircle, FaInfoCircle, FaChartLine } from 'react-icons/fa';

// Create a SummaryComponent to show at the end
const SummaryComponent = ({ userResponses, handleOptionSelect }) => {
  const toast = useToast();
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  
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
    riskScore += Math.min(userResponses.medicalHistory.chronicConditions.length, 3);
    
    // Smoking
    if (userResponses.lifestyle.smoking.current) {
      riskScore += 3;
      if (userResponses.lifestyle.smoking.years > 10) riskScore += 1;
      if (userResponses.lifestyle.smoking.weekly > 70) riskScore += 1;  // 10+ cigarettes daily
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
    const hasPersonalCancer = userResponses.medicalHistory.personalCancer.diagnosed;
    const hasFamilyCancer = userResponses.medicalHistory.familyCancer.diagnosed;
    const isSmoker = userResponses.lifestyle.smoking.current;
    const recommendations = [];
    
    // General recommendations
    recommendations.push("Schedule a general health check-up annually");
    
    if (isSmoker) {
      recommendations.push("Consider tobacco cessation programs or counseling");
      recommendations.push("Regular lung function testing and chest X-rays");
    }
    
    if (hasPersonalCancer) {
      recommendations.push("Follow specialized cancer survivorship plan");
      recommendations.push("More frequent cancer screening based on personal history");
    }
    
    if (hasFamilyCancer) {
      recommendations.push("Consider genetic counseling for inherited cancer risk");
    }
    
    if (userResponses.medicalHistory.chronicConditions.includes("Diabetes")) {
      recommendations.push("Regular HbA1c monitoring");
    }
      if (sex === "Male") {
      // Prostate recommendations based on age
      if (age >= 45) recommendations.push("Consider annual prostate examination");
      if (age >= 50 && !userResponses.sexSpecificInfo.male.prostateTest.had) {
        recommendations.push("Schedule PSA blood test");
      } else if (age >= 30 && age < 50 && !userResponses.sexSpecificInfo.male.prostateTest.had) {
        recommendations.push("Discuss prostate health with your doctor at your next visit");
      }
      // No prostate recommendations for men under 30
      
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) {
        recommendations.push("Urological evaluation recommended");
      }
      if (userResponses.sexSpecificInfo.male.testicularIssues) {
        recommendations.push("Testicular self-examinations and specialist consultation");
      }
    }
    
    if (sex === "Female") {
      if (age >= 40) recommendations.push("Annual mammogram");
      if (age >= 21) recommendations.push("Regular Pap smears (every 3-5 years)");
      if (!userResponses.sexSpecificInfo.female.hpvVaccine && age < 45) {
        recommendations.push("Consider HPV vaccination if eligible");
      }
    }
    
    // Colon cancer screening based on age
    if (age >= 45) {
      recommendations.push("Regular colorectal cancer screening (colonoscopy every 10 years or alternative methods)");
    }
    
    return recommendations;
  };


  const riskScore = calculateRiskScore();
  const healthStatus = getHealthCategory(riskScore);
  const recommendations = getRecommendations();
  
  // Apply a global style to prevent scrollbars at all levels
  React.useEffect(() => {
    // Apply style to body to remove scrollbars
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.getElementById('root').style.overflowX = 'hidden';
    document.getElementById('root').style.width = '100vw';
    document.getElementById('root').style.position = 'relative';
    
    // Cleanup function to restore original styles when component unmounts
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.getElementById('root').style.overflowX = '';
      document.getElementById('root').style.width = '';
      document.getElementById('root').style.position = '';
    };
  }, []);
  return (
    <Box width="100%" mx="auto" p={0} overflowX="hidden" maxW="85vw" mt={0}>
      {/* Main title */}
      <Box textAlign="center" mb={3} width="100%">
        <Heading size="lg" color={accentColor}>Cancer Screening Test</Heading>
        <Heading size="md" mt={1}>Summary Report</Heading>
      </Box>{/* Two-column layout with central divider */}
      <Flex direction={["column", "column", "row"]} width="100%" justifyContent="space-between" mb={3} overflowX="hidden" maxWidth="100%">
        {/* Left column */}
        <Box width={["100%", "100%", "49%"]} pr={[0, 0, 4]}>          {/* Demographics section */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Personal Information
            </Heading><Grid templateColumns="repeat(2, 1fr)" gap={3} width="100%">
              <GridItem>
                <Text fontWeight="medium">Age:</Text>
                <Text>{userResponses.demographics.age}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="medium">Sex:</Text>
                <Text>{userResponses.demographics.sex}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="medium">Ethnicity:</Text>
                <Text noOfLines={1}>{userResponses.demographics.ethnicity || 'Not specified'}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="medium">Location:</Text>
                <Text noOfLines={1}>{userResponses.demographics.country || 'Not specified'}</Text>
              </GridItem>
            </Grid>
          </Box>
            {/* Medical History */}
          <Box mb={4}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Medical History
            </Heading><Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              <Text fontWeight="medium" whiteSpace="nowrap">Personal Cancer:</Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                {userResponses.medicalHistory.personalCancer.diagnosed ? 
                  <Badge colorScheme="red" ml={1}>Yes</Badge> : 
                  <Badge colorScheme="green" ml={1}>No</Badge>}
                {userResponses.medicalHistory.personalCancer.diagnosed && 
                  <Text as="span" ml={2} fontWeight="normal">
                    {userResponses.medicalHistory.personalCancer.type || "Cancer type"}
                    {userResponses.medicalHistory.personalCancer.ageAtDiagnosis && 
                      ` (Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})`}
                  </Text>}
              </Box><Text fontWeight="medium" whiteSpace="nowrap">Family Cancer:</Text>              <Box display="flex" alignItems="center" flexWrap="wrap">
                {userResponses.medicalHistory.familyCancer.diagnosed ? 
                  <Badge colorScheme="red" ml={1}>Yes</Badge> : 
                  <Badge colorScheme="green" ml={1}>No</Badge>}
                {userResponses.medicalHistory.familyCancer.diagnosed && userResponses.medicalHistory.familyCancer.type && 
                  <Text as="span" ml={2} fontWeight="normal">
                    {userResponses.medicalHistory.familyCancer.type}
                    {userResponses.medicalHistory.familyCancer.relation && ` in ${userResponses.medicalHistory.familyCancer.relation}`}
                    {userResponses.medicalHistory.familyCancer.ageAtDiagnosis && 
                      ` (Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})`}
                  </Text>}
              </Box>
              
              <Text fontWeight="medium" whiteSpace="nowrap">Chronic Conditions:</Text>
              <Text isTruncated>{userResponses.medicalHistory.chronicConditions.length > 0 ? 
                userResponses.medicalHistory.chronicConditions.join(', ') : 'None'}</Text>
            </Grid>
          </Box>
            {/* Lifestyle */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Lifestyle Factors
            </Heading><Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
              <Text fontWeight="medium" whiteSpace="nowrap">Smoking Status:</Text>
              <Box>
                {userResponses.lifestyle.smoking.current ? 
                  <Badge colorScheme="red" ml={1}>Current Smoker</Badge> : 
                  <Badge colorScheme="green" ml={1}>Non-Smoker</Badge>}
                {userResponses.lifestyle.smoking.current && 
                  <Text as="span" ml={2}>({userResponses.lifestyle.smoking.years} years)</Text>}
              </Box>
              
              <Text fontWeight="medium" whiteSpace="nowrap">Organ Transplant:</Text>
              <Box>
                {userResponses.lifestyle.transplant ? 
                  <Badge colorScheme="orange" ml={1}>Yes</Badge> : 
                  <Badge colorScheme="green" ml={1}>No</Badge>}
              </Box>
            </Grid>
          </Box>
            {/* Medications & Allergies */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Medications & Allergies
            </Heading><Grid templateColumns="auto minmax(0, 1fr)" gap={2} width="100%">
              <Text fontWeight="medium" whiteSpace="nowrap">Current Medications:</Text>
              <Text isTruncated>{userResponses.medications.length > 0 ? 
                userResponses.medications.join(', ') : 'None reported'}</Text>
                
              <Text fontWeight="medium" whiteSpace="nowrap">Known Allergies:</Text>
              <Text isTruncated>{userResponses.allergies && userResponses.allergies !== "None" ? 
                userResponses.allergies : 'None reported'}</Text>
            </Grid>
          </Box>
        </Box>
        
        {/* Center divider */}
        <Divider orientation="vertical" display={["none", "none", "block"]} />
        
        {/* Right column */}
        <Box width={["100%", "100%", "49%"]} pl={[0, 0, 4]} mt={[6, 6, 0]}>          {/* Gender-specific Information */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              {userResponses.demographics.sex === "Male" ? "Male" : "Female"}-Specific Screening
            </Heading>
            
            {userResponses.demographics.sex === "Male" && (              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap">Urinary Symptoms:</Text>
                <Badge colorScheme={userResponses.sexSpecificInfo.male.urinarySymptoms ? "orange" : "green"}>
                  {userResponses.sexSpecificInfo.male.urinarySymptoms ? "YES" : "NO"}
                </Badge>
                
                <Text fontWeight="medium" whiteSpace="nowrap">Prostate Test:</Text>
                <Box>
                  <Badge colorScheme={userResponses.sexSpecificInfo.male.prostateTest.had ? "green" : "yellow"}>
                    {userResponses.sexSpecificInfo.male.prostateTest.had ? "YES" : "NO"}
                  </Badge>
                  {userResponses.sexSpecificInfo.male.prostateTest.had ? 
                    <Text as="span" ml={2}>(Age {userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})</Text> : 
                    userResponses.demographics.age < 30 ? 
                    <Text as="span" ml={2} fontSize="sm" color="gray.600">N/A (Not recommended under 30)</Text> : null}
                </Box>
                
                <Text fontWeight="medium" whiteSpace="nowrap">Testicular Issues:</Text>
                <Badge colorScheme={userResponses.sexSpecificInfo.male.testicularIssues ? "orange" : "green"}>
                  {userResponses.sexSpecificInfo.male.testicularIssues ? "YES" : "NO"}
                </Badge>
              </Grid>
            )}
            
            {userResponses.demographics.sex === "Female" && (              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap">First Period Age:</Text>
                <Text>{userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}</Text>
                
                <Text fontWeight="medium" whiteSpace="nowrap">Menstruation Status:</Text>
                <Text isTruncated>{userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}</Text>
                
                <Text fontWeight="medium" whiteSpace="nowrap">Pregnancy History:</Text>
                <Box>
                  <Badge colorScheme={userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "blue" : "gray"}>
                    {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "YES" : "NO"}
                  </Badge>
                  {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy && 
                    <Text as="span" ml={2}>(First at age {userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})</Text>}
                </Box>
                
                <Text fontWeight="medium" whiteSpace="nowrap">Hormone Treatment:</Text>
                <Badge colorScheme={userResponses.sexSpecificInfo.female.hormoneTreatment ? "purple" : "gray"}>
                  {userResponses.sexSpecificInfo.female.hormoneTreatment ? "YES" : "NO"}
                </Badge>
                
                <Text fontWeight="medium" whiteSpace="nowrap">HPV Vaccine:</Text>
                <Badge colorScheme={userResponses.sexSpecificInfo.female.hpvVaccine ? "green" : "yellow"}>
                  {userResponses.sexSpecificInfo.female.hpvVaccine ? "YES" : "NO"}
                </Badge>
              </Grid>
            )}
          </Box>
            {/* Risk Assessment */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Health Risk Assessment
            </Heading>            <Flex justify="space-between" align="center" mb={2}>
              <Box>
                <Text fontWeight="medium" fontSize="sm">Risk Level:</Text>
                <Badge 
                  colorScheme={healthStatus.color} 
                  fontSize="sm"
                  py={1} 
                  px={2} 
                  borderRadius="md"
                >
                  {healthStatus.category}
                </Badge>
              </Box>
              
              <Box textAlign="right">
                <Text fontWeight="medium" fontSize="sm">Age Group:</Text>
                <Text fontSize="sm">
                  {userResponses.demographics.age < 18 ? 'Pediatric' : 
                    userResponses.demographics.age < 36 ? 'Young Adult' : 
                    userResponses.demographics.age < 56 ? 'Middle-Aged' : 
                    userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'}
                </Text>
              </Box>
            </Flex>
          </Box>            {/* Recommendations */}
          <Box mb={2}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200">
              Recommendations
            </Heading>
            <List spacing={1}>
              {recommendations.slice(0, 4).map((rec, index) => (
                <ListItem key={index} display="flex">
                  <ListIcon as={FaCheckCircle} color="green.500" mt={1} flexShrink={0} />
                  <Text overflowWrap="break-word" maxW="100%" fontSize="sm">{rec}</Text>
                </ListItem>
              ))}
              {recommendations.length > 4 && (
                <Text color="gray.600" fontSize="sm" mt={1}>
                  Plus {recommendations.length - 4} more recommendations...
                </Text>
              )}
            </List>
          </Box>
        </Box>
      </Flex>
        {/* Action Buttons */}
      <Flex justifyContent="center" mt={3} gap={4} position="sticky" bottom={0} pb={2}>
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={FaDownload} />}
          size="md"
          onClick={() => {
            toast({
              title: "Summary ready",
              description: "Your medical summary is ready for download",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top-right"
            });
          }}
        >
          Download Summary
        </Button>
        
        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          onClick={() => handleOptionSelect("Start a new screening", "start")}
        >
          Start New Screening
        </Button>
      </Flex>
    </Box>
  );
};

export default SummaryComponent;
