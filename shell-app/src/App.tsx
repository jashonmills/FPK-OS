import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import LandingPage from "./pages/landing/LandingPage";
import EducationPage from "./pages/solutions/EducationPage";
import TherapyPage from "./pages/solutions/TherapyPage";
import ParentsPage from "./pages/solutions/ParentsPage";
import BusinessPage from "./pages/solutions/BusinessPage";
import IndividualsPage from "./pages/solutions/IndividualsPage";
import LibrariesPage from "./pages/solutions/LibrariesPage";

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/solutions/education" element={<EducationPage />} />
        <Route path="/solutions/therapy" element={<TherapyPage />} />
        <Route path="/solutions/parents" element={<ParentsPage />} />
        <Route path="/solutions/business" element={<BusinessPage />} />
        <Route path="/solutions/individuals" element={<IndividualsPage />} />
        <Route path="/solutions/libraries" element={<LibrariesPage />} />
      </Routes>
    </div>
  );
}

export default App;
