import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle,
  Bell,
  User,
  HeartPulse
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const EcgDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "ecg_lab") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  const stats = [
    { label: "Today's Tests", value: "24", icon: HeartPulse, color: "text-red-500" },
    { label: "Pending Reports", value: "8", icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: "16", icon: CheckCircle, color: "text-green-500" },
    { label: "Total Reports", value: "156", icon: FileText, color: "text-primary" },
  ];

  const quickActions = [
    { label: "Upload ECG", icon: Upload, path: "/ecg/upload" },
    { label: "View Reports", icon: FileText, path: "/ecg/reports" },
    { label: "Pending Tests", icon: Clock, path: "/ecg/pending" },
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
            <div className="p-2 rounded-xl bg-red-500/10">
              <HeartPulse className="w-6 h-6 text-red-500" />
            </div>
            <PageHeader
              title="ECG Lab Dashboard"
              subtitle="Welcome back"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-card hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button 
              onClick={() => navigate("/ecg/profile")}
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
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <Icon className="w-6 h-6 text-red-500" />
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

export default EcgDashboard;
