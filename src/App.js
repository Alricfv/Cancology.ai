/**
 This file handles all of the UI components, rendering, and user interactions for the medical screening application.
 It uses React hooks for state management and Chakra UI for styling.
 It includes components for user input, displaying messages, and managing the conversation flow.
 It also includes logic for handling user responses, displaying summaries, and managing the conversation state.
 The application is designed to guide users through a series of questions related to their medical history, lifestyle, and demographics,
 ultimately providing a summary of their responses and recommendations for cancer screening based on their inputs

**/
import { useState, useRef, useEffect } from 'react';

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Avatar,
  Badge,
  Heading,
  useColorModeValue,
  Icon,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Select,
  useToast,
  Progress,
  Tooltip
} from '@chakra-ui/react';

import { 
  FaUserMd, 
  FaHeartbeat, 
  FaNotesMedical,
 } from 'react-icons/fa';

import LandingPage from './components/LandingPage';
import { maleCancerTypes, femaleCancerTypes } from './cancerTypes';
import SummaryComponentWrapper from './components/SummaryComponentWrapper';
import conversationFlow from './conversationFlow';

import {
  handleAgeSubmit,
  handleEthnicitySubmit,
  handleCountrySubmit,
  handleCancerDetailsSubmit,
  handleChronicConditionsSubmit,
  handleFamilyCancerDetailsSubmit,
  handleAlcoholResponse,
  handleTransplantResponse,
  handlePregnancyAgeSubmit,
  handleMenarcheAgeSubmit,
  handleMenopauseAgeSubmit,
  handleCancerScreeningDetailsSubmit,
  handleMedicationsSubmit,
  handleAllergySubmit,
  handleSmokingPacksSubmit,
  handleProstateTestAgeSubmit,
  handleSmokingYearsSubmit,
  handleAlcoholAmountSubmit,
  handleOptionSelect,
  handlePillYearsSubmit,
  handleNumberOfBirthsSubmit,
  handleFertilityDrugsSubmit,
  handleSaltySmokedFoodsSubmit,
  handleFruitVegServingsSubmit,
  handleHPyloriSubmit,
  handleHPyloriEradicationSubmit,
  handleGastritisUlcerSubmit,
  handleGastricGeneMutationSubmit,
  handlePerniciousAnemiaSubmit,
  handleEndometriosisSubmit
} from './components/HandlerFunctions';

