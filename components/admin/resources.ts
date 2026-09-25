/**
 * What each admin section looks like: which table, which fields.
 * To add a new field: add a column in Supabase, then add it here.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "date"
  | "datetime"
  | "select"
  | "image"
  | "i18n" // one line, in 4 languages
  | "i18n-textarea"; // paragraph, in 4 languages

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type Resource = {
  table: string;
  title: string; // plural, e.g. "Events"
  singular: string; // e.g. "event"
  orderBy: { column: string; ascending: boolean };
  /** field used as the name in the list */
  listTitle: string;
  /** field shown under the name in the list */
  listSubtitle?: string;
  /** field used as the thumbnail in the list */
  listImage?: string;
  fields: Field[];
};

export const resources = {
  events: {
    table: "fo_events",
    title: "Events",
    singular: "event",
    orderBy: { column: "starts_at", ascending: false },
    listTitle: "title",
    listSubtitle: "starts_at",
    listImage: "image_url",
    fields: [
      { name: "title", label: "Event name", type: "i18n", required: true },
      { name: "starts_at", label: "Date & time", type: "datetime", required: true },
      { name: "venue", label: "Venue", type: "text", placeholder: "e.g. Eko Hotel" },
      { name: "city", label: "City", type: "text", placeholder: "e.g. Lagos" },
      { name: "ticket_url", label: "Ticket / info link", type: "url" },
      { name: "image_url", label: "Flyer / photo", type: "image" },
      { name: "description", label: "Description", type: "i18n-textarea" },
    ],
  },
  awards: {
    table: "fo_awards",
    title: "Awards",
    singular: "award",
    orderBy: { column: "year", ascending: false },
    listTitle: "title",
    listSubtitle: "year",
    listImage: "image_url",
    fields: [
      { name: "title", label: "Award name", type: "i18n", required: true },
      { name: "organization", label: "Given by", type: "text", placeholder: "e.g. Nigerian Music Awards" },
      { name: "year", label: "Year", type: "number", placeholder: "2026" },
      { name: "image_url", label: "Photo (optional)", type: "image" },
      { name: "description", label: "Description", type: "i18n-textarea" },
    ],
  },
  songs: {
    table: "fo_songs",
    title: "Music",
    singular: "song / album",
    orderBy: { column: "release_date", ascending: false },
    listTitle: "title",
    listSubtitle: "type",
    listImage: "cover_url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { value: "single", label: "Single" },
          { value: "album", label: "Album" },
          { value: "ep", label: "EP" },
        ],
      },
      {
        name: "audiomack_url",
        label: "Audiomack link",
        type: "url",
        required: true,
        help: "When fans click the song, it opens this link.",
      },
      { name: "cover_url", label: "Cover art", type: "image" },
      { name: "release_date", label: "Release date", type: "date" },
    ],
  },
  videos: {
    table: "fo_videos",
    title: "Videos",
    singular: "video",
    orderBy: { column: "published_at", ascending: false },
    listTitle: "title",
    listSubtitle: "youtube_url",
    fields: [
      { name: "title", label: "Video title", type: "i18n", required: true },
      {
        name: "youtube_url",
        label: "YouTube link",
        type: "url",
        required: true,
        help: "Paste the normal YouTube link. The thumbnail is added automatically.",
      },
      { name: "published_at", label: "Date", type: "date" },
    ],
  },
  gallery: {
    table: "fo_gallery",
    title: "Gallery",
    singular: "photo",
    orderBy: { column: "sort_order", ascending: true },
    listTitle: "caption",
    listSubtitle: "sort_order",
    listImage: "image_url",
    fields: [
      { name: "image_url", label: "Photo", type: "image", required: true },
      { name: "caption", label: "Caption", type: "i18n" },
      { name: "sort_order", label: "Order (smaller shows first)", type: "number", placeholder: "0" },
    ],
  },
} satisfies Record<string, Resource>;

export type ResourceKey = keyof typeof resources;

/** Settings page, grouped into sections. Empty = use the default from lib/site.ts */
export const settingsGroups: { title: string; help?: string; fields: Field[] }[] = [
  {
    title: "Logo & home page photos",
    help: "Upload to replace. Leave empty to keep the current ones.",
    fields: [
      { name: "logo_url", label: "Logo", type: "image" },
      { name: "hero_image_1", label: "Home slideshow – photo 1", type: "image" },
      { name: "hero_image_2", label: "Home slideshow – photo 2", type: "image" },
      { name: "hero_image_3", label: "Home slideshow – photo 3", type: "image" },
    ],
  },
  {
    title: "Text",
    fields: [
      { name: "tagline", label: "Home page tagline (slide 1)", type: "i18n", help: "Leave empty to use the default text." },
      { name: "bio", label: "Biography (About page)", type: "i18n-textarea", help: "Leave a blank line between paragraphs." },
    ],
  },
  {
    title: "Contact & streaming",
    fields: [
      { name: "email", label: "Booking email", type: "text" },
      { name: "phone", label: "Phone number 1", type: "text" },
      { name: "phone2", label: "Phone number 2", type: "text" },
      { name: "audiomack_profile", label: "Audiomack profile link", type: "url" },
      { name: "youtube_channel", label: "YouTube channel link", type: "url" },
    ],
  },
  {
    title: "Numbers (animated counters on the home page)",
    fields: [
      { name: "stat_songs", label: "Songs released", type: "number" },
      { name: "stat_albums", label: "Albums", type: "number" },
      { name: "stat_subscribers", label: "YouTube subscribers", type: "number" },
      { name: "stat_views", label: "YouTube views (in thousands, e.g. 27 = 27K)", type: "number" },
    ],
  },
];

export const settingsFields: Field[] = settingsGroups.flatMap((g) => g.fields);
