import { cn } from "@/lib/utils";

type Status = "available" | "busy" | "pending" | "completed" | "uploaded";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  available: "status-success",
  completed: "status-success",
  uploaded: "status-success",
  busy: "status-warning",
  pending: "status-info",
};

const statusLabels: Record<Status, string> = {
  available: "Available",
  busy: "Busy",
  pending: "Pending",
  completed: "Completed",
  uploaded: "Uploaded",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
