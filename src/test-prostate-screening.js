// A comprehensive test for prostate cancer screening recommendations
const { getPrescribedTests } = require('./testPrescription');

// Mock user response for a 50-year-old man (standard risk)
const mockUserResponseMale50 = {
  demographics: {
    age: 50,
    sex: 'Male',
    ethnicity: 'White or Caucasian',
    country: 'United States'
  },
  medicalHistory: {
    personalCancer: {
      diagnosed: false,
      type: "",
      ageAtDiagnosis: null
    },
    familyCancer: {
      diagnosed: false,
      relation: "",
      type: "",
      ageAtDiagnosis: null
    },
    chronicConditions: []
  },
  sexSpecificInfo: {
    male: {
      prostateTest: {
        had: false,
        ageAtLast: null
      },
      urinarySymptoms: false,
      testicularIssues: false
    }
  }
};

// Mock user response for a 45-year-old man at high risk (African American)
const mockUserResponseMale45HighRisk1 = {
  demographics: {
    age: 45,
    sex: 'Male',
    ethnicity: 'Black or African American',
    country: 'United States'
  },
  medicalHistory: {
    personalCancer: {
      diagnosed: false,
      type: "",
      ageAtDiagnosis: null
    },
    familyCancer: {
      diagnosed: false,
      relation: "",
      type: "",
      ageAtDiagnosis: null
    },
    chronicConditions: []
  },
  sexSpecificInfo: {
    male: {
      prostateTest: {
        had: false,
        ageAtLast: null
      },
      urinarySymptoms: false,
      testicularIssues: false
    }
  }
};

// Mock user response for a 45-year-old man at high risk (family history)
const mockUserResponseMale45HighRisk2 = {
  demographics: {
    age: 45,
    sex: 'Male',
    ethnicity: 'White or Caucasian',
    country: 'United States'
  },
  medicalHistory: {
    personalCancer: {
      diagnosed: false,
      type: "",
      ageAtDiagnosis: null
    },
    familyCancer: {
      diagnosed: true,
      relation: "Father",
      type: "Prostate cancer",
      ageAtDiagnosis: 60
    },
    chronicConditions: []
  },
  sexSpecificInfo: {
    male: {
      prostateTest: {
        had: false,
        ageAtLast: null
      },
      urinarySymptoms: false,
      testicularIssues: false
    }
  }
};

// Mock user response for a 45-year-old man NOT at high risk
const mockUserResponseMale45Regular = {
  demographics: {
    age: 45,
    sex: 'Male',
    ethnicity: 'White or Caucasian',
    country: 'United States'
  },
  medicalHistory: {
    personalCancer: {
      diagnosed: false,
      type: "",
      ageAtDiagnosis: null
    },
    familyCancer: {
      diagnosed: false,
      relation: "",
      type: "",
      ageAtDiagnosis: null
    },
    chronicConditions: []
  },
  sexSpecificInfo: {
    male: {
      prostateTest: {
        had: false,
        ageAtLast: null
      },
      urinarySymptoms: false,
      testicularIssues: false
    }
  }
};

// Helper function to extract tests of a specific type
function getTestsByType(tests, type) {
  return tests.filter(test => test.type === type);
}

// Test cases
console.log("===== PROSTATE CANCER SCREENING TEST CASES =====");

console.log("\nTEST CASE 1: 50-year-old male (standard risk)");
const testsForMale50 = getPrescribedTests(mockUserResponseMale50);
const prostateTests50 = getTestsByType(testsForMale50, "prostate");
console.log(`Number of prostate tests: ${prostateTests50.length}`);
prostateTests50.forEach((test, i) => {
  console.log(`Test ${i+1}: ${test.name}`);
  console.log(`  Reason: ${test.reason}`);
  console.log(`  Frequency: ${test.frequency}`);
});

console.log("\nTEST CASE 2: 45-year-old male (high risk due to ethnicity)");
const testsForMale45HighRisk1 = getPrescribedTests(mockUserResponseMale45HighRisk1);
const prostateTests45HighRisk1 = getTestsByType(testsForMale45HighRisk1, "prostate");
console.log(`Number of prostate tests: ${prostateTests45HighRisk1.length}`);
prostateTests45HighRisk1.forEach((test, i) => {
  console.log(`Test ${i+1}: ${test.name}`);
  console.log(`  Reason: ${test.reason}`);
  console.log(`  Frequency: ${test.frequency}`);
});

console.log("\nTEST CASE 3: 45-year-old male (high risk due to family history)");
const testsForMale45HighRisk2 = getPrescribedTests(mockUserResponseMale45HighRisk2);
const prostateTests45HighRisk2 = getTestsByType(testsForMale45HighRisk2, "prostate");
console.log(`Number of prostate tests: ${prostateTests45HighRisk2.length}`);
prostateTests45HighRisk2.forEach((test, i) => {
  console.log(`Test ${i+1}: ${test.name}`);
  console.log(`  Reason: ${test.reason}`);
  console.log(`  Frequency: ${test.frequency}`);
});

console.log("\nTEST CASE 4: 45-year-old male (not high risk)");
const testsForMale45Regular = getPrescribedTests(mockUserResponseMale45Regular);
const prostateTests45Regular = getTestsByType(testsForMale45Regular, "prostate");
console.log(`Number of prostate tests: ${prostateTests45Regular.length}`);
if (prostateTests45Regular.length === 0) {
  console.log("No prostate tests recommended, as expected for this age and risk level");
}

console.log("\n===== TEST COMPLETE =====");
