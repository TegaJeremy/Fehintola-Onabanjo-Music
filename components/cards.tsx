import Image from "next/image";
import {
  FiAward,
  FiCalendar,
  FiExternalLink,
  FiMapPin,
  FiPlay,
} from "react-icons/fi";
import { SiAudiomack, SiSpotify, SiYoutube } from "react-icons/si";
import type { Award, EventItem, Song, Video } from "@/lib/types";
import { formatDate, tr, youtubeThumb } from "@/lib/utils";
import { site } from "@/lib/site";

export function EventCard({
  event,
  locale,
  ticketLabel,
  past = false,
}: {
  event: EventItem;
  locale: string;
  ticketLabel: string;
  past?: boolean;
}) {
  const d = new Date(event.starts_at);
  const day = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(d);
  const month = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "Africa/Lagos",
  }).format(d);
  const description = tr(event.description, locale);

  return (
    <article
      className={`card flex flex-col sm:flex-row ${past ? "opacity-75" : ""}`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 sm:aspect-auto sm:w-48">
        <Image
          src={event.image_url || site.images.events}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          className="object-cover object-top"
        />
        <div className="absolute left-3 top-3 rounded-xl bg-bg/90 px-3 py-2 text-center backdrop-blur">
          <p className="font-display text-2xl leading-none text-accent">{day}</p>
          <p className="text-xs font-semibold uppercase tracking-wider">{month}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-semibold">
          {tr(event.title, locale)}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <FiCalendar className="shrink-0 text-accent" />
            {formatDate(event.starts_at, locale, true)}
          </span>
          {(event.venue || event.city) && (
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="shrink-0 text-accent" />
              {[event.venue, event.city].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-fg/80">{description}</p>}
        {event.ticket_url && !past && (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-auto self-start !py-2"
          >
            {ticketLabel} <FiExternalLink />
          </a>
        )}
      </div>
    </article>
  );
}

export function SongCard({
  song,
  listenLabel,
  typeLabel,
}: {
  song: Song;
  listenLabel: string;
  typeLabel: string;
}) {
  return (
    <a
      href={song.audiomack_url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="play"
      className="group card block h-full transition duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10"
    >
      <div className="relative aspect-square">
        <Image
          src={song.cover_url || site.images.music}
          alt={song.title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover object-top transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/40">
          <span className="grid h-14 w-14 scale-75 place-items-center rounded-full bg-accent text-accent-fg opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
            <FiPlay className="ml-1 h-6 w-6" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {typeLabel}
          {song.release_date ? ` · ${song.release_date.slice(0, 4)}` : ""}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold">{song.title}</h3>
        <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted group-hover:text-accent">
          <PlatformIcon url={song.audiomack_url} /> {listenLabel}
        </p>
      </div>
    </a>
  );
}

/** Shows the right logo for where the song link goes. */
function PlatformIcon({ url }: { url: string }) {
  if (/youtu\.?be/.test(url)) return <SiYoutube />;
  if (url.includes("spotify")) return <SiSpotify />;
  return <SiAudiomack />;
}

export function VideoCard({
  video,
  locale,
}: {
  video: Video;
  locale: string;
}) {
  const thumb =
    youtubeThumb(video.youtube_url) || video.thumbnail || site.images.videos;
  const title = tr(video.title, locale);
  return (
    <a
      href={video.youtube_url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="play"
      className="group card block h-full transition duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10"
    >
      <div className="relative aspect-video">
        <Image
          src={thumb}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/45">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white shadow-xl transition group-hover:scale-110">
            <FiPlay className="ml-1 h-7 w-7" />
          </span>
        </div>
      </div>
      <h3 className="p-4 font-display text-lg font-semibold">{title}</h3>
    </a>
  );
}

export function AwardCard({ award, locale }: { award: Award; locale: string }) {
  const description = tr(award.description, locale);
  return (
    <article className="card flex gap-4 p-5">
      {award.image_url ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
          <Image src={award.image_url} alt="" fill sizes="80px" className="object-cover" />
        </div>
      ) : (
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
          <FiAward className="h-6 w-6" />
        </div>
      )}
      <div>
        {award.year && (
          <p className="text-xs font-semibold tracking-widest text-accent">
            {award.year}
          </p>
        )}
        <h3 className="font-display text-lg font-semibold">
          {tr(award.title, locale)}
        </h3>
        {award.organization && (
          <p className="text-sm text-muted">{award.organization}</p>
        )}
        {description && <p className="mt-2 text-sm text-fg/80">{description}</p>}
      </div>
    </article>
  );
}

/** Compact one-line event row (home page). */
export function EventRow({
  event,
  locale,
  tag,
  past = false,
}: {
  event: EventItem;
  locale: string;
  tag: string;
  past?: boolean;
}) {
  const d = new Date(event.starts_at);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en", { ...o, timeZone: "Africa/Lagos" }).format(d);
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const inner = (
    <>
      <span
        className={`grid w-14 shrink-0 place-items-center rounded-xl py-1.5 text-center leading-none ${
          past ? "bg-fg/5 text-muted" : "bg-accent text-accent-fg"
        }`}
      >
        <span className="font-display text-xl">{fmt({ day: "2-digit" })}</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
          {fmt({ month: "short" })}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-display text-lg ${past ? "text-fg/70" : ""}`}>
          {tr(event.title, locale)}
        </span>
        {place && (
          <span className="flex items-center gap-1.5 truncate text-sm text-muted">
            <FiMapPin className="shrink-0" /> {place}
          </span>
        )}
      </span>
      <span
        className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider sm:inline ${
          past ? "bg-fg/5 text-muted" : "bg-blue/15 text-blue dark:text-blue-soft"
        }`}
      >
        {tag}
      </span>
      {event.ticket_url && !past && <FiExternalLink className="shrink-0 text-accent" />}
    </>
  );
  const cls = `group flex items-center gap-4 border-b border-line py-4 transition ${
    past ? "opacity-80" : "hover:translate-x-1"
  }`;
  return event.ticket_url && !past ? (
    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
