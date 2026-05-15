import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 ml-[220px] p-8 pt-24">{children}</main>
      </div>
    </div>
  );
}
