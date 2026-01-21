import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Award,
  Target,
  AlertCircle,
  ArrowLeft,
  Bell,
  User,
} from "lucide-react";

const LabAnalytics = () => {
  const navigate = useNavigate();

  // Revenue trend data
  const revenueTrend = [
    { month: "Jan", revenue: 45000, target: 50000 },
    { month: "Feb", revenue: 52000, target: 50000 },
    { month: "Mar", revenue: 48000, target: 50000 },
    { month: "Apr", revenue: 61000, target: 60000 },
    { month: "May", revenue: 58000, target: 60000 },
    { month: "Jun", revenue: 72000, target: 70000 },
  ];

  // Top tests performed
  const topTests = [
    { name: "CBC", value: 450, color: "#3b82f6" },
    { name: "Lipid Profile", value: 380, color: "#8b5cf6" },
    { name: "Thyroid Panel", value: 320, color: "#ec4899" },
    { name: "HbA1c", value: 290, color: "#f59e0b" },
    { name: "COVID RT-PCR", value: 210, color: "#10b981" },
  ];

  // Monthly test volume
  const testVolume = [
    { week: "Week 1", tests: 145, completed: 142 },
    { week: "Week 2", tests: 168, completed: 165 },
    { week: "Week 3", tests: 152, completed: 150 },
    { week: "Week 4", tests: 189, completed: 187 },
  ];

  // Smart recommendations
  const recommendations = [
    {
      id: 1,
      title: "Increase Lipid Profile Tests",
      description: "High demand detected. Consider offering discounts to boost sales.",
      impact: "Potential +₹8,400/month",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      id: 2,
      title: "Optimize Delivery Partners",
      description: "3 partners underutilized. Consider rotating assignments.",
      impact: "Save 15% operational cost",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      id: 3,
      title: "Peak Hour Performance",
      description: "2-3 PM shows 40% higher orders. Staff accordingly.",
      impact: "Reduce wait time by 25%",
      icon: Target,
      color: "text-blue-500",
    },
  ];

  // KPI Cards
  const kpis = [
    {
      label: "Monthly Revenue",
      value: "₹72,000",
      change: "+18%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Test Completion Rate",
      value: "98.9%",
      change: "+2.1%",
      positive: true,
      icon: Award,
    },
    {
      label: "Avg Delivery Time",
      value: "2.3 hrs",
      change: "-0.5 hrs",
      positive: true,
      icon: TrendingDown,
    },
    {
      label: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      positive: true,
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/lab")}
              className="p-2 rounded-lg bg-card shadow-card border border-border/50 hover:shadow-elevated transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Smart Analytics</h1>
              <p className="text-sm text-muted-foreground mt-1">AI-powered business insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-colors">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button
              onClick={() => navigate("/lab/profile")}
              className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-colors"
            >
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 stagger-children">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <GlassCard key={idx} className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Icon className={`w-5 h-5 ${kpi.positive ? "text-green-500" : "text-red-500"}`} />
                  </div>
                  <span className={`text-xs font-semibold ${kpi.positive ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <GlassCard className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend vs Target</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Actual Revenue" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Test Distribution */}
          <GlassCard className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Tests Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={topTests} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                  {topTests.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {topTests.map((test) => (
                <div key={test.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: test.color }} />
                  <span className="text-muted-foreground">{test.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Test Volume */}
        <GlassCard className="p-4 lg:p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Test Volume & Completion Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Bar dataKey="tests" fill="#3b82f6" name="Total Tests" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Smart Recommendations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI-Powered Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <GlassCard key={rec.id} className="p-4 lg:p-6 border-l-4 border-l-yellow-500">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-6 h-6 ${rec.color}`} />
                    <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                      Smart Tip
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <p className="text-sm font-semibold text-green-600">{rec.impact}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabAnalytics;
