"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Monogram } from "@/components/brand";
import {
  ENTRY_LEAVE_EVENT,
  leaveHome,
  reopenEntry,
} from "@/lib/accent";
import { linkCues } from "@/lib/sound";

/** Same spring the intro seats use on the way in: under-damped, so the
    header mark lands with a small overshoot instead of creeping in. */
const SPRING = 118;
const DAMPING = 12;

/** Matches the intro's "1.6 sizes above the fold", plus the header padding. */
const PARK_SIZES = 1.6;
const PARK_PAD = 40;

/** The header mark on the home page. It drops in from the entry, then
    sits as the home link. The disc in the header is how you pick again. */
export function HomeMonogram() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const el: HTMLAnchorElement = node;

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

    window.addEventListener(ENTRY_LEAVE_EVENT, liftOff);

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
      window.removeEventListener(ENTRY_LEAVE_EVENT, liftOff);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/"
      aria-label="Home"
      className="home-monogram relative"
      {...linkCues}
    >
      <Monogram className="size-12 xl:size-16" />
    </Link>
  );
}
