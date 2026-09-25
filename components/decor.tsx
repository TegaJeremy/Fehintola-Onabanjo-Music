/* Decorative bits (no JavaScript needed). */

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Animated music equalizer bars. */
export function Equalizer({
  bars = 5,
  className,
}: {
  bars?: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("inline-flex h-4 items-end gap-[3px]", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="eq-bar block h-full w-[3px] rounded-full bg-current"
          style={{ animationDelay: `${(i * 0.17) % 0.9}s`, animationDuration: `${0.8 + (i % 3) * 0.2}s` }}
        />
      ))}
    </span>
  );
}

/** Endless scrolling strip of words. */
export function TextMarquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee-pause relative overflow-hidden border-y border-accent/30 bg-accent py-4 text-accent-fg">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap [--marquee-speed:40s]">
        {[...row, ...row].map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-xl italic sm:text-2xl">
            {item}
            <span className="text-base not-italic text-blue">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two rows of photos sliding in opposite directions ("Moments"). */
export function PhotoMarquee({ images, alt }: { images: string[]; alt: string }) {
  const half = Math.ceil(images.length / 2);
  const rows = [images.slice(0, half), images.slice(half)];
  return (
    <div className="marquee-pause space-y-4 overflow-hidden">
      {rows.map((row, r) => {
        const items = [...row, ...row, ...row, ...row];
        return (
          <div
            key={r}
            className={cn(
              "flex w-max gap-4 [--marquee-speed:60s]",
              r === 0 ? "animate-marquee" : "animate-marquee-reverse"
            )}
          >
            {items.map((src, i) => (
              <div
                key={src + i}
                className={cn(
                  "group relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl sm:h-80 sm:w-60",
                  i % 2 ? "rotate-1" : "-rotate-1"
                )}
              >
                <Image
                  src={src}
                  alt={`${alt} ${(i % row.length) + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover object-top grayscale-[40%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Soft glowing gold blobs for backgrounds. */
export function GlowBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="animate-float absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div
        className="animate-float absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue/15 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
    </div>
  );
}
