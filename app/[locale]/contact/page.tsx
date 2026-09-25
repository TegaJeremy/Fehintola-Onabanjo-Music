import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FiMail, FiPhone } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";
import { site } from "@/lib/site";
import { getSettings, resolveSite } from "@/lib/data";
import SocialLinks, { whatsappLink } from "@/components/SocialLinks";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("contact.title") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const settings = await getSettings();
  const { email, phone, phone2, socials } = resolveSite(settings);

  const rows = [
    email && { Icon: FiMail, label: t("contact.email"), value: email, href: `mailto:${email}` },
    phone && { Icon: FiPhone, label: t("contact.phone"), value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    phone2 && { Icon: FiPhone, label: t("contact.phone"), value: phone2, href: `tel:${phone2.replace(/\s/g, "")}` },
    socials.whatsapp && {
      Icon: SiWhatsapp,
      label: t("contact.whatsapp"),
      value: socials.whatsapp.startsWith("http") ? "WhatsApp" : socials.whatsapp,
      href: whatsappLink(socials.whatsapp),
    },
  ].filter(Boolean) as { Icon: typeof FiMail; label: string; value: string; href: string }[];

  return (
    <section className="container-x grid gap-12 pt-12 md:grid-cols-2 md:items-center md:pt-20">
      <div>
        <p className="eyebrow">{t("home.ctaTitle")}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">
          {t("contact.title")}
        </h1>
        <p className="mt-4 text-lg text-muted">{t("contact.subtitle")}</p>

        <ul className="mt-10 space-y-4">
          {rows.length ? (
            rows.map(({ Icon, label, value, href }) => (
              <li key={label + value}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="card flex items-center gap-4 p-5 transition hover:border-accent"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-widest text-muted">
                      {label}
                    </span>
                    <span className="text-lg font-medium break-all">{value}</span>
                  </span>
                </a>
              </li>
            ))
          ) : (
            <li className="text-muted">{t("contact.notSet")}</li>
          )}
        </ul>

        <h2 className="mt-12 font-display text-2xl">{t("contact.follow")}</h2>
        <SocialLinks socials={socials} size="lg" className="mt-4" />
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
        <Image
          src={site.images.contact}
          alt={site.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-[center_30%]"
        />
      </div>
    </section>
  );
}
