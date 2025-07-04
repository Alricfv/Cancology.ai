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
      if (userResponses.sexSpecificInfo.female.hormoneTreatment) riskScore += 1;
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
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = 'none';
      
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
        <div class="grid">
          <div class="label">Age:</div>
          <div class="value"><strong>${userResponses.demographics.age}</strong></div>
          
          <div class="label">Sex:</div>
          <div class="value"><strong>${userResponses.demographics.sex}</strong></div>
          
          <div class="label">Ethnicity:</div>
          <div class="value">${userResponses.demographics.ethnicity || 'Not specified'}</div>
          
          <div class="label">Location:</div>
          <div class="value">${userResponses.demographics.country || 'Not specified'}</div>
        </div>
      `;
      
      const medicalHistory = `
        <div class="section-title">Medical History</div>
        <div class="grid">
          <div class="label">Personal Cancer:</div>
          <div class="value">
            ${formatBadge(userResponses.medicalHistory.personalCancer.diagnosed, 'Yes', 'No', 'red', 'green')}
            ${userResponses.medicalHistory.personalCancer.diagnosed ? 
              `<span style="margin-left:5px;">${userResponses.medicalHistory.personalCancer.type || "Cancer type"}
              ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis ? 
                `<span style="font-style:italic;">(Age ${userResponses.medicalHistory.personalCancer.ageAtDiagnosis})</span>` : ''}
              </span>` : ''}
          </div>
          
          <div class="label">Family Cancer:</div>
          <div class="value">
            ${formatBadge(userResponses.medicalHistory.familyCancer.diagnosed, 'Yes', 'No', 'red', 'green')}
            ${userResponses.medicalHistory.familyCancer.diagnosed && userResponses.medicalHistory.familyCancer.type ? 
              `<span style="margin-left:5px;">${userResponses.medicalHistory.familyCancer.type}
              ${userResponses.medicalHistory.familyCancer.relation ? ` <span style="font-weight:bold;">in ${userResponses.medicalHistory.familyCancer.relation}</span>` : ''}
              ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis ? 
                `<span style="font-style:italic;">(Age ${userResponses.medicalHistory.familyCancer.ageAtDiagnosis})</span>` : ''}
              </span>` : ''}
          </div>
          
          <div class="label">Chronic Conditions:</div>
          <div class="value">
            ${userResponses.medicalHistory.chronicConditions.length > 0 ? 
              `<span style="font-weight:500;">${userResponses.medicalHistory.chronicConditions.join(', ')}</span>` : 
              '<span style="color:#38A169;">None</span>'}
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
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.male.prostateTest.had, 'YES', 'NO', 'green', 'yellow')}
              ${userResponses.sexSpecificInfo.male.prostateTest.had ? 
                `(Age ${userResponses.sexSpecificInfo.male.prostateTest.ageAtLast})` : 
                userResponses.demographics.age < 30 ? 
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
            
            <div class="label">Menstruation Status:</div>
            <div class="value">${userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}</div>
            
            <div class="label">Pregnancy History:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy, 'YES', 'NO', 'blue', 'gray')}
              ${userResponses.sexSpecificInfo.female.pregnancy.hadPregnancy ? 
                `(First at age ${userResponses.sexSpecificInfo.female.pregnancy.ageAtFirst || 'N/A'})` : ''}
            </div>
            
            <div class="label">Hormone Treatment:</div>
            <div class="value">
              ${formatBadge(userResponses.sexSpecificInfo.female.hormoneTreatment, 'YES', 'NO', 'purple', 'gray')}
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
            @page {
              size: A4 portrait;
              margin: 10mm;
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
              margin-bottom: 40mm;
            }
            
            @media print {
              .page {
                box-shadow: none;
                margin: 0;
                padding: 0;
                border-radius: 0;
                page-break-inside: avoid;
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
              font-size: 26pt;
              margin: 0;
              font-weight: 600;
              letter-spacing: -0.5px;
            }
            
            .header h2 {
              font-size: 18pt;
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
              font-size: 16pt;
              color: #2B6CB0;
              padding-bottom: 6px;
              margin-bottom: 12px;
              margin-top: 18px;
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
              font-weight: bold;
              font-size: 14pt;
              color: #4A5568;
              text-align: left;
              vertical-align: top;
            }
            
            .value {
              font-size: 14pt;
              margin-bottom: 8px;
              padding-left: 0;
              color: #2D3748;
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
              gap: 10px;
              align-items: flex-start;
              width: 100%;
              margin-bottom: 15px;
              background-color: white;
              border-bottom: 1px solid #E2E8F0;
              padding: 5px 0;
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
              font-size: 13pt;
              color: #9B2C2C;
              background-color: #FEDED2;
              font-weight: bold;
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
          <article>
            <!-- First Page -->
            <section class="page">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900;">Sky Premium Hospital</h1>
                <h2>Cancer Screening Test</h2>
              </header>
              
              <div class="content">
                <div class="column">
                  ${personalInfo}
                  ${medicalHistory}
                  ${lifestyleFactors}
                </div>
                
                <div class="column">
                  ${medicationsAllergies}
                  ${sexSpecificInfo}
                  ${vaccinationsScreening}
                  
                  <!-- Risk Assessment - Moved to first page -->
                  <div class="section-title">Health Risk Assessment</div>
                  <div class="risk-assessment">
                    <div class="grid" style="grid-template-columns: 120px 1fr;">
                      <div class="label">Risk Level:</div>
                      <div class="value">
                        <span class="risk-badge badge-${riskColor}" style="white-space: nowrap; display: inline-block; min-width: 90px; text-align: center;">${riskLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            ${prescribedTests.length > 0 ? `
            <!-- Second Page (only rendered if there are prescribed tests) -->
            <section class="page" style="margin-top: 50px;">
              <header class="header" style="border-bottom: 3px solid #2B6CB0; padding-bottom: 15px;">
                <h1 style="font-weight:900">Recommended Cancer Screening Tests</h1>
              </header>
              
              <div class="content">
                <div class="column" style="width: 100%;">
                  ${prescribedTests.map(test => `
                    <div class="test-card">
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
      printIframe.onload = () => setTimeout(triggerPrint, 500);
      
      // Fallback in case onload doesn't fire, but with a longer delay
      // This prevents racing with the onload handler
      setTimeout(triggerPrint, 1500);

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

        <Heading size="lg" color="#2B6CB0" fontSize="26pt">Sky Premium Hospital</Heading>
        <Heading size="md" mt={2} fontSize="18pt" color="gray.700">Cancer Screening Test</Heading>
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
              <Heading size="sm" mb={3} pb={1} fontSize="14pt" color="#2B6CB0" fontWeight="bold">
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
                    Hormone Treatment:
                  </Text>                
                  <Box display="flex" alignItems="center">
                    <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hormoneTreatment ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                      {userResponses.sexSpecificInfo.female.hormoneTreatment ? "YES" : "NO"}
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
                <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
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
              <Heading size="md" color="#2B6CB0" fontSize="18pt">Cancer Screening Tests</Heading>
              <Text mt={2} fontSize="12pt" color="gray.700">Recommended Screenings Based on Risk Assessment</Text>
            </Box>
            
            {/* Recommended Tests Section */}
            <Box mb={6} className="tests-container">
              <Heading size="sm" mb={4} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="14pt" color={accentColor}>
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
                        <Heading size="sm" fontSize="16pt" color="gray.800">{test.name}</Heading>
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
