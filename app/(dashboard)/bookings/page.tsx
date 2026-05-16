import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RentalCard } from "@/components/dashboard/RentalCard";
import { Inbox } from "lucide-react";

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/bookings");
    return;
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, units(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Failed to fetch bookings:", error);

  const safeBookings = bookings || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl mb-1">My Rentals</h1>
          <p className="text-[#a09a95]">Manage your active and past storage rentals</p>
        </div>
        <a href="/units" className="btn btn--primary">Rent Another Unit</a>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#2a2a2a] pb-0 overflow-x-auto">
        {["all", "active", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn px-4 py-3 text-sm text-[#6b6560] border-b-2 border-transparent hover:text-[#a09a95] transition-colors whitespace-nowrap ${tab === "all" ? "!text-[#D4006A] !border-[#D4006A]" : ""}`}
            data-tab={tab}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({safeBookings.filter((b: any) => tab === "all" || b.status === tab || (tab === "cancelled" && b.status === "expired")).length || 0})
          </button>
        ))}
      </div>

      {safeBookings.length > 0 ? (
        <div id="rental-cards-list">
          {safeBookings.map((booking: any) => (
            <RentalCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon"><Inbox className="w-16 h-16 mx-auto text-[#6b6560]" /></div>
          <h3 className="empty-state__title">No rentals yet</h3>
          <p className="empty-state__text">You haven&apos;t rented any storage units yet. Browse our available units and get started today.</p>
          <a href="/units" className="btn btn--primary">Browse Units</a>
        </div>
      )}
    </div>
  );
}
