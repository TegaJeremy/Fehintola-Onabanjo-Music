import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { inter, playfair } from "@/lib/fonts";
import { site } from "@/lib/site";
import { getSettings, resolveSite } from "@/lib/data";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ClickEffects from "@/components/ClickEffects";
import { ScrollProgress } from "@/components/motion";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    images: [site.images.heroSlides[0]],
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const settings = await getSettings();
  const cfg = resolveSite(settings);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        {/* Enables scroll animations; if the page's JavaScript never starts,
            this removes them after 3s so nothing stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__reveal)document.documentElement.classList.remove('js')},3000);",
          }}
        />
        <NextIntlClientProvider>
          <ThemeProvider>
            <ScrollProgress />
            <CustomCursor />
            <ClickEffects />
            <Header logo={cfg.logo} />
            <main className="overflow-x-clip">{children}</main>
            <Footer
              socials={cfg.socials}
              email={cfg.email}
              phones={[cfg.phone, cfg.phone2]}
              logo={cfg.logo}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
