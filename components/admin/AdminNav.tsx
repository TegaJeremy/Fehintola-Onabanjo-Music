"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiExternalLink,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMenu,
  FiMusic,
  FiSettings,
  FiUsers,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/admin", label: "Overview", Icon: FiGrid },
  { href: "/admin/events", label: "Events", Icon: FiCalendar },
  { href: "/admin/awards", label: "Awards", Icon: FiAward },
  { href: "/admin/music", label: "Music", Icon: FiMusic },
  { href: "/admin/videos", label: "Videos", Icon: FiVideo },
  { href: "/admin/gallery", label: "Gallery", Icon: FiImage },
  { href: "/admin/settings", label: "Settings & socials", Icon: FiSettings },
  { href: "/admin/team", label: "Team & access", Icon: FiUsers },
  { href: "/admin/activity", label: "Activity log", Icon: FiActivity },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-accent text-accent-fg" : "text-fg/80 hover:bg-bg-soft"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-3 border-t border-line pt-4 text-sm">
      <a href="/" target="_blank" className="flex items-center gap-2 text-muted hover:text-accent">
        <FiExternalLink /> View website
      </a>
      <p className="truncate text-xs text-muted">{email}</p>
      <div className="flex items-center gap-2">
        <ThemeToggle label="Light / dark" />
        <button type="button" onClick={signOut} className="btn-outline !px-4 !py-2 text-xs">
          <FiLogOut /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-card px-4 py-3 lg:hidden">
        <span className="font-display text-lg">Fehintola <span className="text-accent">Admin</span></span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center">
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-72 flex-col gap-6 bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><FiX /></button>
            </div>
            <div className="flex-1">{nav}</div>
            {footer}
          </aside>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-line bg-card p-5 lg:flex">
        <span className="font-display text-xl">Fehintola <span className="text-accent">Admin</span></span>
        <div className="flex-1">{nav}</div>
        {footer}
      </aside>
    </>
  );
}

/** Small sign-out button (used on the "no access" screen). */
export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="btn-outline mx-auto"
    >
      <FiLogOut /> Sign out
    </button>
  );
}
