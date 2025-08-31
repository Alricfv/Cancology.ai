import React, {useRef} from 'react';
import {
  Box,
  Text,
  Button,
  useColorModeValue,
  useToast,
  Flex,
  Spacer
} from '@chakra-ui/react';
import {FaPrint, FaHome} from 'react-icons/fa';
import { getPrescribedTests } from './testPrescription';
import html2pdf from 'html2pdf.js';


const SummaryComponent = ({ userResponses}) => {
  const toast = useToast();
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const summaryRef = useRef(null);
  // vhl suspicion logic, checks for renal cancer, kidney issues or brain/spinal/eye tumors
  // if any of them are found to be true, sets vhlSuspicion to 'Yes'
  // included at top level just as an experiment, later plans are to make every function declared like this
  let vhlSuspicion = '';
  const renalCancerCheck = userResponses.medicalHistory?.personalCancer?.type;
  if (
      userResponses.medicalHistory?.kidneyIssue === true ||
      userResponses.medicalHistory?.brainSpinalEyeTumor === true)
      {
        vhlSuspicion = 'Yes';
      } 
      else {
        vhlSuspicion = 'No'
      }
  
  
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
      const excessDrinks = userResponses.lifestyle.alcohol.drinksPerWeek - 5;
      const additionalRiskScore = Math.floor(excessDrinks / 3);
      riskScore += additionalRiskScore;
    }
    
    // Sexual health risk
    if (userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv) {
      riskScore += 2;
    }
    
    if (userResponses.lifestyle.transplant) riskScore += 2;
    
    if (userResponses.demographics.sex === 'Male') {
      if (userResponses.sexSpecificInfo.male.urinarySymptoms) riskScore += 1;
      if (userResponses.sexSpecificInfo.male.testicularIssues) riskScore += 1;
      if (!userResponses.sexSpecificInfo.male.prostateTest.had && userResponses.demographics.age > 50) riskScore += 2;
    }
    
    if (userResponses.demographics.sex === 'Female') {

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
  const riskScore = calculateRiskScore();

  // Enhanced prescribed tests logic for ovarian cancer risk
  const getEnhancedPrescribedTests = (userResponses) => {
    const tests = getPrescribedTests(userResponses) || [];
    const age = userResponses.demographics.age;
    let hasBRCA = false;
    let hasOvarianFamilyHistory = false;

    // BRCA1/2 mutation check
    if (
      (userResponses.medicalHistory.brcaMutationStatus === 'Yes' || userResponses.medicalHistory.brcaMutationStatus === true)
    ) {
      hasBRCA = true;
    }

    // Family history for ovarian cancer check
    if (typeof userResponses.medicalHistory.familyCancer.type === 'string' &&
      userResponses.medicalHistory.familyCancer.type.includes('Ovarian')
    ) {
      hasOvarianFamilyHistory = true;
    }

    // Upper GI Endoscopy recommendation for both genders above 40 with risk factors
    if (age > 40) {
      let ethnicity = (userResponses.demographics.ethnicity.toLowerCase());
      let ethnicityRisk = [
        'black or african american',
        'east asian',
        'south east asian',
        'east asian/south east asian',
        'hispanic or latino'
      ];
      let ethnicityMatch = ethnicityRisk.some(e => ethnicity.includes(e));

      // Family history of gastric cancer
      let familyGastricCancer = false;
      if (userResponses.medicalHistory.familyCancer.type.includes('Gastric')) {
        familyGastricCancer = true;
      }

      // H.Pylori
      let hPyloriYes = false;
      if (
        (userResponses.lifestyle.hPylori === 'Yes' || userResponses.lifestyle.hPylori === true)
      ) {
        hPyloriYes = true;
      }

      if (ethnicityMatch || familyGastricCancer || hPyloriYes) {
        if (!tests.some(t => t.name && t.name.toLowerCase().includes('upper gastrointestinal endoscopy'))) {
          let reasons = [];
          if (ethnicityMatch) {
            reasons.push('high-risk ethnicity');
          }
          if (familyGastricCancer) {
            reasons.push('family history of gastric cancer');
          }
          if (hPyloriYes) {
            reasons.push('history of H.Pylori infection');
          }
          tests.push({
            name: 'Upper Gastrointestinal Endoscopy',
            frequency: 'Every 2-3 years',
            reason: 'Risk factor' + (reasons.length > 1 ? 's' : '') + ': ' + reasons.join(', '),
            priority: 'high',
          });
        }
      }
    }
    return tests;
  };

  const prescribedTests = getEnhancedPrescribedTests(userResponses);
  

  // printSummary using Iframe approach yippee
  const printSummary = () => {
    let printIframe = null;
    try {
      printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '100%';
      printIframe.style.height = '100%';
      printIframe.style.border = 'none';
      printIframe.style.opacity = '0';
      printIframe.style.visibility = 'hidden';
      printIframe.style.overflow = 'hidden';
      document.body.appendChild(printIframe);
      const formatBadge = (condition, trueText, falseText, trueColor, falseColor) => {
        const color = condition ? trueColor : falseColor;
        const text = condition ? trueText : falseText;
        return `<span class="badge badge-${color}">${text}</span>`;
      };
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
            <span class="value">${userResponses.demographics.ethnicity === "Middle Eastern or North African" ? "MENA" : (userResponses.demographics.ethnicity || "Not specified")}</span>
          </div>
          <div class="info-pair">
            <span class="label">Location:</span>
            <span class="value">${userResponses.demographics.country || "Not specified"}</span>
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
                    ? `<span style="margin-left:5px;">${userResponses.medicalHistory.personalCancer.type}
                        ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis ? `<span style="font-style:italic;">(Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})</span>` : ''}
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
                    ? `<span style="margin-left:5px;">${userResponses.medicalHistory.familyCancer.type}
                        ${userResponses.medicalHistory.familyCancer.relation ? ` <span style="font-weight:bold;">in ${userResponses.medicalHistory.familyCancer.relation}</span>` : ''}
                        ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis ? `<span style="font-style:italic;">(Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})</span>` : ''}
                      </span>`
                    : formatBadge(true, 'Yes', '', 'red', 'green'))
                : formatBadge(false, '', 'No', 'red', 'green')}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">Chronic Conditions:</span>
            <span class="mh-value">
              ${userResponses.medicalHistory.chronicConditions.length > 0 ? 
                `<span style="font-weight:500;">${userResponses.medicalHistory.chronicConditions.join(', ')}</span>` : 
                '<span style="color:#38A169;">None</span>'}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">History of Kidney cyst, Tumor, or Blood in Urine:</span>
            <span class="mh-value">
              ${typeof userResponses.medicalHistory.kidneyIssue === 'boolean'
                ? (userResponses.medicalHistory.kidneyIssue
                    ? '<span class="badge badge-red">Yes</span>'
                    : '<span class="badge badge-green">No</span>')
                : '<span style="color:#718096;">Not specified</span>'}
            </span>
          </div>
          <div class="mh-row">
            <span class="mh-label">History of Brain, Spinal, or Eye Tumor:</span>
            <span class="mh-value">
              ${typeof userResponses.medicalHistory.brainSpinalEyeTumor === 'boolean'
                ? (userResponses.medicalHistory.brainSpinalEyeTumor
                    ? '<span class="badge badge-red">Yes</span>'
                    : '<span class="badge badge-green">No</span>')
                : '<span style="color:#718096;">Not specified</span>'}
            </span>
          </div>
        </div>
      `;
      
      const lifestyleFactors = `
        <div class="section-title">Lifestyle Factors</div>
        <div class="grid">
          <div class="label">Smoking (Pack-Years):</div>
          <div class="value">
            ${(() => {
              if (userResponses.lifestyle.smoking.packYears === null)
                return '<span class ="badge badge-green">0 (Non-Smoker)</span>';
              if (0 < userResponses.lifestyle.smoking.packYears && userResponses.lifestyle.smoking.packYears <20)
                return `<span class ="badge badge-yellow">${userResponses.lifestyle.smoking.packYears} (Low/Moderate)</span>`;
              if (userResponses.lifestyle.smoking.packYears >= 20)
                return `<span class="badge badge-red">${userResponses.lifestyle.smoking.packYears} (High Risk)</span>`;
            })()}
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
              return val ? val : 'Not specified';
            })()}
          </div>

          <div class="label">Fruits & Veg (servings):</div>
          <div class="value">
            ${(() => {
              const servings = userResponses.lifestyle.fruitVegServings;
              return servings ? servings : 'Not specified';
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
          <div class="label">Suspicion of Von Hippel-Lindau (VHL) Syndrome:</div>
          <div class="value">
            ${vhlSuspicion === 'Yes' ? '<span class="badge badge-red">Yes</span>' : vhlSuspicion === 'No' ? '<span class="badge badge-green">No</span>' : '<span style="color:#718096;">N/A</span>'}
          </div>
        </div>
      `;

      const medsNone =
        Array.isArray(userResponses.medications)
          ? userResponses.medications.every(
              (m) => m === false || m === 'None' || m === ''
            )
          : !userResponses.medications || userResponses.medications.length === 0;
      const allergiesNone =
        !userResponses.allergies || userResponses.allergies === 'None' || userResponses.allergies === '';
      const medicationsAllergies = `
        <div class="section-title">Medications & Allergies</div>
        <div class="meds-allergies-block">
          <div class="meds-row">
            <span class="meds-label">Current Medications:</span>
            <span class="meds-value meds-value-right">
              ${!medsNone ? `<ul class="meds-list meds-list-right">${userResponses.medications.map(med => `<li>${med}</li>`).join('')}</ul>` : 'None reported'}
            </span>
          </div>
          <div class="meds-row">
            <span class="meds-label">Known Allergies:</span>
            <span class="meds-value meds-value-right">
              ${!allergiesNone ? `<ul class="meds-list meds-list-right">${userResponses.allergies.split(',').map(allergy => `<li>${allergy.trim()}</li>`).join('')}</ul>` : 'None reported'}
            </span>
          </div>
        </div>
      `;
      
      // Gastrointestinal Surgery section 
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
                `<span style="color:#718096; font-size:8pt;">N/A (Not recommended under 30)</span>` : ''}
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

            <div class="label">Currently Pregnant:</div>
            <div class="value">${formatBadge(userResponses.sexSpecificInfo.female.currentPregnancy, 'Yes', 'No', 'blue', 'gray')}</div>
            
            <div class="label">Menstruation Status:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}</div>

            <div class="label">Last Period Age:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menopauseAge || 'N/A'}</div>

            <div class="label">Pregnancy History:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy, 'Yes', 'No', 'blue', 'gray')}
              ${userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? 
                `(First at age ${userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})` : ''}
            </div>

            <div class="label">Births at/after 24 weeks:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.numberOfBirths !== undefined && userResponses.sexSpecificInfo.female.numberOfBirths !== null && userResponses.sexSpecificInfo.female.numberOfBirths !== '' ? userResponses.sexSpecificInfo.female.numberOfBirths : 'N/A'}</div>

            <div class="label">Oral contraceptive:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.pillYears !== undefined && userResponses.sexSpecificInfo.female.pillYears !== null && userResponses.sexSpecificInfo.female.pillYears !== '' ? userResponses.sexSpecificInfo.female.pillYears : 'N/A'}</div>
            
            <div class="label">Hormone Replacement Therapy:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.hormoneReplacementTherapy, 'Yes', 'No', 'purple', 'gray')}
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
            ${(() => {
              const endometrios = userResponses.medicalHistory.endometriosis;
              if (endometrios === null){
                return `<span class="not-specified">Not specified</span>`;
              }
              if (endometrios === true){
                return `<span class="badge badge-red">Yes</span>`;
              }
              if (endometrios === false){
                return `<span class="badge badge-green"No</span>`;
              }
              
            })()}
            </div>
            <div class="label">IVF Drugs:</div>
            <div class="value">
              ${(() => {
                const val = userResponses.sexSpecificInfo.female.IVF_history;
                if (val === null) {
                  return '<span class="not-specified">Not specified</span>';
                }
                if (val === true ) {
                  return '<span class="badge badge-red">Yes</span>';
                }
                if (val === false ) {
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
          
          <div class="label">Hypertension Diagnosis:</div>
          <div class="value">
            ${userResponses.medicalHistory.hypertension 
                  ? '<span class="badge badge-red">Yes</span>' 
                  : '<span class="badge badge-green">No</span>'}
          </div>
        </div>
      `;

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
            .meds-allergies-block {
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin-bottom: 8px;
              background-color: white;
              border-bottom: 1px solid #E2E8F0;
              padding: 2px 0;
            }
            .meds-row {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: flex-start;
              gap: 12px;
              min-height: 28px;
            }
            .meds-label {
              font-size: 14pt;
              color: #4A5568;
              font-weight: 400;
              min-width: 180px;
              text-align: left;
              margin-right: 10px;
            }
            .meds-value {
              font-size: 14pt;
              color: #2D3748;
              font-weight: 500;
              text-align: left;
              display: block;
              flex: 1;
            }
            .meds-value-right {
              text-align: right;
              display: block;
            }
            .meds-list {
              margin: 0;
              padding-left: 18px;
              list-style-type: disc;
            }
            .meds-list-right {
              text-align: right;
              padding-left: 0;
              padding-right: 18px;
              list-style-type: disc;
            }
            .meds-list li {
              margin-bottom: 2px;
              font-size: 13pt;
              line-height: 1.3;
              color: #2D3748;
              text-align: right;
            }
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
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .test-row {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 2px;
            }
            .test-name {
              font-weight: bold;
              font-size: 12pt;
              color: #2D3748;
              margin-bottom: 0;
            }
            .test-badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 6px;
              font-size: 10pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-left: 8px;
              margin-top: 0;
              letter-spacing: 0.5px;
            }
            .test-info {
              color: #4A5568;
              font-size: 11pt;
              margin: 2px 0 2px 0;
              line-height: 1.4;
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



            <!-- First Page (Single Column, All Sections) -->
            <section class="page" style="page-break-after: always; break-after: page;">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900;">Sky Premium Hospital</h1>
                <h2>Cancer Screening Report</h2>
              </header>
              <div class="column" style="width: 100%;">
                ${personalInfo}
                ${medicalHistory}
                ${lifestyleFactors}
                ${gastrointestinalSurgery}
                ${geneticInfectionRisk}
                ${sexSpecificInfo}
                ${vaccinationsScreening}
                ${medicationsAllergies}
                ${userResponses.demographics.sex === "Female" ? `
                  <div class="section-title">Ovarian Cancer Symptom Screening (Goff Criteria)</div>
                  <div class="grid">
                    <div class="label">Persistent Bloating or Abdominal Swelling:</div>
                    <div class="value">
                      ${(() => {
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
                  ` : ''}

                <div class="section-title">Symptom screening</div>
                <div class="grid">
                  <div class="label">Pain/Difficulty While Swallowing</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms.swallowingDifficulty;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
                        return '<span class="badge badge-green">No</span>';
                      }
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Black, Sticky/Tar-Like Stools (Melena):</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.blackStool;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
                        return '<span class="badge badge-green">No</span>';
                      }
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Unintentional Weight Loss</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.weightLoss;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
                        return '<span class="badge badge-green">No</span>';
                      }
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Persistent vomiting &gt;1 week for no reason:</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.vomiting;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
                        return '<span class="badge badge-green">No</span>';
                      }
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Persistent Upper Stomach (Epigastric) Pain &gt;1 Month</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.epigastricPain;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
                        return '<span class="badge badge-green">No</span>';
                      }
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Frequency of Indigestion or heartburn</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.indigestion;
                      if (val === undefined || val === null || val === '') {
                        return '<span class="not-specified">Not specified</span>';
                      }
                      return val;
                    })()}
                  </div>
                  <div class="label">Sleep Disturbed By Pain:</div>
                  <div class="value">
                    ${(() => {
                      const val = userResponses.symptoms?.painWakesAtNight;
                      if (val === true ) {
                        return '<span class="badge badge-red">Yes</span>';
                      }
                      if (val === false ) {
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
            </section>

            ${prescribedTests.length > 0 ? `
            <!-- Third Page (only rendered if there are prescribed tests) -->
            <section class="page">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900">Recommended Cancer Screening Tests</h1>
              </header>
              <div class="content" style="page-break-before: avoid; break-before: avoid;">
                <div class="column" style="width: 100%; page-break-inside: avoid; break-inside: avoid;">
                  ${prescribedTests.map(test => {
                    const badge = (() => {
                      if (test.priority === 'high') return { bg: '#FEDED2', color: '#9B2C2C', text: 'SCHEDULE WITHIN 1 MONTH' };
                      if (test.priority === 'medium') return { bg: '#FEEBC8', color: '#7B341E', text: 'SCHEDULE WITHIN 3 MONTHS' };
                      return { bg: '#C6F6D5', color: '#22543D', text: 'SCHEDULE WITHIN 6 MONTHS' };
                    })();
                    return `
                      <div class="test-card" style="page-break-inside: avoid; break-inside: avoid;">
                        <div class="test-row">
                          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#38A169; margin-right:8px;"></span>
                          <span class="test-name">${test.name}</span>
                          <span class="test-badge" style="background-color:${badge.bg}; color:${badge.color};">${badge.text}</span>
                        </div>
                        <div class="test-info"><b>Frequency:</b> ${test.frequency}</div>
                        <div class="test-info"><b>Reason:</b> ${test.reason}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </section>
            ` : ''}
            <div class="pdf-disclaimer-divider" style="height:2px; background-color:#2B6CB0; margin:30px 0 20px 0;"></div>
            <div class="pdf-disclaimer-text" style="font-size:13pt; color:#9B2C2C; font-weight:500; text-align:center; padding:10px 0 20px 0;">
              Disclaimer: The information and test recommendations in this summary are based solely on the answers you provided. This tool does not provide a medical diagnosis or treatment advice. All suggested tests are preliminary and should be discussed and confirmed with a qualified healthcare professional. Any outputs are subject to review against your official medical records and clinical evaluation.<br><br>
              This tool is intended to support early triage, not replace clinical judgment. It helps highlight potential screening needs so you can take informed next steps with a medical professional.
            </div>
          </article>
        </body>
        </html>
      `);
      
      // Close the document for writing
      printDocument.close();
      
      // Flag to prevent multiple print dialogs
      let hasPrintBeenTriggered = false;


      
      const triggerPrint = async() => {
        if (hasPrintBeenTriggered) {
          return;
        }
        
        hasPrintBeenTriggered = true;
        
        try {

        
          const pdfBlob = await html2pdf().from(printDocument.body).outputPdf('blob');
          emailPdfToDoctor(pdfBlob);
        
          // Try to focus the iframe before printing
          if (printIframe.contentWindow) {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();

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
      
      printIframe.onload = () => {
        setTimeout(triggerPrint, 1000);
      };
      
      // Longer Delay just in the event it doesn't trigger
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
  };

  const emailPdfToDoctor = async (pdfBlob) => {
    // 1. Paste your unique Getform endpoint URL here
    const GETFORM_ENDPOINT = 'https://getform.io/f/agdjjdqb';

    // 2. Create a FormData object to send the file and data
    const formData = new FormData();
    
    // 3. Append the PDF file. Getform will handle this as an email attachment.
    formData.append(
      'screening_report_pdf', // This is the name for your file attachment
      pdfBlob, 
      `cancer_screening_${userResponses.demographics.age}_${userResponses.demographics.sex}.pdf`
    );

    // 4. Append other patient data as regular form fields for context
    formData.append('Patient Age', userResponses.demographics.age);
    formData.append('Patient Sex', userResponses.demographics.sex);
    formData.append('Timestamp', new Date().toISOString());
    formData.append('Ethnicity', userResponses.demographics.ethnicity || 'Not specified');

    try {
      // 5. Send the data using a standard fetch request
      await fetch(GETFORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json' // Recommended by Getform
        }
      });
      
      // For debugging, you can keep this. Remove when you confirm it works.
      console.log('PDF successfully sent via Getform');
    } catch (error) {
      // For debugging, you can keep this.
      console.error('Error sending PDF via Getform:', error);
    }
  };

  React.useEffect(() => {
    // Fix badges in the UI
    const fixBadges = () => {
      const badges = summaryRef.current?.querySelectorAll('.chakra-badge') || [];
      
      // Fix badge styling directly
      badges.forEach(badge => {
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
      
      // Fix box elements containing badges
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
    
    setTimeout(fixBadges, 500);
  }, []);
  
  const SummaryLine = ({ label, value }) => (
    <Flex mb={1} align="center">
      <Text fontWeight="semibold" minW="160px">{label}:</Text>
      <Text ml={2} textAlign="right" flex={1}>{value}</Text>
    </Flex>
  );

  const SectionTitle = ({ children }) => (
    <Text fontWeight="bold" fontSize="lg" mt={4} mb={2} color={accentColor}>{children}</Text>
  );

  const navyBlue = '#1A237E';

  // Navigation bar 
  return (
    <Box maxW="700px" mx="auto" my={10} borderRadius="2xl" boxShadow="2xl" bg="white" overflow="hidden">
      <Flex as="nav" align="center" bg={navyBlue} px={6} py={3} borderTopRadius="2xl" borderBottomRadius="none" boxShadow="md">
        {/* Home button*/}
        <Button
          leftIcon={<FaHome />}
          variant="ghost"
          color="white"
          fontWeight="bold"
          fontSize="md"
          display="flex"
          onClick={() => window.location.href = '/'}
          _hover={{ bg: 'rgba(255,255,255,0.08)' }}
          _active={{ bg: 'rgba(255,255,255,0.16)' }}
        >
          Home
        </Button>
        <Spacer />
        {/* Download PDF */}
        <Button
          leftIcon={<FaPrint />}
          bg="white"
          color={navyBlue}
          borderWidth={2}
          borderColor={navyBlue}
          fontWeight="bold"
          fontSize="md"
          px={6}
          borderRadius="md"
          boxShadow="md"
          _hover={{ bg: navyBlue, color: 'white' }}
          _active={{ bg: '#0D133D', color: 'white' }}
          onClick={printSummary}
        >
          Download PDF
        </Button>
      </Flex>
      <Box ref={summaryRef} p={6} bg="white" borderBottomRadius="2xl" borderTopRadius="none" boxShadow="none" width="100%" overflow="visible">
      {/* PDF-style header */}
      <Box as="header" textAlign="center" mb={6} borderBottom="3px solid" borderColor={accentColor} pb={3}>
        <Text fontWeight="900" fontSize="2xl" color={accentColor} letterSpacing="-0.5px">Sky Premium Hospital</Text>
        <Text fontWeight="500" fontSize="lg" color="gray.700" mt={1}>Cancer Screening Report</Text>
      </Box>
      {/* PDF-style summary: each field on its own line, label and value side by side */}
      <Box mb={6}>
        <SectionTitle>Personal Information</SectionTitle>
        <SummaryLine label="Age" value={userResponses.demographics.age || 'Not specified'} />
        <SummaryLine label="Sex" value={userResponses.demographics.sex || 'Not specified'} />
        <SummaryLine label="Ethnicity" value={userResponses.demographics.ethnicity || 'Not specified'} />
        <SummaryLine label="Location" value={userResponses.demographics.country || 'Not specified'} />
        <SummaryLine label="Risk" value={getHealthCategory(calculateRiskScore()).category} />
      </Box>
      <Box mb={6}>
        <SectionTitle>Medical History</SectionTitle>
        <SummaryLine label="Personal Cancer" value={userResponses.medicalHistory.personalCancer.diagnosed ? (userResponses.medicalHistory.personalCancer.type ? `${userResponses.medicalHistory.personalCancer.type}${userResponses.medicalHistory.personalCancer.ageAtDiagnosis ? ` (Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})` : ''}` : 'Yes') : 'No'} />
        <SummaryLine label="Family Cancer" value={userResponses.medicalHistory.familyCancer.diagnosed ? (userResponses.medicalHistory.familyCancer.type ? `${userResponses.medicalHistory.familyCancer.type}${userResponses.medicalHistory.familyCancer.relation ? ` in ${userResponses.medicalHistory.familyCancer.relation}` : ''}${userResponses.medicalHistory.familyCancer.ageAtDiagnosis ? ` (Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})` : ''}` : 'Yes') : 'No'} />
        <SummaryLine label="Chronic Conditions" value={userResponses.medicalHistory.chronicConditions.length > 0 ? userResponses.medicalHistory.chronicConditions.join(', ') : 'None'} />
        <SummaryLine label="History of Kidney cyst, Tumor, or Blood in Urine" value={
          typeof userResponses.medicalHistory.kidneyIssue === 'boolean'
            ? (userResponses.medicalHistory.kidneyIssue ? 'Yes' : 'No')
            : 'Not specified'
        } />
        <SummaryLine label="History of Brain, Spinal, or Eye Tumor" value={
          typeof userResponses.medicalHistory.brainSpinalEyeTumor === 'boolean'
            ? (userResponses.medicalHistory.brainSpinalEyeTumor ? 'Yes' : 'No')
            : 'Not specified'
        } />
      </Box>
      <Box mb={6}>
        <SectionTitle>Lifestyle</SectionTitle>
        <SummaryLine label="Smoking (Pack-Years)" value={userResponses.lifestyle.smoking.packYears || "N/A"}  />
        <SummaryLine label="Alcohol Consumption" value={userResponses.lifestyle.alcohol?.consumes ? `Yes (${userResponses.lifestyle.alcohol.drinksPerWeek || 0} drinks/week)` : 'No'} />
        <SummaryLine label="Salty/Smoked Foods" value={userResponses.lifestyle.saltySmokedFoods || 'Not specified'} />
        <SummaryLine label="Fruits & Veg (servings)" value={userResponses.lifestyle.fruitVegServings || 'Not specified'} />
        <SummaryLine label="Sexual Health Risk" value={userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv ? 'High Risk' : 'Standard Risk'} />
        <SummaryLine label="Organ Transplant" value={userResponses.lifestyle.transplant ? 'Yes' : 'No'} />
      </Box>
      {/* Gender-specific section */}
      {userResponses.demographics.sex === 'Male' ? (
        <Box mb={6}>
          <SectionTitle>Male-Specific Screening</SectionTitle>
          <SummaryLine label="Urinary Symptoms" value={userResponses.sexSpecificInfo?.male?.urinarySymptoms ? 'Yes' : 'No'} />
          <SummaryLine label="Prostate Test" value={userResponses.sexSpecificInfo?.male?.prostateTest?.had ? `Yes${userResponses.sexSpecificInfo.male.prostateTest.ageAtLast ? ` (Age ${userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})` : ''}` : (userResponses.demographics.age < 30 ? 'N/A (Not recommended under 30)' : 'No')} />
          <SummaryLine label="Testicular Issues" value={userResponses.sexSpecificInfo?.male?.testicularIssues ? 'Yes' : 'No'} />
        </Box>
      ) : userResponses.demographics.sex === 'Female' ? (
        <Box mb={6}>
          <SectionTitle>Female-Specific Screening</SectionTitle>
          <SummaryLine label="First Period Age" value={userResponses.sexSpecificInfo?.female?.menarcheAge || 'Not specified'} />
          <SummaryLine label="Currently Pregnant" value={userResponses.sexSpecificInfo?.female.currentPregnancy ? 'Yes' : 'No'} />
          <SummaryLine label="Menstruation Status" value={userResponses.sexSpecificInfo?.female?.menstruationStatus || 'Not specified'} />
          <SummaryLine label="Last Period Age" value={userResponses.sexSpecificInfo?.female?.menopauseAge || 'N/A'} />
          <SummaryLine label="Pregnancy History" value={userResponses.sexSpecificInfo?.female?.pregnancy?.hadPregnancy ? `Yes${userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst ? ` (First at age ${userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst})` : ''}` : 'None'} />
          <SummaryLine label="Births at/after 24 weeks" value={userResponses.sexSpecificInfo?.female?.numberOfBirths !== undefined && userResponses.sexSpecificInfo.female.numberOfBirths !== null && userResponses.sexSpecificInfo.female.numberOfBirths !== '' ? userResponses.sexSpecificInfo.female.numberOfBirths : 'N/A'} />
          <SummaryLine label="Oral contraceptive" value={userResponses.sexSpecificInfo?.female?.pillYears !== undefined && userResponses.sexSpecificInfo.female.pillYears !== null && userResponses.sexSpecificInfo.female.pillYears !== '' ? userResponses.sexSpecificInfo.female.pillYears : 'N/A'} />
          <SummaryLine label="Hormone Replacement Therapy" value={userResponses.sexSpecificInfo?.female?.hormoneReplacementTherapy ? 'Yes' : 'No'} />
          <SummaryLine label="Tubal ligation" value={userResponses.sexSpecificInfo?.female?.tubalLigation === true ? 'Yes' : 'No'} />
          <SummaryLine label="Ovary Removal" value={userResponses.sexSpecificInfo?.female?.ovaryRemoved !== undefined && userResponses.sexSpecificInfo.female.ovaryRemoved !== null && userResponses.sexSpecificInfo.female.ovaryRemoved !== '' ? userResponses.sexSpecificInfo.female.ovaryRemoved : 'Not specified'} />
          <SummaryLine label="Endometriosis diagnosis" value={userResponses.medicalHistory?.endometriosis === true ? 'Yes' : 'No'} />
          <SummaryLine label="IVF Drugs" value={(() => {
            const val = userResponses.sexSpecificInfo?.female?.IVF_history;
            if (val === undefined) 
              return 'Not specified';
            if (val === true ) 
              return 'Yes';
            if (val === false ) 
              return 'No';
            return val;
          })()} />
        </Box>
      ) : null}
      {/* Genetic & Infection Risk section */}
      <Box mb={6}>
        <SectionTitle>Genetic & Infection Risk</SectionTitle>
        <SummaryLine label="BRCA1/BRCA2 mutation" value={
          userResponses.medicalHistory?.brcaMutationStatus !== undefined && userResponses.medicalHistory?.brcaMutationStatus !== null && userResponses.medicalHistory?.brcaMutationStatus !== ''
            ? (userResponses.medicalHistory.brcaMutationStatus === 'Yes' ? 'Yes' : 'No')
            : 'Not specified'
        } />
        <SummaryLine label="H.pylori history" value={
          userResponses.lifestyle?.hPylori === 'Yes' ? 'Yes'
            : userResponses.lifestyle?.hPylori === 'No' ? 'No'
            : 'Not specified'
        } />
        <SummaryLine label="Eradication Therapy" value={
          userResponses.lifestyle?.hPylori === 'No'
            ? 'N/A'
            : userResponses.lifestyle?.hPyloriEradication === 'Yes'
              ? 'Yes'
              : userResponses.lifestyle?.hPyloriEradication === 'No'
                ? 'No'
                : 'Not specified'
        } />
        <SummaryLine label="Gastritis (chronic) / Ulcers" value={
          userResponses.lifestyle?.gastritisUlcer === 'Yes' ? 'Yes'
            : userResponses.lifestyle?.gastritisUlcer === 'No' ? 'No'
            : 'Not specified'
        } />
        <SummaryLine label="Suspicion of Von Hippel-Lindau (VHL) Syndrome" value=
        {vhlSuspicion 
        } />
      </Box>
      {/* Gastrointestinal Surgery section */}
      <Box mb={6}>
        <SectionTitle>Gastrointestinal Surgery</SectionTitle>
        <SummaryLine label="Partial Gastrectomy" value={
          (userResponses.surgery.partialGastrectomy ? 'Yes' : 'No')  
        } />
        <SummaryLine label="Pernicious Anemia" value={
          (userResponses.medicalHistory.perniciousAnemia ? 'Yes' : 'No')
        } />
        <SummaryLine label="CDH1/Gene Mutation" value={
          (userResponses.medicalHistory.gastricGeneMutation ? 'Yes' : 'No')   
        } />
      </Box>
      <Box mb={6}>
        <SectionTitle>Medications & Allergies</SectionTitle>
        <SummaryLine label="Current Medications" value={Array.isArray(userResponses.medications) && userResponses.medications.length > 0 ? userResponses.medications.join(', ') : 'None reported'} />
        <SummaryLine label="Known Allergies" value={userResponses.allergies && userResponses.allergies !== 'None' ? userResponses.allergies : 'None reported'} />
      </Box>
    {/* Symptom Screening section */}
    {userResponses.demographics.sex === 'Female' && userResponses.symptoms?.goffSymptomIndex ? (
      <Box mb={6}>
        <SectionTitle>Ovarian Cancer Symptom Screening (Goff Criteria)</SectionTitle>
        <SummaryLine label="Persistent Bloating or Abdominal Swelling" value={
          userResponses.symptoms.goffSymptomIndex.bloating === true ? 'Yes' : 'No'
        } />
        <SummaryLine label="Pelvic or Lower-Abdominal Pain" value={
          userResponses.symptoms.goffSymptomIndex.pain === true ? 'Yes' : 'No'

        } />
        <SummaryLine label="Felt Full Quickly or Been Unable to Finish Meals" value={
          userResponses.symptoms.goffSymptomIndex.fullness === true ? 'Yes' : 'No'
        } />
        <SummaryLine label="Frequent Need To Pass Urine" value={
          userResponses.symptoms.goffSymptomIndex.urinary === true ? 'Yes' : 'No'
        } />
        <SummaryLine label="An Increase in abdomen size or clothes have become tight" value={
          userResponses.symptoms.goffSymptomIndex.abdomenSize === true ? 'Yes' : 'No'
        } />
      </Box>
    ) : null}
    <Box mb={6}>
      <SectionTitle>Symptom Screening</SectionTitle>
      <SummaryLine label="Pain/Difficulty While Swallowing" value={
        userResponses.symptoms?.swallowingDifficulty === true  ? 'Yes' : 'No'
      } />
      <SummaryLine label="Black, Sticky/Tar-Like Stools (Melena)" value={
        userResponses.symptoms?.blackStool === true  ? 'Yes' : 'No'
      } />
      <SummaryLine label="Unintentional Weight Loss" value={
        userResponses.symptoms?.weightLoss === true ? 'Yes' : 'No' 
      } />
      <SummaryLine label="Persistent vomiting >1 week for no reason" value={
        userResponses.symptoms?.vomiting === true ? 'Yes' : 'No'
      } />
      <SummaryLine label="Persistent Upper Stomach (Epigastric) Pain >1 Month" value={
        userResponses.symptoms?.epigastricPain === true ? 'Yes' : 'No'
      } />
      <SummaryLine label="Frequency of Indigestion or heartburn" value={
         userResponses.symptoms.indigestion || 'N/A'
      } />
      <SummaryLine label="Sleep Disturbed By Pain" value={
        userResponses.symptoms?.painWakesAtNight === true ? 'Yes' : 'No'
      } />
    </Box>
      {/* Recommended Cancer Screening Tests section */}
      {prescribedTests && prescribedTests.length > 0 && (
        <Box mb={6}>
          <SectionTitle>Recommended Cancer Screening Tests</SectionTitle>
          {prescribedTests.map((test, idx) => (
            <Box key={idx} mb={3} p={3} borderWidth={1} borderRadius="md" borderColor="gray.200" bg="gray.50">
              <Flex align="center" mb={1}>
                <Text fontWeight="bold" fontSize="md" mr={2}>{test.name}</Text>
                <Box as="span" px={2} py={0.5} borderRadius="md" fontSize="sm" fontWeight="bold" color={
                  test.priority === 'high' ? '#9B2C2C' : test.priority === 'medium' ? '#7B341E' : '#22543D'
                } bg={
                  test.priority === 'high' ? '#FEDED2' : test.priority === 'medium' ? '#FEEBC8' : '#C6F6D5'
                } ml={2}>
                  {test.priority === 'high' ? 'SCHEDULE WITHIN 1 MONTH' : test.priority === 'medium' ? 'SCHEDULE WITHIN 3 MONTHS' : 'SCHEDULE WITHIN 6 MONTHS'}
                </Box>
              </Flex>
              <Text fontSize="sm" color="gray.700" mb={1}><b>Frequency:</b> {test.frequency}</Text>
              <Text fontSize="sm" color="gray.700"><b>Reason:</b> {test.reason}</Text>
            </Box>
          ))}
        </Box>
      )}
      </Box>
    </Box>
  );
};

export default SummaryComponent;
