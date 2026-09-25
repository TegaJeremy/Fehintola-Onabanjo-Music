"use server";

import { createAuthClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

type Result = { ok: true; message: string } | { ok: false; message: string };

/** The logged-in person, and whether they are a full admin. */
async function getCaller() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("fo_admins")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return { supabase, user, role: (data?.role as string | undefined) ?? null };
}

/** Find an existing login account by email (e.g. someone already in the project). */
async function findUserId(
  service: NonNullable<ReturnType<typeof createServiceClient>>,
  email: string
) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit.id;
    if (data.users.length < 1000) break;
  }
  return null;
}

/** Add a team member. Creates the login account if it does not exist yet. */
export async function addTeamMember(input: {
  email: string;
  password: string;
  role: "admin" | "editor";
  name: string;
}): Promise<Result> {
  const caller = await getCaller();
  if (!caller || caller.role !== "admin")
    return { ok: false, message: "Only admins can add team members." };

  const service = createServiceClient();
  if (!service)
    return {
      ok: false,
      message:
        "SUPABASE_SERVICE_ROLE_KEY is missing in .env.local (see README), so new accounts can't be created yet.",
    };

  const email = input.email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Please enter a valid email." };
  const role = input.role === "editor" ? "editor" : "admin";

  try {
    let userId = await findUserId(service, email);
    let created = false;

    if (!userId) {
      if (input.password.length < 8)
        return { ok: false, message: "Password must be at least 8 characters." };
      const { data, error } = await service.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
      });
      if (error) {
        return {
          ok: false,
          message: /database error/i.test(error.message)
            ? "Supabase refused to create the account (Database error). This comes from an old trigger in your Supabase project – see the README section 'Database error creating new user'."
            : error.message,
        };
      }
      userId = data.user.id;
      created = true;
    }

    // Insert with the caller's own session so the activity log shows who did it
    const { error } = await caller.supabase.from("fo_admins").upsert({
      user_id: userId,
      email,
      role,
      name: input.name.trim() || null,
      added_by: caller.user.email ?? null,
    });
    if (error) return { ok: false, message: error.message };

    return {
      ok: true,
      message: created
        ? `Account created for ${email}. They can now sign in at /admin with the password you set.`
        : `${email} already had an account – they now have ${role} access.`,
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/** Set a new password for another team member. */
export async function resetMemberPassword(userId: string, password: string): Promise<Result> {
  const caller = await getCaller();
  if (!caller || caller.role !== "admin")
    return { ok: false, message: "Only admins can reset passwords." };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };

  const service = createServiceClient();
  if (!service) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY is missing in .env.local." };

  // only for people on this website's team
  const { data: member } = await caller.supabase
    .from("fo_admins")
    .select("email")
    .eq("user_id", userId)
    .maybeSingle();
  if (!member) return { ok: false, message: "That person is not on the team." };

  const { error } = await service.auth.admin.updateUserById(userId, { password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: `Password updated for ${member.email}.` };
}
