"use client";

import { changeExperience } from "@/lib/accent";
import { quietCues } from "@/lib/sound";

/** Header control that sends the visitor back to the entry to pick again.
    Same 32px hit target as the theme toggle; the 16px disc is the monogram
    ring color, so it follows the active accent. */
export function ExperienceToggle() {
  return (
    <button
      type="button"
      onClick={changeExperience}
      className="hover:bg-ink/8 group relative grid size-8 cursor-pointer place-items-center rounded-full transition-colors"
      {...quietCues}
    >
      <span
        aria-hidden
        className="size-4 rounded-full"
        style={{ background: "var(--monogram-ring)" }}
      />
      <span className="sr-only">Change experience</span>
      <span
        aria-hidden
        className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Change experience
      </span>
    </button>
  );
}
