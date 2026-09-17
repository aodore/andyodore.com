"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Plays the Transitions.dev stagger once the first paint has landed, so
    the lines actually transition from their hidden state instead of
    appearing already shown. */
export function StaggerReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".t-stagger-line").forEach((item, i) => {
      item.style.setProperty("--stagger-i", String(i));
    });

    // Reused across Strict Mode remounts: if the first pass already landed
    // the lines, the second must not pull them back and play again.
    let shown = el.classList.contains("is-shown");
    let inner = 0;
    let outer = 0;
    let fallback = 0;

    const cancel = () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(fallback);
    };

    const show = () => {
      if (shown) return;
      shown = true;
      el.classList.add("is-shown");
    };

    const start = () => {
      if (shown) return;
      cancel();
      // Two frames so the hidden state paints first. A timeout covers tabs
      // where requestAnimationFrame never runs (background, some previews),
      // which would otherwise leave the page blank except the header.
      outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(show);
      });
      fallback = window.setTimeout(show, 80);
    };

    const hide = () => {
      cancel();
      shown = false;
      el.classList.remove("is-shown");
    };

    const doc = document.documentElement;
    let pending = doc.classList.contains("entry-pending");
    let revealed = doc.classList.contains("entry-revealed");
    let leaving = doc.classList.contains("entry-leaving");

    const gated = () => (pending && !revealed) || leaving;

    const sync = () => {
      const nextPending = doc.classList.contains("entry-pending");
      const nextRevealed = doc.classList.contains("entry-revealed");
      const nextLeaving = doc.classList.contains("entry-leaving");
      if (
        nextPending === pending &&
        nextRevealed === revealed &&
        nextLeaving === leaving
      ) {
        return;
      }
      pending = nextPending;
      revealed = nextRevealed;
      leaving = nextLeaving;
      if (gated()) hide();
      else start();
    };

    if (gated()) hide();
    else start();

    const observer = new MutationObserver(sync);
    observer.observe(doc, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      cancel();
    };
  }, []);

  return (
    <div ref={root} className={className ? `t-stagger ${className}` : "t-stagger"}>
      {children}
    </div>
  );
}
