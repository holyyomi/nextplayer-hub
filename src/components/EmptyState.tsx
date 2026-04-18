import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 text-center",
        size === "sm" ? "px-6 py-8" : "px-6 py-14",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-center rounded-2xl bg-card shadow-card",
          size === "sm" ? "h-10 w-10" : "h-12 w-12",
        )}
      >
        <Icon className={cn("text-primary/70", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
      </div>
      <p className={cn("font-semibold", size === "sm" ? "text-sm" : "text-[15px]")}>{title}</p>
      {description && (
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button size="sm" variant="outline" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
