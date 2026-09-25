import { getTranslations } from "next-intl/server";
import type { IconType } from "react-icons";
import { FiArrowUpRight } from "react-icons/fi";
import { SiAudiomack, SiSpotify, SiYoutube } from "react-icons/si";
import { site } from "@/lib/site";
import { Reveal, Tilt } from "./motion";

/* ------------------------------------------------------------------ */
/*  Streaming platforms: Audiomack · Spotify · YouTube                 */
/* ------------------------------------------------------------------ */
export async function StreamingPlatforms({
  audiomack,
  spotify,
  youtube,
}: {
  audiomack: string;
  spotify: string;
  youtube: string;
}) {
  const t = await getTranslations("home");
  const platforms: { name: string; href: string; Icon: IconType; color: string }[] = [
    { name: "Audiomack", href: audiomack, Icon: SiAudiomack, color: "#FFA200" },
    { name: "Spotify", href: spotify, Icon: SiSpotify, color: "#1DB954" },
    { name: "YouTube", href: youtube, Icon: SiYoutube, color: "#FF0000" },
  ];

  return (
    <section className="container-x mt-32">
      <Reveal className="text-center">
        <p className="eyebrow">{site.name}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("streamTitle")}</h2>
        <p className="mx-auto mt-4 max-w-md text-muted">{t("streamText")}</p>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {platforms
          .filter((p) => p.href)
          .map(({ name, href, Icon, color }, i) => (
            <Reveal key={name} delay={i * 0.12}>
              <Tilt className="h-full">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col items-center gap-5 overflow-hidden rounded-3xl border border-line bg-card p-10 text-center transition duration-500 hover:border-transparent"
                  style={{ "--brand": color } as React.CSSProperties}
                >
                  <span className="absolute inset-0 -z-0 bg-[var(--brand)] opacity-0 transition duration-500 group-hover:opacity-[0.12]" />
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-[var(--brand)] text-white shadow-lg transition duration-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_var(--brand)]">
                    <Icon className="h-9 w-9" />
                  </span>
                  <span className="relative font-display text-2xl font-semibold">{name}</span>
                  <span className="relative inline-flex items-center gap-1 text-sm font-semibold text-muted transition group-hover:text-fg">
                    {t("openOn")} <FiArrowUpRight className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Tilt>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
