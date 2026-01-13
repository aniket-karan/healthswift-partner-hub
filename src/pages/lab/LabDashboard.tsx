import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Users, Bell, Clock, CheckCircle, IndianRupee, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LabDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Assigned Patients", value: "24", icon: Users, color: "text-primary" },
    { label: "Earnings", value: "₹12,500", icon: IndianRupee, color: "text-[hsl(158_64%_45%)]" },
    { label: "Pending Reports", value: "12", icon: Clock, color: "text-[hsl(38_92%_50%)]" },
    { label: "Uploaded Reports", value: "156", icon: CheckCircle, color: "text-secondary" },
  ];

  const recentPatients = [
    { id: 1, name: "Ravi Singh", test: "Complete Blood Count", status: "pending" as const },
    { id: 2, name: "Meera Gupta", test: "Lipid Profile", status: "uploaded" as const },
    { id: 3, name: "Suresh Yadav", test: "Thyroid Panel", status: "pending" as const },
    { id: 4, name: "Anjali Sharma", test: "HbA1c", status: "uploaded" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <p className="text-sm lg:text-base text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">LifeCare Diagnostics</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/lab/profile")}
              className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
            >
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 stagger-children">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className={`p-2 lg:p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>
        {/* Recent Patients */}
        <div className="slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">Recent Patients</h2>
            <button
              onClick={() => navigate("/lab/reports")}
              className="text-sm lg:text-base text-primary font-medium hover:underline"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {recentPatients.map((patient) => (
              <GlassCard
                key={patient.id}
                onClick={() => navigate("/lab/upload")}
                className="p-4 lg:p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground lg:text-lg">{patient.name}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">{patient.test}</p>
                  </div>
                  <StatusBadge status={patient.status} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
