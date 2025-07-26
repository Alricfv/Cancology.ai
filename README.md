
# Cancology.ai – Cancer Risk & Screening Assistant

Welcome to Cancology.ai. This is a user-friendly, interactive web app that helps you understand your cancer risk and get personalized screening recommendations. The app is designed for privacy, clarity, and ease of use—no accounts, no data storage, just instant guidance.

---

## What Does Cancology.ai Do?

- Guides you step-by-step through a cancer risk assessment using a conversational chat interface
- Calculates your risk based on age, sex, family/personal history, lifestyle, and medical conditions
- Recommends cancer screening tests with urgency and frequency tailored to your profile
- Summarizes your answers and recommendations in a printable, shareable format

---

## Key Features

- **Conversational Chat**: Simple, friendly Q&A format—no forms, no confusion
- **Personalized Risk Calculation**: Considers multiple factors for a nuanced risk score
- **Custom Test Recommendations**: Suggests screenings (and urgency) based on your answers
- **Comprehensive Health Data**: Covers demographics, history, lifestyle, and more
- **PDF/Print Summary**: Download or print your results for your records or your doctor
- **No Login Required**: All data stays on your device—nothing is stored or sent

---

## Quick Start

### Prerequisites

- Node.js v12+
- npm v6+



## Project Structure

- `src/App.js` – Main app logic and UI
- `src/conversationFlow.js` – Defines the step-by-step chat flow and all user-facing text
- `src/components/HandlerFunctions.js` – Handles user input, validation, and state updates
- `src/SummaryComponent.js` – Renders the summary and recommendations
- `src/testPrescription.js` – Central logic for which tests to recommend
- `src/cancerTypes.js` – Cancer types by sex
- `Cancer_Symptom_Guide.md` – Reference guide for symptoms and risk factors

---

## How It Works

1. **Start the App**: You’ll be greeted by a chat assistant that asks about your health, history, and lifestyle
2. **Answer Questions**: Each answer updates your risk profile and screening needs
3. **Review Summary**: At the end, you’ll see a clear summary of your answers and recommended tests
4. **Print/Download**: Save or print your summary for your own use or to share with your healthcare provider

---

## Cancer Types Covered

**For Men:**
- Colorectal
- Prostate
- Lung
- Skin
- Oral/Throat (HPV)
- Liver

**For Women:**
- Cervical
- Breast
- Colorectal
- Lung
- Skin
- Oral/Throat (HPV)
- Liver

---

## Technical Details

- Built with React and Chakra UI
- All logic is client-side—no backend, no data storage
- Icons via React Icons
- No Redux, no authentication, no context API—just React hooks

---

## Scripts

- `npm start` – Run the app in development mode
- `npm run build` – Build for production


---

## Using the App

1. Start the app and answer the chat questions
2. Provide info about your demographics, history, lifestyle, medications, allergies, and screening history
3. Review your personalized risk and recommendations
4. Print or download your summary

---

## Implementation Notes

- Risk scores and recommendations are based on established medical guidelines
- All user-facing text is in `conversationFlow.js` for easy updates
- No personal data is stored or transmitted—your privacy is protected

---

## Disclaimer

This app is for informational purposes only. It does not provide medical advice or diagnosis. Always consult a healthcare professional before making decisions about cancer screening or treatment.

---

## More Info

See `Cancer_Symptom_Guide.md` for details on symptoms, risk factors, and screening guidelines.

---

## License

MIT License. See LICENSE file for details.
