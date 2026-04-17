import { TaskStatus, STATUS_LABEL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const map: Record<TaskStatus, string> = {
    pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
    progress: "bg-status-progress/10 text-status-progress border-status-progress/20",
    done: "bg-status-done/10 text-status-done border-status-done/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        map[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
