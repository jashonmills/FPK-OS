import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@/styles/shepherd-theme.css";

createRoot(document.getElementById("root")!).render(<App />);
