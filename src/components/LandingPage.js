import React, { useState } from 'react';
import { Box, Button, Heading, Text, VStack, Icon, Image, Flex, Spacer, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { FaNotesMedical, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const LandingPage = ({ onStart }) => {
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure();

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(0deg, #D4E1F3 0%, #CBD6E4 25%, #B7BDF7 52%, #CFC5F9 80%, #A1C5F7 100%)'
      }}
    >
      {/* Header */}
      <Flex 
        as="header" 
        width="100%" 
        py={4} 
        px={8} 
        sx={{
          background: 'linear-gradient(270deg, rgba(68.51, 50.78, 157.17, 0) 0%, #5770D2 16%, rgba(119.13, 146.08, 234.65, 0.69) 58%, #AE7EE9 86%, #9B6CD9 100%)',
          backdropFilter: 'blur(3px)'
        }}
        boxShadow="sm"
        position="fixed"
        top={0}
        zIndex={10}
      >
        <Flex align="center">
          <Icon as={FaNotesMedical} h={8} w={8} color="white" />
          <Heading size="md" ml={2} color="white">Sky Premium Hospital</Heading>
        </Flex>
        <Spacer />
        <HStack spacing={6}>
          <Button variant="ghost" color="white" leftIcon={<FaInfoCircle color="white" />} onClick={onAboutOpen}>
            About
          </Button>
          <Button variant="ghost" color="white" leftIcon={<FaEnvelope color="white" />} onClick={onContactOpen}>
            Contact
          </Button>
          <Button colorScheme="blue" onClick={onStart}>
            Begin Screening
          </Button>
        </HStack>
      </Flex>

      {/* Main content with padding to account for fixed header */}
      <Box pt="80px" width="100%" display="flex" justifyContent="center" alignItems="center" flex="1">
        <VStack 
          spacing={6} 
          maxW="xl" 
          textAlign="center" 
          p={8} 
          borderRadius="lg"
          bg="rgba(255, 255, 255, 0.7)"
          backdropFilter="blur(5px)"
          boxShadow="lg"
          m={4}
        >
        <Icon as={FaNotesMedical} w={20} h={20} color="blue.500" />
        <Heading as="h1" size="2xl" color="#5770D2">
          Sky Premium Hospital
        </Heading>
        <Heading as="h2" size="lg" fontWeight="medium" color="#9B6CD9">
          Cancer Screening Program
        </Heading>
        <Text fontSize="lg" color="#4A5568">
          Welcome. This tool will guide you through a series of questions to help determine the most appropriate cancer screening tests for you based on your personal health information.
        </Text>
        <Text fontSize="md" color="#5770D2">
          The process is confidential and should only take a few minutes.
        </Text>
        <Button
          bg="#B7BDF7"
          _hover={{ bg: "#A1C5F7" }}
          color="white"
          size="lg"
          onClick={onStart}
          px={10}
          py={6}
          borderRadius="full"
          boxShadow="md"
        >
          Begin Screening
        </Button>
      </VStack>
      </Box>
      
      {/* About Modal */}
      <Modal isOpen={isAboutOpen} onClose={onAboutClose} size="lg">
        <ModalOverlay bg="rgba(212, 225, 243, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bgGradient="linear(to-b, white, #D4E1F3)" boxShadow="xl" borderRadius="xl">
          <ModalHeader>About Cancer Screening Tool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              This Cancer Screening Tool is designed to help identify which cancer screening tests are most appropriate for you based on your personal health profile and risk factors.
            </Text>
            <Text mb={4}>
              By answering a series of questions about your age, sex, family history, lifestyle, and other health factors, we can provide personalized recommendations for cancer screening.
            </Text>
            <Text mb={4}>
              Early detection through appropriate screening is one of the most effective ways to improve cancer treatment outcomes. Not everyone needs every screening test, and this tool helps determine which ones may be most beneficial for you.
            </Text>
            <Text fontWeight="bold">
              Note: This tool provides recommendations only and does not replace professional medical advice. Always consult with your healthcare provider about which screening tests are right for you.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button bg="#B7BDF7" _hover={{ bg: "#A1C5F7" }} color="white" mr={3} onClick={onAboutClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Contact Modal */}
      <Modal isOpen={isContactOpen} onClose={onContactClose} size="md">
        <ModalOverlay bg="rgba(212, 225, 243, 0.4)" backdropFilter="blur(4px)" />
        <ModalContent bgGradient="linear(to-b, white, #D4E1F3)" boxShadow="xl" borderRadius="xl">
          <ModalHeader>Contact Us</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Box>
                <Heading size="sm" mb={2}>Sky Premium Hospital</Heading>
                <Text>123 Medical Center Drive</Text>
                <Text>Healthville, MD 20814</Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2}>Screening Program Office</Heading>
                <Text>Phone: (555) 123-4567</Text>
                <Text>Email: screening@skypremium.org</Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2}>Hours</Heading>
                <Text>Monday - Friday: 8:00 AM - 5:00 PM</Text>
                <Text>Saturday: 9:00 AM - 1:00 PM</Text>
                <Text>Sunday: Closed</Text>
              </Box>
              
              <Text fontStyle="italic">
                For medical emergencies, please call 911 or go to your nearest emergency room.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button bg="#B7BDF7" _hover={{ bg: "#A1C5F7" }} color="white" mr={3} onClick={onContactClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LandingPage;