import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, FileUp, Check, User, X, FileText } from "lucide-react";

const LabUpload = () => {
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [testName, setTestName] = useState("");
  const [status, setStatus] = useState<"pending" | "uploaded">("pending");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const patients = [
    { id: "1", name: "Ravi Singh", phone: "+91 98765 43210" },
    { id: "2", name: "Meera Gupta", phone: "+91 87654 32109" },
    { id: "3", name: "Suresh Yadav", phone: "+91 76543 21098" },
    { id: "4", name: "Anjali Sharma", phone: "+91 65432 10987" },
  ];

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
      p.phone.includes(searchPatient)
  );

  const handleUpload = () => {
    if (selectedPatient && testName) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPatient(null);
        setTestName("");
        setUploadedFile(null);
        setStatus("pending");
      }, 2500);
    }
  };

  const handleFileSelect = () => {
    setUploadedFile("report_" + Date.now() + ".pdf");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="p-5 safe-top">
        <PageHeader title="Upload Report" subtitle="Attach reports to patient profiles" showBack />

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 scale-in">
            <div className="w-24 h-24 mb-6 rounded-full bg-[hsl(158_64%_45%/0.15)] flex items-center justify-center">
              <Check className="w-12 h-12 text-[hsl(158_64%_35%)] success-check" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Report Uploaded</h2>
            <p className="text-muted-foreground text-center">
              Successfully attached to patient profile
            </p>
          </div>
        ) : (
          <div className="space-y-6 stagger-children">
            {/* Patient Search */}
            <GlassCard elevated>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Select Patient
              </h3>

              {selectedPatient ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {patients.find((p) => p.id === selectedPatient)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 rounded-lg hover:bg-primary/20"
                  >
                    <X className="w-4 h-4 text-primary" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={searchPatient}
                      onChange={(e) => setSearchPatient(e.target.value)}
                      placeholder="Search by name or phone..."
                      className="ios-input pl-12 h-12"
                    />
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient.id);
                          setSearchPatient("");
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>

            {/* Test Details */}
            <GlassCard elevated>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Test Details
              </h3>

              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test Name (e.g., Complete Blood Count)"
                className="ios-input h-12 mb-4"
              />

              <div className="flex gap-2">
                {(["pending", "uploaded"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      status === s
                        ? s === "uploaded"
                          ? "bg-[hsl(158_64%_45%)] text-[hsl(0_0%_100%)]"
                          : "bg-[hsl(38_92%_50%)] text-[hsl(0_0%_100%)]"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* File Upload */}
            <GlassCard elevated>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload File
              </h3>

              {uploadedFile ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-[hsl(158_64%_45%/0.1)] border border-[hsl(158_64%_45%/0.2)]">
                  <div className="flex items-center gap-3">
                    <FileUp className="w-5 h-5 text-[hsl(158_64%_35%)]" />
                    <span className="font-medium text-foreground">{uploadedFile}</span>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-2 rounded-lg hover:bg-[hsl(158_64%_45%/0.2)]"
                  >
                    <X className="w-4 h-4 text-[hsl(158_64%_35%)]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFileSelect}
                  className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors"
                >
                  <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1">Upload PDF or Image</p>
                  <p className="text-sm text-muted-foreground">Tap to select file</p>
                </button>
              )}
            </GlassCard>

            {/* Submit Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedPatient || !testName || !uploadedFile}
              className="w-full h-14 rounded-xl text-base font-semibold shadow-button"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabUpload;
