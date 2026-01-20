import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Bell, Clock, CheckCircle, IndianRupee, User, FileText, Droplets, Upload, CreditCard, Banknote, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft, FlaskConical, MapPin, Eye, X, Phone, Package, Truck, FlaskRound, UserPlus } from "lucide-react";
import expandIcon from "@/assets/expand-icon.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type PaymentStatus = "unpaid" | "paid_online" | "paid_cash";
type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";
type TransactionType = "credit" | "debit";
type ReportStatus = "pending" | "uploaded";
type WorkflowStep = "assign" | "out_for_collection" | "collection_complete" | "payment_done" | "sample_received";

interface DeliveryPartner {
  id: number;
  name: string;
  phone: string;
  available: boolean;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  time: string;
}

interface AssignedPatient {
  id: number;
  name: string;
  phone: string;
  test: string;
  address: string;
  collectionComplete: boolean;
  paymentStatus: PaymentStatus;
  reportStatus: ReportStatus;
  workflowStep: WorkflowStep;
  assignedPartner: DeliveryPartner | null;
}

// Sample data for different time filters - Patient stats
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

// Sample transaction data
const transactionsData: Transaction[] = [
  { id: 1, description: "Payment from Ravi Singh - CBC", amount: 850, type: "credit", date: "2024-01-14", time: "10:30 AM" },
  { id: 2, description: "Lab supplies purchase", amount: 2500, type: "debit", date: "2024-01-14", time: "09:15 AM" },
  { id: 3, description: "Payment from Meera Gupta - Lipid Profile", amount: 1200, type: "credit", date: "2024-01-13", time: "04:20 PM" },
  { id: 4, description: "Equipment maintenance", amount: 1800, type: "debit", date: "2024-01-13", time: "02:00 PM" },
  { id: 5, description: "Payment from Suresh Yadav - Thyroid Panel", amount: 950, type: "credit", date: "2024-01-13", time: "11:45 AM" },
  { id: 6, description: "Payment from Anjali Sharma - HbA1c", amount: 750, type: "credit", date: "2024-01-12", time: "03:30 PM" },
  { id: 7, description: "Electricity bill", amount: 3200, type: "debit", date: "2024-01-12", time: "10:00 AM" },
  { id: 8, description: "Payment from Vikram Patel - Complete Panel", amount: 2800, type: "credit", date: "2024-01-11", time: "05:15 PM" },
  { id: 9, description: "Staff salary", amount: 15000, type: "debit", date: "2024-01-10", time: "12:00 PM" },
  { id: 10, description: "Payment from Priya Nair - Blood Test", amount: 650, type: "credit", date: "2024-01-10", time: "09:30 AM" },
];

// Balance chart data for different time filters
const balanceChartData = {
  daily: [
    { name: "9 AM", balance: 45000 },
    { name: "10 AM", balance: 45850 },
    { name: "11 AM", balance: 43350 },
    { name: "12 PM", balance: 44550 },
    { name: "1 PM", balance: 44550 },
    { name: "2 PM", balance: 42750 },
    { name: "3 PM", balance: 43700 },
    { name: "4 PM", balance: 44900 },
  ],
  weekly: [
    { name: "Mon", balance: 38000 },
    { name: "Tue", balance: 42500 },
    { name: "Wed", balance: 40200 },
    { name: "Thu", balance: 44800 },
    { name: "Fri", balance: 43500 },
    { name: "Sat", balance: 45200 },
    { name: "Sun", balance: 44900 },
  ],
  monthly: [
    { name: "Week 1", balance: 35000 },
    { name: "Week 2", balance: 42000 },
    { name: "Week 3", balance: 38500 },
    { name: "Week 4", balance: 44900 },
  ],
  yearly: [
    { name: "Jan", balance: 28000 },
    { name: "Feb", balance: 32500 },
    { name: "Mar", balance: 35000 },
    { name: "Apr", balance: 31200 },
    { name: "May", balance: 38500 },
    { name: "Jun", balance: 42000 },
    { name: "Jul", balance: 39800 },
    { name: "Aug", balance: 45500 },
    { name: "Sep", balance: 43200 },
    { name: "Oct", balance: 47800 },
    { name: "Nov", balance: 44900 },
    { name: "Dec", balance: 52000 },
  ],
};

