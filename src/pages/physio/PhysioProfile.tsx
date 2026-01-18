import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  Clock,
  Activity,
  Save,
  Building2,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const PhysioProfile = () => {
  const navigate = useNavigate();
  const { user, role, signOut, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    registrationNumber: "",
    qualification: "",
    specialization: "",
    experience: "",
    clinicName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    address: "",
    landmark: "",
    workingHours: "",
    workingDays: "",
    servicesOffered: "",
    homeVisit: "",
    consultationFee: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "physiotherapist") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/physio")}
            className="p-2 rounded-xl bg-card hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <PageHeader
              title="Physio Profile"
              subtitle="Manage your professional details"
            />
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Dr. John Doe, PT"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="PT/REG/12345"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  placeholder="BPT, MPT"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="Sports Physiotherapy, Neuro Rehab"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  placeholder="10 years"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic/Center Name</Label>
                <Input
                  id="clinicName"
                  placeholder="PhysioCare Wellness Center"
                  value={formData.clinicName}
                  onChange={(e) => handleInputChange("clinicName", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Contact Information */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Primary Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  placeholder="+91 9876543211"
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="physio@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.physiocare.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Location */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="123, Health Street, Medical Complex, City - 123456"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  placeholder="Near City Hospital"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Working Hours */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Working Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHours">Timing</Label>
                <Input
                  id="workingHours"
                  placeholder="9:00 AM - 6:00 PM"
                  value={formData.workingHours}
                  onChange={(e) => handleInputChange("workingHours", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingDays">Working Days</Label>
                <Input
                  id="workingDays"
                  placeholder="Monday - Saturday"
                  value={formData.workingDays}
                  onChange={(e) => handleInputChange("workingDays", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Services */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Services & Fees
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="servicesOffered">Services Offered</Label>
                <Textarea
                  id="servicesOffered"
                  placeholder="Sports Rehabilitation, Post-Surgery Rehab, Neuro Rehab, Pediatric Therapy, Geriatric Care, Pain Management"
                  value={formData.servicesOffered}
                  onChange={(e) => handleInputChange("servicesOffered", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeVisit">Home Visit Available</Label>
                  <Input
                    id="homeVisit"
                    placeholder="Yes/No"
                    value={formData.homeVisit}
                    onChange={(e) => handleInputChange("homeVisit", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee</Label>
                  <Input
                    id="consultationFee"
                    placeholder="₹500 - ₹1000"
                    value={formData.consultationFee}
                    onChange={(e) => handleInputChange("consultationFee", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Save Profile
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="flex-1">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysioProfile;
