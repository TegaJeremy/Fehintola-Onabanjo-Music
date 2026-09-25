/**
 * DUMMY CONTENT – shown only while the database has nothing in it
 * (and site.showPlaceholders is true). As soon as you add real items
 * in the admin dashboard, these disappear automatically.
 */
import { site } from "./site";
import type { Award, EventItem, Song, Video } from "./types";

const img = (n: string) => `/images/img_${n}.jpg`;
/** REAL starter music (from her Audiomack / YouTube). */
export const placeholderSongs: Song[] = [
  {
    id: "p-s1",
    title: "Ara Edide",
    type: "album",
    cover_url: "https://i.audiomack.com/fehintola-onabanjo-6a5e49d26d977/8c5ce76025.webp",
    audiomack_url: "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977/album/ara-edide",
    release_date: "2026-07-29",
  },
  {
    id: "p-s2",
    title: "Itura",
    type: "album",
    cover_url: "https://i.audiomack.com/fehintola-onabanjo-6a5e49d26d977/e280ca03cc.webp",
    audiomack_url: "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977/album/itura",
    release_date: "2023-09-28",
  },
  {
    id: "p-s3",
    title: "Omo Baba",
    type: "single",
    cover_url: "https://i.ytimg.com/vi/1e0GSAPdeEw/hqdefault.jpg",
    audiomack_url: "https://youtu.be/1e0GSAPdeEw",
    release_date: null,
  },
  {
    id: "p-s4",
    title: "Iji Aye",
    type: "single",
    cover_url: "https://i.audiomack.com/fehintola-onabanjo/8060142e6f.webp",
    audiomack_url: "https://audiomack.com/fehintola-onabanjo/song/iji-aye",
    release_date: "2023-01-09",
  },
];

/**
 * Videos: the first 2 are REAL. The other 6 are DUMMY cards that open her
 * channel – add the real ones in the admin (just paste each YouTube link).
 */
const realVideos: Video[] = [
  {
    id: "p-v1",
    title: { en: "Omo Baba – Fehintola Onabanjo" },
    youtube_url: "https://www.youtube.com/watch?v=1e0GSAPdeEw",
    published_at: null,
  },
  {
    id: "p-v2",
    title: { en: "Fehintola Onabanjo – 7 Years on Stage with Funmi Aragbaye" },
    youtube_url: "https://www.youtube.com/watch?v=mW3HPC3oNko",
    published_at: null,
  },
];
const dummyTitles = [
  "Live Worship Ministration",
  "Praise & Worship Session",
  "Ara Edide (Album) – Live",
  "Itura – Worship Medley",
  "Ministry Programme Highlights",
  "Behind the Scenes",
];
const dummyThumbs = ["0058", "0060", "0066", "0063", "0057", "0094"];

export const placeholderVideos: Video[] = [
  ...realVideos,
  ...dummyTitles.map((title, i) => ({
    id: `p-v${i + 3}`,
    title: { en: title },
    youtube_url: site.youtubeChannel,
    published_at: null,
    thumbnail: img(dummyThumbs[i]),
  })),
];

/* ---------------- DUMMY awards ---------------- */
/** No dummy events – only real events added in the admin are shown. */
export const placeholderEvents: EventItem[] = [];

export const placeholderAwards: Award[] = [
  { id: "p-a1", title: { en: "Award Name Here" }, organization: "Awarding Organisation", year: 2025, description: null, image_url: null },
  { id: "p-a2", title: { en: "Award Name Here" }, organization: "Awarding Organisation", year: 2024, description: null, image_url: null },
  { id: "p-a3", title: { en: "Award Name Here" }, organization: "Awarding Organisation", year: 2023, description: null, image_url: null },
  { id: "p-a4", title: { en: "Award Name Here" }, organization: "Awarding Organisation", year: 2022, description: null, image_url: null },
];
