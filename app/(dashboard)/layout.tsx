import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <DashboardSidebar />
      <main className="lg:ml-[220px] px-4 pt-20 pb-8 lg:px-8 lg:pt-24">{children}</main>
    </div>
  );
}
