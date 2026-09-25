"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FiArrowUpRight } from "react-icons/fi";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Equalizer } from "./decor";

const NAV = ["home", "music", "videos", "events", "about", "contact"] as const;
const HREF: Record<(typeof NAV)[number], string> = {
  home: "/",
  music: "/music",
  videos: "/videos",
  events: "/events",
  about: "/about",
  contact: "/contact",
};

export default function Header({ logo }: { logo?: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close menu when the page changes
  useEffect(() => setOpen(false), [pathname]);

  // glass background after scrolling a little
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // stop the page behind the menu from scrolling + close on Escape
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500",
          open
            ? "bg-transparent"
            : scrolled
              ? "border-b border-line/70 bg-bg/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "border-b border-transparent bg-gradient-to-b from-bg/70 to-transparent"
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-2">
          <Link href="/" aria-label="Home" className="relative z-10 min-w-0">
            <Logo src={logo} />
          </Link>

          {/* desktop links */}
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
            {NAV.map((key) => (
              <Link
                key={key}
                href={HREF[key]}
                className={cn(
                  "group relative py-1 text-sm font-medium transition hover:text-accent",
                  isActive(HREF[key]) ? "text-accent" : "text-fg/80"
                )}
              >
                {t(`nav.${key}`)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300",
                    isActive(HREF[key]) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex shrink-0 items-center gap-1 sm:gap-2">
            <LanguageSwitcher label={t("language.label")} />
            <ThemeToggle label={t("theme.toggle")} />

            {/* animated burger */}
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-blue text-white shadow-lg shadow-blue/20 transition active:scale-90 sm:h-10 sm:w-10 xl:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("nav.menu")}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-0.5 w-4 rounded bg-current transition duration-300",
                    open && "top-[5px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[5px] h-0.5 w-3 rounded bg-current transition duration-300",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[10px] h-0.5 w-4 rounded bg-current transition duration-300",
                    open && "top-[5px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- full-screen mobile menu ---------- */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] xl:hidden",
          open ? "[clip-path:circle(150%_at_calc(100%_-_2.5rem)_2rem)]" : "pointer-events-none [clip-path:circle(0%_at_calc(100%_-_2.5rem)_2rem)]"
        )}
      >
        {/* decoration */}
        <div aria-hidden className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-blue/15 blur-3xl" />
        <p
          aria-hidden
          className="pointer-events-none absolute -bottom-4 left-0 select-none whitespace-nowrap font-display text-[26vw] font-bold leading-none text-fg/[0.04]"
        >
          Fehintola
        </p>

        <nav className="container-x relative mt-20 flex flex-1 flex-col justify-center gap-1 pb-6" aria-label="Mobile">
          {NAV.map((key, i) => (
            <Link
              key={key}
              href={HREF[key]}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${150 + i * 55}ms` : "0ms" }}
              className={cn(
                "group flex items-baseline gap-4 border-b border-line/60 py-2.5 transition duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
            >
              <span className="w-6 font-sans text-xs tabular-nums text-muted">0{i + 1}</span>
              <span
                className={cn(
                  "font-display text-[1.55rem] leading-tight transition group-hover:translate-x-2 group-hover:text-accent sm:text-4xl",
                  isActive(HREF[key]) ? "text-accent" : "text-fg"
                )}
              >
                {t(`nav.${key}`)}
              </span>
              {isActive(HREF[key]) && <Equalizer className="ml-auto text-accent" />}
            </Link>
          ))}
        </nav>

        <div
          style={{ transitionDelay: open ? "550ms" : "0ms" }}
          className={cn(
            "container-x relative space-y-5 pb-10 transition duration-500",
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div>
            <p className="eyebrow mb-3">{t("language.label")}</p>
            <LanguageSwitcher label={t("language.label")} variant="pills" />
          </div>
          <Link
            href="/contact"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="btn-primary w-full"
          >
            {t("home.ctaTitle")} <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </>
  );
}
