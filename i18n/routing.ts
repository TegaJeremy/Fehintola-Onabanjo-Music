import { defineRouting } from "next-intl/routing";

export const locales = ["en", "yo", "ig", "ha", "pcm"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ig: "Igbo",
  yo: "Yorùbá",
  ha: "Hausa",
  pcm: "Pidgin",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});
