"use client";

import { useEffect, useRef } from "react";
import { Monogram } from "@/components/brand";
import { leaveHome, reopenEntry } from "@/lib/accent";
import { quietCues } from "@/lib/sound";

/** Same spring the intro seats use on the way in: under-damped, so the
    header mark lands with a small overshoot instead of creeping in. */
const SPRING = 118;
const DAMPING = 12;

/** Matches the intro's "1.6 sizes above the fold", plus the header padding. */
const PARK_SIZES = 1.6;
const PARK_PAD = 40;

/** The header mark on the home page. Decorative until a choice is stored,
    then it is how you go back and pick again. */
export function HomeMonogram() {
  const ref = useRef<HTMLButtonElement>(null);
  const lift = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let y = 0;
    let vy = 0;
    let frame = 0;
    let last = 0;
    let landed = el.classList.contains("is-landed");
    let leaving = false;

    function parkY() {
      return -((el.offsetHeight || 64) * PARK_SIZES + PARK_PAD);
    }

    function park() {
      leaving = false;
      landed = false;
      cancelAnimationFrame(frame);
      el.classList.remove("is-landed", "is-leaving");
      y = parkY();
      vy = 0;
      el.style.translate = `0 ${y.toFixed(2)}px`;
    }

    function settle() {
      y = 0;
      vy = 0;
      leaving = false;
      landed = true;
      el.classList.add("is-landed");
      el.classList.remove("is-leaving");
      el.style.translate = "0 0";
    }

    function springTo(target: number, onRest: () => void, untilGone = false) {
      cancelAnimationFrame(frame);
      last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        vy += (target - y) * SPRING * dt;
        vy -= vy * DAMPING * dt;
        y += vy * dt;
        el.style.translate = `0 ${y.toFixed(2)}px`;
        if (untilGone && el.getBoundingClientRect().bottom < 0) {
          onRest();
          return;
        }
        if (Math.abs(y - target) > 0.2 || Math.abs(vy) > 4) {
          frame = requestAnimationFrame(tick);
          return;
        }
        onRest();
      };
      frame = requestAnimationFrame(tick);
    }

    function drop() {
      if (landed || leaving) return;
      landed = true;
      cancelAnimationFrame(frame);
      if (reduced) {
        settle();
        return;
      }
      if (Math.abs(y) < 1) {
        y = parkY();
        el.style.translate = `0 ${y.toFixed(2)}px`;
      }
      springTo(0, settle);
    }

    function exitMs() {
      const styles = getComputedStyle(document.documentElement);
      const dur = parseFloat(styles.getPropertyValue("--stagger-dur")) || 500;
      const gap = parseFloat(styles.getPropertyValue("--stagger-stagger")) || 40;
      const n = document.querySelectorAll("#site-shell .t-stagger-line").length;
      return dur + Math.max(0, n - 1) * gap;
    }

    function liftOff() {
      if (leaving) return;
      leaving = true;
      cancelAnimationFrame(frame);
      el.classList.add("is-leaving");
      el.classList.remove("is-landed");
      leaveHome();

      let liftDone = reduced;
      let staggerDone = reduced;
      const finish = () => {
        if (!liftDone || !staggerDone) return;
        park();
        reopenEntry();
      };

      if (!reduced) {
        window.setTimeout(() => {
          staggerDone = true;
          finish();
        }, exitMs());
        springTo(
          parkY(),
          () => {
            liftDone = true;
            finish();
          },
          true,
        );
        return;
      }

      park();
      reopenEntry();
    }

    lift.current = liftOff;

    const doc = document.documentElement;
    let pending = doc.classList.contains("entry-pending");
    let revealed = doc.classList.contains("entry-revealed");
    const waiting = pending && !revealed;

    if (waiting) park();
    else drop();

    const onClass = () => {
      const nextPending = doc.classList.contains("entry-pending");
      const nextRevealed = doc.classList.contains("entry-revealed");
      if (nextPending === pending && nextRevealed === revealed) return;
      const wasWaiting = pending && !revealed;
      pending = nextPending;
      revealed = nextRevealed;
      const nowWaiting = pending && !revealed;
      if (nowWaiting) park();
      else if (wasWaiting) drop();
    };

    const observer = new MutationObserver(onClass);
    observer.observe(doc, { attributes: true, attributeFilter: ["class"] });

    return () => {
      lift.current = null;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="home-monogram group relative cursor-pointer"
      aria-label="Change your experience"
      onClick={() => lift.current?.()}
      {...quietCues}
    >
      <Monogram className="size-12 xl:size-16" />
      <span
        aria-hidden
        className="bg-ink text-canvas pointer-events-none absolute top-1/2 left-full z-10 ml-3 -translate-y-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        Change your experience?
      </span>
    </button>
  );
}
