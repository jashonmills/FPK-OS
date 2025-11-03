import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import App from "./App.tsx";
import "./index.css";
import "@/styles/shepherd-theme.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    storageKey="fpk-pulse-theme"
  >
    <App />
  </ThemeProvider>
);
