// Handle endometriosis diagnosis (Yes/No)
export const handleEndometriosisSubmit = (
  endometriosisInput,
  setEndometriosisError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setEndometriosisInput,
  nextId
) => {
  if (!endometriosisInput) {
    setEndometriosisError("Please select Yes or No.");
    return;
  }
  setEndometriosisError("");
  setUserResponses(prev => ({
    ...prev,
    medicalHistory: {
      ...prev.medicalHistory,
      endometriosis: endometriosisInput === 'Yes'
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Endometriosis diagnosis: ${endometriosisInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setEndometriosisInput("");
  setTimeout(() => {
    const id = nextId || conversationFlow.endometriosis?.nextId;
    const nextStep = conversationFlow[id];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(id);
    }
  }, 1000);
};
// Handle Pernicious Anemia question (Yes/No)
export const handlePerniciousAnemiaSubmit = (
  perniciousAnemiaInput,
  setPerniciousAnemiaError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setPerniciousAnemiaInput,
  nextId
) => {
  if (!perniciousAnemiaInput) {
    setPerniciousAnemiaError("Please select Yes or No.");
    return;
  }
  setPerniciousAnemiaError("");
  setUserResponses(prev => ({
    ...prev,
    medicalHistory: {
      ...prev.medicalHistory,
      perniciousAnemia: perniciousAnemiaInput === 'Yes'
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Pernicious Anemia: ${perniciousAnemiaInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setPerniciousAnemiaInput("");
  setTimeout(() => {
    const id = nextId || conversationFlow.perniciousAnemia?.nextId;
    const nextStep = conversationFlow[id];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(id);
    }
  }, 1000);
};
// Handle gastric cancer gene mutation (CDH1/other) question (Yes/No)
export const handleGastricGeneMutationSubmit = (
  gastricGeneMutationInput,
  setGastricGeneMutationError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setGastricGeneMutationInput,
  nextId
) => {
  if (!gastricGeneMutationInput) {
    setGastricGeneMutationError("Please select Yes or No.");
    return;
  }
  setGastricGeneMutationError("");
  setUserResponses(prev => ({
    ...prev,
    medicalHistory: {
      ...prev.medicalHistory,
      gastricGeneMutation: gastricGeneMutationInput === 'Yes'
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Gastric cancer gene mutation: ${gastricGeneMutationInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setGastricGeneMutationInput("");
  setTimeout(() => {
    const id = nextId || conversationFlow.gastricGeneMutation.nextId;
    const nextStep = conversationFlow[id];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(id);
    }
  }, 1000);
};
// Handle chronic gastritis/gastric ulcers question (Yes/No)
export const handleGastritisUlcerSubmit = (
  gastritisUlcerInput,
  setGastritisUlcerError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setGastritisUlcerInput
) => {
  if (!gastritisUlcerInput) {
    setGastritisUlcerError("Please select Yes or No.");
    return;
  }
  setGastritisUlcerError("");
  setUserResponses(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      gastritisUlcer: gastritisUlcerInput
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Chronic gastritis/gastric ulcers: ${gastritisUlcerInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setGastritisUlcerInput("");
  setTimeout(() => {
    const nextId = conversationFlow.gastritisUlcer.nextId || 'medications';
    const nextStep = conversationFlow[nextId];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(nextId);
    }
  }, 1000);
};
// Handle H. pylori eradication therapy question (Yes/No)
export const handleHPyloriEradicationSubmit = (
  hPyloriEradicationInput,
  setHPyloriEradicationError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setHPyloriEradicationInput,
  nextId
) => {
  if (!hPyloriEradicationInput) {
    setHPyloriEradicationError("Please select Yes or No.");
    return;
  }
  setHPyloriEradicationError("");
  setUserResponses(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      hPyloriEradication: hPyloriEradicationInput 
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `H. pylori eradication therapy completed: ${hPyloriEradicationInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setHPyloriEradicationInput("");
  setTimeout(() => {
    const id = nextId || conversationFlow.hPyloriEradication.nextId;
    const nextStep = conversationFlow[id];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(id);
    }
  }, 1000);
};
// Handle H. pylori infection question (Yes/No)
export const handleHPyloriSubmit = (
  hPyloriInput,
  setHPyloriError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setHPyloriInput,
  nextId
) => {
  if (!hPyloriInput) {
    setHPyloriError("Please select Yes or No.");
    return;
  }
  setHPyloriError("");
  setUserResponses(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      hPylori: hPyloriInput
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `H. pylori infection: ${hPyloriInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setHPyloriInput("");
  setTimeout(() => {
    const id = nextId || conversationFlow.hPylori.nextId;
    const nextStep = conversationFlow[id];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(id);
    }
  }, 1000);
};
 // Handle fruit & vegetable servings question
export const handleFruitVegServingsSubmit = (
  fruitVegServingsInput,
  setFruitVegServingsError,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  setFruitVegServingsInput
) => {
  if (!fruitVegServingsInput) {
    setFruitVegServingsError("Please select an option.");
    return;
  }
  setFruitVegServingsError("");
  setUserResponses(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      fruitVegServings: fruitVegServingsInput
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Fruit & vegetable servings per day: ${fruitVegServingsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));

  const nextId = conversationFlow.fruitVegServings.options.find(opt => opt.text === fruitVegServingsInput)?.nextId || conversationFlow.fruitVegServings.nextId || 'sexualHealth';
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
    setFruitVegServingsInput("");
  }, 1000);
};
// Handle fertility (IVF) drugs question for females
export const handleFertilityDrugsSubmit = (
  fertilityDrugsInput,
  setUserResponses,
  setMessages,
  conversationFlow,
  setCurrentStep,
  nextId
) => {
  setUserResponses(prev => ({
    ...prev,
    sexSpecificInfo: {
      ...prev.sexSpecificInfo,
      female: {
        ...prev.sexSpecificInfo.female,
        IVF_history: fertilityDrugsInput === "Yes"
      }
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Fertility (IVF) drugs: ${fertilityDrugsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
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
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Number of times given birth: ${numberOfBirthsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  const nextId = conversationFlow.numberOfBirths.nextId || conversationFlow.numberOfBirths?.options?.[0]?.nextId || 'summary';
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
  const age = parseInt(menopauseAgeInput, 10);
  if (isNaN(age) || age < 30 || age > 60) {
    setMenopauseAgeError('Please enter a valid age between 30 and 60.');
    return;
  }
  setMenopauseAgeError('');
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
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Age at periods stopping: ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  const nextId = conversationFlow.menopauseAge.nextId || 'pregnancy'; 
  setTimeout(() => {
    setCurrentStep(nextId);
    setMenopauseAgeInput('');
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
    const nextId = conversationFlow.pillYears?.nextId || 'hormoneReplacementTherapy';
    const nextStep = conversationFlow[nextId];
    if (nextStep) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 2, 
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setCurrentStep(nextId);
    }
  }, 1000);
};

export const handleAgeSubmit = (ageInput, setAgeError, setMessages, messages, setCurrentStep, conversationFlow, userResponses, setUserResponses, setAgeInput) => {
    if (!ageInput.trim()) {
      setAgeError('Age is required');
      return;
    }
    
    const age = parseInt(ageInput);
    
    if (isNaN(age) || age < 0 || age > 120) {
      setAgeError('Please enter a valid age between 0 and 120');
      return;
    }
    
    setAgeError('');
    
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        age: age
      }
    }));
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setAgeInput('');
    
    setTimeout(() => {
      const nextId = conversationFlow.age?.nextId || 'sex';
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
  
// Handle submitting the ethnicity selection
export const handleEthnicitySubmit = (ethnicityInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setEthnicityInput) => {
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
    
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        ethnicity: ethnicityInput
      }
    }));
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: ethnicityInput,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setTimeout(() => {
      const nextId = conversationFlow.ethnicity?.nextId || 'location';
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
  
// Handle submitting the country selection
export const handleCountrySubmit = (countryInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCountryInput) => {
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
    
    setUserResponses(prev => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        country: countryInput
      }
    }));

    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: countryInput,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    setCountryInput('');
    
    setTimeout(() => {
      const nextId = conversationFlow.country?.nextId || 'cancer';
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

// Handle submitting cancer details
export const handleCancerDetailsSubmit = (cancerType, cancerAgeInput, setCancerAgeError, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setCancerType, setCancerAgeInput) => {
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

    setCancerAgeError('');
    

    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Cancer type: ${cancerType}, Age at diagnosis: ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        personalCancer: {
          ...prev.medicalHistory.personalCancer,
          diagnosed: true, 
          type: cancerType,
          ageAtDiagnosis: age
        }
      }
    }));
    
    setCancerType('');
    setCancerAgeInput('');
    
    setTimeout(() => {
      const nextId = conversationFlow.cancerDetails?.nextId || 'familyHistory';
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
    
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        chronicConditions: selectedConditions
      }
    }));
    
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
    
    setChronicConditions({
      diabetes: false,
      hiv: false,
      ibd: false,
      hepatitisB: false,
      hepatitisC: false,
      none: false
    });
    
    setTimeout(() => {
      const nextId = conversationFlow.chronicConditions.nextId || 'smokingStatus';
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

// Handle family cancer history details submission
export const handleFamilyCancerDetailsSubmit = (familyCancerType, familyRelation, familyCancerAgeInput, setFamilyCancerAgeError, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, setFamilyCancerType, setFamilyRelation, setFamilyCancerAgeInput, userResponses) => {
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

    setFamilyCancerAgeError('');
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Family member with cancer: ${familyRelation}, Cancer type: ${familyCancerType}, Age at diagnosis: ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setUserResponses(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        familyCancer: {
          ...prev.medicalHistory.familyCancer,
          diagnosed: true, 
          relation: familyRelation,
          type: familyCancerType,
          ageAtDiagnosis: age
        }
      }
    }));
    
    setFamilyCancerType('');
    setFamilyRelation('');
    setFamilyCancerAgeInput('');
    
    setTimeout(() => {
      const nextId = conversationFlow.familyHistoryDetails.nextId || 'partialGastrectomy';
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
   
// Handle alcohol consumption response 
export const handleAlcoholResponse = (optionText, nextId, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, conversationFlow, setCurrentStep) => {
   if (isProcessingSelection) return;
  
   setIsProcessingSelection(true);
  
   setSelectedOption(optionText);
  
   setMessages(prev => [
     ...prev,
     {
       id: prev.length + 1,
       text: optionText,
       sender: 'user',
       timestamp: new Date()
     }
   ]);
  
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
  

  setTimeout(() => {
    setIsProcessingSelection(false);

    if (optionText === 'Yes') {
      const nextStep = conversationFlow.alcoholAmount;
      if (nextStep) {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            text: nextStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        setCurrentStep('alcoholAmount');
      }
    } else {
      const saltyStep = conversationFlow.saltySmokedFoods;
      if (saltyStep) {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            text: saltyStep.question,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
        setCurrentStep('saltySmokedFoods');
      }
    }
  }, 1000);
};

// Handle salty/smoked foods frequency question (dropdown)
export const handleSaltySmokedFoodsSubmit = (saltySmokedFoodsInput, setSaltySmokedFoodsError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setSaltySmokedFoodsInput) => {
  const allowedOptions = [
    'Never',
    'less than one time a week',
    '1-3 times a week',
    '4 or more times a week'
  ];
  if (!allowedOptions.includes(saltySmokedFoodsInput)) {
    setSaltySmokedFoodsError('Please select a valid option for salty/smoked foods.');
    return;
  }
  setSaltySmokedFoodsError('');
  setUserResponses(prev => ({
    ...prev,
    lifestyle: {
      ...prev.lifestyle,
      saltySmokedFoods: saltySmokedFoodsInput
    }
  }));
  setMessages(prev => ([
    ...prev,
    {
      id: prev.length + 1,
      text: `Salty/smoked foods: ${saltySmokedFoodsInput}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]));
  setSaltySmokedFoodsInput('');
  setTimeout(() => {
    const nextId = conversationFlow.saltySmokedFoods?.nextId || 'fruitVegServings';
    const nextStep = conversationFlow[nextId];
    if (nextStep) {
      setMessages(prev => ([
        ...prev,
        {
          id: prev.length + 2,
          text: nextStep.question,
          sender: 'bot',
          timestamp: new Date()
        }
      ]));
      setCurrentStep(nextId);
    }
  }, 1000);
};

// Handle submitting the transplant response
export const handleTransplantResponse = (optionText, nextId, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, conversationFlow, setCurrentStep) => {
    if (isProcessingSelection) return;
    
    setIsProcessingSelection(true);
    
    setSelectedOption(optionText);
    
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: optionText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setUserResponses(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        transplant: optionText === 'Yes'
      }
    }));
    
    setTimeout(() => {
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
  if (!pregnancyAgeInput.trim()) {
    setPregnancyAgeError('Age at first pregnancy is required');
    return;
  }
  
  const age = parseInt(pregnancyAgeInput);
  
  if (isNaN(age) || age < 14 || age > 50) {
    setPregnancyAgeError('Please enter a valid age between 14 and 50');
    return;
  }
  
  setPregnancyAgeError('');
  
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
  
  setMessages(prev => [
    ...prev, 
    {
      id: prev.length + 1,
      text: `First full-term pregnancy at age ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);

  setPregnancyAgeInput('');

  setTimeout(() => {
    const nextId = conversationFlow.firstPregnancyAge.nextId || 'birthControl';
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
  
// Handle menarche age input
export const handleMenarcheAgeSubmit = (menarcheAgeInput, setMenarcheAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setMenarcheAgeInput) => {
  if (!menarcheAgeInput.trim()) {
    setMenarcheAgeError('Age at first period is required');
    return;
  }
 
  const age = parseInt(menarcheAgeInput);
  
  if (isNaN(age) || age < 8 || age > 18) {
    setMenarcheAgeError('Please enter a valid age between 8 and 18');
    return;
  }
  
  setMenarcheAgeError('');
  
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
  
  setMessages(prev => [
    ...prev, 
    {
      id: prev.length + 1,
      text: `First period at age ${age}`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  
  setMenarcheAgeInput('');
  
  setTimeout(() => {
    const nextId = conversationFlow.menarcheAge?.nextId || 'menstruationStatus';
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
  
   setUserResponses(prev => ({
     ...prev,
     cancerScreening: {
       hadScreening: true,
       details: cancerScreeningInput
     }
   }));
  
   setMessages(prev => [
     ...prev, 
     {
       id: prev.length + 1,
       text: `Cancer screening history: ${cancerScreeningInput}`,
       sender: 'user',
       timestamp: new Date()
     }
   ]);
  
   setCancerScreeningInput('');
  
   setTimeout(() => {
     const nextId = conversationFlow.cancerScreeningDetails?.nextId || 'hpvVaccine';
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
    
    setUserResponses(prev => ({
      ...prev,
      medications: selectedMedications
    }));

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
    
    setTimeout(() => {
      const nextId = conversationFlow.medications?.nextId || 'allergies';
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
  
export const handleAllergySubmit = (allergyInput, toast, setUserResponses, setMessages, conversationFlow, setCurrentStep, routeBasedOnSex, setAllergyInput) => {
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
    
    setUserResponses(prev => ({
      ...prev,
      allergies: allergyInput
    }));
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `Drug allergies: ${allergyInput}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setAllergyInput('');
    
    setTimeout(() => {
      const nextId = conversationFlow.allergyDetails?.nextId;
      if (nextId && nextId !== 'routeBasedOnSex') {
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
      } else {
        routeBasedOnSex();
      }
    }, 1000);
  };
        
  // Handle smoking packs per day input
export const handleSmokingPacksSubmit = (smokingPacksInput, setSmokingPacksError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setSmokingPacksInput) => {
    if (!smokingPacksInput.trim()) {
      setSmokingPacksError('Number of packs per day is required');
      return;
    }
    
    const packs = parseFloat(smokingPacksInput);
    
    if (isNaN(packs) || packs < 0 || packs > 10) {
      setSmokingPacksError('Please enter a valid number between 0 and 10');
      return;
    }

    setSmokingPacksError('');
    
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
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${packs} packs per day`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setSmokingPacksInput('');
    
    setTimeout(() => {
      const nextId = 'smokingAmount';
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

  //Handle prostate test age input
export const handleProstateTestAgeSubmit = (prostateTestAgeInput, setProstateTestAgeError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setProstateTestAgeInput) => {
    if (!prostateTestAgeInput.trim()) {
      setProstateTestAgeError('Age at last prostate test is required');
      return;
    }

    const age = parseInt(prostateTestAgeInput);

    if (isNaN(age) || age < 30 || age > 120) {
      setProstateTestAgeError('Please enter a valid age between 30 and 120');
      return;
    }

    setProstateTestAgeError('');

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

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: `Last prostate test at age ${age}`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    setProstateTestAgeInput('');

    setTimeout(() => {
      const nextId = conversationFlow.prostateTestAge?.nextId || 'testicularIssues';
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
  // Handle smoking years input and calculate pack-years
export const handleSmokingYearsSubmit = (smokingYearsInput, setSmokingYearsError, setMessages, setCurrentStep, conversationFlow, userResponses, setUserResponses, setSmokingYearsInput, setPackYears) => {
    if (!smokingYearsInput.trim()) {
      setSmokingYearsError('Number of years is required');
      return;
    }
    
    const years = parseInt(smokingYearsInput);
    
    if (isNaN(years) || years < 0 || years > 100) {
      setSmokingYearsError('Please enter a valid number between 0 and 100');
      return;
    }
    
    setSmokingYearsError('');
    
    // pack-years calculation : packs per day × years smoked
    const packsPerDay = userResponses.lifestyle.smoking.packsPerDay || 0;
    const calculatedPackYears = Math.round(packsPerDay * years * 10) / 10; // Round to 1 decimal place
    
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
    
    setPackYears(calculatedPackYears);
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${years} years of smoking (${calculatedPackYears} pack-years total)`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    
    setSmokingYearsInput('');
    
    setTimeout(() => {
      const nextId = 'alcoholConsumption';
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
  
  // Handle alcohol amount 
export const handleAlcoholAmountSubmit = (alcoholAmountInput, setAlcoholAmountError, setUserResponses, setMessages, conversationFlow, setCurrentStep, setAlcoholAmountInput) => {
    if (!alcoholAmountInput.trim()) {
      setAlcoholAmountError('Number of drinks per week is required');
      return;
    }
    
    const drinksPerWeek = parseInt(alcoholAmountInput);
    
    if (isNaN(drinksPerWeek) || drinksPerWeek < 0 || drinksPerWeek > 100) {
      setAlcoholAmountError('Please enter a valid number');
      return;
    }

    setAlcoholAmountError('');

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

    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: `${drinksPerWeek} drinks per week`,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    setAlcoholAmountInput('');

    setTimeout(() => {
      const nextId = conversationFlow.alcoholAmount?.nextId || 'saltySmokedFoods';
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

  // Handle clicking a response option (but tbh this is just a default for yes/no)
export const handleOptionSelect = (optionText, nextId, currentStep, isProcessingSelection, setIsProcessingSelection, setSelectedOption, setMessages, setUserResponses, userResponses, conversationFlow, setCurrentStep, userSex, setUserSex, setMenstruationStatus, routeBasedOnSex) => {
    if (isProcessingSelection) return;
    
    setIsProcessingSelection(true);
    
    setSelectedOption(optionText);
    
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        text: optionText,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
    //Handle hypertension
    if (currentStep === 'hypertension') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          hypertension: optionText === 'Yes'
        }
      }));
    }
    // Handle kidney issue (Yes/No)
    else if (currentStep === 'kidneyIssue') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          kidneyIssue: optionText === 'Yes'
        }
      }));
    }

    // Handle brain/spinal/eye tumor (Yes/No)
    else if (currentStep === 'brainSpinalEyeTumor') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          brainSpinalEyeTumor: optionText === 'Yes'
        }
      }));
    }

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
      //handle pernicious anemia
    } else if (currentStep === 'perniciousAnemia') {
        setUserResponses(prev => ({
            ...prev,
            medicalHistory: {
                ...prev.medicalHistory,
                perniciousAnemia: optionText
            }
        }));
    }
    //Standard stuff
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
    // handle yes or no to family history of cancer
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
    // handle smokingstatus (if person smokes)
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
    // handle yes/no transplant
    else if (currentStep === 'transplant') {
      setUserResponses(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          transplant: optionText === 'Yes'
        }
      }));
    } 
    // handle yes/no to allergies
    else if (currentStep === 'allergies') {
      if (optionText === 'No') {
        setUserResponses(prev => ({
          ...prev,
          allergies: "None"
        }));
      }
    }
    //symptom screening handlers
    else if (currentStep === 'swallowingDifficulty') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          swallowingDifficulty: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'blackStool') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          blackStool: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'weightLoss') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          weightLoss: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'vomiting') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          vomiting: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'epigastricPain') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          epigastricPain: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'indigestion') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          indigestion: optionText // because there's 4 options here
        }
      }));
    }
    else if (currentStep === 'painWakesAtNight') {
      setUserResponses(prev => ({
        ...prev,
        symptoms: {
          ...prev.symptoms,
          painWakesAtNight: optionText === 'Yes'
        }
      }));
    }
    //handle gastrectomy yes/no
    else if (currentStep === 'partialGastrectomy') {
      setUserResponses(prev => ({
        ...prev,
        surgery: {
          ...prev.surgery,
          partialGastrectomy: optionText === 'Yes'
        }
      }));
    }
    else if (currentStep === 'checkSex') {
      routeBasedOnSex();
    } 
    // handle yes/no urinary symptoms
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
    // handle yes/no to prostate test
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
    // handle yes/no to testicularissues
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
    //handle premenopause/postmenopause
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
    //handle yes/no to currently pregnant
    else if (currentStep === 'currentPregnancy'){
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            currentPregnancy: optionText === 'Yes'
          }
        }
      }))
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
    // handle yes/no to birth control pills
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
    // handle yes/no to hrt
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
    // handle yes/no to tubal ligation
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
    // handle yes/no to ovary removal
    else if (currentStep === 'ovaryRemoved') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            ovaryRemoved: optionText 
          }
        }
      }));
    }
    //handle yes/no to hpv vaccine
    else if (currentStep === 'hpvVaccine') {
      setUserResponses(prev => ({
        ...prev,
        vaccinations: {
          ...prev.vaccinations,
          hpv: optionText === 'Yes'
        }
      }));
    }
    //handle yes/no to hepatitis B vaccine
    else if (currentStep === 'hepBVaccine') {
      setUserResponses(prev => ({
        ...prev,
        vaccinations: {
          ...prev.vaccinations,
          hepB: optionText === 'Yes'
        }
      }));
    }
    // handle yes/no to brca mutation
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
    // handle yes/no to cdh1 or other gastric gene mutation
    else if (currentStep === 'gastricGeneMutation') {
      setUserResponses(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          gastricGeneMutation: optionText === 'Yes'
        }
      }));
    }
    // handle no. of births
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
    //handle menopause age
    else if (currentStep === 'menopauseAge') {
      setUserResponses(prev => ({
        ...prev,
        sexSpecificInfo: {
          ...prev.sexSpecificInfo,
          female: {
            ...prev.sexSpecificInfo.female,
            menopauseAge: optionText 
          }
        }
      }));
    }

    setTimeout(() => {
      setIsProcessingSelection(false);
      if (nextId === "routeBasedOnSex") {
        routeBasedOnSex();
      } 
      else {
        if (nextId === "prostateTest" && userSex === "Male" && userResponses.demographics.age < 30) {
          // Skip prostate test for males under 30
          setUserResponses(prev => ({
            ...prev,
            sexSpecificInfo: {
              ...prev.sexSpecificInfo,
              male: {
                ...prev.sexSpecificInfo.male,
                prostateTest: {
                  had: false,
                  ageAtLast: "N/A" 
                }
              }
            }
          }));
          
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
        }
      }
    }, 1000);
  };