import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Check } from "lucide-react";

const DoctorSlots = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    { time: "09:00 AM", status: "available" as const },
    { time: "09:30 AM", status: "busy" as const },
    { time: "10:00 AM", status: "available" as const },
    { time: "10:30 AM", status: "busy" as const },
    { time: "11:00 AM", status: "available" as const },
    { time: "11:30 AM", status: "available" as const },
    { time: "12:00 PM", status: "busy" as const },
    { time: "02:00 PM", status: "available" as const },
    { time: "02:30 PM", status: "available" as const },
    { time: "03:00 PM", status: "available" as const },
  ];

  const [slots, setSlots] = useState(timeSlots);

  const toggleSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index
          ? { ...slot, status: slot.status === "available" ? "busy" : "available" }
          : slot
      )
    );
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="p-5 safe-top">
        <PageHeader title="Manage Slots" subtitle="Set your availability" showBack />

        {/* Calendar Strip */}
        <GlassCard className="mb-6 page-enter">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {dates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-14 py-3 rounded-xl text-center transition-all duration-300 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-button"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  <p className="text-xs font-medium opacity-70">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Time Slots */}
        <div className="mb-6 slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Time Slots</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {slots.map((slot, index) => (
              <button
                key={slot.time}
                onClick={() => toggleSlot(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  slot.status === "available"
                    ? "border-[hsl(158_64%_45%)] bg-[hsl(158_64%_45%/0.1)]"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold ${
                      slot.status === "available" ? "text-[hsl(158_64%_35%)]" : "text-muted-foreground"
                    }`}
                  >
                    {slot.time}
                  </span>
                  <StatusBadge status={slot.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Custom Slot */}
        <GlassCard className="mb-6">
          <button className="w-full flex items-center justify-center gap-2 py-2 text-primary font-semibold">
            <Plus className="w-5 h-5" />
            Add Custom Time Slot
          </button>
        </GlassCard>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-14 rounded-xl text-base font-semibold shadow-button"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 success-check" />
              Saved Successfully
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DoctorSlots;
