import { GlassCard } from "@/components/ui/GlassCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileText, Upload, Users, Bell, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LabDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Pending Reports", value: "12", icon: Clock, color: "text-[hsl(38_92%_50%)]" },
    { label: "Uploaded Today", value: "8", icon: CheckCircle, color: "text-[hsl(158_64%_45%)]" },
    { label: "Assigned Patients", value: "24", icon: Users, color: "text-primary" },
    { label: "Total Reports", value: "156", icon: FileText, color: "text-secondary" },
  ];

  const recentPatients = [
    { id: 1, name: "Ravi Singh", test: "Complete Blood Count", status: "pending" as const },
    { id: 2, name: "Meera Gupta", test: "Lipid Profile", status: "uploaded" as const },
    { id: 3, name: "Suresh Yadav", test: "Thyroid Panel", status: "pending" as const },
    { id: 4, name: "Anjali Sharma", test: "HbA1c", status: "uploaded" as const },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-5 safe-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 page-enter">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-bold text-foreground">LifeCare Diagnostics</h1>
          </div>
          <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 stagger-children">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>
        {/* Recent Patients */}
        <div className="slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Patients</h2>
            <button
              onClick={() => navigate("/lab/reports")}
              className="text-sm text-primary font-medium"
            >
              See all
            </button>
          </div>

          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <GlassCard
                key={patient.id}
                onClick={() => navigate("/lab/upload")}
                className="p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{patient.test}</p>
                  </div>
                  <StatusBadge status={patient.status} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <BottomNav role="lab" />
    </div>
  );
};

export default LabDashboard;
