import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, role, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (role === "doctor") {
        navigate("/doctor", { replace: true });
      } else if (role === "diagnostic_center") {
        navigate("/lab", { replace: true });
      } else if (role === "physiotherapist") {
        navigate("/physio", { replace: true });
      } else if (role === "ecg_lab") {
        navigate("/ecg", { replace: true });
      } else {
        navigate("/role-select", { replace: true });
      }
    }
  }, [authLoading, user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message,
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please select your role to continue.",
          });
          navigate("/role-select");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message,
          });
        } else {
          // Navigation will be handled by the auth state change
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 lg:p-10">
      {/* Logo Section */}
      <div className="text-center mb-10 page-enter">
        <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-button">
          <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-1">HealthSwift</h1>
        <p className="text-muted-foreground font-medium lg:text-lg">Partner Portal</p>
      </div>

      {/* Login Card */}
      <GlassCard elevated className="w-full max-w-sm lg:max-w-md slide-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp
                ? "Sign up with your email"
                : "Enter your credentials to continue"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ios-input pl-12 h-14 text-base"
                autoComplete="email"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ios-input pl-12 h-14 text-base"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-base font-semibold shadow-button transition-all duration-300 hover:shadow-elevated"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                {isSignUp ? "Already have an account?" : "New to HealthSwift?"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full h-14 rounded-xl text-base font-medium border-border/60 bg-card hover:bg-muted/50"
          >
            {isSignUp ? (
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Sign In Instead
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New Account
              </span>
            )}
          </Button>
        </form>
      </GlassCard>

      <p className="text-xs text-muted-foreground mt-8 text-center max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Login;
