import { cn } from "@/lib/utils";
import { Home, Calendar, ClipboardList, User, FlaskConical, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface BottomNavProps {
  role: "doctor" | "lab";
}

const doctorNavItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/doctor" },
  { icon: Calendar, label: "Slots", path: "/doctor/slots" },
  { icon: ClipboardList, label: "Appointments", path: "/doctor/appointments" },
  { icon: User, label: "Profile", path: "/doctor/profile" },
];

const labNavItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/lab" },
  { icon: FileText, label: "Reports", path: "/lab/reports" },
  { icon: FlaskConical, label: "Upload", path: "/lab/upload" },
  { icon: User, label: "Profile", path: "/lab/profile" },
];

export const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = role === "doctor" ? doctorNavItems : labNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-elevated border-t border-border/30 safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "nav-item py-2 px-4 rounded-xl",
                isActive && "nav-item-active bg-primary/10"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-all duration-300", isActive && "text-primary")} />
              <span className={cn("text-xs font-medium transition-all duration-300", isActive && "text-primary")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
