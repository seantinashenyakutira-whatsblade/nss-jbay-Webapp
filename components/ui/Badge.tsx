import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "info", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        {
          "badge--success": variant === "success",
          "badge--warning": variant === "warning",
          "badge--error": variant === "error",
          "badge--info": variant === "info",
          "bg-[#333] text-[#a09a95] border border-[#2a2a2a]": variant === "neutral",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
