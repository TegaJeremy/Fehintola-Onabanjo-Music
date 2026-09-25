"use server";

import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/server";

/** After the admin saves something, refresh the public website right away. */
export async function revalidateSite() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  revalidatePath("/", "layout");
  return { ok: true };
}
