import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Calendar, Clock, FileText, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "text-primary" },
    { label: "Upcoming Slots", value: "12", icon: Clock, color: "text-[hsl(200_85%_50%)]" },
    { label: "Pending Prescriptions", value: "3", icon: FileText, color: "text-[hsl(38_92%_50%)]" },
    { label: "Total Patients", value: "156", icon: Users, color: "text-[hsl(158_64%_45%)]" },
  ];

  const upcomingAppointments = [
    { id: 1, name: "Rahul Sharma", time: "10:30 AM", type: "Video Consultation", symptoms: "Fever, Cold" },
    { id: 2, name: "Priya Patel", time: "11:00 AM", type: "Follow-up", symptoms: "Diabetes check" },
    { id: 3, name: "Amit Kumar", time: "11:30 AM", type: "New Patient", symptoms: "Back pain" },
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
          <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
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
                  <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>

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
