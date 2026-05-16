"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Calendar, CreditCard, User, Settings, Building2, DollarSign, LogOut, ArrowLeft, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/bookings", label: "My Rentals", icon: Calendar },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: ShieldCheck, adminOnly: true },
  { href: "/admin/units", label: "Manage Units", icon: Building2, adminOnly: true },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar, adminOnly: true },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, adminOnly: true },
  { href: "/admin/customers", label: "Customers", icon: Users, adminOnly: true },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.is_admin === true);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const visibleNavItems = isAdminPage && isAdmin ? adminNavItems : navItems;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-[#111] border-r border-[#2a2a2a] p-4 pt-[72px] overflow-y-auto z-40">
      <div className="space-y-1">
        <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-widest px-3 py-2 mb-2">
          {isAdminPage ? "ADMIN" : "PORTAL"}
        </div>

        {!loading && visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                isActive
                  ? "bg-[rgba(212,0,106,0.12)] text-[#D4006A]"
                  : "text-[#a09a95] hover:bg-[#1a1a1a] hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[#2a2a2a] my-4" />

      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded text-xs text-[#6b6560] font-mono hover:text-[#a09a95] transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> View Site
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[#a09a95] hover:text-[#ef4444] transition-colors mt-1 w-full text-left cursor-pointer bg-transparent border-none"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  );
}
