"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Equalizer } from "./decor";

/** Cloudinary: let it pick the best quality/format for each device. */
function optimise(url: string) {
  if (url.includes("res.cloudinary.com") && url.includes("/video/upload/") && !url.includes("q_auto")) {
    return url.replace("/video/upload/", "/video/upload/q_auto,vc_auto/");
  }
  return url;
}

/**
 * Full-width section with a silent looping video in the background and a
 * quote on top. Without a video it shows a slowly zooming photo instead.
 */
export default function VideoFeature({
  video,
  poster,
  quote,
  by,
  children,
}: {
  video?: string;
  poster: string;
  quote: string;
  by: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    // only play while visible (saves battery & data on phones)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative isolate mt-24 flex min-h-[70svh] items-center overflow-hidden sm:mt-32">
      {video ? (
        <video
          ref={ref}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src={optimise(video)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          className="animate-kenburns -z-20 object-cover object-[50%_25%]"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/55 to-black/80" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(35,70,176,0.25),transparent)]"
      />

      <div className="container-x py-24 text-center text-white">
        <Equalizer bars={7} className="mx-auto h-6 text-[#d4af37]" />
        <blockquote className="mx-auto mt-8 max-w-4xl font-display text-3xl italic leading-snug sm:text-5xl">
          “{quote}”
        </blockquote>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37]">— {by}</p>
        {children && <div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
