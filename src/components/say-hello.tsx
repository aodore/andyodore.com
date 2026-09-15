import { ArrowUpRightIcon } from "@/components/brand";
import { helloCues } from "@/lib/sound";

/** In every page header. The hover tint reads from --ink, so it follows the
    palette of whichever page it sits on. */
export function SayHello() {
  return (
    <a
      href="mailto:aodore@gmail.com"
      className="hover:bg-ink/8 flex h-8 items-center gap-1 rounded-full px-3 font-medium whitespace-nowrap transition-colors"
      {...helloCues}
    >
      {/* Geist sits high in its line box at this size, so the label
          needs a nudge to read as centered against the arrow. */}
      <span className="translate-y-[2px]">Say hello</span>
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}
