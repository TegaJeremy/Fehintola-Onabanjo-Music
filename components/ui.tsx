import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FiArrowRight } from "react-icons/fi";

/** Big banner at the top of inner pages. */
export function PageBanner({
  title,
  subtitle,
  image,
  position = "object-top",
}: {
  title: string;
  subtitle?: string;
  image: string;
  position?: string;
}) {
  return (
    <section className="relative isolate -mt-16 flex min-h-[46vh] items-end overflow-hidden pt-16">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`-z-10 object-cover ${position}`}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/60 to-black/30" />
      <div className="container-x pb-12">
        <h1 className="font-display text-5xl font-semibold sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-lg text-fg/80">{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">
        {title}
        <span className="mt-3 block h-0.5 w-14 bg-gradient-to-r from-accent to-blue-soft" />
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-accent"
        >
          {linkLabel}
          <FiArrowRight className="transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
      {text}
    </p>
  );
}
