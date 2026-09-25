import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiAudiomack } from "react-icons/si";
import { site } from "@/lib/site";
import { getSettings, getSongsOrDummy, resolveLinks } from "@/lib/data";
import { EmptyState, PageBanner } from "@/components/ui";
import { SongCard } from "@/components/cards";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("music.title") };
}

export default async function MusicPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [songs, settings] = await Promise.all([getSongsOrDummy(), getSettings()]);
  const { audiomack } = resolveLinks(settings);

  return (
    <>
      <PageBanner
        title={t("music.title")}
        subtitle={t("music.subtitle")}
        image={site.images.music}
        position="object-[center_20%]"
      />
      <section className="container-x mt-12">
        {audiomack && (
          <a
            href={audiomack}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mb-10"
          >
            <SiAudiomack /> {t("music.profile")}
          </a>
        )}
        {songs.length ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {songs.map((s) => (
              <SongCard
                key={s.id}
                song={s}
                listenLabel={t("music.listen")}
                typeLabel={t(`music.${s.type}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={t("music.empty")} />
        )}
      </section>
    </>
  );
}
