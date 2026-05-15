import { Package, Calendar, CreditCard, Settings, ArrowRight } from "lucide-react";

const actions = [
  { href: "https://example.com/units", icon: Package, title: "Rent a Unit", desc: "Browse available storage units" },
  { href: "/bookings", icon: Calendar, title: "My Bookings", desc: "View your rental history" },
  { href: "/payments", icon: CreditCard, title: "Payments", desc: "View payment history" },
  { href: "/profile", icon: Settings, title: "Settings", desc: "Update your profile" },
];

export function QuickActions() {
  return (
    <div className="space-y-2">
      {actions.map((a) => (
        <a
          key={a.href}
          href={a.href}
          className="flex items-center gap-4 p-3 rounded border border-[#2a2a2a] bg-[#111] hover:border-[#D4006A] hover:bg-[#1a1a1a] transition-all hover:translate-x-1"
        >
          <div className="w-8 text-center flex-shrink-0">
            <a.icon className="w-6 h-6 text-[#D4006A] mx-auto" />
          </div>
          <div className="flex-1">
            <span className="block text-sm font-medium text-white">{a.title}</span>
            <span className="block text-xs text-[#6b6560]">{a.desc}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6b6560] group-hover:text-[#D4006A] transition-all" />
        </a>
      ))}
    </div>
  );
}
