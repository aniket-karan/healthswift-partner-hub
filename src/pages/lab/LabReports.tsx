import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
  id: number;
  patientName: string;
  testName: string;
  date: string;
  status: "pending" | "uploaded";
}

const LabReports = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "uploaded">("all");

  const reports: Report[] = [
    { id: 1, patientName: "Ravi Singh", testName: "Complete Blood Count", date: "12 Jan 2025", status: "pending" },
    { id: 2, patientName: "Meera Gupta", testName: "Lipid Profile", date: "12 Jan 2025", status: "uploaded" },
    { id: 3, patientName: "Suresh Yadav", testName: "Thyroid Panel", date: "11 Jan 2025", status: "pending" },
    { id: 4, patientName: "Anjali Sharma", testName: "HbA1c", date: "11 Jan 2025", status: "uploaded" },
    { id: 5, patientName: "Rahul Verma", testName: "Kidney Function Test", date: "10 Jan 2025", status: "uploaded" },
    { id: 6, patientName: "Priya Patel", testName: "Liver Function Test", date: "10 Jan 2025", status: "pending" },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(search.toLowerCase()) ||
      report.testName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || report.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-5 safe-top">
        <PageHeader title="Reports" subtitle="View and manage all reports" showBack />

        {/* Search */}
        <div className="relative mb-4 page-enter">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or test..."
            className="ios-input pl-12 h-12"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 page-enter" style={{ animationDelay: "0.1s" }}>
          {(["all", "pending", "uploaded"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-3 stagger-children">
          {filteredReports.map((report) => (
            <GlassCard
              key={report.id}
              onClick={() => navigate("/lab/upload")}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{report.testName}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span>{report.patientName}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{report.date}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No reports found</p>
          </div>
        )}
      </div>

      <BottomNav role="lab" />
    </div>
  );
};

export default LabReports;
