/**
 * Cancer Test Prescription Logic
 */

export const getPrescribedTests = (userResponses) => {
  const tests = [];
  const { demographics, sexSpecificInfo } = userResponses;
  const calculateCervicalCancerRisk = () => {
    let riskScore = 0;
    
    if (demographics.sex === 'Female') {
      if (demographics.age >= 21 && demographics.age <= 65) riskScore += 3;
      if (!sexSpecificInfo.female.hpvVaccine) riskScore += 2;
      if (userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) riskScore += 3;
      if (sexSpecificInfo.female.pregnancy.hadPregnancy && 
          sexSpecificInfo.female.pregnancy.ageAtFirst < 20) riskScore += 1;
    }
    
    return riskScore;
  };
  
  // Cancer Screening recommendations for females
  if (demographics.sex === 'Female') {
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

    // Colorectal Cancer Screening for males & females starting from the age 45
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
    }
    
    // Age threshold based on risk level
    const ageThreshold = isHighRisk ? 45 : 50;
    
    if (demographics.age >= ageThreshold) {
      let riskReason = isHighRisk 
        ? `Prostate cancer screening for high-risk men (${highRiskFactors.join(", ")})`
        : "Routine prostate cancer screening for men 50+ years old";
        
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
      
      // DRE as an accompanying test
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
  
  // Skin Cancer Screening with Clinical Skin Examination for high risk individuals
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
  
  // 5. Immunosuppression
  if (userResponses.medicalHistory && 
      userResponses.medicalHistory.chronicConditions && 
      userResponses.medicalHistory.chronicConditions.includes('Immunosuppression')) {
    skinCancerRiskFactors.push("immunosuppression");
    isHighRiskForSkinCancer = true;
  }
  
    // Adds skin cancer screening if high risk is determined
  if (isHighRiskForSkinCancer) {
    let riskReason = `Skin cancer screening recommended due to risk factors: ${skinCancerRiskFactors.join(", ")}`;
    
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
  const oralCancerRiskFactors = [];
  let isHighRiskForOralCancer = false;
  
  // 1. HPV status (no vaccination, known infection or high-risk sexual behavior)
  let hasNoHpvVaccine = false;
  
  // For males, only check the general vaccination data
  if (demographics.sex === 'Male') {
    hasNoHpvVaccine = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
  } 
  // For females, check both general and female-specific vaccination data
  else if (demographics.sex === 'Female') {
    const generalVaccineStatus = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
    const femaleSpecificStatus = sexSpecificInfo.female ? (sexSpecificInfo.female.hpvVaccine === false) : false;
    hasNoHpvVaccine = generalVaccineStatus || femaleSpecificStatus;
  }
  
  const hasHpvRiskBehavior = userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv;
  
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
  if (userResponses.lifestyle.smoking)  {
    oralCancerRiskFactors.push("tobacco use");
    isHighRiskForOralCancer = true;
  }
  
  // 3. Excessive alcohol consumption
  if (userResponses.lifestyle.alcohol.drinksPerWeek > 7) {
    oralCancerRiskFactors.push("high alcohol consumption");
    isHighRiskForOralCancer = true;
  }
  
  // 4. Family history of oral/throat cancer
  if (userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('Oral')) {
    oralCancerRiskFactors.push("family history of oral/throat cancer");
    isHighRiskForOralCancer = true;
  }
  
  // 5. Immunosuppression
  if (userResponses.medicalHistory.chronicConditions.includes('Immunosuppression')) {
    oralCancerRiskFactors.push("immunosuppression");
    isHighRiskForOralCancer = true;
  }
  
  
  if (isHighRiskForOralCancer && demographics.age >= 30 && demographics.age <= 65) {
    const userRiskFactors = oralCancerRiskFactors.filter(factor => {
      // Only include risk factors that actually to a user (ie, give them the basis on which we determined the test for them)
      if (factor === "tobacco use"  && userResponses.lifestyle.smoking && userResponses.lifestyle.smoking.current) {
        return true;
      }
      if (factor === "high alcohol consumption" && userResponses.lifestyle.alcohol && 
          userResponses.lifestyle.alcohol.drinksPerWeek > 7) {
        return true;
      }
      if (factor === "unprotected sex or HPV/HIV diagnosis"&& userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) {
        return true;
      }
      
      if (factor === "no HPV vaccination") {
        if (demographics.sex === 'Male') {
          const hasNoVaccine = userResponses.vaccinations ? (userResponses.vaccinations.hpv === false) : false;
          return hasNoVaccine;
        } 

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
  // Renal Cancer Screening: Renal ultrasound with/without urinalysis 
  if (
    demographics.age >= 40 &&
    (userResponses.medicalHistory.familyCancer.type.toLowerCase().includes('renal') ||
    userResponses.medicalHistory.chronicConditions.includes('Hypertension') ||
    userResponses.vhlSuspicion === 'Yes')
    ) {
    const reasons = [];
    reasons.push('family history of renal cancer');
    if (userResponses.demographics.age >= 40) 
      reasons.push('age 40+');
    if (userResponses.medicalHistory.chronicConditions.includes('Hypertension')) 
      reasons.push('hypertension');
    if (userResponses.vhlSuspicion === 'Yes') 
      reasons.push('VHL suspicion');
    let reason = reasons.join(', ');
    tests.push({
      name: "Renal Ultrasound ± Urinalysis",
      type: "renal",
      priority: "high",
      reason,
      frequency: "Every 1-2 years",
      urgency: "Schedule within 1 month"
    });
  }
  // Liver Cancer Screening Prescription
  if (demographics.age >= 40 && 
      (userResponses.medicalHistory.chronicConditions.includes('Hepatitis B') || 
       userResponses.medicalHistory.chronicConditions.includes('Hepatitis C') ||
       userResponses.medicalHistory.chronicConditions.includes('Cirrhosis') ||
       userResponses.lifestyle.transplant 
      )) 
      {
        const reasons = [];
        if (userResponses.demographics.age >= 40)
          reasons.push('age 40+');
        if (userResponses.medicalHistory.chronicConditions.includes('Hepatitis B'))
          reasons.push('Hepatitis B')
        if (userResponses.medicalHistory.chronicConditions.includes('Hepatitis C'))
          reasons.push('Hepatitis C')
        if (userResponses.medicalHistory.chronicConditions.includes('Cirrhosis'))
          reasons.push('Cirrhosis')
        if (userResponses.medicalHistory.transplant)
          reasons.push('Transplant Patient')

        const reason = reasons.join(', ');


    tests.push({
      name: "Liver Ultrasound",
      type: "liver",
      priority: "high",
      reason,
      frequency: "Every 6 months",
      urgency: "Schedule within 1 month"
    });
    
    // to recommend AFP test only if not currently pregnant
    const isPregnant = userResponses.demographics.sex === 'Female' && userResponses.sexSpecificInfo.female.currentPregnancy;                   
      if (!isPregnant) {
      tests.push({
        name: "Alpha-Fetoprotein (AFP) Test",
        type: "liver",
        priority: "high",
        reason: `Complementary liver cancer screening for ${reason}`,
        frequency: "Every 6 months",
        urgency: "Schedule with liver ultrasound"
      });
    }
  }

  // test sorting by priority
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