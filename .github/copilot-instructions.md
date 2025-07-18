# Copilot Instructions for Cancology.ai (drfrempong)

## Project Overview
- **Cancology.ai** is a React/Chakra UI single-page app for interactive cancer risk assessment and screening recommendations.
- The app uses a conversational flow, collecting user demographics, medical history, and lifestyle data, then generates a personalized summary.
- Key files: `src/App.js` (main UI and logic), `src/components/HandlerFunctions.js` (input handlers), `src/conversationFlow.js` (questionnaire logic), `src/components/SummaryComponentWrapper.js` (summary display).

## Architecture & Data Flow
- **State Management**: Uses React hooks (`useState`, `useEffect`) for all state. No Redux or context API for global state.
- **Conversation Flow**: Controlled by `conversationFlow.js` (step logic, options, branching). All user input is routed through handler functions in `HandlerFunctions.js`.
- **User Responses**: Collected in a nested `userResponses` object in `App.js` and passed to summary components.
- **UI**: Chakra UI components for all layout, forms, and controls. Custom styles in `App.css` and Chakra theming in `theme.js`.

## Developer Workflows
- **Install**: `npm install` (Node.js v12+ required)
- **Run Dev Server**: `npm start` (runs on default React port)
- **Build**: `npm run build` (outputs to `build/`)
- **No custom test scripts**: No tests or test runner present by default.
- **Debugging**: Use browser dev tools; React DevTools recommended. No custom logging or error boundary patterns.

## Project-Specific Patterns
- **Step Routing**: Each step in the conversation is keyed by string IDs (e.g., 'age', 'chronicConditions'). Progress and section names are mapped in `App.js`.
- **Handler Functions**: All input validation and state updates are delegated to functions in `HandlerFunctions.js`.
- **Option Buttons**: Option selection is handled with Chakra `Button` components, with loading/disabled states for async UX.
- **Summary**: The summary view is rendered by `SummaryComponentWrapper`, which receives the full `userResponses` object.
- **No API/Backend**: All logic is client-side; no network requests or backend integration.

## Integration & Dependencies
- **Chakra UI**: All UI elements use Chakra. Do not mix with Material UI or other component libraries.
- **Icons**: Uses `react-icons/fa` for all icons.
- **No Redux, MobX, or Context**: All state is local to components.
- **No authentication or user accounts**: All data is ephemeral and local.

## Conventions & Tips
- **Add new questions**: Update `conversationFlow.js` and add handler logic in `HandlerFunctions.js`.
- **Add new UI**: Use Chakra components and follow the style of `App.js`.
- **Do not add server code**: This project is strictly a client-side SPA.
- **Keep all user-facing text in `conversationFlow.js` or as constants for easy updates.**

## Example: Adding a New Step
1. Add a new step in `conversationFlow.js` with a unique key and options.
2. Add a handler in `HandlerFunctions.js` if input validation/state update is needed.
3. Update progress/section maps in `App.js` if needed.
4. Use Chakra UI for any new UI elements.

---
For more details, see `README.md` and the main files in `src/`.
