import { Box, Button, Heading, Text, VStack, Icon, Flex, Spacer, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Grid, GridItem, Badge, ScaleFade, List, ListItem} from '@chakra-ui/react';
import { FaNotesMedical, FaEnvelope, FaInfoCircle, FaShieldAlt, FaFileDownload, FaClipboardList, FaChartLine, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import '../App.css';

const LandingPage = ({ onStart }) => {
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure();
  
  // hero section animation
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      className='.custom-scroll'
      sx={{
        background: 'linear-gradient(135deg, #0B0C10 0%, #1F2833 60%, #243B55 100%)',
        color: '#C5C6C7',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(102, 252, 241, 0.05) 0%, transparent 20%), 
          radial-gradient(circle at 80% 70%, rgba(102, 252, 241, 0.08) 0%, transparent 20%)
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <Flex 
        as="header" 
        width="100%" 
        py={4} 
        px={8} 
        sx={{
          background: 'rgba(15, 20, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(102, 252, 241, 0.2)'
        }}
        boxShadow="0 2px 20px rgba(0, 0, 0, 0.3)"
        position="fixed"
        top={0}
        zIndex={10}
      >
        <Flex align="center">
          <Icon as={FaNotesMedical} h={8} w={8} color="#66FCF1" />
          <Heading size="md" ml={2} color="#66FCF1">Sky Premium Hospital</Heading>
        </Flex>
        <Spacer />
        <HStack spacing={6}>
          <Button variant="ghost" color="#66FCF1" leftIcon={<FaInfoCircle color="#66FCF1" />} _hover={{ bg: 'rgba(102, 252, 241, 0.1)' }} onClick={onAboutOpen}>
            About
          </Button>
          <Button variant="ghost" color="#66FCF1" leftIcon={<FaEnvelope color="#66FCF1" />} _hover={{ bg: 'rgba(102, 252, 241, 0.1)' }} onClick={onContactOpen}>
            Contact
          </Button>
          <Button bg="#66FCF1" color="#0B0C10" _hover={{ bg: '#45A29E' }} onClick={onStart} fontWeight="bold">
            Begin Screening
          </Button>
        </HStack>
      </Flex>

      {/* Main content with padding to account for fixed header */}
      <Box pt="100px" width="100%" display="flex" justifyContent="center" alignItems="center" flex="1">
        <Box
          maxW="7xl" 
          w="full"
          px={[4, 8, 16]}
          py={12}
        >
          <Grid 
            templateColumns={["1fr", "1fr", "1fr 1fr"]} 
            gap={[8, 12, 16]}
            alignItems="center"
          >
            {/* Left Side - Hero Content */}
            <GridItem>
              <ScaleFade initialScale={0.9} in={true}>
                <Box textAlign={["center", "center", "left"]}>
                  <HStack spacing={4} mb={4} justifyContent={["center", "center", "flex-start"]}>
                    <Icon as={FaNotesMedical} w={10} h={10} color="#66FCF1" />
                    <Badge colorScheme="teal" fontSize="sm" px={3} py={1} borderRadius="full">
                      Personalized Care
                    </Badge>
                  </HStack>
                  
                  <Heading 
                    as="h1" 
                    fontSize={["4xl", "5xl", "6xl"]} 
                    lineHeight="1.1" 
                    mb={6}
                    bgGradient="linear(to-r, #66FCF1, #45A29E)"
                    bgClip="text"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                  >
                    Sky Premium Hospital
                  </Heading>
                  
                  <Heading 
                    as="h2" 
                    fontSize={["xl", "2xl"]} 
                    fontWeight="bold" 
                    mb={6}
                    color="#000000ff"
                  >
                    Cancer Screening Program
                  </Heading>
                  
                  <Text fontSize="lg" fontWeight="medium" color="#000000ff" lineHeight="1.8" mb={6} maxW="xl">
                    Our interactive screening tool guides you through personalized questions to recommend the most appropriate cancer screening tests based on your health profile.
                  </Text>
                  
                  <Box 
                    p={5} 
                    bg="rgba(15, 20, 30, 0.6)" 
                    borderRadius="lg" 
                    border="1px solid rgba(102, 252, 241, 0.2)"
                    mb={8}
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      bgGradient: "linear(to-r, transparent, #66FCF1, transparent)",
                    }}
                  >
                    <Heading size="sm" mb={3} color="#66FCF1" display="flex" alignItems="center">
                      <Icon as={FaLock} mr={2} /> Secure Document Summary
                    </Heading>
                    <Text fontSize="md" color="#ffffffff" lineHeight="1.6">
                      Upon completion, receive a secure, personalized document with your medical data and screening recommendations that you can download or share with your healthcare provider.
                    </Text>
                  </Box>
                  
                  <HStack spacing={4} mt={6} justifyContent={["center", "center", "flex-start"]}>
                    <Button
                      bg="#66FCF1"
                      _hover={{ 
                        bg: "#45A29E",
                        transform: "translateY(-2px)",
                        boxShadow: "0 0 20px rgba(102, 252, 241, 0.6)"
                      }}
                      color="#0B0C10"
                      size="lg"
                      onClick={onStart}
                      px={8}
                      py={7}
                      borderRadius="full"
                      boxShadow="0 0 15px rgba(102, 252, 241, 0.3)"
                      fontWeight="bold"
                      letterSpacing="wider"
                      transition="all 0.3s ease"
                      _active={{ transform: 'scale(0.98)' }}
                      rightIcon={<FaArrowRight />}
                    >
                      Begin Screening
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      borderColor="#45A29E" 
                      color="#000000ff"
                      _hover={{ 
                        bg: "rgba(102, 252, 241, 0.1)",
                      }}
                      onClick={onAboutOpen}
                      size="lg"
                      borderRadius="full"
                    >
                      Learn More
                    </Button>
                  </HStack>
                  
                  <Text fontSize="sm" color="#45A29E" fontStyle="italic" mt={6}>
                    The process is confidential and takes only a few minutes to complete.
                  </Text>
                </Box>
              </ScaleFade>
            </GridItem>
            
            {/* Right Side - Features */}
            <GridItem>
              <ScaleFade initialScale={0.9} in={true} delay={0.2}>
                <Box 
                  bg="rgba(15, 20, 30, 0.7)"
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="0 10px 30px rgba(0, 0, 0, 0.5)"
                  border="1px solid rgba(102, 252, 241, 0.1)"
                  position="relative"
                >
                  <Box 
                    position="absolute" 
                    top="0" 
                    left="0" 
                    right="0" 
                    height="5px" 
                    bgGradient="linear(to-r, #66FCF1, #45A29E)"
                  />
                  
                  <Box p={7}>
                    <Heading as="h3" size="md" mb={6} color="#66FCF1">
                      What You'll Receive
                    </Heading>
                    
                    <List spacing={5}>
                      {[
                        { 
                          icon: FaClipboardList, 
                          title: "Personalized Screening Plan", 
                          desc: "Custom recommendations based on your specific risk factors and medical history." 
                        },
                        { 
                          icon: FaFileDownload, 
                          title: "Downloadable Summary", 
                          desc: "Get a comprehensive document with all your results and recommendations." 
                        },
                        { 
                          icon: FaShieldAlt, 
                          title: "Data Privacy & Security", 
                          desc: "Your medical data is only shared with Sky Premium Hospital's Oncologists." 
                        },
                        { 
                          icon: FaChartLine, 
                          title: "Risk Assessment", 
                          desc: "Understand your personal risk factors for various cancer types." 
                        }
                      ].map((item, idx) => (
                        <ListItem 
                          key={idx} 
                          display="flex" 
                          alignItems="flex-start"
                          _hover={{
                            transform: "translateX(5px)",
                            transition: "transform 0.2s ease"
                          }}
                        >
                          <Box 
                            borderRadius="full" 
                            bg="rgba(102, 252, 241, 0.1)" 
                            p={3} 
                            mr={4}
                          >
                            <Icon as={item.icon} color="#66FCF1" boxSize={5} />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" color="#E0E3E7" mb={1}>
                              {item.title}
                            </Text>
                            <Text color="#C5C6C7" fontSize="sm">
                              {item.desc}
                            </Text>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box 
                      mt={7}
                      p={4}
                      bg="rgba(102, 252, 241, 0.05)"
                      borderRadius="md"
                      borderLeft="4px solid #66FCF1"
                    >
                      <Text fontSize="sm" color="#C5C6C7" fontStyle="italic">
                        We comply with all medical data privacy regulations.
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </ScaleFade>
            </GridItem>
          </Grid>
        </Box>
      </Box>
      
      {/* About Modal */}
      <Modal isOpen={isAboutOpen} onClose={onAboutClose} size="lg">
        <ModalOverlay bg="rgba(11, 12, 16, 0.8)" backdropFilter="blur(6px)" />
        <ModalContent 
          bg="#0F141E" 
          color="#C5C6C7" 
          boxShadow="0 0 35px rgba(102, 252, 241, 0.15)" 
          borderRadius="xl" 
          border="1px solid rgba(102, 252, 241, 0.1)"
          overflow="hidden"
        >
          <Box position="absolute" top="0" left="0" right="0" height="3px" bgGradient="linear(to-r, #66FCF1, #45A29E)" />
          
          <ModalHeader 
            borderBottom="1px solid rgba(102, 252, 241, 0.1)" 
            color="#66FCF1"
            fontSize="xl"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaInfoCircle} mr={3} />
            About Cancer Screening Tool
          </ModalHeader>
          
          <ModalCloseButton color="#66FCF1" _hover={{ bg: 'rgba(102, 252, 241, 0.1)' }} />
          
          <ModalBody py={8}>
            <Grid templateColumns={["1fr", "1fr", "100px 1fr"]} gap={6} mb={8}>
              <GridItem>
                <Box 
                  w="100px" 
                  h="100px" 
                  borderRadius="full" 
                  bg="rgba(102, 252, 241, 0.05)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaNotesMedical} color="#66FCF1" boxSize={10} />
                </Box>
              </GridItem>
              
              <GridItem>
                <Heading as="h3" size="md" color="#66FCF1" mb={4}>
                  Personalized Cancer Screening
                </Heading>
                
                <Text mb={5} lineHeight="1.8" fontSize="md">
                  This Cancer Screening Tool is designed to help identify which cancer screening tests are most appropriate for you based on your personal health profile and risk factors.
                </Text>
                
                <Text lineHeight="1.8" fontSize="md">
                  By answering a series of questions about your age, sex, family history, lifestyle, and other health factors, we can provide personalized recommendations for cancer screening.
                </Text>
              </GridItem>
            </Grid>
            
            <Box 
              mb={8} 
              p={6} 
              borderRadius="md" 
              bg="rgba(15, 20, 30, 0.6)"
              border="1px solid rgba(102, 252, 241, 0.1)"
            >
              <Heading as="h4" size="sm" color="#66FCF1" mb={4}>
                The Importance of Early Detection
              </Heading>
              
              <Text lineHeight="1.8" fontSize="md">
                Early detection through appropriate screening is one of the most effective ways to improve cancer treatment outcomes. Not everyone needs every screening test, and this tool helps determine which ones may be most beneficial for you.
              </Text>
            </Box>
            
            <Box 
              mb={8}
              p={6}
              borderRadius="md"
              bg="rgba(15, 20, 30, 0.6)" 
              border="1px solid rgba(102, 252, 241, 0.1)"
            >
              <Heading as="h4" size="sm" color="#66FCF1" mb={4} display="flex" alignItems="center">
                <Icon as={FaFileDownload} mr={2} /> 
                Secure Documentation
              </Heading>
              
              <Text lineHeight="1.8" fontSize="md">
                Upon completion, you'll receive a secure, downloadable document that summarizes all your provided medical information and recommended screening tests.
              </Text>
            </Box>
            
            <Box 
              p={5} 
              borderRadius="lg"
              bg="rgba(102, 252, 241, 0.05)" 
              borderLeft="4px solid #66FCF1"
              display="flex"
            >
              <Icon as={FaShieldAlt} color="#66FCF1" boxSize={6} mr={4} mt={1} />
              <Text fontWeight="medium" fontSize="sm" color="#C5C6C7">
                Note: This tool provides recommendations only and does not replace professional medical advice. Always consult with your healthcare provider about which screening tests are right for you.
              </Text>
            </Box>
          </ModalBody>
          
          <ModalFooter 
            borderTop="1px solid rgba(102, 252, 241, 0.1)"
            bg="rgba(15, 20, 30, 0.4)"
          >
            <Button 
              bg="#66FCF1" 
              _hover={{ bg: "#45A29E" }} 
              color="#0B0C10" 
              mr={3} 
              onClick={onAboutClose} 
              fontWeight="bold"
              px={8}
              borderRadius="full"
              leftIcon={<FaCheckCircle />}
            >
              Got It
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Contact Modal */}
      <Modal isOpen={isContactOpen} onClose={onContactClose} size="md">
        <ModalOverlay bg="rgba(11, 12, 16, 0.8)" backdropFilter="blur(6px)" />
        <ModalContent 
          bg="#0F141E" 
          color="#C5C6C7" 
          boxShadow="0 0 35px rgba(102, 252, 241, 0.15)" 
          borderRadius="xl" 
          border="1px solid rgba(102, 252, 241, 0.1)"
          overflow="hidden"
        >
          <Box position="absolute" top="0" left="0" right="0" height="3px" bgGradient="linear(to-r, #66FCF1, #45A29E)" />
          
          <ModalHeader 
            borderBottom="1px solid rgba(102, 252, 241, 0.1)" 
            color="#66FCF1"
            fontSize="xl"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaEnvelope} mr={3} />
            Contact Us
          </ModalHeader>
          
          <ModalCloseButton color="#66FCF1" _hover={{ bg: 'rgba(102, 252, 241, 0.1)' }} />
          
          <ModalBody py={8}>
            <VStack align="stretch" spacing={6}>
              <Box 
                bg="rgba(15, 20, 30, 0.7)" 
                p={5} 
                borderRadius="lg" 
                w="full"
                borderLeft="3px solid #66FCF1"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                <Flex align="center">
                  <Box 
                    borderRadius="full" 
                    bg="rgba(102, 252, 241, 0.1)" 
                    p={2}
                    mr={4}
                  >
                    <Icon as={FaNotesMedical} color="#66FCF1" boxSize={5} />
                  </Box>
                  <Box>
                    <Heading size="sm" mb={2} color="#66FCF1" fontWeight="bold">Location</Heading>
                    <Text fontSize="md" color="#C5C6C7">Sky Premium Hospital</Text>
                    <Text fontSize="md" color="#C5C6C7">Madina 1156, Accra, Ghana</Text>
                  </Box>
                </Flex>
              </Box>
              
              <Box 
                bg="rgba(15, 20, 30, 0.7)" 
                p={5} 
                borderRadius="lg" 
                w="full"
                borderLeft="3px solid #66FCF1"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                <Flex align="center">
                  <Box 
                    borderRadius="full" 
                    bg="rgba(102, 252, 241, 0.1)" 
                    p={2}
                    mr={4}
                  >
                    <Icon as={FaEnvelope} color="#66FCF1" boxSize={5} />
                  </Box>
                  <Box>
                    <Heading size="sm" mb={2} color="#66FCF1" fontWeight="bold">Screening Program Office</Heading>
                    <Text fontSize="md" color="#C5C6C7">Phone: (555) 123-4567</Text>
                    <Text 
                      fontSize="md" 
                      color="#66FCF1" 
                      _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      sphscreeningtech@gmail.com
                    </Text>
                  </Box>
                </Flex>
              </Box>
              
              <Box 
                bg="rgba(15, 20, 30, 0.7)" 
                p={5} 
                borderRadius="lg" 
                w="full"
                borderLeft="3px solid #66FCF1"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                <Flex align="center">
                  <Box 
                    borderRadius="full" 
                    bg="rgba(102, 252, 241, 0.1)" 
                    p={2}
                    mr={4}
                  >
                    <Icon as={FaClipboardList} color="#66FCF1" boxSize={5} />
                  </Box>
                  <Box>
                    <Heading size="sm" mb={2} color="#66FCF1" fontWeight="bold">Hours</Heading>
                    <Text fontSize="md" color="#C5C6C7">Monday - Friday: 8:00 AM - 5:00 PM</Text>
                    <Text fontSize="md" color="#C5C6C7">Saturday: 9:00 AM - 1:00 PM</Text>
                    <Text fontSize="md" color="#C5C6C7">Sunday: Closed</Text>
                  </Box>
                </Flex>
              </Box>
              
              <Flex 
                p={5} 
                borderRadius="lg"
                bg="rgba(102, 252, 241, 0.05)" 
                align="center"
              >
                <Icon as={FaShieldAlt} color="#66FCF1" boxSize={6} mr={4} />
                <Text fontStyle="italic" fontWeight="medium" fontSize="sm">
                  For medical emergencies, please call 911 or go to your nearest emergency room.
                </Text>
              </Flex>
            </VStack>
          </ModalBody>
          
          <ModalFooter 
            borderTop="1px solid rgba(102, 252, 241, 0.1)"
            bg="rgba(15, 20, 30, 0.4)"
          >
            <Button 
              bg="#66FCF1" 
              _hover={{ bg: "#45A29E" }} 
              color="#0B0C10" 
              mr={3} 
              onClick={onContactClose} 
              fontWeight="bold"
              px={8}
              borderRadius="full"
              leftIcon={<FaCheckCircle />}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

//my landing page is goood
export default LandingPage;