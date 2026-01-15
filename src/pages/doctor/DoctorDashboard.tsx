import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Calendar, Clock, FileText, Users, Bell, User, IndianRupee, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

// Sample data for different time filters - Patient stats
const patientChartData = {
  daily: [
    { name: "9 AM", patients: 2 },
    { name: "10 AM", patients: 3 },
    { name: "11 AM", patients: 4 },
    { name: "12 PM", patients: 2 },
    { name: "1 PM", patients: 1 },
    { name: "2 PM", patients: 3 },
    { name: "3 PM", patients: 4 },
    { name: "4 PM", patients: 3 },
  ],
  weekly: [
    { name: "Mon", patients: 12 },
    { name: "Tue", patients: 15 },
    { name: "Wed", patients: 10 },
    { name: "Thu", patients: 18 },
    { name: "Fri", patients: 14 },
    { name: "Sat", patients: 8 },
    { name: "Sun", patients: 5 },
  ],
  monthly: [
    { name: "Week 1", patients: 52 },
    { name: "Week 2", patients: 68 },
    { name: "Week 3", patients: 55 },
    { name: "Week 4", patients: 72 },
  ],
  yearly: [
    { name: "Jan", patients: 180 },
    { name: "Feb", patients: 210 },
    { name: "Mar", patients: 245 },
    { name: "Apr", patients: 220 },
    { name: "May", patients: 280 },
    { name: "Jun", patients: 260 },
    { name: "Jul", patients: 310 },
    { name: "Aug", patients: 340 },
    { name: "Sep", patients: 290 },
    { name: "Oct", patients: 320 },
    { name: "Nov", patients: 350 },
    { name: "Dec", patients: 380 },
  ],
};

// Sample transaction data
const transactionsData: Transaction[] = [
  { id: 1, description: "Consultation - Rahul Sharma", amount: 800, type: "credit", date: "2024-01-14", time: "10:30 AM" },
  { id: 2, description: "Medical supplies", amount: 1500, type: "debit", date: "2024-01-14", time: "09:15 AM" },
  { id: 3, description: "Video Consultation - Priya Patel", amount: 600, type: "credit", date: "2024-01-13", time: "04:20 PM" },
  { id: 4, description: "Clinic maintenance", amount: 2000, type: "debit", date: "2024-01-13", time: "02:00 PM" },
  { id: 5, description: "Follow-up - Amit Kumar", amount: 400, type: "credit", date: "2024-01-13", time: "11:45 AM" },
  { id: 6, description: "Consultation - Neha Singh", amount: 800, type: "credit", date: "2024-01-12", time: "03:30 PM" },
  { id: 7, description: "Staff salary", amount: 25000, type: "debit", date: "2024-01-10", time: "12:00 PM" },
  { id: 8, description: "Consultation - Vikram Rao", amount: 800, type: "credit", date: "2024-01-10", time: "09:30 AM" },
];

// Balance chart data for different time filters
const balanceChartData = {
  daily: [
    { name: "9 AM", balance: 85000 },
    { name: "10 AM", balance: 85800 },
    { name: "11 AM", balance: 84300 },
    { name: "12 PM", balance: 85100 },
    { name: "1 PM", balance: 85100 },
    { name: "2 PM", balance: 83100 },
    { name: "3 PM", balance: 83900 },
    { name: "4 PM", balance: 84700 },
  ],
  weekly: [
    { name: "Mon", balance: 78000 },
    { name: "Tue", balance: 82500 },
    { name: "Wed", balance: 80200 },
    { name: "Thu", balance: 84800 },
    { name: "Fri", balance: 83500 },
    { name: "Sat", balance: 85200 },
    { name: "Sun", balance: 84700 },
  ],
  monthly: [
    { name: "Week 1", balance: 72000 },
    { name: "Week 2", balance: 78000 },
    { name: "Week 3", balance: 75500 },
    { name: "Week 4", balance: 84700 },
  ],
  yearly: [
    { name: "Jan", balance: 45000 },
    { name: "Feb", balance: 52500 },
    { name: "Mar", balance: 58000 },
    { name: "Apr", balance: 54200 },
    { name: "May", balance: 62500 },
    { name: "Jun", balance: 68000 },
    { name: "Jul", balance: 65800 },
    { name: "Aug", balance: 72500 },
    { name: "Sep", balance: 78200 },
    { name: "Oct", balance: 82800 },
    { name: "Nov", balance: 84700 },
    { name: "Dec", balance: 92000 },
  ],
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isPatientGraphExpanded, setIsPatientGraphExpanded] = useState(false);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [patientTimeFilter, setPatientTimeFilter] = useState<TimeFilter>("daily");
  const [balanceTimeFilter, setBalanceTimeFilter] = useState<TimeFilter>("daily");

  // Calculate current balance from transactions
  const currentBalance = useMemo(() => {
    return transactionsData.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 100000); // Starting balance
  }, []);

  const stats = [
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "text-primary", expandKey: "patients" },
    { label: "Current Balance", value: `₹${currentBalance.toLocaleString()}`, icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandKey: "balance" },
    { label: "Pending Prescriptions", value: "3", icon: FileText, color: "text-[hsl(38_92%_50%)]", expandKey: null },
    { label: "Total Patients", value: "156", icon: Users, color: "text-secondary", expandKey: null },
  ];

  const upcomingAppointments = [
    { id: 1, name: "Rahul Sharma", time: "10:30 AM", type: "Video Consultation", symptoms: "Fever, Cold" },
    { id: 2, name: "Priya Patel", time: "11:00 AM", type: "Follow-up", symptoms: "Diabetes check" },
    { id: 3, name: "Amit Kumar", time: "11:30 AM", type: "New Patient", symptoms: "Back pain" },
  ];

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
            <p className="text-sm lg:text-base text-muted-foreground">Good Morning</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dr. Anil Mehta</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/doctor/profile")}
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
                      <linearGradient id="doctorPatientGradient" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#doctorPatientGradient)" 
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
                      <linearGradient id="doctorBalanceGradient" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#doctorBalanceGradient)" 
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
                      <span className={`font-semibold ${
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

        {/* Quick Actions */}
        <div className="flex gap-3 lg:gap-4 mb-8 slide-up" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => navigate("/doctor/slots")}
            className="flex-1 py-3 lg:py-4 px-4 lg:px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-button hover:shadow-elevated transition-all lg:text-lg"
          >
            Add Slots
          </button>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="flex-1 py-3 lg:py-4 px-4 lg:px-6 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-card hover:shadow-elevated transition-all lg:text-lg"
          >
            View All
          </button>
        </div>

        {/* Upcoming Appointments */}
        <div className="slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">Upcoming Appointments</h2>
            <button
              onClick={() => navigate("/doctor/appointments")}
              className="text-sm lg:text-base text-primary font-medium hover:underline"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {upcomingAppointments.map((apt) => (
              <GlassCard
                key={apt.id}
                onClick={() => navigate("/doctor/appointments")}
                className="p-4 lg:p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground lg:text-lg">{apt.name}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground">{apt.symptoms}</p>
                  </div>
                  <StatusBadge status="pending" />
                </div>
                <div className="flex items-center gap-4 text-sm lg:text-base text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {apt.time}
                  </span>
                  <span>{apt.type}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
