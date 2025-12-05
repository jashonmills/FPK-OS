import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
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
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import EducationDashboard from "./pages/dashboard/EducationDashboard";
import CoursesPage from "./pages/dashboard/CoursesPage";
import StudentInfoPage from "./pages/StudentInfoPage";
import { StudentProfilePage } from "./pages/StudentProfilePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import AssessmentsPage from "./pages/dashboard/AssessmentsPage";
import AICoachPage from "./pages/AICoachPage";
import FeesAndPaymentsPage from "./pages/FeesAndPaymentsPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import CommunicationHubPage from "./pages/CommunicationHubPage";
import GamificationPage from "./pages/GamificationPage";
import WebsiteSettingsPage from "./pages/WebsiteSettingsPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";
import AIGovernancePage from "./pages/AIGovernancePage";
import OrganizationHubPage from "./pages/OrganizationHubPage";
import FpkNexusPage from "./pages/FpkNexusPage";
import FPKxRoutes from "./routes/FPKxRoutes";
import UniversityLandingPage from "./pages/landing/UniversityLandingPage";
import EducationPlanBuilderPage from "./pages/pricing/EducationPlanBuilderPage";
import IndividualPlanBuilderPage from "./pages/pricing/IndividualPlanBuilderPage";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-white text-slate-900">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Dashboard wrapper to pass subscribed features into the layout
const DashboardRoutes = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productParams = params.getAll("products");
  const subscribedFeatures =
    productParams.length > 0
      ? new Set(productParams)
      : new Set([
          "university",
          "sis",
          // baseline paid features the user owns
        ]);
  const allPremium = [
    "pulse",
    "nexus",
    "aegis",
    "website",
    "gamification",
    "attendance",
  ];
  const trialingFeatures = new Set(
    allPremium.filter((f) => !subscribedFeatures.has(f))
  );

  return (
    <DashboardLayout
      subscribedFeatures={subscribedFeatures}
      trialingFeatures={trialingFeatures}
    >
      <Routes>
        <Route path="/" element={<EducationDashboard />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="students" element={<StudentInfoPage />} />
        <Route path="students/:studentId" element={<StudentProfilePage />} />
        <Route path="sis" element={<StudentInfoPage />} />
        <Route path="sis/:studentId" element={<StudentProfilePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="coach" element={<AICoachPage />} />
        <Route path="ai-coach" element={<AICoachPage />} />
        <Route path="payments" element={<FeesAndPaymentsPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="communications" element={<CommunicationHubPage />} />
        <Route path="hub" element={<CommunicationHubPage />} />
        <Route path="gamification" element={<GamificationPage />} />
        <Route path="website" element={<WebsiteSettingsPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
        <Route path="ai-governance" element={<AIGovernancePage />} />
        <Route path="governance" element={<AIGovernancePage />} />
        <Route path="organization" element={<OrganizationHubPage />} />
        <Route path="nexus" element={<FpkNexusPage />} />
      </Routes>
    </DashboardLayout>
  );
};

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
        <Route path="/solutions/education/build-plan" element={<EducationPlanBuilderPage />} />
        <Route path="/university" element={<UniversityLandingPage />} />
        <Route path="/university/pricing" element={<IndividualPlanBuilderPage />} />
      </Route>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/fkpx/*" element={<FPKxRoutes />} />
    </Routes>
  );
}

export default App;
