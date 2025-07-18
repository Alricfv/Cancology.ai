// Defines the flowchart of conversation for the medical screening chatbot
const conversationFlow = {
  start: {
    question: "Hello, I'm your cancer screening assistant. I'd like to ask you a few questions about your health and medical history. Would you like to proceed?",
    options: [
      { text: "Yes, let's begin", nextId: "age" },
      { text: "What information will you collect?", nextId: "info" }
    ]
  },
  info: {
    question: "I'll be collecting basic health information including your demographics, medical history, medications, and allergies. This information helps us recommend the cancer test you'll most likely need to take.",
    options: [
      { text: "OK, let's start", nextId: "age" },
      { text: "Maybe later", nextId: "end" }
    ]
  },
  age: {
    question: "What is your current age? ",
    options: [], // Empty options because we're using the custom input field
    inputType: "age"
  },
  sex: {
    question: "What sex were you assigned at birth?",
    options: [
      { text: "Male", nextId: "ethnicity" },
      { text: "Female", nextId: "ethnicity" }
    ]
  },
  ethnicity: {
    question: "What is your ethnicity?",
    options: [],
    inputType: "ethnicity"
  },
  location: {
    question: "Where do you live (country/region)?",
    options: [],
    inputType: "country"
  },
  cancer: {
    question: "Have you ever been diagnosed with cancer?",
    options: [
      { text: "Yes", nextId: "cancerDetails" },
      { text: "No", nextId: "familyHistory" }
    ]
  },
  cancerDetails: {
    question: "Please provide details about your cancer diagnosis:",
    options: [],
    inputType: "cancer"
  },
  familyHistory: {
    question: "Has a first-degree relative (parent, sibling, child) ever been diagnosed with cancer?",
    options: [
      { text: "Yes", nextId: "familyHistoryDetails" },
      { text: "No", nextId: "chronicConditions" }
    ]
  },
  familyHistoryDetails: {
    question: "Please provide details about your family member's cancer diagnosis:",
    options: [],
    inputType: "familyCancer"
  },
  chronicConditions: {
    question: "Do you have any of the following chronic conditions?",
    options: [],
    inputType: "chronic"
  },  smokingStatus: {
    question: "Do you currently smoke or have you smoked in the past?",
    options: [
      { text: "Yes", nextId: "smokingYears" },
      { text: "No", nextId: "alcoholConsumption" }
    ]
  },smokingYears: {
    question: "How many packs of cigarettes do/did you smoke per day on average? (A pack contains 20 cigarettes)",
    options: [],
    inputType: "smokingPacks"
  },  smokingAmount: {
    question: "How many years have you smoked?",
    options: [],
    inputType: "smokingYears"
  },
  alcoholConsumption: {
    question: "Do you drink alcohol?",
    options: [
      { text: "Yes", nextId: "alcoholAmount" },
      { text: "No", nextId: "transplant" }
    ]
  },  alcoholAmount: {
    question: "How many alcoholic drinks do you consume per week on average?",
    options: [],
    inputType: "alcoholAmount"
  },
  sexualHealth: {
    question: "Have you had unprotected sex or been diagnosed with HPV or HIV?",
    options: [
      { text: "Yes", nextId: "transplant" },
      { text: "No", nextId: "transplant" }
    ]
  },
  transplant: {
    question: "Have you had organ transplants or immunosuppressive therapy?",
    options: [
      { text: "Yes", nextId: "brcaMutation" },
      { text: "No", nextId: "brcaMutation" }
    ]
  },
  brcaMutation: {
    question: "Have you tested positive for a BRCA1/BRCA2 mutation?",
    options: [
      { text: "Yes", nextId: "medications" },
      { text: "No", nextId: "medications" },
      { text: "Not tested", nextId: "medications" }
    ]
  },
  medications: {
    question: "Are you currently taking any of the following medications?",
    options: [],
    inputType: "medications"
  },
  allergies: {
    question: "Do you have any known drug allergies?",
    options: [
      { text: "Yes", nextId: "allergyDetails" },
      { text: "No", nextId: "routeBasedOnSex" }
    ]
  },
  // This step is kept for backward compatibility but is bypassed in the current flow
  checkSex: {
    question: "Thank you for providing your allergy information.",
    options: [
      { text: "Continue", nextId: "routeBasedOnSex" }
    ]
  },
  // This step is kept for backward compatibility but is bypassed in the current flow
  // Now directly invoking the routeBasedOnSex() function instead
  routeBasedOnSex: {
    question: "Processing your information...",
    options: []
  },
  allergyDetails: {
    question: "Please specify your drug allergies:",
    options: [],
    inputType: "allergies"
  },  maleQuestions: {
    question: "We have some additional male-specific health questions. Let's continue with those.",
    options: [
      { text: "Continue", nextId: "urinarySymptoms" }
    ]
  },  urinarySymptoms: {
    question: "Have you experienced urinary symptoms (e.g., weak stream, nocturia)?",
    options: [
      { text: "Yes", nextId: "prostateTest" },
      { text: "No", nextId: "prostateTest" }
    ]
  },
  prostateTest: {
    question: "Have you ever had a Prostate Antigen Test?",
    options: [
      { text: "Yes", nextId: "prostateTestAge" },
      { text: "No", nextId: "testicularIssues" }
    ]
  },
  prostateTestAge: {
    question: "What age were you when you took your last prostate antigen test?",
    options: [],
    inputType: "prostateTestAge"
  },  testicularIssues: {
    question: "Have you had testicular pain, swelling, or history of undescended testis?",
    options: [
      { text: "Yes", nextId: "pastCancerScreening" },
      { text: "No", nextId: "pastCancerScreening" }
    ]
  },
  femaleQuestions: {
    question: "We have some additional female-specific health questions. Let's continue with those.",
    options: [
      { text: "Continue", nextId: "menarcheAge" }
    ]
  },
  menarcheAge: {
    question: "At what age did your periods start (menarche)?",
    options: [],
    inputType: "menarcheAge"
  },
  menstruationStatus: {
    question: "Are you currently menstruating?",
    options: [
      { text: "Premenopausal", nextId: "pregnancy" },
      { text: "Postmenopausal", nextId: "menopauseAge" }
    ]
  },
  menopauseAge: {
    question: "At what age did your periods stop?",
    options: [],
    inputType: "menopauseAge",
    nextId: "pregnancy"
  },
  pregnancy: {
    question: "Have you ever been pregnant?",
    options: [
      { text: "Yes", nextId: "numberOfBirths" },
      { text: "No", nextId: "birthControl" }
    ]
  },
  numberOfBirths: {
    question: "How many times have you given birth to a baby at or after 24 weeks of pregnancy?",
    options: [
      { text: "1", nextId: "firstPregnancyAge" },
      { text: "2", nextId: "firstPregnancyAge" },
      { text: "3", nextId: "firstPregnancyAge" },
      { text: "4+", nextId: "firstPregnancyAge" }
    ],
    inputType: "dropdown"
  },
  firstPregnancyAge: {
    question: "What age was your first full term pregnancy?",
    options: [],
    inputType: "pregnancyAge",
    nextId: "birthControl"
  },
  birthControl: {
    question: "Have you ever used birth control pills?",
    options: [
      { text: "Yes", nextId: "pillYears" },
      { text: "No", nextId: "hormoneReplacementTherapy" }
    ]
  },
  pillYears: {
    question: "How many years have you used combined oral-contraceptive pills?",
    options: [
      { text: "0", nextId: "hormoneReplacementTherapy" },
      { text: "Lesser than a year", nextId: "hormoneReplacementTherapy" },
      { text: "1-4 years", nextId: "hormoneReplacementTherapy" },
      { text: "5-9 years", nextId: "hormoneReplacementTherapy" },
      { text: "10+ years", nextId: "hormoneReplacementTherapy" }
    ],
    inputType: "dropdown",
    nextId: "hormoneReplacementTherapy"
  },
  hormoneReplacementTherapy: {
    question: "Have you ever used hormone replacement therapy (HRT)?",
    options: [
      { text: "Yes", nextId: "tubalLigation" },
      { text: "No", nextId: "tubalLigation" }
    ]
  },
  tubalLigation: {
    question: "Have you had tubal ligation (“tied tubes”)?",
    options: [
      { text: "Yes", nextId: "ovaryRemoved" },
      { text: "No", nextId: "ovaryRemoved" }
    ]
  },
  ovaryRemoved: {
    question: "Have you had either ovary removed?",
    options: [
      { text: "Left", nextId: "endometriosis" },
      { text: "Right", nextId: "endometriosis" },
      { text: "Both", nextId: "endometriosis" },
      { text: "None", nextId: "endometriosis" }
    ]
  },
  endometriosis: {
    question: "Have you ever been diagnosed with endometriosis?",
    options: [
      { text: "Yes", nextId: "fertilityDrugs" },
      { text: "No", nextId: "fertilityDrugs" }
    ]
  },
  fertilityDrugs: {
    question: "Have you ever received fertility (IVF) drugs?",
    options: [
      { text: "Yes", nextId: "goffSymptomIntro" },
      { text: "No", nextId: "goffSymptomIntro" }
    ]
  },
  goffSymptomIntro: {
    question: "The following questions ask about common symptoms that may be associated with ovarian cancer. Please indicate whether you have experienced any of the symptoms listed below on more than 12 days per month in the past 3 months.",
    options: [
      { text: "Continue", nextId: "goffBloating" }
    ]
  },
  goffBloating: {
    question: "In the past 3 months, have you experienced persistent bloating or abdominal swelling on more than 12 days per month?",
    options: [
      { text: "Yes", nextId: "goffPain" },
      { text: "No", nextId: "goffPain" }
    ]
  },
  goffPain: {
    question: "In the past 3 months, have you experienced pelvic or lower-abdominal pain on more than 12 days per month?",
    options: [
      { text: "Yes", nextId: "goffFullness" },
      { text: "No", nextId: "goffFullness" }
    ]
  },
  goffFullness: {
    question: "In the past 3 months, have you felt full quickly or been unable to finish meals on more than 12 days per month?",
    options: [
      { text: "Yes", nextId: "goffUrinary" },
      { text: "No", nextId: "goffUrinary" }
    ]
  },
  goffUrinary: {
    question: "In the past 3 months, have you had an urgent or frequent need to pass urine on more than 12 days per month?",
    options: [
      { text: "Yes", nextId: "goffAbdomenSize" },
      { text: "No", nextId: "goffAbdomenSize" }
    ]
  },
  goffAbdomenSize: {
    question: "In the past 3 months, have you noticed an increase in your abdomen size or that your clothes have become tight on more than 12 days per month?",
    options: [
      { text: "Yes", nextId: "pastCancerScreening" },
      { text: "No", nextId: "pastCancerScreening" }
    ]
  },
  pastCancerScreening: {
    question: "Have you ever been screened for any cancer before?",
    options: [
      { text: "Yes", nextId: "pastCancerScreeningDetails" },
      { text: "No", nextId: "hpvVaccine" }
    ]
  },
  pastCancerScreeningDetails: {
    question: "What type of cancer screening did you have and when?",
    options: [],
    inputType: "cancerScreeningDetails"
  },
  hpvVaccine: {
    question: "Have you received the HPV vaccine?",
    options: [
      { text: "Yes", nextId: "hepBVaccine" },
      { text: "No", nextId: "hepBVaccine" }
    ]
  },
  hepBVaccine: {
    question: "Have you received the Hepatitis B vaccine?",
    options: [
      { text: "Yes", nextId: "summary" },
      { text: "No", nextId: "summary" }
    ]
  },
  summary: {
    question: "Thank you for completing your medical screening. This information will help healthcare providers better understand your health status and provide appropriate care recommendations.",
    options: [
      { text: "Start a new screening", nextId: "start" },
      { text: "End conversation", nextId: "end" }
    ]
  },
  end: {
    question: "Thank you for completing the medical screening. Your health information has been recorded. Have a great day!",
    options: [
      { text: "Start a new screening", nextId: "start" }
    ]
  }
};

export default conversationFlow;
