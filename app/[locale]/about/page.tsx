import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/lib/site";
import { tr } from "@/lib/utils";
import { getAwardsOrDummy, getGallery, getSettings } from "@/lib/data";
import { EmptyState, SectionHeading } from "@/components/ui";
import { AwardCard } from "@/components/cards";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("about.title") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [settings, awards, gallery] = await Promise.all([
    getSettings(),
    getAwardsOrDummy(),
    getGallery(),
  ]);

  const bio = tr(settings?.bio, locale) || t("about.bio");
  // Photos uploaded in the admin come first, then the local photos
  const photos = [
    ...gallery.map((g) => ({ src: g.image_url, caption: tr(g.caption, locale) })),
    ...site.images.gallery.map((src) => ({ src, caption: "" })),
  ];

  return (
    <>
      {/* ---------- BIO ---------- */}
      <section className="container-x grid items-center gap-12 pt-12 md:grid-cols-2 md:pt-20">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={site.images.about}
              alt={site.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden aspect-[3/4] w-40 overflow-hidden rounded-2xl border-4 border-bg shadow-2xl sm:block">
            <Image
              src={site.images.aboutAlt}
              alt=""
              fill
              sizes="160px"
              className="object-cover object-top"
            />
          </div>
        </div>
        <div>
          <p className="eyebrow">{t("hero.s1Eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">
            {site.name}
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-fg/85">
            {bio.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AWARDS ---------- */}
      <section id="awards" className="container-x mt-24 scroll-mt-24">
        <SectionHeading title={t("about.awards")} />
        {awards.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {awards.map((a) => (
              <AwardCard key={a.id} award={a} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState text={t("about.noAwards")} />
        )}
      </section>

      {/* ---------- GALLERY ---------- */}
      <section className="container-x mt-24">
        <SectionHeading title={t("about.gallery")} />
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {photos.map((p, i) => (
            <figure key={p.src + i} className="break-inside-avoid overflow-hidden rounded-2xl">
              <Image
                src={p.src}
                alt={p.caption || `${site.name} ${i + 1}`}
                width={800}
                height={1000}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="h-auto w-full transition duration-500 hover:scale-105"
              />
              {p.caption && (
                <figcaption className="bg-card p-3 text-sm text-muted">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
