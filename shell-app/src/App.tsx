import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import AccessPortalPage from "./pages/AccessPortalPage";
import LandingPage from "./pages/landing/LandingPage";
import BusinessPage from "./pages/solutions/BusinessPage";
import EducationPage from "./pages/solutions/EducationPage";
import IndividualsPage from "./pages/solutions/IndividualsPage";
import LibrariesPage from "./pages/solutions/LibrariesPage";
import ParentsPage from "./pages/solutions/ParentsPage";
import TherapyPage from "./pages/solutions/TherapyPage";
import ConfigurePage from "./pages/solutions/education/ConfigurePage";
import BusinessConfigurePage from "./pages/solutions/business/ConfigurePage";
import TherapyConfigurePage from "./pages/solutions/therapy/ConfigurePage";
import LibrariesConfigurePage from "./pages/solutions/libraries/ConfigurePage";
import ParentsPricingPage from "./pages/solutions/parents/PricingPage";
import IndividualsPricingPage from "./pages/solutions/individuals/PricingPage";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-white text-slate-900">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/solutions/education" element={<EducationPage />} />
        <Route
          path="/solutions/education/configure"
          element={<ConfigurePage />}
        />
        <Route path="/solutions/therapy" element={<TherapyPage />} />
        <Route
          path="/solutions/therapy/configure"
          element={<TherapyConfigurePage />}
        />
        <Route path="/solutions/parents" element={<ParentsPage />} />
        <Route
          path="/solutions/parents/pricing"
          element={<ParentsPricingPage />}
        />
        <Route path="/solutions/business" element={<BusinessPage />} />
        <Route
          path="/solutions/business/configure"
          element={<BusinessConfigurePage />}
        />
        <Route path="/solutions/individuals" element={<IndividualsPage />} />
        <Route
          path="/solutions/individuals/pricing"
          element={<IndividualsPricingPage />}
        />
        <Route path="/solutions/libraries" element={<LibrariesPage />} />
        <Route
          path="/solutions/libraries/configure"
          element={<LibrariesConfigurePage />}
        />
      </Route>
      <Route path="/access" element={<AccessPortalPage />} />
    </Routes>
  );
}

export default App;
