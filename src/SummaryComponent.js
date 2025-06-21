import React, { useRef } from 'react';
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
import { FaCheckCircle, FaPrint } from 'react-icons/fa';
import { getPrescribedTests } from './testPrescription';

// Create a SummaryComponent to show at the end
const SummaryComponent = ({ userResponses, handleOptionSelect }) => {
  const toast = useToast();
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const summaryRef = useRef(null);
  
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
      if (!userResponses.sexSpecificInfo.female.hpvVaccine && userResponses.demographics.age < 45) riskScore += 1;
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
    
    // Get prescribed tests from testPrescription.js
    const prescribedTests = getPrescribedTests(userResponses);    // Add cancer screening recommendations from prescribed tests
    prescribedTests.forEach(test => {
      if (test.type === "cervical" || test.type === "breast" || test.type === "colorectal" || test.type === "prostate" || test.type === "lung" || test.type === "skin" || test.type === "oral" || test.type === "liver") {
        recommendations.push(`${test.name} (${test.frequency})`);
      }
    });
    
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
  
  // Function to generate and download PDF from the summary
  const generatePDF = async () => {
    if (!summaryRef.current) return;
    
    // Show loading toast
    toast({
      title: "Preparing PDF",
      description: "Please wait while we generate your summary...",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
    
    try {
      // Create PDF document - A4 size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // 10mm margin
      const contentWidth = pageWidth - (2 * margin);
      const contentHeight = pageHeight - (2 * margin);
      
      // Prepare the document for optimal PDF rendering - pre-processing step
      const prepareForPDFRendering = () => {
        // Clone the node to avoid modifying the original
        const pdfContent = summaryRef.current.cloneNode(true);
        document.body.appendChild(pdfContent);
        
        // Hide buttons in the PDF
        const buttons = pdfContent.querySelectorAll('button');
        buttons.forEach(button => {
          button.style.display = 'none';
        });
        
        // Fix badge display
        const badges = pdfContent.querySelectorAll('.chakra-badge');
        badges.forEach(badge => {
          badge.style.display = 'inline-flex';
          badge.style.alignItems = 'center';
          badge.style.justifyContent = 'center';
          badge.style.height = '18px';
          badge.style.lineHeight = '1';
          badge.style.position = 'relative';
          badge.style.verticalAlign = 'middle';
        });
        
        // Style adjustments for PDF generation
        pdfContent.style.width = `${contentWidth}mm`;
        pdfContent.style.height = 'auto';
        pdfContent.style.padding = '10mm';
        pdfContent.style.position = 'absolute';
        pdfContent.style.left = '-9999px';
        pdfContent.style.top = '0';
        pdfContent.style.overflow = 'visible';
        pdfContent.style.backgroundColor = '#ffffff';
        pdfContent.style.fontSize = '10pt';
        
        return pdfContent;
      };
      
      // Add professional footer text to the PDF
      const addFooter = (pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          
          // Current date
          const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          
          // Add footer text - more professional layout
          const footerText = `Cancer Screening Test Summary | For medical reference only | ${currentDate}`;
          const pageNumberText = `Page ${i} of ${totalPages}`;
          const generatedText = "Generated with Dr. Frempong's Cancer Screening Tool";
          
          // Position footer elements
          pdf.text(footerText, margin, pageHeight - 7);
          pdf.text(pageNumberText, pageWidth - margin - pdf.getTextWidth(pageNumberText), pageHeight - 7);
          pdf.text(generatedText, margin, pageHeight - 4);
          
          // Add horizontal line above footer
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
        }
      };
      
      // Prepare content for PDF rendering
      const pdfContent = prepareForPDFRendering();
      
      // Generate canvas with optimized settings
      const canvas = await html2canvas(pdfContent, {
        scale: 2, // Higher scale for better quality
        useCORS: true, 
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight,
        onclone: (clonedDoc) => {
          // Additional fixes in the cloned document
          const clonedBadges = clonedDoc.querySelectorAll('.chakra-badge');
          clonedBadges.forEach(badge => {
            badge.style.display = 'inline-flex';
            badge.style.alignItems = 'center';
          });
        }
      });
      
      // Remove the temporary element
      if (pdfContent.parentNode) {
        pdfContent.parentNode.removeChild(pdfContent);
      }
      
      // Calculate dimensions to maintain aspect ratio
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page content with improved positioning
      const pagesNeeded = Math.ceil(imgHeight / contentHeight);
      
      // For proper multi-page handling
      if (pagesNeeded > 1) {
        // First page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, Math.min(imgHeight, contentHeight));
        
        // Add additional pages if needed
        for (let i = 1; i < pagesNeeded; i++) {
          pdf.addPage();
          // Calculate position to show next slice of the image
          const sourceY = contentHeight * i;
          const sourceHeight = Math.min(contentHeight, imgHeight - sourceY);
          
          pdf.addImage(
            imgData, 
            'PNG', 
            margin, // x position
            margin, // y position on new page
            imgWidth, // width
            sourceHeight, // height of this slice
            null, // alias
            'FAST', // compression
            -sourceY // vertical offset to show correct portion
          );
        }
      } else {
        // Single page - simpler case
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }
      
      // Add footer with page numbers to all pages
      addFooter(pdf);
      
      // Save the PDF with date in filename
      const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const fileName = `Medical_Screening_Summary_${formattedDate}.pdf`;
      pdf.save(fileName);
      
      // Success message
      toast({
        title: "Download complete",
        description: "Your medical summary has been downloaded as a PDF",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download failed",
        description: "There was an issue creating your PDF. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  };  // Function to print the summary using browser's print API
  const printSummary = () => {
    // Show loading toast
    toast({
      title: "Preparing for printing",
      description: "Setting up your summary for printing...",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top-right"
    });
    
    try {
      // Import print styles
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = '/printStyles.css'; // Make sure this path is correct
      linkElement.id = 'print-styles';
      document.head.appendChild(linkElement);
      
      // Add print class to the summary
      if (summaryRef.current) {
        summaryRef.current.classList.add('print-section');
        
        // Hide action buttons temporarily
        const actionButtons = summaryRef.current.querySelectorAll('button');
        actionButtons.forEach(button => {
          button.classList.add('no-print');
        });
        
        // Wait a moment for styles to apply
        setTimeout(() => {
          // Trigger browser print
          window.print();
          
          // Clean up after printing dialog closes
          setTimeout(() => {
            // Remove print class
            summaryRef.current.classList.remove('print-section');
            
            // Remove temporary style
            const styleElement = document.getElementById('print-styles');
            if (styleElement) {
              styleElement.remove();
            }
            
            // Restore action buttons
            actionButtons.forEach(button => {
              button.classList.remove('no-print');
            });
            
            toast({
              title: "Print prepared",
              description: "Your summary is ready for printing",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right"
            });
          }, 1000);
        }, 500);
      }
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
  // Apply styling and prepare for optimal PDF generation
  React.useEffect(() => {
    // Apply style to body to remove scrollbars and set proper container
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.height = 'auto';
    
    if (document.getElementById('root')) {
      document.getElementById('root').style.overflowX = 'hidden';
      document.getElementById('root').style.width = '100vw';
      document.getElementById('root').style.position = 'relative';
    }
      // Add print-specific CSS and badge fixes for PDF generation
    const style = document.createElement('style');
    style.id = 'pdf-print-style';
    style.textContent = `
      @media print {
        body, html {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }
        
        .a4-page {
          page-break-after: always;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .chakra-badge {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          vertical-align: middle !important;
          height: 18px !important;
          line-height: 1 !important;
          white-space: nowrap !important;
          position: relative !important;
        }
        
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
      }
      
      /* Fix badge alignment in HTML rendered view */
      .chakra-badge {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        height: 18px !important;
        white-space: nowrap !important;
      }
    `;
    document.head.appendChild(style);
      // Prepare for PDF generation by fixing badge and image elements
    const prepareForPDF = () => {
      const images = summaryRef.current?.querySelectorAll('img') || [];
      const badges = summaryRef.current?.querySelectorAll('.chakra-badge') || [];
      const boxContainers = summaryRef.current?.querySelectorAll('box') || [];
      
      // Ensure all images have crossOrigin attribute set and are loaded
      images.forEach(img => {
        if (img.src && !img.src.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
          img.loading = 'eager'; // Force eager loading
        }
      });
      
      // Fix badge styling directly for better PDF rendering
      badges.forEach(badge => {
        // Apply critical styles directly to badge elements
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.verticalAlign = 'middle';
        badge.style.height = '18px';
        badge.style.lineHeight = '1';
        badge.style.maxWidth = '100%';
        badge.style.overflow = 'hidden';
        badge.style.textOverflow = 'ellipsis';
        badge.style.whiteSpace = 'nowrap';
        badge.style.position = 'relative';
      });
      
      // Fix ALL box elements to properly align content
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
    
    // Wait for component to render fully before applying PDF-specific styles
    setTimeout(prepareForPDF, 500);
    
    // Cleanup function to restore original styles when component unmounts
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.documentElement.style.height = '';
      
      if (document.getElementById('root')) {
        document.getElementById('root').style.overflowX = '';
        document.getElementById('root').style.width = '';
        document.getElementById('root').style.position = '';
      }
      
      const styleElement = document.getElementById('pdf-print-style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);return (
    <Box 
      width="210mm" 
      minHeight="297mm" 
      mx="auto" 
      p={5} 
      bg="white" 
      boxShadow="md" 
      borderRadius="sm"
      mt={0} 
      ref={summaryRef}
      className="a4-page"
      sx={{
        // A4 proportions and styling
        aspectRatio: '1 / 1.414',  // A4 aspect ratio
        pageBreakAfter: 'always',
        position: 'relative',
        overflow: 'hidden',
        '@media print': {
          margin: 0,
          padding: '10mm 15mm',
          boxShadow: 'none',
          fontSize: '11pt',
          breakInside: 'avoid-page',
          breakBefore: 'page'
        }
      }}
    >{/* Main title */}      
      <Box 
        textAlign="center" 
        mb={4} 
        width="100%"
        borderBottom="2px solid"
        borderColor={accentColor}
        pb={3}
      >
        <Heading size="lg" color={accentColor} fontSize="22pt">Cancer Screening Test</Heading>
        <Heading size="md" mt={1} fontSize="16pt">Summary Report</Heading>
        <Text fontSize="10pt" color="gray.500" mt={1}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </Box>
        {/* Two-column layout with central divider - optimized for A4 */}
      <Flex 
        direction="row" 
        width="100%" 
        justifyContent="space-between" 
        mb={3} 
        overflowX="hidden"
        fontSize="10pt" 
      >
        {/* Left column */}        
        <Box width="48%" pr={3}>
          {/* Demographics section */}
          <Box mb={3}>            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Personal Information
            </Heading>            <Grid templateColumns="repeat(2, 1fr)" gap={2} width="100%">
              <GridItem>
                <Text fontWeight="medium" fontSize="10pt">
                  Age:
                </Text>
                <Text fontSize="10pt">
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
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Personal Cancer:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">
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
              </Box>              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
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
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Smoking Status:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.smoking.current ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Current Smoker</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Non-Smoker</Badge>}
                {userResponses.lifestyle.smoking.current && 
                  <Text as="span" ml={2} fontSize="9pt">
                    ({userResponses.lifestyle.smoking.packYears} pack-years)
                  </Text>}
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Alcohol Consumption:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.alcohol?.consumes ? 
                  <Badge colorScheme={userResponses.lifestyle.alcohol.drinksPerWeek > 14 ? "red" : userResponses.lifestyle.alcohol.drinksPerWeek > 7 ? "orange" : "yellow"} ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">
                    Yes ({userResponses.lifestyle.alcohol.drinksPerWeek} drinks/week)
                  </Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">No</Badge>}
              </Box><Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Sexual Health Risk:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
                {userResponses.lifestyle.sexualHealth?.unprotectedSexOrHpvHiv ? 
                  <Badge colorScheme="red" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">High Risk</Badge> : 
                  <Badge colorScheme="green" ml={1} fontSize="8pt" display="inline-flex" alignItems="center" height="18px">Standard Risk</Badge>}
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Organ Transplant:
              </Text>              <Box display="flex" alignItems="center" flexWrap="wrap">                
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
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} width="100%">              
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
        </Box>        {/* Center divider */}
        <Divider orientation="vertical" height="auto" mx={2} />
        
        {/* Right column */}
        <Box width="48%" pl={3}>          {/* Gender-specific Information */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              {userResponses.demographics.sex === "Male" ? "Male" : "Female"}-Specific Screening
            </Heading>
              {userResponses.demographics.sex === "Male" && (
              <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Urinary Symptoms:
                </Text>                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.male.urinarySymptoms ? "orange" : "green"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.male.urinarySymptoms ? "YES" : "NO"}
                  </Badge>
                </Box>
                  <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Prostate Test:
                </Text>                <Box display="flex" alignItems="center" flexWrap="wrap">
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
                </Text>                <Box display="flex" alignItems="center">
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
                </Text>                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Menstruation Status:
                </Text>
                <Text fontSize="9pt">
                  {userResponses.sexSpecificInfo.female.menstruationStatus || 'Not specified'}
                </Text>
                
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  Pregnancy History:
                </Text>                <Box display="flex" alignItems="center" flexWrap="wrap">
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
                </Text>                <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hormoneTreatment ? "purple" : "gray"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.female.hormoneTreatment ? "YES" : "NO"}
                  </Badge>
                </Box>
                
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                  HPV Vaccine:
                </Text>                  <Box display="flex" alignItems="center">
                  <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.sexSpecificInfo.female.hpvVaccine ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                    {userResponses.sexSpecificInfo.female.hpvVaccine ? "YES" : "NO"}
                  </Badge>
                </Box>
              </Grid>
            )}
          </Box>          {/* Vaccination and Screening History */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Vaccinations & Screening History
            </Heading>            <Grid templateColumns="auto minmax(0, 1fr)" gap={2} alignItems="center" width="100%">
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                HPV Vaccine:
              </Text>              <Box display="flex" alignItems="center">
                <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hpv ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                  {userResponses.vaccinations.hpv ? "YES" : "NO"}
                </Badge>
              </Box>
              
              <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Hepatitis B Vaccine:
              </Text>              <Box display="flex" alignItems="center">
                <Badge maxW="100%" fontSize="8pt" colorScheme={userResponses.vaccinations.hepB ? "green" : "yellow"} display="inline-flex" alignItems="center" height="18px">
                  {userResponses.vaccinations.hepB ? "YES" : "NO"}
                </Badge>
              </Box>
                <Text fontWeight="medium" whiteSpace="nowrap" fontSize="10pt">
                Cancer Screening History:
              </Text>              <Box>
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
          </Box>          {/* Risk Assessment */}
          <Box mb={3}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Health Risk Assessment
            </Heading>            <Flex justify="space-between" align="center" mb={2}>
              <Box>
                <Text fontWeight="medium" fontSize="10pt">
                  Risk Level:
                </Text>                <Badge 
                  colorScheme={healthStatus.color} 
                  fontSize="9pt"
                  py={1} 
                  px={2}
                  display="inline-flex"
                  alignItems="center"
                  borderRadius="md">
                  {healthStatus.category}
                </Badge>
              </Box>
              
              <Box textAlign="right">
                <Text fontWeight="medium" fontSize="10pt">
                  Age Group:
                </Text>
                <Text fontSize="9pt">
                  {userResponses.demographics.age < 18 ? 'Pediatric' : 
                    userResponses.demographics.age < 36 ? 'Young Adult' : 
                    userResponses.demographics.age < 56 ? 'Middle-Aged' : 
                    userResponses.demographics.age < 76 ? 'Senior' : 'Elderly'}
                </Text>
              </Box>
            </Flex>
          </Box>
            {/* Recommendations */}
          <Box mb={2}>
            <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor}>
              Recommended Cancer Screening Tests
            </Heading>            <List spacing={1}>
              {getPrescribedTests(userResponses).map((test, index) => (
                <ListItem key={`test-${index}`} display="flex" alignItems="flex-start" mb={2}>
                  <ListIcon as={FaCheckCircle} color="green.500" mt={1} flexShrink={0} fontSize="9pt" />
                  <Box>
                    <Text fontWeight="semibold" fontSize="10pt">{test.name}</Text>
                    <Text fontSize="8pt" color="gray.600">Frequency: {test.frequency}</Text>
                    <Text fontSize="8pt" color="gray.600">{test.reason}</Text>                    <Badge colorScheme={test.priority === "high" ? "red" : test.priority === "medium" ? "orange" : "green"} 
                           fontSize="7pt" mt={1} display="inline-flex" alignItems="center" height="16px">
                      {test.urgency}
                    </Badge>
                  </Box>
                </ListItem>
              ))}
            </List>
              <Heading size="sm" mb={2} pb={1} borderBottom="1px solid" borderColor="gray.200" fontSize="11pt" color={accentColor} mt={4}>
              Other Health Recommendations
            </Heading>            <List spacing={1}>
              {recommendations.map((rec, index) => (
                <ListItem key={index} display="flex" alignItems="flex-start">
                  <ListIcon as={FaCheckCircle} color="green.500" mt={1} flexShrink={0} fontSize="9pt" />
                  <Text overflowWrap="break-word" maxW="100%" fontSize="9pt" lineHeight="1.3">
                    {rec}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>     
      </Flex>      {/* Action Buttons */}      <Flex justifyContent="center" mt={3} gap={4} position="sticky" bottom={0} pb={2}>        <Button
          colorScheme="blue"
          leftIcon={<Icon as={FaDownload} />}
          size="md"
          onClick={generatePDF}>
          Download as PDF
        </Button>
          <Button
          colorScheme="teal"
          leftIcon={<Icon as={FaPrint} />}
          size="md"
          onClick={printSummary}>
          Print Summary
        </Button>
        
        <Button
          colorScheme="blue"
          variant="outline"
          size="md"
          onClick={() => handleOptionSelect("Start a new screening", "start")}>
          Start New Screening
        </Button>
      </Flex>
    </Box>
  );
};

export default SummaryComponent;
