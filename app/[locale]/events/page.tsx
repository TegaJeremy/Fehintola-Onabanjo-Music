import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/lib/site";
import { getPastEvents, getUpcomingEventsOrDummy } from "@/lib/data";
import { EmptyState, PageBanner, SectionHeading } from "@/components/ui";
import { EventCard } from "@/components/cards";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return { title: t("events.title") };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [upcoming, past] = await Promise.all([
    getUpcomingEventsOrDummy(),
    getPastEvents(),
  ]);

  return (
    <>
      <PageBanner
        title={t("events.title")}
        subtitle={t("events.subtitle")}
        image={site.images.events}
        position="object-[center_25%]"
      />

      <section className="container-x mt-12">
        <SectionHeading title={t("events.upcoming")} />
        {upcoming.length ? (
          <div className="grid gap-6">
            {upcoming.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                locale={locale}
                ticketLabel={t("events.tickets")}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={t("events.empty")} />
        )}
      </section>

      {past.length > 0 && (
        <section className="container-x mt-20">
          <SectionHeading title={t("events.past")} />
          <div className="grid gap-6 lg:grid-cols-2">
            {past.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                locale={locale}
                ticketLabel={t("events.tickets")}
                past
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
