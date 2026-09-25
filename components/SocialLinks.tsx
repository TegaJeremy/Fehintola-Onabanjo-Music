import type { IconType } from "react-icons";
import {
  SiApplemusic,
  SiAudiomack,
  SiFacebook,
  SiInstagram,
  SiSpotify,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FiMusic } from "react-icons/fi";
import type { SocialKey, Socials } from "@/lib/site";
import { cn } from "@/lib/utils";

export const SOCIALS: Record<SocialKey, { label: string; Icon: IconType }> = {
  instagram: { label: "Instagram", Icon: SiInstagram },
  facebook: { label: "Facebook", Icon: SiFacebook },
  tiktok: { label: "TikTok", Icon: SiTiktok },
  x: { label: "X (Twitter)", Icon: SiX },
  youtube: { label: "YouTube", Icon: SiYoutube },
  audiomack: { label: "Audiomack", Icon: SiAudiomack },
  spotify: { label: "Spotify", Icon: SiSpotify },
  appleMusic: { label: "Apple Music", Icon: SiApplemusic },
  boomplay: { label: "Boomplay", Icon: FiMusic },
  whatsapp: { label: "WhatsApp", Icon: SiWhatsapp },
};

/** WhatsApp can be a number (e.g. 2348012345678) or a full link. */
export function whatsappLink(value: string) {
  if (value.startsWith("http")) return value;
  return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
}

export default function SocialLinks({
  socials,
  className,
  size = "md",
}: {
  socials: Socials;
  className?: string;
  size?: "md" | "lg";
}) {
  const entries = (Object.keys(SOCIALS) as SocialKey[]).filter((k) =>
    socials[k]?.trim()
  );
  if (!entries.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {entries.map((key) => {
        const { label, Icon } = SOCIALS[key];
        const href =
          key === "whatsapp" ? whatsappLink(socials[key]) : socials[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={cn(
                "grid place-items-center rounded-full border border-line text-fg/80 transition hover:border-accent hover:bg-accent hover:text-accent-fg",
                size === "lg" ? "h-12 w-12" : "h-10 w-10"
              )}
            >
              <Icon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
