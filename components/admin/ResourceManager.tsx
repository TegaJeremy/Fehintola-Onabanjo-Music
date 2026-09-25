"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { revalidateSite } from "@/app/admin/actions";
import { resources, type Resource, type ResourceKey } from "./resources";
import FieldInput from "./FieldInput";

type Row = Record<string, unknown> & { id: string };

/** Shows a list of items with Add / Edit / Delete for one table. */
export default function ResourceManager({ resource }: { resource: ResourceKey }) {
  const config: Resource = resources[resource];
  const fields = config.fields;
  const supabase = useMemo(() => createClient(), []);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(config.table)
      .select("*")
      .order(config.orderBy.column, {
        ascending: config.orderBy.ascending,
        nullsFirst: false,
      });
    if (error) setMessage({ type: "error", text: error.message });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [supabase, config]);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    const empty: Record<string, unknown> = {};
    fields.forEach((f) => {
      empty[f.name] = f.type.startsWith("i18n") ? {} : f.type === "select" ? f.options?.[0]?.value ?? "" : "";
    });
    setForm(empty);
    setEditing("new");
    setMessage(null);
  }

  function openEdit(row: Row) {
    setForm({ ...row });
    setEditing(row);
    setMessage(null);
  }

  function clean(data: Record<string, unknown>) {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      let v = data[f.name];
      if (typeof v === "string") v = v.trim() || null;
      if (f.type.startsWith("i18n") && v && typeof v === "object") {
        const entries = Object.entries(v as Record<string, string>).filter(
          ([, s]) => s?.trim()
        );
        v = entries.length ? Object.fromEntries(entries) : null;
      }
      out[f.name] = v ?? null;
    }
    return out;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const missing = fields.find((f) => {
      if (!f.required) return false;
      const v = form[f.name];
      if (f.type.startsWith("i18n")) return !(v as Record<string, string>)?.en?.trim();
      return v === "" || v == null;
    });
    if (missing) {
      setMessage({ type: "error", text: `Please fill in "${missing.label}".` });
      return;
    }

    setSaving(true);
    const payload = clean(form);
    const { error } =
      editing === "new"
        ? await supabase.from(config.table).insert(payload)
        : await supabase.from(config.table).update(payload).eq("id", (editing as Row).id);
    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    await revalidateSite();
    setEditing(null);
    setMessage({ type: "ok", text: "Saved! The website is updated." });
    load();
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete this ${config.singular}? This cannot be undone.`)) return;
    const { error } = await supabase.from(config.table).delete().eq("id", row.id);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    await revalidateSite();
    setMessage({ type: "ok", text: "Deleted." });
    load();
  }

  const display = (row: Row, key?: string) => {
    if (!key) return "";
    const v = row[key];
    if (v == null) return "";
    if (typeof v === "object") return (v as Record<string, string>).en ?? "";
    if (key === "starts_at")
      return new Date(String(v)).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    return String(v);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">{config.title}</h1>
        <button type="button" onClick={openNew} className="btn-primary !py-2.5">
          <FiPlus /> Add {config.singular}
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : "bg-red-500/15 text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          Nothing here yet. Click <b>Add {config.singular}</b> to create the first one.
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {rows.map((row) => {
            const img = config.listImage ? (row[config.listImage] as string) : "";
            return (
              <li key={row.id} className="flex items-center gap-4 p-4">
                {config.listImage && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg-soft">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {display(row, config.listTitle) || "(no title)"}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {display(row, config.listSubtitle)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent hover:text-accent"
                  aria-label="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  onClick={() => remove(row)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-red-500 hover:text-red-500"
                  aria-label="Delete"
                >
                  <FiTrash2 />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* ---------- Add / edit panel ---------- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setEditing(null)}>
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-xl flex-col bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-xl font-semibold">
                {editing === "new" ? `Add ${config.singular}` : `Edit ${config.singular}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-bg-soft"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {fields.map((f) => (
                <FieldInput
                  key={f.name}
                  field={f}
                  value={form[f.name]}
                  onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
                />
              ))}
              {message?.type === "error" && (
                <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {message.text}
                </p>
              )}
            </div>
            <div className="flex gap-3 border-t border-line p-5">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
