import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
  User,
  X,
  Archive,
} from "lucide-react";

interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
  actionable: boolean;
  action?: string;
  read: boolean;
}

const NotificationsCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "Urgent: High Volume Alert",
      message: "CBC test orders increased by 250% in the last 2 hours. Allocate more resources.",
      timestamp: "2 min ago",
      actionable: true,
      action: "View Analytics",
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Delivery Complete",
      message: "Patient Ravi Singh's sample collection completed successfully.",
      timestamp: "15 min ago",
      actionable: true,
      action: "View Details",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Partner Availability Low",
      message: "Only 1 delivery partner available. 3 patients awaiting collection.",
      timestamp: "1 hr ago",
      actionable: true,
      action: "Manage Partners",
      read: false,
    },
    {
      id: "4",
      type: "info",
      title: "Test Report Ready",
      message: "Lab report for Meera Gupta's Lipid Profile is ready for download.",
      timestamp: "2 hrs ago",
      actionable: true,
      action: "Download Report",
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Monthly Target Achieved",
      message: "Congratulations! You've achieved 108% of your monthly revenue target.",
      timestamp: "5 hrs ago",
      actionable: false,
      read: true,
    },
    {
      id: "6",
      type: "alert",
      title: "Quality Alert",
      message: "2 samples flagged for quality issues. Manual review required.",
      timestamp: "1 day ago",
      actionable: true,
      action: "Review Samples",
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "actionable">("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-500/10 border-l-red-500";
      case "success":
        return "bg-green-500/10 border-l-green-500";
      case "warning":
        return "bg-yellow-500/10 border-l-yellow-500";
      case "info":
        return "bg-blue-500/10 border-l-blue-500";
      default:
        return "bg-muted/50 border-l-muted";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "actionable") return n.actionable;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const actionableCount = notifications.filter((n) => n.actionable).length;

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
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} unread • {actionableCount} actionable items
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/lab/profile")}
            className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-colors"
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            size="sm"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === "actionable" ? "default" : "outline"}
            onClick={() => setFilter("actionable")}
            size="sm"
          >
            Action Required ({actionableCount})
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No notifications to display</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <GlassCard
                key={notification.id}
                className={`p-4 lg:p-6 border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? "bg-opacity-80 border-opacity-100" : "opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.timestamp}
                        </span>
                        {notification.actionable && notification.action && (
                          <Button size="sm" variant="default" className="text-xs h-7">
                            {notification.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(notification.id)}
                      className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Smart Insights */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Smart Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-4 lg:p-6 border-l-4 border-l-blue-500">
              <h4 className="font-semibold text-foreground mb-2">Peak Hour Pattern</h4>
              <p className="text-sm text-muted-foreground">
                Your busiest hours are 2-4 PM. Consider scheduling extra staff during this window to reduce wait times.
              </p>
            </GlassCard>
            <GlassCard className="p-4 lg:p-6 border-l-4 border-l-green-500">
              <h4 className="font-semibold text-foreground mb-2">Revenue Opportunity</h4>
              <p className="text-sm text-muted-foreground">
                Thyroid panels have high demand but low supply. Adding this test could increase revenue by ₹12,000/month.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
