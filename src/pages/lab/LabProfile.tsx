import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FlaskConical, Phone, Mail, MapPin, LogOut, Edit2, Check, Clock, 
  Building2, FileCheck, Award, Globe, CreditCard, Users, Stethoscope,
  Shield, Calendar, IndianRupee
} from "lucide-react";

const LabProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "LifeCare Diagnostics",
    registrationNumber: "DL/LAB/2020/12345",
    phone: "+91 98765 43210",
    alternatePhone: "+91 87654 32109",
    email: "contact@lifecare.com",
    website: "www.lifecarediagnostics.com",
    address: "45, Healthcare Avenue, Mumbai 400001",
    landmark: "Near City Hospital",
    timing: "7:00 AM - 9:00 PM",
    workingDays: "Monday - Saturday",
    ownerName: "Dr. Rajesh Kumar",
    ownerQualification: "MD Pathology",
    staffCount: "15",
    nabl: "NABL Accredited",
    nablNumber: "MC-1234",
    services: "Blood Tests, Urine Tests, X-Ray, ECG, Ultrasound, CT Scan, MRI",
    homeCollection: "Available (₹100 extra)",
    paymentModes: "Cash, Card, UPI, Insurance",
    insurancePartners: "Star Health, HDFC Ergo, ICICI Lombard",
    establishedYear: "2015",
    averageReportTime: "24-48 hours",
  });

  const handleLogout = () => {
    navigate("/");
  };

  const ProfileField = ({ 
    icon: Icon, 
    label, 
    value, 
    field,
    multiline = false 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string; 
    field: keyof typeof profile;
    multiline?: boolean;
  }) => (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isEditing ? (
          multiline ? (
            <Textarea
              value={value}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              className="ios-input mt-1 min-h-[60px]"
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              className="ios-input h-9 mt-1"
            />
          )
        ) : (
          <p className="font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="p-5 safe-top">
        <PageHeader
          title="Profile"
          showBack
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
        <div className="text-center mb-6 page-enter">
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
          <p className="text-xs text-primary mt-1">{profile.nabl}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 slide-up">
          {/* Basic Information */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <ProfileField icon={FileCheck} label="Registration Number" value={profile.registrationNumber} field="registrationNumber" />
              <ProfileField icon={Shield} label="NABL Number" value={profile.nablNumber} field="nablNumber" />
              <ProfileField icon={Calendar} label="Established Year" value={profile.establishedYear} field="establishedYear" />
            </div>
          </GlassCard>

          {/* Contact Information */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Phone} label="Primary Phone" value={profile.phone} field="phone" />
              <ProfileField icon={Phone} label="Alternate Phone" value={profile.alternatePhone} field="alternatePhone" />
              <ProfileField icon={Mail} label="Email" value={profile.email} field="email" />
              <ProfileField icon={Globe} label="Website" value={profile.website} field="website" />
            </div>
          </GlassCard>

          {/* Location */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </h3>
            <div className="space-y-4">
              <ProfileField icon={MapPin} label="Address" value={profile.address} field="address" multiline />
              <ProfileField icon={MapPin} label="Landmark" value={profile.landmark} field="landmark" />
            </div>
          </GlassCard>

          {/* Working Hours */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Working Hours
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Clock} label="Timing" value={profile.timing} field="timing" />
              <ProfileField icon={Calendar} label="Working Days" value={profile.workingDays} field="workingDays" />
            </div>
          </GlassCard>

          {/* Owner/Manager Details */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Owner/Manager Details
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Users} label="Owner Name" value={profile.ownerName} field="ownerName" />
              <ProfileField icon={Award} label="Qualification" value={profile.ownerQualification} field="ownerQualification" />
              <ProfileField icon={Users} label="Total Staff" value={profile.staffCount} field="staffCount" />
            </div>
          </GlassCard>

          {/* Services */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Services
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Stethoscope} label="Tests & Services" value={profile.services} field="services" multiline />
              <ProfileField icon={MapPin} label="Home Collection" value={profile.homeCollection} field="homeCollection" />
              <ProfileField icon={Clock} label="Average Report Time" value={profile.averageReportTime} field="averageReportTime" />
            </div>
          </GlassCard>

          {/* Payment Information */}
          <GlassCard elevated>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Information
            </h3>
            <div className="space-y-4">
              <ProfileField icon={IndianRupee} label="Payment Modes" value={profile.paymentModes} field="paymentModes" />
              <ProfileField icon={Shield} label="Insurance Partners" value={profile.insurancePartners} field="insurancePartners" multiline />
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
    </div>
  );
};

export default LabProfile;