"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/brand";

/** Past the hero, where scrolling back up starts to be a chore. */
const REVEAL_AT = 320;

export function BackToTop() {
  const [shown, setShown] = useState(false);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    function sync() {
      setShown(window.scrollY > REVEAL_AT);

      const footer = document.querySelector("footer");
      if (!footer) {
        setLift(0);
        return;
      }

      // Padding-top on the footer is the reserved landing strip. Measure the
      // content box so the control rises with that strip and rests in it,
      // instead of covering the copyright at full scroll.
      const rect = footer.getBoundingClientRect();
      const paddingTop = parseFloat(getComputedStyle(footer).paddingTop) || 0;
      const contentTop = rect.top + paddingTop;
      setLift(Math.max(0, window.innerHeight - contentTop));
    }

    // Runs once up front to catch a restored scroll position.
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  function toTop() {
    const gentle = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    window.scrollTo({ top: 0, behavior: gentle ? "smooth" : "auto" });
  }

  return (
    // The wrapper owns the entrance so the button keeps its own quicker hover
    // timing. inert is everything a hidden control needs: no pointer hits
    // mid-fade, no tab stop, and nothing announced while it's off screen.
    // The rise is motion-safe only; reduced motion still gets the fade.
    // The centering shift rides in the same translate as the rise, so both
    // stay on one property and interpolate together. bottom is set in style
    // so the lift above the footer can change every frame without fighting
    // the entrance transition.
    <div
      inert={!shown}
      className={`back-to-top fixed left-1/2 z-50 -translate-x-1/2 transition-[opacity,translate] duration-500 ease-out ${
        shown
          ? "translate-y-0 opacity-100"
          : "opacity-0 motion-safe:translate-y-20"
      }`}
      style={{
        bottom: `calc(var(--back-to-top-inset) + ${lift}px)`,
      }}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className="bg-ink text-canvas hover:bg-ink/85 group relative grid size-12 cursor-pointer place-items-center rounded-full transition-colors xl:size-16"
      >
        <ArrowUpIcon className="size-6 xl:size-8" />
        {/* Sits above the control so it stays on screen at the bottom of the
            page. aria-hidden because the button's label is already the name. */}
        <span
          aria-hidden
          className="bg-ink text-canvas pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Back to top
        </span>
      </button>
    </div>
  );
}
