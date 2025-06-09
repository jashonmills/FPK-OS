
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AccessibilityProvider from './components/AccessibilityProvider.tsx'
import GlobalHeader from './components/GlobalHeader.tsx'

createRoot(document.getElementById("root")!).render(
  <AccessibilityProvider>
    <GlobalHeader />
    <App />
  </AccessibilityProvider>
);
