"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { inputCls } from "./FieldInput";

type Entry = {
  id: number;
  created_at: string;
  email: string | null;
  action: "insert" | "update" | "delete";
  entity: string;
  label: string | null;
  changes: string[] | null;
};

export const ENTITY_NAMES: Record<string, string> = {
  fo_events: "Event",
  fo_awards: "Award",
  fo_songs: "Music",
  fo_videos: "Video",
  fo_gallery: "Gallery photo",
  fo_settings: "Settings",
  fo_admins: "Team member",
};

const ACTIONS = {
  insert: { text: "added", Icon: FiPlus, cls: "bg-green-500/15 text-green-700 dark:text-green-400" },
  update: { text: "edited", Icon: FiEdit2, cls: "bg-blue/15 text-blue dark:text-blue-soft" },
  delete: { text: "deleted", Icon: FiTrash2, cls: "bg-red-500/15 text-red-600 dark:text-red-400" },
} as const;

const PAGE = 50;

function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/** Everything anyone on the team added, edited or deleted – newest first. */
export default function ActivityLog({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entity, setEntity] = useState("");
  const [person, setPerson] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(
    async (append = false) => {
      setLoading(true);
      const size = limit ?? PAGE;
      let q = supabase
        .from("fo_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .range(append ? rows.length : 0, (append ? rows.length : 0) + size - 1);
      if (entity) q = q.eq("entity", entity);
      if (person) q = q.eq("email", person);
      const { data, error } = await q;
      if (error) setError(error.message);
      const list = (data as Entry[]) ?? [];
      setRows((prev) => (append ? [...prev, ...list] : list));
      setHasMore(!limit && list.length === size);
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supabase, entity, person, limit]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const people = Array.from(new Set(rows.map((r) => r.email).filter(Boolean))) as string[];

  return (
    <div className={compact ? "" : "max-w-4xl space-y-6"}>
      {!compact && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Activity log</h1>
            <p className="mt-2 text-muted">Every change made in the admin: who, what and when.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className={`${inputCls} !w-auto`} value={entity} onChange={(e) => setEntity(e.target.value)}>
              <option value="">Everything</option>
              {Object.entries(ENTITY_NAMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select className={`${inputCls} !w-auto`} value={person} onChange={(e) => setPerson(e.target.value)}>
              <option value="">Everyone</option>
              {people.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => load(false)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-line hover:border-accent"
              aria-label="Refresh"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-600">{error}</p>}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
        {rows.map((r) => {
          const a = ACTIONS[r.action] ?? ACTIONS.update;
          return (
            <li key={r.id} className="flex items-start gap-3 p-4">
              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${a.cls}`}>
                <a.Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p>
                  <b>{r.email ?? "Someone"}</b> {a.text} {ENTITY_NAMES[r.entity]?.toLowerCase() ?? r.entity}
                  {r.label && (
                    <>
                      {" "}
                      <span className="font-medium text-accent">“{r.label}”</span>
                    </>
                  )}
                </p>
                {r.action === "update" && r.changes && r.changes.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-muted">Changed: {r.changes.join(", ")}</p>
                )}
              </div>
              <time className="shrink-0 text-xs text-muted" dateTime={r.created_at} title={new Date(r.created_at).toLocaleString()}>
                {timeAgo(r.created_at)}
              </time>
            </li>
          );
        })}
        {!loading && rows.length === 0 && <li className="p-8 text-center text-muted">No activity yet.</li>}
        {loading && <li className="p-6 text-center text-muted">Loading…</li>}
      </ul>

      {hasMore && !loading && (
        <button type="button" onClick={() => load(true)} className="btn-outline">
          Load more
        </button>
      )}
    </div>
  );
}
