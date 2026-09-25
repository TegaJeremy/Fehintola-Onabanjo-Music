import { cache } from "react";
import { createPublicClient } from "./supabase/server";
import { site, type Socials } from "./site";
import {
  placeholderAwards,
  placeholderEvents,
  placeholderSongs,
  placeholderVideos,
} from "./placeholder";
import type {
  Award,
  EventItem,
  GalleryPhoto,
  Settings,
  Song,
  Video,
} from "./types";

/**
 * All website data comes from here. If Supabase is not set up yet
 * (or a request fails) the site still works and shows empty states.
 */

async function query<T>(
  run: (
    db: NonNullable<ReturnType<typeof createPublicClient>>
  ) => PromiseLike<{ data: T | null; error: unknown }>,
  fallback: T
): Promise<T> {
  const db = createPublicClient();
  if (!db) return fallback;
  try {
    const { data, error } = await run(db);
    if (error) {
      console.error("[supabase]", error);
      return fallback;
    }
    return data ?? fallback;
  } catch (e) {
    console.error("[supabase]", e);
    return fallback;
  }
}

/** Site settings (cached so many components can ask without extra requests). */
export const getSettings = cache(() =>
  query<Settings | null>(
    (db) => db.from("fo_settings").select("*").eq("id", 1).maybeSingle(),
    null
  )
);

export async function getUpcomingEvents(limit?: number) {
  const now = new Date().toISOString();
  return query<EventItem[]>((db) => {
    let q = db
      .from("fo_events")
      .select("*")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true });
    if (limit) q = q.limit(limit);
    return q;
  }, []);
}

export async function getPastEvents(limit = 24) {
  const now = new Date().toISOString();
  return query<EventItem[]>(
    (db) =>
      db
        .from("fo_events")
        .select("*")
        .lt("starts_at", now)
        .order("starts_at", { ascending: false })
        .limit(limit),
    []
  );
}

export function getAwards(limit?: number) {
  return query<Award[]>((db) => {
    let q = db
      .from("fo_awards")
      .select("*")
      .order("year", { ascending: false, nullsFirst: false });
    if (limit) q = q.limit(limit);
    return q;
  }, []);
}

export function getSongs(limit?: number) {
  return query<Song[]>((db) => {
    let q = db
      .from("fo_songs")
      .select("*")
      .order("release_date", { ascending: false, nullsFirst: false });
    if (limit) q = q.limit(limit);
    return q;
  }, []);
}

export function getVideos(limit?: number) {
  return query<Video[]>((db) => {
    let q = db
      .from("fo_videos")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (limit) q = q.limit(limit);
    return q;
  }, []);
}

export function getGallery() {
  return query<GalleryPhoto[]>(
    (db) =>
      db.from("fo_gallery").select("*").order("sort_order", { ascending: true }),
    []
  );
}

/** Use dummy items when the real list is empty (see site.showPlaceholders). */
function orDummy<T>(rows: T[], dummy: T[], limit?: number) {
  if (rows.length || !site.showPlaceholders) return rows;
  return limit ? dummy.slice(0, limit) : dummy;
}

export async function getSongsOrDummy(limit?: number) {
  return orDummy(await getSongs(limit), placeholderSongs, limit);
}
export async function getVideosOrDummy(limit?: number) {
  return orDummy(await getVideos(limit), placeholderVideos, limit);
}
export async function getUpcomingEventsOrDummy(limit?: number) {
  return orDummy(await getUpcomingEvents(limit), placeholderEvents, limit);
}
export async function getAwardsOrDummy(limit?: number) {
  return orDummy(await getAwards(limit), placeholderAwards, limit);
}

/** Links: admin settings win, lib/site.ts values are the fallback. */
export function resolveLinks(settings: Settings | null) {
  const socials = { ...site.socials } as Socials;
  const fromDb = settings?.socials ?? {};
  for (const key of Object.keys(socials) as (keyof Socials)[]) {
    if (fromDb[key]?.trim()) socials[key] = fromDb[key].trim();
  }
  return {
    socials,
    audiomack:
      settings?.audiomack_profile?.trim() ||
      fromDb.audiomack?.trim() ||
      site.audiomackProfile,
    youtube:
      settings?.youtube_channel?.trim() ||
      fromDb.youtube?.trim() ||
      site.youtubeChannel,
    spotify: fromDb.spotify?.trim() || site.spotifyProfile,
    email: settings?.email?.trim() || site.contact.email,
    phone: settings?.phone?.trim() || site.contact.phone,
  };
}

/** A value from the admin if filled in, otherwise the default from lib/site.ts. */
function pick<T>(fromAdmin: T | null | undefined, fallback: T): T {
  if (fromAdmin === null || fromAdmin === undefined) return fallback;
  if (typeof fromAdmin === "string" && !fromAdmin.trim()) return fallback;
  return typeof fromAdmin === "string" ? (fromAdmin.trim() as T) : fromAdmin;
}

/** Everything the admin "Settings" page can override, merged with lib/site.ts. */
export function resolveSite(settings: Settings | null) {
  const s = settings ?? ({} as Partial<Settings>);
  const d = site.images.heroSlides;
  return {
    ...resolveLinks(settings),
    logo: pick(s.logo_url, site.logo),
    phone2: pick(s.phone2, site.contact.phone2),
    heroSlides: [
      pick(s.hero_image_1, d[0]),
      pick(s.hero_image_2, d[1]),
      pick(s.hero_image_3, d[2]),
    ],
    stats: {
      songs: pick(s.stat_songs, site.stats.songs),
      albums: pick(s.stat_albums, site.stats.albums),
      subscribers: pick(s.stat_subscribers, site.stats.subscribers),
      views: pick(s.stat_views, site.stats.views),
    },
  };
}

export type SiteConfig = ReturnType<typeof resolveSite>;
