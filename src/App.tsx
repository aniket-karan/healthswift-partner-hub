import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import NotFound from "./pages/NotFound";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorSlots from "./pages/doctor/DoctorSlots";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Lab Pages
import LabDashboard from "./pages/lab/LabDashboard";
import LabReports from "./pages/lab/LabReports";
import LabUpload from "./pages/lab/LabUpload";
import LabProfile from "./pages/lab/LabProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/role-select" element={<RoleSelect />} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/slots" element={<DoctorSlots />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />

            {/* Lab Routes */}
            <Route path="/lab" element={<LabDashboard />} />
            <Route path="/lab/reports" element={<LabReports />} />
            <Route path="/lab/upload" element={<LabUpload />} />
            <Route path="/lab/profile" element={<LabProfile />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
