// A test for lung cancer screening recommendations based on smoking history
const { getPrescribedTests } = require('./testPrescription');

// Helper function to extract tests of a specific type
function getTestsByType(tests, type) {
  return tests.filter(test => test.type === type);
}

// Helper function to display test results
function displayLungCancerTests(description, userResponse) {
  console.log(`\nTEST CASE: ${description}`);
  const tests = getPrescribedTests(userResponse);
  const lungTests = getTestsByType(tests, "lung");
  console.log(`Number of lung cancer tests: ${lungTests.length}`);
  lungTests.forEach((test, i) => {
    console.log(`Test ${i+1}: ${test.name}`);
    console.log(`  Priority: ${test.priority}`);
    console.log(`  Reason: ${test.reason}`);
    console.log(`  Frequency: ${test.frequency}`);
    console.log(`  Urgency: ${test.urgency}`);
  });
}

// Base user template for creating test cases
const baseTemplate = {
  demographics: {
    age: 55,
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
  lifestyle: {
    smoking: {
      current: true,
      former: false,
      packYears: 25
    },
    bmi: 24.5
  }
};

// Create test cases for lung cancer screening
const testCases = [
  {
    description: "55-year-old with 25 pack-years smoking history (should get LDCT)",
    modifications: {} // No modifications needed for standard case
  },
  {
    description: "55-year-old with 15 pack-years smoking history (should NOT get LDCT)",
    modifications: {
      lifestyle: {
        smoking: {
          packYears: 15
        }
      }
    }
  },
  {
    description: "45-year-old with 25 pack-years smoking history (should NOT get LDCT - age too young)",
    modifications: {
      demographics: { age: 45 }
    }
  },
  {
    description: "50-year-old with exactly 20 pack-years smoking history (should get LDCT)",
    modifications: {
      demographics: { age: 50 },
      lifestyle: {
        smoking: {
          packYears: 20
        }
      }
    }
  },
  {
    description: "60-year-old former smoker with 30 pack-years history (should get LDCT)",
    modifications: {
      demographics: { age: 60 },
      lifestyle: {
        smoking: {
          current: false,
          former: true,
          packYears: 30
        }
      }
    }
  },
  {
    description: "70-year-old with 40 pack-years smoking history (should get LDCT)",
    modifications: {
      demographics: { age: 70 },
      lifestyle: {
        smoking: {
          packYears: 40
        }
      }
    }
  }
];

// Run the test cases
console.log("===== LUNG CANCER SCREENING TEST CASES =====");

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
  displayLungCancerTests(testCase.description, userResponse);
});

console.log("\n===== TEST COMPLETE =====");
