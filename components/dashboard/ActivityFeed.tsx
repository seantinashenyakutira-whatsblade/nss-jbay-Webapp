import { Check, X, Clock, Circle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Activity {
  date: string;
  description: string;
  status: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#6b6560]">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((a, i) => {
        const iconMap: Record<string, React.ElementType> = {
          active: Check,
          completed: Check,
          cancelled: X,
          expired: Clock,
        };
        const IconComponent = iconMap[a.status] || Circle;
        const badgeVariant = a.status === "active" ? "success" : a.status === "completed" ? "info" : "error";

        return (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-[#2a2a2a] last:border-b-0">
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{a.description}</p>
              <span className="font-mono text-xs text-[#6b6560]">{formatDate(a.date)}</span>
            </div>
            <Badge variant={badgeVariant as "success" | "info" | "error"} className="text-[0.65rem]">{a.status}</Badge>
          </div>
        );
      })}
    </div>
  );
}
