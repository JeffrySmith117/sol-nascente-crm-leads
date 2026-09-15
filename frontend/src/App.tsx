import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import LeadForm from "./pages/LeadForm";
import Login from "./pages/Login";
import LeadsPanel from "./pages/LeadsPanel";

function RotaProtegida({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RotaProtegida>
              <LeadsPanel />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}