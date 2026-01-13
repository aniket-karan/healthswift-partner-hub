import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Stethoscope, FlaskConical, ArrowRight, Loader2, Activity, HeartPulse } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { user, role, setUserRole, signOut, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSettingRole, setIsSettingRole] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Redirect if role is already set
  useEffect(() => {
    if (!authLoading && role) {
      if (role === "doctor") {
        navigate("/doctor", { replace: true });
      } else if (role === "diagnostic_center") {
        navigate("/lab", { replace: true });
      } else if (role === "physiotherapist") {
        navigate("/physio", { replace: true });
      } else if (role === "ecg_lab") {
        navigate("/ecg", { replace: true });
      }
    }
  }, [authLoading, role, navigate]);

  const handleRoleSelect = async (roleId: "doctor" | "diagnostic_center" | "physiotherapist" | "ecg_lab", path: string) => {
    setIsSettingRole(roleId);
    
    const { error } = await setUserRole(roleId);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to set role",
        description: error.message,
      });
      setIsSettingRole(null);
    } else {
      toast({
        title: "Role set successfully!",
        description: `Welcome to HealthSwift Partner.`,
      });
      navigate(path);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const roles = [
    {
      id: "doctor" as const,
      title: "Doctor",
      description: "Manage appointments, slots & prescriptions",
      icon: Stethoscope,
      path: "/doctor",
      gradient: "from-primary to-[hsl(174_72%_50%)]",
    },
    {
      id: "diagnostic_center" as const,
      title: "Diagnostic Center",
      description: "Upload reports & manage patient tests",
      icon: FlaskConical,
      path: "/lab",
      gradient: "from-secondary to-[hsl(220_60%_35%)]",
    },
    {
      id: "physiotherapist" as const,
      title: "Physiotherapist",
      description: "Manage therapy sessions & patient progress",
      icon: Activity,
      path: "/physio",
      gradient: "from-[hsl(280_60%_50%)] to-[hsl(300_60%_40%)]",
    },
    {
      id: "ecg_lab" as const,
      title: "ECG Lab",
      description: "Upload ECG reports & manage cardiac tests",
      icon: HeartPulse,
      path: "/ecg",
      gradient: "from-[hsl(0_70%_50%)] to-[hsl(20_70%_45%)]",
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 lg:p-10">
      <div className="w-full max-w-sm lg:max-w-lg">
        {/* Header */}
        <div className="text-center mb-10 page-enter">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Continue as</h1>
          <p className="text-muted-foreground lg:text-lg">Select your role to proceed</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 stagger-children">
          {roles.map((roleItem) => {
            const Icon = roleItem.icon;
            const isLoading = isSettingRole === roleItem.id;
            
            return (
              <GlassCard
                key={roleItem.id}
                elevated
                onClick={() => !isSettingRole && handleRoleSelect(roleItem.id, roleItem.path)}
                className={`group ${isSettingRole && !isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${roleItem.gradient} flex items-center justify-center shadow-button transition-transform duration-300 group-hover:scale-110`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
                    ) : (
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{roleItem.title}</h3>
                    <p className="text-sm text-muted-foreground">{roleItem.description}</p>
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
            onClick={handleSignOut}
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
