import { useState, useRef, useEffect } from 'react';

import {
  Box,
  Flex,
  Text,
  Button,
  ButtonGroup,
  VStack,
  HStack,
  Avatar,
  Badge,
  Heading,
  useColorModeValue,
  Icon,
  Divider,
  useToast,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Select} from '@chakra-ui/react';

import { 
  FaUserMd, 
  FaHeartbeat, 
  FaNotesMedical} from 'react-icons/fa';

import { maleCancerTypes, femaleCancerTypes } from './cancerTypes';

function App() {
  // Define the flowchart of conversation
  const conversationFlow = {
    start: {
      question: "Hello, I'm your medical screening assistant. I'd like to ask you a few questions about your health and medical history. Would you like to proceed?",
      options: [
        { text: "Yes, let's begin", nextId: "age" },
        { text: "What information will you collect?", nextId: "info" }
      ]
    },
    info: {
      question: "I'll be collecting basic health information including your demographics, medical history, medications, and allergies. This information helps us recommend the cancer test you'll most likely need to take.",
      options: [
        { text: "OK, let's start", nextId: "age" },
        { text: "Maybe later", nextId: "end" }
      ]
    },
    age: {
      question: "What is your current age? Only Digits from 0-9 allowed.",
      options: [], // Empty options because we're using the custom input field
      inputType: "age"
    },
    sex: {
      question: "What sex were you assigned at birth?",
      options: [
        { text: "Male", nextId: "ethnicity" },
        { text: "Female", nextId: "ethnicity" }
      ]
    },
    ethnicity: {
      question: "What is your ethnicity?",
      options: [],
      inputType: "ethnicity"
    },
    location: {
      question: "Where do you live (country/region)?",
      options: [],
      inputType: "country"
    },
    cancer: {
      question: "Have you ever been diagnosed with cancer?",
      options: [
        { text: "Yes", nextId: "cancerDetails" },
        { text: "No", nextId: "familyHistory" }
      ]
    },
    cancerDetails: {
      question: "Please provide details about your cancer diagnosis:",
      options: [],
      inputType: "cancer"
    },
    familyHistory: {
      question: "Has a first-degree relative (parent, sibling, child) ever been diagnosed with cancer?",
      options: [
        { text: "Yes", nextId: "familyHistoryDetails" },
        { text: "No", nextId: "chronicConditions" }
      ]
    },
    familyHistoryDetails: {
      question: "Please provide details about your family member's cancer diagnosis:",
      options: [],
      inputType: "familyCancer"
    },
    chronicConditions: {
      question: "Do you have any of the following chronic conditions?",
      options: [],
      inputType: "chronic"
    },
    smokingStatus: {
      question: "Do you currently smoke or have you smoked in the past?",
      options: [
        { text: "Yes", nextId: "smokingYears" },
        { text: "No", nextId: "transplant" }
      ]
    },
    smokingYears: {
      question: "How many years have you smoked?",
      options: [],
      inputType: "smokingYears"
    },
    smokingAmount: {
      question: "How many cigarettes a week on average?",
      options: [],
      inputType: "smokingAmount"
    },
    transplant: {
      question: "Have you had organ transplants or immunosuppressive therapy?",
      options: [
        { text: "Yes", nextId: "medications" },
        { text: "No", nextId: "medications" }
      ]
    },
    medications: {
      question: "Are you currently taking any of the following medications?",
      options: [],
      inputType: "medications"
    },
    allergies: {
      question: "Do you have any known drug allergies?",
      options: [
        { text: "Yes", nextId: "allergyDetails" },
        { text: "No", nextId: "checkSex" }
      ]
    },
    checkSex: {
      question: "Thank you for providing your allergy information.",
      options: [
        { text: "Continue", nextId: "routeBasedOnSex" }
      ]
    },
    routeBasedOnSex: {
      question: "Processing your information...",
      options: []
    },
    allergyDetails: {
      question: "Please specify your drug allergies:",
      options: [],
      inputType: "allergies"
    },
    maleQuestions: {
      question: "We have some additional male-specific health questions. Let's continue with those.",
      options: [
        { text: "Continue", nextId: "urinarySymptoms" }
      ]
    },
    urinarySymptoms: {
      question: "Have you experienced urinary symptoms (e.g., weak stream, nocturia)?",
      options: [
        { text: "Yes", nextId: "prostateTest" },
        { text: "No", nextId: "prostateTest" }
      ]
    },
    prostateTest: {
      question: "Have you ever had a Prostate Antigen Test?",
      options: [
        { text: "Yes", nextId: "prostateTestAge" },
        { text: "No", nextId: "testicularIssues" }
      ]
    },
    prostateTestAge: {
      question: "What age were you when you took your last prostate antigen test?",
      options: [],
      inputType: "prostateTestAge"
    },
    testicularIssues: {
      question: "Have you had testicular pain, swelling, or history of undescended testis?",
      options: [
        { text: "Yes", nextId: "summary" },
        { text: "No", nextId: "summary" }
      ]
    },
    femaleQuestions: {
      question: "We have some additional female-specific health questions. Let's continue with those.",
      options: [
        { text: "Continue", nextId: "menarcheAge" }
      ]
    },
    menarcheAge: {
      question: "At what age did your periods start (menarche)?",
      options: [],
      inputType: "menarcheAge"
    },
    menstruationStatus: {
      question: "Are you currently menstruating?",
      options: [
        { text: "Premenopausal", nextId: "pregnancy" },
        { text: "Postmenopausal", nextId: "pregnancy" }
      ]
    },
    pregnancy: {
      question: "Have you ever been pregnant?",
      options: [
        { text: "Yes", nextId: "firstPregnancyAge" },
        { text: "No", nextId: "hormoneTreatment" }
      ]
    },
    firstPregnancyAge: {
      question: "What age was your first full term pregnancy?",
      options: [],
      inputType: "pregnancyAge"
    },
    hormoneTreatment: {
      question: "Have you ever taken birth control or hormone replacement therapy (HRT)?",
      options: [
        { text: "Yes", nextId: "hpvVaccine" },
        { text: "No", nextId: "hpvVaccine" }
      ]
    },
    hpvVaccine: {
      question: "Have you received the HPV vaccine?",
      options: [
        { text: "Yes", nextId: "summary" },
        { text: "No", nextId: "summary" }
      ]
    },
    summary: {
      question: "Thank you for completing your medical screening. This information will help healthcare providers better understand your health status and provide appropriate care recommendations.",
      options: [
        { text: "Start a new screening", nextId: "start" },
        { text: "End conversation", nextId: "end" }
      ]
    },
    end: {
      question: "Thank you for completing the medical screening. Your health information has been recorded. Have a great day!",
      options: [
        { text: "Start a new screening", nextId: "start" }
      ]
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: conversationFlow.start.question,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState('start');
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // List of ethnicities
  const ethnicities = [
    "Asian", 
    "Black or African American", 
    "Hispanic or Latino", 
    "Native American", 
    "Pacific Islander", 
    "White or Caucasian", 
    "Middle Eastern or North African",
    "Multiracial", 
    "Other",
    "Prefer not to say"
  ];
  
  // List of all countries
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
    "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
    "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
    "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Prefer not to say"
  ];

  const [ageInput, setAgeInput] = useState('');
  const [ageError, setAgeError] = useState('');
  const [ethnicityInput, setEthnicityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [userSex, setUserSex] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [cancerAgeInput, setCancerAgeInput] = useState('');
  const [cancerAgeError, setCancerAgeError] = useState('');
  const [chronicConditions, setChronicConditions] = useState({
    diabetes: false,
    hiv: false,
    ibd: false,
    hepatitisB: false,
    hepatitisC: false,
    none: false
  });
  const [medications, setMedications] = useState({
    anticoagulants: false,
    statins: false,
    antihypertensives: false,
    antidepressants: false,
    opioids: false,
    steroids: false,
    antibiotics: false,
    none: false
  });
  const [allergyInput, setAllergyInput] = useState('');
  const [familyCancerType, setFamilyCancerType] = useState('');
  const [familyCancerAgeInput, setFamilyCancerAgeInput] = useState('');
  const [familyCancerAgeError, setFamilyCancerAgeError] = useState('');
  const [familyRelation, setFamilyRelation] = useState('');
  const [smokingYearsInput, setSmokingYearsInput] = useState('');
  const [smokingYearsError, setSmokingYearsError] = useState('');
  const [smokingAmountInput, setSmokingAmountInput] = useState('');
  const [smokingAmountError, setSmokingAmountError] = useState('');
  const [menarcheAgeInput, setMenarcheAgeInput] = useState('');
  const [menarcheAgeError, setMenarcheAgeError] = useState('');
  const [menstruationStatus, setMenstruationStatus] = useState('');
  const [pregnancyAgeInput, setPregnancyAgeInput] = useState('');
  const [pregnancyAgeError, setPregnancyAgeError] = useState('');
  
  // Handle clicking a response option
  const handleOptionSelect = (optionText, nextId) => {
    // Save sex if we're in the sex question
    if (currentStep === 'sex') {
      setUserSex(optionText);
    }
    
    // Add user's selected option as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: optionText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Special handling for routing based on sex
    if (nextId === 'routeBasedOnSex') {
      setTimeout(() => {
        routeBasedOnSex();
      }, 1000);
      return;
    }
    
    // Move to the next step in the conversation flow
    setTimeout(() => {
      const nextStep = conversationFlow[nextId];
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep(nextId);
        
        toast({
          title: "Response recorded",
          description: "Moving to next question",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Handle submitting the age input
  const handleAgeSubmit = () => {
    // Validate age input
    if (!ageInput.trim()) {
      setAgeError('Age is required');
      return;
    }
    
    const age = parseInt(ageInput);
    
    if (isNaN(age) || age < 0 || age > 120) {
      setAgeError('Please enter a valid age between 0 and 120');
      return;
    }
    
    // Clear error
    setAgeError('');
    
    // Add user's age as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${age} years old`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setAgeInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.sex;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('sex');
        
        toast({
          title: "Age recorded",
          description: "Moving to next question",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Handle submitting the ethnicity selection
  const handleEthnicitySubmit = () => {
    // Validate ethnicity input
    if (!ethnicityInput) {
      toast({
        title: "Error",
        description: "Please select your ethnicity",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    // Add user's ethnicity as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: ethnicityInput,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setEthnicityInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.location;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('location');
        
        toast({
          title: "Ethnicity recorded",
          description: "Moving to location information",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Handle submitting the country selection
  const handleCountrySubmit = () => {
    // Validate country input
    if (!countryInput) {
      toast({
        title: "Error",
        description: "Please select a country",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    // Add user's country as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: countryInput,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setCountryInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.cancer;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('cancer');
        
        toast({
          title: "Location recorded",
          description: "Moving to medical history questions",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };

  // Handle submitting cancer details
  const handleCancerDetailsSubmit = () => {
    // Validate cancer inputs
    if (!cancerType) {
      toast({
        title: "Error",
        description: "Please select a cancer type",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    if (!cancerAgeInput.trim()) {
      setCancerAgeError('Age at diagnosis is required');
      return;
    }
    
    const age = parseInt(cancerAgeInput);
    
    if (isNaN(age) || age < 0 || age > 120) {
      setCancerAgeError('Please enter a valid age between 0 and 120');
      return;
    }

    // Clear error
    setCancerAgeError('');
    
    // Add user's cancer details as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Cancer type: ${cancerType}, Age at diagnosis: ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear inputs
    setCancerType('');
    setCancerAgeInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.familyHistory;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('familyHistory');
        
        toast({
          title: "Cancer details recorded",
          description: "Moving to next question",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };

  // Handle submitting chronic conditions
  const handleChronicConditionsSubmit = () => {
    const selectedConditions = Object.entries(chronicConditions)
      .filter(([_, selected]) => selected)
      .map(([condition, _]) => {
        switch(condition) {
          case 'diabetes': return 'Diabetes';
          case 'hiv': return 'HIV';
          case 'ibd': return 'Inflammatory Bowel Disease';
          case 'hepatitisB': return 'Hepatitis B';
          case 'hepatitisC': return 'Hepatitis C';
          case 'none': return 'None';
          default: return condition;
        }
      });
    
    if (selectedConditions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one option",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    // Add user's chronic conditions as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: selectedConditions.length > 0 ? 
          `Chronic conditions: ${selectedConditions.join(', ')}` : 
          'No chronic conditions',
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Reset chronic conditions
    setChronicConditions({
      diabetes: false,
      hiv: false,
      ibd: false,
      hepatitisB: false,
      hepatitisC: false,
      none: false
    });
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.smokingStatus;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('smokingStatus');
        
        toast({
          title: "Chronic conditions recorded",
          description: "Moving to lifestyle questions",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };

  // Handle family cancer history details submission
  const handleFamilyCancerDetailsSubmit = () => {
    // Validate family cancer inputs
    if (!familyCancerType) {
      toast({
        title: "Error",
        description: "Please select a cancer type",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    if (!familyRelation) {
      toast({
        title: "Error",
        description: "Please select a family relation",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    if (!familyCancerAgeInput.trim()) {
      setFamilyCancerAgeError('Age at diagnosis is required');
      return;
    }
    
    const age = parseInt(familyCancerAgeInput);
    
    if (isNaN(age) || age < 0 || age > 120) {
      setFamilyCancerAgeError('Please enter a valid age between 0 and 120');
      return;
    }

    // Clear error
    setFamilyCancerAgeError('');
    
    // Add user's family cancer details as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Family member with cancer: ${familyRelation}, Cancer type: ${familyCancerType}, Age at diagnosis: ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear inputs
    setFamilyCancerType('');
    setFamilyRelation('');
    setFamilyCancerAgeInput('');
    
    // Move to the next step (chronicConditions)
    setTimeout(() => {
      const nextStep = conversationFlow.chronicConditions;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('chronicConditions');
        
        toast({
          title: "Family cancer history recorded",
          description: "Moving to chronic conditions questions",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };

  // Handle submitting the transplant response
  const handleTransplantResponse = (optionText, nextId) => {
    // Add user's transplant response as a message
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: optionText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Move to the medications step
    setTimeout(() => {
      const nextStep = conversationFlow.medications;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('medications');
        
        toast({
          title: "Transplant info recorded",
          description: "Moving to medication history",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };

  // Handle pregnancy age input
 // Handle pregnancy age input
 const handlePregnancyAgeSubmit = () => {
  // Validate pregnancy age input
  if (!pregnancyAgeInput.trim()) {
    setPregnancyAgeError('Age at first pregnancy is required');
    return;
  }
  
  const age = parseInt(pregnancyAgeInput);
  
  if (isNaN(age) || age < 14 || age > 50) {
    setPregnancyAgeError('Please enter a valid age between 14 and 50');
    return;
  }
  
  // Clear error
  setPregnancyAgeError('');
  
  // Add user's pregnancy age as a message
  setMessages(prev => [
    ...prev, 
    {
      id: prev.length + 1,
      text: `First full-term pregnancy at age ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  
  // Clear input
  setPregnancyAgeInput('');
  
  // Move to the next step (hormoneTreatment)
  setTimeout(() => {
    const nextStep = conversationFlow.hormoneTreatment;
    
    if (nextStep) {
      // Add bot's next question
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Update the current step
      setCurrentStep('hormoneTreatment');
      
      toast({
        title: "Pregnancy information recorded",
        description: "Moving to hormone treatment question",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
    }
  }, 1000);
 };
  
  // Handle menarche age input
 const handleMenarcheAgeSubmit = () => {
  // Validate menarche age input
  if (!menarcheAgeInput.trim()) {
    setMenarcheAgeError('Age at first period is required');
    return;
  }
  
  const age = parseInt(menarcheAgeInput);
  
  if (isNaN(age) || age < 8 || age > 18) {
    setMenarcheAgeError('Please enter a valid age between 8 and 18');
    return;
  }
  
  // Clear error
  setMenarcheAgeError('');
  
  // Add user's menarche age as a message
  setMessages(prev => [
    ...prev, 
    {
      id: prev.length + 1,
      text: `First period at age ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  
  // Clear input
  setMenarcheAgeInput('');
  
  // Move to the next step (menstruationStatus)
  setTimeout(() => {
    const nextStep = conversationFlow.menstruationStatus;
    
    if (nextStep) {
      // Add bot's next question
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Update the current step
      setCurrentStep('menstruationStatus');
      
      toast({
        title: "Menarche information recorded",
        description: "Moving to next question",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
    }
  }, 1000);
 };
  
  // Handle submitting medications information
  const handleMedicationsSubmit = () => {
    const selectedMedications = Object.entries(medications)
      .filter(([_, selected]) => selected)
      .map(([medication, _]) => {
        switch(medication) {
          case 'anticoagulants': return 'Anticoagulants/Blood thinners';
          case 'statins': return 'Cholesterol medications (Statins)';
          case 'antihypertensives': return 'Blood pressure medications';
          case 'antidepressants': return 'Antidepressants';
          case 'opioids': return 'Pain medications (Opioids)';
          case 'steroids': return 'Steroids';
          case 'antibiotics': return 'Antibiotics';
          case 'none': return 'None';
          default: return medication;
        }
      });
    
    if (selectedMedications.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one option",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    // Add user's medications as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: selectedMedications.length > 0 ? 
          `Medications: ${selectedMedications.join(', ')}` : 
          'No medications',
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Reset medications
    setMedications({
      anticoagulants: false,
      statins: false,
      antihypertensives: false,
      antidepressants: false,
      opioids: false,
      steroids: false,
      antibiotics: false,
      none: false
    });
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.allergies;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('allergies');
        
        toast({
          title: "Medications recorded",
          description: "Moving to allergy questions",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Handle allergyDetails submission
  const handleAllergySubmit = () => {
    // Validate allergy input
    if (!allergyInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter your allergies",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    // Add user's allergies as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Drug allergies: ${allergyInput}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setAllergyInput('');
    
    // Move to the routing step
    setTimeout(() => {
      routeBasedOnSex();
    }, 1000);
  };
        
  // Handle smoking years input
  const handleSmokingYearsSubmit = () => {
    // Validate years input
    if (!smokingYearsInput.trim()) {
      setSmokingYearsError('Number of years is required');
      return;
    }
    
    const years = parseInt(smokingYearsInput);
    
    if (isNaN(years) || years < 0 || years > 100) {
      setSmokingYearsError('Please enter a valid number between 0 and 100');
      return;
    }
    
    // Clear error
    setSmokingYearsError('');
    
    // Add user's smoking years as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${years} years of smoking`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setSmokingYearsInput('');
    
    // Move to the next step (smokingAmount)
    setTimeout(() => {
      const nextStep = conversationFlow.smokingAmount;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('smokingAmount');
        
        toast({
          title: "Smoking years recorded",
          description: "Moving to smoking amount question",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Handle smoking amount input
  const handleSmokingAmountSubmit = () => {
    // Validate amount input
    if (!smokingAmountInput.trim()) {
      setSmokingAmountError('Number of cigarettes is required');
      return;
    }
    
    const amount = parseInt(smokingAmountInput);
    
    if (isNaN(amount) || amount < 0) {
      setSmokingAmountError('Please enter a valid number of cigarettes');
      return;
    }
    
    // Clear error
    setSmokingAmountError('');
    
    // Add user's smoking amount as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${amount} cigarettes per week`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setSmokingAmountInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.transplant;
      
      if (nextStep) {
        // Add bot's next question
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        // Update the current step
        setCurrentStep('transplant');
        
        toast({
          title: "Smoking information recorded",
          description: "Moving to next question",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      }
    }, 1000);
  };
  
  // Special routing function based on user sex
  const routeBasedOnSex = () => {
    const nextId = userSex === "Female" ? "femaleQuestions" : "summary";
    const nextStep = conversationFlow[nextId];
      
    if (nextStep) {
      // Add bot's next message
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Update the current step
      setCurrentStep(nextId);
      
      toast({
        title: "Medical information recorded",
        description: nextId === "summary" ? "Completing medical history" : 
                    "Moving to female health questions",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('teal.500', 'teal.400');
  const userBubbleColor = useColorModeValue('#bee3f8', '#2a4365');

  return (
    <Box w="100vw" h="100vh" overflow="hidden" position="fixed" top="0" left="0">
      <Flex direction="column" h="100%">
        {/* Header */}
        <Box 
          py={4} 
          px={6} 
          bg={headerBg} 
          color="white" 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
        >
          <Flex align="center" justify="space-between">
            <Flex align="center">
              <Icon as={FaNotesMedical} boxSize={7} mr={3} />
              <VStack align="start" spacing={0}>
                <Heading size="md">Medical Screening Bot</Heading>
                <HStack>
                  <Badge colorScheme="green" px={2} py={0.5} borderRadius="full">Online</Badge>
                  <Icon as={FaHeartbeat} color="red.400" animation="pulse 1.5s infinite" />
                </HStack>
              </VStack>
            </Flex>
            <Text fontSize="sm" fontWeight="bold">Medical Screening Bot v1.0</Text>
          </Flex>
        </Box>
        
        {/* Messages Container */}
        <VStack 
          flex="1"
          overflowY="auto" 
          p={4} 
          spacing={4} 
          bg={useColorModeValue('gray.50', 'gray.900')}
          align="stretch"
          w="100%"
        >
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              <HStack
                maxW="70%"
                bg={message.sender === 'user' ? 'blue.100' : bg}
                p={4}
                borderRadius={message.sender === 'user' ? "2xl 2xl 0 2xl" : "2xl 2xl 2xl 0"}
                borderWidth="1px"
                borderColor={message.sender === 'user' ? 'blue.200' : 'teal.100'}
                boxShadow="md"
                spacing={3}
                position="relative"
                _after={
                  message.sender === 'user' 
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        right: -5,
                        borderWidth: '10px',
                        borderStyle: 'solid',
                        borderColor: `transparent transparent ${userBubbleColor} transparent`,
                        transform: 'rotate(-45deg)',
                        display: 'block'
                      }
                    : {}
                }
              >
                {message.sender === 'bot' && (
                  <Avatar 
                    size="sm" 
                    bg="teal.500" 
                    icon={<Icon as={FaUserMd} color="white" />} 
                  />
                )}
                <VStack align={message.sender === 'user' ? 'end' : 'start'} spacing={1}>
                  <Text>{message.text}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </VStack>
                {message.sender === 'user' && (
                  <Avatar size="sm" bg="blue.500" />
                )}
              </HStack>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
        
        <Divider />
        
        {/* Response Options Area */}
        <Box p={5} bg={bg} borderTopWidth="1px" borderColor={borderColor} boxShadow="0 -2px 10px rgba(0,0,0,0.05)">
          {currentStep === 'age' ? (
            <FormControl isInvalid={!!ageError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter your age (0-120)"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAgeSubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handleAgeSubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {ageError && <FormErrorMessage>{ageError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'ethnicity' ? (
            <FormControl>
              <Select
                placeholder="Select your ethnicity"
                value={ethnicityInput}
                onChange={(e) => setEthnicityInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="teal.400"
                mb={3}
              >
                {ethnicities.map((ethnicity, index) => (
                  <option key={index} value={ethnicity}>
                    {ethnicity}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="teal"
                onClick={handleEthnicitySubmit}
                isFullWidth
                borderRadius="full"
              >
                Submit
              </Button>
            </FormControl>
          ) : currentStep === 'location' ? (
            <FormControl>
              <Select
                placeholder="Select your country"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="teal.400"
                mb={3}
              >
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="teal"
                onClick={handleCountrySubmit}
                isFullWidth
                borderRadius="full"
              >
                Submit
              </Button>
            </FormControl>
          ) : currentStep === 'cancerDetails' ? (
            <VStack spacing={3} align="stretch">
              <FormControl>
                <Select
                  placeholder="Select your cancer type"
                  value={cancerType}
                  onChange={(e) => setCancerType(e.target.value)}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                  mb={3}
                >
                  {(userSex === 'Male' ? maleCancerTypes : femaleCancerTypes).map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isInvalid={!!cancerAgeError}>
                <InputGroup size="md">
                  <Input 
                    type="number"
                    placeholder="Enter your age at diagnosis (0-120)"
                    value={cancerAgeInput}
                    onChange={(e) => setCancerAgeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCancerDetailsSubmit();
                      }
                    }}
                    borderRadius="md"
                    focusBorderColor="teal.400"
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      colorScheme="teal"
                      onClick={handleCancerDetailsSubmit}
                    >
                      Submit
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {cancerAgeError && <FormErrorMessage>{cancerAgeError}</FormErrorMessage>}
              </FormControl>
            </VStack>
          ) : currentStep === 'chronicConditions' ? (
            <VStack spacing={3} align="stretch">
              <HStack spacing={4} w="100%">
                <Button
                  colorScheme={chronicConditions.diabetes ? "teal" : "gray"}
                  variant={chronicConditions.diabetes ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, diabetes: !prev.diabetes }))}
                  transition="all 0.2s"
                >
                  Diabetes
                </Button>
                <Button
                  colorScheme={chronicConditions.hiv ? "teal" : "gray"}
                  variant={chronicConditions.hiv ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hiv: !prev.hiv }))}
                  transition="all 0.2s"
                >
                  HIV
                </Button>
              </HStack>
              <HStack spacing={4} w="100%">
                <Button
                  colorScheme={chronicConditions.ibd ? "teal" : "gray"}
                  variant={chronicConditions.ibd ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, ibd: !prev.ibd }))}
                  transition="all 0.2s"
                >
                  Inflammatory Bowel Disease (IBD)
                </Button>
                <Button
                  colorScheme={chronicConditions.hepatitisB ? "teal" : "gray"}
                  variant={chronicConditions.hepatitisB ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hepatitisB: !prev.hepatitisB }))}
                  transition="all 0.2s"
                >
                  Hepatitis B
                </Button>
              </HStack>
              <HStack spacing={4} w="100%">
                <Button
                  colorScheme={chronicConditions.hepatitisC ? "teal" : "gray"}
                  variant={chronicConditions.hepatitisC ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hepatitisC: !prev.hepatitisC }))}
                  transition="all 0.2s"
                >
                  Hepatitis C
                </Button>
                <Button
                  colorScheme={chronicConditions.none ? "teal" : "gray"}
                  variant={chronicConditions.none ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, none: !prev.none }))}
                  transition="all 0.2s"
                >
                  None
                </Button>
              </HStack>
              <Button
                colorScheme="teal"
                onClick={handleChronicConditionsSubmit}
                isFullWidth
                borderRadius="full"
              >
                Submit
              </Button>
            </VStack>
          ) : currentStep === 'transplant' ? (
            <VStack spacing={3} align="stretch">
              {conversationFlow[currentStep]?.options.map((option, index) => (
                <Button
                  key={index}
                  colorScheme="teal"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'teal.50', borderColor: 'teal.400' }}
                  onClick={() => handleTransplantResponse(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                >
                  {option.text}
                </Button>
              ))}
            </VStack>
          ) : currentStep === 'medications' ? (
            <VStack spacing={3} align="stretch">
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.anticoagulants ? "teal" : "gray"}
                  variant={medications.anticoagulants ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, anticoagulants: !prev.anticoagulants }))}
                  transition="all 0.2s"
                >
                  Blood Thinners
                </Button>
                <Button
                  colorScheme={medications.statins ? "teal" : "gray"}
                  variant={medications.statins ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, statins: !prev.statins }))}
                  transition="all 0.2s"
                >
                  Cholesterol Meds
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.antihypertensives ? "teal" : "gray"}
                  variant={medications.antihypertensives ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antihypertensives: !prev.antihypertensives }))}
                  transition="all 0.2s"
                >
                  Blood Pressure Meds
                </Button>
                <Button
                  colorScheme={medications.antidepressants ? "teal" : "gray"}
                  variant={medications.antidepressants ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antidepressants: !prev.antidepressants }))}
                  transition="all 0.2s"
                >
                  Antidepressants
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.opioids ? "teal" : "gray"}
                  variant={medications.opioids ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, opioids: !prev.opioids }))}
                  transition="all 0.2s"
                >
                  Pain Medications
                </Button>
                <Button
                  colorScheme={medications.steroids ? "teal" : "gray"}
                  variant={medications.steroids ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, steroids: !prev.steroids }))}
                  transition="all 0.2s"
                >
                  Steroids
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.antibiotics ? "teal" : "gray"}
                  variant={medications.antibiotics ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antibiotics: !prev.antibiotics }))}
                  transition="all 0.2s"
                >
                  Antibiotics
                </Button>
                <Button
                  colorScheme={medications.none ? "teal" : "gray"}
                  variant={medications.none ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, none: !prev.none }))}
                  transition="all 0.2s"
                >
                  None
                </Button>
              </HStack>
              
              <Button
                colorScheme="teal"
                onClick={handleMedicationsSubmit}
                isFullWidth
                borderRadius="full"
                mt={2}
              >
                Submit
              </Button>
            </VStack>
          ) : currentStep === 'familyHistoryDetails' ? (
            <VStack spacing={3} align="stretch">
              <FormControl>
                <Select
                  placeholder="Select the family member"
                  value={familyRelation}
                  onChange={(e) => setFamilyRelation(e.target.value)}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                  mb={3}
                >
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <Select
                  placeholder="Select cancer type"
                  value={familyCancerType}
                  onChange={(e) => setFamilyCancerType(e.target.value)}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                  mb={3}
                >
                  {[...new Set([...maleCancerTypes, ...femaleCancerTypes])].map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isInvalid={!!familyCancerAgeError}>
                <InputGroup size="md">
                  <Input 
                    type="number"
                    placeholder="Enter their age at diagnosis (0-120)"
                    value={familyCancerAgeInput}
                    onChange={(e) => setFamilyCancerAgeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFamilyCancerDetailsSubmit();
                      }
                    }}
                    borderRadius="md"
                    focusBorderColor="teal.400"
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      colorScheme="teal"
                      onClick={handleFamilyCancerDetailsSubmit}
                    >
                      Submit
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {familyCancerAgeError && <FormErrorMessage>{familyCancerAgeError}</FormErrorMessage>}
              </FormControl>
            </VStack>
          ) : currentStep === 'smokingYears' ? (
            <FormControl isInvalid={!!smokingYearsError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter number of years (0-100)"
                  value={smokingYearsInput}
                  onChange={(e) => setSmokingYearsInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSmokingYearsSubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handleSmokingYearsSubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {smokingYearsError && <FormErrorMessage>{smokingYearsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'smokingAmount' ? (
            <FormControl isInvalid={!!smokingAmountError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter cigarettes per week"
                  value={smokingAmountInput}
                  onChange={(e) => setSmokingAmountInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSmokingAmountSubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handleSmokingAmountSubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {smokingAmountError && <FormErrorMessage>{smokingAmountError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'allergyDetails' ? (
            <FormControl>
              <InputGroup size="md">
                <Input 
                  placeholder="Enter your drug allergies (e.g., Penicillin, Sulfa drugs)"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAllergySubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handleAllergySubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          ) : currentStep === 'menarcheAge' ? (
            <FormControl isInvalid={!!menarcheAgeError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter age at first period (8-18)"
                  value={menarcheAgeInput}
                  onChange={(e) => setMenarcheAgeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMenarcheAgeSubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handleMenarcheAgeSubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {menarcheAgeError && <FormErrorMessage>{menarcheAgeError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'firstPregnancyAge' ? (
            <FormControl isInvalid={!!pregnancyAgeError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter age at first full-term pregnancy (14-50)"
                  value={pregnancyAgeInput}
                  onChange={(e) => setPregnancyAgeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePregnancyAgeSubmit();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="teal.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="teal"
                    onClick={handlePregnancyAgeSubmit}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {pregnancyAgeError && <FormErrorMessage>{pregnancyAgeError}</FormErrorMessage>}
            </FormControl>
          ) : (
            <VStack spacing={3} align="stretch">
              {conversationFlow[currentStep]?.options.map((option, index) => (
                <Button
                  key={index}
                  colorScheme="teal"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'teal.50', borderColor: 'teal.400' }}
                  onClick={() => handleOptionSelect(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                >
                  {option.text}
                </Button>
              ))}
            </VStack>
          )}
          
          <Text fontSize="xs" color="gray.500" mt={4} textAlign="center" fontWeight="medium">
            For emergencies, please call 911 or your local emergency number
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default App;
