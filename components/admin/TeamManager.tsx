"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiKey, FiShield, FiTrash2, FiUserPlus } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { addTeamMember, resetMemberPassword } from "@/app/admin/team-actions";
import { inputCls } from "./FieldInput";

type Member = {
  user_id: string;
  email: string | null;
  name: string | null;
  role: "admin" | "editor";
  added_by: string | null;
  created_at: string;
};

type Msg = { type: "ok" | "error"; text: string } | null;

function Notice({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p
      className={`rounded-lg px-4 py-3 text-sm ${
        msg.type === "ok"
          ? "bg-green-500/15 text-green-700 dark:text-green-400"
          : "bg-red-500/15 text-red-600 dark:text-red-400"
      }`}
    >
      {msg.text}
    </p>
  );
}

/** Team & access: who can log in to the admin, and what they can do. */
export default function TeamManager() {
  const supabase = useMemo(() => createClient(), []);
  const [me, setMe] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<Msg>(null);

  const [form, setForm] = useState({ email: "", password: "", name: "", role: "editor" as "admin" | "editor" });
  const [busy, setBusy] = useState(false);

  const [myPass, setMyPass] = useState("");
  const [myMsg, setMyMsg] = useState<Msg>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: auth }, { data, error }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("fo_admins").select("*").order("created_at", { ascending: true }),
    ]);
    setMe(auth.user?.id ?? null);
    if (error) setMsg({ type: "error", text: error.message });
    setMembers((data as Member[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const myRole = members.find((m) => m.user_id === me)?.role;
  const isAdmin = myRole === "admin";

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await addTeamMember(form);
    setBusy(false);
    setMsg({ type: res.ok ? "ok" : "error", text: res.message });
    if (res.ok) {
      setForm({ email: "", password: "", name: "", role: "editor" });
      load();
    }
  }

  async function changeRole(m: Member, role: "admin" | "editor") {
    const { error } = await supabase.from("fo_admins").update({ role }).eq("user_id", m.user_id);
    setMsg(error ? { type: "error", text: error.message } : { type: "ok", text: `${m.email} is now ${role}.` });
    load();
  }

  async function remove(m: Member) {
    if (!window.confirm(`Remove ${m.email} from the team? They will no longer be able to use the admin.`)) return;
    const { error } = await supabase.from("fo_admins").delete().eq("user_id", m.user_id);
    setMsg(error ? { type: "error", text: error.message } : { type: "ok", text: `${m.email} was removed.` });
    load();
  }

  async function resetPass(m: Member) {
    const pass = window.prompt(`New password for ${m.email} (at least 8 characters):`);
    if (!pass) return;
    const res = await resetMemberPassword(m.user_id, pass);
    setMsg({ type: res.ok ? "ok" : "error", text: res.message });
  }

  async function changeMyPassword(e: React.FormEvent) {
    e.preventDefault();
    if (myPass.length < 8) return setMyMsg({ type: "error", text: "At least 8 characters, please." });
    const { error } = await supabase.auth.updateUser({ password: myPass });
    setMyMsg(error ? { type: "error", text: error.message } : { type: "ok", text: "Your password was changed." });
    if (!error) setMyPass("");
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Team & access</h1>
        <p className="mt-2 text-muted">
          <b>Admin</b> = full control, including this page. <b>Editor</b> = can add and edit content, but
          can’t manage the team.
        </p>
      </div>

      <Notice msg={msg} />

      {/* ---------- list ---------- */}
      <section className="overflow-hidden rounded-2xl border border-line bg-card">
        {loading ? (
          <p className="p-6 text-muted">Loading…</p>
        ) : (
          <ul className="divide-y divide-line">
            {members.map((m) => {
              const self = m.user_id === me;
              return (
                <li key={m.user_id} className="flex flex-wrap items-center gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-blue text-sm font-bold uppercase text-white">
                    {(m.name || m.email || "?").slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {m.name || m.email} {self && <span className="text-xs text-accent">(you)</span>}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {m.email}
                      {m.added_by && ` · added by ${m.added_by}`}
                    </p>
                  </div>

                  {isAdmin && !self ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={(e) => changeRole(m, e.target.value as "admin" | "editor")}
                        className={`${inputCls} !w-auto !py-2`}
                        aria-label="Role"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => resetPass(m)}
                        title="Set a new password"
                        className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent hover:text-accent"
                      >
                        <FiKey />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(m)}
                        title="Remove from team"
                        className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-red-500 hover:text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                      <FiShield /> {m.role}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------- add ---------- */}
      {isAdmin && (
        <form onSubmit={add} className="space-y-4 rounded-2xl border border-line bg-card p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <FiUserPlus /> Add a person
          </h2>
          <p className="text-sm text-muted">
            If the email already has an account in your Supabase project, the password is not needed –
            they just get access.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Name</span>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email *</span>
              <input
                type="email"
                required
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Password (for new accounts)</span>
              <input
                type="text"
                autoComplete="new-password"
                className={inputCls}
                value={form.password}
                placeholder="At least 8 characters"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Role</span>
              <select
                className={inputCls}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "editor" })}
              >
                <option value="editor">Editor – content only</option>
                <option value="admin">Admin – full control</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
            {busy ? "Adding…" : "Add to team"}
          </button>
        </form>
      )}

      {/* ---------- my password ---------- */}
      <form onSubmit={changeMyPassword} className="space-y-4 rounded-2xl border border-line bg-card p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <FiKey /> Change my password
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="password"
            autoComplete="new-password"
            className={`${inputCls} max-w-xs`}
            placeholder="New password"
            value={myPass}
            onChange={(e) => setMyPass(e.target.value)}
          />
          <button type="submit" className="btn-outline">
            Save
          </button>
        </div>
        <Notice msg={myMsg} />
      </form>
    </div>
  );
}