const LabDashboard = () => {
  const navigate = useNavigate();
  const [isPatientGraphExpanded, setIsPatientGraphExpanded] = useState(false);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [patientTimeFilter, setPatientTimeFilter] = useState<TimeFilter>("daily");
  const [balanceTimeFilter, setBalanceTimeFilter] = useState<TimeFilter>("daily");

  // Calculate current balance from transactions
  const currentBalance = useMemo(() => {
    return transactionsData.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 50000); // Starting balance
  }, []);

  // Sample delivery partners
  const deliveryPartners: DeliveryPartner[] = [
    { id: 1, name: "Ramesh Kumar", phone: "+91 98765 43210", available: true },
    { id: 2, name: "Sunil Sharma", phone: "+91 87654 32109", available: true },
    { id: 3, name: "Vikash Verma", phone: "+91 76543 21098", available: false },
    { id: 4, name: "Amit Patel", phone: "+91 65432 10987", available: true },
  ];

  const [assignedPatients, setAssignedPatients] = useState<AssignedPatient[]>([
    { id: 1, name: "Ravi Singh", phone: "+91 99887 76655", test: "Complete Blood Count", address: "123, MG Road, Sector 14, Gurgaon", collectionComplete: false, paymentStatus: "unpaid", reportStatus: "pending", workflowStep: "assign", assignedPartner: null },
    { id: 2, name: "Meera Gupta", phone: "+91 88776 65544", test: "Lipid Profile", address: "45, Lajpat Nagar, New Delhi", collectionComplete: true, paymentStatus: "paid_online", reportStatus: "uploaded", workflowStep: "sample_received", assignedPartner: { id: 1, name: "Ramesh Kumar", phone: "+91 98765 43210", available: true } },
    { id: 3, name: "Suresh Yadav", phone: "+91 77665 54433", test: "Thyroid Panel", address: "78, Koramangala 4th Block, Bangalore", collectionComplete: false, paymentStatus: "unpaid", reportStatus: "pending", workflowStep: "out_for_collection", assignedPartner: { id: 2, name: "Sunil Sharma", phone: "+91 87654 32109", available: true } },
    { id: 4, name: "Anjali Sharma", phone: "+91 66554 43322", test: "HbA1c", address: "202, Andheri West, Mumbai", collectionComplete: false, paymentStatus: "paid_cash", reportStatus: "pending", workflowStep: "collection_complete", assignedPartner: { id: 4, name: "Amit Patel", phone: "+91 65432 10987", available: true } },
  ]);

  const [cashPaymentDialog, setCashPaymentDialog] = useState<{ open: boolean; patientId: number | null }>({
    open: false,
    patientId: null,
  });

  const [uploadDialog, setUploadDialog] = useState<{ open: boolean; patientId: number | null }>({
    open: false,
    patientId: null,
  });

  const [uploadSuccessDialog, setUploadSuccessDialog] = useState(false);

  // Report preview state
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; patientId: number | null }>({
    open: false,
    patientId: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expanded tiles state
  const [expandedPatients, setExpandedPatients] = useState<Set<number>>(new Set());

  // Assign delivery partner dialog state
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; patientId: number | null }>({
    open: false,
    patientId: null,
  });

  // Calculate dynamic stats based on assignedPatients
  const pendingReportsCount = assignedPatients.filter(p => p.reportStatus === "pending").length;
  const uploadedReportsCount = assignedPatients.filter(p => p.reportStatus === "uploaded").length;

  const stats = [
    { label: "Today's Assigned Patients", value: String(assignedPatients.length), icon: Users, color: "text-primary", expandKey: "patients" },
    { label: "Current Balance", value: `₹${currentBalance.toLocaleString()}`, icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandKey: "balance" },
    { label: "Pending Reports", value: String(pendingReportsCount), icon: Clock, color: "text-[hsl(38_92%_50%)]", expandKey: null },
    { label: "Uploaded Reports", value: String(uploadedReportsCount), icon: CheckCircle, color: "text-secondary", expandKey: null },
  ];

  const toggleCollection = (id: number) => {
    setAssignedPatients(prev => prev.map(p => p.id === id ? { ...p, collectionComplete: !p.collectionComplete } : p));
  };

  const handleUnpaidClick = (id: number) => {
    setCashPaymentDialog({ open: true, patientId: id });
  };

  const handleCashPaymentConfirm = () => {
    if (cashPaymentDialog.patientId) {
      setAssignedPatients(prev => prev.map(p => 
        p.id === cashPaymentDialog.patientId ? { ...p, paymentStatus: "paid_cash" as const } : p
      ));
    }
    setCashPaymentDialog({ open: false, patientId: null });
  };

  const handleCashPaymentCancel = () => {
    setCashPaymentDialog({ open: false, patientId: null });
  };

  const handleUploadClick = (id: number) => {
    setPreviewDialog({ open: true, patientId: id });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for images and PDFs
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handlePreviewConfirm = () => {
    if (selectedFile && previewDialog.patientId) {
      setPreviewDialog({ open: false, patientId: null });
      setUploadDialog({ open: true, patientId: previewDialog.patientId });
    }
  };

  const handlePreviewCancel = () => {
    setPreviewDialog({ open: false, patientId: null });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUploadConfirm = () => {
    if (uploadDialog.patientId) {
      setAssignedPatients(prev => prev.map(p => 
        p.id === uploadDialog.patientId ? { ...p, reportStatus: "uploaded" as const } : p
      ));
    }
    setUploadDialog({ open: false, patientId: null });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccessDialog(true);
  };

  const handleUploadCancel = () => {
    setUploadDialog({ open: false, patientId: null });
  };

  const handleStatClick = (expandKey: string | null) => {
    if (expandKey === "patients") {
      setIsPatientGraphExpanded(!isPatientGraphExpanded);
      setIsBalanceExpanded(false);
    } else if (expandKey === "balance") {
      setIsBalanceExpanded(!isBalanceExpanded);
      setIsPatientGraphExpanded(false);
    }
  };

  // Toggle patient tile expansion
  const togglePatientExpand = (patientId: number) => {
    setExpandedPatients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patientId)) {
        newSet.delete(patientId);
      } else {
        newSet.add(patientId);
      }
      return newSet;
    });
  };

  // Handle assign click
  const handleAssignClick = (patientId: number) => {
    setAssignDialog({ open: true, patientId });
  };

  // Handle delivery partner assignment
  const handleAssignPartner = (partner: DeliveryPartner) => {
    if (assignDialog.patientId) {
      setAssignedPatients(prev => prev.map(p => 
        p.id === assignDialog.patientId 
          ? { ...p, assignedPartner: partner, workflowStep: "out_for_collection" as WorkflowStep } 
          : p
      ));
    }
    setAssignDialog({ open: false, patientId: null });
  };

  // Handle workflow step update
  const updateWorkflowStep = (patientId: number, step: WorkflowStep) => {
    setAssignedPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updates: Partial<AssignedPatient> = { workflowStep: step };
        if (step === "collection_complete") {
          updates.collectionComplete = true;
        }
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  // Get workflow step number
  const getWorkflowStepNumber = (step: WorkflowStep): number => {
    const steps: WorkflowStep[] = ["assign", "out_for_collection", "collection_complete", "payment_done", "sample_received"];
    return steps.indexOf(step) + 1;
  };

  // Check if step is completed
  const isStepCompleted = (patientStep: WorkflowStep, checkStep: WorkflowStep): boolean => {
    return getWorkflowStepNumber(patientStep) > getWorkflowStepNumber(checkStep);
  };

  // Check if step is current
  const isStepCurrent = (patientStep: WorkflowStep, checkStep: WorkflowStep): boolean => {
    return patientStep === checkStep;
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
            <button 
              onClick={() => navigate("/lab/tests")}
              className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
              title="Manage Tests"
            >
              <FlaskConical className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            </button>
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
            const isExpanded = stat.expandKey === "patients" ? isPatientGraphExpanded : stat.expandKey === "balance" ? isBalanceExpanded : false;
            return (
              <GlassCard key={stat.label} className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className={`p-2 lg:p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                    {stat.expandKey && (
                      <button
                        onClick={() => handleStatClick(stat.expandKey)}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {isExpanded ? (
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
        {isPatientGraphExpanded && (
          <div className="mb-8 slide-up">
            <GlassCard className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Patient Statistics</h3>
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={patientTimeFilter === filter.key ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setPatientTimeFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patientChartData[patientTimeFilter]}>
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

        {/* Expandable Balance Section with Transactions */}
        {isBalanceExpanded && (
          <div className="mb-8 slide-up">
            <GlassCard className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Balance Overview</h3>
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={balanceTimeFilter === filter.key ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setBalanceTimeFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Balance Graph */}
              <div className="h-64 lg:h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceChartData[balanceTimeFilter]}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(158 64% 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(158 64% 45%)" stopOpacity={0} />
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
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Balance"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="hsl(158 64% 45%)" 
                      strokeWidth={2}
                      fill="url(#balanceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Transactions List */}
              <div className="border-t border-border pt-6">
                <h4 className="text-base font-semibold text-foreground mb-4">Recent Transactions</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {transactionsData.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === "credit" 
                            ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {transaction.type === "credit" ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        transaction.type === "credit" 
                          ? "text-[hsl(158_64%_45%)]" 
                          : "text-destructive"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
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
            {assignedPatients.map((patient) => {
              const isExpanded = expandedPatients.has(patient.id);
              
              return (
                <GlassCard key={patient.id} className="p-4 lg:p-5 overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground lg:text-lg">{patient.name}</h3>
                      <p className="text-sm lg:text-base text-muted-foreground">{patient.test}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs lg:text-sm text-muted-foreground truncate">{patient.address}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs lg:text-sm text-muted-foreground">{patient.phone}</p>
                      </div>
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

                      {/* 2. Blood Collection + Upload */}
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
                        {patient.reportStatus === "uploaded" ? (
                          <span className="px-2 py-1 text-sm font-medium text-[hsl(158_64%_45%)] bg-[hsl(158_64%_45%)]/10 rounded flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Report Uploaded</span>
                            <span className="sm:hidden">Uploaded</span>
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleUploadClick(patient.id)}
                          >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Upload Final Report</span>
                            <span className="sm:hidden">Upload</span>
                          </Button>
                        )}
                      </div>

                      {/* 3. Payment Status */}
                      <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
                        {patient.paymentStatus === "paid_online" ? (
                          <span className="px-2 py-1 text-sm font-medium text-[hsl(158_64%_45%)] bg-[hsl(158_64%_45%)]/10 rounded flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Paid Online</span>
                            <span className="sm:hidden">Paid</span>
                          </span>
                        ) : patient.paymentStatus === "paid_cash" ? (
                          <span className="px-2 py-1 text-sm font-medium text-[hsl(158_64%_45%)] bg-[hsl(158_64%_45%)]/10 rounded flex items-center gap-1">
                            <Banknote className="w-4 h-4" />
                            <span className="hidden sm:inline">Paid Cash</span>
                            <span className="sm:hidden">Paid</span>
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleUnpaidClick(patient.id)}
                          >
                            <Banknote className="w-4 h-4" />
                            <span className="hidden sm:inline">Unpaid</span>
                            <span className="sm:hidden">Unpaid</span>
                          </Button>
                        )}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => togglePatientExpand(patient.id)}
                        className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        title="View workflow"
                      >
                        <img 
                          src={expandIcon} 
                          alt="Expand" 
                          className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Workflow Section */}
                  {isExpanded && (
                    <div className="mt-6 pt-4 border-t border-border slide-up">
                      <h4 className="text-sm font-semibold text-foreground mb-4">Collection Workflow</h4>
                      
                      {/* Workflow Steps */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                        {/* Step 1: Assign */}
                        <div className="flex items-center gap-2 sm:flex-1">
                          <div 
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                              isStepCompleted(patient.workflowStep, "assign")
                                ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]"
                                : isStepCurrent(patient.workflowStep, "assign")
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : "bg-muted/50 text-muted-foreground"
                            }`}
                            onClick={() => handleAssignClick(patient.id)}
                          >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              {patient.assignedPartner ? patient.assignedPartner.name.split(' ')[0] : 'Assign'}
                            </span>
                            {isStepCompleted(patient.workflowStep, "assign") && <CheckCircle className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        
                        <div className="hidden sm:block w-8 h-0.5 bg-border" />
                        
                        {/* Step 2: Out for Collection */}
                        <div className="flex items-center gap-2 sm:flex-1">
                          <div 
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              isStepCompleted(patient.workflowStep, "out_for_collection")
                                ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)] cursor-default"
                                : isStepCurrent(patient.workflowStep, "out_for_collection")
                                  ? "bg-primary/10 text-primary border border-primary/30 cursor-default"
                                  : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                            <span className="text-xs font-medium">Out for Collection</span>
                            {isStepCompleted(patient.workflowStep, "out_for_collection") && <CheckCircle className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        
                        <div className="hidden sm:block w-8 h-0.5 bg-border" />
                        
                        {/* Step 3: Collection Complete */}
                        <div className="flex items-center gap-2 sm:flex-1">
                          <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              isStepCompleted(patient.workflowStep, "collection_complete")
                                ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]"
                                : isStepCurrent(patient.workflowStep, "collection_complete")
                                  ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                                  : getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("out_for_collection")
                                    ? "bg-muted/50 text-muted-foreground hover:bg-muted cursor-pointer"
                                    : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                            }`}
                            onClick={() => {
                              if (getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("out_for_collection") && !isStepCompleted(patient.workflowStep, "collection_complete")) {
                                updateWorkflowStep(patient.id, "collection_complete");
                              }
                            }}
                            disabled={getWorkflowStepNumber(patient.workflowStep) < getWorkflowStepNumber("out_for_collection")}
                          >
                            <Droplets className="w-4 h-4" />
                            <span className="text-xs font-medium">Collection Complete</span>
                            {isStepCompleted(patient.workflowStep, "collection_complete") && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        
                        <div className="hidden sm:block w-8 h-0.5 bg-border" />
                        
                        {/* Step 4: Payment */}
                        <div className="flex items-center gap-2 sm:flex-1">
                          <div 
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              isStepCompleted(patient.workflowStep, "payment_done") || patient.paymentStatus !== "unpaid"
                                ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]"
                                : isStepCurrent(patient.workflowStep, "payment_done") || (getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("collection_complete") && patient.paymentStatus === "unpaid")
                                  ? "bg-primary/10 text-primary border border-primary/30 cursor-pointer hover:bg-primary/20"
                                  : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                            }`}
                            onClick={() => {
                              if (getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("collection_complete") && patient.paymentStatus === "unpaid") {
                                handleUnpaidClick(patient.id);
                              }
                            }}
                          >
                            {patient.paymentStatus === "paid_online" ? (
                              <>
                                <CreditCard className="w-4 h-4" />
                                <span className="text-xs font-medium">Paid Online</span>
                                <CheckCircle className="w-3.5 h-3.5" />
                              </>
                            ) : patient.paymentStatus === "paid_cash" ? (
                              <>
                                <Banknote className="w-4 h-4" />
                                <span className="text-xs font-medium">Paid Cash</span>
                                <CheckCircle className="w-3.5 h-3.5" />
                              </>
                            ) : (
                              <>
                                <Banknote className="w-4 h-4" />
                                <span className="text-xs font-medium">Payment</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="hidden sm:block w-8 h-0.5 bg-border" />
                        
                        {/* Step 5: Sample Received */}
                        <div className="flex items-center gap-2 sm:flex-1">
                          <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              patient.workflowStep === "sample_received"
                                ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]"
                                : (getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("collection_complete") && patient.paymentStatus !== "unpaid")
                                  ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 cursor-pointer"
                                  : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                            }`}
                            onClick={() => {
                              if (getWorkflowStepNumber(patient.workflowStep) >= getWorkflowStepNumber("collection_complete") && patient.paymentStatus !== "unpaid") {
                                updateWorkflowStep(patient.id, "sample_received");
                              }
                            }}
                            disabled={getWorkflowStepNumber(patient.workflowStep) < getWorkflowStepNumber("collection_complete") || patient.paymentStatus === "unpaid"}
                          >
                            <FlaskRound className="w-4 h-4" />
                            <span className="text-xs font-medium">Sample Received</span>
                            {patient.workflowStep === "sample_received" && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Assigned Partner Info */}
                      {patient.assignedPartner && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Assigned Delivery Partner</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{patient.assignedPartner.name}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{patient.assignedPartner.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cash Payment Confirmation Dialog */}
      <AlertDialog open={cashPaymentDialog.open} onOpenChange={(open) => {
        if (!open) handleCashPaymentCancel();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cash Payment Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Has the patient paid the amount in cash? Please confirm to mark this payment as complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCashPaymentCancel}>
              Payment Not Received
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCashPaymentConfirm}>
              Payment Received Successfully
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Preview Dialog */}
      <Dialog open={previewDialog.open} onOpenChange={(open) => {
        if (!open) handlePreviewCancel();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Report Before Upload
            </DialogTitle>
            <DialogDescription>
              Select a report file to preview before uploading. Supported formats: PDF, JPG, JPEG, PNG.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">Click to select report file</p>
                <p className="text-sm text-muted-foreground">Supports PDF, JPG, JPEG, PNG</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Preview Area */}
                {previewUrl && (
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                    {selectedFile.type.startsWith('image/') ? (
                      <img 
                        src={previewUrl} 
                        alt="Report preview" 
                        className="max-h-[400px] w-auto mx-auto object-contain"
                      />
                    ) : selectedFile.type === 'application/pdf' ? (
                      <iframe
                        src={previewUrl}
                        className="w-full h-[400px]"
                        title="PDF Preview"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handlePreviewCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handlePreviewConfirm}
              disabled={!selectedFile}
            >
              Confirm & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Report Confirmation Dialog */}
      <AlertDialog open={uploadDialog.open} onOpenChange={(open) => {
        if (!open) handleUploadCancel();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upload Final Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload "{selectedFile?.name}" as the final report for this patient? This will mark the report as complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleUploadCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUploadConfirm}>
              Upload Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Success Dialog */}
      <AlertDialog open={uploadSuccessDialog} onOpenChange={setUploadSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[hsl(158_64%_45%)]">
              <CheckCircle className="w-5 h-5" />
              Report Uploaded Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              The final report has been uploaded successfully and is now available for the patient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setUploadSuccessDialog(false)}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Delivery Partner Dialog */}
      <Dialog open={assignDialog.open} onOpenChange={(open) => {
        if (!open) setAssignDialog({ open: false, patientId: null });
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Assign Delivery Partner
            </DialogTitle>
            <DialogDescription>
              Select a delivery partner to assign for sample collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {deliveryPartners.map((partner) => (
              <div
                key={partner.id}
                className={`p-4 rounded-lg border transition-all ${
                  partner.available
                    ? "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                    : "border-border/50 bg-muted/30 opacity-60 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (partner.available) {
                    handleAssignPartner(partner);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{partner.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {partner.phone}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    partner.available
                      ? "bg-[hsl(158_64%_45%)]/10 text-[hsl(158_64%_45%)]"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {partner.available ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAssignDialog({ open: false, patientId: null })}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabDashboard;
