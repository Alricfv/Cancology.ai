/**
 * Cancer Test Prescription Logic
 * This module contains the logic for prescribing specific cancer tests
 * based on user demographics, medical history, and risk factors.
 */

export const getPrescribedTests = (userResponses) => {
  const tests = [];
  const { demographics, sexSpecificInfo } = userResponses;
    // Helper function to calculate risk score for cervical cancer
  const calculateCervicalCancerRisk = () => {
    let riskScore = 0;
    
    if (demographics.sex === 'Female') {
      if (demographics.age >= 21 && demographics.age <= 65) riskScore += 3;
      if (!sexSpecificInfo.female.hpvVaccine) riskScore += 2;
      if (userResponses.lifestyle && 
          userResponses.lifestyle.sexualHealth && 
          userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) riskScore += 3;
      if (sexSpecificInfo.female.pregnancy.hadPregnancy && 
          sexSpecificInfo.female.pregnancy.ageAtFirst < 20) riskScore += 1;
    }
    
    return riskScore;
  };// Cancer Screening recommendations for females

  if (demographics.sex === 'Female') {
    // Calculate risk score (for future use/expansion)
    calculateCervicalCancerRisk();
    
    // Cervical Cancer Screening
    if (demographics.age >= 21 && demographics.age <= 29) {
      tests.push({
        name: "Pap Smear",
        type: "cervical",
        priority: !sexSpecificInfo.female.hpvVaccine ? "medium" : "standard",
        reason: "Routine cervical cancer screening for women 21-29 years old",
        frequency: "Every 3 years",
        urgency: "Schedule within 2 months"
      });
    }

    else if (demographics.age >= 30 && demographics.age <= 65) {
      tests.push({
        name: "HPV DNA Test",
        type: "cervical",
        priority: !sexSpecificInfo.female.hpvVaccine ? "medium" : "standard",
        reason: "Routine cervical cancer screening for women 30+ years old",
        frequency: "Every 5 years",
        urgency: "Schedule within 2 months"
      });
    }

      // Breast Cancer Screening (Mammogram)
    if (demographics.age >= 40) {
      tests.push({
        name: "Mammogram",
        type: "breast",
        priority: "standard",
        reason: "Routine breast cancer screening for women 40+ years old",
        frequency: "Every 1-2 years",
        urgency: "Schedule within 3 months"
      });
    }

    // Ovarian Cancer Screening (Goff et al. symptoms)
    if (userResponses.symptoms && userResponses.symptoms.goffSymptomIndex) {
      const goff = userResponses.symptoms.goffSymptomIndex;
      const goffSymptomPositive = [goff.bloating, goff.pain, goff.fullness, goff.urinary, goff.abdomenSize].some(v => v === true);
      if (goffSymptomPositive) {
        tests.push({
          name: "Transvaginal ultrasound",
          type: "ovarian",
          priority: "high",
          reason: "One or more Goff et al. symptoms positive. Early detection is critical.",
          frequency: "As soon as possible",
          urgency: "Schedule within 1 month"
        });
        tests.push({
          name: "CA-125",
          type: "ovarian",
          priority: "high",
          reason: "One or more Goff et al. symptoms positive. Early detection is critical.",
          frequency: "As soon as possible",
          urgency: "Schedule within 1 month"
        });
      }
    }
  }

    // Colorectal Cancer Screening for both males and females starting at age 45
  if (demographics.age >= 45) {
    tests.push({
      name: "Colonoscopy",
      type: "colorectal",
      priority: "standard",
      reason: "Routine colorectal cancer screening for adults 45+ years old",
      frequency: "Every 10 years",
      urgency: "Schedule within 3 months"
    });
    
    tests.push({
      name: "Fecal Immunochemical Test (FIT)",
      type: "colorectal",
      priority: "standard",
      reason: "Alternative to colonoscopy for colorectal cancer screening",
      frequency: "Yearly",
      urgency: "Schedule within 2 months"
    });
  }
    // Prostate Cancer Screening for men
  if (demographics.sex === 'Male') {
    // Define high risk - comprehensive assessment of multiple risk factors
    const highRiskFactors = [];
    let isHighRisk = false;
    
    // 1. Family history of prostate cancer
    if (userResponses.medicalHistory && 
       userResponses.medicalHistory.familyCancer && 
       userResponses.medicalHistory.familyCancer.diagnosed && 
       userResponses.medicalHistory.familyCancer.type && 
       userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('prostate')) {
      highRiskFactors.push("family history of prostate cancer");
      isHighRisk = true;
      
      // Check for multiple first-degree relatives (stronger family history)
      if (userResponses.medicalHistory.familyCancer.multipleRelatives) {
        highRiskFactors.push("multiple family members with prostate cancer");
      }
    }
    
    // 2. African American ethnicity
    if (userResponses.demographics.ethnicity && 
       userResponses.demographics.ethnicity.toLowerCase().includes('black')) {
      highRiskFactors.push("African American ethnicity");
      isHighRisk = true;
    }
    
    // 3. Urinary symptoms
    if (userResponses.sexSpecificInfo.male.urinarySymptoms) {
      highRiskFactors.push("urinary symptoms");
      isHighRisk = true;
    }
    
    // 4. Genetic mutations
    if (userResponses.medicalHistory.geneticMutations && 
        (userResponses.medicalHistory.geneticMutations.includes('BRCA1') || 
         userResponses.medicalHistory.geneticMutations.includes('BRCA2') || 
         userResponses.medicalHistory.geneticMutations.includes('Lynch'))) {
      highRiskFactors.push("genetic mutations associated with increased cancer risk");
      isHighRisk = true;
    }
    
    // 5. Previous abnormal PSA test
    if (userResponses.sexSpecificInfo.male.prostateTest && 
        userResponses.sexSpecificInfo.male.prostateTest.had && 
        userResponses.sexSpecificInfo.male.prostateTest.abnormalResult) {
      highRiskFactors.push("previous abnormal PSA result");
      isHighRisk = true;
    }
    
    // 6. Chemical exposure
    if (userResponses.lifestyle && 
        userResponses.lifestyle.chemicalExposure && 
        (userResponses.lifestyle.chemicalExposure.agentOrange || 
         userResponses.lifestyle.chemicalExposure.pesticides)) {
      highRiskFactors.push("exposure to chemicals linked to prostate cancer");
      isHighRisk = true;
    }
    
    // 7. Obesity
    if (userResponses.lifestyle && 
        userResponses.lifestyle.bmi && 
        userResponses.lifestyle.bmi >= 30) {
      highRiskFactors.push("obesity");
      // Not setting isHighRisk to true just for obesity alone
      // but including it as a contributing factor
    }
    
    // Age threshold based on risk level
    const ageThreshold = isHighRisk ? 45 : 50;
    
    if (demographics.age >= ageThreshold) {
      // Create risk reason message
      let riskReason = isHighRisk 
        ? `Prostate cancer screening for high-risk men (${highRiskFactors.join(", ")})`
        : "Routine prostate cancer screening for men 50+ years old";
        
      // Set priority based on number of risk factors
      let priority = "standard";
      if (highRiskFactors.length >= 3) {
        priority = "high";
      } else if (highRiskFactors.length >= 1) {
        priority = "medium";
      }
      
      tests.push({
        name: "Prostate Specific Antigen (PSA) Test",
        type: "prostate",
        priority: priority,
        reason: riskReason,
        frequency: isHighRisk ? "Yearly" : "Every 1-2 years",
        urgency: priority === "high" ? "Schedule within 1 month" : "Schedule within 3 months"
      });
      
      // Add note about DRE as an accompanying test
      tests.push({
        name: "Digital Rectal Examination (DRE)",
        type: "prostate",
        priority: priority,
        reason: "Often performed along with PSA test for more comprehensive prostate screening",
        frequency: isHighRisk ? "Yearly" : "Every 1-2 years",
        urgency: "Schedule with PSA test"
      });
    }
  }
  // Lung Cancer Screening with Low-dose CT Scan
  if (demographics.age >= 50 && 
      userResponses.lifestyle && 
      userResponses.lifestyle.smoking && 
      userResponses.lifestyle.smoking.packYears >= 20) {
    tests.push({
      name: "Low-dose CT Scan",
      type: "lung",
      priority: "high",
      reason: "Lung cancer screening for individuals with 20+ pack-years of smoking history",
      frequency: "Yearly",
      urgency: "Schedule within 1 month"
    });
  }
  
  // Skin Cancer Screening with Clinical Skin Examination for high-risk individuals
  // Evaluate skin cancer risk factors
  const skinCancerRiskFactors = [];
  let isHighRiskForSkinCancer = false;
  
  // 1. Family history of skin cancer
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.familyCancer && 
      userResponses.medicalHistory.familyCancer.diagnosed && 
      userResponses.medicalHistory.familyCancer.type && 
      (userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('skin') ||
       userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('melanoma'))) {
    skinCancerRiskFactors.push("family history of skin cancer");
    isHighRiskForSkinCancer = true;
  }
  
  // 2. Personal history of skin cancer
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.personalCancer && 
      userResponses.medicalHistory.personalCancer.diagnosed && 
      userResponses.medicalHistory.personalCancer.type && 
      (userResponses.medicalHistory.personalCancer.type.toLowerCase().includes('skin') ||
       userResponses.medicalHistory.personalCancer.type.toLowerCase().includes('melanoma'))) {
    skinCancerRiskFactors.push("personal history of skin cancer");
    isHighRiskForSkinCancer = true;
  }
  
  // 3. Fair skin, light hair, or light eye color
  if (userResponses.demographics && 
      userResponses.demographics.skinType && 
      (userResponses.demographics.skinType.toLowerCase().includes('fair') || 
       userResponses.demographics.skinType.toLowerCase().includes('light'))) {
    skinCancerRiskFactors.push("fair skin type");
    isHighRiskForSkinCancer = true;
  }
  
  // 4. History of sunburns or excessive sun exposure
  if (userResponses.lifestyle && 
      userResponses.lifestyle.sunExposure && 
      (userResponses.lifestyle.sunExposure.frequentBurns || 
       userResponses.lifestyle.sunExposure.highExposure)) {
    skinCancerRiskFactors.push("history of sunburns or high sun exposure");
    isHighRiskForSkinCancer = true;
  }
  
  // 5. Presence of abnormal moles
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.skinConditions && 
      userResponses.medicalHistory.skinConditions.abnormalMoles) {
    skinCancerRiskFactors.push("presence of abnormal moles");
    isHighRiskForSkinCancer = true;
  }
  
  // 6. Immunosuppression
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.chronicConditions && 
      userResponses.medicalHistory.chronicConditions.includes('Immunosuppression')) {
    skinCancerRiskFactors.push("immunosuppression");
    isHighRiskForSkinCancer = true;
  }
  
  // 7. Exposure to radiation
  if (userResponses.lifestyle && 
      userResponses.lifestyle.radiationExposure) {
    skinCancerRiskFactors.push("history of radiation exposure");
    isHighRiskForSkinCancer = true;
  }
    // Add skin cancer screening if high risk is determined
  if (isHighRiskForSkinCancer) {
    // Create risk reason message
    let riskReason = `Skin cancer screening recommended due to risk factors: ${skinCancerRiskFactors.join(", ")}`;
    
    // Set priority based on number of risk factors
    let priority = "standard";
    if (skinCancerRiskFactors.length >= 3) {
      priority = "high";
    } else if (skinCancerRiskFactors.length >= 1) {
      priority = "medium";
    }
    
    tests.push({
      name: "Clinical Skin Examination",
      type: "skin",
      priority: priority,
      reason: riskReason,
      frequency: skinCancerRiskFactors.length >= 3 ? "Every 6 months" : "Yearly",
      urgency: priority === "high" ? "Schedule within 1 month" : "Schedule within 3 months"
    });
    
    // Add recommendation for self-examination
    tests.push({
      name: "Monthly Skin Self-Examination",
      type: "skin",
      priority: priority,
      reason: "Regular self-checks for changes in skin appearance",
      frequency: "Monthly",
      urgency: "Ongoing"
    });
  }
    // Oral/Throat Cancer Screening (HPV-related) for high-risk individuals ages 30-65
  // Evaluate oral/throat cancer risk factors
  const oralCancerRiskFactors = [];
  let isHighRiskForOralCancer = false;
  
  // 1. HPV status (no vaccination, known infection or high-risk sexual behavior)
  // Determine HPV vaccination status based on sex
  let hasNoHpvVaccine = false;
  
  // For males, only check the general vaccination data
  if (demographics.sex === 'Male') {
    // The value is a boolean (true if 'Yes', false if 'No')
    // If userResponses.vaccinations.hpv is true, then the user has HPV vaccine
    // If userResponses.vaccinations.hpv is false, then the user does not have HPV vaccine
    hasNoHpvVaccine = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
  } 
  // For females, check both general and female-specific vaccination data
  else if (demographics.sex === 'Female') {
    const generalVaccineStatus = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
    const femaleSpecificStatus = sexSpecificInfo.female ? (sexSpecificInfo.female.hpvVaccine === false) : false;
    hasNoHpvVaccine = generalVaccineStatus || femaleSpecificStatus;
  }
  
  const hasHpvRiskBehavior = userResponses.lifestyle && 
      userResponses.lifestyle.sexualHealth && 
      userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv;
  
  if (hasNoHpvVaccine || hasHpvRiskBehavior) {
    if (hasNoHpvVaccine) {
      oralCancerRiskFactors.push("no HPV vaccination");
    }
    if (hasHpvRiskBehavior) {
      oralCancerRiskFactors.push("unprotected sex or HPV/HIV diagnosis");
    }
    isHighRiskForOralCancer = true;
  }
  
  // 2. Tobacco use (current or former)
  if (userResponses.lifestyle && 
      userResponses.lifestyle.smoking &&
      (userResponses.lifestyle.smoking.current || userResponses.lifestyle.smoking.former)) {
    oralCancerRiskFactors.push("tobacco use");
    isHighRiskForOralCancer = true;
  }
  
  // 3. Excessive alcohol consumption
  if (userResponses.lifestyle && 
      userResponses.lifestyle.alcohol && 
      userResponses.lifestyle.alcohol.drinksPerWeek > 7) {
    oralCancerRiskFactors.push("high alcohol consumption");
    isHighRiskForOralCancer = true;
  }
  
  // 4. Family history of oral/throat cancer
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.familyCancer && 
      userResponses.medicalHistory.familyCancer.diagnosed && 
      userResponses.medicalHistory.familyCancer.type && 
      (userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('oral') ||
       userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('throat') ||
       userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('head and neck'))) {
    oralCancerRiskFactors.push("family history of oral/throat cancer");
    isHighRiskForOralCancer = true;
  }
  
  // 5. Immunosuppression
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.chronicConditions && 
      userResponses.medicalHistory.chronicConditions.includes('Immunosuppression')) {
    oralCancerRiskFactors.push("immunosuppression");
    isHighRiskForOralCancer = true;
  }
  
  // 6. Previous oral lesions
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.oralHealth && 
      userResponses.medicalHistory.oralHealth.lesions) {
    oralCancerRiskFactors.push("history of oral lesions");
    isHighRiskForOralCancer = true;
  }
    // Add oral/throat cancer screening if high risk is determined and age is between 30-65
  if (isHighRiskForOralCancer && demographics.age >= 30 && demographics.age <= 65) {
    // Create risk reason message that only includes the specific risk factors the user has
    const userRiskFactors = oralCancerRiskFactors.filter(factor => {
      // Only include risk factors that actually apply to this user
      if (factor === "tobacco use" && userResponses.lifestyle && userResponses.lifestyle.smoking && userResponses.lifestyle.smoking.current) {
        return true;
      }
      if (factor === "high alcohol consumption" && userResponses.lifestyle && userResponses.lifestyle.alcohol && 
          userResponses.lifestyle.alcohol.drinksPerWeek > 7) {
        return true;
      }
      if (factor === "unprotected sex or HPV/HIV diagnosis" && userResponses.lifestyle && 
          userResponses.lifestyle.sexualHealth && 
          userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) {
        return true;
      }
      
      if (factor === "no HPV vaccination") {
        // For males, only check the general vaccination data
        if (demographics.sex === 'Male') {
          const hasNoVaccine = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
          return hasNoVaccine;
        } 
        // For females, check both general and female-specific vaccination data
        else if (demographics.sex === 'Female') {
          const generalVaccineStatus = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
          const femaleSpecificStatus = sexSpecificInfo.female ? (sexSpecificInfo.female.hpvVaccine === false) : false;
          return generalVaccineStatus || femaleSpecificStatus;
        }
        return false;
      }
      if (factor === "family history of oral/throat cancer" && userResponses.medicalHistory && 
          userResponses.medicalHistory.familyCancer && userResponses.medicalHistory.familyCancer.diagnosed && 
          userResponses.medicalHistory.familyCancer.type && 
          (userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('oral') || 
           userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('throat') ||
           userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('head and neck'))) {
        return true;
      }
      if (factor === "immunosuppression" && userResponses.medicalHistory && 
          userResponses.medicalHistory.chronicConditions && 
          userResponses.medicalHistory.chronicConditions.includes('Immunosuppression')) {
        return true;
      }
      if (factor === "history of oral lesions" && userResponses.medicalHistory && 
          userResponses.medicalHistory.oralHealth && 
          userResponses.medicalHistory.oralHealth.lesions) {
        return true;
      }
      return false;
    });
    
    let riskReason = `Oral/throat cancer screening recommended due to risk factors: ${userRiskFactors.join(", ")}`;
    
    // Set priority based on number of risk factors
    let priority = "standard";
    if (oralCancerRiskFactors.length >= 3) {
      priority = "high";
    } else if (oralCancerRiskFactors.length >= 1) {
      priority = "medium";
    }
    
    tests.push({
      name: "Comprehensive Oral Examination with Cytology",
      type: "oral",
      priority: priority,
      reason: riskReason,
      frequency: oralCancerRiskFactors.length >= 3 ? "Every year" : "Every 2 years",
      urgency: priority === "high" ? "Schedule within 1 month" : "Schedule within 3 months"
    });
  }
    // Liver Cancer Screening for individuals with Hepatitis B, Hepatitis C, or cirrhosis who are 40+
  // Also include individuals with organ transplants who have Hepatitis B or Hepatitis C
  if (demographics.age >= 40 && 
      userResponses.medicalHistory && 
      userResponses.medicalHistory.chronicConditions && 
      (userResponses.medicalHistory.chronicConditions.includes('Hepatitis B') || 
       userResponses.medicalHistory.chronicConditions.includes('Hepatitis C') ||
       userResponses.medicalHistory.chronicConditions.includes('Cirrhosis') ||
       (userResponses.lifestyle && 
        userResponses.lifestyle.transplant && 
        (userResponses.medicalHistory.chronicConditions.includes('Hepatitis B') || 
         userResponses.medicalHistory.chronicConditions.includes('Hepatitis C'))))) {
      // Create array of liver conditions for the reason message
    const liverConditions = [];
    if (userResponses.medicalHistory.chronicConditions.includes('Hepatitis B')) {
      liverConditions.push("Hepatitis B");
    }
    if (userResponses.medicalHistory.chronicConditions.includes('Hepatitis C')) {
      liverConditions.push("Hepatitis C");
    }
    if (userResponses.medicalHistory.chronicConditions.includes('Cirrhosis')) {
      liverConditions.push("Cirrhosis");
    }
    
    // Check for transplant status
    const hasTransplant = userResponses.lifestyle && userResponses.lifestyle.transplant;
    const reasonMessage = hasTransplant 
      ? `Liver cancer screening due to ${liverConditions.join(", ")} in transplant patient 40+ years old` 
      : `Liver cancer screening due to ${liverConditions.join(", ")} in patient 40+ years old`;
    
    // Always recommend ultrasound
    tests.push({
      name: "Liver Ultrasound",
      type: "liver",
      priority: "high",
      reason: reasonMessage,
      frequency: "Every 6 months",
      urgency: "Schedule within 1 month"
    });
    
    // Recommend AFP test only if not pregnant
    const isPregnant = demographics.sex === 'Female' && 
                       sexSpecificInfo && 
                       sexSpecificInfo.female && 
                       sexSpecificInfo.female.pregnancy && 
                       sexSpecificInfo.female.pregnancy.current;
      if (!isPregnant) {
      // Use the same transplant-aware reason message
      const afpReasonMessage = hasTransplant 
        ? `Complementary liver cancer screening for ${liverConditions.join(", ")} in transplant patient 40+ years old` 
        : `Complementary liver cancer screening for ${liverConditions.join(", ")} in patient 40+ years old`;
      
      tests.push({
        name: "Alpha-Fetoprotein (AFP) Test",
        type: "liver",
        priority: "high",
        reason: afpReasonMessage,
        frequency: "Every 6 months",
        urgency: "Schedule with liver ultrasound"
      });
    }
  }

  // Sort tests by priority (high -> medium -> standard)
  const priorityOrder = { high: 1, medium: 2, standard: 3 };
  tests.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return tests;
};

export const getTestCategories = () => {
  return {
    immediate: "Schedule within 2 weeks",
    urgent: "Schedule within 1 month", 
    routine: "Schedule within 3 months",
    annual: "Schedule for annual check-up"
  };
};

export const getRiskFactorExplanations = (userResponses) => {
  const explanations = [];
  const { demographics, sexSpecificInfo } = userResponses;
  
  // Cervical cancer risk explanations
  if (demographics.sex === 'Female' && !sexSpecificInfo.female.hpvVaccine) {
    explanations.push("No HPV vaccination increases cervical cancer risk");
  }
  
  // Sexual health risk explanations
  if (userResponses.lifestyle && 
      userResponses.lifestyle.sexualHealth && 
      userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) {
    explanations.push("Unprotected sex or HPV/HIV diagnosis increases risk for HPV-related cancers");
  }
  
  return explanations;
};