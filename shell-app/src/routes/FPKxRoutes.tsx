import { Route, Routes } from "react-router-dom";
import FPKxLayout from "../layouts/FPKxLayout";
import MtDashboardPage from "../pages/MtDashboardPage";

type PlaceholderProps = { title: string };

const PlaceholderPage = ({ title }: PlaceholderProps) => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-slate-500 mt-2">This page is under construction.</p>
  </div>
);

const FPKxRoutes = () => {
  return (
    <FPKxLayout>
      <Routes>
        <Route index element={<MtDashboardPage />} />
        <Route path="dashboard" element={<MtDashboardPage />} />
        <Route path="students" element={<PlaceholderPage title="Student Management" />} />
        <Route path="documents" element={<PlaceholderPage title="Document Hub" />} />
        <Route path="settings" element={<PlaceholderPage title="Organization Settings" />} />
      </Routes>
    </FPKxLayout>
  );
};

export default FPKxRoutes;
