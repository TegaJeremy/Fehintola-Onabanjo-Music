"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SHORT: Record<Locale, string> = { en: "EN", yo: "YO", ig: "IG", ha: "HA", pcm: "PCM" };

/** Compact language picker: "🌐 EN ▾" → dropdown with all languages. */
export default function LanguageSwitcher({
  label,
  variant = "compact",
}: {
  label: string;
  variant?: "compact" | "pills";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  function change(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next, scroll: false }));
  }

  // close when clicking outside / pressing Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "pills") {
    return (
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              l === locale
                ? "border-accent bg-accent text-accent-fg"
                : "border-line text-fg/80 hover:border-accent hover:text-accent"
            )}
          >
            {localeNames[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${localeNames[locale]}`}
        className={cn(
          "flex h-9 items-center gap-1 rounded-full border border-line bg-bg/40 px-2.5 text-xs sm:h-10 sm:gap-1.5 sm:px-3 font-semibold tracking-wider backdrop-blur transition hover:border-accent hover:text-accent",
          isPending && "opacity-60"
        )}
      >
        <FiGlobe className="h-4 w-4" />
        {SHORT[locale]}
        <FiChevronDown className={cn("h-3.5 w-3.5 transition max-[379px]:hidden", open && "rotate-180")} />
      </button>

      <ul
        role="listbox"
        aria-label={label}
        className={cn(
          "absolute right-0 top-12 z-50 w-44 origin-top-right overflow-hidden rounded-2xl border border-line bg-card p-1.5 shadow-2xl transition duration-200",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {locales.map((l) => (
          <li key={l}>
            <button
              type="button"
              role="option"
              aria-selected={l === locale}
              onClick={() => change(l)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                l === locale ? "bg-accent/15 text-accent" : "hover:bg-bg-soft"
              )}
            >
              <span>
                {localeNames[l]}
                <span className="ml-2 text-xs text-muted">{SHORT[l]}</span>
              </span>
              {l === locale && <FiCheck />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
