import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { SiAudiomack, SiYoutube } from "react-icons/si";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { tr } from "@/lib/utils";
import {
  getAwardsOrDummy,
  getGallery,
  getSettings,
  getSongsOrDummy,
  getPastEvents,
  getUpcomingEventsOrDummy,
  getVideosOrDummy,
  resolveSite,
} from "@/lib/data";
import HeroSlider from "@/components/HeroSlider";
import { SectionHeading } from "@/components/ui";
import { AwardCard, EventRow, SongCard, VideoCard } from "@/components/cards";
import { PhotoMarquee, TextMarquee, GlowBlobs } from "@/components/decor";
import { CountUp, CurtainReveal, Magnetic, Parallax, Reveal, Tilt } from "@/components/motion";
import { StreamingPlatforms } from "@/components/sections";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [settings, songs, events, pastEvents, videos, awards, gallery] = await Promise.all([
    getSettings(),
    getSongsOrDummy(4),
    getUpcomingEventsOrDummy(3),
    getPastEvents(3),
    getVideosOrDummy(8),
    getAwardsOrDummy(4),
    getGallery(),
  ]);
  const links = resolveSite(settings);
  const bio = tr(settings?.bio, locale) || t("about.bio");

  const slides = ([1, 2, 3] as const).map((n, i) => ({
    image: links.heroSlides[i % links.heroSlides.length],
    eyebrow: t(`hero.s${n}Eyebrow`),
    title: t(`hero.s${n}Title`),
    text: n === 1 ? tr(settings?.tagline, locale) || t("hero.s1Text") : t(`hero.s${n}Text`),
  }));

  // Moments = photos uploaded in admin "Gallery" + the local photos
  const moments = [...gallery.map((g) => g.image_url), ...site.images.carousel];

  const stats = [
    { value: links.stats.songs, suffix: "+", label: t("home.statSongs") },
    { value: links.stats.albums, suffix: "", label: t("home.statAlbums") },
    { value: links.stats.subscribers, suffix: "+", label: t("home.statSubs") },
    { value: links.stats.views, suffix: "K+", label: t("home.statViews") },
  ];

  return (
    <>
      {/* ================= HERO SLIDESHOW ================= */}
      <HeroSlider slides={slides} name={site.name} nowPlaying={`${t("hero.nowPlaying")} · ${songs[0]?.title ?? ""}`} logo={links.logo}>
        <Magnetic>
          <a href={links.audiomack} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <SiAudiomack /> {t("hero.listen")}
          </a>
        </Magnetic>
        <Magnetic>
          <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <SiYoutube /> {t("hero.watch")}
          </a>
        </Magnetic>
      </HeroSlider>

      {/* ================= TICKER ================= */}
      <TextMarquee
        items={[site.name, t("hero.s2Title"), "Ara Edide", t("home.ctaTitle"), t("home.streamTitle")]}
      />

      {/* ================= ABOUT TEASER + STATS ================= */}
      <section className="container-x mt-32 grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <CurtainReveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src={site.images.about}
              alt={site.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_30%]"
            />
          </CurtainReveal>
          <Parallax offset={40} className="absolute -bottom-10 -right-4 hidden w-44 sm:block">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border-4 border-bg shadow-2xl">
              <Image src={site.images.aboutAlt} alt="" width={300} height={400} className="h-full w-full object-cover object-top" />
            </div>
          </Parallax>
        </div>
        <div>
          <Reveal>
            <p className="eyebrow">{t("home.aboutEyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("home.aboutTitle")}</h2>
            <p className="mt-6 line-clamp-6 text-lg leading-relaxed text-fg/85">{bio}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic className="mt-8 inline-block">
              <Link href="/about" className="btn-outline">
                {t("home.readMore")} <FiArrowRight />
              </Link>
            </Magnetic>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-10 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <p className="text-gold-blue font-display text-4xl font-semibold">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EVENTS (short list: upcoming first, then past) ================= */}
      <section className="container-x mt-24 sm:mt-32">
        <Reveal>
          <SectionHeading title={t("nav.events")} href="/events" linkLabel={t("home.viewAll")} />
        </Reveal>
        {events.length + pastEvents.length > 0 ? (
          <div className="border-t border-line">
            {[
              ...events.map((e) => ({ e, past: false })),
              ...pastEvents.map((e) => ({ e, past: true })),
            ]
              .slice(0, 4)
              .map(({ e, past }, i) => (
                <Reveal key={e.id} delay={i * 0.06} y={16}>
                  <EventRow
                    event={e}
                    locale={locale}
                    past={past}
                    tag={past ? t("events.pastTag") : t("events.upcoming")}
                  />
                </Reveal>
              ))}
          </div>
        ) : (
          <p className="flex items-center gap-2 border-y border-line py-5 text-muted">
            <FiCalendar className="text-accent" /> {t("events.empty")}
          </p>
        )}
        <Reveal className="mt-6">
          <Link href="/events" className="btn-outline">
            {t("home.viewAll")} <FiArrowRight />
          </Link>
        </Reveal>
      </section>

      {/* ================= LATEST MUSIC ================= */}
      <section className="container-x mt-32">
        <Reveal>
          <SectionHeading title={t("home.latestMusic")} href="/music" linkLabel={t("home.viewAll")} />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {songs.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1} className="h-full">
              <Tilt className="h-full">
                <SongCard song={s} listenLabel={t("music.listen")} typeLabel={t(`music.${s.type}`)} />
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= STREAMING PLATFORMS ================= */}
      <StreamingPlatforms audiomack={links.audiomack} spotify={links.spotify} youtube={links.youtube} />

      {/* ================= VIDEOS (8) ================= */}
      <section className="relative isolate mt-32 py-24">
        <div className="absolute inset-0 -z-10 bg-bg-soft" />
        <GlowBlobs />
        <div className="container-x">
          <Reveal>
            <SectionHeading title={t("home.latestVideos")} href="/videos" linkLabel={t("home.viewAll")} />
            <p className="-mt-4 mb-10 text-muted">{t("home.videosText")}</p>
          </Reveal>
          {/* phones: swipe sideways · bigger screens: grid */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {videos.map((v, i) => (
              <Reveal key={v.id} delay={(i % 4) * 0.08} x={0} className="h-full w-[82%] shrink-0 snap-start sm:w-auto">
                <VideoCard video={v} locale={locale} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Magnetic>
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="btn bg-red-600 text-white hover:bg-red-700">
                <SiYoutube /> {t("videos.channel")}
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ================= MOMENTS ================= */}
      <section className="mt-32">
        <Reveal className="container-x">
          <SectionHeading title={t("home.moments")} href="/about" linkLabel={t("home.viewAll")} />
          <p className="-mt-4 mb-10 text-muted">{t("home.momentsText")}</p>
        </Reveal>
        <PhotoMarquee images={moments} alt={site.name} />
      </section>


      {/* ================= AWARDS ================= */}
      {awards.length > 0 && (
        <section className="container-x mt-32">
          <Reveal>
            <SectionHeading title={t("home.awards")} href="/about" linkLabel={t("home.viewAll")} />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {awards.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <AwardCard award={a} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ================= BOOKING CTA ================= */}
      <section className="container-x mt-32">
        <CurtainReveal className="relative isolate overflow-hidden rounded-[2rem]">
          <Image
            src={site.images.cta}
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="-z-10 object-cover object-[center_25%] transition duration-[2s] hover:scale-105"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          <div className="px-6 py-20 text-center text-white sm:py-28">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold sm:text-6xl">{t("home.ctaTitle")}</h2>
              <p className="mx-auto mt-4 max-w-lg text-white/85">{t("home.ctaText")}</p>
            </Reveal>
            <Magnetic className="mt-10 inline-block">
              <Link href="/contact" className="btn bg-[#d4af37] px-8 py-4 text-base text-black hover:bg-[#e6c866]">
                {t("home.ctaButton")} <FiArrowRight />
              </Link>
            </Magnetic>
          </div>
        </CurtainReveal>
      </section>
    </>
  );
}
