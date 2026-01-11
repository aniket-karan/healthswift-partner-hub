import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Video, FileUp, CheckCircle, User, Clock, AlertCircle, X, Check } from "lucide-react";

interface Appointment {
  id: number;
  name: string;
  age: number;
  time: string;
  symptoms: string;
  status: "pending" | "completed";
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, name: "Rahul Sharma", age: 32, time: "10:30 AM", symptoms: "Fever, Cold, Body aches", status: "pending" },
    { id: 2, name: "Priya Patel", age: 28, time: "11:00 AM", symptoms: "Diabetes follow-up", status: "pending" },
    { id: 3, name: "Amit Kumar", age: 45, time: "11:30 AM", symptoms: "Lower back pain, stiffness", status: "pending" },
    { id: 4, name: "Sunita Verma", age: 35, time: "09:00 AM", symptoms: "Migraine", status: "completed" },
  ]);

  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [showUpload, setShowUpload] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredAppointments = appointments.filter((apt) => apt.status === activeTab);

  const markCompleted = (id: number) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "completed" } : apt))
    );
  };

  const handleUpload = (id: number) => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUpload(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-5 safe-top">
        <PageHeader title="Appointments" subtitle="Manage your consultations" showBack />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 page-enter">
          {(["pending", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4 stagger-children">
          {filteredAppointments.map((apt) => (
            <GlassCard key={apt.id} elevated className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{apt.name}</h3>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">Age: {apt.age} years</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>{apt.time}</span>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 mb-4">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{apt.symptoms}</p>
              </div>

              {apt.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl shadow-button"
                    onClick={() => window.open("https://meet.google.com", "_blank")}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => setShowUpload(apt.id)}
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    Prescription
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => markCompleted(apt.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No {activeTab} appointments</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload !== null && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-in-bottom safe-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Upload Prescription</h3>
              <button
                onClick={() => setShowUpload(null)}
                className="p-2 rounded-xl hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(158_64%_45%/0.15)] flex items-center justify-center">
                  <Check className="w-8 h-8 text-[hsl(158_64%_35%)] success-check" />
                </div>
                <p className="font-semibold text-foreground">Prescription Uploaded</p>
                <p className="text-sm text-muted-foreground">Attached to patient profile</p>
              </div>
            ) : (
              <>
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center mb-4">
                  <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">Upload PDF or Image</p>
                  <p className="text-sm text-muted-foreground">Max 10MB</p>
                </div>
                <Button
                  className="w-full h-14 rounded-xl text-base font-semibold shadow-button"
                  onClick={() => handleUpload(showUpload)}
                >
                  Upload & Attach
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <BottomNav role="doctor" />
    </div>
  );
};

export default DoctorAppointments;
