/**
 * DUMMY CONTENT – shown only while the database has nothing in it
 * (and site.showPlaceholders is true). As soon as you add real items
 * in the admin dashboard, these disappear automatically.
 */
import { site } from "./site";
import type { Award, EventItem, Song, Video } from "./types";

const img = (n: string) => `/images/img_${n}.jpg`;
/** REAL music (covers in /public/images/covers). Newest first. */
const cover = (n: string) => `/images/covers/${n}.jpg`;
const AUDIOMACK_2 = "https://audiomack.com/fehintola-onabanjo";
const ARA_EDIDE = "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977/album/ara-edide";

export const placeholderSongs: Song[] = [
  { id: "p-s1", title: "Emi Mimo", type: "single", cover_url: "https://i.audiomack.com/fehintola-onabanjo/3948e11ced.webp", audiomack_url: `${AUDIOMACK_2}/song/emi-mimo`, release_date: "2025-12-01" },
  { id: "p-s2", title: "Orin Titun", type: "single", cover_url: cover("orin-titun"), audiomack_url: "https://dbplinks.us/orin-titun-fehintola-onabanjo/", release_date: null },
  { id: "p-s3", title: "Omo Olorun", type: "single", cover_url: cover("omo-olorun"), audiomack_url: "https://dbplinks.us/omo-olorun-fehintola-onabanjo/", release_date: null },
  { id: "p-s4", title: "Olugbala", type: "single", cover_url: cover("olugbala"), audiomack_url: "https://dbplinks.us/olugbala-fehintola-onabanjo/", release_date: null },
  { id: "p-s5", title: "Oruko Jesu", type: "single", cover_url: cover("oruko-jesu"), audiomack_url: "https://dbplinks.us/oruko-jesu-fehintola-onabanjo/", release_date: null },
  { id: "p-s6", title: "Great Day", type: "single", cover_url: cover("great-day"), audiomack_url: "https://dbplinks.us/great-day-fehintola-onabanjo/", release_date: null },
  { id: "p-s7", title: "Hosanna", type: "single", cover_url: cover("hosanna"), audiomack_url: AUDIOMACK_2, release_date: null },
  { id: "p-s8", title: "Yahweh", type: "single", cover_url: cover("yahweh"), audiomack_url: AUDIOMACK_2, release_date: null },
  { id: "p-s9", title: "Thanksgiving", type: "single", cover_url: img("0066"), audiomack_url: `${AUDIOMACK_2}/song/thanksgiving`, release_date: null },
  { id: "p-s10", title: "Omo Baba", type: "single", cover_url: "https://i.ytimg.com/vi/1e0GSAPdeEw/hqdefault.jpg", audiomack_url: "https://youtu.be/1e0GSAPdeEw", release_date: null },
  { id: "p-s11", title: "Itura", type: "album", cover_url: "https://i.audiomack.com/fehintola-onabanjo-6a5e49d26d977/e280ca03cc.webp", audiomack_url: "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977/album/itura", release_date: "2023-09-28" },
  { id: "p-s12", title: "Iji Aye", type: "single", cover_url: cover("iji-aye"), audiomack_url: `${AUDIOMACK_2}/song/iji-aye`, release_date: "2023-01-09" },
  { id: "p-s13", title: "Goodness", type: "single", cover_url: cover("goodness"), audiomack_url: ARA_EDIDE, release_date: null },
  { id: "p-s14", title: "Oro", type: "single", cover_url: cover("oro"), audiomack_url: ARA_EDIDE, release_date: null },
  { id: "p-s15", title: "Iwa", type: "single", cover_url: cover("iwa"), audiomack_url: ARA_EDIDE, release_date: null },
  { id: "p-s16", title: "Ara Edide", type: "album", cover_url: "https://i.audiomack.com/fehintola-onabanjo-6a5e49d26d977/8c5ce76025.webp", audiomack_url: ARA_EDIDE, release_date: "2016-01-01" },
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
