import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import EducationPage from "./pages/solutions/EducationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/solutions/education" element={<EducationPage />} />
    </Routes>
  );
}

export default App;
