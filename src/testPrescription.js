/**
 * Cancer Test Prescription Logic
 * This module contains the logic for prescribing specific cancer tests
 * based on user demographics, medical history, and risk factors.
 */

export const getPrescribedTests = (userResponses) => {
  const tests = [];
  const { demographics, medicalHistory, lifestyle, sexSpecificInfo } = userResponses;
  
  // Helper function to calculate risk score for specific cancers
  const calculateCancerRisk = (cancerType) => {
    let riskScore = 0;
    
    switch (cancerType) {
      case 'breast':
        if (demographics.sex === 'Female') {
          if (demographics.age >= 50) riskScore += 3;
          else if (demographics.age >= 40) riskScore += 2;
          
          if (medicalHistory.familyCancer.diagnosed && 
              medicalHistory.familyCancer.type?.toLowerCase().includes('breast')) {
            riskScore += 4;
          }
          
          if (sexSpecificInfo.female.hormoneTreatment) riskScore += 2;
          if (!sexSpecificInfo.female.pregnancy.hadPregnancy) riskScore += 1;
          if (sexSpecificInfo.female.menarcheAge < 12) riskScore += 1;
        }
        break;
        
      case 'prostate':
        if (demographics.sex === 'Male') {
          if (demographics.age >= 50) riskScore += 3;
          else if (demographics.age >= 45) riskScore += 2;
          
          if (medicalHistory.familyCancer.diagnosed && 
              medicalHistory.familyCancer.type?.toLowerCase().includes('prostate')) {
            riskScore += 4;
          }
          
          if (sexSpecificInfo.male.urinarySymptoms) riskScore += 2;
          if (demographics.ethnicity === 'Black or African American') riskScore += 2;
        }
        break;
        
      case 'colorectal':
        if (demographics.age >= 50) riskScore += 3;
        else if (demographics.age >= 45) riskScore += 2;
        
        if (medicalHistory.familyCancer.diagnosed && 
            (medicalHistory.familyCancer.type?.toLowerCase().includes('colorectal') ||
             medicalHistory.familyCancer.type?.toLowerCase().includes('colon'))) {
          riskScore += 4;
        }
        
        if (medicalHistory.chronicConditions.includes('Inflammatory Bowel Disease')) {
          riskScore += 3;
        }
        break;
          case 'lung':
        // Using pack-years for more accurate risk assessment
        if (lifestyle.smoking.current && lifestyle.smoking.packYears >= 30) riskScore += 5;
        else if (lifestyle.smoking.current && lifestyle.smoking.packYears >= 20) riskScore += 4;
        else if (lifestyle.smoking.current && lifestyle.smoking.packYears >= 10) riskScore += 3;
        
        if (demographics.age >= 55 && lifestyle.smoking.current) riskScore += 3;
        if (demographics.age >= 50) riskScore += 1;
        break;
        
      case 'cervical':
        if (demographics.sex === 'Female') {
          if (demographics.age >= 21 && demographics.age <= 65) riskScore += 3;
          if (!sexSpecificInfo.female.hpvVaccine) riskScore += 2;
          if (sexSpecificInfo.female.pregnancy.hadPregnancy && 
              sexSpecificInfo.female.pregnancy.ageAtFirst < 20) riskScore += 1;
        }
        break;
    }
    
    return riskScore;
  };
  
  // Breast Cancer Screening
  if (demographics.sex === 'Female') {
    const breastRisk = calculateCancerRisk('breast');
    
    if (breastRisk >= 3 || demographics.age >= 50) {
      tests.push({
        name: "Mammography",
        type: "breast",
        priority: breastRisk >= 5 ? "high" : breastRisk >= 3 ? "medium" : "standard",
        reason: `Recommended for breast cancer screening. Risk level: ${breastRisk >= 5 ? 'High' : breastRisk >= 3 ? 'Medium' : 'Standard'}`,
        frequency: demographics.age >= 50 ? "Annual" : "Every 2 years",
        urgency: breastRisk >= 5 ? "Schedule within 1 month" : "Schedule within 3 months"
      });
    }
    
    if (breastRisk >= 5 || (medicalHistory.familyCancer.diagnosed && 
        medicalHistory.familyCancer.type?.toLowerCase().includes('breast'))) {
      tests.push({
        name: "Breast MRI",
        type: "breast",
        priority: "high",
        reason: "High-risk breast cancer screening due to family history or multiple risk factors",
        frequency: "Annual (in addition to mammography)",
        urgency: "Schedule within 2 weeks"
      });
    }
  }
  
  // Prostate Cancer Screening
  if (demographics.sex === 'Male' && demographics.age >= 45) {
    const prostateRisk = calculateCancerRisk('prostate');
    
    if (prostateRisk >= 2 || demographics.age >= 50) {
      tests.push({
        name: "Prostate-Specific Antigen (PSA) Test",
        type: "prostate",
        priority: prostateRisk >= 4 ? "high" : "standard",
        reason: `Prostate cancer screening recommended. ${sexSpecificInfo.male.urinarySymptoms ? 'Urinary symptoms present.' : ''}`,
        frequency: "Annual",
        urgency: prostateRisk >= 4 ? "Schedule within 2 weeks" : "Schedule within 6 weeks"
      });
    }
  }
  
  // Colorectal Cancer Screening
  const colorectalRisk = calculateCancerRisk('colorectal');
  if (colorectalRisk >= 2 || demographics.age >= 45) {
    tests.push({
      name: "Colonoscopy",
      type: "colorectal",
      priority: colorectalRisk >= 4 ? "high" : "standard",
      reason: `Colorectal cancer screening. ${medicalHistory.chronicConditions.includes('Inflammatory Bowel Disease') ? 'IBD increases risk.' : ''}`,
      frequency: "Every 10 years (if normal)",
      urgency: colorectalRisk >= 4 ? "Schedule within 1 month" : "Schedule within 3 months"
    });
  }
    // Lung Cancer Screening
  const lungRisk = calculateCancerRisk('lung');
  if (lungRisk >= 4) {
    tests.push({
      name: "Low-Dose CT Scan (LDCT)",
      type: "lung",
      priority: "high",
      reason: `High-risk lung cancer screening due to significant smoking history (${lifestyle.smoking.packYears} pack-years)`,
      frequency: "Annual",
      urgency: "Schedule within 2 weeks"
    });
  }
  
  // Cervical Cancer Screening
  if (demographics.sex === 'Female') {
    const cervicalRisk = calculateCancerRisk('cervical');
    
    if (demographics.age >= 21 && demographics.age <= 65) {
      tests.push({
        name: "Pap Smear",
        type: "cervical",
        priority: !sexSpecificInfo.female.hpvVaccine ? "medium" : "standard",
        reason: `Routine cervical cancer screening. ${!sexSpecificInfo.female.hpvVaccine ? 'No HPV vaccination history.' : ''}`,
        frequency: demographics.age < 30 ? "Every 3 years" : "Every 3-5 years (with HPV co-testing)",
        urgency: "Schedule within 2 months"
      });
    }
  }
  
  // Skin Cancer Screening (general recommendation)
  if (demographics.age >= 40 || (demographics.ethnicity === 'White or Caucasian' && demographics.age >= 30)) {
    tests.push({
      name: "Full-Body Skin Examination",
      type: "skin",
      priority: "standard",
      reason: "Routine skin cancer screening",
      frequency: "Annual",
      urgency: "Schedule within 6 months"
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
  const { demographics, medicalHistory, lifestyle, sexSpecificInfo } = userResponses;
    // Add explanations for various risk factors
  if (medicalHistory.familyCancer.diagnosed) {
    explanations.push(`Family history of ${medicalHistory.familyCancer.type} increases your cancer risk`);
  }
  
  if (lifestyle.smoking.current) {
    explanations.push(`Current smoking (${lifestyle.smoking.packYears} pack-years) significantly increases lung cancer risk`);
  }
  
  if (demographics.age >= 50) {
    explanations.push("Age 50+ increases risk for most cancer types");
  }
  
  if (demographics.sex === 'Female' && !sexSpecificInfo.female.hpvVaccine) {
    explanations.push("No HPV vaccination increases cervical cancer risk");
  }
  
  return explanations;
};