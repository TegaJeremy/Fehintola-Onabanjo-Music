/**
 * ================================================================
 *  MAIN SITE SETTINGS – edit this file to change links & details.
 *  Real details are filled in; anything marked CHECK should be confirmed.
 *  (Anything you fill in on the admin "Settings" page overrides
 *   the links and contact details here.)
 * ================================================================
 */

export const site = {
  name: "Fehintola Onabanjo",
  shortName: "Fehintola",
  description:
    "Official website of Fehintola Onabanjo – Nigerian gospel minister, worship leader and recording artist. Music, videos, events and ministrations.",

  /** Logo shown next to the name. Replace public/logo.svg with the real logo
   *  (or put e.g. logo.png in /public and change this path). */
  logo: "/logo.svg",

  /**
   * While the database is empty, show the starter songs / videos and the
   * DUMMY events / awards in lib/placeholder.ts. Set to false to hide them.
   */
  showPlaceholders: true,

  /** Main streaming links (used by the big buttons) */
  audiomackProfile: "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977",
  spotifyProfile: "https://open.spotify.com/artist/6CCCPYtesTZCt15q9m87fM",
  youtubeChannel: "https://www.youtube.com/@fehintolaonabanjo7204",

  /** Social links – leave "" to hide one */
  socials: {
    instagram: "",
    facebook: "https://www.facebook.com/share/1JVahqsxeh/",
    tiktok: "https://vt.tiktok.com/ZSXmkfQ3R/",
    x: "",
    youtube: "https://www.youtube.com/@fehintolaonabanjo7204",
    audiomack: "https://audiomack.com/fehintola-onabanjo-6a5e49d26d977",
    spotify: "https://open.spotify.com/artist/6CCCPYtesTZCt15q9m87fM",
    appleMusic: "",
    boomplay: "",
    whatsapp: "2348023069417", // CHECK: is this number on WhatsApp?
  },

  /** Bookings & enquiries */
  contact: {
    email: "", // add an email here when she has one
    phone: "+234 802 306 9417",
    phone2: "+234 701 296 1835",
  },

  /** Numbers in the animated stats row (from Audiomack & YouTube, Sept 2026) */
  stats: {
    songs: 15, // tracks on Ara Edide + Itura
    albums: 2,
    subscribers: 1200, // YouTube
    views: 27, // YouTube views, in thousands (shown as 27K+)
  },

  images: {
    /** Hero slideshow: one picture per slide (3 slides) */
    heroSlides: [
      "/images/img_0042.jpg",
      "/images/img_0058.jpg",
      "/images/img_0066.jpg",
    ],
    about: "/images/img_0065.jpg",
    aboutAlt: "/images/img_0060.jpg",
    music: "/images/img_0066.jpg",
    events: "/images/img_0063.jpg",
    videos: "/images/img_0055.jpg",
    contact: "/images/img_0094.jpg",
    cta: "/images/img_0078.jpg",
    /** Photos in the "Moments" slider on the home page */
    carousel: [
      "/images/img_0034.jpg",
      "/images/img_0041.jpg",
      "/images/img_0057.jpg",
      "/images/img_0062.jpg",
      "/images/img_0060.jpg",
      "/images/img_0063.jpg",
      "/images/img_0066.jpg",
      "/images/img_0078.jpg",
      "/images/img_0079.jpg",
      "/images/img_0095.jpg",
    ],
    gallery: [
      "/images/img_0042.jpg",
      "/images/img_0055.jpg",
      "/images/img_0062.jpg",
      "/images/img_0065.jpg",
      "/images/img_0094.jpg",
      "/images/img_0057.jpg",
    ],
  },
};

export type SocialKey = keyof typeof site.socials;
export type Socials = Record<SocialKey, string>;
