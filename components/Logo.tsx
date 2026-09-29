import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Logo image + name. Swap the image in public/logo.png (see lib/site.ts). */
export default function Logo({
  className,
  size,
  showName = true,
  src,
}: {
  className?: string;
  /** fixed size in px (default: 32px on phones, 36px on bigger screens) */
  size?: number;
  showName?: boolean;
  /** logo uploaded in the admin (falls back to lib/site.ts) */
  src?: string;
}) {
  return (
    <span className={cn("group inline-flex min-w-0 items-center gap-2 sm:gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || site.logo}
        alt={`${site.name} logo`}
        width={Math.round((size ?? 44) * 1.17)}
        height={size ?? 44}
        className={cn(
          "w-auto shrink-0 object-contain drop-shadow-sm transition duration-500 group-hover:scale-105",
          !size && "h-10 sm:h-12"
        )}
        style={size ? { height: size } : undefined}
      />
      {showName && (
        <span className="flex min-w-0 flex-col truncate font-display text-[13.5px] font-semibold leading-[1.15] tracking-wide sm:flex-row sm:gap-1.5 sm:text-xl sm:leading-none">
          <span>{site.shortName}</span>
          <span className="text-accent">Onabanjo</span>
        </span>
      )}
    </span>
  );
}
