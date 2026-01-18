import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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
import LabTests from "./pages/lab/LabTests";
import LabBookings from "./pages/lab/LabBookings";

// Physio Pages
import PhysioDashboard from "./pages/physio/PhysioDashboard";
import PhysioProfile from "./pages/physio/PhysioProfile";

// ECG Lab Pages
import EcgDashboard from "./pages/ecg/EcgDashboard";
import EcgProfile from "./pages/ecg/EcgProfile";

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
            <Route path="/role-select" element={<ProtectedRoute><RoleSelect /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/slots" element={<ProtectedRoute requiredRole="doctor"><DoctorSlots /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute requiredRole="doctor"><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute requiredRole="doctor"><DoctorProfile /></ProtectedRoute>} />

            {/* Lab Routes */}
            <Route path="/lab" element={<ProtectedRoute requiredRole="diagnostic_center"><LabDashboard /></ProtectedRoute>} />
            <Route path="/lab/reports" element={<ProtectedRoute requiredRole="diagnostic_center"><LabReports /></ProtectedRoute>} />
            <Route path="/lab/upload" element={<ProtectedRoute requiredRole="diagnostic_center"><LabUpload /></ProtectedRoute>} />
            <Route path="/lab/tests" element={<ProtectedRoute requiredRole="diagnostic_center"><LabTests /></ProtectedRoute>} />
            <Route path="/lab/bookings" element={<ProtectedRoute requiredRole="diagnostic_center"><LabBookings /></ProtectedRoute>} />
            <Route path="/lab/profile" element={<ProtectedRoute requiredRole="diagnostic_center"><LabProfile /></ProtectedRoute>} />

            {/* Physio Routes */}
            <Route path="/physio" element={<ProtectedRoute requiredRole="physiotherapist"><PhysioDashboard /></ProtectedRoute>} />
            <Route path="/physio/profile" element={<ProtectedRoute requiredRole="physiotherapist"><PhysioProfile /></ProtectedRoute>} />

            {/* ECG Lab Routes */}
            <Route path="/ecg" element={<ProtectedRoute requiredRole="ecg_lab"><EcgDashboard /></ProtectedRoute>} />
            <Route path="/ecg/profile" element={<ProtectedRoute requiredRole="ecg_lab"><EcgProfile /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
