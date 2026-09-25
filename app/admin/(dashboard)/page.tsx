import Link from "next/link";
import { FiAward, FiCalendar, FiImage, FiMusic, FiVideo } from "react-icons/fi";
import { createAuthClient } from "@/lib/supabase/server";
import ActivityLog from "@/components/admin/ActivityLog";

const CARDS = [
  { table: "fo_events", label: "Events", href: "/admin/events", Icon: FiCalendar },
  { table: "fo_awards", label: "Awards", href: "/admin/awards", Icon: FiAward },
  { table: "fo_songs", label: "Music", href: "/admin/music", Icon: FiMusic },
  { table: "fo_videos", label: "Videos", href: "/admin/videos", Icon: FiVideo },
  { table: "fo_gallery", label: "Gallery photos", href: "/admin/gallery", Icon: FiImage },
];

export default async function AdminHome() {
  const supabase = await createAuthClient();
  const counts = await Promise.all(
    CARDS.map(async (c) => {
      const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true });
      return count ?? 0;
    })
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-muted">Choose what you want to add or change.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ label, href, Icon }, i) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-2xl border border-line bg-card p-6 transition hover:border-accent"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-3xl font-semibold">{counts[i]}</span>
              <span className="text-sm text-muted">{label}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-12 max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Recent activity</h2>
          <Link href="/admin/activity" className="text-sm font-semibold text-accent hover:underline">
            See all
          </Link>
        </div>
        <ActivityLog limit={6} compact />
      </div>
    </div>
  );
}
