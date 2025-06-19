// A comprehensive test for the expanded prostate cancer screening recommendations
const { getPrescribedTests } = require('./testPrescription');

// Helper function to extract tests of a specific type
function getTestsByType(tests, type) {
  return tests.filter(test => test.type === type);
}

// Helper function to display test results
function displayProstateCancerTests(description, userResponse) {
  console.log(`\nTEST CASE: ${description}`);
  const tests = getPrescribedTests(userResponse);
  const prostateTests = getTestsByType(tests, "prostate");
  console.log(`Number of prostate tests: ${prostateTests.length}`);
  prostateTests.forEach((test, i) => {
    console.log(`Test ${i+1}: ${test.name}`);
    console.log(`  Priority: ${test.priority}`);
    console.log(`  Reason: ${test.reason}`);
    console.log(`  Frequency: ${test.frequency}`);
    console.log(`  Urgency: ${test.urgency}`);
  });
}

// Base male template for creating test cases
const baseTemplate = {
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
      ageAtDiagnosis: null,
      multipleRelatives: false
    },
    chronicConditions: [],
    geneticMutations: []
  },
  sexSpecificInfo: {
    male: {
      prostateTest: {
        had: false,
        ageAtLast: null,
        abnormalResult: false
      },
      urinarySymptoms: false,
      testicularIssues: false
    }
  },
  lifestyle: {
    smoking: {
      current: false,
      former: false,
      packYears: 0
    },
    bmi: 24.5,
    chemicalExposure: {
      agentOrange: false,
      pesticides: false
    }
  }
};

// Create test cases for each risk factor
const testCases = [
  {
    description: "50-year-old male (standard risk)",
    modifications: {} // No modifications needed for standard risk
  },
  {
    description: "45-year-old male (standard risk - should not get tests)",
    modifications: {
      demographics: { age: 45 }
    }
  },
  {
    description: "45-year-old male with family history of prostate cancer",
    modifications: {
      demographics: { age: 45 },
      medicalHistory: {
        familyCancer: {
          diagnosed: true,
          relation: "Father",
          type: "Prostate cancer",
          ageAtDiagnosis: 60
        }
      }
    }
  },
  {
    description: "45-year-old male with multiple family members with prostate cancer (high priority)",
    modifications: {
      demographics: { age: 45 },
      medicalHistory: {
        familyCancer: {
          diagnosed: true,
          relation: "Father and Brother",
          type: "Prostate cancer",
          ageAtDiagnosis: 60,
          multipleRelatives: true
        }
      }
    }
  },
  {
    description: "45-year-old African American male",
    modifications: {
      demographics: { 
        age: 45,
        ethnicity: 'Black or African American' 
      }
    }
  },
  {
    description: "45-year-old male with urinary symptoms",
    modifications: {
      demographics: { age: 45 },
      sexSpecificInfo: {
        male: {
          urinarySymptoms: true
        }
      }
    }
  },
  {
    description: "45-year-old male with BRCA2 genetic mutation",
    modifications: {
      demographics: { age: 45 },
      medicalHistory: {
        geneticMutations: ['BRCA2']
      }
    }
  },
  {
    description: "45-year-old male with previous abnormal PSA",
    modifications: {
      demographics: { age: 45 },
      sexSpecificInfo: {
        male: {
          prostateTest: {
            had: true, 
            ageAtLast: 44,
            abnormalResult: true
          }
        }
      }
    }
  },
  {
    description: "45-year-old male with Agent Orange exposure",
    modifications: {
      demographics: { age: 45 },
      lifestyle: {
        chemicalExposure: {
          agentOrange: true
        }
      }
    }
  },
  {
    description: "45-year-old male with obesity only (not enough for early screening)",
    modifications: {
      demographics: { age: 45 },
      lifestyle: {
        bmi: 32
      }
    }
  },
  {
    description: "45-year-old male with multiple high risk factors (obesity + urinary symptoms + pesticide exposure)",
    modifications: {
      demographics: { age: 45 },
      sexSpecificInfo: {
        male: {
          urinarySymptoms: true
        }
      },
      lifestyle: {
        bmi: 32,
        chemicalExposure: {
          pesticides: true
        }
      }
    }
  }
];

// Run the test cases
console.log("===== EXPANDED PROSTATE CANCER SCREENING TEST CASES =====");

testCases.forEach(testCase => {
  // Create a deep copy of the base template
  const userResponse = JSON.parse(JSON.stringify(baseTemplate));
  
  // Apply modifications to create this test case
  const applyModifications = (target, source) => {
    if (!source) return;
    
    Object.keys(source).forEach(key => {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        applyModifications(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  };
  
  applyModifications(userResponse, testCase.modifications);
  
  // Run and display the test
  displayProstateCancerTests(testCase.description, userResponse);
});

console.log("\n===== TEST COMPLETE =====");
