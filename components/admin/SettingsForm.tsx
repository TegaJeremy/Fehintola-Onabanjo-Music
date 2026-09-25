"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateSite } from "@/app/admin/actions";
import { site, type SocialKey } from "@/lib/site";
import { SOCIALS } from "@/components/SocialLinks";
import { settingsFields, settingsGroups } from "./resources";
import FieldInput, { inputCls } from "./FieldInput";

/** Site-wide settings: tagline, bio, contact details and social links. */
export default function SettingsForm() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("fo_settings").select("*").eq("id", 1).maybeSingle();
      if (error) setMessage({ type: "error", text: error.message });
      if (data) {
        setForm(data);
        setSocials((data.socials as Record<string, string>) ?? {});
      }
      setLoading(false);
    })();
  }, [supabase]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() };
    for (const f of settingsFields) {
      let v = form[f.name];
      if (typeof v === "string") v = v.trim() || null;
      if (v && typeof v === "object") {
        const entries = Object.entries(v as Record<string, string>).filter(([, s]) => s?.trim());
        v = entries.length ? Object.fromEntries(entries) : null;
      }
      payload[f.name] = v ?? null;
    }
    payload.socials = Object.fromEntries(
      Object.entries(socials).filter(([, v]) => v?.trim()).map(([k, v]) => [k, v.trim()])
    );

    const { error } = await supabase.from("fo_settings").upsert(payload);
    setSaving(false);
    if (error) return setMessage({ type: "error", text: error.message });
    await revalidateSite();
    setMessage({ type: "ok", text: "Settings saved! The website is updated." });
  }

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-8">
      <h1 className="font-display text-3xl font-semibold">Settings</h1>

      {settingsGroups.map((g) => (
        <section key={g.title} className="space-y-5 rounded-2xl border border-line bg-card p-6">
          <div>
            <h2 className="font-semibold">{g.title}</h2>
            {g.help && <p className="text-sm text-muted">{g.help}</p>}
          </div>
          <div className={g.fields.every((f) => f.type === "image") ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
            {g.fields.map((f) => (
              <FieldInput
                key={f.name}
                field={f}
                value={form[f.name]}
                onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-4 rounded-2xl border border-line bg-card p-6">
        <div>
          <h2 className="font-semibold">Social media links</h2>
          <p className="text-sm text-muted">
            Only the ones you fill in show on the website. For WhatsApp you can type the
            number with country code, e.g. 2348012345678.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(SOCIALS) as SocialKey[]).map((key) => {
            const { label, Icon } = SOCIALS[key];
            return (
              <label key={key} className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <Icon /> {label}
                </span>
                <input
                  className={inputCls}
                  value={socials[key] ?? ""}
                  placeholder={site.socials[key] || (key === "whatsapp" ? "234…" : "https://")}
                  onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
                />
              </label>
            );
          })}
        </div>
      </section>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : "bg-red-500/15 text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