function App() {
  // Pernicious Anemia state and handler
  const [perniciousAnemiaInput, setPerniciousAnemiaInput] = useState("");
  const [perniciousAnemiaError, setPerniciousAnemiaError] = useState("");
  const handlePerniciousAnemiaSubmitCall = (answer) => {
    setPerniciousAnemiaInput(answer);
    // Find the nextId from the selected option in conversationFlow.perniciousAnemia.options
    const nextId = conversationFlow.perniciousAnemia.options.find(opt => opt.text === answer)?.nextId;
    handlePerniciousAnemiaSubmit(
      answer,
      setPerniciousAnemiaError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setPerniciousAnemiaInput,
      nextId
    );
  };
  const [appState, setAppState] = useState('landing'); // State to track app state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: conversationFlow.start.question,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState('start');
  const [isProcessingSelection, setIsProcessingSelection] = useState(false); // Add loading state
  const [selectedOption, setSelectedOption] = useState(''); // Track the selected option

  // State for salty/smoked foods dropdown
  const [saltySmokedFoodsInput, setSaltySmokedFoodsInput] = useState("");
  const [saltySmokedFoodsError, setSaltySmokedFoodsError] = useState("");
  // Handler for salty/smoked foods submit
  const handleSaltySmokedFoodsSubmitCall = () => {
    handleSaltySmokedFoodsSubmit(
      saltySmokedFoodsInput,
      setSaltySmokedFoodsError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setSaltySmokedFoodsInput
    );
  };

  // State for fruit & vegetable servings dropdown
  const [fruitVegServingsInput, setFruitVegServingsInput] = useState("");
  const [fruitVegServingsError, setFruitVegServingsError] = useState("");
  // Handler for fruit & vegetable servings submit
  const handleFruitVegServingsSubmitCall = () => {
    handleFruitVegServingsSubmit(
      fruitVegServingsInput,
      setFruitVegServingsError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setFruitVegServingsInput
    );
  };

    // Endometriosis state and handler (Yes/No) - grouped with other medical history logic
  const [endometriosisInput, setEndometriosisInput] = useState("");
  const [endometriosisError, setEndometriosisError] = useState("");
  const handleEndometriosisSubmitCall = (answer) => {
    setEndometriosisInput(answer);
    // Find the nextId from the selected option in conversationFlow.endometriosis.options
    const nextId = conversationFlow.endometriosis.options.find(opt => opt.text === answer)?.nextId;
    handleEndometriosisSubmit(
      answer,
      setEndometriosisError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setEndometriosisInput,
      nextId
    );
  };

  const [gastritisUlcerInput, setGastritisUlcerInput] = useState("");
  const [gastritisUlcerError, setGastritisUlcerError] = useState("");
  // Handler for chronic gastritis/gastric ulcers submit (now Yes/No buttons)
  const handleGastritisUlcerSubmitCall = (answer) => {
    setGastritisUlcerInput(answer);
    handleGastritisUlcerSubmit(
      answer,
      setGastritisUlcerError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setGastritisUlcerInput
    );
  };

  // State for H. pylori infection question
  const [hPyloriInput, setHPyloriInput] = useState("");
  const [hPyloriError, setHPyloriError] = useState("");
  // State for H. pylori eradication therapy question
  const [hPyloriEradicationInput, setHPyloriEradicationInput] = useState("");
  const [hPyloriEradicationError, setHPyloriEradicationError] = useState("");
  // State for gastric cancer gene mutation question
  const [gastricGeneMutationInput, setGastricGeneMutationInput] = useState("");
  const [gastricGeneMutationError, setGastricGeneMutationError] = useState("");
  // Handler for H. pylori infection submit
  const handleHPyloriSubmitCall = () => {
    // Find nextId from the selected option in conversationFlow.hPylori.options
    const nextId = conversationFlow.hPylori.options.find(opt => opt.text === hPyloriInput)?.nextId;
    handleHPyloriSubmit(
      hPyloriInput,
      setHPyloriError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setHPyloriInput,
      nextId
    );
  };
  // Handler for H. pylori eradication therapy submit
  const handleHPyloriEradicationSubmitCall = () => {
    // Find nextId from the selected option in conversationFlow.hPyloriEradication.options
    const nextId = conversationFlow.hPyloriEradication.options.find(opt => opt.text === hPyloriEradicationInput)?.nextId;
    handleHPyloriEradicationSubmit(
      hPyloriEradicationInput,
      setHPyloriEradicationError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setHPyloriEradicationInput,
      nextId
    );
  };
  // Handler for gastric gene mutation submit
  const handleGastricGeneMutationSubmitCall = () => {
    const nextId = conversationFlow.gastricGeneMutation.options.find(opt => opt.text === gastricGeneMutationInput)?.nextId;
    handleGastricGeneMutationSubmit(
      gastricGeneMutationInput,
      setGastricGeneMutationError,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setGastricGeneMutationInput,
      nextId
    );
  };
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('blue.800', 'blue.700');
  const userBubbleColor = useColorModeValue('#bee3f8', '#2a4365');
  const messagesBg = useColorModeValue('gray.50', 'gray.900');
  
  // State to track all user responses in a consolidated format
  const [userResponses, setUserResponses] = useState({
    demographics: {
      age: null,
      sex: "",
      ethnicity: "",
      country: ""
    },
    medicalHistory: {
      personalCancer: {
        diagnosed: false,
        type: "",
        ageAtDiagnosis: null
      },
      familyCancer: {
        diagnosed: false,
        relation: "",
        type: "",
        ageAtDiagnosis: null
      },
      chronicConditions: []
    },
    lifestyle: {
      smoking: {
        current: false,
        years: null,
        packsPerDay: null,
        packYears: null
      },
      alcohol: {
        consumes: false,
        drinksPerWeek: null
      },
      sexualHealth: {
        unprotectedSexOrHpvHiv: false
      },
      transplant: false
    },
    medications: [],
    allergies: "",
    cancerScreening: {
      hadScreening: false,
      details: ""
    },
    vaccinations: {
      hpv: false,
      hepB: false
    },
    sexSpecificInfo: {
      male: {
        urinarySymptoms: false,
        prostateTest: {
          had: false,
          ageAtLast: null
        },
        testicularIssues: false
      },
      female: {
        menarcheAge: null,
        menstruationStatus: "",
        pregnancy: {
          hadPregnancy: false,
          ageAtFirst: null
        },
        pillYears: null,
        birthControl: null,
        hormoneReplacementTherapy: null,
        hormoneTreatment: false,
        IVF_history: null
      }
    }
  });

  // Handler for fertility (IVF) drugs submit
  const handleFertilityDrugsSubmitCall = (fertilityDrugsInput, nextId) => {
    handleFertilityDrugsSubmit(
      fertilityDrugsInput,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      nextId
    );
  };

  // Pill-years input state
  const [pillYearsInput, setPillYearsInput] = useState("");
  const [pillYearsError, setPillYearsError] = useState("");

  // Number of births input state
  const [numberOfBirthsInput, setNumberOfBirthsInput] = useState("");


  // Handler for number of births submit (delegates to HandlerFunctions.js)
  const handleNumberOfBirthsSubmitCall = () => {
    handleNumberOfBirthsSubmit(
      numberOfBirthsInput,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setNumberOfBirthsInput
    );
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // List of ethnicities
  const ethnicities = [ 
    "Black or African American", 
    "East Asian/South East Asian",
    "South Asian",
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
  const [smokingPacksInput, setSmokingPacksInput] = useState('');
  const [smokingPacksError, setSmokingPacksError] = useState('');
  const [smokingYearsInput, setSmokingYearsInput] = useState('');
  const [smokingYearsError, setSmokingYearsError] = useState('');
  const [alcoholAmountInput, setAlcoholAmountInput] = useState('');
  const [alcoholAmountError, setAlcoholAmountError] = useState('');
  const [PackYears, setPackYears] = useState(0);
  // Fertility drugs (IVF) state
  const [fertilityDrugsInput, setFertilityDrugsInput] = useState('');
  const [fertilityDrugsError, setFertilityDrugsError] = useState('');
  const [menarcheAgeInput, setMenarcheAgeInput] = useState('');
  const [menarcheAgeError, setMenarcheAgeError] = useState('');
  const [menstruationStatus, setMenstruationStatus] = useState('');
  const [pregnancyAgeInput, setPregnancyAgeInput] = useState('');
  const [pregnancyAgeError, setPregnancyAgeError] = useState('');
  // Menopause age input state
  const [menopauseAgeInput, setMenopauseAgeInput] = useState('');
  const [menopauseAgeError, setMenopauseAgeError] = useState('');
  // Handler for menopause age submit is now in HandlerFunctions.js
  const [prostateTestAgeInput, setProstateTestAgeInput] = useState('');
  const [prostateTestAgeError, setProstateTestAgeError] = useState('');
  const [cancerScreeningInput, setCancerScreeningInput] = useState('');
  // No need for error state for cancer screening as it's free text
  
  const handleAgeSubmitCall = () => {
    handleAgeSubmit(
      ageInput, 
      setAgeError, 
      setMessages, 
      messages, 
      setCurrentStep, 
      conversationFlow, 
      userResponses, 
      setUserResponses,
      setAgeInput);
  }

  const handleEthnicitySubmitCall = () => {
    handleEthnicitySubmit(ethnicityInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setEthnicityInput);
  }

  const handleCountrySubmitCall = () => {
    handleCountrySubmit(countryInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCountryInput);
  }

  const handleCancerDetailsSubmitCall = () => {
    handleCancerDetailsSubmit(
      cancerType, 
      cancerAgeInput, 
      setCancerAgeError, 
      toast,
      setUserResponses, 
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setCancerType,
      setCancerAgeInput);
  }

  const handleChronicConditionsSubmitCall = () => {
    handleChronicConditionsSubmit(
      chronicConditions, 
      toast,
      setUserResponses,
      setMessages,
      conversationFlow,
      setCurrentStep,
      setChronicConditions);
  }

  const handleFamilyCancerDetailsSubmitCall = () => {
    handleFamilyCancerDetailsSubmit(
      familyCancerType, 
      familyRelation,
      familyCancerAgeInput, 
      setFamilyCancerAgeError, 
      toast,
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setFamilyCancerType,
      setFamilyRelation,
      setFamilyCancerAgeInput);
  }

  const handleAlcoholResponseCall = (optionText = "Yes", nextId = "alcoholAmount") => {
    handleAlcoholResponse(
      optionText, 
      nextId, 
      isProcessingSelection, 
      setIsProcessingSelection, 
      setSelectedOption, 
      setMessages, 
      setUserResponses, 
      conversationFlow, 
      setCurrentStep);
  }

  const handleTransplantResponseCall = (optionText = "Yes", nextId = "transplant") => {
    handleTransplantResponse(
      optionText, 
      nextId, 
      isProcessingSelection, 
      setIsProcessingSelection, 
      setSelectedOption, 
      setMessages, 
      setUserResponses, 
      conversationFlow, 
      setCurrentStep);
  }

  const handlePregnancyAgeSubmitCall = () => {
    handlePregnancyAgeSubmit(
      pregnancyAgeInput, 
      setPregnancyAgeError, 
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setPregnancyAgeInput);
  }

  const handleMenarcheAgeSubmitCall = () => {
    handleMenarcheAgeSubmit(
      menarcheAgeInput, 
      setMenarcheAgeError, 
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setMenarcheAgeInput);
  }

  const handleCancerScreeningDetailsSubmitCall = () => {
    handleCancerScreeningDetailsSubmit(
      cancerScreeningInput, 
      toast,
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setCancerScreeningInput);
  }

  const handleMedicationsSubmitCall = () => {
    handleMedicationsSubmit(
      medications, 
      toast,
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setMedications);
  }

  const handleAllergySubmitCall = () => {
    handleAllergySubmit(
      allergyInput, 
      toast,
      setUserResponses,
      setMessages, 
      conversationFlow,
      setCurrentStep, 
      routeBasedOnSex,
      setAllergyInput);
  }

  const handleSmokingPacksSubmitCall = () => {
    handleSmokingPacksSubmit(
      smokingPacksInput, 
      setSmokingPacksError,
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep, 
      setSmokingPacksInput);
  }

  const handleSmokingYearsSubmitCall = () => {
    handleSmokingYearsSubmit(
      smokingYearsInput, 
      setSmokingYearsError,
      setMessages, 
      setCurrentStep, 
      conversationFlow, 
      userResponses, 
      setUserResponses,
      setSmokingYearsInput,
      setPackYears);  
  }

  const handleAlcoholAmountSubmitCall = () => {
    handleAlcoholAmountSubmit(
      alcoholAmountInput, 
      setAlcoholAmountError,
      setUserResponses,
      setMessages, 
      conversationFlow,
      setCurrentStep, 
      setAlcoholAmountInput);
  }

  const handleProstateTestAgeSubmitCall = () => {
    handleProstateTestAgeSubmit(
      prostateTestAgeInput, 
      setProstateTestAgeError,
      setUserResponses,
      setMessages, 
      conversationFlow, 
      setCurrentStep,
      setProstateTestAgeInput);
  }
  
  const handleOptionSelectCall = (optionText, nextId) => {
    handleOptionSelect(
      optionText,
      nextId,
      currentStep,
      isProcessingSelection,
      setIsProcessingSelection,
      setSelectedOption,
      setMessages,
      setUserResponses,
      userResponses,
      conversationFlow,
      setCurrentStep,
      userSex,
      setUserSex,
      setMenstruationStatus,
      routeBasedOnSex);
  }

  
  // Special routing function based on user sex
  const routeBasedOnSex = () => {
    const nextId = userSex === "Female" ? "femaleQuestions" : "maleQuestions";
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
    } 
    
    else {
      // Fallback in case something goes wrong
      console.error("Could not find next step for " + (userSex === "Female" ? "femaleQuestions" : "maleQuestions"));
      
      // Move to summary as a fallback
      const fallbackStep = conversationFlow.summary;
      if (fallbackStep) {
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: fallbackStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        setCurrentStep('summary');
      }
    }
  };

  // Helper function to calculate progress percentage based on current step
  const calculateProgress = () => {
    // Define the main path through the questionnaire
    
    // Map steps to their progress points (0-100%)
    const stepProgressMap = {
      'start': 0,
      'info': 0,
      'age': 5,
      'sex': 10,
      'ethnicity': 15, 
      'location': 20,
      'cancer': 25,
      'cancerDetails': 30,
      'familyHistory': 35,
      'familyHistoryDetails': 40,
      'chronicConditions': 45,
      'smokingStatus': 50,
      'alcoholConsumption': 55,
      'sexualHealth': 60,
      'transplant': 65,
      'medications': 70,
      'allergies': 75,
      // Gender specific questions branch
      'maleQuestions': 80,
      'urinarySymptoms': 82,
      'prostateTest': 85,
      'testicularIssues': 88,
      'femaleQuestions': 80,
      'menarcheAge': 82,
      'menstruationStatus': 85,
      'pregnancy': 88,
      'hormoneTreatment': 90,
      // Rejoin common path
      'pastCancerScreening': 90,
      'hpvVaccine': 93,
      'hepBVaccine': 96,
      'summary': 100,
      'end': 100};
    
    return stepProgressMap[currentStep] || 0;
  };

  // Helper function to get the current section name
  const getCurrentSectionName = () => {
    const sectionNames = {
      'start': 'Welcome',
      'info': 'Information',
      'age': 'Demographics',
      'sex': 'Demographics',
      'ethnicity': 'Demographics', 
      'location': 'Demographics',
      'cancer': 'Medical History',
      'cancerDetails': 'Medical History',
      'familyHistory': 'Family History',
      'familyHistoryDetails': 'Family History',
      'chronicConditions': 'Medical Conditions',
      'smokingStatus': 'Lifestyle',
      'smokingYears': 'Lifestyle',
      'smokingAmount': 'Lifestyle',
      'alcoholConsumption': 'Lifestyle',
      'alcoholAmount': 'Lifestyle',
      'sexualHealth': 'Lifestyle',
      'transplant': 'Medical History',
      'medications': 'Medications',
      'allergies': 'Allergies',
      'allergyDetails': 'Allergies',
      'maleQuestions': 'Men\'s Health',
      'urinarySymptoms': 'Men\'s Health',
      'prostateTest': 'Men\'s Health',
      'prostateTestAge': 'Men\'s Health',
      'testicularIssues': 'Men\'s Health',
      'femaleQuestions': 'Women\'s Health',
      'menarcheAge': 'Women\'s Health',
      'menstruationStatus': 'Women\'s Health',
      'pregnancy': 'Women\'s Health',
      'firstPregnancyAge': 'Women\'s Health',
      'hormoneTreatment': 'Women\'s Health',
      'pastCancerScreening': 'Screening History',
      'pastCancerScreeningDetails': 'Screening History',
      'hpvVaccine': 'Vaccinations',
      'hepBVaccine': 'Vaccinations',
      'summary': 'Results',
      'end': 'Complete'
    };
    
    return sectionNames[currentStep] || 'Screening';
  };

  if (appState === 'landing') {
    return <LandingPage onStart={() => setAppState('chatbot')} />;
  }

  return (
    <Box id="app-container" w="100%" h="100dvh" overflow="hidden" position="fixed" top="0" left="0" maxW="100vw">
      <Flex direction="column" h="100%" maxW="100vw" overflowX="hidden">
        {/* Header - Hidden when summary is displayed */}
        <Box 
          py={3} 
          px={6} 
          bg={headerBg} 
          color="white" 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          width="100%"
          maxW="100vw"
          display={currentStep === 'summary' ? 'none' : 'block'}
        >
          <Flex align="center" justify="space-between" mb={2}>
            <Flex align="center">
              <Icon as={FaNotesMedical} boxSize={7} mr={3} />
              <VStack align="start" spacing={0}>
                <Heading size="md">Cancer Screening Assistant</Heading>
                <HStack>
                  <Badge colorScheme="green" px={2} py={0.5} borderRadius="full">Online</Badge>
                  <Icon as={FaHeartbeat} color="red.400" animation="pulse 1.5s infinite" />
                </HStack>
              </VStack>
            </Flex>
            {/* Progress percentage */}
            <Tooltip label="Screening progress" placement="bottom">
              <Text fontSize="sm" fontWeight="bold">
                {calculateProgress()}% Complete
              </Text>
            </Tooltip>
          </Flex>
          
          {/* Section name and Progress Bar */}
          <Flex direction="column" width="100%" mt={1}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="medium" color="white">
                Section: {getCurrentSectionName()}
              </Text>
              <Text fontSize="xs" fontWeight="medium" color="white">
                {calculateProgress()}%
              </Text>
            </Flex>
            <Tooltip label={`${calculateProgress()}% complete`}>
              <Progress 
                value={calculateProgress()} 
                size="sm" 
                colorScheme="green" 
                borderRadius="full"
                hasStripe
                isAnimated
              />
            </Tooltip>
          </Flex>
        </Box>
        
        {/* Messages Container - Hidden when summary is displayed */}
        <VStack 
          flex="1"
          overflowY="auto" 
          overflowX="hidden"
          p={4} 
          spacing={4} 
          bg={messagesBg}
          align="stretch"
          w="100%"
          maxW="100vw"
          display={currentStep === 'summary' ? 'none' : 'flex'}
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
                borderColor={message.sender === 'user' ? 'blue.200' : 'blue.100'}
                boxShadow="md"
                spacing={3}
                position="relative"
              >
                {message.sender === 'bot' && (
                  <Avatar 
                    size="sm" 
                    bg="blue.700" 
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
        
        <Divider/>
        
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
                      handleAgeSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleAgeSubmitCall}>
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
                focusBorderColor="blue.400"
                mb={3}
              >
                {ethnicities.map((ethnicity, index) => (
                  <option key={index} value={ethnicity}>
                    {ethnicity}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleEthnicitySubmitCall}
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
                focusBorderColor="blue.400"
                mb={3}>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleCountrySubmitCall}
                isFullWidth
                borderRadius="full">
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
                  focusBorderColor="blue.400"
                  mb={3}>
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
                    placeholder="Enter your age at diagnosis"
                    value={cancerAgeInput}
                    min={0}
                    max={userResponses.demographics.age || 120}
                    onChange={(e) => setCancerAgeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCancerDetailsSubmitCall();
                      }
                    }}
                    borderRadius="md"
                    focusBorderColor="blue.400"
                  />
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      colorScheme="blue"
                      onClick={handleCancerDetailsSubmitCall}
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
                  colorScheme={chronicConditions.diabetes ? "blue" : "gray"}
                  variant={chronicConditions.diabetes ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, diabetes: !prev.diabetes }))}
                  transition="all 0.2s">
                  Diabetes
                </Button>
                <Button
                  colorScheme={chronicConditions.hiv ? "blue" : "gray"}
                  variant={chronicConditions.hiv ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hiv: !prev.hiv }))}
                  transition="all 0.2s">
                  HIV/AIDS
                </Button>
                <Button
                  colorScheme={chronicConditions.ibd ? "blue" : "gray"}
                  variant={chronicConditions.ibd ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, ibd: !prev.ibd }))}
                  transition="all 0.2s">
                  Inflammatory Bowel Disease (IBD)
                </Button>
              </HStack>
              <HStack spacing={4} w="100%">
                <Button
                  colorScheme={chronicConditions.hepatitisB ? "blue" : "gray"}
                  variant={chronicConditions.hepatitisB ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hepatitisB: !prev.hepatitisB }))}
                  transition="all 0.2s">
                  Hepatitis B
                </Button>
                <Button
                  colorScheme={chronicConditions.hepatitisC ? "blue" : "gray"}
                  variant={chronicConditions.hepatitisC ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, hepatitisC: !prev.hepatitisC }))}
                  transition="all 0.2s">
                  Hepatitis C
                </Button>
                <Button
                  colorScheme={chronicConditions.none ? "blue" : "gray"}
                  variant={chronicConditions.none ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  onClick={() => setChronicConditions(prev => ({ ...prev, none: !prev.none }))}
                  transition="all 0.2s">
                  None
                </Button>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={handleChronicConditionsSubmitCall}
                isFullWidth
                borderRadius="full">
                Submit
              </Button>
            </VStack>
          ) : currentStep === 'pillYears' ? (
            <FormControl isInvalid={!!pillYearsError}>
              <Select
                placeholder="Select years of pill use"
                value={pillYearsInput}
                onChange={(e) => setPillYearsInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="blue.400"
                mb={3}
              >
                <option value="0">0</option>
                <option value="Lesser than a year">Lesser than a year</option>
                <option value="1-4 years">1-4 years</option>
                <option value="5-9 years">5-9 years</option>
                <option value="10+ years">10+ years</option>
              </Select>
              <Button
                colorScheme="blue"
                onClick={() => handlePillYearsSubmit(
                  pillYearsInput,
                  setPillYearsError,
                  setUserResponses,
                  setMessages,
                  conversationFlow,
                  setCurrentStep,
                  setPillYearsInput
                )}
                isFullWidth
                borderRadius="full"
              >
                Submit
              </Button>
              {pillYearsError && <FormErrorMessage>{pillYearsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'transplant' ? (
            <VStack spacing={3} align="stretch">
              {conversationFlow[currentStep]?.options.map((option, index) => (
                <Button
                  key={index}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                  onClick={() => handleTransplantResponseCall(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                  isDisabled={isProcessingSelection}
                  _disabled={{
                    opacity: 0.7,
                    cursor: "not-allowed",
                    _hover: { bg: "initial", borderColor: "inherit" }
                  }}>
                  {option.text}
                  {isProcessingSelection && option.text === selectedOption && <span> ✓</span>}
                </Button>
              ))}
            </VStack>
          ) : currentStep === 'medications' ? (
            <VStack spacing={3} align="stretch">
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.anticoagulants ? "blue" : "gray"}
                  variant={medications.anticoagulants ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, anticoagulants: !prev.anticoagulants }))}
                  transition="all 0.2s">
                  Blood Thinners
                </Button>
                <Button
                  colorScheme={medications.statins ? "blue" : "gray"}
                  variant={medications.statins ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, statins: !prev.statins }))}
                  transition="all 0.2s">
                  Cholesterol Meds
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.antihypertensives ? "blue" : "gray"}
                  variant={medications.antihypertensives ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antihypertensives: !prev.antihypertensives }))}
                  transition="all 0.2s">
                  Blood Pressure Meds
                </Button>
                <Button
                  colorScheme={medications.antidepressants ? "blue" : "gray"}
                  variant={medications.antidepressants ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antidepressants: !prev.antidepressants }))}
                  transition="all 0.2s">
                  Antidepressants
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.opioids ? "blue" : "gray"}
                  variant={medications.opioids ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, opioids: !prev.opioids }))}
                  transition="all 0.2s">
                  Pain Medications
                </Button>
                <Button
                  colorScheme={medications.steroids ? "blue" : "gray"}
                  variant={medications.steroids ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, steroids: !prev.steroids }))}
                  transition="all 0.2s">
                  Steroids
                </Button>
              </HStack>
              
              <HStack spacing={4} w="100%" wrap="wrap">
                <Button
                  colorScheme={medications.antibiotics ? "blue" : "gray"}
                  variant={medications.antibiotics ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, antibiotics: !prev.antibiotics }))}
                  transition="all 0.2s">
                  Antibiotics
                </Button>
                <Button
                  colorScheme={medications.none ? "blue" : "gray"}
                  variant={medications.none ? "solid" : "outline"}
                  size="md"
                  borderRadius="full"
                  flex="1"
                  minW="200px"
                  mb={2}
                  onClick={() => setMedications(prev => ({ ...prev, none: !prev.none }))}
                  transition="all 0.2s">
                  None
                </Button>
              </HStack>
              
              <Button
                colorScheme="blue"
                onClick={handleMedicationsSubmitCall}
                isFullWidth
                borderRadius="full"
                mt={2}>
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
                  focusBorderColor="blue.400"
                  mb={3}>
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
                  focusBorderColor="blue.400"
                  mb={3}>
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
                    min={0}
                    max={120}
                    onChange={(e) => setFamilyCancerAgeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFamilyCancerDetailsSubmitCall();
                      }
                    }}
                    borderRadius="md"
                    focusBorderColor="blue.400"/>
                  <InputRightElement width="4.5rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      colorScheme="blue"
                      onClick={handleFamilyCancerDetailsSubmitCall}>
                      Submit
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {familyCancerAgeError && <FormErrorMessage>{familyCancerAgeError}</FormErrorMessage>}
              </FormControl>
            </VStack>
          ) : currentStep === 'smokingYears' ? (
            <FormControl isInvalid={!!smokingPacksError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  step="0.1"
                  placeholder="Enter packs per day (0-10)"
                  value={smokingPacksInput}
                  onChange={(e) => setSmokingPacksInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSmokingPacksSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleSmokingPacksSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {smokingPacksError && <FormErrorMessage>{smokingPacksError}</FormErrorMessage>}
              <Text fontSize="xs" color="gray.500" mt={1}>
                Note: 1 pack = 20 cigarettes. Use decimals for partial packs (e.g., 0.5 for 10 cigarettes)
              </Text>
            </FormControl>
          ) : currentStep === 'smokingAmount' ? (
            <FormControl isInvalid={!!smokingYearsError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter number of years (0-100)"
                  value={smokingYearsInput}
                  onChange={(e) => setSmokingYearsInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSmokingYearsSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleSmokingYearsSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {smokingYearsError && <FormErrorMessage>{smokingYearsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'alcoholConsumption' ? (
            <VStack spacing={3} align="stretch">
              {conversationFlow[currentStep]?.options.map((option, index) => (
                <Button
                  key={index}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                  onClick={() => handleAlcoholResponseCall(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                  isDisabled={isProcessingSelection}
                  _disabled={{
                    opacity: 0.7,
                    cursor: "not-allowed",
                    _hover: { bg: "initial", borderColor: "inherit" }
                  }}
                  bg={selectedOption === option.text ? 'blue.50' : 'transparent'}
                  borderColor={selectedOption === option.text ? 'blue.400' : 'gray.200'}>
                  {option.text}
                  {isProcessingSelection && option.text === selectedOption && <span> ✓</span>}
                </Button>
              ))}
            </VStack>
          ) : currentStep === 'alcoholAmount' ? (
            <FormControl isInvalid={!!alcoholAmountError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter drinks per week (0-100)"
                  value={alcoholAmountInput}
                  onChange={(e) => setAlcoholAmountInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAlcoholAmountSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleAlcoholAmountSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {alcoholAmountError && <FormErrorMessage>{alcoholAmountError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'saltySmokedFoods' ? (
            <FormControl isInvalid={!!saltySmokedFoodsError}>
              <Select
                placeholder="Select frequency of salty/smoked foods"
                value={saltySmokedFoodsInput || ''}
                onChange={e => setSaltySmokedFoodsInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="blue.400"
                mb={3}
                isDisabled={isProcessingSelection}
              >
                <option value="Never">Never</option>
                <option value="less than one time a week">less than one time a week</option>
                <option value="1-3 times a week">1-3 times a week</option>
                <option value="4 or more times a week">4 or more times a week</option>
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleSaltySmokedFoodsSubmitCall}
                isFullWidth
                borderRadius="full"
                isDisabled={!saltySmokedFoodsInput || isProcessingSelection}
              >
                Submit
              </Button>
              {saltySmokedFoodsError && <FormErrorMessage>{saltySmokedFoodsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'fruitVegServings' ? (
            <FormControl isInvalid={!!fruitVegServingsError}>
              <Select
                placeholder="Select daily fruit & vegetable servings"
                value={fruitVegServingsInput || ''}
                onChange={e => setFruitVegServingsInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="blue.400"
                mb={3}
                isDisabled={isProcessingSelection}
              >
                <option value="0-1 servings">0-1 servings</option>
                <option value="2-4 servings">2-4 servings</option>
                <option value="5+ servings">5+ servings</option>
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleFruitVegServingsSubmitCall}
                isFullWidth
                borderRadius="full"
                isDisabled={!fruitVegServingsInput || isProcessingSelection}
              >
                Submit
              </Button>
              {fruitVegServingsError && <FormErrorMessage>{fruitVegServingsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'hPylori' ? (
            <FormControl isInvalid={!!hPyloriError}>
              <Select
                placeholder="Have you ever been diagnosed with H. pylori infection?"
                value={hPyloriInput || ''}
                onChange={e => setHPyloriInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="blue.400"
                mb={3}
                isDisabled={isProcessingSelection}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not sure">Not sure</option>
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleHPyloriSubmitCall}
                isFullWidth
                borderRadius="full"
                isDisabled={!hPyloriInput || isProcessingSelection}
              >
                Submit
              </Button>
              {hPyloriError && <FormErrorMessage>{hPyloriError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'hPyloriEradication' ? (
            <FormControl isInvalid={!!hPyloriEradicationError}>
              <VStack spacing={3} align="stretch">
                {['Yes', 'No'].map(opt => (
                  <Button
                    key={opt}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => {
                      if (!isProcessingSelection) {
                        handleHPyloriEradicationSubmit(
                          opt,
                          setHPyloriEradicationError,
                          setUserResponses,
                          setMessages,
                          conversationFlow,
                          setCurrentStep,
                          setHPyloriEradicationInput,
                          conversationFlow.hPyloriEradication.options.find(o => o.text === opt)?.nextId
                        );
                      }
                    }}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt}
                    {isProcessingSelection && hPyloriEradicationInput === opt && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {hPyloriEradicationError && <FormErrorMessage>{hPyloriEradicationError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'gastritisUlcer' ? (
            <FormControl isInvalid={!!gastritisUlcerError}>
              <VStack spacing={3} align="stretch">
                {['Yes', 'No'].map(opt => (
                  <Button
                    key={opt}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleGastritisUlcerSubmitCall(opt)}
                    isDisabled={isProcessingSelection}
                    bg={gastritisUlcerInput === opt ? 'blue.50' : 'transparent'}
                    borderColor={gastritisUlcerInput === opt ? 'blue.400' : 'gray.200'}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt}
                    {isProcessingSelection && gastritisUlcerInput === opt && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {gastritisUlcerError && <FormErrorMessage>{gastritisUlcerError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'perniciousAnemia' ? (
            <FormControl isInvalid={!!perniciousAnemiaError}>
              <VStack spacing={3} align="stretch">
                {["Yes", "No"].map(opt => (
                  <Button
                    key={opt}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => handlePerniciousAnemiaSubmitCall(opt)}
                    isDisabled={isProcessingSelection}
                    bg={perniciousAnemiaInput === opt ? 'blue.50' : 'transparent'}
                    borderColor={perniciousAnemiaInput === opt ? 'blue.400' : 'gray.200'}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt}
                    {isProcessingSelection && perniciousAnemiaInput === opt && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {perniciousAnemiaError && <FormErrorMessage>{perniciousAnemiaError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'endometriosis' ? (
            <FormControl isInvalid={!!endometriosisError}>
              <VStack spacing={3} align="stretch">
                {["Yes", "No"].map(opt => (
                  <Button
                    key={opt}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleEndometriosisSubmitCall(opt)}
                    isDisabled={isProcessingSelection}
                    bg={endometriosisInput === opt ? 'blue.50' : 'transparent'}
                    borderColor={endometriosisInput === opt ? 'blue.400' : 'gray.200'}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt}
                    {isProcessingSelection && endometriosisInput === opt && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {endometriosisError && <FormErrorMessage>{endometriosisError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'gastricGeneMutation' ? (
            <FormControl isInvalid={!!gastricGeneMutationError}>
              <VStack spacing={3} align="stretch">
                {['Yes', 'No'].map(opt => (
                  <Button
                    key={opt}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => {
                      if (!isProcessingSelection) {
                        setGastricGeneMutationInput(opt);
                        handleGastricGeneMutationSubmit(
                          opt,
                          setGastricGeneMutationError,
                          setUserResponses,
                          setMessages,
                          conversationFlow,
                          setCurrentStep,
                          setGastricGeneMutationInput,
                          conversationFlow.gastricGeneMutation.options.find(o => o.text === opt)?.nextId
                        );
                      }
                    }}
                    isDisabled={isProcessingSelection}
                    bg={gastricGeneMutationInput === opt ? 'blue.50' : 'transparent'}
                    borderColor={gastricGeneMutationInput === opt ? 'blue.400' : 'gray.200'}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt}
                    {isProcessingSelection && gastricGeneMutationInput === opt && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {gastricGeneMutationError && <FormErrorMessage>{gastricGeneMutationError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'fertilityDrugs' ? (
            <FormControl isInvalid={!!fertilityDrugsError}>
              <VStack spacing={3} align="stretch">
                {conversationFlow.fertilityDrugs.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleFertilityDrugsSubmitCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    bg={fertilityDrugsInput === opt.text ? 'blue.50' : 'transparent'}
                    borderColor={fertilityDrugsInput === opt.text ? 'blue.400' : 'gray.200'}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && fertilityDrugsInput === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
              {fertilityDrugsError && <FormErrorMessage>{fertilityDrugsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'goffSymptomIntro' ? (
            <VStack spacing={3} align="stretch">
              {conversationFlow.goffSymptomIntro.options.map((option, index) => (
                <Button
                  key={option.text}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                  onClick={() => handleOptionSelectCall(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                  isDisabled={isProcessingSelection}
                  _disabled={{
                    opacity: 0.7,
                    cursor: "not-allowed",
                    _hover: { bg: "initial", borderColor: "inherit" }
                  }}
                >
                  {option.text}
                  {isProcessingSelection && option.text === selectedOption && <span> ✓</span>}
                </Button>
              ))}
            </VStack>
          ) : currentStep === 'goffBloating' ? (
            <FormControl>
              <VStack spacing={3} align="stretch">
                {conversationFlow.goffBloating.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleOptionSelectCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && selectedOption === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
            </FormControl>
          ) : currentStep === 'goffPain' ? (
            <FormControl>
              <VStack spacing={3} align="stretch">
                {conversationFlow.goffPain.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleOptionSelectCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && selectedOption === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
            </FormControl>
          ) : currentStep === 'goffFullness' ? (
            <FormControl>
              <VStack spacing={3} align="stretch">
                {conversationFlow.goffFullness.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleOptionSelectCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && selectedOption === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
            </FormControl>
          ) : currentStep === 'goffUrinary' ? (
            <FormControl>
              <VStack spacing={3} align="stretch">
                {conversationFlow.goffUrinary.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleOptionSelectCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && selectedOption === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
            </FormControl>
          ) : currentStep === 'goffAbdomenSize' ? (
            <FormControl>
              <VStack spacing={3} align="stretch">
                {conversationFlow.goffAbdomenSize.options.map(opt => (
                  <Button
                    key={opt.text}
                    colorScheme="blue"
                    variant="outline"
                    size="md"
                    borderRadius="full"
                    isFullWidth
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                    onClick={() => !isProcessingSelection && handleOptionSelectCall(opt.text, opt.nextId)}
                    isDisabled={isProcessingSelection}
                    justifyContent="flex-start"
                    textAlign="left"
                  >
                    {opt.text}
                    {isProcessingSelection && selectedOption === opt.text && <span> ✓</span>}
                  </Button>
                ))}
              </VStack>
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
                      handleAllergySubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleAllergySubmitCall}>
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
                      handleMenarcheAgeSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleMenarcheAgeSubmitCall}>
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
                      handlePregnancyAgeSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handlePregnancyAgeSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {pregnancyAgeError && <FormErrorMessage>{pregnancyAgeError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'numberOfBirths' ? (
            <FormControl>
              <Select
                placeholder="Select number of times you have given birth"
                value={numberOfBirthsInput || ''}
                onChange={e => setNumberOfBirthsInput(e.target.value)}
                borderRadius="md"
                focusBorderColor="blue.400"
                mb={3}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleNumberOfBirthsSubmitCall}
                isFullWidth
                borderRadius="full"
                isDisabled={!numberOfBirthsInput}
              >
                Submit
              </Button>
            </FormControl>
          ) : currentStep === 'menopauseAge' ? (
            <FormControl isInvalid={!!menopauseAgeError}>
              <InputGroup size="md">
                <Input
                  type="number"
                  placeholder="Enter age when your periods stopped (30-60)"
                  value={menopauseAgeInput}
                  onChange={(e) => setMenopauseAgeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMenopauseAgeSubmit(
                        menopauseAgeInput,
                        setMenopauseAgeError,
                        setUserResponses,
                        setMessages,
                        conversationFlow,
                        setCurrentStep,
                        setMenopauseAgeInput
                      );
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                  onClick={() => handleMenopauseAgeSubmit(
                    menopauseAgeInput,
                    setMenopauseAgeError,
                    setUserResponses,
                    setMessages,
                    conversationFlow,
                    setCurrentStep,
                    setMenopauseAgeInput
                  )}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="gray.500">
                Please enter the age (in years) when your periods stopped naturally or due to surgery/medical treatment.
              </FormHelperText>
              {menopauseAgeError && <FormErrorMessage>{menopauseAgeError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'pillYears' ? (
            <FormControl isInvalid={!!pillYearsError}>
              <InputGroup size="md">
                <Input
                  type="number"
                  placeholder="Enter total years of pill use (0-50)"
                  value={pillYearsInput}
                  onChange={(e) => setPillYearsInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePillYearsSubmit(
                        pillYearsInput,
                        setPillYearsError,
                        setUserResponses,
                        setMessages,
                        conversationFlow,
                        setCurrentStep,
                        setPillYearsInput
                      );
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handlePillYearsSubmit(
                      pillYearsInput,
                      setPillYearsError,
                      setUserResponses,
                      setMessages,
                      conversationFlow,
                      setCurrentStep,
                      setPillYearsInput
                    )}
                  >
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText color="gray.500">
                Please enter a whole number. 1 pill-year = 365 pills, or 12 months of daily use.
              </FormHelperText>
              {pillYearsError && <FormErrorMessage>{pillYearsError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'prostateTestAge' ? (
            <FormControl isInvalid={!!prostateTestAgeError}>
              <InputGroup size="md">
                <Input 
                  type="number"
                  placeholder="Enter age at last test"
                  value={prostateTestAgeInput}
                  onChange={(e) => setProstateTestAgeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleProstateTestAgeSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleProstateTestAgeSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
              {prostateTestAgeError && <FormErrorMessage>{prostateTestAgeError}</FormErrorMessage>}
            </FormControl>
          ) : currentStep === 'pastCancerScreeningDetails' ? (
            <FormControl>
              <InputGroup size="md">
                <Input 
                  type="text"
                  placeholder="Enter cancer screening type and date"
                  value={cancerScreeningInput}
                  onChange={(e) => setCancerScreeningInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCancerScreeningDetailsSubmitCall();
                    }
                  }}
                  borderRadius="md"
                  focusBorderColor="blue.400"/>
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    colorScheme="blue"
                    onClick={handleCancerScreeningDetailsSubmitCall}>
                    Submit
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          ) : currentStep === 'summary' ? (
            <Box id="summary-scroll-container" h="calc(100vh - 50px)" overflowY="auto" pt={2}>
              <SummaryComponentWrapper userResponses={userResponses} handleOptionSelectCall={handleOptionSelectCall} />
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              {conversationFlow[currentStep]?.options.map((option, index) => (
                <Button
                  key={index}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  borderRadius="full"
                  _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                  onClick={() => handleOptionSelectCall(option.text, option.nextId)}
                  transition="all 0.2s"
                  justifyContent="flex-start"
                  textAlign="left"
                  isDisabled={isProcessingSelection}
                  _disabled={{
                    opacity: 0.7,
                    cursor: "not-allowed",
                    _hover: { bg: "initial", borderColor: "inherit" }
                  }}>
                  {option.text}
                  {isProcessingSelection && option.text === selectedOption && <span> ✓</span>}
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