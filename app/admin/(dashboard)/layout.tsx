import { redirect } from "next/navigation";
import { createAuthClient, supabaseConfigured } from "@/lib/supabase/server";
import AdminNav, { SignOutButton } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <h1 className="font-display text-2xl">Supabase is not set up yet</h1>
          <p className="mt-3 text-sm text-muted">
            Create a <code>.env.local</code> file with your Supabase URL and key
            (see <code>.env.example</code> and the README), then restart the server.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Only people listed in the fo_admins table may use the dashboard
  const { data: admin } = await supabase
    .from("fo_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md space-y-4 rounded-2xl border border-line bg-card p-8 text-center">
          <h1 className="font-display text-2xl">No admin access</h1>
          <p className="text-sm text-muted">
            You are signed in as <b>{user.email}</b>, but this account is not an admin of this
            website. Add it to the <code>fo_admins</code> table in Supabase (see the last step in
            <code> supabase/schema.sql</code>), then reload this page.
          </p>
          <SignOutButton />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <AdminNav email={user.email ?? ""} />
      <main className="flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
