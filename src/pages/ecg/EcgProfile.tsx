import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  Clock,
  HeartPulse,
  Save,
  User,
  CreditCard,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const EcgProfile = () => {
  const navigate = useNavigate();
  const { user, role, signOut, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    labName: "",
    registrationNumber: "",
    nablAccreditation: "",
    establishedYear: "",
    ownerName: "",
    qualification: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    address: "",
    landmark: "",
    workingHours: "",
    workingDays: "",
    testsOffered: "",
    equipmentDetails: "",
    homeCollection: "",
    reportTurnaround: "",
    paymentModes: "",
    insurancePartners: "",
    staffCount: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "ecg_lab") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
            onClick={() => navigate("/ecg")}
            className="p-2 rounded-xl bg-card hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10">
              <HeartPulse className="w-6 h-6 text-red-500" />
            </div>
            <PageHeader
              title="ECG Lab Profile"
              subtitle="Manage your lab details"
            />
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-500" />
              Lab Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="labName">ECG Lab Name</Label>
                <Input
                  id="labName"
                  placeholder="HeartCare ECG Diagnostics"
                  value={formData.labName}
                  onChange={(e) => handleInputChange("labName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="ECG/REG/2024/12345"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nablAccreditation">NABL Accreditation</Label>
                <Input
                  id="nablAccreditation"
                  placeholder="MC-12345"
                  value={formData.nablAccreditation}
                  onChange={(e) => handleInputChange("nablAccreditation", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  placeholder="2015"
                  value={formData.establishedYear}
                  onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Owner Details */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              Owner/Manager Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner/Manager Name</Label>
                <Input
                  id="ownerName"
                  placeholder="Dr. Cardiac Expert"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  placeholder="MD Cardiology, DM"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffCount">Total Staff Count</Label>
                <Input
                  id="staffCount"
                  placeholder="10"
                  value={formData.staffCount}
                  onChange={(e) => handleInputChange("staffCount", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Contact Information */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
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
                  placeholder="info@heartcare-ecg.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.heartcare-ecg.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Location */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Location
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="123, Cardiac Care Building, Heart Street, City - 123456"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  placeholder="Near City Heart Hospital"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Working Hours */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Working Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHours">Timing</Label>
                <Input
                  id="workingHours"
                  placeholder="24/7 or 8:00 AM - 10:00 PM"
                  value={formData.workingHours}
                  onChange={(e) => handleInputChange("workingHours", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingDays">Working Days</Label>
                <Input
                  id="workingDays"
                  placeholder="All Days / Monday - Saturday"
                  value={formData.workingDays}
                  onChange={(e) => handleInputChange("workingDays", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Services */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              Services & Equipment
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testsOffered">ECG Tests Offered</Label>
                <Textarea
                  id="testsOffered"
                  placeholder="12-Lead ECG, Holter Monitor, Stress Test ECG, Event Monitor, Signal-Averaged ECG"
                  value={formData.testsOffered}
                  onChange={(e) => handleInputChange("testsOffered", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentDetails">Equipment Details</Label>
                <Textarea
                  id="equipmentDetails"
                  placeholder="GE MAC 2000, Philips PageWriter TC30, BPL Cardiart 9108"
                  value={formData.equipmentDetails}
                  onChange={(e) => handleInputChange("equipmentDetails", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeCollection">Home ECG Available</Label>
                  <Input
                    id="homeCollection"
                    placeholder="Yes / No"
                    value={formData.homeCollection}
                    onChange={(e) => handleInputChange("homeCollection", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportTurnaround">Report Turnaround Time</Label>
                  <Input
                    id="reportTurnaround"
                    placeholder="Same Day / 2-4 Hours"
                    value={formData.reportTurnaround}
                    onChange={(e) => handleInputChange("reportTurnaround", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Payment */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Payment & Insurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentModes">Accepted Payment Modes</Label>
                <Input
                  id="paymentModes"
                  placeholder="Cash, Card, UPI, Net Banking"
                  value={formData.paymentModes}
                  onChange={(e) => handleInputChange("paymentModes", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurancePartners">Insurance Partners</Label>
                <Input
                  id="insurancePartners"
                  placeholder="Star Health, ICICI Lombard, Max Bupa"
                  value={formData.insurancePartners}
                  onChange={(e) => handleInputChange("insurancePartners", e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 gap-2 bg-red-500 hover:bg-red-600">
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

export default EcgProfile;
