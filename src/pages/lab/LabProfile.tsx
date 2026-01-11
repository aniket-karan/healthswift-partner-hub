import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, Phone, Mail, MapPin, LogOut, Edit2, Check, Clock } from "lucide-react";

const LabProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "LifeCare Diagnostics",
    phone: "+91 98765 43210",
    email: "contact@lifecare.com",
    address: "45, Healthcare Avenue, Mumbai 400001",
    timing: "7:00 AM - 9:00 PM",
  });

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-5 safe-top">
        <PageHeader
          title="Profile"
          action={
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl bg-primary/10 text-primary"
            >
              {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          }
        />

        {/* Profile Header */}
        <div className="text-center mb-8 page-enter">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-elevated">
            <FlaskConical className="w-12 h-12 text-primary-foreground" />
          </div>
          {isEditing ? (
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="text-center text-xl font-bold ios-input mb-2"
            />
          ) : (
            <h2 className="text-xl font-bold text-foreground mb-1">{profile.name}</h2>
          )}
          <p className="text-muted-foreground">Diagnostic Center</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 slide-up">
          <GlassCard elevated>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="ios-input h-9 mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  {isEditing ? (
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="ios-input h-9 mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Address</p>
                  {isEditing ? (
                    <Input
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="ios-input h-9 mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Working Hours</p>
                  {isEditing ? (
                    <Input
                      value={profile.timing}
                      onChange={(e) => setProfile({ ...profile, timing: e.target.value })}
                      className="ios-input h-9 mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.timing}</p>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full h-14 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav role="lab" />
    </div>
  );
};

export default LabProfile;
