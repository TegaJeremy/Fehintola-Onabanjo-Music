import type { Locale } from "@/i18n/routing";

/** A piece of text stored in 4 languages, e.g. { en: "...", yo: "..." } */
export type Translated = Partial<Record<Locale, string>>;

export type EventItem = {
  id: string;
  title: Translated;
  description: Translated | null;
  venue: string | null;
  city: string | null;
  starts_at: string;
  ticket_url: string | null;
  image_url: string | null;
};

export type Award = {
  id: string;
  title: Translated;
  organization: string | null;
  year: number | null;
  description: Translated | null;
  image_url: string | null;
};

export type Song = {
  id: string;
  title: string;
  type: "single" | "album" | "ep";
  cover_url: string | null;
  audiomack_url: string;
  release_date: string | null;
};

export type Video = {
  id: string;
  title: Translated;
  youtube_url: string;
  published_at: string | null;
  /** only used by dummy videos; real ones use the YouTube thumbnail */
  thumbnail?: string;
};

export type GalleryPhoto = {
  id: string;
  image_url: string;
  caption: Translated | null;
  sort_order: number;
};

export type Settings = {
  tagline: Translated | null;
  bio: Translated | null;
  email: string | null;
  phone: string | null;
  audiomack_profile: string | null;
  youtube_channel: string | null;
  socials: Record<string, string> | null;
  logo_url?: string | null;
  phone2?: string | null;
  hero_image_1?: string | null;
  hero_image_2?: string | null;
  hero_image_3?: string | null;
  stat_songs?: number | null;
  stat_albums?: number | null;
  stat_subscribers?: number | null;
  stat_views?: number | null;
  studio_address?: string | null;
  studio_phone?: string | null;
  studio_phone2?: string | null;
  studio_whatsapp?: string | null;
  studio_hours?: string | null;
  studio_tiktok?: string | null;
  studio_image?: string | null;
  studio_map_url?: string | null;
};
