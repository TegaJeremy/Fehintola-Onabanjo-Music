import type { Translated } from "./types";

/** Pick the text for the current language, falling back to English. */
export function tr(value: Translated | null | undefined, locale: string) {
  if (!value) return "";
  return (
    (value as Record<string, string | undefined>)[locale]?.trim() ||
    value.en?.trim() ||
    ""
  );
}

/** Get the video ID from any YouTube link (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/(shorts|embed|live)\/([^/?]+)/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}

export function youtubeThumb(url: string) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function formatDate(iso: string, locale: string, withTime = false) {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Africa/Lagos",
  };
  try {
    return new Intl.DateTimeFormat(locale, opts).format(d);
  } catch {
    return new Intl.DateTimeFormat("en", opts).format(d);
  }
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
