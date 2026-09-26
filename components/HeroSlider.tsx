"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Equalizer } from "./decor";

export type HeroSlide = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
};

const DURATION = 6500; // ms per slide
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Home page hero: photos change with a wipe + slow zoom,
 * and the headline changes word by word.
 */
export default function HeroSlider({
  slides,
  name,
  nowPlaying,
  logo,
  children,
}: {
  slides: HeroSlide[];
  name: string;
  nowPlaying: string;
  logo: string;
  children?: React.ReactNode; // buttons
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const slide = slides[index];

  const go = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    const id = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(id);
  }, [index, go]);

  // gold spotlight that follows the mouse
  function onMove(e: React.MouseEvent) {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const imageMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        animate: { clipPath: "inset(0 0 0 0%)", opacity: 1 },
        exit: { opacity: 0 },
      };

  const words = slide.title.split(" ");

  return (
    <section
      ref={section}
      onMouseMove={onMove}
      className="group/hero relative isolate -mt-16 overflow-hidden md:flex md:min-h-[100svh] md:items-center md:pt-16"
    >
      {/* ---------- photos ----------
          phone: a tall photo box on top (face always visible)
          desktop: photo fills the right 60%, text on the left */}
      <div className="relative h-[68svh] min-h-[420px] w-full md:absolute md:inset-y-0 md:right-0 md:-z-20 md:h-auto md:min-h-0 md:w-[60%]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.image + index}
            className="absolute inset-0 overflow-hidden"
            {...imageMotion}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <Image
              src={slide.image}
              alt={name}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="animate-kenburns origin-top object-cover object-[50%_18%] md:object-[50%_25%]"
            />
          </motion.div>
        </AnimatePresence>
        {/* fade photo into the page */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/70 to-transparent md:h-40" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-bg via-bg/40 to-transparent md:block" />

      </div>

      {/* ---------- mouse spotlight (desktop) ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100 md:block"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 20%, transparent), color-mix(in oklab, var(--blue) 10%, transparent) 45%, transparent 70%)",
        }}
      />

      {/* ---------- big faint name in the background ---------- */}
      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-0 -z-10 hidden select-none whitespace-nowrap font-display text-[16vw] font-bold leading-none text-fg/[0.04] lg:block"
      >
        {name}
      </p>

      {/* ---------- text ---------- */}
      <div className="container-x relative -mt-32 pb-14 md:mt-0 md:pb-0">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="hidden items-center gap-3 md:flex"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" className="h-10 w-10 rounded-full" />
            <h1 className="text-sm font-semibold uppercase tracking-[0.3em] text-fg/80">{name}</h1>
          </motion.div>
          <h1 className="sr-only md:hidden">{name}</h1>

          <div className="min-h-[12.5rem] sm:min-h-[15rem] md:mt-6 md:min-h-[17rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
              >
                <motion.p
                  className="eyebrow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {slide.eyebrow}
                </motion.p>

                <p className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl md:mt-4 lg:text-7xl">
                  {words.map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-1.5 align-bottom">
                      <motion.span
                        className={`inline-block ${i === words.length - 1 ? "text-shimmer" : ""}`}
                        initial={reduce ? false : { y: "110%", opacity: 0, rotate: 4 }}
                        animate={{ y: "0%", opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: EASE }}
                      >
                        {word}&nbsp;
                      </motion.span>
                    </span>
                  ))}
                </p>

                <motion.p
                  className="mt-4 text-base text-fg/85 sm:text-lg md:mt-5 md:text-xl"
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                >
                  {slide.text}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mt-4 flex flex-wrap gap-3 [&_a]:!px-5 sm:[&_a]:!px-6"
          >
            {children}
          </motion.div>

          {/* now playing pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 hidden items-center gap-3 rounded-full border border-line bg-bg/60 px-4 py-2 text-xs font-medium uppercase tracking-widest backdrop-blur md:inline-flex"
          >
            <Equalizer className="text-accent" />
            {nowPlaying}
          </motion.div>
        </div>
      </div>


      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-fg/30 pt-2">
          <span className="animate-scrollhint block h-2 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
