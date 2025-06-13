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
  ListIcon
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
      if (age >= 45) recommendations.push("Consider annual prostate examination");
      if (age >= 50 && !userResponses.sexSpecificInfo.male.prostateTest.had) {
        recommendations.push("Schedule PSA blood test");
      }
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
  
  return (
    <VStack spacing={5} align="stretch" maxHeight="80vh" overflowY="auto" paddingRight="2">
      <Box>
        <Heading size="md" color={accentColor}>Medical Screening Summary</Heading>
        <Text fontSize="sm" mt={1}>Thank you for completing your medical screening. This information will help guide your healthcare decisions.</Text>
      </Box>
      
      {/* Health Statistics Dashboard */}
      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="md" 
        bg={useColorModeValue('teal.50', 'teal.900')} 
        borderColor={accentColor}
        boxShadow="md"
      >
        <Heading size="sm" mb={3} color={accentColor}>Health Statistics</Heading>
        
        <StatGroup mb={3}>
          <HStack spacing={6} width="100%" justifyContent="center" alignItems="center">
            <Stat>
              <StatLabel>Health Risk Level</StatLabel>
              <StatNumber>
                <Badge 
                  colorScheme={healthStatus.color} 
                  fontSize="md" 
                  py={1} 
                  px={2} 
                  borderRadius="md"
                >
                  {healthStatus.category}
                </Badge>
              </StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel>Risk Score</StatLabel>
              <StatNumber>{riskScore}</StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel>Age Group</StatLabel>
              <StatNumber>
                {userResponses.demographics.age < 18 ? 'Pediatric' : 
                  userResponses.demographics.age < 36 ? 'Young Adult' : 
                  userResponses.demographics.age < 56 ? 'Middle-Aged' : 
                  userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'}
              </StatNumber>
            </Stat>
          </HStack>
        </StatGroup>
      </Box>
      
      {/* Demographics */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
        <Heading size="sm" mb={2}>Demographics</Heading>
        <Text>Age: {userResponses.demographics.age}</Text>
        <Text>Sex: {userResponses.demographics.sex}</Text>
        <Text>Ethnicity: {userResponses.demographics.ethnicity || 'Not specified'}</Text>
        <Text>Location: {userResponses.demographics.country || 'Not specified'}</Text>
      </Box>
      
      {/* Medical History */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
        <Heading size="sm" mb={2}>Medical History</Heading>
        <Text>
          Personal Cancer History: {userResponses.medicalHistory.personalCancer.diagnosed ? 
            <Badge colorScheme="red" ml={1}>Yes</Badge> : 
            <Badge colorScheme="green" ml={1}>No</Badge>
          }
        </Text>
        {userResponses.medicalHistory.personalCancer.diagnosed && (
          <>
            <Text ml={4}>Cancer Type: {userResponses.medicalHistory.personalCancer.type || 'Not specified'}</Text>
            <Text ml={4}>Age at Diagnosis: {userResponses.medicalHistory.personalCancer.ageAtDiagnosis || 'Not specified'}</Text>
          </>
        )}
        
        <Text mt={2}>
          Family Cancer History: {userResponses.medicalHistory.familyCancer.diagnosed ? 
            <Badge colorScheme="red" ml={1}>Yes</Badge> : 
            <Badge colorScheme="green" ml={1}>No</Badge>
          }
        </Text>
        {userResponses.medicalHistory.familyCancer.diagnosed && (
          <>
            <Text ml={4}>Relation: {userResponses.medicalHistory.familyCancer.relation || 'Not specified'}</Text>
            <Text ml={4}>Cancer Type: {userResponses.medicalHistory.familyCancer.type || 'Not specified'}</Text>
            <Text ml={4}>Age at Diagnosis: {userResponses.medicalHistory.familyCancer.ageAtDiagnosis || 'Not specified'}</Text>
          </>
        )}
        
        <Text mt={2}>
          Chronic Conditions: {userResponses.medicalHistory.chronicConditions.length > 0 ? (
            <Box mt={1} ml={4}>
              {userResponses.medicalHistory.chronicConditions.map((condition, index) => (
                <Badge key={index} colorScheme="purple" mr={2} mb={1}>{condition}</Badge>
              ))}
            </Box>
          ) : (
            <Badge colorScheme="green" ml={1}>None reported</Badge>
          )}
        </Text>
      </Box>
      
      {/* Lifestyle */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
        <Heading size="sm" mb={2}>Lifestyle</Heading>
        <Text>
          Smoking: {userResponses.lifestyle.smoking.current ? 
            <Badge colorScheme="red" ml={1}>Yes</Badge> : 
            <Badge colorScheme="green" ml={1}>No</Badge>
          }
        </Text>
        {userResponses.lifestyle.smoking.current && (
          <>
            <Text ml={4}>Years Smoked: {userResponses.lifestyle.smoking.years || 'Not specified'}</Text>
            <Text ml={4}>Weekly Amount: {userResponses.lifestyle.smoking.weekly || 'Not specified'} cigarettes</Text>
            <Text ml={4} fontStyle="italic" color="orange.500">
              {userResponses.lifestyle.smoking.weekly > 70 ? 'Heavy smoker (10+ daily)' : 
                userResponses.lifestyle.smoking.weekly > 35 ? 'Moderate smoker (5-10 daily)' : 
                'Light smoker (< 5 daily)'}
            </Text>
          </>
        )}
        <Text mt={2}>
          Organ Transplant/Immunosuppression: {userResponses.lifestyle.transplant ? 
            <Badge colorScheme="orange" ml={1}>Yes</Badge> : 
            <Badge colorScheme="green" ml={1}>No</Badge>
          }
        </Text>
      </Box>
      
      {/* Medications & Allergies */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
        <Heading size="sm" mb={2}>Medications & Allergies</Heading>
        <Text>
          Medications: {userResponses.medications.length > 0 ? (
            <Box mt={1} ml={4}>
              {userResponses.medications.map((medication, index) => (
                <Badge key={index} colorScheme="blue" mr={2} mb={1}>{medication}</Badge>
              ))}
            </Box>
          ) : (
            <Text as="span" color="green.500" ml={1}>None reported</Text>
          )}
        </Text>
        <Text mt={2}>
          Allergies: {userResponses.allergies && userResponses.allergies !== "None" ? (
            <Text as="span" color="red.500" ml={1}>{userResponses.allergies}</Text>
          ) : (
            <Text as="span" color="green.500" ml={1}>None reported</Text>
          )}
        </Text>
      </Box>
      
      {/* Gender-specific Information */}
      {userResponses.demographics.sex === "Male" && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
          <Heading size="sm" mb={2}>Male-specific Information</Heading>
          <Text>
            Urinary Symptoms: {userResponses.sexSpecificInfo.male.urinarySymptoms ? 
              <Badge colorScheme="orange" ml={1}>Yes</Badge> : 
              <Badge colorScheme="green" ml={1}>No</Badge>
            }
          </Text>
          <Text>
            Prostate Test History: {userResponses.sexSpecificInfo.male.prostateTest.had ? 
              <Badge colorScheme="green" ml={1}>Yes</Badge> : 
              <Badge colorScheme={userResponses.demographics.age >= 50 ? "red" : "yellow"} ml={1}>No</Badge>
            }
          </Text>
          {userResponses.sexSpecificInfo.male.prostateTest.had && (
            <Text ml={4}>Age at Last Test: {userResponses.sexSpecificInfo.male.prostateTest.ageAtLast || 'Not specified'}</Text>
          )}
          <Text>
            Testicular Issues: {userResponses.sexSpecificInfo.male.testicularIssues ? 
              <Badge colorScheme="orange" ml={1}>Yes</Badge> : 
              <Badge colorScheme="green" ml={1}>No</Badge>
            }
          </Text>
        </Box>
      )}
      
      {userResponses.demographics.sex === "Female" && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" maxHeight="200px" overflowY="auto">
          <Heading size="sm" mb={2}>Female-specific Information</Heading>
          <Text>Age at First Period: {userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}</Text>
          <Text>
            Menstruation Status: {userResponses.sexSpecificInfo.female.menstruationStatus ? (
              <Badge colorScheme="blue" ml={1}>{userResponses.sexSpecificInfo.female.menstruationStatus}</Badge>
            ) : (
              'Not specified'
            )}
          </Text>
          <Text>
            Pregnancy History: {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? 
              <Badge colorScheme="blue" ml={1}>Yes</Badge> : 
              <Badge colorScheme="blue" ml={1}>No</Badge>
            }
          </Text>
          {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy && (
            <Text ml={4}>Age at First Full-term Pregnancy: {userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'Not specified'}</Text>
          )}
          <Text>
            Hormone Treatment/Birth Control: {userResponses.sexSpecificInfo.female.hormoneTreatment ? 
              <Badge colorScheme="purple" ml={1}>Yes</Badge> : 
              <Badge colorScheme="green" ml={1}>No</Badge>
            }
          </Text>
          <Text>
            HPV Vaccine: {userResponses.sexSpecificInfo.female.hpvVaccine ? 
              <Badge colorScheme="green" ml={1}>Yes</Badge> : 
              <Badge colorScheme={userResponses.demographics.age < 45 ? "yellow" : "green"} ml={1}>No</Badge>
            }
          </Text>
        </Box>
      )}
      
      {/* Recommendations */}
      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="md" 
        bg={useColorModeValue('blue.50', 'blue.900')} 
        borderColor="blue.200" 
        maxHeight="250px" 
        overflowY="auto"
        boxShadow="md"
      >
        <Heading size="sm" mb={2} color="blue.600">Health Recommendations</Heading>
        <Text fontSize="sm" fontStyle="italic" mb={2}>
          Based on your information, consider the following recommendations:
        </Text>
        
        <List spacing={2}>
          {recommendations.map((recommendation, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FaCheckCircle} color="green.500" />
              <Text fontSize="sm">{recommendation}</Text>
            </ListItem>
          ))}
        </List>
        
        <Text mt={3} fontSize="xs" fontStyle="italic" color="gray.500">
          Note: These recommendations are general guidelines and not a substitute for professional medical advice.
          Please consult with your healthcare provider for personalized guidance.
        </Text>
      </Box>
      
      {/* Action Buttons */}
      <HStack spacing={4}>
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={FaDownload} />}
          flex="1"
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
          flex="1"
          onClick={() => handleOptionSelect("Start a new screening", "start")}
        >
          Start New Screening
        </Button>
      </HStack>
    </VStack>
  );
};

export default SummaryComponent;
