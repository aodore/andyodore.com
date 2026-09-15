import Link from "next/link";
import { Monogram } from "@/components/brand";
import { linkCues } from "@/lib/sound";

/** The monogram on case-study pages. Same mark as the home header, but this
    one is a link, so it gets a tooltip the decorative one does not need. */
export function HomeLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Go home"
      className={`group relative ${className ?? ""}`}
      {...linkCues}
    >
      <Monogram className="size-12 xl:size-16" />
      <span
        aria-hidden
        className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Go home
      </span>
    </Link>
  );
}
