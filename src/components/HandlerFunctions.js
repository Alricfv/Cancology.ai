// Handle fertility (IVF) drugs question for females
export const handleFertilityDrugsSubmit = (
  fertilityDrugsInput,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep
) => {
  // Save to userResponses.sexSpecificInfo.female.IVF_history
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        IVF_history: fertilityDrugsInput
      }
    }
  }));
  // Add user's answer to messages
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Fertility (IVF) drugs: ${fertilityDrugsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  // Advance to next step (pastCancerScreening)
  const nextId = 'pastCancerScreening';
  setTimeout(() => {
    if (conversationFlow[nextId]) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: conversationFlow[nextId].question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(nextId);
    }
  }, 1000);
};
// Handle number of births input for numberOfBirths step
export const handleNumberOfBirthsSubmit = (
  numberOfBirthsInput,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setNumberOfBirthsInput
) => {
  // Save to userResponses.sexSpecificInfo.female.numberOfBirths
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        numberOfBirths: numberOfBirthsInput
      }
    }
  }));
  // Add user's answer to messages
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Number of times given birth: ${numberOfBirthsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  // Advance to next step and add bot message for next question after a delay
  const nextId = conversationFlow.numberOfBirths?.options?.[0]?.nextId || 'summary';
  setTimeout(() => {
    if (conversationFlow[nextId]) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: conversationFlow[nextId].question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(nextId);
    } else {
      setCurrentStep('summary');
    }
    setNumberOfBirthsInput("");
  }, 1000);
};

// Handler for menopause age submit
export const handleMenopauseAgeSubmit = (menopauseAgeInput, setMenopauseAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setMenopauseAgeInput) => {
  // Validate input: must be integer between 30 and 60 (typical menopause range)
  const age = parseInt(menopauseAgeInput, 10);
  if (isNaN(age) || age < 30 || age > 60) {
    setMenopauseAgeError('Please enter a valid age between 30 and 60.');
    return;
  }
  setMenopauseAgeError('');
  // Update userResponses
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        menopauseAge: age
      }
    }
  }));
  // Add user's answer to messages
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Age at periods stopping: ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  // Advance to next step and add bot message for next question after a delay
  const nextId = conversationFlow.menopauseAge.nextId || 'pregnancy'; // Default to 'pregnancy' if not defined
  setTimeout(() => {
    setCurrentStep(nextId);
    setMenopauseAgeInput('');
    // Add bot message for next question (pregnancy)
    const nextStep = conversationFlow[nextId];
    if (nextStep && nextStep.question) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2, // +2 because user message was just added
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
    }
  }, 1000);
};
// Handle pill-years input for birth control use
export const handlePillYearsSubmit = (pillYearsInput, setPillYearsError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setPillYearsInput) => {
  // Validate pill-years input (dropdown)
  const allowedOptions = [
    '0',
    'Lesser than a year',
    '1-4 years',
    '5-9 years',
    '10+ years'
  ];
  if (!allowedOptions.includes(pillYearsInput)) {
    setPillYearsError('Please select a valid option for pill years.');
    return;
  }
  setPillYearsError('');
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        pillYears: pillYearsInput
      }
    }
  }));
  // Add user's answer to messages
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Years on birth control pill: ${pillYearsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setPillYearsInput('');
  setTimeout(() => {
    const nextStep = conversationFlow.hormoneReplacementTherapy;
    if (nextStep) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2, // +2 because user message was just added
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setCurrentStep('hormoneReplacementTherapy');
    }
  }, 1000);
};
// No imports needed from App.js as all dependencies should be passed as parameters

export const handleAgeSubmit = (ageInput, setAgeError, setMessages, messages, setCurrentStep, conversationFlow, userResponses, setUserResponses, setAgeInput) => {
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
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        age: age
      }
    }));
    
    // Add user's age as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${age}`,
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
        
      }
    }, 1000);
  };
  
// Handle submitting the ethnicity selection
export const handleEthnicitySubmit = (ethnicityInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setEthnicityInput) => {
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
    
    // Update consolidated responses with ethnicity
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        ethnicity: ethnicityInput
      }
    }));
    
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
    // Note: setEthnicityInput needs to be passed as a parameter
    
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
        
      }
    }, 1000);
  };
  
// Handle submitting the country selection
export const handleCountrySubmit = (countryInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCountryInput) => {
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
    
    // Update consolidated responses with country
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        country: countryInput
      }
    }));
    
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
        
      }
    }, 1000);
  };

