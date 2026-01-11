import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Stethoscope, FlaskConical, ArrowRight } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "doctor",
      title: "Doctor",
      description: "Manage appointments, slots & prescriptions",
      icon: Stethoscope,
      path: "/doctor",
      gradient: "from-primary to-[hsl(174_72%_50%)]",
    },
    {
      id: "lab",
      title: "Diagnostic Center",
      description: "Upload reports & manage patient tests",
      icon: FlaskConical,
      path: "/lab",
      gradient: "from-secondary to-[hsl(220_60%_35%)]",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10 page-enter">
          <h1 className="text-2xl font-bold text-foreground mb-2">Continue as</h1>
          <p className="text-muted-foreground">Select your role to proceed</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 stagger-children">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <GlassCard
                key={role.id}
                elevated
                onClick={() => navigate(role.path)}
                className="group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-button transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          Wrong account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-primary font-medium hover:underline"
          >
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
