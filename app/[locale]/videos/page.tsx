import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiYoutube } from "react-icons/si";
import { site } from "@/lib/site";
import { getSettings, getVideosOrDummy, resolveLinks } from "@/lib/data";
import { EmptyState, PageBanner } from "@/components/ui";
import { VideoCard } from "@/components/cards";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("videos.title") };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [videos, settings] = await Promise.all([getVideosOrDummy(), getSettings()]);
  const { youtube } = resolveLinks(settings);

  return (
    <>
      <PageBanner
        title={t("videos.title")}
        subtitle={t("videos.subtitle")}
        image={site.images.videos}
        position="object-[center_20%]"
      />
      <section className="container-x mt-12">
        {youtube && (
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mb-10 bg-red-600 text-white hover:bg-red-700"
          >
            <SiYoutube /> {t("videos.channel")}
          </a>
        )}
        {videos.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState text={t("videos.empty")} />
        )}
      </section>
    </>
  );
}
