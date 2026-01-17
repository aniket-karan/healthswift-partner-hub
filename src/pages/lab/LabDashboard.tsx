import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Bell, Clock, CheckCircle, IndianRupee, User, FileText, Check, X, Droplets, Upload, CreditCard, Banknote, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type OrderStatus = "pending" | "accepted" | "declined";
type PaymentMode = "cash" | "online" | null;
type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";
type TransactionType = "credit" | "debit";

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
  test: string;
  orderStatus: OrderStatus;
  collectionComplete: boolean;
  paymentMode: PaymentMode;
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

  const stats = [
    { label: "Today's Assigned Patients", value: "24", icon: Users, color: "text-primary", expandKey: "patients" },
    { label: "Current Balance", value: `₹${currentBalance.toLocaleString()}`, icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandKey: "balance" },
    { label: "Pending Reports", value: "12", icon: Clock, color: "text-[hsl(38_92%_50%)]", expandKey: null },
    { label: "Uploaded Reports", value: "156", icon: CheckCircle, color: "text-secondary", expandKey: null },
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

  const handleStatClick = (expandKey: string | null) => {
    if (expandKey === "patients") {
      setIsPatientGraphExpanded(!isPatientGraphExpanded);
      setIsBalanceExpanded(false);
    } else if (expandKey === "balance") {
      setIsBalanceExpanded(!isBalanceExpanded);
      setIsPatientGraphExpanded(false);
    }
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
