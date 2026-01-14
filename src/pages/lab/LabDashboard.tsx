import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Bell, Clock, CheckCircle, IndianRupee, User, FileText, Check, X, Droplets, Upload, CreditCard, Banknote, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type OrderStatus = "pending" | "accepted" | "declined";
type PaymentMode = "cash" | "online" | null;
type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";

interface AssignedPatient {
  id: number;
  name: string;
  test: string;
  orderStatus: OrderStatus;
  collectionComplete: boolean;
  paymentMode: PaymentMode;
}

// Sample data for different time filters
const patientChartData = {
  daily: [
    { name: "9 AM", patients: 4 },
    { name: "10 AM", patients: 6 },
    { name: "11 AM", patients: 8 },
    { name: "12 PM", patients: 5 },
    { name: "1 PM", patients: 3 },
    { name: "2 PM", patients: 7 },
    { name: "3 PM", patients: 9 },
    { name: "4 PM", patients: 6 },
  ],
  weekly: [
    { name: "Mon", patients: 24 },
    { name: "Tue", patients: 32 },
    { name: "Wed", patients: 28 },
    { name: "Thu", patients: 35 },
    { name: "Fri", patients: 30 },
    { name: "Sat", patients: 18 },
    { name: "Sun", patients: 12 },
  ],
  monthly: [
    { name: "Week 1", patients: 120 },
    { name: "Week 2", patients: 145 },
    { name: "Week 3", patients: 132 },
    { name: "Week 4", patients: 158 },
  ],
  yearly: [
    { name: "Jan", patients: 450 },
    { name: "Feb", patients: 480 },
    { name: "Mar", patients: 520 },
    { name: "Apr", patients: 490 },
    { name: "May", patients: 560 },
    { name: "Jun", patients: 530 },
    { name: "Jul", patients: 580 },
    { name: "Aug", patients: 620 },
    { name: "Sep", patients: 590 },
    { name: "Oct", patients: 610 },
    { name: "Nov", patients: 640 },
    { name: "Dec", patients: 680 },
  ],
};

const LabDashboard = () => {
  const navigate = useNavigate();
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("daily");

  const stats = [
    { label: "Today's Assigned Patients", value: "24", icon: Users, color: "text-primary", expandable: true },
    { label: "Earnings", value: "₹12,500", icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandable: false },
    { label: "Pending Reports", value: "12", icon: Clock, color: "text-[hsl(38_92%_50%)]", expandable: false },
    { label: "Uploaded Reports", value: "156", icon: CheckCircle, color: "text-secondary", expandable: false },
  ];

  const [assignedPatients, setAssignedPatients] = useState<AssignedPatient[]>([
    { id: 1, name: "Ravi Singh", test: "Complete Blood Count", orderStatus: "pending", collectionComplete: false, paymentMode: null },
    { id: 2, name: "Meera Gupta", test: "Lipid Profile", orderStatus: "accepted", collectionComplete: true, paymentMode: "online" },
    { id: 3, name: "Suresh Yadav", test: "Thyroid Panel", orderStatus: "pending", collectionComplete: false, paymentMode: null },
    { id: 4, name: "Anjali Sharma", test: "HbA1c", orderStatus: "accepted", collectionComplete: false, paymentMode: "cash" },
  ]);

  const handleAccept = (id: number) => {
    setAssignedPatients(prev => prev.map(p => p.id === id ? { ...p, orderStatus: "accepted" as const } : p));
  };

  const handleDecline = (id: number) => {
    setAssignedPatients(prev => prev.map(p => p.id === id ? { ...p, orderStatus: "declined" as const } : p));
  };

  const toggleCollection = (id: number) => {
    setAssignedPatients(prev => prev.map(p => p.id === id ? { ...p, collectionComplete: !p.collectionComplete } : p));
  };

  const setPaymentMode = (id: number, mode: "cash" | "online") => {
    setAssignedPatients(prev => prev.map(p => p.id === id ? { ...p, paymentMode: mode } : p));
  };

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <p className="text-sm lg:text-base text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">LifeCare Diagnostics</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/lab/profile")}
              className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
            >
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 stagger-children">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className={`p-2 lg:p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                    {stat.expandable && (
                      <button
                        onClick={() => setIsGraphExpanded(!isGraphExpanded)}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {isGraphExpanded ? (
                          <ChevronUp className="w-4 h-4 text-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Expandable Patient Graph */}
        {isGraphExpanded && (
          <div className="mb-8 slide-up">
            <GlassCard className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Patient Statistics</h3>
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={timeFilter === filter.key ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setTimeFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patientChartData[timeFilter]}>
                    <defs>
                      <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#patientGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}
        {/* Today's Assigned Patients */}
        <div className="slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">Today's Assigned Patients</h2>
            <button
              onClick={() => navigate("/lab/reports")}
              className="text-sm lg:text-base text-primary font-medium hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex flex-col gap-3 lg:gap-4">
            {assignedPatients.map((patient) => (
              <GlassCard key={patient.id} className="p-4 lg:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground lg:text-lg">{patient.name}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">{patient.test}</p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    {/* 1. View Prescription */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => navigate("/lab/upload")}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">View Prescription</span>
                      <span className="sm:hidden">Rx</span>
                    </Button>

                    {/* 2. Accept/Decline Order */}
                    {patient.orderStatus === "pending" ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleAccept(patient.id)}
                        >
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Accept</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDecline(patient.id)}
                        >
                          <X className="w-4 h-4" />
                          <span className="hidden sm:inline">Decline</span>
                        </Button>
                      </div>
                    ) : (
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        patient.orderStatus === "accepted" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {patient.orderStatus === "accepted" ? "Accepted" : "Declined"}
                      </span>
                    )}

                    {/* 3. Blood Collection + Upload */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant={patient.collectionComplete ? "default" : "outline"}
                        size="sm"
                        className="gap-1"
                        onClick={() => toggleCollection(patient.id)}
                      >
                        <Droplets className="w-4 h-4" />
                        <span className="hidden sm:inline">{patient.collectionComplete ? "Collected" : "Collect"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => navigate("/lab/upload")}
                      >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Upload</span>
                      </Button>
                    </div>

                    {/* 4. Payment Mode */}
                    <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
                      <Button
                        variant={patient.paymentMode === "cash" ? "default" : "ghost"}
                        size="sm"
                        className="gap-1 h-7"
                        onClick={() => setPaymentMode(patient.id, "cash")}
                      >
                        <Banknote className="w-4 h-4" />
                        <span className="hidden sm:inline">Cash</span>
                      </Button>
                      <Button
                        variant={patient.paymentMode === "online" ? "default" : "ghost"}
                        size="sm"
                        className="gap-1 h-7"
                        onClick={() => setPaymentMode(patient.id, "online")}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Online</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
