import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle,
  Bell,
  User,
  HeartPulse,
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

// Sample data for different time filters - Test stats
const testChartData = {
  daily: [
    { name: "9 AM", tests: 3 },
    { name: "10 AM", tests: 5 },
    { name: "11 AM", tests: 6 },
    { name: "12 PM", tests: 4 },
    { name: "1 PM", tests: 2 },
    { name: "2 PM", tests: 5 },
    { name: "3 PM", tests: 7 },
    { name: "4 PM", tests: 4 },
  ],
  weekly: [
    { name: "Mon", tests: 20 },
    { name: "Tue", tests: 28 },
    { name: "Wed", tests: 22 },
    { name: "Thu", tests: 32 },
    { name: "Fri", tests: 25 },
    { name: "Sat", tests: 15 },
    { name: "Sun", tests: 10 },
  ],
  monthly: [
    { name: "Week 1", tests: 95 },
    { name: "Week 2", tests: 120 },
    { name: "Week 3", tests: 105 },
    { name: "Week 4", tests: 135 },
  ],
  yearly: [
    { name: "Jan", tests: 380 },
    { name: "Feb", tests: 420 },
    { name: "Mar", tests: 480 },
    { name: "Apr", tests: 440 },
    { name: "May", tests: 520 },
    { name: "Jun", tests: 490 },
    { name: "Jul", tests: 550 },
    { name: "Aug", tests: 580 },
    { name: "Sep", tests: 540 },
    { name: "Oct", tests: 570 },
    { name: "Nov", tests: 600 },
    { name: "Dec", tests: 650 },
  ],
};

// Sample transaction data
const transactionsData: Transaction[] = [
  { id: 1, description: "ECG Test - Ramesh Verma", amount: 500, type: "credit", date: "2024-01-14", time: "10:30 AM" },
  { id: 2, description: "ECG machine maintenance", amount: 3500, type: "debit", date: "2024-01-14", time: "09:15 AM" },
  { id: 3, description: "ECG Test - Kavita Jain", amount: 500, type: "credit", date: "2024-01-13", time: "04:20 PM" },
  { id: 4, description: "Electrode supplies", amount: 2000, type: "debit", date: "2024-01-13", time: "02:00 PM" },
  { id: 5, description: "ECG Test - Prakash Reddy", amount: 650, type: "credit", date: "2024-01-13", time: "11:45 AM" },
  { id: 6, description: "ECG Test - Anita Desai", amount: 500, type: "credit", date: "2024-01-12", time: "03:30 PM" },
  { id: 7, description: "Electricity bill", amount: 2200, type: "debit", date: "2024-01-12", time: "10:00 AM" },
  { id: 8, description: "ECG Test - Sunil Chauhan", amount: 650, type: "credit", date: "2024-01-11", time: "05:15 PM" },
  { id: 9, description: "Staff salary", amount: 12000, type: "debit", date: "2024-01-10", time: "12:00 PM" },
  { id: 10, description: "ECG Test - Preeti Nair", amount: 500, type: "credit", date: "2024-01-10", time: "09:30 AM" },
];

// Balance chart data for different time filters
const balanceChartData = {
  daily: [
    { name: "9 AM", balance: 38000 },
    { name: "10 AM", balance: 38500 },
    { name: "11 AM", balance: 35000 },
    { name: "12 PM", balance: 35500 },
    { name: "1 PM", balance: 35500 },
    { name: "2 PM", balance: 33500 },
    { name: "3 PM", balance: 34000 },
    { name: "4 PM", balance: 35200 },
  ],
  weekly: [
    { name: "Mon", balance: 30000 },
    { name: "Tue", balance: 33500 },
    { name: "Wed", balance: 31200 },
    { name: "Thu", balance: 35800 },
    { name: "Fri", balance: 34500 },
    { name: "Sat", balance: 36200 },
    { name: "Sun", balance: 35200 },
  ],
  monthly: [
    { name: "Week 1", balance: 28000 },
    { name: "Week 2", balance: 32000 },
    { name: "Week 3", balance: 30500 },
    { name: "Week 4", balance: 35200 },
  ],
  yearly: [
    { name: "Jan", balance: 18000 },
    { name: "Feb", balance: 22500 },
    { name: "Mar", balance: 26000 },
    { name: "Apr", balance: 23200 },
    { name: "May", balance: 28500 },
    { name: "Jun", balance: 32000 },
    { name: "Jul", balance: 29800 },
    { name: "Aug", balance: 34500 },
    { name: "Sep", balance: 32200 },
    { name: "Oct", balance: 36800 },
    { name: "Nov", balance: 35200 },
    { name: "Dec", balance: 42000 },
  ],
};

const EcgDashboard = () => {
  const navigate = useNavigate();
  const { user, role, isLoading } = useAuth();
  const [isTestGraphExpanded, setIsTestGraphExpanded] = useState(false);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
  const [testTimeFilter, setTestTimeFilter] = useState<TimeFilter>("daily");
  const [balanceTimeFilter, setBalanceTimeFilter] = useState<TimeFilter>("daily");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (!isLoading && role && role !== "ecg_lab") {
      navigate("/role-select", { replace: true });
    }
  }, [isLoading, user, role, navigate]);

  // Calculate current balance from transactions
  const currentBalance = useMemo(() => {
    return transactionsData.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 55000); // Starting balance
  }, []);

  const stats = [
    { label: "Today's Tests", value: "24", icon: HeartPulse, color: "text-red-500", expandKey: "tests" },
    { label: "Current Balance", value: `₹${currentBalance.toLocaleString()}`, icon: IndianRupee, color: "text-[hsl(158_64%_45%)]", expandKey: "balance" },
    { label: "Pending Reports", value: "8", icon: Clock, color: "text-[hsl(38_92%_50%)]", expandKey: null },
    { label: "Completed", value: "16", icon: CheckCircle, color: "text-[hsl(158_64%_45%)]", expandKey: null },
  ];

  const quickActions = [
    { label: "Upload ECG", icon: Upload, path: "/ecg/upload" },
    { label: "View Reports", icon: FileText, path: "/ecg/reports" },
    { label: "Pending Tests", icon: Clock, path: "/ecg/pending" },
  ];

  const handleStatClick = (expandKey: string | null) => {
    if (expandKey === "tests") {
      setIsTestGraphExpanded(!isTestGraphExpanded);
      setIsBalanceExpanded(false);
    } else if (expandKey === "balance") {
      setIsBalanceExpanded(!isBalanceExpanded);
      setIsTestGraphExpanded(false);
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
            <div className="p-2 lg:p-3 rounded-xl bg-red-500/10">
              <HeartPulse className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm lg:text-base text-muted-foreground">Welcome back</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">ECG Lab Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/ecg/profile")}
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
            const isExpanded = stat.expandKey === "tests" ? isTestGraphExpanded : stat.expandKey === "balance" ? isBalanceExpanded : false;
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

        {/* Expandable Test Graph */}
        {isTestGraphExpanded && (
          <div className="mb-8 slide-up">
            <GlassCard className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground">ECG Test Statistics</h3>
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={testTimeFilter === filter.key ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setTestTimeFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={testChartData[testTimeFilter]}>
                    <defs>
                      <linearGradient id="ecgTestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
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
                      dataKey="tests" 
                      stroke="hsl(0 84% 60%)" 
                      strokeWidth={2}
                      fill="url(#ecgTestGradient)" 
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
                      <linearGradient id="ecgBalanceGradient" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#ecgBalanceGradient)" 
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
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <Icon className="w-6 h-6 text-red-500" />
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

export default EcgDashboard;
