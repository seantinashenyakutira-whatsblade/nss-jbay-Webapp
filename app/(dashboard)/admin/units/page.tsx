import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2 } from "lucide-react";

export default async function AdminUnitsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/units&domain=hub");

  const { data: units, error } = await supabase.from("units").select("*").order("sqm", { ascending: true });
  if (error) console.error("Failed to fetch units:", error);

  const safeUnits = units || [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Manage Units</h1>
          <p className="text-sm text-[#a09a95]">{safeUnits.length} units</p>
        </div>
        <Button href="/admin/units/new" variant="primary">Add New Unit</Button>
      </div>

      <div className="overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              {["Name", "Size", "Price", "Block", "Availability", "Active", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-mono text-xs text-[#6b6560] uppercase tracking-wider bg-[#111] border-b border-[#2a2a2a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeUnits?.map((u: any) => (
              <tr key={u.id} className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#111]">
                <td className="px-5 py-3.5 text-sm text-white">{u.name}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95] capitalize">{u.size} ({u.sqm} m²)</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">R {Number(u.price_monthly).toLocaleString("en-ZA")}/mo</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{u.block_section || "—"}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={u.availability === "available" ? "success" : u.availability === "few-left" ? "warning" : "error"}>
                    {u.availability === "few-left" ? "Few Left" : u.availability.charAt(0).toUpperCase() + u.availability.slice(1)}
                  </Badge>
                </td>
                <td className="px-5 py-3.5"><Badge variant={u.is_active ? "success" : "error"}>{u.is_active ? "Yes" : "No"}</Badge></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Button href={`/admin/units/${u.id}/edit`} variant="ghost" size="sm"><Edit className="w-3.5 h-3.5" /></Button>
                    {u.is_active && (
                      <form action={`/api/admin/units/${u.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button type="submit" variant="ghost" size="sm" className="text-[#ef4444]"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {safeUnits.length === 0 && (
              <tr><td colSpan={7} className="text-center text-sm text-[#6b6560] py-8">No units found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
