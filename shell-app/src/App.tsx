import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import LandingPage from "./pages/landing/LandingPage";
import EducationPage from "./pages/solutions/EducationPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/solutions/education" element={<EducationPage />} />
      </Routes>
    </div>
  );
}

export default App;
