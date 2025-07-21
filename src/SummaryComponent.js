import React, { useRef, useState } from 'react';
import {
  Box,
  Text,
  Button,
  Icon,
  Heading,
  useColorModeValue,
  useToast,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { FaCheckCircle, FaPrint, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { getPrescribedTests } from './testPrescription';

// Create a SummaryComponent to show at the end with multiple pages
const SummaryComponent = ({ userResponses, handleOptionSelectCall }) => {
  const toast = useToast();
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const summaryRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page (1: Medical & Risk Data, 2: Cancer Tests)
  
  // Calculate risk factors
  const calculateRiskScore = () => {
    let riskScore = 0;
    
    // Age risk (higher for older individuals)
    if (userResponses.demographics.age > 60) riskScore += 3;
    else if (userResponses.demographics.age > 40) riskScore += 2;
    else if (userResponses.demographics.age > 30) riskScore += 1;
    
    // Cancer history
    if (userResponses.medicalHistory.personalCancer.diagnosed) riskScore += 4;
    if (userResponses.medicalHistory.familyCancer.diagnosed) riskScore += 3;
    
    // Chronic conditions
    riskScore += Math.min(userResponses.medicalHistory.chronicConditions.length, 3);    // Smoking
    if (userResponses.lifestyle.smoking.current) {riskScore += 3;
      // Using pack-years as a more accurate measure of smoking history
      if (userResponses.lifestyle.smoking.packYears >= 30) riskScore += 3;
      else if (userResponses.lifestyle.smoking.packYears >= 20) riskScore += 2;
      else if (userResponses.lifestyle.smoking.packYears >= 10) riskScore += 1;
    }
      // Alcohol consumption
    if (userResponses.lifestyle.alcohol?.consumes && userResponses.lifestyle.alcohol?.drinksPerWeek > 5) {
      // +1 risk score for every 3 drinks above 5 drinks per week
      const excessDrinks = userResponses.lifestyle.alcohol.drinksPerWeek - 5;
      const additionalRiskScore = Math.floor(excessDrinks / 3);
      riskScore += additionalRiskScore;
    }
    
    // Sexual health risk
    if (userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv) {
      // High risk sexual behavior or HPV/HIV diagnosis increases risk score
      riskScore += 2;
    }
    
    // Transplant
    if (userResponses.lifestyle.transplant) riskScore += 2;
    
    // Sex-specific factors
    if (userResponses.demographics.sex === 'Male') {
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) riskScore += 1;
      if (userResponses.sexSpecificInfo.male.testicularIssues) riskScore += 1;
      if (!userResponses.sexSpecificInfo.male.prostateTest.had && userResponses.demographics.age > 50) riskScore += 2;
    }
    
    if (userResponses.demographics.sex === 'Female') {
      // Female-specific risk factors
      if (userResponses.sexSpecificInfo.female.birthControl) riskScore += 1;
      if (userResponses.sexSpecificInfo.female.hormoneReplacementTherapy) riskScore += 1;
    }
    
    // Vaccination status
    if (!userResponses.vaccinations.hpv && userResponses.demographics.age < 45) riskScore += 1;
    if (!userResponses.vaccinations.hepB) riskScore += 1;
    
    // Cancer screening history
    if (!userResponses.cancerScreening.hadScreening && userResponses.demographics.age > 40) riskScore += 2;
    
    return riskScore;
  };
  const getHealthCategory = (score) => {
    if (score <= 3) return { category: "Low Risk", color: "green" };
    if (score <= 7) return { category: "Moderate Risk", color: "yellow" };
    if (score <= 12) return { category: "High Risk", color: "orange" };
    return { category: "Very High Risk", color: "red" };
  };
    const getRecommendations = () => {
    const age = userResponses.demographics.age;
    const sex = userResponses.demographics.sex;
    const hasFamilyCancer = userResponses.medicalHistory.familyCancer.diagnosed;
    const recommendations = [];
    
    // General recommendations
    if (hasFamilyCancer) {
      recommendations.push("Consider genetic counseling for inherited cancer risk");
    }

    if (userResponses.medicalHistory.chronicConditions.includes("Diabetes")) {
      recommendations.push("Regular HbA1c monitoring");
    }
    
    if (sex === "Male") {
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) {
        recommendations.push("Urological evaluation recommended");
      }

      if (userResponses.sexSpecificInfo.male.testicularIssues) {
        recommendations.push("Testicular self-examinations and specialist consultation");
      }
    }
      // Vaccination recommendations
    if (!userResponses.vaccinations.hpv && age < 45) {
      recommendations.push("Consider HPV vaccination if eligible");
    }
    
    if (!userResponses.vaccinations.hepB) {
      recommendations.push("Consider Hepatitis B vaccination");
    }
      // Sexual health recommendations
    if (userResponses.lifestyle && userResponses.lifestyle.sexualHealth && 
        userResponses.lifestyle.sexualHealth.unprotectedSexOrHpvHiv) {
      recommendations.push("Practice safe sex to reduce cancer risk");
    }
    
    // Cancer screening recommendations based on screening history
    if (!userResponses.cancerScreening.hadScreening) {
      if (age >= 45) {
        recommendations.push("Discuss appropriate cancer screening tests with your healthcare provider");
      }
    }
    
    return recommendations;
  };

  const riskScore = calculateRiskScore();
  const healthStatus = getHealthCategory(riskScore);
  const recommendations = getRecommendations();
  const prescribedTests = getPrescribedTests(userResponses);
  
  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage(2);
  };

  const goToPreviousPage = () => {
    setCurrentPage(1);
  };
  
  // PDF generation function removed - using print functionality only
  // Function to print the summary using browser's print API with iframe approach
  const printSummary = () => {
    // Variable to track if we've created an iframe that needs cleanup
    let printIframe = null;
    
    try {
      // Create a hidden iframe for printing (no popup)
      printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      // Not setting width/height to 0 to help with rendering
      printIframe.style.width = '100%';
      printIframe.style.height = '100%';
      printIframe.style.border = 'none';
      printIframe.style.opacity = '0';
      printIframe.style.visibility = 'hidden';
      printIframe.style.overflow = 'hidden';
      
      // Append the iframe to document body
      document.body.appendChild(printIframe);
      
      // Get the current theme colors for styling
      const accentColorVal = accentColor;
      
      // Prepare the data for printing
      const formatBadge = (condition, trueText, falseText, trueColor, falseColor) => {
        const color = condition ? trueColor : falseColor;
        const text = condition ? trueText : falseText;
        return `<span class="badge badge-${color}">${text}</span>`;
      };
      
      // Get health risk and recommendations
      const riskLevel = healthStatus.category;
      const riskColor = healthStatus.color === "red" ? "red" : 
                         healthStatus.color === "orange" ? "orange" : 
                         healthStatus.color === "yellow" ? "yellow" : "green";
      
      // Format all the user data for display
      const personalInfo = `
        <div class="section-title">Personal Information</div>
        <div class="personal-info-grid">
          <div class="info-pair">
            <span class="label">Age:</span>
            <span class="value"><strong>${userResponses.demographics.age}</strong></span>
          </div>
          <div class="info-pair">
            <span class="label">Sex:</span>
            <span class="value"><strong>${userResponses.demographics.sex}</strong></span>
          </div>
          <div class="info-pair">
            <span class="label">Ethnicity:</span>
            <span class="value">${userResponses.demographics.ethnicity === 'Middle Eastern or North African' ? 'MENA' : (userResponses.demographics.ethnicity || 'Not specified')}</span>
          </div>
          <div class="info-pair">
            <span class="label">Location:</span>
            <span class="value">${userResponses.demographics.country || 'Not specified'}</span>
          </div>
        </div>
      `;
      
      const medicalHistory = `
        <div class="section-title">Medical History</div>
        <div class="simple-medical-history">
          <div class="mh-row">
            <span class="mh-label">Personal Cancer:</span>
            <span class="mh-value">
              ${userResponses.medicalHistory.personalCancer.diagnosed
                ? (userResponses.medicalHistory.personalCancer.type
                    ? `<span style=\"margin-left:5px;\">${userResponses.medicalHistory.personalCancer.type}
                        ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis ? `<span style=\"font-style:italic;\">(Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})</span>` : ''}
                      </span>`
                    : formatBadge(true, 'Yes', '', 'red', 'green'))
                : formatBadge(false, '', 'No', 'red', 'green')}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">Family Cancer:</span>
            <span class="mh-value">
              ${userResponses.medicalHistory.familyCancer.diagnosed
                ? (userResponses.medicalHistory.familyCancer.type
                    ? `<span style=\"margin-left:5px;\">${userResponses.medicalHistory.familyCancer.type}
                        ${userResponses.medicalHistory.familyCancer.relation ? ` <span style=\"font-weight:bold;\">in ${userResponses.medicalHistory.familyCancer.relation}</span>` : ''}
                        ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis ? `<span style=\"font-style:italic;\">(Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})</span>` : ''}
                      </span>`
                    : formatBadge(true, 'Yes', '', 'red', 'green'))
                : formatBadge(false, '', 'No', 'red', 'green')}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">Chronic Conditions:</span>
            <span class="mh-value">
              ${userResponses.medicalHistory.chronicConditions.length > 0 ? 
                `<span style=\"font-weight:500;\">${userResponses.medicalHistory.chronicConditions.join(', ')}</span>` : 
                '<span style=\"color:#38A169;\">None</span>'}
            </span>
          </div>
        </div>
      `;
      
      const lifestyleFactors = `
        <div class="section-title">Lifestyle Factors</div>
        <div class="grid">
          <div class="label">Smoking Status:</div>
          <div class="value">
            ${formatBadge(userResponses.lifestyle.smoking.current, 'Current Smoker', 'Non-Smoker', 'red', 'green')}
          </div>

          <div class="label">Alcohol Consumption:</div>
          <div class="value">
            ${userResponses.lifestyle.alcohol?.consumes ? 
              formatBadge(true, `Yes (${userResponses.lifestyle.alcohol.drinksPerWeek} drinks/week)`, '', 
                userResponses.lifestyle.alcohol.drinksPerWeek > 14 ? 'red' : 
                userResponses.lifestyle.alcohol.drinksPerWeek > 7 ? 'orange' : 'yellow') : 
              formatBadge(false, '', 'No', '', 'green')}
          </div>

          <div class="label">Salty/Smoked Foods:</div>
          <div class="value">
            ${(() => {
              const val = userResponses.lifestyle.saltySmokedFoods;
              if (!val) return 'Not specified';
              const normalized = val.trim().toLowerCase();
              if (normalized === '4 or more times a week') return '4+/week';
              if (normalized === '>1/week' || normalized === 'less than one time a week') return '>1/week';
              if (normalized === '1-3 times a week') return '1-3/week';
              if (normalized === 'once a week') return '1/week';
              if (normalized === 'rarely' || normalized === 'less than once a week') return 'Rarely';
              if (normalized === 'never') return 'Never';
              return val;
            })()}
          </div>

          <div class="label">Fruits & Veg (servings):</div>
          <div class="value">
            ${(() => {
              const servings = userResponses.lifestyle.fruitVegServings;
              if (!servings) return 'Not specified';
              const normalized = servings.trim().toLowerCase();
              if (normalized === '5 or more servings') return '5+/day';
              if (normalized === '3-4 servings') return '3-4/day';
              if (normalized === '1-2 servings') return '1-2/day';
              if (normalized === 'rarely' || normalized === 'less than 1 serving') return 'Rarely';
              if (normalized === 'never') return 'Never';
              // Try to extract a number from the servings string
              const match = servings.match(/(\d+\+?)/);
              return match ? `${match[1]}/day` : `${servings}/day`;
            })()}
          </div>

          <div class="label">Sexual Health Risk:</div>
          <div class="value">
            ${formatBadge(userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv, 'High Risk', 'Standard Risk', 'red', 'green')}
          </div>

          <div class="label">Organ Transplant:</div>
          <div class="value">
            ${formatBadge(userResponses.lifestyle.transplant, 'Yes', 'No', 'orange', 'green')}
          </div>
        </div>
      `;
      
      const geneticInfectionRisk = `
        <div class="section-title">Genetic & Infection Risk</div>
        <div class="grid">
          <div class="label">BRCA1/BRCA2 mutation:</div>
          <div class="value">
            ${(userResponses.medicalHistory.brcaMutationStatus !== undefined && userResponses.medicalHistory.brcaMutationStatus !== null && userResponses.medicalHistory.brcaMutationStatus !== '') ?
              formatBadge(userResponses.medicalHistory.brcaMutationStatus === 'Yes', 'Yes', 'No', 'orange', 'green') :
              '<span style="color:#718096;">Not specified</span>'}
          </div>
          <div class="label">H.pylori history:</div>
          <div class="value">
            ${
              userResponses.lifestyle && userResponses.lifestyle.hPylori === 'Yes' ?
                formatBadge(true, 'Yes', 'No', 'orange', 'green') :
              userResponses.lifestyle && userResponses.lifestyle.hPylori === 'No' ?
                formatBadge(false, 'Yes', 'No', 'orange', 'green') :
                '<span style="color:#718096;">Not specified</span>'
            }
          </div>
          <div class="label">Eradication Therapy:</div>
          <div class="value">
            ${
              userResponses.lifestyle && userResponses.lifestyle.hPylori === 'No'
                ? '<span style="color:#718096;">N/A</span>'
                : userResponses.lifestyle && userResponses.lifestyle.hPyloriEradication === 'Yes'
                  ? formatBadge(true, 'Yes', 'No', 'orange', 'green')
                  : userResponses.lifestyle && userResponses.lifestyle.hPyloriEradication === 'No'
                    ? formatBadge(false, 'Yes', 'No', 'orange', 'green')
                    : '<span style="color:#718096;">Not specified</span>'
            }
          </div>
          <div class="label">Gastritis (chronic) / Ulcers:</div>
          <div class="value">
            ${
              userResponses.lifestyle && userResponses.lifestyle.gastritisUlcer === 'Yes'
                ? formatBadge(true, 'Yes', 'No', 'orange', 'green')
                : userResponses.lifestyle && userResponses.lifestyle.gastritisUlcer === 'No'
                  ? formatBadge(false, 'Yes', 'No', 'orange', 'green')
                  : '<span style="color:#718096;">Not specified</span>'
            }
          </div>
        </div>
      `;

      const medicationsAllergies = `
        <div class="section-title">Medications & Allergies</div>
        <div class="grid">
          <div class="label">Current Medications:</div>
          <div class="value">
            ${userResponses.medications.length > 0 ? userResponses.medications.join(', ') : 'None reported'}
          </div>
          <div class="label">Known Allergies:</div>
          <div class="value">
            ${userResponses.allergies && userResponses.allergies !== "None" ? userResponses.allergies : 'None reported'}
          </div>
        </div>
      `;
      
      // Gastrointestinal Surgery section (moved below lifestyleFactors)
      const gastrointestinalSurgery = `
        <div class="section-title">Gastrointestinal Surgery</div>
        <div class="simple-medical-history">
          <div class="mh-row">
            <span class="mh-label">Partial Gastrectomy:</span>
            <span class="mh-value">
              ${typeof userResponses.surgery !== 'undefined' && typeof userResponses.surgery.partialGastrectomy !== 'undefined' ?
                formatBadge(userResponses.surgery.partialGastrectomy, 'Yes', 'No', 'orange', 'green') :
                '<span style="color:#718096;">Not specified</span>'}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">Pernicious Anemia:</span>
            <span class="mh-value">
              ${typeof userResponses.medicalHistory.perniciousAnemia !== 'undefined' ?
                formatBadge(userResponses.medicalHistory.perniciousAnemia === 'Yes', 'Yes', 'No', 'orange', 'green') :
                '<span style="color:#718096;">Not specified</span>'}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">CDH1/Gene Mutation:</span>
            <span class="mh-value">
              ${typeof userResponses.medicalHistory.gastricGeneMutation !== 'undefined' ?
                formatBadge(userResponses.medicalHistory.gastricGeneMutation === 'Yes', 'Yes', 'No', 'orange', 'green') :
                '<span style="color:#718096;">Not specified</span>'}
            </span>
          </div>
        </div>
      `;

      let sexSpecificInfo = '';
      if (userResponses.demographics.sex === "Male") {
        sexSpecificInfo = `
          <div class="section-title">Male-Specific Screening</div>
          <div class="grid">
            <div class="label">Urinary Symptoms:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.male.urinarySymptoms, 'YES', 'NO', 'orange', 'green')}
            </div>
            
            <div class="label">Prostate Test:</div>
            <div class="value" style="display: flex; justify-content: flex-end; align-items: center; gap: 6px;">
              ${userResponses.sexSpecificInfo.male.prostateTest.had ? 
                `<span>(Age ${userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})</span>` : ''}
              ${formatBadge(userResponses.sexSpecificInfo.male.prostateTest.had, 'YES', 'NO', 'green', 'yellow')}
              ${!userResponses.sexSpecificInfo.male.prostateTest.had && userResponses.demographics.age < 30 ? 
                `<span style=\"color:#718096; font-size:8pt;\">N/A (Not recommended under 30)</span>` : ''}
            </div>
            
            <div class="label">Testicular Issues:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.male.testicularIssues, 'YES', 'NO', 'orange', 'green')}
            </div>
          </div>
        `;
      } else {
        sexSpecificInfo = `
          <div class="section-title">Female-Specific Screening</div>
          <div class="grid">
            <div class="label">First Period Age:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}</div>
            
            <div class="label">Menstruation Status:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}</div>

            <div class="label">Last Period Age:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menopauseAge || 'Not specified'}</div>

            <div class="label">Pregnancy History:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy, 'YES', 'NO', 'blue', 'gray')}
              ${userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? 
                `(First at age ${userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})` : ''}
            </div>

            <div class="label">Births at/after 24 weeks:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.numberOfBirths !== undefined && userResponses.sexSpecificInfo.female.numberOfBirths !== null && userResponses.sexSpecificInfo.female.numberOfBirths !== '' ? userResponses.sexSpecificInfo.female.numberOfBirths : 'Not specified'}</div>

            <div class="label">Oral contraceptive:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.pillYears !== undefined && userResponses.sexSpecificInfo.female.pillYears !== null && userResponses.sexSpecificInfo.female.pillYears !== '' ? userResponses.sexSpecificInfo.female.pillYears : 'Not specified'}</div>
            
            <div class="label">Hormone Replacement Therapy:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.hormoneReplacementTherapy, 'YES', 'NO', 'purple', 'gray')}
            </div>

            <div class="label">Tubal ligation:</div>
            <div class="value">
              ${formatBadge(
                userResponses.sexSpecificInfo.female.tubalLigation === true,
                'Yes',
                'No',
                'purple',
                'gray'
              )}
            </div>

            <div class="label">Ovary Removal:</div>
            <div class="value">
              ${userResponses.sexSpecificInfo.female.ovaryRemoved !== undefined && userResponses.sexSpecificInfo.female.ovaryRemoved !== null && userResponses.sexSpecificInfo.female.ovaryRemoved !== ''
                ? userResponses.sexSpecificInfo.female.ovaryRemoved
                : '<span class="not-specified">Not specified</span>'}
            </div>

            <div class="label">Endometriosis diagnosis:</div>
            <div class="value">
              ${formatBadge(
                userResponses.medicalHistory.endometriosis === 'Yes',
                'Yes',
                'No',
                'purple',
                'gray'
              )}
            </div>
            <div class="label">IVF Drugs:</div>
            <div class="value">
              ${(() => {
                const val = userResponses.sexSpecificInfo.female.IVF_history;
                if (val === undefined || val === null || val === '') {
                  return '<span class="not-specified">Not specified</span>';
                }
                if (val === true || (typeof val === 'string' && val.trim().toLowerCase() === 'yes')) {
                  return '<span class="badge badge-red">Yes</span>';
                }
                if (val === false || (typeof val === 'string' && val.trim().toLowerCase() === 'no')) {
                  return '<span class="badge badge-green">No</span>';
                }
                return val;
              })()}
            </div>
          </div>
        `;
      }
      
      const vaccinationsScreening = `
        <div class="section-title">Vaccinations & Screening History</div>
        <div class="grid">
          <div class="label">HPV Vaccine:</div>
          <div class="value">
            ${formatBadge(userResponses.vaccinations.hpv, 'YES', 'NO', 'green', 'yellow')}
          </div>
          
          <div class="label">Hepatitis B Vaccine:</div>
          <div class="value">
            ${formatBadge(userResponses.vaccinations.hepB, 'YES', 'NO', 'green', 'yellow')}
          </div>
          
          <div class="label">Cancer Screening History:</div>
          <div class="value">
            ${formatBadge(userResponses.cancerScreening.hadScreening, 'YES', 'NO', 'blue', 'gray')}
            ${userResponses.cancerScreening.hadScreening && userResponses.cancerScreening.details ? 
              `<div style="font-size:8pt; margin-top:5px;">"${userResponses.cancerScreening.details}"</div>` : ''}
          </div>
        </div>
      `;
      
      // We'll skip the risk assessment since we're using our enhanced version directly in the HTML
      
      // Using our enhanced layout directly in the HTML
      
      // We'll use the prescribedTests that were already declared at the component level
      
      // We already have recommendations computed earlier
      // No need to recompute
      
      // Get the iframe's document
      const printDocument = printIframe.contentDocument || 
                           (printIframe.contentWindow ? printIframe.contentWindow.document : null);
      
      // Check if we successfully got the document
      if (!printDocument) {
        throw new Error("Could not access iframe document");
      }
      
      // Write the complete HTML content to the iframe
      printDocument.open();
      printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cancer Screening Test Results</title>
          <link rel="stylesheet" href="/printStyles.css">
          <style>
            .simple-medical-history {
              display: flex;
              flex-direction: column;
              gap: 4px;
              width: 100%;
              margin-bottom: 8px;
              background-color: white;
              border-bottom: 1px solid #E2E8F0;
              padding: 2px 0;
            }
            .mh-row {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              min-height: 28px;
            }
            .mh-label {
              font-size: 14pt;
              color: #4A5568;
              text-align: left;
              font-weight: 400;
            }
            .mh-value {
              font-size: 14pt;
              color: #2D3748;
              text-align: right;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .personal-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              gap: 3px 20px;
              width: 100%;
              margin-bottom: 8px;
              background-color: white;
              border-bottom: 1px solid #E2E8F0;
              padding: 2px 0;
            }
            .info-pair {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              min-width: 0;
            }
            @page {
              size: A4 portrait;
              margin: 10mm;
              /* This helps ensure consistent page breaking */
              marks: none;
              bleed: 0;
            }
            
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              background-color: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* More explicit print controls */
            article {
              display: block;
              width: 100%;
            }
            
            .page {
              box-sizing: border-box;
              position: relative;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              background-color: white;
              /* Removed large margin-bottom that could cause blank space */
              margin-bottom: 0;
            }
            
            @media print {
              .page {
                box-shadow: none;
                margin: 0;
                padding: 0;
                border-radius: 0;
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              .page:first-child {
                page-break-after: always;
                break-after: page;
              }
              
              .page:last-child {
                page-break-after: auto;
                break-after: auto;
              }
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              position: relative;
              color: #2B6CB0;
              border-bottom: 3px solid #2B6CB0;
              padding-bottom: 15px;
            }
            
            .header h1 {
              color: #2B6CB0;
              font-size: 27pt;
              margin: 0;
              font-weight: 900;
              letter-spacing: -0.5px;
            }

            .header h2 {
              font-size: 17pt;
              margin: 8px 0 0 0;
              font-weight: 500;
              color: #4A5568;
            }

            .header p {
              color: #718096;
              font-size: 10pt;
              margin: 5px 0 0 0;
              font-style: italic;
            }

            .section-title {
              font-size: 15pt;
              color: #2B6CB0;
              padding-bottom: 3px;
              margin-bottom: 6px;
              margin-top: 9px;
              font-weight: bold;
              position: relative;
              border-bottom: none;
            }

            .section-title:first-child {
              margin-top: 0;
            }
            
            .content {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            
            .column {
              width: 48%;
              background-color: white;
              border-radius: 0;
              padding: 0;
              box-shadow: none;
            }
            
            .label {
              font-size: 14pt;
              color: #4A5568;
              text-align: left;
              display: block;
              white-space: nowrap;
            }
            
            .value {
              font-size: 14pt;
              margin-bottom: 8px;
              padding-left: 0;
              color: #2D3748;
              display: block;
              text-align: right;
            }
            
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 3px;
              font-size: 10pt;
              color: white;
              margin-right: 5px;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            /* Badge colors updated to match the pink/light red high risk style from the reference image */
            .badge-green { background-color: #C6F6D5; color: #22543D; }
            .badge-red { background-color: #FEDED2; color: #9B2C2C; } /* Pink/light red for high risk */
            .badge-yellow { background-color: #FEFCBF; color: #744210; }
            .badge-blue { background-color: #BEE3F8; color: #2A4365; }
            .badge-orange { background-color: #FEEBC8; color: #7B341E; }
            .badge-purple { background-color: #E9D8FD; color: #44337A; }
            .badge-gray { background-color: #E2E8F0; color: #1A202C; }
            
            .grid {
              display: grid;
              grid-template-columns: 120px 1fr;
              gap: 3px 10px;
              width: 100%;
              margin-bottom: 8px;
              background-color: white;
              border-bottom: 1px solid #E2E8F0;
              padding: 2px 0;
            }
            /* Right-align all values except personal info and cancer tests; labels left-aligned */
            .grid .label {
              text-align: left;
              justify-content: flex-start;
              display: flex;
              align-items: center;
              white-space: nowrap;
            }
            .grid .value {
              text-align: right;
              justify-content: flex-end;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            /* Remove flex/column stacking for label columns */
            .grid {
              align-items: center;
            }
            /* But keep left alignment for personal info grid */
            .personal-info-grid .label,
            .personal-info-grid .value {
              text-align: left;
              justify-content: flex-start;
            }
            /* And for test cards (cancer tests) */
            .test-card .test-name,
            .test-card .test-info,
            .test-card .test-badge {
              text-align: left;
              justify-content: flex-start;
            }
            
            .risk-assessment {
              background-color: white;
              margin-bottom: 20px;
              border-bottom: 1px solid #E2E8F0;
              padding-bottom: 15px;
              padding-top: 5px;
            }
            
            /* Risk badge styling exactly matching the image */
            .risk-badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 14pt;
              margin-bottom: 2px;
              padding-left: 0;
              color: #2D3748;
              text-transform: uppercase;
              white-space: nowrap;
              line-height: 1.2;
              min-width: 90px;
              text-align: center;
            }
            
            .badge-red { 
              background-color: #FEDED2; 
              color: #9B2C2C;
            }
            
            ul {
              padding-left: 10px;
              margin: 12px 0;
              list-style-type: none;
            }
            
            li {
              margin-bottom: 8px;
              font-size: 11pt;
              line-height: 1.4;
              position: relative;
              padding-left: 18px;
            }
            
            .check-icon:before {
              content: "✓";
              color: #38A169;
              font-weight: bold;
              margin-right: 5px;
              position: absolute;
              left: 0;
            }
            
            .test-card {
              background-color: white;
              padding: 10px 0;
              margin-bottom: 15px;
              border-bottom: 1px solid #E2E8F0;
            }
            
            .test-name {
              font-weight: bold;
              font-size: 12pt;
              color: #2D3748;
              margin-bottom: 5px;
            }
            
            .test-info {
              color: #4A5568;
              font-size: 11pt;
              margin: 3px 0;
              line-height: 1.4;
            }
            
            .test-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 3px;
              font-size: 9pt;
              color: white;
              margin-top: 5px;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .divider {
              height: 1px;
              background-color: #E2E8F0;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <article style="page-break-after: avoid; break-after: avoid;">

            <!-- First Page -->
            <section class="page" style="page-break-after: always; break-after: page;">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900;">Sky Premium Hospital</h1>
                <h2>Cancer Screening Test</h2>
              </header>
              <div class="content">
                <div class="column">
                  ${personalInfo}
                  ${medicalHistory}
                  ${lifestyleFactors}
                  ${gastrointestinalSurgery}
                </div>
                <div class="column">
                  ${geneticInfectionRisk}
                  ${sexSpecificInfo}
                  ${vaccinationsScreening}
                  <!-- Risk Assessment removed from PDF printout as requested -->
                </div>
              </div>
            </section>

            <!-- Second Page: Ovarian Cancer Symptom Screening (Goff Criteria) for Females Only, no placeholders -->
            ${userResponses.demographics.sex === "Female" ? `
            <section class="page" style="page-break-after: always; break-after: page;">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900;">Sky Premium Hospital</h1>
                <h2>Cancer Screening Test</h2>
              </header>
              <div class="content">
                <div class="column" style="width: 100%; min-height: 400px;">
                  ${medicationsAllergies}
                  <div class="section-title">Ovarian Cancer Symptom Screening (Goff Criteria)</div>
                  <div class="grid">
                    <div class="label">Persistent Bloating or Abdominal Swelling:</div>
                    <div class="value">
                      ${(() => {
                        // Use the exact key as set in HandlerFunctions.js
                        const val = userResponses.symptoms?.goffSymptomIndex?.bloating;
                        if (val === undefined || val === null || val === '') {
                          return '<span class="not-specified">Not specified</span>';
                        }
                        if (val === true) {
                          return '<span class="badge badge-red">Yes</span>';
                        }
                        if (val === false) {
                          return '<span class="badge badge-green">No</span>';
                        }
                        return val;
                      })()}
                    </div>
                    <div class="label">Pelvic or Lower-Abdominal Pain:</div>
                    <div class="value">
                      ${(() => {
                        const val = userResponses.symptoms?.goffSymptomIndex?.pain;
                        if (val === undefined || val === null || val === '') {
                          return '<span class="not-specified">Not specified</span>';
                        }
                        if (val === true) {
                          return '<span class="badge badge-red">Yes</span>';
                        }
                        if (val === false) {
                          return '<span class="badge badge-green">No</span>';
                        }
                        return val;
                      })()}
                    </div>
                    <div class="label">Felt Full Quickly or Been Unable to Finish Meals:</div>
                    <div class="value">
                      ${(() => {
                        // Use only the correct key for this symptom
                        const val = userResponses.symptoms?.goffSymptomIndex?.fullness;
                        if (val === true) {
                          return '<span class="badge badge-red">Yes</span>';
                        }
                        if (val === false) {
                          return '<span class="badge badge-green">No</span>';
                        }
                        if (val === undefined || val === null || val === '') {
                          return '<span class="not-specified">Not specified</span>';
                        }
                        return val;
                      })()}
                    </div>
                    <div class="label">Frequent Need To Pass Urine:</div>
                    <div class="value">
                      ${(() => {
                        // Use the correct key for this symptom (urinary)
                        const val = userResponses.symptoms?.goffSymptomIndex?.urinary;
                        if (val === true) {
                          return '<span class="badge badge-red">Yes</span>';
                        }
                        if (val === false) {
                          return '<span class="badge badge-green">No</span>';
                        }
                        if (val === undefined || val === null || val === '') {
                          return '<span class="not-specified">Not specified</span>';
                        }
                        return val;
                      })()}
                    </div>
                    <div class="label">An Increase in abdomen size or clothes have become tight:</div>
                    <div class="value">
                      ${(() => {
                        // Use the correct key for this symptom (abdomenSize)
                        const val = userResponses.symptoms?.goffSymptomIndex?.abdomenSize;
                        if (val === true) {
                          return '<span class="badge badge-red">Yes</span>';
                        }
                        if (val === false) {
                          return '<span class="badge badge-green">No</span>';
                        }
                        if (val === undefined || val === null || val === '') {
                          return '<span class="not-specified">Not specified</span>';
                        }
                        return val;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            ` : ''}

            ${prescribedTests.length > 0 ? `
            <!-- Third Page (only rendered if there are prescribed tests) -->
            <section class="page">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900">Recommended Cancer Screening Tests</h1>
              </header>
              <div class="content" style="page-break-before: avoid; break-before: avoid;">
                <div class="column" style="width: 100%; page-break-inside: avoid; break-inside: avoid;">
                  ${prescribedTests.map(test => `
                    <div class="test-card" style="page-break-inside: avoid; break-inside: avoid;">
                      <div class="test-name">
                        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#38A169; margin-right:8px;"></span>
                        ${test.name}
                      </div>
                      <div class="test-info">Frequency: ${test.frequency}</div>
                      <div class="test-info">${test.reason}</div>
                      <div style="margin-top:5px;">
                        <span class="test-badge" style="background-color:${test.priority === "high" ? "#FEDED2" : test.priority === "medium" ? "#FEEBC8" : "#C6F6D5"}; color:${test.priority === "high" ? "#9B2C2C" : test.priority === "medium" ? "#7B341E" : "#22543D"}">
                          ${test.priority === "high" ? "SCHEDULE WITHIN 1 MONTH" : test.priority === "medium" ? "SCHEDULE WITHIN 3 MONTHS" : "SCHEDULE WITHIN 6 MONTHS"}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
            ` : ''}
          </article>
        </body>
        </html>
      `);
      
      // Close the document for writing
      printDocument.close();
      
      // We need to wait for images and styles to load
      // Flag to prevent multiple print dialogs
      let hasPrintBeenTriggered = false;
      
      const triggerPrint = () => {
        // Check if print has already been triggered to avoid duplicate dialogs
        if (hasPrintBeenTriggered) {
          return;
        }
        
        // Mark print as triggered
        hasPrintBeenTriggered = true;
        
        try {
          // Try to focus the iframe before printing
          if (printIframe.contentWindow) {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
            
            // Remove the iframe when printing dialog is closed or after a timeout
            setTimeout(() => {
              try {
                // Check if the iframe still exists in the document before removing
                if (printIframe && printIframe.parentNode === document.body) {
                  document.body.removeChild(printIframe);
                }
              } catch (err) {
                console.log("Iframe already removed or not found:", err);
                // No need to show an error to the user as this is just cleanup
              }
            }, 5000);
          } else {
            console.error("Cannot access iframe content window");
            toast({
              title: "Print error",
              description: "Could not access print preview. Please try again.",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right"
            });
          }
        } catch (err) {
          console.error("Error during print:", err);
          toast({
            title: "Print error",
            description: "An error occurred while trying to print.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
        }
      };
      
      // Use onload as the primary method to trigger print
      printIframe.onload = () => {
        // Give browsers more time to properly render the content before printing
        // This helps avoid blank pages in the print output
        setTimeout(triggerPrint, 1000);
      };
      
      // Fallback in case onload doesn't fire, but with a longer delay
      // This prevents racing with the onload handler
      setTimeout(triggerPrint, 2000);

    } catch (error) {
      console.error("Print preparation error:", error);
      toast({
        title: "Print preparation failed",
        description: "There was an issue setting up your summary for printing.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  };  // Apply styling for badge alignment in the UI (these styles will apply to the printed version through printStyles.css)
  React.useEffect(() => {
    // Fix badges in the UI
    const fixBadges = () => {
      const badges = summaryRef.current?.querySelectorAll('.chakra-badge') || [];
      
      // Fix badge styling directly
      badges.forEach(badge => {
        // Apply critical styles directly to badge elements
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.verticalAlign = 'middle';
        badge.style.height = '18px';
        badge.style.lineHeight = '1';
        badge.style.maxWidth = '100%';
        badge.style.whiteSpace = 'nowrap';
        badge.style.position = 'relative';
      });
      
      // Fix box elements containing badges to properly align content
      const allBoxes = summaryRef.current?.querySelectorAll('.chakra-box') || [];
      allBoxes.forEach(box => {
        const badgesInBox = box.querySelectorAll('.chakra-badge');
        if (badgesInBox.length > 0) {
          box.style.display = 'flex';
          box.style.alignItems = 'center';
          box.style.flexWrap = 'wrap';
        }
      });
    };
    
    // Fix badges after component renders
    setTimeout(fixBadges, 500);
  }, []);
  
  return (
    <Box ref={summaryRef} width="100%">
      <Box 
        width="210mm" 
        minHeight="297mm"
        maxHeight="calc(100vh - 40px)"
        mx="auto" 
        p={5} 
        bg="white" 
        boxShadow="md" 
        borderRadius="sm"
        mt={0}
        className="a4-page"
        sx={{
          // A4 proportions and styling
          aspectRatio: '1 / 1.414',
          position: 'relative',
          // Changed from 'hidden' to 'auto' to allow scrolling
          overflow: 'auto',
          // Match the clean design of the print version
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: '#2D3748',
          '@media print': {
            margin: 0,
            padding: '10mm 15mm',
            boxShadow: 'none',
            fontSize: '11pt',
            pageBreakAfter: 'always',
          }
        }}>
        
      {/* Main title */}      
      <Box 
        textAlign="center" 
        mb={6} 
        width="100%"
        borderBottom="1px solid"
        borderColor="gray.200"
        pb={4}>

        <Heading size="lg" color="#2B6CB0" fontSize="20pt">Sky Premium Hospital</Heading>
        <Heading size="md" mt={2} fontSize="12pt" color="gray.700">Cancer Screening Test</Heading>
      </Box>
        
      {/* Page 1: Medical Data */}
      {currentPage === 1 && (
        <Flex 
          direction="row" 
          width="100%" 
          justifyContent="space-between" 
          mb={3} 
          overflowX="hidden"
          fontSize="10pt" >

          {/* Left column */}        
          <Box width="48%" pr={3}>
            {/* Demographics section */}
            <Box mb={3}>            
              <Heading size="sm" mb={1.5} pb={0.5} fontSize="9pt" color="#2B6CB0" fontWeight="bold">
                Personal Information
              </Heading>            
              <Grid templateColumns="repeat(2, 1fr)" gap={2} width="100%">
                <GridItem>
                  <Text fontWeight="bold" fontSize="11pt" color="#4A5568">
                    Age:
                  </Text>
                  <Text fontSize="11pt">
                    {userResponses.demographics.age}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="medium" fontSize="10pt">
                    Sex:
                  </Text>

                  <Text fontSize="10pt">
                    {userResponses.demographics.sex}
                  </Text>
                </GridItem>
                <GridItem>

                  <Text fontWeight="medium" fontSize="10pt">
                    Ethnicity:
                  </Text>                
                  <Text fontSize="10pt">
                    {userResponses.demographics.ethnicity || 'Not specified'}
                  </Text>

                </GridItem>    

                <GridItem>
                  <Text fontWeight="medium" fontSize="10pt">
                    Location:
                  </Text>
                  <Text fontSize="10pt">
                    {userResponses.demographics.country || 'Not specified'}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {/* Medical History */}
            <Box mb={4}>
              <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                Medical History
              </Heading>            
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Personal Cancer:
                </Text>              
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  {userResponses.medicalHistory.personalCancer.diagnosed ? 
                    <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
                  {userResponses.medicalHistory.personalCancer.diagnosed && 
                    <Text as="span" ml={2} fontWeight="normal" fontSize="9pt">
                      {userResponses.medicalHistory.personalCancer.type ? 
                        userResponses.medicalHistory.personalCancer.type : "Cancer type"}
                      {userResponses.medicalHistory.personalCancer.ageAtDiagnosis && 
                        ` (Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})`}
                    </Text>}
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Family Cancer:
                  </Text>
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                  {userResponses.medicalHistory.familyCancer.diagnosed ? 
                    <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
                  {userResponses.medicalHistory.familyCancer.diagnosed && userResponses.medicalHistory.familyCancer.type && 
                    <Text as="span" ml={2} fontWeight="normal" fontSize="9pt">
                      {userResponses.medicalHistory.familyCancer.type}
                      {userResponses.medicalHistory.familyCancer.relation && ` in ${userResponses.medicalHistory.familyCancer.relation}`}
                      {userResponses.medicalHistory.familyCancer.ageAtDiagnosis && 
                        ` (Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})`}
                    </Text>}
                </Box>              
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Chronic Conditions:
                </Text>              
                <Text fontSize="9pt">
                  {userResponses.medicalHistory.chronicConditions.length > 0 ? 
                    userResponses.medicalHistory.chronicConditions.join(', ') : 'None'}
                </Text>
              </Grid>
            </Box>

            {/* Lifestyle */}
            <Box mb={3}>
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                Lifestyle Factors
              </Heading>            
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Smoking Status:
                </Text>             
                <Box display="flex" alignItems="center" flexWrap="wrap">                
                  {userResponses.lifestyle.smoking.current ? 
                    <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Current Smoker</Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Non-Smoker</Badge>}
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Alcohol Consumption:
                </Text>              
                <Box display="flex" alignItems="center" flexWrap="wrap">                
                  {userResponses.lifestyle.alcohol?.consumes ? 
                    <Badge colorScheme={userResponses.lifestyle.alcohol.drinksPerWeek > 14 ? "red" : userResponses.lifestyle.alcohol.drinksPerWeek > 7 ? "orange" : "yellow"} ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">
                      Yes ({userResponses.lifestyle.alcohol.drinksPerWeek} drinks/week)
                    </Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">
                      No
                    </Badge>}
                </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Sexual Health Risk:
                </Text>              
                <Box display="flex" alignItems="center" flexWrap="wrap">                
                  {userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv ? 
                    <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">High Risk</Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Standard Risk</Badge>}
                </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Organ Transplant:
                </Text>              
                <Box display="flex" alignItems="center" flexWrap="wrap">                
                  {userResponses.lifestyle.transplant ? 
                    <Badge colorScheme="orange" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Yes</Badge> : 
                    <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
                </Box>
              </Grid>
            </Box>            
            
            {/* Medications & Allergies */}
            <Box mb={3}>
              <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                Medications & Allergies
              </Heading>            
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} width="100%">              
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Current Medications:
                </Text>

                <Text fontSize="9pt">
                  {userResponses.medications.length > 0 ? 
                  userResponses.medications.join(', ') : 'None reported'}
                </Text>

                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Known Allergies:
                </Text>

                <Text fontSize="9pt">
                  {userResponses.allergies && userResponses.allergies !== "None" ? 
                  userResponses.allergies : 'None reported'}
                </Text>
              </Grid>          
            </Box>
            
            {/* Gender-specific Information - Moved below Medications & Allergies in left column */}
            <Box mb={3}>
              <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                {userResponses.demographics.sex === "Male" ? "Male" : "Female"}-Specific Screening
              </Heading>
                {userResponses.demographics.sex === "Male" && (
                <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Urinary Symptoms:
                  </Text>                
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.urinarySymptoms ? "orange" : "green"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.male.urinarySymptoms ? "YES" : "NO"}
                    </Badge>
                  </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Prostate Test:
                  </Text>                
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.prostateTest.had ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.male.prostateTest.had ? "YES" : "NO"}
                    </Badge>
                    {userResponses.sexSpecificInfo.male.prostateTest.had ? 
                      <Text as="span" ml={2} fontSize="9pt">
                        (Age {userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})
                      </Text> : 
                      userResponses.demographics.age < 30 ? 
                      <Text as="span" ml={2} fontSize="8pt" color="gray.600">
                        N/A (Not recommended under 30)
                      </Text> : null}
                  </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Testicular Issues:
                  </Text>               
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.testicularIssues ? "orange" : "green"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.male.testicularIssues ? "YES" : "NO"}
                    </Badge>
                  </Box>
                </Grid>
              )}
                {userResponses.demographics.sex === "Female" && (
                <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    First Period Age:
                  </Text>
                  <Text fontSize="9pt">
                    {userResponses.sexSpecificInfo.female.menarcheAge || 'Not specified'}
                  </Text>                
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Menstruation Status:
                  </Text>
                  <Text fontSize="9pt">
                    {userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}
                  </Text>
                  
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Pregnancy History:
                  </Text>                
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "blue" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? "YES" : "NO"}
                    </Badge>
                    {userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy && 
                      <Text as="span" ml={2} fontSize="9pt">
                        (First at age {userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})
                      </Text>}
                  </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Birth Control Pills:
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.birthControl ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.female.birthControl ? "YES" : "NO"}
                    </Badge>
                  </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Hormone Replacement Therapy (HRT):
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hormoneReplacementTherapy ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.female.hormoneReplacementTherapy ? "YES" : "NO"}
                    </Badge>
                  </Box>

                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">

                    Tubal ligation:
                  </Text>
                  <Box display="flex" alignItems="center">
                    {userResponses.sexSpecificInfo.female.tubalLigation === true && (
                      <Badge maxW="100%" fontSize="8pt" colorScheme="purple" display="inline-flex" alignItems="center" height="18px">
                        Yes
                      </Badge>
                    )}
                    {userResponses.sexSpecificInfo.female.tubalLigation === false && (
                      <Badge maxW="100%" fontSize="8pt" colorScheme="gray" display="inline-flex" alignItems="center" height="18px">
                        No
                      </Badge>
                    )}
                    {(userResponses.sexSpecificInfo.female.tubalLigation === undefined || userResponses.sexSpecificInfo.female.tubalLigation === null) && (
                      <Badge maxW="100%" fontSize="8pt" colorScheme="gray" display="inline-flex" alignItems="center" height="18px">
                        Not specified
                      </Badge>
                    )}
                  </Box>

                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Ovary Removal:
                  </Text>
                  <Text fontSize="9pt">
                    {userResponses.sexSpecificInfo.female.ovaryRemoved || 'Not specified'}
                  </Text>

                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                    Endometriosis diagnosis:
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.medicalHistory.endometriosis ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.medicalHistory.endometriosis ? userResponses.medicalHistory.endometriosis : 'Not specified'}
                    </Badge>
                  </Box>

                  {/* HPV Vaccine question removed from female section */}
                </Grid>
              )}
            </Box>
          </Box>        {/* Center divider */}
          <Divider orientation="vertical" height="auto" mx={2} />
          
          {/* Right column */}
          <Box width="48%" pl={3}>          
          
            {/* Vaccination and Screening History - Moved to top of right column */}
            <Box mb={3}>
              <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                Vaccinations & Screening History
              </Heading>            
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  HPV Vaccine:
                </Text>              
                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hpv ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.vaccinations.hpv ? "YES" : "NO"}
                  </Badge>
                </Box>
                
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Hepatitis B Vaccine:
                </Text>              
                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hepB ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.vaccinations.hepB ? "YES" : "NO"}
                  </Badge>
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Cancer Screening History:
                </Text>              
                <Box>
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.cancerScreening.hadScreening ? "blue" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.cancerScreening.hadScreening ? "YES" : "NO"}
                    </Badge>
                  </Box>
                  {userResponses.cancerScreening.hadScreening && userResponses.cancerScreening.details && (
                    <Text fontSize="8pt" mt={1}>
                      "{userResponses.cancerScreening.details}"
                    </Text>
                  )}
                </Box>
              </Grid>
            </Box>
            
            {/* Risk Assessment - Moved from page 2 */}
            <Box mb={3}>
              <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
                Health Risk Assessment
              </Heading>            
              <Flex justify="space-between" align="center" mb={2}>
                <Box>
                  <Text fontWeight="medium" fontSize="10pt">
                    Risk Level:
                  </Text>                
                  <Badge 
                    data-status={healthStatus.color}
                    className={healthStatus.category === "Very High Risk" ? "very-high-risk" : ""}
                    fontSize="8pt"
                    py={1} 
                    px={2}
                    display="inline-flex"
                    alignItems="center"
                    textTransform="uppercase"
                    fontWeight="bold"
                    borderRadius="3px"
                    whiteSpace="nowrap"
                    minWidth="90px"
                    textAlign="center">
                    {healthStatus.category}
                  </Badge>
                </Box>
                
                <Box textAlign="right">
                  <Text fontWeight="medium" fontSize="10pt">
                    Age Group:
                  </Text>
                  <Text fontSize="10pt">
                    {userResponses.demographics.age < 18 ? 'Pediatric' : 
                      userResponses.demographics.age < 36 ? 'Young Adult' : 
                      userResponses.demographics.age < 56 ? 'Middle-Aged' : 
                      userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'}
                  </Text>
                </Box>
              </Flex>
              
              <Box mt={3}>
                <Text fontWeight="medium" fontSize="10pt" mb={1}>
                  Risk Factors:
                </Text>
                <List>
                  {userResponses.medicalHistory.personalCancer.diagnosed && <ListItem fontSize="9pt">• History of cancer</ListItem>}
                  {userResponses.medicalHistory.familyCancer.diagnosed && <ListItem fontSize="9pt">• Family history of cancer</ListItem>}
                  {userResponses.medicalHistory.geneticDisorder && <ListItem fontSize="9pt">• Genetic predisposition</ListItem>}
                  {userResponses.lifestyle.smoking?.status === 'current' && <ListItem fontSize="9pt">• Current smoker</ListItem>}
                  {userResponses.lifestyle.smoking?.status === 'former' && <ListItem fontSize="9pt">• Former smoker</ListItem>}
                  {userResponses.lifestyle.alcohol?.consumes && userResponses.lifestyle.alcohol?.drinksPerWeek > 7 && 
                    <ListItem fontSize="9pt">• Alcohol consumption ({userResponses.lifestyle.alcohol.drinksPerWeek} drinks/week)</ListItem>}
                  {userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv && <ListItem fontSize="9pt">• Sexual health risk factors</ListItem>}
                </List>
              </Box>
            </Box>
            
              {/* General Recommendations - Moved from page 2 */}
              <Box mb={3}>
                <Heading size="sm" mb={1} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                  General Recommendations
                </Heading>
                <List spacing={1}>
                  {recommendations.map((recommendation, index) => (
                    <ListItem key={`rec-${index}`} display="flex" alignItems="flex-start" mb={1}>
                      <ListIcon as={FaCheckCircle} color="blue.500" mt={0.5} flexShrink={0} fontSize="8pt" />
                      <Text fontSize="9pt">{recommendation}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Flex>
        )}
        
        {/* Page 2: Cancer Screening Tests */}
        {currentPage === 2 && (
          <Box width="100%" px={4} py={3} maxHeight="calc(297mm - 180px)" overflow="auto">
            {/* Page title */}
            <Box textAlign="center" mb={6} width="100%" borderBottom="1px solid" borderColor="gray.200" pb={4}>
              <Heading size="md" color="#2B6CB0" fontSize="12pt">Cancer Screening Tests</Heading>
              <Text mt={2} fontSize="9pt" color="gray.700">Recommended Screenings Based on Risk Assessment</Text>
            </Box>
            
            {/* Recommended Tests Section */}
            <Box mb={6} className="tests-container">
              <Heading size="sm" mb={2} pb={0.5} borderBottom="1px solid" borderColor="gray.200" fontSize="9pt" color={accentColor}>
                Recommended Cancer Screening Tests
              </Heading>
              
              {prescribedTests.length > 0 ? (
                <Grid templateColumns="1fr" gap={4} width="100%">
                  {prescribedTests.map((test, index) => (
                    <Box 
                      key={`test-${index}`} 
                      p={4} 
                      borderWidth="1px" 
                      borderColor="gray.200"
                      borderRadius="md"
                      boxShadow="sm"
                      bg="white">
                      
                      <Flex align="center" mb={2}>
                        <Box w={3} h={3} borderRadius="50%" bg="green.500" mr={2}></Box>
                        <Heading size="sm" fontSize="9pt" color="gray.800">{test.name}</Heading>
                      </Flex>
                      
                      <Text fontSize="11pt" mb={1}><b>Frequency:</b> {test.frequency}</Text>
                      <Text fontSize="11pt" mb={3}>{test.reason}</Text>
                      
                      <Badge 
                        bg={
                          test.priority === "high" ? "#FEDED2" : 
                          test.priority === "medium" ? "#FEEBC8" : 
                          "#C6F6D5"
                        } 
                        color={
                          test.priority === "high" ? "#9B2C2C" : 
                          test.priority === "medium" ? "#7B341E" : 
                          "#22543D"
                        }
                        px={3}
                        py={1}
                        fontSize="10pt"
                        fontWeight="bold">
                        {test.priority === "high" ? "SCHEDULE WITHIN 1 MONTH" : 
                         test.priority === "medium" ? "SCHEDULE WITHIN 3 MONTHS" : 
                         "SCHEDULE WITHIN 6 MONTHS"}
                      </Badge>
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={8} borderWidth="1px" borderColor="gray.200" borderRadius="md">
                  <Text fontSize="14pt" color="gray.500">No specific cancer tests recommended at this time.</Text>
                  <Text fontSize="11pt" mt={2} color="gray.500">Continue regular check-ups with your healthcare provider.</Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      
      {/* Action Buttons */}
        <Flex justifyContent="center" mt={3} gap={4} position="sticky" bottom={0} pb={2} className="no-print" 
              bg="white" borderTopWidth="1px" borderColor="gray.100" boxShadow="0 -2px 5px rgba(0,0,0,0.05)" p={2} zIndex={100}>
          {currentPage === 1 && (
            <>
              <Button
                bg="#2B6CB0"
                color="white"
                _hover={{ bg: "#2C5282" }}
                rightIcon={<Icon as={FaArrowRight} />}
                size="md"
                onClick={goToNextPage}>
                Next: Screening Tests
              </Button>
              
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={FaPrint} />}
                variant="solid"
                size="md"
                onClick={printSummary}>
                Print Summary
              </Button>
            </>
          )}
          
          {currentPage === 2 && (
            <>
              <Button
                bg="#2B6CB0"
                color="white"
                _hover={{ bg: "#2C5282" }}
                leftIcon={<Icon as={FaArrowLeft} />}
                size="md"
                onClick={goToPreviousPage}>
                Back to Medical Data
              </Button>
              
              <Button
                colorScheme="blue"
                leftIcon={<Icon as={FaPrint} />}
                variant="solid"
                size="md"
                onClick={printSummary}>
                Print Summary
              </Button>
              
              <Button
                colorScheme="gray"
                variant="outline"
                size="md"
                onClick={() => handleOptionSelectCall("Start a new screening", "start")}>
                Start New Screening
              </Button>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default SummaryComponent;
