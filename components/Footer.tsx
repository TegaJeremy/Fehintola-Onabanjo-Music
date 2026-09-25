import { getTranslations } from "next-intl/server";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { site, type Socials } from "@/lib/site";
import SocialLinks from "./SocialLinks";
import Logo from "./Logo";

export default async function Footer({
  socials,
  email,
  phones,
  logo,
}: {
  socials: Socials;
  email: string;
  phones: string[];
  logo: string;
}) {
  const t = await getTranslations();
  const year = new Date().getFullYear();
  const links = [
    ["/music", "nav.music"],
    ["/videos", "nav.videos"],
    ["/events", "nav.events"],
    ["/about", "nav.about"],
    ["/contact", "nav.contact"],
  ] as const;

  return (
    <footer className="relative mt-32 overflow-hidden bg-bg-soft">
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-accent to-blue-soft" />
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {/* brand */}
        <div className="space-y-5">
          <Logo size={44} src={logo} />
          <p className="max-w-xs text-sm text-muted">{t("hero.tagline")}</p>
          <SocialLinks socials={socials} />
        </div>

        {/* quick links */}
        <div>
          <h3 className="eyebrow mb-5">{t("footer.quickLinks")}</h3>
          <nav className="grid gap-3 text-sm">
            {links.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                className="w-fit text-fg/80 transition hover:translate-x-1 hover:text-accent"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* contact */}
        <div>
          <h3 className="eyebrow mb-5">{t("footer.contact")}</h3>
          <ul className="grid gap-4 text-sm text-fg/80">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 break-all hover:text-accent">
                  <FiMail className="mt-0.5 shrink-0 text-accent" /> {email}
                </a>
              </li>
            )}
            {phones.filter(Boolean).map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="flex items-start gap-3 hover:text-accent">
                  <FiPhone className="mt-0.5 shrink-0 text-accent" /> {p}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* giant outlined name */}
      <p
        aria-hidden
        className="text-outline pointer-events-none select-none whitespace-nowrap text-center font-display text-[13vw] font-bold leading-[0.8]"
      >
        {site.name}
      </p>

      <div className="relative border-t border-line py-6 text-center text-xs text-muted">
        © {year} {site.name}. {t("footer.rights")}
      </div>
    </footer>
  );
}
