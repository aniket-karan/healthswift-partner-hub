import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  Calendar, 
  Users, 
  ClipboardList, 
  TrendingUp,
  Bell,
  User,
  Activity,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
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

// Sample data for different time filters - Session stats
const sessionChartData = {
  daily: [
    { name: "9 AM", sessions: 1 },
    { name: "10 AM", sessions: 2 },
    { name: "11 AM", sessions: 2 },
    { name: "12 PM", sessions: 1 },
    { name: "1 PM", sessions: 0 },
    { name: "2 PM", sessions: 2 },
    { name: "3 PM", sessions: 3 },
    { name: "4 PM", sessions: 2 },
  ],
  weekly: [
    { name: "Mon", sessions: 8 },
    { name: "Tue", sessions: 10 },
    { name: "Wed", sessions: 7 },
    { name: "Thu", sessions: 12 },
    { name: "Fri", sessions: 9 },
    { name: "Sat", sessions: 5 },
    { name: "Sun", sessions: 3 },
  ],
  monthly: [
    { name: "Week 1", sessions: 35 },
    { name: "Week 2", sessions: 42 },
    { name: "Week 3", sessions: 38 },
    { name: "Week 4", sessions: 48 },
  ],
  yearly: [
    { name: "Jan", sessions: 120 },
    { name: "Feb", sessions: 140 },
    { name: "Mar", sessions: 165 },
    { name: "Apr", sessions: 150 },
    { name: "May", sessions: 180 },
    { name: "Jun", sessions: 170 },
    { name: "Jul", sessions: 195 },
    { name: "Aug", sessions: 210 },
    { name: "Sep", sessions: 185 },
    { name: "Oct", sessions: 200 },
    { name: "Nov", sessions: 220 },
    { name: "Dec", sessions: 240 },
  ],
};

// Sample transaction data
const transactionsData: Transaction[] = [
  { id: 1, description: "Session - Rajesh Kumar", amount: 1200, type: "credit", date: "2024-01-14", time: "10:30 AM" },
  { id: 2, description: "Equipment purchase", amount: 5000, type: "debit", date: "2024-01-14", time: "09:15 AM" },
  { id: 3, description: "Session - Meena Devi", amount: 1200, type: "credit", date: "2024-01-13", time: "04:20 PM" },
  { id: 4, description: "Clinic rent", amount: 15000, type: "debit", date: "2024-01-13", time: "02:00 PM" },
  { id: 5, description: "Session - Arun Joshi", amount: 1500, type: "credit", date: "2024-01-13", time: "11:45 AM" },
  { id: 6, description: "Session - Sunita Sharma", amount: 1200, type: "credit", date: "2024-01-12", time: "03:30 PM" },
  { id: 7, description: "Electricity bill", amount: 2800, type: "debit", date: "2024-01-12", time: "10:00 AM" },
  { id: 8, description: "Session - Vikram Singh", amount: 1500, type: "credit", date: "2024-01-11", time: "05:15 PM" },
];

// Balance chart data for different time filters
const balanceChartData = {
  daily: [
    { name: "9 AM", balance: 65000 },
    { name: "10 AM", balance: 66200 },
    { name: "11 AM", balance: 61200 },
    { name: "12 PM", balance: 62400 },
    { name: "1 PM", balance: 62400 },
    { name: "2 PM", balance: 59600 },
    { name: "3 PM", balance: 60800 },
    { name: "4 PM", balance: 62500 },
  ],
  weekly: [
    { name: "Mon", balance: 55000 },
    { name: "Tue", balance: 58500 },
    { name: "Wed", balance: 56200 },
    { name: "Thu", balance: 61800 },
    { name: "Fri", balance: 60500 },
    { name: "Sat", balance: 62200 },
    { name: "Sun", balance: 62500 },
  ],
  monthly: [
    { name: "Week 1", balance: 48000 },
    { name: "Week 2", balance: 55000 },
    { name: "Week 3", balance: 52500 },
    { name: "Week 4", balance: 62500 },
  ],
  yearly: [
    { name: "Jan", balance: 32000 },
    { name: "Feb", balance: 38500 },
    { name: "Mar", balance: 42000 },
    { name: "Apr", balance: 38200 },
    { name: "May", balance: 45500 },
    { name: "Jun", balance: 50000 },
    { name: "Jul", balance: 47800 },
    { name: "Aug", balance: 54500 },
    { name: "Sep", balance: 58200 },
    { name: "Oct", balance: 62800 },
    { name: "Nov", balance: 62500 },
    { name: "Dec", balance: 72000 },
  ],
};

const PhysioDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isLoading } = useAuth();
  const [isSessionGraphExpanded, setIsSessionGraphExpanded] = useState(false);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [sessionTimeFilter, setSessionTimeFilter] = useState<TimeFilter>("daily");
  const [balanceTimeFilter, setBalanceTimeFilter] = useState<TimeFilter>("daily");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "physiotherapist") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  // Calculate current balance from transactions
  const currentBalance = useMemo(() => {
    return transactionsData.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 80000); // Starting balance
  }, []);

  const stats = [
    { label: "Today's Sessions", value: "8", icon: Calendar, color: "text-primary", expandKey: "sessions" },
    { label: "Current Balance", value: `₹${currentBalance.toLocaleString()}`, icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandKey: "balance" },
    { label: "Pending Reports", value: "5", icon: ClipboardList, color: "text-[hsl(38_92%_50%)]", expandKey: null },
    { label: "Active Patients", value: "45", icon: Users, color: "text-secondary", expandKey: null },
  ];

  const quickActions = [
    { label: "View Sessions", icon: Calendar, path: "/physio/sessions" },
    { label: "Patient Records", icon: Users, path: "/physio/patients" },
    { label: "Progress Reports", icon: ClipboardList, path: "/physio/reports" },
  ];

  const handleStatClick = (expandKey: string | null) => {
    if (expandKey === "sessions") {
      setIsSessionGraphExpanded(!isSessionGraphExpanded);
      setIsBalanceExpanded(false);
    } else if (expandKey === "balance") {
      setIsBalanceExpanded(!isBalanceExpanded);
      setIsSessionGraphExpanded(false);
    }
  };

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 rounded-xl bg-primary/10">
              <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm lg:text-base text-muted-foreground">Welcome back</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Physio Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/physio/profile")}
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
            const isExpanded = stat.expandKey === "sessions" ? isSessionGraphExpanded : stat.expandKey === "balance" ? isBalanceExpanded : false;
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

        {/* Expandable Session Graph */}
        {isSessionGraphExpanded && (
          <div className="mb-8 slide-up">
            <GlassCard className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Session Statistics</h3>
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={sessionTimeFilter === filter.key ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setSessionTimeFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionChartData[sessionTimeFilter]}>
                    <defs>
                      <linearGradient id="physioSessionGradient" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="sessions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#physioSessionGradient)" 
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
                      <linearGradient id="physioBalanceGradient" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#physioBalanceGradient)" 
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
        <div className="mb-8 slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <GlassCard
                  key={action.label}
                  elevated
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-4 p-4 lg:p-5"
                >
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{action.label}</span>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysioDashboard;