// Handle submitting cancer details
export const handleCancerDetailsSubmit = (cancerType, cancerAgeInput, setCancerAgeError, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCancerType, setCancerAgeInput) => {
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
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        personalCancer: {
          ...prev.medicalHistory.personalCancer,
          diagnosed: true, // Ensure diagnosed is set to true
          type: cancerType,
          ageAtDiagnosis: age
        }
      }
    }));
    
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
        
      }
    }, 1000);
  };

// Handle submitting chronic conditions
export const handleChronicConditionsSubmit = (chronicConditions, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setChronicConditions) => {
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
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        chronicConditions: selectedConditions
      }
    }));
    
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
        
      }
    }, 1000);
  };

// Handle family cancer history details submission
export const handleFamilyCancerDetailsSubmit = (familyCancerType, familyRelation, familyCancerAgeInput,setFamilyCancerAgeError, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setFamilyCancerType, setFamilyRelation, setFamilyCancerAgeInput) => {
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
    
    // Update consolidated responses with family cancer details
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        familyCancer: {
          ...prev.medicalHistory.familyCancer,
          diagnosed: true, // Ensure diagnosed is set to true
          relation: familyRelation,
          type: familyCancerType,
          ageAtDiagnosis: age
        }
      }
    }));
    
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
        
      }
    }, 1000);
  };
   
// Handle alcohol consumption response 
export const handleAlcoholResponse = (optionText, nextId, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, conversationFlow, setCurrentStep) => {
   // Prevent multiple clicks by setting processing state
   if (isProcessingSelection) return;
  
   // Set processing state to true to disable all buttons
   setIsProcessingSelection(true);
  
   // Set the selected option
   setSelectedOption(optionText);
  
   // Add user's alcohol response as a message
   setMessages(prev => [
     ...prev,
     {
       id: prev.length + 1,
       text: optionText,
       sender: 'user',
       timestamp: new Date()
     }
   ]);
  
   // Update user responses with alcohol consumption information
   setUserResponses(prev => ({
     ...prev,
      lifestyle: {
       ...prev.lifestyle,
       alcohol: {
         ...prev.lifestyle.alcohol,
         consumes: optionText === 'Yes'
       }
     }
   }));
  
   // Move to the next step based on response
   setTimeout(() => {
     // Reset processing state after UI updates are complete
     setIsProcessingSelection(false);
    
     // If user drinks alcohol, go to alcoholAmount step, otherwise skip to transplant
     if (optionText === 'Yes') {
       const nextStep = conversationFlow.alcoholAmount;
      
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
         setCurrentStep('alcoholAmount');
        
         
       }
     } else {
       // Skip directly to sexual health question for non-drinkers
       const skipToStep = conversationFlow.sexualHealth;
      
       if (skipToStep) {
         // Add bot's next question
         setMessages(prev => [
           ...prev, 
           {
             id: prev.length + 1,
             text: skipToStep.question,
             sender: 'bot',
             timestamp: new Date()
           }
         ]);
        
         // Update the current step
         setCurrentStep('sexualHealth');
        
       }
     }
   }, 1000);
 };

// Handle submitting the transplant response
export const handleTransplantResponse = (optionText, nextId, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, conversationFlow, setCurrentStep) => {
    // Prevent multiple clicks by setting processing state
    if (isProcessingSelection) return;
    
    // Set processing state to true to disable all buttons
    setIsProcessingSelection(true);
    
    // Set the selected option
    setSelectedOption(optionText);
    
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
    
    // Update user responses with transplant information
    setUserResponses(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        transplant: optionText === 'Yes'
      }
    }));
    
    // Move to the next step (use nextId from conversationFlow)
    setTimeout(() => {
      // Reset processing state after UI updates are complete
      setIsProcessingSelection(false);
      
      const nextStep = conversationFlow[nextId];
      
      if (nextStep) {
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        
        setCurrentStep(nextId);
      }
    }, 1000);
  };


// Handle pregnancy age input
export const handlePregnancyAgeSubmit = (pregnancyAgeInput, setPregnancyAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setPregnancyAgeInput) => {
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
  
  // Update user responses with pregnancy age
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        pregnancy: {
          ...prev.sexSpecificInfo.female.pregnancy,
          hadPregnancy: true,
          ageAtFirst: age
        }
      }
    }
  }));
  
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
  
  // Move to the next step (from conversationFlow.firstPregnancyAge.nextId)
  setTimeout(() => {
    const nextId = conversationFlow.firstPregnancyAge.nextId || 'birthControl';
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
    }
  }, 1000);
 };
  
