import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  Users,
  ShoppingCart,
  Zap,
  ArrowRight,
  ArrowLeft,
  Bell,
  User,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  type: "patient" | "test" | "action" | "insight";
  priority: "high" | "medium" | "low";
  metadata?: Record<string, any>;
}

const SmartSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "patients" | "tests" | "actions" | "insights">("all");

  // Comprehensive smart data
  const allData = {
    patients: [
      { id: "p1", name: "Ravi Singh", phone: "+91 99887 76655", lastTest: "CBC", status: "active" },
      { id: "p2", name: "Meera Gupta", phone: "+91 88776 65544", lastTest: "Lipid Profile", status: "active" },
      { id: "p3", name: "Suresh Yadav", phone: "+91 77665 54433", lastTest: "Thyroid Panel", status: "pending" },
      { id: "p4", name: "Anjali Sharma", phone: "+91 66554 43322", lastTest: "HbA1c", status: "active" },
    ],
    tests: [
      { id: "t1", name: "Complete Blood Count", code: "CBC", demand: "high", price: 850, lastOrdered: "2 days ago" },
      { id: "t2", name: "Lipid Profile", code: "LP", demand: "high", price: 1200, lastOrdered: "1 day ago" },
      { id: "t3", name: "Thyroid Panel", code: "TP", demand: "medium", price: 950, lastOrdered: "3 days ago" },
      { id: "t4", name: "HbA1c Test", code: "HBA1C", demand: "high", price: 750, lastOrdered: "Today" },
      { id: "t5", name: "COVID RT-PCR", code: "COVID", demand: "low", price: 500, lastOrdered: "1 week ago" },
    ],
    actions: [
      { id: "a1", title: "Follow up with Ravi Singh", description: "Patient due for routine check-up", priority: "high" },
      { id: "a2", title: "Restock CBC reagents", description: "Stock level below 20%", priority: "high" },
      { id: "a3", title: "Calibrate analyzer machine", description: "Monthly maintenance overdue", priority: "medium" },
    ],
    insights: [
      {
        id: "i1",
        title: "Peak Demand Alert",
        description: "CBC tests up 35% this week. Increase inventory.",
        metric: "+35%",
      },
      {
        id: "i2",
        title: "Revenue Opportunity",
        description: "Thyroid panels could generate ₹8,400 more revenue/month.",
        metric: "₹8.4k",
      },
      { id: "i3", title: "Customer Retention", description: "23 patients haven't ordered in 60+ days.", metric: "23" },
    ],
  };

  // Smart search engine
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const results: SmartSuggestion[] = [];

    // Search patients
    if (selectedFilter === "all" || selectedFilter === "patients") {
      allData.patients.forEach((patient) => {
        if (
          patient.name.toLowerCase().includes(query) ||
          patient.phone.includes(query) ||
          patient.lastTest.toLowerCase().includes(query)
        ) {
          results.push({
            id: patient.id,
            title: patient.name,
            description: `Phone: ${patient.phone} | Last test: ${patient.lastTest}`,
            type: "patient",
            priority: patient.status === "pending" ? "high" : "low",
            metadata: patient,
          });
        }
      });
    }

    // Search tests
    if (selectedFilter === "all" || selectedFilter === "tests") {
      allData.tests.forEach((test) => {
        if (
          test.name.toLowerCase().includes(query) ||
          test.code.toLowerCase().includes(query)
        ) {
          results.push({
            id: test.id,
            title: test.name,
            description: `Code: ${test.code} | Price: ₹${test.price} | Demand: ${test.demand}`,
            type: "test",
            priority: test.demand === "high" ? "high" : test.demand === "medium" ? "medium" : "low",
            metadata: test,
          });
        }
      });
    }

    // Search actions
    if (selectedFilter === "all" || selectedFilter === "actions") {
      allData.actions.forEach((action) => {
        if (
          action.title.toLowerCase().includes(query) ||
          action.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: action.id,
            title: action.title,
            description: action.description,
            type: "action",
            priority: action.priority as "high" | "medium" | "low",
            metadata: action,
          });
        }
      });
    }

    // Search insights
    if (selectedFilter === "all" || selectedFilter === "insights") {
      allData.insights.forEach((insight) => {
        if (
          insight.title.toLowerCase().includes(query) ||
          insight.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: insight.id,
            title: insight.title,
            description: insight.description,
            type: "insight",
            priority: "high",
            metadata: insight,
          });
        }
      });
    }

    // Sort by priority
    return results.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [searchQuery, selectedFilter]);

  // Smart recommendations (when no search)
  const smartRecommendations: SmartSuggestion[] = !searchQuery
    ? [
        {
          id: "rec1",
          title: "Follow up: Ravi Singh",
          description: "Due for routine check-up • Last visit: 30 days ago",
          type: "action",
          priority: "high",
        },
        {
          id: "rec2",
          title: "Popular: Complete Blood Count",
          description: "High demand this week • Revenue: ₹850/test",
          type: "test",
          priority: "high",
        },
        {
          id: "rec3",
          title: "Urgent: Restock CBC Reagents",
          description: "Inventory below 20% • Order now",
          type: "action",
          priority: "high",
        },
        {
          id: "rec4",
          title: "Insight: Peak Hour Pattern",
          description: "2-4 PM is your busiest time • Staff accordingly",
          type: "insight",
          priority: "medium",
        },
      ]
    : [];

  const displayResults = searchQuery ? searchResults : smartRecommendations;

  const getIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "test":
        return <ShoppingCart className="w-5 h-5 text-purple-500" />;
      case "action":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "insight":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Search className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-700";
      case "medium":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-blue-500/20 text-blue-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
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
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Smart Search</h1>
              <p className="text-sm text-muted-foreground mt-1">AI-powered search & recommendations</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/lab/profile")}
            className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-colors"
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <GlassCard className="p-4 lg:p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search patients, tests, actions, or insights... (e.g., 'Ravi', 'CBC', 'high demand')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["all", "patients", "tests", "actions", "insights"].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter as any)}
                className="capitalize"
              >
                {filter === "all" ? (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    All
                  </>
                ) : (
                  filter
                )}
              </Button>
            ))}
          </div>
        </GlassCard>

        {/* Results */}
        <div className="space-y-3">
          {displayResults.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "No results found. Try a different search." : "Type to search or use filters"}
              </p>
            </GlassCard>
          ) : (
            <>
              {!searchQuery && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Smart Recommendations
                  </h2>
                </div>
              )}
              {displayResults.map((result) => (
                <GlassCard key={result.id} className="p-4 lg:p-6 hover:shadow-elevated transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(result.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{result.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getPriorityBadge(result.priority)}`}>
                            {result.priority}
                          </span>
                          <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full capitalize">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors ml-2">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </>
          )}
        </div>

        {/* Smart Tips */}
        {!searchQuery && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Quick Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <GlassCard className="p-3 text-sm text-muted-foreground border-l-2 border-l-blue-500">
                💡 Try searching by patient name, phone number, or last test name
              </GlassCard>
              <GlassCard className="p-3 text-sm text-muted-foreground border-l-2 border-l-green-500">
                🎯 Use filters to narrow down your search to specific categories
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearch;
