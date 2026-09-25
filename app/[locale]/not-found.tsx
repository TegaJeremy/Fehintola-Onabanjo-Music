import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("nav");
  return (
    <section className="container-x grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-8xl text-accent">404</p>
        <Link href="/" className="btn-primary mt-8">
          {t("home")}
        </Link>
      </div>
    </section>
  );
}