// Handle menarche age input
export const handleMenarcheAgeSubmit = (menarcheAgeInput, setMenarcheAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setMenarcheAgeInput) => {
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
  
  // Update user responses
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        menarcheAge: age
      }
    }
  }));
  
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
      
    }
  }, 1000);
 };

export const handleCancerScreeningDetailsSubmit = (cancerScreeningInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCancerScreeningInput) => {
  // Validate cancer screening input
   if (!cancerScreeningInput.trim()) {
     toast({
       title: "Error",
       description: "Please enter your cancer screening details",
       status: "error",
       duration: 2000,
       isClosable: true,
       position: "top-right"
     });
     return;
   }
  
   // Update consolidated responses
   setUserResponses(prev => ({
     ...prev,
     cancerScreening: {
       hadScreening: true,
       details: cancerScreeningInput
     }
   }));
  
   // Add user's cancer screening details as a message
   setMessages(prev => [
     ...prev, 
     {
       id: prev.length + 1,
       text: `Cancer screening history: ${cancerScreeningInput}`,
       sender: 'user',
       timestamp: new Date()
     }
   ]);
  
  // Clear input
   setCancerScreeningInput('');
  
  // Move to the next step (hpvVaccine)
   setTimeout(() => {
     const nextStep = conversationFlow.hpvVaccine;
    
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
       setCurrentStep('hpvVaccine');
      
     }
   }, 1000);
 };
  
  // Handle submitting medications information
export const handleMedicationsSubmit = (medications, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setMedications) => {
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
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      medications: selectedMedications
    }));
    
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
        
      }
    }, 1000);
  };
  
  // Handle allergyDetails submission
export const handleAllergySubmit = (allergyInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, routeBasedOnSex, setAllergyInput) => {
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
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      allergies: allergyInput
    }));
    
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
    
    // Directly route based on sex instead of going to checkSex step
    setTimeout(() => {
      
      routeBasedOnSex();
    }, 1000);
  };
        
  // Handle smoking packs per day input
export const handleSmokingPacksSubmit = (smokingPacksInput, setSmokingPacksError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setSmokingPacksInput) => {
    // Validate packs input
    if (!smokingPacksInput.trim()) {
      setSmokingPacksError('Number of packs per day is required');
      return;
    }
    
    const packs = parseFloat(smokingPacksInput);
    
    if (isNaN(packs) || packs < 0 || packs > 10) {
      setSmokingPacksError('Please enter a valid number between 0 and 10');
      return;
    }
    
    // Clear error
    setSmokingPacksError('');
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        smoking: {
          ...prev.lifestyle.smoking,
          packsPerDay: packs
        }
      }
    }));
    
    // Add user's smoking packs as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${packs} packs per day`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setSmokingPacksInput('');
    
    // Move to the next step (smokingYears)
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
        
      }
    }, 1000);
  };

  //Handle prostate test age input
export const handleProstateTestAgeSubmit = (prostateTestAgeInput, setProstateTestAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setProstateTestAgeInput) => {
    // Validate age input
    if (!prostateTestAgeInput.trim()) {
      setProstateTestAgeError('Age at last prostate test is required');
      return;
    }

    const age = parseInt(prostateTestAgeInput);

    if (isNaN(age) || age < 30 || age > 120) {
      setProstateTestAgeError('Please enter a valid age between 30 and 120');
      return;
    }

    // Clear error
    setProstateTestAgeError('');

    // Update user responses with prostate test age
    setUserResponses(prev => ({
      ...prev,
      sexSpecificInfo: {
        ...prev.sexSpecificInfo,
        male: {
          ...prev.sexSpecificInfo.male,
          prostateTest: {
            ...prev.sexSpecificInfo.male.prostateTest,
            had: true,
            ageAtLast: age
          }
        }
      }
    }));

    // Add user's prostate test age as a message
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: `Last prostate test at age ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    // Clear input
    setProstateTestAgeInput('');

    // Move to the next step (testicularIssues)
    setTimeout(() => {
      const nextStep = conversationFlow.testicularIssues;
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
        setCurrentStep('testicularIssues');
        
      }
    }, 1000);
  };
  // Handle smoking years input and calculate pack-years
export const handleSmokingYearsSubmit = (smokingYearsInput, setSmokingYearsError, setMessages, setCurrentStep, conversationFlow, userResponses, setUserResponses, setSmokingYearsInput, setPackYears) => {
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
    
    // Calculate pack-years: packs per day × years smoked
    const packsPerDay = userResponses.lifestyle.smoking.packsPerDay || 0;
    const calculatedPackYears = Math.round(packsPerDay * years * 10) / 10; // Round to 1 decimal place
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        smoking: {
          ...prev.lifestyle.smoking,
          years: years,
          packYears: calculatedPackYears
        }
      }
    }));
    
    // Set pack-years state
    setPackYears(calculatedPackYears);
    
    // Add user's smoking years and calculated pack-years as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${years} years of smoking (${calculatedPackYears} pack-years total)`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setSmokingYearsInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.alcoholConsumption;
      
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
        setCurrentStep('alcoholConsumption');
        
      }
    }, 1000);
  };
  
  // Handle alcohol amount input
