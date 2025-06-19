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
      if (sexSpecificInfo.female.pregnancy.hadPregnancy && 
          sexSpecificInfo.female.pregnancy.ageAtFirst < 20) riskScore += 1;
    }
    
    return riskScore;
  };    // Cancer Screening recommendations for females

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
  
  // Keep only cervical cancer risk explanations
  if (demographics.sex === 'Female' && !sexSpecificInfo.female.hpvVaccine) {
    explanations.push("No HPV vaccination increases cervical cancer risk");
  }
  
  return explanations;
};