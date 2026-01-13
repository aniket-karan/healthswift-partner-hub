import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  TrendingUp,
  Bell,
  User,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const PhysioDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "physiotherapist") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  const stats = [
    { label: "Today's Sessions", value: "8", icon: Calendar, color: "text-primary" },
    { label: "Active Patients", value: "45", icon: Users, color: "text-secondary" },
    { label: "Pending Reports", value: "5", icon: ClipboardList, color: "text-amber-500" },
    { label: "Recovery Rate", value: "92%", icon: TrendingUp, color: "text-green-500" },
  ];

  const quickActions = [
    { label: "View Sessions", icon: Calendar, path: "/physio/sessions" },
    { label: "Patient Records", icon: Users, path: "/physio/patients" },
    { label: "Progress Reports", icon: ClipboardList, path: "/physio/reports" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <PageHeader
              title="Physio Dashboard"
              subtitle="Welcome back, Therapist"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-card hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button 
              onClick={() => navigate("/physio/profile")}
              className="p-2 rounded-xl bg-card hover:bg-accent transition-colors"
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-card ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <GlassCard
                  key={action.label}
                  elevated
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysioDashboard;
