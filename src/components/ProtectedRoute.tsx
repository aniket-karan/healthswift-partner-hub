import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

type AppRole = "doctor" | "diagnostic_center" | "physiotherapist" | "ecg_lab";

interface Props {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, role, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/role-select" replace />;
  }
  
  return <>{children}</>;
};
