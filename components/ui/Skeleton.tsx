import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-[#111] via-[#222] to-[#111] bg-[length:200%_100%] animate-skeleton rounded",
        className
      )}
    />
  );
}