export const handleAlcoholAmountSubmit = (alcoholAmountInput, setAlcoholAmountError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setAlcoholAmountInput) => {
    // Validate alcohol amount input
    if (!alcoholAmountInput.trim()) {
      setAlcoholAmountError('Number of drinks per week is required');
      return;
    }
    
    const drinksPerWeek = parseInt(alcoholAmountInput);
    
    if (isNaN(drinksPerWeek) || drinksPerWeek < 0 || drinksPerWeek > 100) {
      setAlcoholAmountError('Please enter a valid number between 0 and 100');
      return;
    }

    // Clear error
    setAlcoholAmountError('');
    
    // Update consolidated responses
    setUserResponses(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        alcohol: {
          ...prev.lifestyle.alcohol,
          drinksPerWeek: drinksPerWeek
        }
      }
    }));
    
    // Add user's alcohol amount as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${drinksPerWeek} drinks per week`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    // Clear input
    setAlcoholAmountInput('');
    
    // Move to the next step
    setTimeout(() => {
      const nextStep = conversationFlow.sexualHealth;
      
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
        setCurrentStep('sexualHealth');
        
      }
    }, 1000);
  };

  // Handle clicking a response option
export const handleOptionSelect = (optionText, nextId, currentStep, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, userResponses, conversationFlow, setCurrentStep, userSex, setUserSex, setMenstruationStatus, routeBasedOnSex) => {
    // Prevent multiple clicks by setting processing state
    if (isProcessingSelection) return;
    
    // Set processing state to true to disable all buttons
    setIsProcessingSelection(true);
    
    // Set the selected option
    setSelectedOption(optionText);
    
    // Add user's response as a message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: optionText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    // Update user responses based on current step
    // Goff Symptom Index questions
    if (currentStep === 'goffBloating') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          goffSymptomIndex: {
            ...((prev.symptoms && prev.symptoms.goffSymptomIndex) || {}),
            bloating: optionText === 'Yes'
          }
        }
      }));
    } else if (currentStep === 'goffPain') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          goffSymptomIndex: {
            ...((prev.symptoms && prev.symptoms.goffSymptomIndex) || {}),
            pain: optionText === 'Yes'
          }
        }
      }));
    } else if (currentStep === 'goffFullness') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          goffSymptomIndex: {
            ...((prev.symptoms && prev.symptoms.goffSymptomIndex) || {}),
            fullness: optionText === 'Yes'
          }
        }
      }));
    } else if (currentStep === 'goffUrinary') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          goffSymptomIndex: {
            ...((prev.symptoms && prev.symptoms.goffSymptomIndex) || {}),
            urinary: optionText === 'Yes'
          }
        }
      }));
    } else if (currentStep === 'goffAbdomenSize') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          goffSymptomIndex: {
            ...((prev.symptoms && prev.symptoms.goffSymptomIndex) || {}),
            abdomenSize: optionText === 'Yes'
          }
        }
      }));
    }
    if (currentStep === 'sex') {
      setUserResponses(prev => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          sex: optionText
        }
      }));
      setUserSex(optionText);
    } 
    else if (currentStep === 'cancer') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          personalCancer: {
            ...prev.medicalHistory.personalCancer,
            diagnosed: optionText === 'Yes'
          }
        }
      }));
    } 
    else if (currentStep === 'familyHistory') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          familyCancer: {
            ...prev.medicalHistory.familyCancer,
            diagnosed: optionText === 'Yes'
          }
        }
      }));
    } 
    else if (currentStep === 'smokingStatus') {
      setUserResponses(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          smoking: {
            ...prev.lifestyle.smoking,
            current: optionText === 'Yes'
          }
        }
      }));
    } 
    else if (currentStep === 'transplant') {
      setUserResponses(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          transplant: optionText === 'Yes'
        }
      }));
    } 
    else if (currentStep === 'allergies') {
      if (optionText === 'No') {
        setUserResponses(prev => ({
          ...prev,
          allergies: "None"
        }));
      }
    } 
    else if (currentStep === 'checkSex') {
      // This case is kept for backward compatibility, but should no longer be used
      // as we're now directly calling routeBasedOnSex() from handleAllergySubmit
      routeBasedOnSex();
    } 
    else if (currentStep === 'urinarySymptoms') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          male: {
            ...prev.sexSpecificInfo.male,
            urinarySymptoms: optionText === 'Yes'
          }
        }
      }));
    } 
    else if (currentStep === 'prostateTest') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          male: {
            ...prev.sexSpecificInfo.male,
            prostateTest: {
              ...prev.sexSpecificInfo.male.prostateTest,
              had: optionText === 'Yes'
            }
          }
        }
      }));
    } 
    else if (currentStep === 'testicularIssues') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          male: {
            ...prev.sexSpecificInfo.male,
            testicularIssues: optionText === 'Yes'
          }
        }
      }));
    } 
    else if (currentStep === 'menstruationStatus') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            menstruationStatus: optionText
          }
        }
      }));
      setMenstruationStatus(optionText);
    } 
    else if (currentStep === 'pregnancy') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            pregnancy: {
              ...prev.sexSpecificInfo.female.pregnancy,
              hadPregnancy: optionText === 'Yes'
            }
          }
        }
      }));
    } 
    else if (currentStep === 'birthControl') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            birthControl: optionText === 'Yes'
          }
        }
      }));
    }
    else if (currentStep === 'hormoneReplacementTherapy') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            hormoneReplacementTherapy: optionText === 'Yes'
          }
        }
      }));
    }
    else if (currentStep === 'tubalLigation') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            tubalLigation: optionText === 'Yes'
          }
        }
      }));
    }
    else if (currentStep === 'ovaryRemoved') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            ovaryRemoved: optionText // "Left", "Right", "Both", or "None"
          }
        }
      }));
    }
    else if (currentStep === 'hpvVaccine') {
      setUserResponses(prev => ({
        ...prev,
        vaccinations: {
          ...prev.vaccinations,
          hpv: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'hepBVaccine') {
      setUserResponses(prev => ({
        ...prev,
        vaccinations: {
          ...prev.vaccinations,
          hepB: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'brcaMutation') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          brcaMutationStatus: optionText, // Store the raw answer
          geneticMutations:
            optionText === 'Yes'
              ? [...(prev.medicalHistory.geneticMutations || []), 'BRCA1/BRCA2']
              : prev.medicalHistory.geneticMutations || []
        }
      }));
    }
    else if (currentStep === 'numberOfBirths') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            numberOfBirths: optionText // "1", "2", "3", or "4+"
          }
        }
      }));
    }
    else if (currentStep === 'menopauseAge') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            menopauseAge: optionText // integer input as string
          }
        }
      }));
    }

    // Move to the next step after a short delay
    setTimeout(() => {
      // Reset processing state after UI updates are complete
      setIsProcessingSelection(false);
      
      // Special handling for routeBasedOnSex
      if (nextId === "routeBasedOnSex") {
        // Directly call the routeBasedOnSex function
        routeBasedOnSex();
      } 
      else {
        // Special handling for prostateTest for males under 30
        if (nextId === "prostateTest" && userSex === "Male" && userResponses.demographics.age < 30) {
          // Skip prostate test for males under 30
          // Pre-fill the prostate test data as No and N/A
          setUserResponses(prev => ({
            ...prev,
            sexSpecificInfo: {
              ...prev.sexSpecificInfo,
              male: {
                ...prev.sexSpecificInfo.male,
                prostateTest: {
                  had: false,
                  ageAtLast: "N/A" // Using "N/A" as a string value for age at last test
                }
              }
            }
          }));
          
          // Directly go to testicularIssues
          const skipToStep = conversationFlow.testicularIssues;
          
          if (skipToStep) {
            setMessages(prev => [
              ...prev, 
              {
                id: prev.length + 1,
                text: skipToStep.question,
                sender: 'bot',
                timestamp: new Date()
              }
            ]);
            
            setCurrentStep('testicularIssues');
            
            
          }
        } 
        else {
          // Normal flow - move to the next step in the conversation flow
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
            
          }
        }
      }
    }, 1000);
  };
