import React from 'react';
import { Box, Button, Heading, Text, VStack, Icon, Image } from '@chakra-ui/react';
import { FaNotesMedical } from 'react-icons/fa';

const LandingPage = ({ onStart }) => {
  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.50"
      p={8}
    >
      <VStack spacing={6} maxW="xl">
        <Icon as={FaNotesMedical} w={20} h={20} color="blue.500" />
        <Heading as="h1" size="2xl" color="blue.800">
          Sky Premium Hospital
        </Heading>
        <Heading as="h2" size="lg" fontWeight="medium" color="gray.600">
          Cancer Screening Program
        </Heading>
        <Text fontSize="lg" color="gray.700">
          Welcome. This tool will guide you through a series of questions to help determine the most appropriate cancer screening tests for you based on your personal health information.
        </Text>
        <Text fontSize="md" color="gray.500">
          The process is confidential and should only take a few minutes.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={onStart}
          px={10}
          py={6}
          borderRadius="full"
        >
          Begin Screening
        </Button>
      </VStack>
    </Box>
  );
};

export default LandingPage;