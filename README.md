
# Dr. Frempong - Cancer Screening Guide Application

This interactive medical screening application guides users through a personalized cancer risk assessment and provides customized screening recommendations based on their demographic information, medical history, and lifestyle factors.

## Overview

The Dr. Frempong Cancer Screening Guide aims to help individuals understand their potential cancer risks and the appropriate cancer screening tests they should consider based on factors such as:
- Age
- Sex 
- Family and personal history of cancer
- Lifestyle factors (smoking, alcohol consumption, etc.)
- Pre-existing medical conditions

## Features

- **Interactive Chat Interface**: User-friendly conversational interface that guides users through the assessment process
- **Personalized Risk Assessment**: Calculates individual risk scores based on multiple factors
- **Custom Recommendations**: Provides tailored cancer screening recommendations with appropriate frequencies and urgency levels
- **Comprehensive Health Information**: Collects relevant health data while maintaining user privacy
- **Printable Summary**: Generates a summary that can be printed or saved for future reference

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Cancer Types Covered

The application provides screening recommendations for several types of cancer:

### For Men:
- Colorectal cancer
- Prostate cancer
- Lung cancer
- Skin cancer
- Oral/Throat cancer (HPV-related)
- Liver cancer

### For Women:
- Cervical cancer
- Breast cancer
- Colorectal cancer
- Lung cancer
- Skin cancer
- Oral/Throat cancer (HPV-related)
- Liver cancer

## Technical Details

The application is built using:
- React 19.1.0
- Chakra UI for the user interface
- React Icons for visual elements
- A structured conversation flow that guides users through the assessment process

## Project Structure

- `App.js`: Main application component with UI components and state management
- `cancerTypes.js`: Defines cancer types by sex
- `conversationFlow.js`: Defines the conversational flow structure for the screening process
- `SummaryComponent.js`: Displays the final assessment and recommendations
- `testPrescription.js`: Contains logic for determining which cancer tests to prescribe
- `Cancer_Symptom_Guide.md`: Documentation of cancer symptoms and risk factors

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Using the Application

1. Start the application and answer the medical screening assistant's questions about your health and medical history
2. Provide accurate information about your:
   - Demographics (age, sex, ethnicity, location)
   - Medical history (personal/family cancer history, chronic conditions)
   - Lifestyle factors (smoking, alcohol consumption, sexual health)
   - Medications and allergies
   - Cancer screening history and vaccinations
   - Sex-specific health information

3. Review your personalized risk assessment and screening recommendations
4. Print or save your summary for future reference or to share with healthcare providers

## Implementation Notes

- The application uses a comprehensive risk calculation algorithm that considers multiple factors
- The conversation flow is designed to be informative yet respectful of sensitive health information
- Recommendations are based on widely accepted medical guidelines for cancer screening
- No personal health data is stored or transmitted outside the application

## Disclaimer

This application is intended for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before making decisions about cancer screening or other medical procedures.

## Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Additional Resources

### Cancer Information References

For more detailed information about cancer symptoms, risk factors, and screening recommendations, refer to the `Cancer_Symptom_Guide.md` file included in this repository.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Contact

For questions or support, please open an issue in the repository.

---

### Create React App Documentation

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
